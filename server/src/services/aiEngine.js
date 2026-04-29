/**
 * TourismCo AI Engine
 * Powered by UP Tourism Knowledge Base (Govt. of India Survey Data)
 *
 * Architecture: RAG-lite (Retrieval-Augmented Generation)
 * - Retrieval: vector-free keyword + semantic scoring against KB
 * - Augmentation: structured response generation with real statistics
 * - No external API needed — all data-driven
 */

import {
  monthlyVisitors,
  accommodationData,
  expenditurePattern,
  gradedDestinations,
  topOriginStates,
  topForeignOrigins,
  visitorStats
} from '../config/upTourismKB.js';

import { destinations } from '../config/dataStore.js';

// ─── Tokenizer & Keyword Extractor ───────────────────────────────────────────
const DESTINATION_ALIASES = {
  'varanasi': 'Varanasi', 'banaras': 'Varanasi', 'kashi': 'Varanasi',
  'agra': 'Agra', 'taj': 'Agra', 'taj mahal': 'Agra',
  'lucknow': 'Lucknow', 'nawab': 'Lucknow', 'nawabi': 'Lucknow',
  'mathura': 'Mathura', 'vrindavan': 'Mathura', 'vrindavan': 'Mathura',
  'prayagraj': 'Prayagraj', 'allahabad': 'Prayagraj', 'sangam': 'Prayagraj',
  'sarnath': 'Sarnath',
  'ayodhya': 'Ayodhya', 'ram': 'Ayodhya',
  'kushinagar': 'Kushinagar',
  'shravasti': 'Shravasti',
  'hastinapur': 'Hastinapur',
  'chitrakoot': 'Chitrakoot',
};

const INTENT_KEYWORDS = {
  plan:     ['plan', 'trip', 'itinerary', 'schedule', 'visit', 'travel', 'tour', 'explore'],
  budget:   ['budget', 'cost', 'cheap', 'afford', 'spend', 'price', 'inr', 'rupee', '₹', 'rs'],
  hotel:    ['hotel', 'stay', 'accommodation', 'room', 'hostel', 'bed', 'lodge'],
  crowd:    ['crowd', 'busy', 'peak', 'season', 'best time', 'when to go', 'month'],
  stats:    ['how many', 'visitor', 'tourist', 'statistics', 'data', 'number'],
  spiritual:['spiritual', 'temple', 'pilgrimage', 'ghat', 'divine', 'holy', 'religious'],
  heritage: ['heritage', 'fort', 'monument', 'museum', 'historical', 'mughal', 'architecture'],
  buddhist: ['buddhist', 'buddha', 'stupa', 'monastery', 'pillar'],
  food:     ['food', 'eat', 'cuisine', 'restaurant', 'kebab', 'biryani', 'awadhi'],
};

// ─── Detect intent from natural language query ────────────────────────────────
const detectIntent = (query) => {
  const q = query.toLowerCase();
  const intents = [];
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (keywords.some(kw => q.includes(kw))) intents.push(intent);
  }
  return intents.length ? intents : ['plan'];
};

// ─── Extract destination from query ──────────────────────────────────────────
const extractDestination = (query) => {
  const q = query.toLowerCase();
  for (const [alias, canonical] of Object.entries(DESTINATION_ALIASES)) {
    if (q.includes(alias)) return canonical;
  }
  return null;
};

// ─── Extract budget from query ────────────────────────────────────────────────
const extractBudget = (query) => {
  // Look for budget explicitly after ₹, Rs, or "under/below/within" — must be 3+ digits
  const explicit = query.match(/(?:₹|rs\.?|rupees?|under|below|within)\s*(\d[\d,]{2,})/i);
  if (explicit) return parseInt(explicit[1].replace(/,/g, ''));
  // Fallback: any standalone 4+ digit number
  const fallback = query.match(/\b(\d{4,})\b/);
  return fallback ? parseInt(fallback[1].replace(/,/g, '')) : null;
};

// ─── Extract number of days ───────────────────────────────────────────────────
const extractDays = (query) => {
  const match = query.match(/(\d+)[- ]?day/i);
  return match ? parseInt(match[1]) : 3;
};

// ─── Best month recommender (from real data) ─────────────────────────────────
const getBestMonths = () => {
  const sorted = [...monthlyVisitors].sort((a, b) => b.foreign - a.foreign);
  return sorted.slice(0, 3).map(m => m.month);
};

const getPeakMonth = () => {
  return monthlyVisitors.reduce((best, m) => m.total > best.total ? m : best).month;
};

// ─── Budget planner using real expenditure patterns ───────────────────────────
const buildBudgetBreakdown = (totalBudget, days) => {
  const { accommodation, foodAndBeverage, transport } = expenditurePattern;
  return {
    accommodation: Math.round(totalBudget * (accommodation.domestic / 100)),
    food:          Math.round(totalBudget * (foodAndBeverage.domestic / 100)),
    transport:     Math.round(totalBudget * (transport.domestic / 100)),
    recreation:    Math.round(totalBudget * 0.08),
    shopping:      Math.round(totalBudget * 0.08),
    misc:          Math.round(totalBudget * 0.04),
    perDay:        Math.round(totalBudget / days),
    currency: 'INR',
    symbol: '₹'
  };
};

// ─── Get Grade-A spots for a city from KB ────────────────────────────────────
const getTopSpotsForCity = (cityName, maxGrade = 'A') => {
  const gradeOrder = { 'A': 1, 'B': 2, 'C': 3 };
  const maxRank = gradeOrder[maxGrade] || 2;
  return gradedDestinations
    .filter(d => d.city.toLowerCase() === cityName.toLowerCase() && gradeOrder[d.grade] <= maxRank)
    .map(d => ({ name: d.place, type: d.type, grade: d.grade, note: d.note }));
};

