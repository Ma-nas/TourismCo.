// ─── Image helper: Picsum Photos (free, no API key, always loads) ─────────────
// Using seeded IDs so the same "destination" always gets the same image
const img = (id: number, w = 800, h = 500) =>
  `https://picsum.photos/seed/${id}/${w}/${h}`;

export const mockQuickReplies = [
  "Varanasi spiritual retreat",
  "Taj Mahal heritage tour",
  "Lucknow Awadhi food trail",
  "Mathura-Vrindavan weekend"
];

export const mockTravelCircles = [
  {
    id: "circle-001",
    name: "Photographers in Varanasi",
    members: 245,
    image: img(101),
    tags: ["Photography", "Culture"]
  },
  {
    id: "circle-002",
    name: "Lucknow Foodies",
    members: 189,
    image: img(102),
    tags: ["Culinary", "Heritage"]
  },
  {
    id: "circle-003",
    name: "Agra Heritage Walk",
    members: 156,
    image: img(103),
    tags: ["History", "Architecture"]
  },
  {
    id: "circle-004",
    name: "Mathura-Vrindavan Devotees",
    members: 310,
    image: img(104),
    tags: ["Spiritual", "Temples"]
  }
];

export const mockMatches = [
  {
    id: "1",
    destination: "Varanasi, UP",
    matchScore: 98,
    description: "Perfect for your interest in spiritual journeys and ancient traditions along the Ganges ghats.",
    image: img(201, 800, 480),
    priceEstimate: "From ₹8,000"
  },
  {
    id: "2",
    destination: "Agra, UP",
    matchScore: 94,
    description: "Matches your searches for iconic Mughal architecture — home to the Taj Mahal.",
    image: img(202, 800, 480),
    priceEstimate: "From ₹10,000"
  },
  {
    id: "3",
    destination: "Lucknow, UP",
    matchScore: 89,
    description: "The City of Nawabs — legendary Awadhi cuisine, Mughal monuments, and gracious tehzeeb.",
    image: img(203, 800, 480),
    priceEstimate: "From ₹6,500"
  },
  {
    id: "4",
    destination: "Mathura, UP",
    matchScore: 85,
    description: "Sacred birthplace of Lord Krishna, vibrant temples and colorful festivals year-round.",
    image: img(204, 800, 480),
    priceEstimate: "From ₹5,000"
  }
];
