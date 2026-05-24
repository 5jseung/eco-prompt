// Vercel serverless function: POST /api/generate
// Body: { prompt: string, form?: object, sections?: object[] }
// Response: { text: string }
//
// Uses Google's Gemini API to turn the structured form summary into a polished
// image-generation prompt. Set GEMINI_API_KEY in Vercel project env vars
// (or .env.local for `vercel dev`). Without a key set, this returns the local
// prompt draft as text so the frontend still has something to show.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' })
  }

  const { prompt, form, sections } = req.body || {}
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing prompt' })
  }

  const key = process.env.GEMINI_API_KEY
  if (!key) {
    return res.status(200).json({ text: prompt, note: 'GEMINI_API_KEY not configured' })
  }

  // Gemini 2.5 Flash returns text, not images.
  // Docs: https://ai.google.dev/gemini-api/docs/text-generation
  const model = 'gemini-2.5-flash'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`
  const instruction = [
    'You are a senior prompt designer for AI image-generation tools.',
    'Your job is not to concatenate labels. Transform the form inputs into a cohesive, vivid, production-ready image-generation request.',
    'The final text must be directly pasteable into a general generative AI model, so it must clearly ask the model to generate an image or artwork.',
    'Write only the final prompt text. Do not add explanations, headings, markdown, bullet points, or quotes.',
    'Start with a natural imperative phrase such as "Generate a high-quality..." or "Create a polished...", then continue with the visual details.',
    'Do not output a passive caption like "A character rendered in digital art." The prompt must tell the model what to create.',
    'Use every meaningful user-provided detail, including purpose, subject, style, context, lighting, composition, mood, and negative prompt details.',
    'When the user provides only a broad category, make it visually concrete with plausible non-critical details, such as silhouette, materials, environment, pose, atmosphere, texture, camera language, and rendering quality.',
    'Do not invent important new named subjects, real people, brands, locations, claims, or story facts. Generic visual elaboration is allowed when it helps the prompt become usable.',
    'Resolve awkward combinations into a coherent art direction instead of listing them mechanically. For example, "cool candle light" can become "cool-toned candlelight with blue shadows".',
    'Create one natural English paragraph, usually ordered as creation request, subject, pose/action, setting, style/medium, composition/camera, lighting, mood, detail quality, and intended use.',
    'Aim for 90-150 words when enough inputs are present. If inputs are sparse, still produce a useful 60-100 word prompt rather than a short label list.',
    'Keep Korean proper nouns, exact display text, or culturally specific terms unchanged when translation could distort them. Otherwise translate Korean descriptive inputs into natural English.',
    'If the negative prompt is informal or vague, rewrite it into useful image-generation constraints while preserving the intent.',
    'If a negative prompt is included, append it at the end as "Negative prompt: ...".',
    'Bad output: "A character rendered in digital art, dark mood, full-body bird-eye shot."',
    'Better output: "Generate a high-quality full-body digital illustration of an original character seen from a bird-eye perspective, posed dramatically within a shadowy environment. Use cool-toned candlelight with blue-edged shadows, layered costume details, an expressive silhouette, cinematic contrast, refined textures, and a dark atmospheric mood."',
  ].join(' ')
  const payload = {
    assembledPromptDraft: prompt,
    rawFormValues: form || null,
    sectionSchema: Array.isArray(sections)
      ? sections.map(({ id, title, required, type, fields }) => ({
          id,
          title,
          required,
          type,
          fields: fields?.map(({ id, label, type }) => ({ id, label, type })),
        }))
      : null,
  }

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: instruction }],
        },
        contents: [{
          parts: [{
            text: `Structured prompt data:\n${JSON.stringify(payload, null, 2)}`,
          }],
        }],
        generationConfig: {
          thinkingConfig: {
            thinkingBudget: 0,
          },
          temperature: 0.85,
          topP: 0.95,
          maxOutputTokens: 512,
        },
      }),
    })
    if (!r.ok) {
      const text = await r.text()
      return res.status(r.status).send(text)
    }
    const data = await r.json()
    const parts = data?.candidates?.[0]?.content?.parts || []
    const text = parts.map((p) => p.text).filter(Boolean).join('\n').trim()
    return res.status(200).json({ text: text || prompt })
  } catch (e) {
    return res.status(500).json({ error: String(e) })
  }
}
