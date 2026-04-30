/**
 * RAG Pipeline — TourismCo.
 * Step-by-step as per PRD §9:
 *   1. Extract constraints from user query
 *   2. Search Vector DB (local KB / FAISS-lite keyword scoring)
 *   3. Web Search API (DuckDuckGo no-key API)
 *   4. Call Gemini API for reasoning
 *   5. Merge all contexts
 *   6. Return structured response
 */

import { processQuery } from './aiEngine.js';
import { callGemini }   from './geminiService.js';
import { getHiddenGems, formatGemsForPrompt } from '../config/hiddenGems.js';

// ─── Step 1: Extract constraints from natural language ────────────────────────
export const extractConstraints = (query) => {
  const q = query.toLowerCase();

  // Destination list — SORTED longest-first so 'agra' never matches inside 'prayagraj'
  const destMap = [
    { alias: 'taj mahal',  canon: 'Agra' },       // multi-word first
    { alias: 'prayagraj',  canon: 'Prayagraj' },
    { alias: 'pryagraj',   canon: 'Prayagraj' },    // typo
    { alias: 'allahabad',  canon: 'Prayagraj' },
    { alias: 'vrindavan',  canon: 'Mathura' },
    { alias: 'varanasi',   canon: 'Varanasi' },
    { alias: 'varansi',    canon: 'Varanasi' },    // common typo
    { alias: 'banaras',    canon: 'Varanasi' },
    { alias: 'kashi',      canon: 'Varanasi' },
    { alias: 'lucknow',    canon: 'Lucknow' },
    { alias: 'mathura',    canon: 'Mathura' },
    { alias: 'krishna',    canon: 'Mathura' },
    { alias: 'ayodhya',    canon: 'Ayodhya' },
    { alias: 'sarnath',    canon: 'Sarnath' },
    { alias: 'sangam',     canon: 'Prayagraj' },
    { alias: 'nawab',      canon: 'Lucknow' },
    { alias: 'agra',       canon: 'Agra' },        // short aliases last
    { alias: 'taj',        canon: 'Agra' },
    { alias: 'ram',        canon: 'Ayodhya' },
  ];

  let destination = null;
  const allDestinations = [];
  for (const { alias, canon } of destMap) {
    const matched = alias.includes(' ')
      ? q.includes(alias)
      : new RegExp(`\\b${alias}\\b`).test(q);
    if (matched) {
      if (!destination) destination = canon;
      if (!allDestinations.includes(canon)) allDestinations.push(canon);
    }
  }

  // Budget — robust scanning to avoid matching '4' as budget and missing '40,000'
  let budget = null;
  const budgetMatches = [...query.matchAll(/(?:₹|rs\.?|rupees?|under|below|within|for|budget\s*[:=]?\s*)?([\d,]+)\s*(k\b|thousand|rs\b|rupees?)?/gi)];
  for (const m of budgetMatches) {
    const rawVal = m[1];
    const suffix = m[2]?.toLowerCase() || '';
    const fullMatch = m[0].toLowerCase();
    
    // Check if it's genuinely a budget
    const hasPrefix = /(₹|rs|rupee|under|below|within|budget)/.test(fullMatch);
    const hasSuffix = suffix.startsWith('k') || suffix.startsWith('t') || suffix.startsWith('rs') || suffix.startsWith('rupee');
    
    if (hasPrefix || hasSuffix) {
      budget = parseInt(rawVal.replace(/,/g, ''));
      if (suffix.startsWith('k') || suffix.startsWith('t')) budget *= 1000;
      break;
    }
  }

  // Days — handle typos like 'dys', 'dy', 'dayd'
  const daysMatch = query.match(/(\d+)\s*(?:days?|nights?|dys?|dy|dayd)/i);
  const days = daysMatch ? parseInt(daysMatch[1]) : null;

  // Travelers — handle "4 people", "for 4", "family of 4", etc.
  const travelersMatch =
    query.match(/(?:family|group)\s+of\s+(\d+)/i) ||
    query.match(/(\d+)\s*(?:persons?|peoples?|travelers?|travellers?|adults?|pax|members?|friends?|kids?)/i) ||
    query.match(/(?:for|with|of)\s+(\d+)\s*(?:of\s+us|people|persons)?/i);
  const travelers = travelersMatch ? parseInt(travelersMatch[1]) : 1;

  const isSolo  = /\b(solo|alone|single|myself|by myself)\b/.test(q);
  const isGroup = /\b(group|family|friends|couple|partner|spouse|honeymoon)\b/.test(q);

  const prefs = {
    vegetarian: /\b(veg|vegetarian)\b/.test(q),
    adventure:  /\b(adventure|trek|hike|sport|outdoor)\b/.test(q),
    spiritual:  /\b(spiritual|temple|pilgrimage|holy|divine|ghat|mandir|darshan)\b/.test(q),
    heritage:   /\b(heritage|history|monument|fort|museum|mughal|historical|culture|cultural)\b/.test(q),
    food:       /\b(food|eat|cuisine|restaurant|kebab|biryani|street food|local food|favourate|favourite food|taste|tasty)\b/.test(q),
    luxury:     /\b(luxury|premium|5 star|five star|deluxe|upscale)\b/.test(q),
    budget:     /\b(budget|cheap|affordable|backpack|economical|low cost)\b/.test(q),
  };

  return {
    destination,
    allDestinations,
    budget,
    days,
    travelers,
    travelType: isSolo ? 'solo' : isGroup ? 'group' : 'couple',
    prefs,
  };
};

