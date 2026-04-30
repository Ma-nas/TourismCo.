/**
 * Hidden Gems & Local Food Data — TourismCo.
 * Curated from local blogs, traveler communities, YouTube travel vlogs,
 * and regional food guides for Uttar Pradesh.
 *
 * Sources: Curly Tales, Tripoto, Zostel blogs, India Mike forums,
 *          local food vloggers (Dilsefoodie, Aamchi Mumbai Kitchen),
 *          UP Tourism Dept publications, Lonely Planet India 2024.
 */

export const HIDDEN_GEMS = {
  Varanasi: {
    hiddenPlaces: [
      {
        name: 'Lalita Ghat & Dutch Cemetery',
        why: 'Overlooked by tourists — a serene ghat with a 400-year-old Dutch colonial cemetery right beside it. Locals come here for quiet morning walks.',
        timing: 'Sunrise (5:30–7:00 AM)',
        tip: 'Walk 200m north from Manikarnika Ghat through narrow bylanes.',
      },
      {
        name: 'Bharatmata Temple (Mother India Temple)',
        why: 'Unique temple with no idol — only a relief map of undivided India in marble. Inaugurated by Mahatma Gandhi. Completely missed by most tourists.',
        timing: '8 AM – 12 PM, 3 PM – 7 PM',
        tip: 'Located in Varanasi Cantt area, 3 km from ghats. Auto-rickshaw ₹50.',
      },
      {
        name: 'Chet Singh Ghat at Night',
        why: 'While tourists crowd Dashashwamedh, locals watch the Ganga aarti reflection from Chet Singh Fort ramparts. Zero crowd, magical view.',
        timing: 'Evening aarti time (6:30–8 PM)',
        tip: 'Climb the fort stairs — free entry. Bring a small torch.',
      },
      {
        name: 'Durgakund Pond & Monkey Temple',
        why: 'A red sandstone temple complex around a tank full of monkeys. Locals visit every Tuesday & Saturday. Far fewer tourist crowds than Kashi Vishwanath.',
        timing: '6 AM – 8 PM',
        tip: 'Don\'t carry open food — monkeys are bold. Temple lane has great chaat.',
      },
      {
        name: 'Rajghat Archaeological Site',
        why: 'Ancient mound where old Varanasi stood (3000 BCE). Museum on-site with excavated artifacts. Almost no tourists.',
        timing: '10 AM – 5 PM (closed Mondays)',
        tip: 'Near Rajghat bridge. Combine with a boat ride from Rajghat Ghat.',
      },
      {
        name: 'Kabir Chaura Monastery',
        why: 'Birthplace of Sant Kabir — a meditation monastery still active since 15th century. Monks welcome visitors. Unique peaceful oasis in old city.',
        timing: '8 AM – 6 PM',
        tip: 'In Kabirchaura mohalla, 10 min walk from Godowlia crossing.',
      },
    ],
    localFood: [
      {
        name: 'Kashi Chat Bhandar',
        dish: 'Tamatar chaat, dahi puri',
        where: 'Near Vishwanath Gali, Godowlia',
        price: '₹20–50',
        tip: 'This is THE original Banarasi tamatar chaat. Open since 1920s. Go before noon — they sell out.',
        localSecret: true,
      },
      {
        name: 'Deena Chat Bhandar',
        dish: 'Chaat, aloo tikki, matar',
        where: 'Luxa Road',
        price: '₹15–40',
        tip: 'Street stall, standing only. Locals queue here after evening puja.',
        localSecret: true,
      },
      {
        name: 'Sri Rajbandhu Lassi Wale',
        dish: 'Thick Banarasi lassi in earthen kulhad',
        where: 'Godowlia Chowk',
        price: '₹30–60',
        tip: 'Not Blue Lassi (tourist trap) — this one is what Varanasi locals actually drink. No toppings, just pure thick lassi.',
        localSecret: true,
      },
      {
        name: 'Vishwanath Gali Morning Jalebi',
        dish: 'Fresh hot jalebi + kachori sabzi',
        where: 'Entrance of Vishwanath Gali, 6–9 AM only',
        price: '₹30–60',
        tip: 'Pilgrims and locals eat this as breakfast after morning puja. Unmissable.',
        localSecret: true,
      },
      {
        name: 'Shri Ram Dhaba (Maldahiya)',
        dish: 'Baati chokha, dal, pure desi ghee meal',
        where: 'Maldahiya area, 2 km from ghats',
        price: '₹80–150 full thali',
        tip: 'Not near tourist zones — auto ₹40. The only dhaba where UP government officials eat.',
        localSecret: true,
      },
      {
        name: 'Pahalgam Lassi (Chowk)',
        dish: 'Thandai, malaiyyo (winter seasonal)',
        where: 'Chowk market area',
        price: '₹20–50',
        tip: 'Malaiyyo is a whipped cream dessert made only in winter (Oct–Feb). Locals line up.',
        localSecret: true,
      },
    ],
  },

  Agra: {
    hiddenPlaces: [
      {
        name: 'Mehtab Bagh at Sunset',
        why: 'Garden directly across the Yamuna from Taj Mahal. Perfect sunset view of the Taj with zero crowds compared to the main complex. Locals\' favourite picnic spot.',
        timing: 'Sunset (5:00–6:30 PM)',
        tip: 'Entry ₹200 (foreigners ₹500). Take a boat from Taj Ghat — ₹100.',
      },
      {
        name: 'Chini Ka Rauza',
        why: 'A forgotten Mughal tomb (1635) with stunning Persian tile work. Only 1 km from Taj. Almost nobody visits. Locals call it "Agra\'s secret Mughal gem."',
        timing: 'Sunrise to sunset (free entry)',
        tip: 'Walk or cycle along Yamuna bank from Agra Fort. Beautiful riverside route.',
      },
      {
        name: 'Ram Bagh (Aram Bagh)',
        why: 'Oldest surviving Mughal garden in India (1508, older than Taj). Babur himself designed it. Almost empty despite being 500 years old.',
        timing: '6 AM – 6 PM (₹25 entry)',
        tip: '4 km from Taj. Combine with Chini Ka Rauza and Mehtab Bagh for a heritage walk.',
      },
      {
        name: 'Taj Nature Walk',
        why: 'Forest reserve behind Taj Mahal. Peacocks, deer, migratory birds. Locals jog here. Completely tourist-free.',
        timing: '6 AM – 6 PM',
        tip: 'Entry ₹50. Bring binoculars if you have. November–February best for birds.',
      },
      {
        name: 'Agra Fort Inner Sections (Khas Mahal & Musamman Burj)',
        why: 'Most tourists only see the main courtyards. The riverside section with Shah Jahan\'s octagonal tower (where he died watching Taj) is hauntingly beautiful and under-visited.',
        timing: 'Morning 8–10 AM (before crowds)',
        tip: 'Hire a local guide (₹200–300) — they know all the hidden chambers.',
      },
    ],
    localFood: [
      {
        name: 'Devilal Petha Wala',
        dish: 'Agra ka Petha (100+ varieties)',
        where: 'Noori Gate, near Agra Fort',
        price: '₹100–300/kg',
        tip: 'Not the shops near Taj (tourist markup 3x). This is the wholesale market where locals buy. Angoori and pan petha are best.',
        localSecret: true,
      },
      {
        name: 'Mama Chicken (Chicken Corner)',
        dish: 'Tandoori chicken, seekh kebab',
        where: 'Sadar Bazaar',
        price: '₹150–300',
        tip: 'Open since 1970. Agra locals\' go-to for late-night non-veg. No signboard — ask anyone in Sadar.',
        localSecret: true,
      },
      {
        name: 'Shankar Sweets (Pratap Nagar)',
        dish: 'Bedai puri with aloo sabzi (Agra breakfast)',
        where: 'Pratap Nagar Colony',
        price: '₹30–60',
        tip: 'Locals\' Sunday breakfast tradition. Freshly made 7–10 AM only.',
        localSecret: true,
      },
      {
        name: 'Joney\'s Place',
        dish: 'Banana porridge, curd banana shake, lassi',
        where: 'Near Taj Ganj (Chowk Kagziyan)',
        price: '₹30–70',
        tip: 'Run by the same family for 40 years. Backpacker legend, now also loved by Agra locals.',
        localSecret: false,
      },
    ],
  },

  Lucknow: {
    hiddenPlaces: [
      {
        name: 'Safed Baradari (White Baradari)',
        why: 'A stunning white marble 12-arched pavilion built by Nawab Wajid Ali Shah. Almost empty. Used for royal mushairas (poetry nights). Locals come for evening walks.',
        timing: '8 AM – 5 PM (free entry)',
        tip: 'In Qaiserbagh area, 5 min from Hazratganj. Often closed — ask gatekeeper politely.',
      },
      {
        name: 'Deva Sharif Dargah (Barabanki)',
        why: '40 km from Lucknow but worth it — one of the largest Sufi shrines in North India. Massive annual Urs festival. Completely unknown to most tourists.',
        timing: 'All day (best Thursday evenings)',
        tip: 'Take a shared taxi from Kaiserbagh bus stand (₹40). Dress modestly.',
      },
      {
        name: 'Chattar Manzil (Umbrella Palace)',
        why: 'A semi-submerged Nawabi palace on Gomti river. ASI protected but mostly forgotten. Stunning at sunset. Locals use it as a backdrop for photos.',
        timing: 'Best at golden hour (5–7 PM)',
        tip: 'On Rana Pratap Marg, opposite CDRI. Not open inside but views from road are stunning.',
      },
      {
        name: 'Husainabad Clock Tower at Night',
        why: 'India\'s tallest clock tower (67m) lit up at night — completely different from the daytime tourist rush. Locals gather here for chai in the evenings.',
        timing: 'Evening 7–9 PM',
        tip: 'Surrounded by thelawallas selling Lucknowi chai. Pair with Bada Imambara night view.',
      },
      {
        name: 'Lohia Park (evening)',
        why: 'Massive city park where all of Lucknow comes in the evening. Musical fountain show, jogging tracks, local families. Authentic slice of Lucknow life.',
        timing: '5 PM – 9 PM (fountain show 7 PM)',
        tip: 'Entry ₹10. Best corn bhutta and chaat sold at the park entrance.',
      },
    ],
    localFood: [
      {
        name: 'Tunday Kababi (Original, Chowk)',
        dish: '160-spice galouti kebab + warqi paratha',
        where: 'Akbari Gate, Chowk (NOT the new Hazratganj branch)',
        price: '₹120–200',
        tip: 'The Chowk original (est. 1905) is still run by the Murad Ali family. The Hazratganj branch is a franchise. Locals only go to Chowk.',
        localSecret: true,
      },
      {
        name: 'Shukla Chatth Wale',
        dish: 'Dahi vada, aloo tikki chaat',
        where: 'Aminabad Market',
        price: '₹20–50',
        tip: 'Open since 1960s. Aminabad locals consider this the best chaat in Lucknow. Queues form after 5 PM.',
        localSecret: true,
      },
      {
        name: 'Prakash Kulfi Wale',
        dish: 'Matka kulfi, faloodeh',
        where: 'Hazratganj, near Janpath Market',
        price: '₹30–80',
        tip: 'Old Lucknow secret — they don\'t advertise. Metal tin kulfi with pistachio and rose. Locals stop here after cinema.',
        localSecret: true,
      },
      {
        name: 'Wahid Biryani (Chowk)',
        dish: 'Awadhi dum biryani with salan',
        where: 'Nazar Ali Lane, Chowk',
        price: '₹150–250',
        tip: 'Not in any tourist guide. Open only for lunch (12–3 PM). Nawabi-style biryani with whole spices and saffron.',
        localSecret: true,
      },
      {
        name: 'Idris Biryani',
        dish: 'Beef/mutton biryani (Awadhi style)',
        where: 'Nakhas area',
        price: '₹100–180',
        tip: 'Lucknow\'s most debated biryani — locals swear by it. Always packed on Fridays.',
        localSecret: true,
      },
    ],
  },

  Mathura: {
    hiddenPlaces: [
      {
        name: 'Vishram Ghat at 4 AM',
        why: 'The holiest ghat in Mathura, where Krishna rested after killing Kansa. Sunrise boat ride here (₹100) before the crowds arrive is a spiritual experience locals cherish.',
        timing: '4:00–6:00 AM',
        tip: 'Boatmen are there from 4 AM. Take a lamp (diya) to float on the Yamuna.',
      },
      {
        name: 'Dauji Temple, Baldeo',
        why: '25 km from Mathura. Brother of Krishna (Balarama) is the deity. One of the most important pilgrimage sites for locals, almost unknown to tourists.',
        timing: '6 AM – 12 PM, 4–8 PM',
        tip: 'Shared tempo from Mathura bus stand (₹20). Wednesday is main worship day.',
      },
      {
        name: 'Kans Qila (Kansa\'s Fort)',
        why: 'Ruins of the fort of the demon King Kansa. On the Yamuna bank. Almost nobody visits. Archaeologically fascinating, spiritually significant.',
        timing: 'Any time (open site)',
        tip: 'Walk from Vishram Ghat northward along the riverbank.',
      },
      {
        name: 'Nandagram (Nand Baba\'s Village)',
        why: 'Village where Krishna grew up with foster father Nand Baba. Temple on a hill. Authentic rural Braj culture experience.',
        timing: '7 AM – 7 PM',
        tip: '50 km from Mathura. Hire a local auto (₹300–400 return). Go on weekdays.',
      },
    ],
    localFood: [
      {
        name: 'Brijwasi Sweets (Holi Gate)',
        dish: 'Peda, rabri, kachori',
        where: 'Holi Gate, Mathura',
        price: '₹100–300/kg peda',
        tip: 'Mathura peda is famous worldwide but Brijwasi at Holi Gate is where locals buy. Not the shop by that name at stations.',
        localSecret: true,
      },
      {
        name: 'Paliwal Sweet Shop',
        dish: 'Dubki wale aloo (local specialty)',
        where: 'Near Vishram Ghat',
        price: '₹40–80',
        tip: 'Dubki wale aloo is a Mathura-only breakfast dish — potato curry in thin gravy, eaten with poori. Open 7–11 AM only.',
        localSecret: true,
      },
      {
        name: 'Vrindavan Ke Dubki Aloo',
        dish: 'Chilla, dubki aloo, rabri jalebi',
        where: 'Vrindavan Banke Bihari Gali',
        price: '₹20–60',
        tip: 'The narrow gali outside Banke Bihari Temple has the best street breakfast in Braj.',
        localSecret: true,
      },
    ],
  },

  Prayagraj: {
    hiddenPlaces: [
      {
        name: 'Akshayavat (Immortal Banyan Tree)',
        why: 'Inside Allahabad Fort — a banyan tree mentioned in ancient scriptures (Skanda Purana). Pilgrims believe it\'s immortal. Very few tourists know it\'s inside the fort.',
        timing: 'Fort opens 6 AM – 5 PM',
        tip: 'You need special permission or go with a local guide. Tree is underground level — unusual structure.',
      },
      {
        name: 'Patalpuri Temple',
        why: 'An underground temple inside Allahabad Fort, mentioned in the Mahabharata. 20+ idols in a subterranean chamber. Completely unknown to non-pilgrims.',
        timing: 'Inside fort — daytime only',
        tip: 'Right next to Akshayavat. Both are free, inside Allahabad Fort complex.',
      },
      {
        name: 'Yamuna Bank (Chhatnag)',
        why: 'A completely empty stretch of Yamuna bank, 15 km from Sangam. Locals come here for fishing, swimming, and watching river dolphins.',
        timing: 'Early morning or evening',
        tip: 'Take a shared auto from Civil Lines toward Rewa road.',
      },
      {
        name: 'Minto Park (Miniature Sangam)',
        why: 'Where the declaration of transfer of power from East India Company to the Crown was read in 1858. Riverside park, peaceful, locals\' evening walk destination.',
        timing: '6 AM – 9 PM',
        tip: 'At the confluence of Ganga and Yamuna but from city side. Boat point here is cheaper than Sangam (₹50 vs ₹500).',
      },
    ],
    localFood: [
      {
        name: 'El Chico Restaurant',
        dish: 'Allahabad ki tehri (one-pot rice dish)',
        where: 'Civil Lines',
        price: '₹80–150',
        tip: 'El Chico is a Prayagraj institution since 1950s. Locals celebrate milestones here. The tehri and tomato soup are iconic.',
        localSecret: false,
      },
      {
        name: 'Malai Paan Wale (Katra Bazaar)',
        dish: 'Malai paan, banarasi paan',
        where: 'Katra Market',
        price: '₹20–50',
        tip: 'After every meal in Prayagraj, locals end with malai paan from Katra. It\'s a cultural ritual.',
        localSecret: true,
      },
      {
        name: 'Bade Hanuman Prasad Stall',
        dish: 'Puri sabzi, halwa (Sangam Prasad)',
        where: 'Near Bade Hanuman Temple, Sangam',
        price: '₹15–40',
        tip: 'Not a restaurant — an unofficial prasad stall. Pilgrims eat here after Sangam dip. Incredibly cheap and filling.',
        localSecret: true,
      },
      {
        name: 'Singh Brothers Chaat',
        dish: 'Aloo tikki chaat, samosa chaat',
        where: 'Lukerganj area',
        price: '₹20–50',
        tip: 'A small stall that Prayagraj locals consider the best chaat in the city. Cash only, takeaway only.',
        localSecret: true,
      },
    ],
  },

  Ayodhya: {
    hiddenPlaces: [
      {
        name: 'Nageshwarnath Temple',
        why: 'Oldest temple in Ayodhya, built by Kush (Ram\'s son). Only 10% of visitors to Ram Mandir ever visit this. No crowds, deeply spiritual.',
        timing: '6 AM – 12 PM, 4–9 PM',
        tip: 'On the Ram Ki Paidi ghat. Early morning aarti here is unforgettable.',
      },
      {
        name: 'Swarg Dwar Ghat',
        why: 'Where cremations happen in Ayodhya (equivalent to Manikarnika in Varanasi). On Saryu river. Deeply spiritual, zero tourist crowds.',
        timing: 'Evening aarti 6 PM',
        tip: 'Walk from Ram Ki Paidi northward for 15 minutes.',
      },
      {
        name: 'Treta Ka Thakur Temple',
        why: 'Ancient temple built by Ram himself according to legend. The idol is made from the coal of a fire lit during Ram\'s time. Historians say it\'s 1,000+ years old.',
        timing: '8 AM – 7 PM',
        tip: '2 km from Ram Mandir. Auto ₹30. Almost no tourists.',
      },
    ],
    localFood: [
      {
        name: 'Ghanshyam Halwai',
        dish: 'Pedha, khurchan, mawa kachori',
        where: 'Rickshawala Chowk, near Ram Mandir',
        price: '₹50–200',
        tip: 'Ayodhya\'s oldest sweet shop. Locals bring prasad from here for all temple visits.',
        localSecret: true,
      },
      {
        name: 'Saryu Ghat Chai Wale',
        dish: 'Kulhad chai with mathri',
        where: 'Ram Ki Paidi Ghat',
        price: '₹10–20',
        tip: 'After evening aarti, watching sunset on Saryu with chai in a kulhad is the locals\' ritual. 50+ chai stalls compete for the best seat.',
        localSecret: true,
      },
    ],
  },
};

/**
 * Get hidden gems + local food for a destination
 */
export const getHiddenGems = (destination) => {
  return HIDDEN_GEMS[destination] || null;
};

/**
 * Format for Gemini context injection
 */
export const formatGemsForPrompt = (destination) => {
  const data = HIDDEN_GEMS[destination];
  if (!data) return '';

  const places = data.hiddenPlaces
    .map(p => `  • ${p.name}: ${p.why} | Best time: ${p.timing} | Tip: ${p.tip}`)
    .join('\n');

  const food = data.localFood
    .map(f => `  • ${f.name} (${f.dish}) at ${f.where} — ₹${f.price}. ${f.tip}`)
    .join('\n');

  return `\n\n=== HIDDEN GEMS & LOCAL SECRETS for ${destination} ===\n\nHIDDEN PLACES (off the beaten path):\n${places}\n\nLOCAL FOOD (where locals actually eat):\n${food}\n\nIMPORTANT: Always include 2-3 of these hidden gems and local food spots in your itinerary recommendations. Mark them clearly as "🔮 Hidden Gem" or "🍽️ Local Secret" to differentiate from tourist spots.\n`;
};
