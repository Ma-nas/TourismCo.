/**
 * UP Tourism Knowledge Base
 * Source: Ministry of Tourism, Government of India
 * Survey by ACNielsen ORG-MARG | Period: April 2005 - March 2006
 *
 * This data is used to power TourismCo's AI recommendation engine.
 */

// ─── Real Visitor Statistics ──────────────────────────────────────────────────
export const visitorStats = {
  totalVisitors: 17799638,
  domesticOvernight: 4494768,
  foreignOvernight: 452386,
  dayTourists: 12852484,
  surveyPeriod: "April 2005 - March 2006",
  source: "Ministry of Tourism, Govt. of India"
};

// ─── Month-wise Visitor Data (Table 4.1) ──────────────────────────────────────
export const monthlyVisitors = [
  { month: "April",     domestic: 126975, foreign: 5133,  day: 319483,   total: 451591  },
  { month: "May",       domestic: 454347, foreign: 32024, day: 274729,   total: 761100  },
  { month: "June",      domestic: 470827, foreign: 26322, day: 295412,   total: 792561  },
  { month: "July",      domestic: 471010, foreign: 20693, day: 3850408,  total: 4342111 },
  { month: "August",    domestic: 262135, foreign: 32702, day: 249977,   total: 544814  },
  { month: "September", domestic: 328053, foreign: 33177, day: 209251,   total: 570481  },
  { month: "October",   domestic: 475876, foreign: 55658, day: 1466727,  total: 1998261 },
  { month: "November",  domestic: 346534, foreign: 41573, day: 1392904,  total: 1781011 },
  { month: "December",  domestic: 441927, foreign: 40937, day: 1257743,  total: 1740607 },
  { month: "January",   domestic: 366073, foreign: 57934, day: 1027604,  total: 1451611 },
  { month: "February",  domestic: 375408, foreign: 52783, day: 1248860,  total: 1677051 },
  { month: "March",     domestic: 375603, foreign: 53450, day: 1259386,  total: 1688439 }
];

// ─── Accommodation Data by City (Table 5.1) ───────────────────────────────────
export const accommodationData = [
  { city: "Varanasi",       hotels: 285, rooms: 5460, beds: 9298  },
  { city: "Agra",           hotels: 198, rooms: 3812, beds: 7494  },
  { city: "Lucknow",        hotels: 115, rooms: 1986, beds: 4040  },
  { city: "Mathura",        hotels: 112, rooms: 946,  beds: 1775  },
  { city: "Kanpur",         hotels: 98,  rooms: 1331, beds: 2275  },
  { city: "Vrindavan",      hotels: 96,  rooms: 597,  beds: 1281  },
  { city: "Gorakhpur",      hotels: 62,  rooms: 1020, beds: 2150  },
  { city: "Jhansi",         hotels: 60,  rooms: 919,  beds: 1868  },
  { city: "Allahabad",      hotels: 58,  rooms: 1327, beds: 2443  },
  { city: "Faizabad",       hotels: 27,  rooms: 485,  beds: 810   },
  { city: "Meerut",         hotels: 21,  rooms: 1210, beds: 2150  },
  { city: "Sitapur",        hotels: 22,  rooms: 341,  beds: 467   },
  { city: "Garhmukteshwar", hotels: 26,  rooms: 260,  beds: 626   },
  { city: "Chitrakoot",     hotels: 17,  rooms: 111,  beds: 260   },
  { city: "Ayodhya",        hotels: 12,  rooms: 205,  beds: 394   },
  { city: "Hastinapur",     hotels: 14,  rooms: 490,  beds: 1028  },
  { city: "Shravasti",      hotels: 7,   rooms: 165,  beds: 344   },
  { city: "Kushinagar",     hotels: 4,   rooms: 56,   beds: 123   },
  { city: "Sarnath",        hotels: 4,   rooms: 51,   beds: 128   },
];

// ─── Expenditure Breakdown % (Table 6.1) ─────────────────────────────────────
export const expenditurePattern = {
  accommodation: { domestic: 33.1, foreign: 18.2, overall: 32.1 },
  foodAndBeverage: { domestic: 16.7, foreign: 17.5, overall: 16.8 },
  transport: { domestic: 14.2, foreign: 20.7, overall: 14.6 },
  travelAgencies: { domestic: 3.6, foreign: 1.2, overall: 3.4 },
  recreation: { domestic: 2.1, foreign: 2.1, overall: 2.1 },
  clothing: { domestic: 1.6, foreign: 2.1, overall: 1.6 },
  processedFood: { domestic: 4.9, foreign: 5.4, overall: 4.9 },
  gemsAndJewellery: { domestic: 3.4, foreign: 6.1, overall: 3.6 },
  avgMonthlyExpenseLakhs: { domestic: 3496, foreign: 380, total: 3876 }
};

