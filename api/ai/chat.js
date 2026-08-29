import { runRAGPipeline } from '../../server/src/services/ragPipeline.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { message = '' } = body;
    const result = await runRAGPipeline({ userQuery: message });
    return res.status(200).json({
      success: true,
      message: result.reply,
      plan: result.plan,
      itineraries: result.itineraries,
      links: result.links,
      suggestions: result.suggestions,
      pipeline: result.pipeline,
      thinking: result.thinking,
      hiddenGems: result.hiddenGems,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
