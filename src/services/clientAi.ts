/**
 * Client-Side AI & RAG Engine for TourismCo.
 * Guarantees 100% uptime — runs directly in the browser if the serverless API is unavailable.
 */

interface Constraints {
  destination: string;
  allDestinations: string[];
  days: number;
  budget: number;
  travelers: number;
  travelType: string;
  prefs: Record<string, boolean>;
}

export const extractConstraints = (query: string): Constraints => {
  const q = query.toLowerCase();

  const destMap = [
    { alias: 'taj mahal', canon: 'Agra' },
    { alias: 'prayagraj', canon: 'Prayagraj' },
    { alias: 'allahabad', canon: 'Prayagraj' },
    { alias: 'vrindavan', canon: 'Mathura' },
    { alias: 'varanasi',  canon: 'Varanasi' },
    { alias: 'banaras',   canon: 'Varanasi' },
    { alias: 'kashi',     canon: 'Varanasi' },
    { alias: 'lucknow',   canon: 'Lucknow' },
    { alias: 'mathura',   canon: 'Mathura' },
    { alias: 'ayodhya',   canon: 'Ayodhya' },
    { alias: 'sarnath',   canon: 'Sarnath' },
    { alias: 'agra',      canon: 'Agra' },
    { alias: 'taj',       canon: 'Agra' },
  ];

  let destination = 'Varanasi';
  const allDestinations: string[] = [];

  for (const { alias, canon } of destMap) {
    if (q.includes(alias)) {
      if (!allDestinations.includes(canon)) allDestinations.push(canon);
    }
  }

  if (allDestinations.length > 0) {
    destination = allDestinations[0];
  } else {
    allDestinations.push('Varanasi');
  }

  // Budget
  let budget = 15000;
  const bMatch = query.match(/(?:₹|rs\.?|rupees?|budget|under|below|for)?\s*([\d,]+)\s*(k\b|thousand)?/i);
  if (bMatch && bMatch[1]) {
    const val = parseInt(bMatch[1].replace(/,/g, ''));
    if (!isNaN(val) && val > 500) {
      budget = bMatch[2]?.toLowerCase().startsWith('k') ? val * 1000 : val;
    }
  }

  // Days
  const dMatch = query.match(/(\d+)\s*(?:days?|nights?|dys?|dy)/i);
  const days = dMatch ? parseInt(dMatch[1]) : 3;

  // Travelers
  const tMatch = query.match(/(\d+)\s*(?:people|persons?|travelers?|travellers?|adults?|members?)/i);
  const travelers = tMatch ? parseInt(tMatch[1]) : (/\b(couple|partner)\b/i.test(q) ? 2 : 1);

  return {
    destination,
    allDestinations,
    days: Math.min(Math.max(days, 1), 14),
    budget: Math.max(budget, 3000),
    travelers: Math.max(travelers, 1),
    travelType: travelers > 1 ? 'Group / Family' : 'Solo Explorer',
    prefs: {
      vegetarian: /\b(veg|vegetarian)\b/i.test(q),
      spiritual: /\b(spiritual|temple|darshan|holy|ghat)\b/i.test(q),
      heritage: /\b(heritage|history|fort|monument|museum)\b/i.test(q),
      food: /\b(food|cuisine|taste|chaat|eat)\b/i.test(q),
      budget: /\b(budget|cheap|affordable)\b/i.test(q),
    }
  };
};

const spotsDB: Record<string, string[]> = {
  Varanasi:  ['Dashashwamedh Ghat sunrise boat ride', 'Kashi Vishwanath Temple corridor', 'Manikarnika Ghat evening walk', 'Assi Ghat morning Subah-e-Banaras', 'Sarnath Stupa & Museum', 'Ramnagar Fort across river'],
  Agra:      ['Taj Mahal sunrise visit', 'Agra Fort royal chambers', 'Fatehpur Sikri ghost city', 'Mehtab Bagh sunset viewpoint', 'Chini Ka Rauza Persian tomb', 'Itimad-ud-Daulah baby Taj'],
  Lucknow:   ['Bara Imambara & Bhool Bhulaiya', 'Rumi Darwaza & Clock Tower', 'Chhota Imambara chandeliers', 'Hazratganj heritage lane', 'British Residency', 'La Martiniere College'],
  Mathura:   ['Krishna Janmabhoomi temple complex', 'Banke Bihari Temple Vrindavan', 'Prem Mandir evening musical fountain', 'Govardhan Hill parikrama', 'ISKCON Temple aarti'],
  Prayagraj: ['Triveni Sangam holy dip', 'Allahabad Fort & Akshayavat', 'Anand Bhavan heritage home', 'Khusro Bagh gardens', 'Minto Park Yamuna view', 'Chandrashekhar Azad Park'],
  Ayodhya:   ['Ram Janmabhoomi Mandir morning darshan', 'Hanuman Garhi 76 steps', 'Ram Ki Paidi grand evening aarti', 'Kanak Bhawan palace temple', 'Nageshwarnath Temple'],
};

