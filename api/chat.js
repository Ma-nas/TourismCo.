import { runRAGPipeline } from '../server/src/services/ragPipeline.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { user_id = 'anonymous', message = '' } = body;

    if (!message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const result = await runRAGPipeline({ userQuery: message });

    return res.status(200).json({
      success: true,
      user_id,
      reply: result.reply,
      itineraries: result.itineraries,
      plan: result.plan,
      links: result.links,
      constraints: result.constraints,
      suggestions: result.suggestions,
      pipeline: result.pipeline,
      aiSource: result.aiSource,
      thinking: result.thinking,
      hiddenGems: result.hiddenGems,
    });
  } catch (error) {
    console.error('[Chat API Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
}
