// AI Service — direct browser calls to Claude and Gemini APIs

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

// ── Key storage ───────────────────────────────────────────────────────────────
export function getApiKeys() {
  return {
    claude: localStorage.getItem('healthApp_claudeKey') || '',
    gemini: localStorage.getItem('healthApp_geminiKey') || '',
  }
}

export function saveApiKeys({ claude, gemini }) {
  if (claude !== undefined) localStorage.setItem('healthApp_claudeKey', claude.trim())
  if (gemini !== undefined) localStorage.setItem('healthApp_geminiKey', gemini.trim())
}

export function hasAnyKey() {
  const { claude, gemini } = getApiKeys()
  return !!(claude || gemini)
}

export function getActiveAI() {
  const { claude, gemini } = getApiKeys()
  if (claude) return 'Claude'
  if (gemini) return 'Gemini'
  return null
}

// ── System prompt ─────────────────────────────────────────────────────────────
export const HEALTH_SYSTEM_PROMPT = `You are a knowledgeable and compassionate family health assistant. Here is the family context:

**Dad** (adult male): Type 2 Diabetes (HbA1c 6.2%, target 5.6%). Coronary Artery Disease with Calcium Score 13.1 and soft plaque (20-40%). Medications: Atorvastatin 40mg (night), Valsartan 80mg (morning), Psyllium Husk. Following Indian vegetarian-leaning diet.

**Mom** (adult female): Chronic lung condition (COPD/asthma). Focus: breathing exercises, yoga, lung-friendly diet, air quality.

**Daughter** (14 years old): Focus on height growth, nutrition for growth, meditation and mental focus for studies.

**Son** (8 years old): Focus on healthy height growth, fun physical activities, good nutrition and sleep habits.

Guidelines:
- Provide evidence-based, practical health advice
- Emphasize Indian diet context when discussing nutrition
- Always recommend consulting a doctor for medical decisions
- Be concise — use bullet points and short paragraphs
- For medications, never suggest changes without doctor guidance
- Use encouraging, positive language`

// ── Claude API ────────────────────────────────────────────────────────────────
export async function callClaude(messages, systemPrompt = HEALTH_SYSTEM_PROMPT) {
  const { claude: apiKey } = getApiKeys()
  if (!apiKey) throw new Error('Claude API key not configured')

  const res = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = err?.error?.message || `API error ${res.status}`
    if (res.status === 401) throw new Error('Invalid Claude API key. Please check your key in settings.')
    if (res.status === 429) throw new Error('Rate limit reached. Please wait a moment and try again.')
    throw new Error(msg)
  }

  const data = await res.json()
  return data.content?.[0]?.text || ''
}

// ── Gemini API ────────────────────────────────────────────────────────────────
export async function callGemini(messages, systemPrompt = HEALTH_SYSTEM_PROMPT) {
  const { gemini: apiKey } = getApiKeys()
  if (!apiKey) throw new Error('Gemini API key not configured')

  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = err?.error?.message || `API error ${res.status}`
    if (res.status === 400 || res.status === 403) throw new Error('Invalid Gemini API key. Please check your key in settings.')
    throw new Error(msg)
  }

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

// ── Image analysis with Claude ─────────────────────────────────────────────────
export async function analyzeImageWithClaude(base64Image, prompt, mediaType = 'image/jpeg') {
  const { claude: apiKey } = getApiKeys()
  if (!apiKey) throw new Error('Claude API key not configured')

  const res = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Image } },
          { type: 'text', text: prompt },
        ],
      }],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error ${res.status}`)
  }
  const data = await res.json()
  return data.content?.[0]?.text || ''
}

// ── Image analysis with Gemini ─────────────────────────────────────────────────
export async function analyzeImageWithGemini(base64Image, prompt, mediaType = 'image/jpeg') {
  const { gemini: apiKey } = getApiKeys()
  if (!apiKey) throw new Error('Gemini API key not configured')

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { inline_data: { mime_type: mediaType, data: base64Image } },
          { text: prompt },
        ],
      }],
      generationConfig: { maxOutputTokens: 1024 },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error ${res.status}`)
  }
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

// ── Unified helpers ────────────────────────────────────────────────────────────
export async function callAI(messages, systemPrompt) {
  const { claude, gemini } = getApiKeys()
  if (claude) return callClaude(messages, systemPrompt)
  if (gemini) return callGemini(messages, systemPrompt)
  throw new Error('No API key configured. Please add a Claude or Gemini API key in ⚙ Settings.')
}

export async function analyzeImageWithAI(base64Image, prompt, mediaType) {
  const { claude, gemini } = getApiKeys()
  if (claude) return analyzeImageWithClaude(base64Image, prompt, mediaType)
  if (gemini) return analyzeImageWithGemini(base64Image, prompt, mediaType)
  throw new Error('No API key configured. Please add an API key in ⚙ Settings.')
}