// ─── Get accommodation info for city from KB ─────────────────────────────────
const getAccommodationInfo = (cityName) => {
  return accommodationData.find(a =>
    a.city.toLowerCase().includes(cityName.toLowerCase())
  ) || null;
};

// ─── Auto-generate day-wise itinerary ────────────────────────────────────────
const buildItinerary = (cityName, days, budgetPerDay) => {
  const spots = getTopSpotsForCity(cityName, 'B');
  const spotsPerDay = Math.ceil(spots.length / days);
  const itinerary = [];

  for (let d = 0; d < days; d++) {
    const daySpots = spots.slice(d * spotsPerDay, (d + 1) * spotsPerDay);
    itinerary.push({
      day: d + 1,
      title: d === 0 ? `Arrival & ${cityName} Overview` : d === days - 1 ? `Final Day - Hidden Gems` : `Day ${d + 1} - Deep Dive`,
      activities: daySpots.map(s => `${s.name} (${s.type})`),
      estimatedCost: budgetPerDay,
      tips: d === 0 ? [`Arrive by morning to maximize your first day`, `e-Rickshaws are the best way to explore`] : []
    });
  }
  return itinerary;
};

// ─── MAIN AI QUERY HANDLER ────────────────────────────────────────────────────
export const processQuery = (userQuery) => {
  const intents = detectIntent(userQuery);
  const destName = extractDestination(userQuery);
  const budget = extractBudget(userQuery) || 15000;
  const days = extractDays(userQuery);

  // Find destination in our store
  const dest = destName
    ? destinations.find(d => d.name.toLowerCase().includes(destName.toLowerCase()))
    : null;

  const accommodation = destName ? getAccommodationInfo(destName) : null;
  const topSpots = destName ? getTopSpotsForCity(destName, 'A') : [];
  const budgetBreakdown = buildBudgetBreakdown(budget, days);
  const itinerary = destName ? buildItinerary(destName, days, budgetBreakdown.perDay) : [];
  const bestMonths = getBestMonths();

  // Build AI response
  return {
    success: true,
    query: userQuery,
    intents,
    destination: dest || (destName ? { name: destName } : null),
    plan: destName ? {
      destination: destName,
      days,
      totalBudget: budget,
      currency: 'INR',
      currencySymbol: '₹',
      budgetBreakdown,
      itinerary,
      accommodation: accommodation
        ? {
            city: accommodation.city,
            availableHotels: accommodation.hotels,
            totalRooms: accommodation.rooms,
            message: `${accommodation.hotels} hotels with ${accommodation.rooms} rooms are available in ${accommodation.city}.`
          }
        : null,
      topAttractions: topSpots,
      insights: {
        bestMonthsToVisit: bestMonths,
        peakMonth: getPeakMonth(),
        totalAnnualVisitors: visitorStats.totalVisitors.toLocaleString('en-IN'),
        topSourceStates: topOriginStates.slice(0, 3).map(s => s.state),
        dataSource: "Ministry of Tourism, Govt. of India Survey 2005-06"
      }
    } : null,
    suggestions: destName
      ? [`Show hotels in ${destName}`, `Join ${destName} Travel Circle`, `Best time to visit ${destName}`]
      : ["Explore Varanasi", "Plan Agra trip", "Lucknow food tour", "Buddhist circuit UP"],
    message: destName
      ? `Here's your ${days}-day ${destName} plan within ₹${budget.toLocaleString('en-IN')}!`
      : `I couldn't find that destination in Uttar Pradesh. Try: Varanasi, Agra, Lucknow, Mathura, Prayagraj, Sarnath, Ayodhya.`
  };
};

// ─── Stats endpoint handler ───────────────────────────────────────────────────
export const getTourismStats = () => ({
  overview: visitorStats,
  monthlyBreakdown: monthlyVisitors,
  accommodationByCity: accommodationData,
  expenditurePattern,
  topDomesticOrigins: topOriginStates,
  topForeignOrigins,
  dataSource: "ACNielsen ORG-MARG Survey | Ministry of Tourism, Govt. of India | 2005-06"
});

// ─── Smart destination recommender ───────────────────────────────────────────
export const getSmartRecommendations = (preferences = {}) => {
  const { interests = [], budget = 15000, days = 3 } = preferences;

  return destinations.map(dest => {
    let score = 60;

    // Score from real KB grade-A sites
    const gradeASites = gradedDestinations.filter(
      g => g.city.toLowerCase() === dest.name.toLowerCase() && g.grade === 'A'
    );
    score += gradeASites.length * 5;

    // Score from accommodation richness (real data)
    const acc = accommodationData.find(a => a.city.toLowerCase().includes(dest.name.toLowerCase()));
    if (acc) score += Math.min(acc.hotels / 20, 10);

    // Interest match
    interests.forEach(interest => {
      if (dest.tags?.some(t => t.toLowerCase().includes(interest.toLowerCase()))) score += 8;
      gradeASites.forEach(g => {
        if (g.type.toLowerCase().includes(interest.toLowerCase())) score += 4;
      });
    });

    // Budget fit (in INR)
    if (dest.priceFrom && dest.priceFrom <= budget / days) score += 10;

    return {
      ...dest,
      matchScore: Math.min(Math.round(score), 99),
      gradeASites: gradeASites.length,
      accommodation: acc || null
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
};
