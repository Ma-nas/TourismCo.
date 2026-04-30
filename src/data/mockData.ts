// ─── Real destination images from Unsplash (free, no API key needed) ──────────
// High-quality curated images of actual Indian travel destinations

export const DESTINATION_IMAGES: Record<string, string[]> = {
  Varanasi: [
    '/images/varanasi.jpg',
    'https://images.unsplash.com/photo-1570458437082-bcde7d0aee6e?w=800&q=80',
    'https://images.unsplash.com/photo-1600693767434-f1f1d4c01cb8?w=800&q=80',
  ],
  Agra: [
    '/images/agra.jpg',
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
    'https://images.unsplash.com/photo-1585136917228-1c9c2f3e3671?w=800&q=80',
  ],
  Lucknow: [
    '/images/lucknow.jpg',
    'https://images.unsplash.com/photo-1602658413441-52a8f3b2d0da?w=800&q=80',
    'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=800&q=80',
  ],
  Mathura: [
    '/images/mathura.jpg',
    'https://images.unsplash.com/photo-1581791236671-37a1dd0e4ee0?w=800&q=80',
    'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80',
  ],
  Prayagraj: [
    '/images/prayagraj.jpg',
    'https://images.unsplash.com/photo-1566132127697-4524fea60007?w=800&q=80',
    'https://images.unsplash.com/photo-1582289003485-042af7cf9a26?w=800&q=80',
  ],
  Ayodhya: [
    '/images/ayodhya_idol.jpg',
    'https://images.unsplash.com/photo-1548096747-f5793c1ae4d5?w=800&q=80',
    'https://images.unsplash.com/photo-1617498939893-7a5ead0f56f1?w=800&q=80',
  ],
};

// Fallback beautiful India travel images
const fallbackImg = (seed: number) =>
  `https://picsum.photos/seed/${seed}/800/500`;

export const mockQuickReplies = [
  'Varanasi spiritual retreat',
  'Taj Mahal heritage tour',
  'Lucknow Awadhi food trail',
  'Mathura-Vrindavan weekend',
  'Prayagraj Sangam pilgrimage',
  'Ayodhya temple circuit',
];

export const mockTravelCircles = [
  {
    id: 'circle-001',
    name: 'Photographers in Varanasi',
    members: 245,
    image: DESTINATION_IMAGES.Varanasi[0],
    tags: ['Photography', 'Culture'],
  },
  {
    id: 'circle-002',
    name: 'Lucknow Foodies',
    members: 189,
    image: DESTINATION_IMAGES.Lucknow[0],
    tags: ['Culinary', 'Heritage'],
  },
  {
    id: 'circle-003',
    name: 'Agra Heritage Walk',
    members: 156,
    image: DESTINATION_IMAGES.Agra[0],
    tags: ['History', 'Architecture'],
  },
  {
    id: 'circle-004',
    name: 'Mathura-Vrindavan Devotees',
    members: 310,
    image: DESTINATION_IMAGES.Mathura[0],
    tags: ['Spiritual', 'Temples'],
  },
];

export const mockMatches = [
  {
    id: '1',
    destination: 'Varanasi, UP',
    matchScore: 98,
    description:
      "Perfect for spiritual journeys along the ancient Ganges ghats — witness the sacred Ganga Aarti, explore narrow lanes of Kashi, and feel the soul of India.",
    image: DESTINATION_IMAGES.Varanasi[0],
    priceEstimate: 'From ₹8,000',
    highlights: ['Ganga Aarti', 'Sarnath', 'Kashi Vishwanath'],
  },
  {
    id: '2',
    destination: 'Agra, UP',
    matchScore: 94,
    description:
      "Marvel at the Taj Mahal's timeless beauty, explore Agra Fort's Mughal grandeur, and discover Fatehpur Sikri — a UNESCO World Heritage masterpiece.",
    image: DESTINATION_IMAGES.Agra[0],
    priceEstimate: 'From ₹10,000',
    highlights: ['Taj Mahal', 'Agra Fort', 'Fatehpur Sikri'],
  },
  {
    id: '3',
    destination: 'Lucknow, UP',
    matchScore: 89,
    description:
      'The City of Nawabs — legendary Awadhi kebabs, Bara Imambara, Rumi Darwaza, and the gracious tehzeeb culture that defines Lucknow.',
    image: DESTINATION_IMAGES.Lucknow[0],
    priceEstimate: 'From ₹6,500',
    highlights: ['Bara Imambara', 'Tunde Kebabs', 'Rumi Darwaza'],
  },
  {
    id: '4',
    destination: 'Mathura, UP',
    matchScore: 85,
    description:
      "Sacred birthplace of Lord Krishna — vibrant temples, Holi celebrations, Vrindavan's spiritual energy, and the ghats of Yamuna river.",
    image: DESTINATION_IMAGES.Mathura[0],
    priceEstimate: 'From ₹5,000',
    highlights: ['Krishna Janmabhoomi', 'Vrindavan', 'Banke Bihari Temple'],
  },
];

export const featuredDestinations = [
  {
    id: 'varanasi',
    name: 'Varanasi',
    tagline: "The Eternal City",
    images: DESTINATION_IMAGES.Varanasi,
    rating: 4.9,
    reviews: 12840,
    bestTime: 'Oct – Mar',
    category: 'Spiritual',
    priceFrom: 8000,
    color: '#F59E0B',
  },
  {
    id: 'agra',
    name: 'Agra',
    tagline: "Wonder of the World",
    images: DESTINATION_IMAGES.Agra,
    rating: 4.8,
    reviews: 18560,
    bestTime: 'Nov – Feb',
    category: 'Heritage',
    priceFrom: 10000,
    color: '#8B5CF6',
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    tagline: "City of Nawabs",
    images: DESTINATION_IMAGES.Lucknow,
    rating: 4.7,
    reviews: 9320,
    bestTime: 'Sep – Mar',
    category: 'Culture & Food',
    priceFrom: 6500,
    color: '#EF4444',
  },
  {
    id: 'mathura',
    name: 'Mathura & Vrindavan',
    tagline: "Land of Krishna",
    images: DESTINATION_IMAGES.Mathura,
    rating: 4.8,
    reviews: 11240,
    bestTime: 'Oct – Mar',
    category: 'Spiritual',
    priceFrom: 5000,
    color: '#10B981',
  },
  {
    id: 'prayagraj',
    name: 'Prayagraj',
    tagline: "The Holy Sangam",
    images: DESTINATION_IMAGES.Prayagraj,
    rating: 4.7,
    reviews: 7800,
    bestTime: 'Nov – Mar',
    category: 'Pilgrimage',
    priceFrom: 7000,
    color: '#3B82F6',
  },
  {
    id: 'ayodhya',
    name: 'Ayodhya',
    tagline: "Birthplace of Ram",
    images: DESTINATION_IMAGES.Ayodhya,
    rating: 4.9,
    reviews: 8500,
    bestTime: 'Oct – Mar',
    category: 'Spiritual',
    priceFrom: 6000,
    color: '#F97316',
  },
];
