/**
 * Booking & Itinerary Data Store
 * In-memory store — ready to swap with a real DB
 */

export const bookings = [];
export const itineraries = [];

// ─── Accommodation Options (by city, real hotel tier data) ───────────────────
export const accommodationOptions = {
  Varanasi: [
    { id: "acc-v1", name: "Budget Guesthouse (Ghats area)", type: "budget", pricePerNight: 800,  amenities: ["WiFi", "AC", "Ghat View"] },
    { id: "acc-v2", name: "Heritage Haveli Hotel",           type: "mid",    pricePerNight: 2500, amenities: ["WiFi", "AC", "Breakfast", "Rooftop"] },
    { id: "acc-v3", name: "Luxury Riverside Resort",         type: "luxury", pricePerNight: 6500, amenities: ["WiFi", "AC", "Pool", "Spa", "All-Meals"] },
  ],
  Agra: [
    { id: "acc-a1", name: "Budget Backpacker Lodge",    type: "budget", pricePerNight: 700,  amenities: ["WiFi", "Locker"] },
    { id: "acc-a2", name: "Taj View Hotel",             type: "mid",    pricePerNight: 3200, amenities: ["WiFi", "AC", "Breakfast", "Taj View"] },
    { id: "acc-a3", name: "Oberoi Amarvilas (Style)",   type: "luxury", pricePerNight: 9500, amenities: ["WiFi", "Pool", "Spa", "Fine Dining"] },
  ],
  Lucknow: [
    { id: "acc-l1", name: "City Budget Inn",             type: "budget", pricePerNight: 750,  amenities: ["WiFi", "AC"] },
    { id: "acc-l2", name: "Nawab Heritage Hotel",        type: "mid",    pricePerNight: 2800, amenities: ["WiFi", "AC", "Breakfast", "Nawabi Decor"] },
    { id: "acc-l3", name: "Taj Mahal Lucknow (Style)",   type: "luxury", pricePerNight: 7200, amenities: ["WiFi", "Pool", "Spa", "All-Meals"] },
  ],
  Mathura: [
    { id: "acc-m1", name: "Pilgrim Dharamshala",      type: "budget", pricePerNight: 400, amenities: ["Basic Meals"] },
    { id: "acc-m2", name: "Krishna Residency",         type: "mid",    pricePerNight: 1800, amenities: ["WiFi", "AC", "Breakfast"] },
    { id: "acc-m3", name: "Radha Krishn Resort",       type: "luxury", pricePerNight: 5500, amenities: ["WiFi", "Pool", "Temple View"] },
  ],
  Prayagraj: [
    { id: "acc-p1", name: "Budget Pilgrim Lodge",  type: "budget", pricePerNight: 600,  amenities: ["Basic Amenities"] },
    { id: "acc-p2", name: "Sangam View Hotel",      type: "mid",    pricePerNight: 2200, amenities: ["WiFi", "AC", "Breakfast"] },
    { id: "acc-p3", name: "Prayag Grand",           type: "luxury", pricePerNight: 6000, amenities: ["WiFi", "Pool", "Spa", "All-Meals"] },
  ],
};

// ─── Transport Options ────────────────────────────────────────────────────────
export const transportOptions = [
  { id: "tr-1", mode: "Auto Rickshaw",   pricePerDay: 300,  ideal: ["budget"],         note: "Best for short distances, very local experience" },
  { id: "tr-2", mode: "e-Rickshaw",      pricePerDay: 200,  ideal: ["budget"],         note: "Eco-friendly, ideal for ghat areas" },
  { id: "tr-3", mode: "Taxi/Cab",        pricePerDay: 1200, ideal: ["mid", "luxury"],  note: "Private cab, comfortable for families" },
  { id: "tr-4", mode: "Rented Scooter",  pricePerDay: 400,  ideal: ["budget", "mid"],  note: "Explore at your own pace" },
  { id: "tr-5", mode: "Luxury Car + Driver", pricePerDay: 2800, ideal: ["luxury"],     note: "AC vehicle with professional driver" },
  { id: "tr-6", mode: "Tempo Traveller (Group)", pricePerDay: 2200, ideal: ["mid"],   note: "Best for groups of 6-12" },
];

// ─── Meal Plan Options ────────────────────────────────────────────────────────
export const mealPlanOptions = [
  { id: "mp-1", plan: "Room Only",        pricePerDayPerPerson: 0,    description: "No meals included, eat at local restaurants" },
  { id: "mp-2", plan: "Breakfast Only",   pricePerDayPerPerson: 250,  description: "Hotel breakfast included" },
  { id: "mp-3", plan: "Half Board",       pricePerDayPerPerson: 600,  description: "Breakfast + Dinner included" },
  { id: "mp-4", plan: "Full Board",       pricePerDayPerPerson: 950,  description: "All 3 meals included in hotel" },
  { id: "mp-5", plan: "Local Food Trail", pricePerDayPerPerson: 800,  description: "Curated local restaurant visits daily" },
];

// ─── Activity Addons by type ─────────────────────────────────────────────────
export const activityAddons = [
  { id: "act-1",  name: "Ganga Aarti Experience (Varanasi)", price: 0,    city: "Varanasi",   category: "Spiritual" },
  { id: "act-2",  name: "Sunrise Boat Ride on Ganges",       price: 300,  city: "Varanasi",   category: "Experience" },
  { id: "act-3",  name: "Sarnath Buddhist Walk + Guide",     price: 500,  city: "Varanasi",   category: "Heritage" },
  { id: "act-4",  name: "Taj Mahal Sunrise Entry",           price: 1300, city: "Agra",       category: "Heritage" },
  { id: "act-5",  name: "Agra Fort Audio Guide Tour",        price: 600,  city: "Agra",       category: "Heritage" },
  { id: "act-6",  name: "Fatehpur Sikri Expert Guide",       price: 700,  city: "Agra",       category: "Heritage" },
  { id: "act-7",  name: "Awadhi Cooking Class",              price: 1200, city: "Lucknow",    category: "Culinary" },
  { id: "act-8",  name: "Kebab & Biryani Food Walk",         price: 800,  city: "Lucknow",    category: "Culinary" },
  { id: "act-9",  name: "Vrindavan Temple Circuit",          price: 400,  city: "Mathura",    category: "Spiritual" },
  { id: "act-10", name: "Sangam Boat Puja",                  price: 500,  city: "Prayagraj",  category: "Spiritual" },
  { id: "act-11", name: "Photography Walk - Heritage Sites", price: 900,  city: "all",        category: "Photography" },
  { id: "act-12", name: "Local Bazaar Shopping Tour",        price: 200,  city: "all",        category: "Shopping" },
  { id: "act-13", name: "Yoga & Meditation Session",         price: 600,  city: "Varanasi",   category: "Wellness" },
];

// ─── Travel Circle Chat Messages Store ───────────────────────────────────────
export const circleMessages = {};
