<div align="center">

# TourismCo. AI

### Intelligent Travel Operating System and RAG Itinerary Engine for Uttar Pradesh

[![Status](https://img.shields.io/badge/Status-Production_Ready-brightgreen?style=flat-square)](#)
[![React](https://img.shields.io/badge/React-18%2F19-61DAFB?style=flat-square&logo=react&logoColor=black)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](#)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=nodedotjs&logoColor=white)](#)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-1.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white)](#)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

[Platform Overview](#platform-overview) | [RAG Architecture](#rag-architecture) | [Core Capabilities](#core-capabilities) | [Quick Start](#quick-start) | [API & Telemetry](#api--telemetry)

</div>

---

## Platform Overview

TourismCo. AI is an enterprise travel intelligence engine built to digitize and optimize destination planning for Uttar Pradesh, India. Moving beyond ungrounded LLM completions, TourismCo utilizes a proprietary Retrieval-Augmented Generation (RAG) architecture anchored in verified state tourism corpora, official survey databases, and real-time transit pricing.

The system dynamically digests complex user constraints (multivariable budgets, group sizes, dietary profiles, and duration limits) to generate deterministic, cost-optimized, multi-city itineraries spanning religious, heritage, and cultural corridors including Varanasi, Agra, Ayodhya, and Lucknow.

---

## RAG Architecture

```
+-------------------------------------------------------------------------+
|                              User Intent                                |
|   e.g. "4 days in Varanasi & Ayodhya for family of 4, INR 45,000"       |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                       Constraint Extraction Engine                      |
|      Entities: [Cities, Duration, Party Size, Budget, Diets]            |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                  Grounded Knowledge Retrieval Layer                    |
|   - Verified UP Tourism Corpus (Distances, Transit Hubs, Entry Hours)   |
|   - Real-World Cost Baselines (Lodging, Local Transit, Food Averages)   |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                     Gemini Reasoning & Fallback Matrix                  |
|   - Google Gemini 1.5 Flash Reasoning                                   |
|   - 7-Model Resilient Fallback Chain (Quota & Rate-Limit Shield)        |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                      Structured Plan Synthesis                          |
|   - Tier 1: Budget Optimization                                         |
|   - Tier 2: Balanced Standard                                           |
|   - Tier 3: Premium Experience                                          |
|   - Time-Indexed Itinerary (Morning, Afternoon, Evening, Logistics)     |
+-------------------------------------------------------------------------+
```

---

## Core Capabilities

- **Constraint-Grounded Synthesis:** Eliminates factual hallucinations by strictly bounding model context within verified regional tourism databases (`upTourismKB.js`).
- **Tri-Tier Budget Optimization:** Automatically outputs three parallel spending profiles (Budget, Balanced, and Premium) with granular line-item cost projections for lodging, transport, dining, and site admissions.
- **Seven-Model Resilience Cascade:** Implements an automated failover hierarchy across Gemini endpoints with exponential backoff, preventing service disruption during upstream throttling or transient errors.
- **Collaborative Travel Circles:** Features bi-directional real-time communication via WebSockets (`Socket.IO`), enabling groups to synchronize itineraries and discuss plans in shared sessions.
- **Production UI Architecture:** Built with modern React and Tailwind CSS, providing tabbed day-by-day scheduling, interactive maps, and responsive mobile interfaces.

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Client** | React 18/19, TypeScript, Tailwind CSS, Lucide React, React Router v7, Vite |
| **Backend Services** | Node.js (v20+), Express.js, Socket.IO, Helmet, CORS, Express Rate Limit |
| **Inference & Models** | Google Gemini 1.5 Flash, Google Generative AI SDK, Custom RAG Context Assembler |
| **Hosting & CI/CD** | Vercel (Client Distribution), Render / Railway (Backend API Container) |

---

## Quick Start

### Prerequisites
- Node.js (v18.0.0 or higher)
- Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 1. Repository Setup

```bash
git clone https://github.com/Ma-nas/TourismCo..git
cd TourismCo
```

### 2. Backend API Setup

```bash
cd server
npm install

# Environment configuration
cat <<EOF > .env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
EOF

# Start API service
npm run dev
```

### 3. Frontend Client Setup

```bash
# Return to repository root
cd ..
npm install

# Environment configuration
cat <<EOF > .env.development
VITE_API_URL=http://localhost:5000
EOF

# Start Vite client
npm run dev
```

The frontend client launches on `http://localhost:5173` and communicates with the backend API on `http://localhost:5000`.

---

## API & Telemetry

| Route | Protocol | Purpose |
| :--- | :--- | :--- |
| `POST /api/itinerary/generate` | HTTP REST | Accepts constraints JSON; returns tri-tier parsed itineraries |
| `GET /api/destinations` | HTTP REST | Returns verified destination metadata, timings, and entry requirements |
| `POST /api/budget/calculate` | HTTP REST | Generates real-time cost estimations based on traveler count and duration |
| `/socket.io/` | WebSocket | Manages collaborative room state and synchronized itinerary events |

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for full terms.
