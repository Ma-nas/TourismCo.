/**
 * Itinerary Builder Service
 * Supports full customization: accommodation type, transport, meal plans, activities
 * All prices in INR (₹)
 */

import { v4 as uuidv4 } from 'uuid';
import {
  itineraries,
  accommodationOptions,
  transportOptions,
  mealPlanOptions,
  activityAddons
} from '../config/bookingStore.js';
import { gradedDestinations, accommodationData } from '../config/upTourismKB.js';
import { destinations } from '../config/dataStore.js';

// ─── Get customization options for a city ────────────────────────────────────
export const getCustomizationOptions = (cityName) => {
  const city = Object.keys(accommodationOptions).find(
    c => c.toLowerCase() === cityName.toLowerCase()
  ) || Object.keys(accommodationOptions)[0];

  const cityActivities = activityAddons.filter(
    a => a.city.toLowerCase() === cityName.toLowerCase() || a.city === 'all'
  );

  return {
    city,
    accommodation: accommodationOptions[city] || accommodationOptions['Varanasi'],
    transport: transportOptions,
    mealPlans: mealPlanOptions,
    activities: cityActivities,
    accommodationStats: accommodationData.find(
      a => a.city.toLowerCase().includes(cityName.toLowerCase())
    ) || null
  };
};

// ─── Calculate total cost of a customized itinerary ──────────────────────────
export const calculateCost = ({
  days,
  travelers,
  accommodationId,
  transportId,
  mealPlanId,
  activityIds = [],
  cityName
}) => {
  const city = Object.keys(accommodationOptions).find(
    c => c.toLowerCase() === (cityName || '').toLowerCase()
  ) || 'Varanasi';

  const acc = (accommodationOptions[city] || []).find(a => a.id === accommodationId)
    || accommodationOptions[city]?.[1];
  const transport = transportOptions.find(t => t.id === transportId) || transportOptions[2];
  const mealPlan = mealPlanOptions.find(m => m.id === mealPlanId) || mealPlanOptions[1];
  const activities = activityAddons.filter(a => activityIds.includes(a.id));

  const accommodationTotal = (acc?.pricePerNight || 0) * days;
  const transportTotal     = (transport?.pricePerDay || 0) * days;
  const mealTotal          = (mealPlan?.pricePerDayPerPerson || 0) * days * (travelers || 1);
  const activityTotal      = activities.reduce((sum, a) => sum + a.price, 0) * (travelers || 1);

  const subtotal = accommodationTotal + transportTotal + mealTotal + activityTotal;
  const taxes    = Math.round(subtotal * 0.05); // 5% GST
  const total    = subtotal + taxes;

  return {
    breakdown: {
      accommodation: { label: acc?.name || 'Standard', total: accommodationTotal },
      transport:     { label: transport?.mode || 'Taxi', total: transportTotal },
      meals:         { label: mealPlan?.plan || 'Breakfast', total: mealTotal },
      activities:    { label: `${activities.length} activities`, total: activityTotal },
      taxes:         { label: 'GST (5%)', total: taxes },
    },
    subtotal,
    taxes,
    total,
    perPerson: Math.round(total / (travelers || 1)),
    currency: 'INR',
    symbol: '₹'
  };
};

