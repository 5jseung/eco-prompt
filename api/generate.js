// Vercel serverless function: POST /api/generate
// Body: { prompt: string }
// Response: { imageBase64?: string, imageUrl?: string, text?: string }
//
// Uses Google's Gemini API. Set GEMINI_API_KEY in Vercel project env vars
// (or .env.local for `vercel dev`). Without a key set, this returns the
// prompt as text so the frontend still has something to show.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' })
  }

  const { prompt } = req.body || {}
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing prompt' })
  }

  const key = process.env.GEMINI_API_KEY
  if (!key) {
    return res.status(200).json({ text: prompt, note: 'GEMINI_API_KEY not configured' })
  }

  // Gemini 2.5 Flash Image (Nano Banana) — image generation
  // Docs: https://ai.google.dev/gemini-api/docs/image-generation
  const model = 'gemini-2.5-flash-image'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    })
    if (!r.ok) {
      const text = await r.text()
      return res.status(r.status).send(text)
    }
    const data = await r.json()
    // Find the first inline image part
    const parts = data?.candidates?.[0]?.content?.parts || []
    const imgPart = parts.find((p) => p.inlineData?.data)
    if (imgPart) {
      return res.status(200).json({ imageBase64: imgPart.inlineData.data })
    }
    // Otherwise fall through with whatever text came back
    const textPart = parts.find((p) => p.text)?.text
    return res.status(200).json({ text: textPart || prompt })
  } catch (e) {
    return res.status(500).json({ error: String(e) })
  }
}
