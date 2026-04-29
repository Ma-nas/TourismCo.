import { destinations, travelCircles } from '../config/dataStore.js';

// Simple keyword-based AI matching for UP destinations
const scoreDestination = (dest, preferences = {}) => {
  let score = 70; // base score
  const { interests = [], budget = null } = preferences;

  // Interest matching
  interests.forEach(interest => {
    if (dest.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))) {
      score += 8;
    }
  });

  // Budget matching (INR)
  if (budget && dest.priceFrom <= budget) {
    score += 10;
  }

  // Rating bonus
  score += (dest.rating - 4) * 5;

  return Math.min(Math.round(score), 99);
};

export const getDestinations = () => destinations;

export const getDestinationById = (id) => {
  return destinations.find(d => d.id === id) || null;
};

export const getSmartMatches = (preferences = {}) => {
  return destinations
    .map(dest => ({
      ...dest,
      matchScore: scoreDestination(dest, preferences)
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);
};

export const searchDestinations = (query = '') => {
  const q = query.toLowerCase();
  return destinations.filter(dest =>
    dest.name.toLowerCase().includes(q) ||
    dest.description.toLowerCase().includes(q) ||
    dest.tags.some(tag => tag.toLowerCase().includes(q))
  );
};

export const getTravelCircles = () => travelCircles;

export const getTravelCircleById = (id) => {
  return travelCircles.find(c => c.id === id) || null;
};

export const joinTravelCircle = (circleId, userId) => {
  const circle = travelCircles.find(c => c.id === circleId);
  if (!circle) return { success: false, message: 'Circle not found' };
  if (circle.members >= circle.maxMembers) return { success: false, message: 'Circle is full' };
  circle.members += 1;
  return { success: true, circle };
};

// Simple AI trip planner for UP
export const planTrip = ({ destination, days = 3, budget = 15000 }) => {
  const dest = destinations.find(d =>
    d.name.toLowerCase().includes(destination.toLowerCase())
  );

  if (!dest) {
    return {
      success: false,
      message: `No destination found matching "${destination}" in Uttar Pradesh`
    };
  }

  const dailyBudget = Math.floor(budget / days);
  const accommodation = Math.floor(dailyBudget * 0.45);
  const food = Math.floor(dailyBudget * 0.25);
  const sightseeing = Math.floor(dailyBudget * 0.20);
  const transport = Math.floor(dailyBudget * 0.10);

  // Auto-generate day-wise itinerary from highlights
  const highlights = [...dest.highlights];
  const itinerary = Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    title: `Day ${i + 1} in ${dest.name}`,
    activities: highlights.splice(0, Math.ceil(highlights.length / (days - i))),
    estimatedCost: dailyBudget
  }));

  return {
    success: true,
    destination: dest.name,
    totalBudget: budget,
    currency: 'INR',
    currencySymbol: '₹',
    days,
    budgetBreakdown: {
      accommodation: accommodation * days,
      food: food * days,
      sightseeing: sightseeing * days,
      transport: transport * days,
      total: budget
    },
    itinerary,
    tips: [
      `Best season to visit: ${dest.bestSeason}`,
      `Recommended stay: ${dest.travelTime}`,
      `Book accommodation in advance during peak season`,
      `Local transport (e-rickshaws) is the best way to explore`
    ]
  };
};
