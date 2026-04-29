# TourismCo. 🌏

> **AI-Powered Travel Platform for Uttar Pradesh, India**  
> Built with React + Vite + TypeScript (frontend) and Node.js + Express + Socket.IO (backend)

---

## ✨ Features

- 🤖 **AI Trip Planner** — Natural language trip planning powered by real Govt. of India UP tourism data
- 🗺️ **Itinerary Builder** — 5-step customization: accommodation tier, transport, meal plans, activity addons
- 🎯 **Smart Destination Matching** — Scored recommendations based on interests & budget
- 👥 **Travel Circles** — Social groups for collaborative trip planning with real-time group chat (Socket.IO)
- 📅 **Booking System** — Confirm trips with TCO-XXXXXX confirmation IDs
- 📊 **Real Tourism Data** — Backed by Ministry of Tourism, Govt. of India survey (ACNielsen, 2005–06)
- 🇮🇳 **UP-Localized** — All content, pricing in INR (₹), destinations across Uttar Pradesh only

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### Frontend (Vite + React)
```bash
npm install
npm run dev
# → http://localhost:5173
```

### Backend (Express + Socket.IO)
```bash
cd server
npm install
# Create server/.env (see server/.env.example)
node src/index.js
# → http://localhost:5000
```

---

## 🗂️ Project Structure

```
TourismCO/
├── src/                        # React frontend
│   ├── components/
│   │   ├── Dashboard.tsx       # Main home page
│   │   ├── TopNav.tsx          # Navigation with logo
│   │   ├── HeroSection.tsx     # AI search hero
│   │   ├── TravelCircleDetail.tsx  # Circle view with live chat
│   │   └── ItineraryBuilder.tsx    # 5-step trip planner UI
│   ├── data/
│   │   └── mockData.ts         # Frontend mock data
│   └── App.tsx                 # Routes: /, /plan, /circle/:id
│
├── server/                     # Express backend
│   └── src/
│       ├── config/
│       │   ├── dataStore.js        # In-memory destination & circle data
│       │   ├── bookingStore.js     # Accommodation, transport, meal, activity options
│       │   └── upTourismKB.js      # Real UP tourism knowledge base (Govt. data)
│       ├── services/
│       │   ├── aiEngine.js         # RAG-lite AI planner engine
│       │   ├── travelService.js    # Destination matching & search
│       │   ├── itineraryService.js # Custom itinerary builder
│       │   └── bookingService.js   # Booking CRUD
│       ├── routes/
│       │   ├── auth.js, destinations.js, circles.js
│       │   ├── ai.js, itinerary.js, bookings.js
│       └── index.js            # Express + Socket.IO server
│
├── public/
│   └── logo.png                # TourismCo. brand logo
└── up_0.pdf                    # Source: Ministry of Tourism UP survey
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login + JWT |
| GET | `/api/destinations` | All UP destinations |
| GET | `/api/destinations/search?q=varanasi` | Search |
| GET | `/api/destinations/matches?interests=Spiritual&budget=15000` | AI matching |
| GET | `/api/circles` | All Travel Circles |
| POST | `/api/circles/:id/join` | Join a circle (auth) |
| POST | `/api/ai/chat` | Natural language trip planning |
| GET | `/api/ai/stats` | Real UP tourism statistics |
| GET | `/api/itinerary/options/:city` | Customization options |
| POST | `/api/itinerary/calculate` | Live cost preview (INR) |
| POST | `/api/itinerary/build` | Build full itinerary |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/mine` | User's bookings (auth) |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking |

---

## 🔌 WebSocket Events (Socket.IO)

| Event | Direction | Description |
|-------|-----------|-------------|
| `join:circle` | Client → Server | Join a group room |
| `message:send` | Client → Server | Send group chat message |
| `message:receive` | Server → Client | Receive group message |
| `location:update` | Client → Server | Share live location (consent) |
| `location:updated` | Server → Client | Member location broadcast |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Routing | react-router-dom v6 |
| Icons | lucide-react |
| Backend | Node.js, Express.js (ES Modules) |
| Real-time | Socket.IO v4 |
| Auth | JWT (jsonwebtoken) |
| Security | Helmet, CORS, express-rate-limit |
| AI Engine | Custom RAG-lite (no external API) |
| Data Source | Ministry of Tourism, Govt. of India |

---

## 📊 Data Source

The AI engine is trained on real UP tourism survey data:
- **Source:** ACNielsen ORG-MARG Pvt. Ltd. for Ministry of Tourism, Govt. of India
- **Period:** April 2005 – March 2006
- **Coverage:** 17.8 million visitors, 43 surveyed locations, 1,326 hotels

---

## 📝 License

MIT © 2026 TourismCo.
