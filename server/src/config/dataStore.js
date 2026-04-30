// Central in-memory data store (replaces a DB for now)
// All prices in INR, all destinations in Uttar Pradesh
// Images: Picsum Photos (seed-based, always loads, no API key needed)

export const destinations = [
  {
    id: "dest-001",
    name: "Varanasi",
    district: "Varanasi",
    state: "Uttar Pradesh",
    description: "The spiritual capital of India, known for the Ghats of the Ganges, ancient temples, and vibrant cultural life.",
    image: "/images/varanasi.jpg",
    tags: ["Spiritual", "Culture", "Heritage", "Photography"],
    priceFrom: 8000,
    priceUnit: "INR",
    rating: 4.8,
    highlights: ["Dashashwamedh Ghat", "Kashi Vishwanath Temple", "Sarnath", "Assi Ghat"],
    bestSeason: "October to March",
    travelTime: "3-5 days recommended"
  },
  {
    id: "dest-002",
    name: "Agra",
    district: "Agra",
    state: "Uttar Pradesh",
    description: "Home to the iconic Taj Mahal, a UNESCO World Heritage Site and one of the Seven Wonders of the World.",
    image: "/images/agra.jpg",
    tags: ["Heritage", "Architecture", "History", "UNESCO"],
    priceFrom: 10000,
    priceUnit: "INR",
    rating: 4.9,
    highlights: ["Taj Mahal", "Agra Fort", "Fatehpur Sikri", "Mehtab Bagh"],
    bestSeason: "October to February",
    travelTime: "2-3 days recommended"
  },
  {
    id: "dest-003",
    name: "Lucknow",
    district: "Lucknow",
    state: "Uttar Pradesh",
    description: "The City of Nawabs, famous for its Awadhi cuisine, Mughal architecture, and gracious tehzeeb (culture).",
    image: "/images/lucknow.jpg",
    tags: ["Culinary", "Heritage", "Nawabi Culture", "Architecture"],
    priceFrom: 6500,
    priceUnit: "INR",
    rating: 4.7,
    highlights: ["Bara Imambara", "Chota Imambara", "Hazratganj Market", "Tunday Kababi"],
    bestSeason: "November to February",
    travelTime: "2-4 days recommended"
  },
  {
    id: "dest-004",
    name: "Mathura & Vrindavan",
    district: "Mathura",
    state: "Uttar Pradesh",
    description: "The sacred birthplace of Lord Krishna, filled with ancient temples, colorful festivals, and devotion.",
    image: "/images/mathura.jpg",
    tags: ["Spiritual", "Temples", "Festivals", "Devotion"],
    priceFrom: 5000,
    priceUnit: "INR",
    rating: 4.6,
    highlights: ["Krishna Janmabhoomi", "Banke Bihari Temple", "ISKCON Temple", "Holi Celebrations"],
    bestSeason: "October to March",
    travelTime: "1-2 days recommended"
  },
  {
    id: "dest-005",
    name: "Prayagraj",
    district: "Prayagraj",
    state: "Uttar Pradesh",
    description: "The confluence of three rivers - Ganga, Yamuna, and the mythical Saraswati. Hosts the world's largest human gathering, Kumbh Mela.",
    image: "/images/prayagraj.jpg",
    tags: ["Spiritual", "Rivers", "Kumbh", "History"],
    priceFrom: 7000,
    priceUnit: "INR",
    rating: 4.5,
    highlights: ["Triveni Sangam", "Anand Bhawan", "Allahabad Fort", "Khusro Bagh"],
    bestSeason: "October to March",
    travelTime: "2-3 days recommended"
  },
  {
    id: "dest-006",
    name: "Ayodhya",
    district: "Ayodhya",
    state: "Uttar Pradesh",
    description: "The birthplace of Lord Rama, a legendary city filled with spiritual significance and magnificent temples.",
    image: "/images/ayodhya_idol.jpg",
    tags: ["Spiritual", "Temples", "Ram Janmabhoomi", "History"],
    priceFrom: 6000,
    priceUnit: "INR",
    rating: 4.9,
    highlights: ["Ram Janmabhoomi", "Hanuman Garhi", "Nageshwarnath Temple", "Ram Ki Paidi"],
    bestSeason: "October to March",
    travelTime: "1-2 days recommended"
  },
  {
    id: "dest-007",
    name: "Mirzapur",
    district: "Mirzapur",
    state: "Uttar Pradesh",
    description: "Known for its natural waterfalls, the sacred Vindhyavasini Temple, and scenic landscapes.",
    image: "/images/waterfall.jpg",
    tags: ["Nature", "Waterfalls", "Spiritual", "Adventure"],
    priceFrom: 4500,
    priceUnit: "INR",
    rating: 4.4,
    highlights: ["Vindhyavasini Temple", "Lakhaniya Dari Waterfalls", "Wyndham Falls", "Ashtabhuja Temple"],
    bestSeason: "July to March",
    travelTime: "1-2 days recommended"
  }
];

export const travelCircles = [
  {
    id: "circle-001",
    name: "Photographers in Varanasi",
    destinationId: "dest-001",
    members: 245,
    maxMembers: 300,
    image: "/images/varanasi.jpg",
    tags: ["Photography", "Culture"],
    description: "A community of photographers exploring the golden ghats, early morning rituals, and the soul of Varanasi.",
    isActive: true,
    createdAt: "2026-01-10T10:00:00Z"
  },
  {
    id: "circle-002",
    name: "Lucknow Foodies",
    destinationId: "dest-003",
    members: 189,
    maxMembers: 250,
    image: "https://picsum.photos/seed/102/800/480",
    tags: ["Culinary", "Heritage"],
    description: "Discover the legendary Awadhi biryani, galouti kebabs, and the rich culinary heritage of the City of Nawabs.",
    isActive: true,
    createdAt: "2026-01-15T10:00:00Z"
  },
  {
    id: "circle-003",
    name: "Agra Heritage Walk",
    destinationId: "dest-002",
    members: 156,
    maxMembers: 200,
    image: "/images/agra.jpg",
    tags: ["History", "Architecture"],
    description: "Explore the Mughal grandeur of Agra - from the Taj Mahal to forgotten monuments waiting to be discovered.",
    isActive: true,
    createdAt: "2026-02-01T10:00:00Z"
  },
  {
    id: "circle-004",
    name: "Mathura-Vrindavan Devotees",
    destinationId: "dest-004",
    members: 310,
    maxMembers: 400,
    image: "https://picsum.photos/seed/104/800/480",
    tags: ["Spiritual", "Temples"],
    description: "A spiritual circle for devotees planning their pilgrimage to the sacred land of Lord Krishna.",
    isActive: true,
    createdAt: "2026-02-10T10:00:00Z"
  }
];

export const users = [
  {
    id: "user-001",
    name: "Arjun Sharma",
    email: "arjun@example.com",
    password: "$2a$10$examplehashedpassword",
    verified: true,
    interests: ["Photography", "Heritage"],
    budgetRange: { min: 5000, max: 20000, currency: "INR" },
    joinedCircles: ["circle-001"],
    visitedDestinations: ["dest-001"]
  }
];