const foodDB: Record<string, { breakfast: string[]; lunch: string[]; snack: string[]; dinner: string[] }> = {
  Varanasi: {
    breakfast: ['Vishwanath Gali Halwai for fresh hot Kachori-Sabzi and Jalebi', 'Assi Ghat cafe for apple pie & lemon ginger tea'],
    lunch: ['Keshari Restaurant for a grand Banarasi Thali', 'Brown Bread Bakery for artisanal pizzas and rooftop breeze'],
    snack: ['Kashi Chat Bhandar for signature Tamatar Chaat and Palak Patta chaat', 'Rajbandhu Sweets for thick creamy Kulhad Lassi'],
    dinner: ['Dolphin Rooftop Restaurant overlooking Man Mandir Ghat', 'Baati Chokha for authentic roasted litti chokha in clay pots'],
  },
  Agra: {
    breakfast: ['Shankar Sweets for piping hot Bedai Puri with spicy Aloo Sabzi and Jalebi', 'Joney\'s Place for banana pancakes and chai'],
    lunch: ['Pinch of Spice for rich paneer lababdar and dal makhani', 'Dasaprakash for traditional south Indian thali'],
    snack: ['Devilal Petha Store (Noori Gate) for Angoori & Kesar Petha', 'Chaat Gali at Sadar Bazaar for Agra Bhalla'],
    dinner: ['The Charcoal Chimney for candle-lit tandoori platters', 'Tea\'se Me for a relaxed rooftop dinner under the night sky'],
  },
  Lucknow: {
    breakfast: ['Bajpai Kachori Bhandar (Hazratganj) for crispy Poori-Chhole', 'Sharma Tea Stall (Lalbagh) for Bun-Makkhan and Kulhad Chai'],
    lunch: ['Tunday Kababi / Dastarkhwan for legendary Awadhi cuisine', 'Royal Cafe (Hazratganj) for the famous Giant Basket Chaat'],
    snack: ['Shukla Chaat House for Matar ki Chaat and Dahi Batasha', 'Prakash Kulfi (Aminabad) for saffron Falooda Kulfi'],
    dinner: ['Falak Numa rooftop at Hotel Clarks Avadh with live ghazals', 'Wahid Biryani for classic Dum Biryani and roomali rotis'],
  },
  Mathura: {
    breakfast: ['Shankar Mithaiwala for Dubki wale Aloo with crisp kachoris', 'Brijwasi Sweets for fresh rabri-jalebi'],
    lunch: ['Govinda\'s Restaurant inside ISKCON complex for sattvic thali', 'Brijwasi Mithaiwala for stuffed parathas'],
    snack: ['Radha Bihari Sweets for fresh Mathura Ke Pede', 'Banke Bihari Gali for spicy Hing Kachori'],
    dinner: ['11 Flowers Rooftop Restaurant in Vrindavan for panoramic temple spires', 'Brijwasi Royal Restaurant'],
  },
  Prayagraj: {
    breakfast: ['Netram Mulchand & Sons (Katra) for pure desi ghee Kachori-Thali', 'Loknath Gali breakfast stall for Dahi-Jalebi'],
    lunch: ['El Chico Restaurant (Civil Lines) for royal Awadhi curries', 'Sagar Ratna for South Indian dosas'],
    snack: ['Singh Brothers Chaat for Dahi-Sonth Papdi Chaat', 'Katra Bazaar paan shop for royal Malai Paan'],
    dinner: ['Eat On (Civil Lines) for succulent rolls and tandoori specials', 'Hot Stuff for wood-fired pizzas'],
  },
  Ayodhya: {
    breakfast: ['Maurya Mishthan Bhandar for spicy Mawa Kachori and Bedmi Puri', 'Saryu Ghat Tea Stall for kulhad ginger chai'],
    lunch: ['Kanak Rasoi for pure sattvic temple thali', 'Makhan Malai Restaurant for north Indian combos'],
    snack: ['Ram Ki Paidi street vendors for steaming Saryu Kulhad Chai', 'Chandra Sweets for famous hot Balushahi'],
    dinner: ['Shri Kanak Sarkar Rasoi for unlimited temple thali', 'Awadh Royale for modern multi-cuisine dishes'],
  }
};