// ─── Step 2: Vector DB search (keyword scoring against local KB) ──────────────
export const searchVectorDB = (constraints) => {
  const { destination, allDestinations = [], budget, days, travelers } = constraints;
  const primaryDest = destination || allDestinations[0] || null;

  const queryStr = [
    primaryDest ? `Plan trip to ${primaryDest}` : 'Plan UP trip',
    allDestinations.length > 1
      ? `also visiting ${allDestinations.slice(1).join(' and ')}` : '',
    budget    ? `under ₹${budget}` : '',
    days      ? `for ${days} days`  : '',
    travelers > 1 ? `for ${travelers} people` : '',
  ].filter(Boolean).join(' ');

  const result = processQuery(queryStr);

  return {
    found: !!result.plan,
    plan: result.plan,
    destination: result.destination,
    suggestions: result.suggestions,
    source: 'local_kb',
  };
};

// ─── Step 3: Web search (DuckDuckGo Instant Answer API — no key needed) ───────
export const fetchWebSearch = async (constraints) => {
  const { destination } = constraints;
  if (!destination) return null;

  const searchQ = `${destination} Uttar Pradesh travel tips tourist places`;
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(searchQ)}&format=json&no_html=1&skip_disambig=1`;
    const res  = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      abstract:      data.Abstract || null,
      relatedTopics: (data.RelatedTopics || []).slice(0, 3).map(t => t.Text).filter(Boolean),
      source:        'duckduckgo',
    };
  } catch {
    return null;  // web search is optional
  }
};

// ─── Step 4 + 5: Build combined context & call Gemini ─────────────────────────
export const runRAGPipeline = async ({ userQuery, conversationHistory = [] }) => {
  const pipelineSteps = [];

  // Step 1
  pipelineSteps.push({ step: 'extract_constraints', status: 'done' });
  const constraints = extractConstraints(userQuery);

  // Step 2
  pipelineSteps.push({ step: 'vector_db', status: 'done' });
  const localResult = searchVectorDB(constraints);

  // Step 3
  pipelineSteps.push({ step: 'web_search', status: 'running' });
  const webResult = await fetchWebSearch(constraints);
  pipelineSteps[pipelineSteps.length - 1].status = 'done';

  // Hidden gems for this destination
  const hiddenGems = getHiddenGems(constraints.destination);
  const gemsPrompt = formatGemsForPrompt(constraints.destination);

  // RAG context passed to Gemini
  const ragContext = {
    constraints,
    localPlan:       localResult.plan,
    localDestination: localResult.destination,
    allDestinations:  constraints.allDestinations,
    webSnippets:     webResult,
    hiddenGems,
    gemsPrompt,
    dataSource: 'Ministry of Tourism, Govt. of India + UP Tourism KB + Local Community Data',
  };

  // Step 4
  pipelineSteps.push({ step: 'gemini_reasoning', status: 'running' });
  const geminiResult = await callGemini({ userQuery, ragContext, conversationHistory });
  pipelineSteps[pipelineSteps.length - 1].status = 'done';

  // Step 5
  pipelineSteps.push({ step: 'combine_context', status: 'done' });
  const itineraries = buildThreeTierItineraries(localResult.plan, constraints);
  const links       = generateBookingLinks(constraints.destination || 'Uttar Pradesh');

  return {
    success:      true,
    query:        userQuery,
    constraints,
    reply:        geminiResult.text,
    thinking:     geminiResult.thinking,
    aiSource:     geminiResult.source,
    itineraries,
    plan:         localResult.plan,
    links,
    suggestions:  localResult.suggestions,
    pipeline:     pipelineSteps,
    webContext:   webResult,
    hiddenGems,
  };
};

// ─── Booking Link Generator ───────────────────────────────────────────────────
const generateBookingLinks = (destination = 'Uttar Pradesh') => {
  const enc = encodeURIComponent(destination);
  return {
    hotels:     `https://www.booking.com/search.html?ss=${enc}`,
    flights:    `https://www.skyscanner.co.in`,
    trains:     `https://www.irctc.co.in/nget/train-search`,
    cabs:       `https://www.uber.com/global/en/cities/`,
    activities: `https://www.tripadvisor.in/Search?q=${enc}+tourism`,
  };
};

