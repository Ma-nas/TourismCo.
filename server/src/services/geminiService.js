/**
 * Gemini AI Service — TourismCo.
 * Full semantic reasoning using Google Gemini 1.5 Flash.
 * Reads ALL user constraints: destinations, budget, days, people, food prefs, travel style.
 */

import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-1.5-pro',
  'gemini-2.0-flash',
  'gemini-1.5-flash'
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const getGeminiUrl = (model) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

// ─── Master System Prompt ─────────────────────────────────────────────────────
// ─── Master System Prompt ─────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are TourismCo. AI — a hyper-knowledgeable, warm, and deeply cultured local travel companion specializing in Uttar Pradesh, India.

CRITICAL FORMATTING & SYNTAX CONSTRAINTS — MANDATORY:
1. ABSOLUTELY NO MARKDOWN HASHES (#, ##, ###, ####). Never start any line with a hash symbol.
2. ABSOLUTELY NO MARKDOWN ASTERISKS (*, **, ***). Never enclose text in asterisks for bolding or italics, and never use asterisks for bullet points.
3. Use plain readable text, clean capitalization for headers, clear line breaks, and emoji visual anchors (e.g., 📍 DESTINATION, 🗓️ DAY 1, 🌅 Morning, ☕ Breakfast, 🏛️ Exploration, 🍛 Lunch, 🌇 Evening & Sunset, 🍢 Street Treats, 🌙 Dinner, 💡 Smart Route & Crowd Hacks).
4. Use • or - for bullet points.

CRITICAL CONTENT & TONE RULES:
1. HUMANIZED & CONVERSATIONAL: Write warmly and personally, like a seasoned local friend walking them through the city. Explain the "why" and share insider stories rather than giving cold mechanical lists.
2. MULTI-OPTION FLEXIBILITY: For activities, meals, and viewpoints, always provide thoughtful options (e.g. Option 1: Classic & Heritage vs Option 2: Casual & Offbeat, or Vegetarian vs Non-Veg alternatives).
3. SMART VISIT MANAGEMENT & CROWD HACKS:
   - Provide exact timing recommendations (e.g., 5:45 AM sunrise gate entry to beat 2-hour lines).
   - Detail gate advice (e.g. East Gate vs West Gate, avoid Friday closures, book ASI tickets online on your phone 24 hours prior).
   - Group visits geographically so travelers move in a straight line without criss-crossing the city in traffic.
4. COMPLETE DAY-BY-DAY MEAL SUGGESTIONS:
   - For every single day, include specific named places & dishes for:
     • ☕ Breakfast: Local breakfast legend with exact dish name (e.g. Bedai-Aloo, Jalebi-Kachori)
     • 🍛 Lunch: 2 distinct options (e.g. Heritage Thali / Classic Dhaba vs Comfortable AC restaurant)
     • 🍢 Evening Snack & Chai: Authentic local tea stall & street food
     • 🌙 Dinner: Atmospheric dining spot with signature specialties
5. ADHERE TO USER CONSTRAINTS: Respect all cities, exact budget, group size, and dietary restrictions (if vegetarian, NEVER suggest non-veg).

CRITICAL INSTRUCTION FOR THINKING:
Start your response with a visible thinking process enclosed in <think> tags.
Analyze the user's constraints, state what you understand about their trip (destinations, days, budget, people, preferences), outline your strategy, and close the </think> tag before the final itinerary.

DESTINATIONS YOU KNOW DEEPLY:
- Varanasi (Banaras/Kashi): Dashashwamedh, Kashi Vishwanath (use Gate 4 VIP line if crowded), Assi Ghat morning subah-e-banaras, Sarnath, Manikarnika, Kashi Chat Bhandar tamatar chaat, Deena Chaat bhuja, Blue Lassi, Rajbandhu kulhad lassi, Shreeji sweets Malaiyyo.
- Agra: Taj Mahal (Sunrise East Gate entry, avoid Friday closure), Agra Fort (combine with Amar Singh Gate entry), Fatehpur Sikri (Buland Darwaza & Salim Chishti Dargah), Mehtab Bagh sunset, Chini Ka Rauza & Ram Bagh (hidden gems with zero crowd), Shankar Sweets bedai-aloo, Devilal Petha Noori Gate (Angoori & Paan petha), Pinch of Spice, Dasaprakash.
- Lucknow: Bara & Chhota Imambara (Bhool Bhulaiya), Rumi Darwaza, British Residency, Hazratganj evening ganjing, Tunday Kababi Aminabad, Dastarkhwan, Wahid Biryani, Royal Cafe basket chaat, Prakash Kulfi, Safed Baradari.
- Mathura & Vrindavan: Banke Bihari (arrive at 7:30 AM before darshan rush), Prem Mandir evening light show, Krishna Janmabhoomi, Govardhan Parikrama, ISKCON, Brijwasi peda, Shankar Mithaiwala dubki aloo.
- Prayagraj: Triveni Sangam (boat from Qila Ghat), Allahabad Fort Akshayavat, Anand Bhavan, Khusro Bagh, El Chico Restaurant, Netram Mulchand jalebi-kachori, Katra Bazaar malai paan.
- Ayodhya: Ram Janmabhoomi Mandir (early morning 6:30 AM slot), Hanuman Garhi, Kanak Bhawan, Ram Ki Paidi evening aarti, Saryu boat ride, Nageshwarnath Temple, Chandra Bakery, Maurya Mishthan Bhandar mawa kachori.`;

// ─── Sanitizer to strip markdown hashes and asterisks ─────────────────────────
export const sanitizeOutput = (text) => {
  if (!text) return '';
  return text
    // Remove markdown headers (#, ##, ###, ####)
    .replace(/^#{1,6}\s*/gm, '')
    // Remove triple, double, and single bold/italic asterisks
    .replace(/\*\*\*([^*]+)\*\*\*/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    // Remove asterisks used for list bullets
    .replace(/^\s*\*\s+/gm, '• ')
    // Normalize dividers
    .replace(/^---+$/gm, '────────────────────────────────────────')
    // Clean excessive empty lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

// ─── Build user message with full context ────────────────────────────────────
const buildUserMessage = (userQuery, ragContext) => {
  const c = ragContext?.constraints || {};

  const contextLines = [
    `USER QUERY: "${userQuery}"`,
    '',
    '--- EXTRACTED CONSTRAINTS ---',
    c.allDestinations?.length > 0
      ? `Destinations: ${c.allDestinations.join(', ')}`
      : c.destination ? `Destination: ${c.destination}` : 'Destination: Not specified',
    c.budget   ? `Budget: ₹${c.budget.toLocaleString('en-IN')} total` : 'Budget: Not specified (use ₹15,000 as default)',
    c.days     ? `Duration: ${c.days} days` : 'Duration: Not specified (use 3 days as default)',
    c.travelers > 1 ? `Group: ${c.travelers} people` : 'Group: 1 person',
    `Travel type: ${c.travelType || 'not specified'}`,
    c.prefs?.vegetarian ? '✅ Vegetarian food only' : '',
    c.prefs?.spiritual  ? '✅ Spiritual / temple focus' : '',
    c.prefs?.heritage   ? '✅ Heritage / historical sites focus' : '',
    c.prefs?.adventure  ? '✅ Adventure / outdoor activities' : '',
    c.prefs?.food       ? '✅ Local food & culinary experiences' : '',
    c.prefs?.luxury     ? '✅ Luxury / premium experience' : '',
    c.prefs?.budget     ? '✅ Budget / economical travel' : '',
  ].filter(Boolean).join('\n');

  const gemsSection = ragContext?.gemsPrompt || '';

  const webSection = ragContext?.webSnippets?.abstract
    ? `\n--- LIVE WEB DATA ---\n${ragContext.webSnippets.abstract}\n`
    : '';

  return `${contextLines}${webSection}${gemsSection}

TASK: Generate a comprehensive, detailed travel plan that addresses EVERY constraint above.
If multiple destinations are listed, split days between them logically.
The response must feel personalized to THIS specific query, not generic.`;
};

// ─── Main Gemini API call ─────────────────────────────────────────────────────
export const callGemini = async (options) => {
  const opts = typeof options === 'string' ? { userQuery: options } : (options || {});
  const userQuery = opts.userQuery || '';
  const ragContext = opts.ragContext || {};
  const conversationHistory = opts.conversationHistory || [];

  // Always try Gemini first — even without key we show intelligent fallback
  if (!GEMINI_API_KEY) {
    console.warn('[Gemini] No API key — using smart fallback');
    return buildSmartFallback(userQuery, ragContext);
  }

  const userMessage = buildUserMessage(userQuery, ragContext);

  // Build conversation history (last 6 turns for context)
  const historyMessages = conversationHistory.slice(-6).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const payload = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [
      ...historyMessages,
      { role: 'user', parts: [{ text: userMessage }] },
    ],
    generationConfig: {
      temperature:      0.75,
      topK:             40,
      topP:             0.95,
      maxOutputTokens:  3072,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  };

  let lastError = null;

  for (const model of GEMINI_MODELS) {
    const url = getGeminiUrl(model);
    let retries = 2;
    let delay = 1000;

    while (retries >= 0) {
      try {
        console.log(`[Gemini] Calling API for query using model ${model}:`, userQuery.slice(0, 80));
        const res = await fetch(url, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload),
          signal:  AbortSignal.timeout(20000),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error(`[Gemini] ${model} HTTP error:`, res.status, errText.slice(0, 200));
          
          // Retry on rate limit (429) or server error (503)
          if ((res.status === 429 || res.status === 503) && retries > 0) {
            console.log(`[Gemini] ${model} quota/rate limit hit. Retrying in ${delay}ms... (${retries} retries left)`);
            await sleep(delay);
            retries--;
            delay *= 2; // Exponential backoff
            continue;
          }
          
          throw new Error(`HTTP ${res.status}: ${errText}`);
        }

        const data = await res.json();

        // Log any safety blocks
        if (data?.candidates?.[0]?.finishReason === 'SAFETY') {
          console.warn(`[Gemini] ${model} Safety block triggered`);
          throw new Error('SAFETY_BLOCK');
        }

        let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text || text.trim().length < 20) {
          console.warn(`[Gemini] ${model} Empty/short response received`);
          throw new Error('EMPTY_RESPONSE');
        }

        let thinking = null;
        const thinkMatch = text.match(/<think>([\s\S]*?)<\/think>/);
        if (thinkMatch) {
          thinking = thinkMatch[1].trim();
          text = text.replace(/<think>[\s\S]*?<\/think>/, '').trim();
        }

        // Apply strict sanitization to guarantee NO markdown hashes (#) or asterisks (**)
        const cleanText = sanitizeOutput(text);

        console.log(`[Gemini] ✅ Response received from ${model}, length:`, cleanText.length);
        return { text: cleanText, thinking, source: 'gemini', model: model };

      } catch (err) {
        console.error(`[Gemini] ${model} Request failed:`, err.message);
        lastError = err;
        
        // If it's a network timeout, we might want to just skip to the next model
        if (err.name === 'AbortError' || err.message === 'SAFETY_BLOCK' || err.message === 'EMPTY_RESPONSE') {
          break; // Move to next model
        }
        
        // For other errors, if we are out of retries, we break and move to next model
        if (retries === 0) {
          break;
        }
        
        // Otherwise, it was caught in the retry block but thrown as Error, so break
        break;
      }
    }
  }

  console.warn('[Gemini] All models failed. Falling back to smart offline generator. Last error:', lastError?.message);
  return buildSmartFallback(userQuery, ragContext);
};

// ─── Smart Fallback — reads ALL constraints, never hardcodes ─────────────────
const buildSmartFallback = (userQuery, ragContext) => {
  const c    = ragContext?.constraints || {};
  const plan = ragContext?.localPlan;
  const gems = ragContext?.hiddenGems;

  const dests    = c.allDestinations?.length > 0 ? c.allDestinations : [c.destination || 'Uttar Pradesh'];
  const days     = c.days     || plan?.days     || 3;
  const budget   = c.budget   || plan?.totalBudget || 15000;
  const travelers= c.travelers || 1;
  const isVeg    = c.prefs?.vegetarian;
  const isHeritage = c.prefs?.heritage;
  const isFood   = c.prefs?.food;
  const multiCity = dests.length > 1;

  // Day split for multi-city
  const daysPerCity = multiCity
    ? dests.map((_, i) => Math.max(1, Math.round(days / dests.length) + (i === 0 && days % dests.length ? 1 : 0)))
    : [days];

  // Spot databases
  const spots = {
    Varanasi:  ['Dashashwamedh Ghat sunrise boat ride','Kashi Vishwanath Temple corridor','Manikarnika Ghat evening walk','Assi Ghat morning Subah-e-Banaras','Sarnath Stupa & Museum','Ramnagar Fort across river'],
    Prayagraj: ['Triveni Sangam holy dip','Allahabad Fort & Akshayavat','Anand Bhavan heritage home','Khusro Bagh gardens','Minto Park Yamuna view','Chandrashekhar Azad Park'],
    Agra:      ['Taj Mahal sunrise visit','Agra Fort royal chambers','Fatehpur Sikri ghost city','Mehtab Bagh sunset viewpoint','Chini Ka Rauza Persian tomb','Itimad-ud-Daulah baby Taj'],
    Lucknow:   ['Bara Imambara & Bhool Bhulaiya','Rumi Darwaza & Clock Tower','Chhota Imambara chandeliers','Hazratganj heritage lane','Chattar Manzil & Residency','La Martiniere College'],
    Mathura:   ['Krishna Janmabhoomi temple complex','Banke Bihari Temple Vrindavan','Prem Mandir evening musical fountain','Govardhan Hill parikrama','ISKCON Temple aarti'],
    Ayodhya:   ['Ram Janmabhoomi Mandir morning darshan','Hanuman Garhi 76 steps','Ram Ki Paidi grand evening aarti','Kanak Bhawan palace temple','Nageshwarnath Temple'],
    Sarnath:   ['Dhamek Stupa & deer park','Sarnath Archaeological Museum','Ashoka Pillar site','Mulagandhakuti Vihara'],
  };

  const breakfastOptions = {
    Agra:      ['Option 1: Shankar Sweets (Pratap Nagar) for piping hot Bedai Puri with spicy Aloo Sabzi and Jalebi', 'Option 2: Joney\'s Place near Taj South Gate for hearty banana pancakes and masala chai'],
    Varanasi:  ['Option 1: Vishwanath Gali Halwai for fresh hot Kachori-Sabzi and Jalebi', 'Option 2: Assi Ghat cafe for apple pie, ginger lemon honey tea and Subah-e-Banaras vibes'],
    Lucknow:   ['Option 1: Netram / Bajpai Kachori Bhandar (Hazratganj) for crispy Poori-Chhole and lassi', 'Option 2: Sharma Tea Stall (Lalbagh) for Bun-Makkhan and saffron Kulhad Chai'],
    Mathura:   ['Option 1: Shankar Mithaiwala for Dubki wale Aloo with crisp kachoris', 'Option 2: Brijwasi Sweets for fresh rabri-jalebi and hot milk'],
    Prayagraj: ['Option 1: Netram Mulchand & Sons (Katra) for pure desi ghee Kachori-Thali', 'Option 2: Loknath Gali breakfast stall for Dahi-Jalebi'],
    Ayodhya:   ['Option 1: Maurya Mishthan Bhandar for spicy Mawa Kachori and Bedmi Puri', 'Option 2: Saryu Ghat Tea Stall for roasted chana and kulhad ginger chai'],
  };

  const lunchOptions = {
    Agra:      ['Option 1 (Heritage local): Pinch of Spice (Wazirpura) for rich paneer lababdar / dal makhani', 'Option 2 (Casual budget): Dasaprakash or Shankara Vegis rooftop overlooking Taj'],
    Varanasi:  ['Option 1 (Traditional): Keshari Restaurant near Godowlia for a grand Banarasi Thali', 'Option 2 (Cafe chill): Brown Bread Bakery for organic artisanal pizzas and rooftop breeze'],
    Lucknow:   ['Option 1 (Legendary Awadhi): Tunday Kababi (Aminabad) or Dastarkhwan (Lalbagh)', 'Option 2 (Vegetarian): Royal Cafe (Hazratganj) for the famous Giant Basket Chaat'],
    Mathura:   ['Option 1 (Sattvic Thali): Govinda\'s Restaurant inside ISKCON complex', 'Option 2 (Brij Special): Brijwasi Mithaiwala for stuffed parathas and sweet lassi'],
    Prayagraj: ['Option 1 (Heritage dining): El Chico Restaurant (Civil Lines) for royal Awadhi curries', 'Option 2 (Quick bite): Sagar Ratna for South Indian dosas and filter coffee'],
    Ayodhya:   ['Option 1 (Temple Prasad & Thali): Kanak Rasoi for pure sattvic temple thali', 'Option 2 (Modern family): Makhan Malai Restaurant for north Indian combos'],
  };

  const snackOptions = {
    Agra:      ['Devilal Petha Store (Noori Gate) for Angoori & Kesar Petha with hot kulhad chai', 'Chaat Gali at Sadar Bazaar for Agra Bhalla (crispy potato patties)'],
    Varanasi:  ['Kashi Chat Bhandar (Godowlia) for signature Tamatar Chaat and Palak Patta chaat', 'Rajbandhu Sweets for thick creamy Lassi served in earthenware kulhad'],
    Lucknow:   ['Shukla Chaat House (Hazratganj) for Matar ki Chaat and Dahi Batasha', 'Prakash Kulfi (Aminabad) for pure saffron Falooda Kulfi'],
    Mathura:   ['Radha Bihari Sweets for fresh Mathura Ke Pede and warm saffron milk', 'Banke Bihari Gali for roasted spicy Hing Kachori with tangy chutney'],
    Prayagraj: ['Singh Brothers Chaat (Lukerganj) for Dahi-Sonth Papdi Chaat', 'Katra Bazaar paan shop for royal melting Malai Paan'],
    Ayodhya:   ['Ram Ki Paidi street vendors for steaming Saryu Kulhad Chai and Samosa', 'Chandra Sweets for famous hot Balushahi'],
  };

  const dinnerOptions = {
    Agra:      ['Option 1: The Charcoal Chimney or Peshawri for candle-lit tandoori platters', 'Option 2: Joney\'s Place or Tea\'se Me for a relaxed rooftop dinner under the night sky'],
    Varanasi:  ['Option 1: Dolphin Rooftop Restaurant overlooking Man Mandir Ghat and lighted river', 'Option 2: Baati Chokha (Teliyabag) for authentic village-style roasted litti chokha in clay pots'],
    Lucknow:   ['Option 1: Falak Numa rooftop at Hotel Clarks Avadh for live ghazals and royal Biryani', 'Option 2: Wahid Biryani (Aminabad) for classic Dum Biryani and roomali rotis'],
    Mathura:   ['Option 1: 11 Flowers Rooftop Restaurant in Vrindavan for panoramic temple spires', 'Option 2: Brijwasi Royal Restaurant for rich Brij delicacies'],
    Prayagraj: ['Option 1: Eat On (Civil Lines) for succulent rolls and tandoori specials', 'Option 2: Hot Stuff (Civil Lines) for comforting wood-fired pizzas and milkshakes'],
    Ayodhya:   ['Option 1: Shri Kanak Sarkar Rasoi for peaceful temple ambience and unlimited thali', 'Option 2: Awadh Royale for modern multi-cuisine dishes'],
  };

  const smartHacks = {
    Agra:      ['Arrive at Taj Mahal East Gate at 5:45 AM to enter first and avoid 2-hour lines. Note that Taj Mahal is strictly closed every Friday.', 'Buy combo ASI monument tickets online 24h prior on your phone to skip ticket counters completely.', 'Take an electric e-rickshaw (₹50-100) between Taj Mahal and Agra Fort; it avoids tourist parking traps.'],
    Varanasi:  ['Book your morning boat ride at Assi Ghat the previous evening for ₹300-500 instead of paying inflated morning rates.', 'Visit Kashi Vishwanath via Gate 4 during Sugam Darshan afternoon slots for quickest entry without stampedes.', 'Navigate narrow Godowlia galis on foot or cycle rickshaw rather than getting stuck in car traffic.'],
    Lucknow:   ['Buy a single composite ticket at Bara Imambara that grants free entry to Chhota Imambara and Picture Gallery.', 'Visit British Residency in the afternoon when trees provide pleasant shade and peaceful breeze.', 'Take an evening stroll down Hazratganj (Ganjing) when Victorian streetlamps light up and cafes come alive.'],
    Mathura:   ['Visit Banke Bihari temple right when morning doors open (7:45 AM) or after 5:30 PM to avoid suffocating mid-day crowds.', 'Hire a shared electric auto for the Mathura-Vrindavan stretch (₹20 per seat) rather than private cabs.'],
    Prayagraj: ['Take a government-rate boat from Qila Ghat instead of unauthorized hawkers at Sangam nose for fixed safe pricing.', 'Visit Allahabad Fort Akshayavat and Patalpuri underground temple between 9:00 AM and 3:00 PM.'],
    Ayodhya:   ['Book your Ram Janmabhoomi Darshan slot online to enter through the fast-track pilgrim queue.', 'Head to Ram Ki Paidi by 6:00 PM to secure the best front steps for the magnificent laser & sound evening aarti.'],
  };

  const thinking = [
    `Reading query: "${userQuery}"`,
    ``,
    `Understanding constraints:`,
    `• Destinations: ${dests.join(', ')}`,
    `• Duration: ${days} days`,
    `• Budget: ₹${budget.toLocaleString('en-IN')} total`,
    `• Group: ${travelers} ${travelers === 1 ? 'person' : 'people'} (${c.travelType || 'not specified'})`,
    `• Format: Plain text, no markdown hashes/asterisks, full morning-afternoon-evening-dinner meal suggestions with smart visit management`,
  ].filter(Boolean).join('\n');

  let reply = `Welcome! Here is your carefully crafted ${days}-day personalized itinerary covering ${dests.join(' and ')} for ${travelers} ${travelers === 1 ? 'person' : 'people'} within ₹${budget.toLocaleString('en-IN')} total budget.\n\n`;

  let dayCount = 1;
  dests.forEach((dest, di) => {
    const destDays = daysPerCity[di];
    const destSpots = spots[dest] || [`${dest} main temple`, `${dest} heritage fort`, `${dest} riverbank view`, `${dest} cultural bazaar`];
    const destBreakfast = breakfastOptions[dest] || ['Local breakfast cafe for fresh regional specialties'];
    const destLunch = lunchOptions[dest] || ['Option 1: Traditional thali restaurant | Option 2: Comfortable modern cafe'];
    const destSnack = snackOptions[dest] || ['Famous local tea stall for kulhad chai and regional snack'];
    const destDinner = dinnerOptions[dest] || ['Option 1: Atmospheric rooftop restaurant | Option 2: Heritage family eatery'];
    const destHacks = smartHacks[dest] || ['Pre-book all entry passes online to bypass queues and start visits before 8 AM for best experience.'];

    reply += `📍 ${dest.toUpperCase()} (${destDays} ${destDays === 1 ? 'Day' : 'Days'})\n`;
    reply += `────────────────────────────────────────\n\n`;

    for (let d = 0; d < destDays; d++) {
      const morningSpot = destSpots[d * 2] || destSpots[0];
      const afternoonSpot = destSpots[d * 2 + 1] || destSpots[1];
      const eveningSpot = destSpots[d * 2 + 2] || destSpots[2] || 'Scenic sunset viewpoint and heritage walk';

      reply += `🗓️ DAY ${dayCount} — ${dest.toUpperCase()} EXPLORATION\n\n`;
      reply += `🌅 Morning Activity (06:00 AM - 09:00 AM)\n`;
      reply += `• Experience: ${morningSpot}\n`;
      reply += `• Crowd Strategy: Arrive early at opening to enjoy serene atmosphere and capture beautiful uncrowded photos.\n\n`;

      reply += `☕ Breakfast Recommendation (09:00 AM - 10:00 AM)\n`;
      destBreakfast.forEach(b => { reply += `• ${b}\n`; });
      reply += `\n`;

      reply += `🏛️ Mid-Day Exploration (10:30 AM - 01:30 PM)\n`;
      reply += `• Visit: ${afternoonSpot}\n`;
      reply += `• Route Tip: This site is grouped geographically with your morning stop to minimize transfer time across town.\n\n`;

      reply += `🍛 Lunch Suggestions (01:30 PM - 03:00 PM)\n`;
      destLunch.forEach(l => { reply += `• ${l}\n`; });
      reply += `\n`;

      reply += `🌇 Late Afternoon & Sunset (04:00 PM - 06:30 PM)\n`;
      reply += `• Highlight: ${eveningSpot}\n`;
      reply += `• Secret Viewpoint: Catch the golden hour light reflections as the sun begins to set over the historic skyline.\n\n`;

      reply += `🍢 Evening Snack & Kulhad Chai (06:30 PM - 07:30 PM)\n`;
      destSnack.forEach(s => { reply += `• ${s}\n`; });
      reply += `\n`;

      reply += `🌙 Dinner & Night Atmosphere (08:00 PM - 10:00 PM)\n`;
      destDinner.forEach(din => { reply += `• ${din}\n`; });
      reply += `\n────────────────────────────────────────\n\n`;

      dayCount++;
    }

    reply += `💡 SMART VISIT MANAGEMENT & CROWD HACKS FOR ${dest.toUpperCase()}:\n`;
    destHacks.forEach(h => { reply += `• ${h}\n`; });
    reply += `\n`;
  });

  // Cost breakdown
  const perPerson = Math.round(budget / travelers);
  reply += `💰 ESTIMATED BUDGET BREAKDOWN (₹${budget.toLocaleString('en-IN')} Total for ${travelers} ${travelers === 1 ? 'person' : 'people'})\n`;
  reply += `• Accommodation (Clean 3-star / Heritage stay): ~₹${Math.round(budget * 0.38).toLocaleString('en-IN')}\n`;
  reply += `• Meals, Breakfast, Snacks & Beverages: ~₹${Math.round(budget * 0.26).toLocaleString('en-IN')}\n`;
  reply += `• Local Transit (E-rickshaws, autos, app cabs): ~₹${Math.round(budget * 0.18).toLocaleString('en-IN')}\n`;
  reply += `• Monument Entry & Activity Passes: ~₹${Math.round(budget * 0.12).toLocaleString('en-IN')}\n`;
  reply += `• Emergency Buffer & Souvenirs: ~₹${Math.round(budget * 0.06).toLocaleString('en-IN')}\n`;
  reply += `• Average Per Person: ~₹${perPerson.toLocaleString('en-IN')}\n\n`;

  reply += `Have a wonderful and smooth journey! Let me know if you would like me to adjust pace, budget, or dining preferences.`;

  return { text: sanitizeOutput(reply), thinking, source: 'fallback', model: 'local-kb' };
};
