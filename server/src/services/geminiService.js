/**
 * Gemini AI Service — TourismCo.
 * Full semantic reasoning using Google Gemini 1.5 Flash.
 * Reads ALL user constraints: destinations, budget, days, people, food prefs, travel style.
 */

import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// ─── Master System Prompt ─────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are TourismCo. AI — an expert travel planner specializing in Uttar Pradesh, India.

CRITICAL RULES — ALWAYS FOLLOW:
1. READ THE FULL USER QUERY. Never ignore any detail the user mentions.
2. If user mentions MULTIPLE cities (e.g. "Varanasi and Prayagraj"), plan for ALL of them.
3. Use the EXACT budget the user states. Never substitute a different amount.
4. Use the EXACT number of days, people, and preferences mentioned.
5. If user says "vegetarian" — never suggest non-veg food.
6. If user says "family" or N members — plan for that group size.
7. If user asks for "hidden gems" or "local food" — always include them prominently.
8. If user asks for "heritage" — focus on forts, temples, monuments, museums.

CRITICAL INSTRUCTION: You MUST start every response with a visible thinking process enclosed in <think> tags.
Analyze the user's constraints, state what you understand about their trip (destinations, days, budget, people, preferences), outline your plan, and then close the </think> tag before providing the final response.

RESPONSE FORMAT — ALWAYS follow this structure:
<think>
Reading query: [User's raw query]
Understanding constraints: [List destinations, budget, days, group size, preferences]
Plan: [Briefly outline the itinerary structure]
</think>

Start with a brief warm summary line that mentions: all destinations, days, budget, group size.
Then give a day-wise itinerary (Day 1, Day 2, etc.) with morning/afternoon/evening slots.
For each day, mention specific named places, not generic descriptions.
Include at least 2 "🔮 Hidden Gem" spots per destination (places tourists miss).
Include at least 2 "🍽️ Local Food" recommendations per destination.
End with a quick cost breakdown and 3 booking tips.

DESTINATIONS YOU KNOW DEEPLY:
- Varanasi (also Banaras/Kashi): Ghats, Kashi Vishwanath, Sarnath, Dashashwamedh aarti, Manikarnika, Assi Ghat, street food (tamatar chaat, kachori, lassi, malaiyyo)
- Agra: Taj Mahal, Agra Fort, Fatehpur Sikri, Mehtab Bagh, Chini Ka Rauza (hidden gem), petha sweets, bedai-sabzi breakfast
- Lucknow: Bara Imambara, Rumi Darwaza, Hazratganj, Tunday Kababi, galouti kebab, Wahid Biryani, Safed Baradari (hidden gem)
- Mathura/Vrindavan: Krishna Janmabhoomi, Banke Bihari, Govardhan, Prem Mandir, dubki wale aloo, Brijwasi peda
- Prayagraj: Triveni Sangam, Allahabad Fort, Akshayavat (hidden gem inside fort), Anand Bhavan, El Chico restaurant, Katra Bazaar malai paan
- Ayodhya: Ram Mandir, Hanuman Garhi, Ram Ki Paidi, Nageshwarnath Temple (hidden gem), Saryu ghat kulhad chai

BUDGET INTELLIGENCE:
- Under ₹10,000: hostels, dhabas, trains, shared autos
- ₹10,000–30,000: budget hotels, mix of restaurants and street food, AC sleeper trains
- ₹30,000–60,000: 3-star hotels, guided tours, Ola/Uber cabs
- ₹60,000+: heritage hotels, private cars, fine dining

Always respond in a warm, expert, helpful tone. Use emojis sparingly for section headers only.
Keep responses detailed but scannable. Use bullet points for places and food.`;

// ─── Build user message with full context ────────────────────────────────────
const buildUserMessage = (userQuery, ragContext) => {
  const c = ragContext?.constraints || {};

  const contextLines = [
    `USER QUERY: "${userQuery}"`,
    '',
    '--- EXTRACTED CONSTRAINTS ---',
    c.allDestinations?.length > 0
      ? `Destinations: ${c.allDestinations.join(', ')}`
      : c.destination ? `Destination: ${c.destination}` : 'Destination: Not specified',
    c.budget   ? `Budget: ₹${c.budget.toLocaleString('en-IN')} total` : 'Budget: Not specified (use ₹15,000 as default)',
    c.days     ? `Duration: ${c.days} days` : 'Duration: Not specified (use 3 days as default)',
    c.travelers > 1 ? `Group: ${c.travelers} people` : 'Group: 1 person',
    `Travel type: ${c.travelType || 'not specified'}`,
    c.prefs?.vegetarian ? '✅ Vegetarian food only' : '',
    c.prefs?.spiritual  ? '✅ Spiritual / temple focus' : '',
    c.prefs?.heritage   ? '✅ Heritage / historical sites focus' : '',
    c.prefs?.adventure  ? '✅ Adventure / outdoor activities' : '',
    c.prefs?.food       ? '✅ Local food & culinary experiences' : '',
    c.prefs?.luxury     ? '✅ Luxury / premium experience' : '',
    c.prefs?.budget     ? '✅ Budget / economical travel' : '',
  ].filter(Boolean).join('\n');

  const gemsSection = ragContext?.gemsPrompt || '';

  const webSection = ragContext?.webSnippets?.abstract
    ? `\n--- LIVE WEB DATA ---\n${ragContext.webSnippets.abstract}\n`
    : '';

  return `${contextLines}${webSection}${gemsSection}

TASK: Generate a comprehensive, detailed travel plan that addresses EVERY constraint above.
If multiple destinations are listed, split days between them logically.
The response must feel personalized to THIS specific query, not generic.`;
};

// ─── Main Gemini API call ─────────────────────────────────────────────────────
export const callGemini = async ({ userQuery, ragContext, conversationHistory = [] }) => {
  // Always try Gemini first — even without key we show intelligent fallback
  if (!GEMINI_API_KEY) {
    console.warn('[Gemini] No API key — using smart fallback');
    return buildSmartFallback(userQuery, ragContext);
  }

  const userMessage = buildUserMessage(userQuery, ragContext);

  // Build conversation history (last 6 turns for context)
  const historyMessages = conversationHistory.slice(-6).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const payload = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [
      ...historyMessages,
      { role: 'user', parts: [{ text: userMessage }] },
    ],
    generationConfig: {
      temperature:      0.75,
      topK:             40,
      topP:             0.95,
      maxOutputTokens:  3072,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  };

  try {
    console.log('[Gemini] Calling API for query:', userQuery.slice(0, 80));
    const res = await fetch(GEMINI_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
      signal:  AbortSignal.timeout(20000),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[Gemini] API HTTP error:', res.status, errText.slice(0, 200));
      return buildSmartFallback(userQuery, ragContext);
    }

    const data = await res.json();

    // Log any safety blocks
    if (data?.candidates?.[0]?.finishReason === 'SAFETY') {
      console.warn('[Gemini] Safety block triggered');
      return buildSmartFallback(userQuery, ragContext);
    }

    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text || text.trim().length < 20) {
      console.warn('[Gemini] Empty/short response received');
      return buildSmartFallback(userQuery, ragContext);
    }

    let thinking = null;
    const thinkMatch = text.match(/<think>([\s\S]*?)<\/think>/);
    if (thinkMatch) {
      thinking = thinkMatch[1].trim();
      text = text.replace(/<think>[\s\S]*?<\/think>/, '').trim();
    }

    console.log('[Gemini] ✅ Response received, length:', text.length);
    return { text, thinking, source: 'gemini', model: 'gemini-1.5-flash' };

  } catch (err) {
    console.error('[Gemini] Request failed:', err.message);
    return buildSmartFallback(userQuery, ragContext);
  }
};

// ─── Smart Fallback — reads ALL constraints, never hardcodes ─────────────────
const buildSmartFallback = (userQuery, ragContext) => {
  const c    = ragContext?.constraints || {};
  const plan = ragContext?.localPlan;
  const gems = ragContext?.hiddenGems;

  const dests    = c.allDestinations?.length > 0 ? c.allDestinations : [c.destination || 'Uttar Pradesh'];
  const days     = c.days     || plan?.days     || 3;
  const budget   = c.budget   || plan?.totalBudget || 15000;
  const travelers= c.travelers || 1;
  const isVeg    = c.prefs?.vegetarian;
  const isHeritage = c.prefs?.heritage;
  const isFood   = c.prefs?.food;
  const multiCity = dests.length > 1;

  // Day split for multi-city
  const daysPerCity = multiCity
    ? dests.map((_, i) => Math.max(1, Math.round(days / dests.length) + (i === 0 && days % dests.length ? 1 : 0)))
    : [days];

  // Spot databases
  const spots = {
    Varanasi:  ['Dashashwamedh Ghat','Kashi Vishwanath Temple','Manikarnika Ghat','Assi Ghat','Sarnath','Ramnagar Fort'],
    Prayagraj: ['Triveni Sangam','Allahabad Fort','Anand Bhavan','Khusro Bagh','Akshayavat (inside fort)','Minto Park'],
    Agra:      ['Taj Mahal','Agra Fort','Fatehpur Sikri','Mehtab Bagh','Chini Ka Rauza'],
    Lucknow:   ['Bara Imambara','Rumi Darwaza','Chhota Imambara','Hazratganj','Chattar Manzil'],
    Mathura:   ['Krishna Janmabhoomi','Banke Bihari Temple','Prem Mandir','Govardhan Hill','ISKCON Vrindavan'],
    Ayodhya:   ['Ram Janmabhoomi','Hanuman Garhi','Ram Ki Paidi','Kanak Bhawan','Nageshwarnath Temple'],
    Sarnath:   ['Dhamek Stupa','Sarnath Museum','Ashoka Pillar','Mulagandhakuti Vihara'],
  };
  const vegFood = {
    Varanasi:  ['Kashi Chat Bhandar (tamatar chaat)','Vishwanath Gali Jalebi-Kachori (6-9AM)','Sri Rajbandhu Lassi in kulhad','Malaiyyo dessert (winter)'],
    Prayagraj: ['El Chico Restaurant (tehri)','Bade Hanuman Prasad stall (puri-halwa)','Singh Brothers Chaat (Lukerganj)','Malai Paan at Katra Bazaar'],
    Agra:      ['Devilal Petha (Noori Gate)','Shankar Sweets bedai-puri breakfast','Joney\'s Place banana shake','Pinch of Spice (veg thali)'],
    Lucknow:   ['Shukla Chatth Wale (Aminabad chaat)','Prakash Kulfi (Hazratganj)','Vaishali Restaurant (veg)','Royal Café (heritage veg)'],
    Mathura:   ['Brijwasi Sweets peda','Dubki wale aloo (7-11AM only)','Vrindavan gali chilla','Radha Bihari Sweets'],
    Ayodhya:   ['Ghanshyam Halwai mawa kachori','Saryu Ghat kulhad chai','Ram Ki Paidi prasad','Sugar Pan sweets'],
  };
  const hiddenSpots = {
    Varanasi:  ['🔮 Lalita Ghat & Dutch Cemetery (zero crowds)','🔮 Bharatmata Temple (marble relief map, no idol)','🔮 Chet Singh Ghat at night (secret aarti view)'],
    Prayagraj: ['🔮 Akshayavat & Patalpuri (underground temple inside Allahabad Fort)','🔮 Minto Park boat (₹50 vs ₹500 at Sangam)','🔮 Chhatnag Yamuna bank (river dolphins)'],
    Agra:      ['🔮 Chini Ka Rauza (Persian tile tomb, 1km from Taj, almost empty)','🔮 Ram Bagh — oldest Mughal garden in India (1508)','🔮 Taj Nature Walk (peacocks, free of tourists)'],
    Lucknow:   ['🔮 Safed Baradari (white marble pavilion, 15th century, deserted)','🔮 Husainabad Clock Tower at night with local chai','🔮 Lohia Park evening fountain show (locals only)'],
    Mathura:   ['🔮 Vishram Ghat at 4 AM — boat ride before crowds','🔮 Dauji Temple, Baldeo (25km, locals pilgrimage)','🔮 Kans Qila ruins on Yamuna bank'],
    Ayodhya:   ['🔮 Swarg Dwar Ghat (sacred cremation site, no tourists)','🔮 Treta Ka Thakur Temple — idol made from 1000yr old coal','🔮 Nageshwarnath — Ayodhya\'s oldest temple, built by Kush'],
  };

  // Build thinking chain
  const prefs = [];
  if (isVeg) prefs.push('vegetarian food');
  if (isHeritage) prefs.push('heritage & historical sites');
  if (isFood) prefs.push('local food experiences');
  if (c.prefs?.spiritual) prefs.push('spiritual & temple visits');
  if (c.prefs?.adventure) prefs.push('adventure activities');
  if (c.prefs?.luxury) prefs.push('luxury experience');

  const thinking = [
    `Reading query: "${userQuery}"`,
    ``,
    `Understanding constraints:`,
    `• Destinations: ${dests.join(', ')}`,
    `• Duration: ${days} days`,
    `• Budget: ₹${budget.toLocaleString('en-IN')} total`,
    `• Group: ${travelers} ${travelers === 1 ? 'person' : 'people'} (${c.travelType || 'not specified'})`,
    prefs.length > 0 ? `• Preferences: ${prefs.join(', ')}` : '',
    ``,
    `Plan:`,
    multiCity ? `• Split ${days} days across ${dests.length} cities: ${dests.map((d,i) => `${d} (${daysPerCity[i]}d)`).join(', ')}` : `• Full ${days} days in ${dests[0]}`,
    `• Budget per person: ~₹${Math.round(budget / travelers).toLocaleString('en-IN')}`,
    `• Include hidden gems and local food spots for each city`,
    `• Generate 3 itinerary tiers: Budget, Balanced, Premium`,
  ].filter(Boolean).join('\n');

  let reply = `✅ Perfect! Here's your **${days}-day trip plan** covering **${dests.join(' + ')}** for **${travelers} ${travelers === 1 ? 'person' : 'people'}** within **₹${budget.toLocaleString('en-IN')}** ${isVeg ? '(vegetarian)' : ''} ${isHeritage ? '| Heritage focus' : ''}\n\n`;

  let dayCount = 1;
  dests.forEach((dest, di) => {
    const destDays = daysPerCity[di];
    const destSpots = spots[dest] || [`${dest} main temple`, `${dest} fort`, `${dest} market`];
    const destFood  = (isVeg || true) ? (vegFood[dest] || [`Local ${dest} thali`]) : (vegFood[dest] || []);
    const destHidden = hiddenSpots[dest] || [];

    reply += `---\n## 📍 ${dest} (${destDays} ${destDays === 1 ? 'day' : 'days'})\n\n`;

    for (let d = 0; d < destDays; d++) {
      const isFirstDay = d === 0 && di === 0;
      const isLastDay  = d === destDays - 1 && di === dests.length - 1;
      reply += `**Day ${dayCount}${isFirstDay ? ' — Arrival' : isLastDay ? ' — Departure' : ''}**\n`;
      reply += `• 🌅 Morning: ${destSpots[d * 2] || destSpots[0]}\n`;
      reply += `• ☀️ Afternoon: ${destSpots[d * 2 + 1] || destSpots[1]}\n`;
      reply += `• 🌙 Evening: ${d === 0 ? 'Settle in, Ganga aarti / local evening walk' : destSpots[d + 2] || 'Local market & street food'}\n`;
      if (destHidden[d]) reply += `• ${destHidden[d]}\n`;
      reply += '\n';
      dayCount++;
    }

    if (isFood || isHeritage) {
      reply += `**🍽️ Must-eat in ${dest}:**\n`;
      destFood.slice(0, 3).forEach(f => { reply += `• ${f}\n`; });
      reply += '\n';
    }
  });

  // Hidden gems section
  if (gems) {
    reply += `---\n## 🔮 Hidden Gems (locals-only spots)\n`;
    const allHidden = [...(gems.hiddenPlaces || [])].slice(0, 3);
    allHidden.forEach(g => {
      reply += `• **${g.name}**: ${g.why.slice(0, 100)} _(Best time: ${g.timing})_\n`;
    });
    reply += '\n';
  }

  // Cost breakdown
  const perPerson = Math.round(budget / travelers);
  reply += `---\n## 💰 Budget Breakdown (~₹${budget.toLocaleString('en-IN')} total)\n`;
  reply += `• Accommodation: ~₹${Math.round(budget * 0.35).toLocaleString('en-IN')}\n`;
  reply += `• Food: ~₹${Math.round(budget * 0.25).toLocaleString('en-IN')}\n`;
  reply += `• Transport: ~₹${Math.round(budget * 0.20).toLocaleString('en-IN')}\n`;
  reply += `• Entry + Activities: ~₹${Math.round(budget * 0.15).toLocaleString('en-IN')}\n`;
  reply += `• Miscellaneous: ~₹${Math.round(budget * 0.05).toLocaleString('en-IN')}\n`;
  reply += `• Per person: ~₹${perPerson.toLocaleString('en-IN')}\n\n`;

  reply += `📌 **Booking tips:** Book IRCTC trains at least 2 weeks early. Check Booking.com for ₹800–2,000/night guesthouses. Use Ola/Rapido in all these cities.\n`;
  reply += `\n👇 Scroll down to see your 3 customized itinerary plans (Budget / Balanced / Premium) with day-wise schedules and booking links!`;

  return { text: reply, thinking, source: 'fallback', model: 'local-kb' };
};