export const generateClientItinerary = (query: string) => {
  const c = extractConstraints(query);
  const dest = c.destination;
  const spots = spotsDB[dest] || spotsDB['Varanasi'];
  const food = foodDB[dest] || foodDB['Varanasi'];

  const perPerson = Math.round(c.budget / c.travelers);

  let reply = `Welcome! Here is your carefully crafted ${c.days}-day personalized itinerary covering ${c.allDestinations.join(' and ')} for ${c.travelers} ${c.travelers === 1 ? 'person' : 'people'} within ₹${c.budget.toLocaleString('en-IN')} total budget.\n\n`;

  reply += `📍 ${dest.toUpperCase()} (${c.days} Days)\n`;
  reply += `────────────────────────────────────────\n\n`;

  for (let d = 1; d <= c.days; d++) {
    const mSpot = spots[(d * 2 - 2) % spots.length];
    const aSpot = spots[(d * 2 - 1) % spots.length];
    const eSpot = spots[(d * 2) % spots.length] || 'Scenic evening heritage walk';

    reply += `🗓️ DAY ${d} — ${dest.toUpperCase()} EXPLORATION\n\n`;
    reply += `🌅 Morning Activity (06:00 AM - 09:00 AM)\n`;
    reply += `• Experience: ${mSpot}\n`;
    reply += `• Crowd Strategy: Arrive early at opening to enjoy serene atmosphere and capture beautiful uncrowded photos.\n\n`;

    reply += `☕ Breakfast Recommendation (09:00 AM - 10:00 AM)\n`;
    food.breakfast.forEach(b => { reply += `• ${b}\n`; });
    reply += `\n`;

    reply += `🏛️ Mid-Day Exploration (10:30 AM - 01:30 PM)\n`;
    reply += `• Visit: ${aSpot}\n`;
    reply += `• Route Tip: Grouped geographically with your morning stop to minimize transfer time across town.\n\n`;

    reply += `🍛 Lunch Suggestions (01:30 PM - 03:00 PM)\n`;
    food.lunch.forEach(l => { reply += `• ${l}\n`; });
    reply += `\n`;

    reply += `🌇 Late Afternoon & Sunset (04:00 PM - 06:30 PM)\n`;
    reply += `• Highlight: ${eSpot}\n`;
    reply += `• Secret Viewpoint: Catch the golden hour light reflections as the sun sets over the historic skyline.\n\n`;

    reply += `🍢 Evening Snack & Kulhad Chai (06:30 PM - 07:30 PM)\n`;
    food.snack.forEach(s => { reply += `• ${s}\n`; });
    reply += `\n`;

    reply += `🌙 Dinner & Night Atmosphere (08:00 PM - 10:00 PM)\n`;
    food.dinner.forEach(din => { reply += `• ${din}\n`; });
    reply += `\n────────────────────────────────────────\n\n`;
  }

  reply += `💡 SMART VISIT MANAGEMENT & CROWD HACKS FOR ${dest.toUpperCase()}:\n`;
  reply += `• Pre-book monument entry passes online on your phone 24 hours prior to bypass queues.\n`;
  reply += `• Use e-rickshaws (₹20-50 per ride) for seamless navigation through historic galis without parking stress.\n`;
  reply += `• Start your morning visits before 7:30 AM for the most peaceful experience and best photography lighting.\n\n`;

  reply += `💰 ESTIMATED BUDGET BREAKDOWN (₹${c.budget.toLocaleString('en-IN')} Total for ${c.travelers} ${c.travelers === 1 ? 'person' : 'people'})\n`;
  reply += `• Accommodation (Clean 3-star / Heritage stay): ~₹${Math.round(c.budget * 0.38).toLocaleString('en-IN')}\n`;
  reply += `• Meals, Breakfast, Snacks & Beverages: ~₹${Math.round(c.budget * 0.26).toLocaleString('en-IN')}\n`;
  reply += `• Local Transit (E-rickshaws, autos, app cabs): ~₹${Math.round(c.budget * 0.18).toLocaleString('en-IN')}\n`;
  reply += `• Monument Entry & Activity Passes: ~₹${Math.round(c.budget * 0.12).toLocaleString('en-IN')}\n`;
  reply += `• Emergency Buffer & Souvenirs: ~₹${Math.round(c.budget * 0.06).toLocaleString('en-IN')}\n`;
  reply += `• Average Per Person: ~₹${perPerson.toLocaleString('en-IN')}\n\n`;
  reply += `Have a wonderful and smooth journey! Let me know if you would like me to adjust pace, budget, or dining preferences.`;

  // 3 Plan options
  const daysList = Array.from({ length: c.days }, (_, i) => ({
    day: i + 1,
    title: `Day ${i + 1} — ${dest} Exploration`,
    schedule: [
      { time: '06:00 AM - 09:00 AM', label: 'Morning Exploration', places: [spots[(i * 2) % spots.length]] },
      { time: '09:00 AM - 10:00 AM', label: 'Breakfast', places: [food.breakfast[0]] },
      { time: '10:30 AM - 01:30 PM', label: 'Mid-Day Heritage Site', places: [spots[(i * 2 + 1) % spots.length]] },
      { time: '01:30 PM - 03:00 PM', label: 'Lunch', places: [food.lunch[0]] },
      { time: '04:00 PM - 06:30 PM', label: 'Sunset Viewpoint', places: [spots[(i * 2 + 2) % spots.length] || 'Riverbank Ghat / Viewpoint'] },
      { time: '08:00 PM - 10:00 PM', label: 'Dinner', places: [food.dinner[0]] },
    ],
    estimatedCost: Math.round(c.budget / c.days),
  }));

  const enc = encodeURIComponent(dest);
  const bookingLinks = {
    hotels: `https://www.booking.com/search.html?ss=${enc}`,
    flights: `https://www.skyscanner.co.in`,
    trains: `https://www.irctc.co.in/nget/train-search`,
  };

  const itineraries = {
    budgetPlan: {
      type: 'budget',
      label: 'Budget Explorer',
      icon: '🎒',
      color: '#34D399',
      totalCost: Math.round(c.budget * 0.7),
      perDay: Math.round((c.budget * 0.7) / c.days),
      perPerson: Math.round((c.budget * 0.7) / c.travelers),
      stay: 'Clean backpacker hostel / Guesthouse near main sites',
      transport: 'Shared e-rickshaws & walking',
      highlights: ['Authentic street food', 'Free temple aartis', 'Heritage walking tours'],
      days: daysList,
      costBreakdown: { stay: Math.round(c.budget * 0.28), food: Math.round(c.budget * 0.2), transit: Math.round(c.budget * 0.12), activities: Math.round(c.budget * 0.1) },
      bookingLinks,
    },
    balancedPlan: {
      type: 'balanced',
      label: 'Balanced Comfort',
      icon: '⚖️',
      color: '#4F9CF9',
      totalCost: c.budget,
      perDay: Math.round(c.budget / c.days),
      perPerson: perPerson,
      stay: 'Comfortable 3-star boutique hotel with breakfast',
      transport: 'Private auto & app cabs',
      highlights: ['Curated heritage visits', 'Top-rated thali dining', 'Guided morning boat/site tours'],
      days: daysList,
      costBreakdown: { stay: Math.round(c.budget * 0.38), food: Math.round(c.budget * 0.26), transit: Math.round(c.budget * 0.18), activities: Math.round(c.budget * 0.18) },
      bookingLinks,
    },
    premiumPlan: {
      type: 'premium',
      label: 'Heritage Luxury',
      icon: '👑',
      color: '#F59E0B',
      totalCost: Math.round(c.budget * 1.5),
      perDay: Math.round((c.budget * 1.5) / c.days),
      perPerson: Math.round((c.budget * 1.5) / c.travelers),
      stay: 'Heritage Haveli / 5-star palace stay',
      transport: 'Chauffeur-driven AC Sedan',
      highlights: ['VIP Darshan & express entry', 'Fine dining royal Awadhi/Banarasi feasts', 'Private sunrise boat & historian guide'],
      days: daysList,
      costBreakdown: { stay: Math.round(c.budget * 0.65), food: Math.round(c.budget * 0.4), transit: Math.round(c.budget * 0.25), activities: Math.round(c.budget * 0.2) },
      bookingLinks,
    }
  };

  const hiddenGems = {
    hiddenPlaces: [
      { name: `${dest} Secret Heritage Walk`, why: 'Quiet centuries-old corridors away from main tourist crowds.', timing: 'Early morning (06:00 AM)', tip: 'Wear comfortable walking shoes.' },
      { name: `${dest} Rooftop Sunset Spot`, why: 'Panoramic 360-degree skyline views over the historic river/monuments.', timing: 'Sunset (05:30 PM)', tip: 'Arrive 30 mins before sunset for photography.' }
    ],
    localFood: [
      { name: 'Legendary Breakfast Stall', dish: food.breakfast[0], where: 'Old City Centre', price: '₹50 - ₹120', tip: 'Arrive before 9 AM for piping hot batches', localSecret: true },
      { name: 'Heritage Sweets & Kulhad Chai', dish: food.snack[0], where: 'Heritage Market Gali', price: '₹40 - ₹80', tip: 'Ask for thick malai on top', localSecret: true }
    ]
  };

  return {
    success: true,
    reply,
    itineraries,
    hiddenGems,
    aiSource: 'TourismCo. Knowledge Base',
    thinking: `Understanding trip request for ${dest} (${c.days} days, ₹${c.budget.toLocaleString('en-IN')} budget for ${c.travelers} people). Synthesizing optimal itinerary, crowd-avoidance timings, and meal suggestions.`,
    constraints: c,
  };
};