// ── Food photo analysis ────────────────────────────────────────────────────────
const FOOD_PHOTO_PROMPT = `Analyze this food photo and identify all food items. For each item, estimate the Glycemic Index and carbohydrates per serving (typical Indian portion).

Return ONLY a valid JSON array in this exact format, no other text:
[
  {"name": "Food Name", "gi": 65, "servingCarbs": 30, "servings": 1, "unit": "serving"},
  ...
]

Use these GI reference values for common Indian foods:
- White rice: GI 72, 45g carbs per serving
- Chapati/Roti: GI 62, 15g carbs per piece
- Dal: GI 29, 20g carbs per bowl
- Idli: GI 70, 20g carbs each
- Dosa: GI 77, 25g carbs each
- Sambar: GI 35, 15g carbs per bowl
- Paratha: GI 65, 25g carbs each
- Poha: GI 58, 35g carbs per bowl
- Upma: GI 60, 30g carbs per bowl

If you cannot identify a food, make a reasonable estimate based on what you see. Be specific about Indian food names if visible.`

export async function analyzeFoodPhoto(base64Image, mediaType = 'image/jpeg') {
  const text = await analyzeImageWithAI(base64Image, FOOD_PHOTO_PROMPT, mediaType)
  // Try to extract JSON from the response
  try {
    const match = text.match(/\[[\s\S]*\]/)
    if (match) {
      const items = JSON.parse(match[0])
      return items.map((item, i) => ({
        foodId: `photo_${Date.now()}_${i}`,
        name: item.name || 'Unknown food',
        gi: Math.min(100, Math.max(1, parseInt(item.gi) || 60)),
        servingCarbs: Math.min(100, Math.max(1, parseInt(item.servingCarbs) || 20)),
        servings: parseFloat(item.servings) || 1,
        unit: item.unit || 'serving',
        fromPhoto: true,
      }))
    }
  } catch (e) {
    console.warn('Could not parse food photo JSON:', e)
  }
  return []
}

// ── Free-text food analysis ────────────────────────────────────────────────────
export async function analyzeFoodText(description) {
  const prompt = `Analyze this food description for an Indian diet context: "${description}"

Return ONLY a valid JSON array with GI and carb estimates, no other text:
[
  {"name": "Food Name", "gi": 65, "servingCarbs": 30, "servings": 1, "unit": "serving"},
  ...
]

If multiple foods are mentioned (like "2 chapati with dal and rice"), list each separately.
Use accurate Indian food GI values. Adjust servings based on quantities mentioned (e.g., "2 chapati" → servings: 2).`

  const { claude, gemini } = getApiKeys()
  let text
  if (claude) {
    text = await callClaude([{ role: 'user', content: prompt }], '')
  } else if (gemini) {
    text = await callGemini([{ role: 'user', content: prompt }], '')
  } else {
    throw new Error('No API key configured')
  }

  try {
    const match = text.match(/\[[\s\S]*\]/)
    if (match) {
      const items = JSON.parse(match[0])
      return items.map((item, i) => ({
        foodId: `text_${Date.now()}_${i}`,
        name: item.name || description,
        gi: Math.min(100, Math.max(1, parseInt(item.gi) || 60)),
        servingCarbs: Math.min(100, Math.max(1, parseInt(item.servingCarbs) || 20)),
        servings: parseFloat(item.servings) || 1,
        unit: item.unit || 'serving',
        fromText: true,
      }))
    }
  } catch (e) {
    console.warn('Could not parse food text JSON:', e)
  }
  return []
}

// ── BP photo analysis ─────────────────────────────────────────────────────────
export async function analyzeBPPhoto(base64Image, mediaType = 'image/jpeg') {
  const prompt = `This is an image of a blood pressure monitor display. Extract the readings shown.

Return ONLY valid JSON, no other text:
{"systolic": 120, "diastolic": 80, "pulse": 72}

- systolic = upper/larger number (SYS or mmHg)
- diastolic = lower/smaller number (DIA)
- pulse = heart rate (BPM or pulse icon)
If any value is not visible, use null.`

  const text = await analyzeImageWithAI(base64Image, prompt, mediaType)
  try {
    const match = text.match(/\{[\s\S]*\}/)
    if (match) {
      const data = JSON.parse(match[0])
      return {
        systolic: parseInt(data.systolic) || null,
        diastolic: parseInt(data.diastolic) || null,
        pulse: parseInt(data.pulse) || null,
      }
    }
  } catch (e) {
    console.warn('Could not parse BP JSON:', e)
  }
  return { systolic: null, diastolic: null, pulse: null }
}

// ── File → base64 helper ──────────────────────────────────────────────────────
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      // Remove data URL prefix: "data:image/jpeg;base64,"
      const base64 = result.split(',')[1]
      resolve({ base64, mediaType: file.type || 'image/jpeg' })
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