// ─── Per-destination default attraction spots ─────────────────────────────────
const DEST_SPOTS = {
  Varanasi:  ['Dashashwamedh Ghat','Kashi Vishwanath Temple','Manikarnika Ghat','Sarnath','Assi Ghat','Ramnagar Fort','Banaras Hindu University','Sankat Mochan Temple'],
  Agra:      ['Taj Mahal','Agra Fort','Fatehpur Sikri','Mehtab Bagh','Itimad-ud-Daulah','Sikandra','Mariam Tomb','Akbar Tomb'],
  Lucknow:   ['Bara Imambara','Chhota Imambara','Rumi Darwaza','British Residency','Hazratganj Market','Nawab Wajid Ali Shah Zoo','Ambedkar Park','1090 Chauraha'],
  Mathura:   ['Krishna Janmabhoomi','Vrindavan Temples','Govardhan Hill','Radha Kund','Banke Bihari Temple','ISKCON Vrindavan','Prem Mandir','Kusum Sarovar'],
  Prayagraj: ['Triveni Sangam','Allahabad Fort','Anand Bhavan','Khusro Bagh','Hanuman Temple','Minto Park','All Saints Cathedral','Swaraj Bhavan'],
  Ayodhya:   ['Ram Janmabhoomi','Hanuman Garhi','Kanak Bhawan','Dashrath Mahal','Nageshwarnath Temple','Ram Ki Paidi Ghat','Tulsi Smarak','Mani Parbat'],
  Sarnath:   ['Dhamek Stupa','Mulagandhakuti Vihara','Sarnath Museum','Ashoka Pillar','Chaukhandi Stupa','Tibetan Temple','Japanese Temple','Thai Temple'],
};

