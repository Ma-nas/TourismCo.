export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const rawKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
  res.status(200).json({
    success: true,
    status: 'online',
    app: process.env.APP_NAME || 'TourismCo',
    region: process.env.APP_REGION || 'Uttar Pradesh',
    currency: process.env.APP_CURRENCY || 'INR',
    geminiKeyConfigured: Boolean(rawKey && rawKey.trim().length > 10),
    geminiKeyPreview: rawKey ? `${rawKey.trim().slice(0, 7)}...` : 'not_set_using_built_in_fallback',
    timestamp: new Date().toISOString()
  });
}
