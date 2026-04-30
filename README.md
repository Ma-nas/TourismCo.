# ✈️ TourismCo. AI 
**The Intelligent Travel OS for Uttar Pradesh**

![TourismCo. AI](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss)
![Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google)

## 📖 Overview
**TourismCo. AI** is a premium, AI-driven travel planning platform designed specifically to modernize tourism in **Uttar Pradesh, India**. Powered by a custom **Retrieval-Augmented Generation (RAG)** pipeline and the Google Gemini LLM, it acts as a hyper-intelligent travel agent. 

Users can ask for specific, complex multi-destination trips (e.g., *"Plan 5 days in Varanasi and Ayodhya under ₹15,000"*), and the system dynamically generates highly accurate, budget-optimized, day-by-day itineraries mapped to official UP Tourism data.

## ✨ Key Features
* **🧠 Custom RAG AI Engine:** Replaces generic LLM hallucinations with verified, structured data. Dynamically generates Budget, Balanced, and Premium itineraries.
* **🗺️ Multi-Destination Routing:** Capable of splitting days intelligently across multiple cities seamlessly.
* **🏨 Intelligent Resource Booking:** Automatically aggregates and generates direct booking links for trains, flights, and hotels based on the generated itinerary.
* **🎨 Glassmorphic UI/UX:** A stunning, highly-responsive frontend built with React, Vite, and Tailwind CSS.
* **📱 Travel Circles:** A real-time collaboration feature to plan trips with friends.

## 🛠️ Tech Stack
* **Frontend:** React.js (Vite), TypeScript, Tailwind CSS, Lucide Icons, React Router.
* **Backend:** Node.js, Express.js, Socket.IO.
* **AI/Machine Learning:** Google Gemini Pro API, Custom JSON RAG Knowledge Base (`upTourismKB.js`).
* **Architecture:** Stateless micro-services, built for Vercel/Render deployments.

## 🚀 Installation & Setup

### Prerequisites
* Node.js (v18+)
* Git
* A Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/Ma-nas/TourismCo.git
cd TourismCo
```

### 2. Backend Setup
```bash
cd server
npm install

# Create a .env file and add your Gemini API Key
echo "PORT=5000" > .env
echo "GEMINI_API_KEY=your_api_key_here" >> .env

# Start the development server
npm run dev
```

### 3. Frontend Setup
```bash
# Open a new terminal from the root TourismCo directory
npm install

# Create a .env file to connect to the local backend
echo "VITE_API_URL=http://localhost:5000" > .env

# Start the frontend
npm run dev
```

## 🌍 Deployment Guide
This repository is pre-configured for free cloud deployment:
1. **Frontend:** Deploy the root directory directly to **Vercel**. Set the `VITE_API_URL` environment variable to your backend URL.
2. **Backend:** Deploy the `server/` directory to **Render** as a Node Web Service. Set `GEMINI_API_KEY` in Render's environment settings.

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.