// ─── Build a full day-wise itinerary ─────────────────────────────────────────
export const buildCustomItinerary = ({
  cityName,
  days,
  travelers = 1,
  accommodationId,
  transportId,
  mealPlanId,
  activityIds = [],
  travelStyle = 'balanced', // 'budget' | 'comfort' | 'luxury' | 'balanced'
  interests = []
}) => {
  const city = Object.keys(accommodationOptions).find(
    c => c.toLowerCase() === (cityName || '').toLowerCase()
  ) || 'Varanasi';

  const acc = (accommodationOptions[city] || []).find(a => a.id === accommodationId)
    || accommodationOptions[city]?.[1];
  const transport = transportOptions.find(t => t.id === transportId) || transportOptions[2];
  const mealPlan = mealPlanOptions.find(m => m.id === mealPlanId) || mealPlanOptions[1];
  const selectedActivities = activityAddons.filter(a => activityIds.includes(a.id));

  // Fetch spots from KB
  const gradeFilter = travelStyle === 'budget' ? 'B' : 'A';
  const allSpots = gradedDestinations
    .filter(g => g.city.toLowerCase() === cityName.toLowerCase())
    .filter(g => g.grade === 'A' || (gradeFilter === 'B' && g.grade === 'B'));

  // Spread spots across days
  const spotsPerDay = Math.max(2, Math.ceil(allSpots.length / days));
  const dayPlans = Array.from({ length: days }, (_, i) => {
    const daySpots = allSpots.slice(i * spotsPerDay, (i + 1) * spotsPerDay);
    const dayActivities = selectedActivities.filter((_, idx) =>
      idx % days === i
    );

    const morningLabel = i === 0 ? 'Arrival & Check-in' : 'Morning Exploration';
    const eveningLabel = i === days - 1 ? 'Departure Preparation & Shopping' : 'Cultural Evening';

    return {
      day: i + 1,
      date: null, // filled by frontend from startDate
      title: i === 0 ? `Welcome to ${cityName}` : i === days - 1 ? `Farewell ${cityName}` : `${cityName} – Day ${i + 1}`,
      accommodation: acc ? { name: acc.name, type: acc.type, amenities: acc.amenities } : null,
      transport: transport.mode,
      meals: mealPlan.plan,
      schedule: [
        {
          time: "06:00 AM", label: morningLabel,
          items: daySpots.slice(0, Math.ceil(daySpots.length / 2)).map(s => ({
            name: s.place, type: s.type, grade: s.grade, note: s.note
          }))
        },
        {
          time: "12:30 PM", label: "Lunch Break",
          items: [{ name: "Local cuisine as per meal plan", type: "Dining", grade: "-", note: mealPlan.plan }]
        },
        {
          time: "02:00 PM", label: "Afternoon Activities",
          items: [
            ...daySpots.slice(Math.ceil(daySpots.length / 2)).map(s => ({
              name: s.place, type: s.type, grade: s.grade, note: s.note
            })),
            ...dayActivities.map(a => ({ name: a.name, type: a.category, grade: "★", note: `₹${a.price}/person` }))
          ]
        },
        {
          time: "07:00 PM", label: eveningLabel,
          items: [{ name: "Dinner & Rest", type: "Leisure", grade: "-", note: mealPlan.plan }]
        }
      ],
      tips: i === 0
        ? [`Arrive early to make the most of Day 1`, `${transport.mode} is recommended for getting around`, `Best local SIM: Jio / Airtel available near station`]
        : []
    };
  });

  const cost = calculateCost({ days, travelers, accommodationId, transportId, mealPlanId, activityIds, cityName });

  return {
    id: uuidv4(),
    cityName,
    days,
    travelers,
    travelStyle,
    interests,
    dayPlans,
    costSummary: cost,
    selectedAddons: { accommodation: acc, transport, mealPlan, activities: selectedActivities },
    createdAt: new Date().toISOString()
  };
};

// ─── Save itinerary ───────────────────────────────────────────────────────────
export const saveItinerary = (userId, itineraryData) => {
  const saved = { ...itineraryData, userId, savedAt: new Date().toISOString() };
  itineraries.push(saved);
  return saved;
};

// ─── Get itineraries for a user ───────────────────────────────────────────────
export const getUserItineraries = (userId) => {
  return itineraries.filter(it => it.userId === userId);
};

// ─── Delete itinerary ──────────────────────────────────────────────────────────
export const deleteItinerary = (itineraryId, userId) => {
  const idx = itineraries.findIndex(it => it.id === itineraryId && it.userId === userId);
  if (idx === -1) return false;
  itineraries.splice(idx, 1);
  return true;
};