// ─── Graded Visitor Destinations (Table 3 from PDF) ──────────────────────────
// Grade A = Most important, B = Important, C = Notable
export const gradedDestinations = [
  // AGRA
  { city: "Agra", place: "Taj Mahal",     grade: "A", type: "Heritage", note: "One of the 7 wonders of the world" },
  { city: "Agra", place: "Agra Fort",     grade: "A", type: "Heritage", note: "Historical spot of prominence" },
  { city: "Agra", place: "Fatehpur Sikri",grade: "A", type: "Heritage", note: "Historical spot of prominence" },
  { city: "Agra", place: "Ram Bagh",      grade: "B", type: "Garden",   note: "Historical spot of prominence" },
  { city: "Agra", place: "Sikandra",      grade: "B", type: "Heritage", note: "Emperor Akbar's tomb" },
  // ALLAHABAD (PRAYAGRAJ)
  { city: "Prayagraj", place: "Sangam",           grade: "A", type: "Spiritual", note: "Confluence of Ganga and Yamuna" },
  { city: "Prayagraj", place: "Allahabad Fort",   grade: "A", type: "Heritage",  note: "Historical spot of prominence" },
  { city: "Prayagraj", place: "Patal Puri Temple",grade: "B", type: "Spiritual", note: "Religious spot of prominence" },
  { city: "Prayagraj", place: "Ashoka Pillar",    grade: "C", type: "Heritage",  note: "Historically significant site" },
  { city: "Prayagraj", place: "Mankameshwar Temple",grade: "C", type: "Spiritual", note: "Religious spot of prominence" },
  // KANPUR
  { city: "Kanpur", place: "Kanpur Zoo",     grade: "C", type: "Nature",  note: "Famous zoo garden" },
  { city: "Kanpur", place: "Kamla Retreat",  grade: "C", type: "Nature",  note: "Picturesque location" },
  // LUCKNOW
  { city: "Lucknow", place: "Residency",       grade: "B", type: "Heritage",  note: "Historically significant spot" },
  { city: "Lucknow", place: "Chota Imambara",  grade: "A", type: "Heritage",  note: "Historically significant spot" },
  { city: "Lucknow", place: "Bada Imambara",   grade: "A", type: "Heritage",  note: "Historically significant spot" },
  { city: "Lucknow", place: "Roomi Darwaza",   grade: "A", type: "Heritage",  note: "Historically significant spot" },
  { city: "Lucknow", place: "Kaiserbagh Palace",grade: "B", type: "Heritage",  note: "Historically significant spot" },
  // MATHURA/VRINDAVAN
  { city: "Mathura", place: "Vrindavan",   grade: "A", type: "Spiritual", note: "Collection of temples" },
  { city: "Mathura", place: "Ghats",       grade: "A", type: "Spiritual", note: "Pious locations" },
  { city: "Mathura", place: "Gita Mandir",  grade: "B", type: "Spiritual", note: "Religious spot of importance" },
  { city: "Mathura", place: "Kans Quila",   grade: "C", type: "Heritage",  note: "Religious spot of importance" },
  // VARANASI
  { city: "Varanasi", place: "Banaras Hindu University", grade: "A", type: "Education", note: "One of the largest university of North India" },
  { city: "Varanasi", place: "Tulsi Manas Temple",       grade: "A", type: "Spiritual",  note: "Religious spot of prominence" },
  { city: "Varanasi", place: "Dashavatar Temple",         grade: "A", type: "Spiritual",  note: "Religious spot of prominence" },
  { city: "Varanasi", place: "Ram Nagar Fort",            grade: "B", type: "Heritage",   note: "Historically significant spot" },
  { city: "Varanasi", place: "Bharat Mata Temple",        grade: "B", type: "Spiritual",  note: "Religious spot of prominence" },
  { city: "Varanasi", place: "Durga Temple",              grade: "B", type: "Spiritual",  note: "Religious spot of prominence" },
  // OTHER KEY SITES
  { city: "Chitrakoot", place: "Chitrakoot",  grade: "A", type: "Nature",   note: "Scenic beauty" },
  { city: "Ayodhya",    place: "Ayodhya",     grade: "B", type: "Spiritual",note: "Religious spot of importance" },
  { city: "Sarnath",    place: "Sarnath",     grade: "A", type: "Buddhist", note: "Buddhist site of importance" },
  { city: "Shravasti",  place: "Shravasti",   grade: "A", type: "Buddhist", note: "Buddhist site of importance" },
  { city: "Hastinapur", place: "Hastinapur",  grade: "A", type: "Heritage", note: "Historically significant spot" },
  { city: "Kapilavastu",place: "Kapilavastu", grade: "A", type: "Buddhist", note: "Buddhist site of importance" },
  { city: "Kushinagar", place: "Kushinagar",  grade: "B", type: "Buddhist", note: "Buddhist site of importance" },
];

// ─── Top Visitor Origin States (domestic) ────────────────────────────────────
export const topOriginStates = [
  { state: "Uttar Pradesh (local)", visitors: 619079, bedNights: 1258199 },
  { state: "Delhi",    visitors: 462641, bedNights: 904590  },
  { state: "Bihar",    visitors: 361500, bedNights: 790564  },
  { state: "MP",       visitors: 349668, bedNights: 730145  },
  { state: "West Bengal", visitors: 288601, bedNights: 610076 },
  { state: "Rajasthan", visitors: 216629, bedNights: 407460 },
  { state: "Maharashtra", visitors: 205326, bedNights: 392177 },
  { state: "Punjab",  visitors: 189882, bedNights: 341321 },
  { state: "Haryana", visitors: 173879, bedNights: 287604 },
  { state: "Jharkhand", visitors: 166097, bedNights: 394828 },
];

// ─── Top Foreign Visitor Countries ────────────────────────────────────────────
export const topForeignOrigins = [
  { country: "USA",       visitors: 49294, bedNights: 100335 },
  { country: "UK",        visitors: 38909, bedNights: 78767  },
  { country: "Japan",     visitors: 38594, bedNights: 93414  },
  { country: "Sri Lanka", visitors: 31010, bedNights: 57283  },
  { country: "Nepal",     visitors: 30192, bedNights: 48244  },
  { country: "Germany",   visitors: 29731, bedNights: 62888  },
  { country: "Australia", visitors: 27917, bedNights: 54849  },
  { country: "Canada",    visitors: 28799, bedNights: 57204  },
  { country: "France",    visitors: 26664, bedNights: 59799  },
  { country: "Korea",     visitors: 19320, bedNights: 46364  },
];