// ─── Build 3-tier itineraries — ALWAYS returns a result ──────────────────────
const buildThreeTierItineraries = (plan, constraints) => {
  const allDests  = constraints?.allDestinations?.length > 0 ? constraints.allDestinations : [plan?.destination || constraints?.destination || 'Uttar Pradesh'];
  const destCount = allDests.length;
  
  const numDays   = Math.max(plan?.days || constraints?.days || 3, 1);   // never 0
  const budget    = Math.max(plan?.totalBudget || constraints?.budget || 15000, 500); // never 0
  const travelers = Math.max(constraints?.travelers || 1, 1);

  // Helper to safely get spots for a destination
  const getRawSpots = (d) => {
    return (plan?.destination === d && plan?.topAttractions?.length > 0)
      ? plan.topAttractions.map(s => s.name || s)
      : (DEST_SPOTS[d] || [
          `${d} main attraction`, `${d} heritage site`,
          `${d} local market`,   `${d} temple`,
          `${d} viewpoint`,      `${d} museum`,
        ]);
  };

  const makeDays = (multiplier) => {
    // Days per city logic
    const daysPerCity = allDests.map((_, i) => Math.max(1, Math.round(numDays / destCount) + (i === 0 && numDays % destCount ? 1 : 0)));
    let dayIndex = 0;
    
    return Array.from({ length: Math.min(numDays, 7) }, (_, i) => {
      // Find which city this day belongs to
      let currentCityIdx = 0;
      let accumDays = 0;
      for (let c = 0; c < daysPerCity.length; c++) {
        accumDays += daysPerCity[c];
        if (i < accumDays) {
          currentCityIdx = c;
          break;
        }
      }
      
      const dest = allDests[currentCityIdx];
      const destSpots = getRawSpots(dest);
      // Ensure we rotate through spots properly for this city
      const cityDayIdx = i - (accumDays - daysPerCity[currentCityIdx]);
      
      const morning   = destSpots[cityDayIdx * 2]       || destSpots[cityDayIdx % destSpots.length];
      const afternoon = destSpots[cityDayIdx * 2 + 1]   || destSpots[(cityDayIdx + 1) % destSpots.length];
      
      return {
        day: i + 1,
        title: i === 0 ? `Arrival & ${dest} Welcome` : i === numDays - 1 ? `Last Day in ${dest} & Departure` : `Day ${i + 1} — Exploring ${dest}`,
        schedule: [
          { time: '7:00 AM',  label: 'Morning',  places: [morning] },
          { time: '12:00 PM', label: 'Afternoon', places: [afternoon] },
          { time: '6:30 PM',  label: 'Evening',   places: [i === 0 ? 'Hotel check-in & rest' : 'Local market & street food'] },
        ],
        estimatedCost: Math.round((budget * multiplier) / numDays),
      };
    });
  };

  const makeLinks = () => ({
    hotels:  `https://www.booking.com/search.html?ss=${encodeURIComponent(allDests[0])}`,
    flights: `https://www.skyscanner.co.in`,
    trains:  `https://www.irctc.co.in/nget/train-search`,
  });

  const makeBreakdown = (m) => ({
    accommodation: Math.round(budget * m * 0.28),
    food:          Math.round(budget * m * 0.22),
    transport:     Math.round(budget * m * 0.20),
    activities:    Math.round(budget * m * 0.15),
    misc:          Math.round(budget * m * 0.15),
  });

  return {
    budgetPlan: {
      type: 'budget', label: 'Budget Plan', icon: '🎒', color: '#10B981',
      totalCost:  Math.round(budget * 0.65),
      perDay:     Math.round((budget * 0.65) / numDays),
      perPerson:  Math.round((budget * 0.65) / travelers),
      stay:       'Hostel / Budget guesthouse (₹400–800/night)',
      transport:  'Train + e-rickshaw + local bus',
      highlights: ['Street food & dhabas', 'Free / low-cost sightseeing', 'Shared local transport'],
      days:          makeDays(0.65),
      costBreakdown: makeBreakdown(0.65),
      bookingLinks:  makeLinks(),
    },
    balancedPlan: {
      type: 'balanced', label: 'Balanced Plan', icon: '⚖️', color: '#4F9CF9',
      totalCost:  Math.round(budget),
      perDay:     Math.round(budget / numDays),
      perPerson:  Math.round(budget / travelers),
      stay:       '3-star hotel (₹1,500–3,000/night)',
      transport:  'Train + Ola/Uber cab',
      highlights: ['Restaurant meals', 'Guided monument tours', 'Key attractions entry'],
      days:          makeDays(1.0),
      costBreakdown: makeBreakdown(1.0),
      bookingLinks:  makeLinks(),
    },
    premiumPlan: {
      type: 'premium', label: 'Premium Experience', icon: '👑', color: '#F59E0B',
      totalCost:  Math.round(budget * 1.65),
      perDay:     Math.round((budget * 1.65) / numDays),
      perPerson:  Math.round((budget * 1.65) / travelers),
      stay:       'Heritage / Luxury hotel (₹5,000–15,000/night)',
      transport:  'Flight + private car',
      highlights: ['Fine dining & rooftop restaurants', 'Private guided tours', 'Exclusive sunset experiences'],
      days:          makeDays(1.65),
      costBreakdown: makeBreakdown(1.65),
      bookingLinks:  makeLinks(),
    },
  };
};
