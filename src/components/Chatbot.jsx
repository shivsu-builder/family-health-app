import { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, User, Sparkles } from 'lucide-react'
import { healthFAQ } from '../data/healthData'

const quickQuestions = [
  'Lung health tips?', 'Indian diet for diabetes?', 'Reduce HbA1c?',
  'Heart plaque tips?', 'Teen height growth?', 'Child height growth?',
  'Meditation for focus?', 'Heart supplements?', 'Constipation help?', 'Blood pressure tips?',
]

const knowledgeBase = [
  ...healthFAQ,
  { q: 'lung health breathing', a: '**Breathing exercises for lung health:**\n\n1. **Diaphragmatic Breathing** – hand on belly, inhale 4s through nose, exhale 6s through pursed lips. 3 sets of 10.\n2. **Pursed-Lip Breathing** – inhale 2 counts, exhale slowly 4 counts.\n3. **4-7-8 Technique** – inhale 4, hold 7, exhale 8 counts.\n4. **Anulom Vilom** – alternate nostril breathing, 5 min daily.\n\nDo these 2–3× daily for best results.' },
  { q: 'exercise heart diabetes', a: '**For heart + diabetes:**\n\n1. Brisk walk 30 min after dinner\n2. Morning yoga 20 min (reduces cortisol)\n3. Swimming/cycling 30 min, 3×/week\n4. Light resistance training 2–3×/week\n\nKeep heart rate 50–70% of max (220 – age).' },
  { q: 'vitamin d calcium bone', a: '**Bone growth & Vitamin D:**\n\n- **Sunlight:** 15–20 min morning sun daily\n- **Food:** eggs, fortified milk, mushrooms\n- **Supplement:** 1000–2000 IU D3 if deficient\n- **K2:** Always pair with D3 to direct calcium to bones\n\nWithout adequate D, only 10–15% of dietary calcium is absorbed.' },
  { q: 'sleep growth hormone', a: '**Sleep & growth hormone:**\n\nGrowth hormone peaks during deep sleep (10 PM – 2 AM).\n\n- Children (8): 10–11 hours\n- Teens (14): 8–10 hours\n- Adults: 7–8 hours\n\n**Tips:** Fixed bedtime, no screens 1h before bed, dark cool room, warm turmeric milk.' },
  { q: 'yoga pranayama beginner', a: '**Beginner yoga routine (15 min):**\n\n1. Surya Namaskar – 5 rounds\n2. Tadasana – 1 min\n3. Bhujangasana (cobra) – 30s\n4. Shavasana – 3 min\n\n**Pranayama (10 min):**\n1. Anulom Vilom – 5 min\n2. Kapalbhati – 3 min\n3. Bhramari – 2 min' },
  { q: 'immunity boost', a: '**Boost immunity naturally:**\n\n1. Vitamin C – amla, oranges, bell peppers\n2. Vitamin D – sunlight + supplement\n3. Zinc – pumpkin seeds, chickpeas\n4. Probiotics – curd, yogurt\n5. Turmeric golden milk\n6. Tulsi tea daily\n7. 7–8 hours sleep\n8. Reduce sugar – suppresses immunity for hours' },
]

function findResponse(query) {
  const q = query.toLowerCase().trim()

  if (/^(hi|hello|hey|good\s|namaste)/i.test(q))
    return "Hello! I'm your Family Health Assistant. Ask me about lung health, diabetes, heart health, height growth, meditation, nutrition, or supplements!"

  if (/^(thanks|thank you|thx|ty)/i.test(q))
    return "You're welcome! Consistency is the key to health. Feel free to ask anything else!"

  let best = null, bestScore = 0
  for (const entry of knowledgeBase) {
    const kws = entry.q.toLowerCase().split(/\s+/)
    let score = kws.reduce((s, kw) => s + (q.includes(kw) ? (kw.length > 3 ? 2 : 1) : 0), 0)
    if (q.includes(entry.q)) score += 10
    if (score > bestScore) { bestScore = score; best = entry }
  }
  if (bestScore >= 2 && best) return best.a

  if (/mom|lung|breath/i.test(q))
    return "**Mom's lung health:**\n\n1. Diaphragmatic + pursed-lip breathing daily\n2. Anulom Vilom & Kapalbhati pranayama\n3. Anti-inflammatory foods: turmeric, ginger, tulsi\n4. Steam inhalation with eucalyptus\n\nCheck Mom's Health page for daily tips and yoga videos!"

  if (/dad|sugar|diabet|heart|plaque|cholesterol/i.test(q))
    return "**Dad's health:**\n\n- **Diabetes:** Millets, high-fiber foods, walk 30 min after meals\n- **Heart:** Atorvastatin nightly, CoQ10 + K2 supplements, LDL < 70\n\nCheck Dad's Health page for full diet, exercise & supplement plans!"

  if (/daughter|teen|focus|meditat/i.test(q))
    return "**Daughter's health:**\n\n- **Height:** 8–10h sleep, protein diet, hanging/swimming exercises\n- **Focus:** 5-min mindful breathing, Pomodoro study technique, exercise before studying\n\nCheck Daughter's Health page for detailed guides!"

  if (/son|child|kid|boy/i.test(q))
    return "**Son's health (age 8):**\n\n- 10–11h sleep (bed by 8:30 PM)\n- 60+ min outdoor play daily\n- 2 glasses milk, eggs, fruits daily\n- Monkey bars, skipping, swimming for growth\n\nCheck Son's Health page for the full daily routine!"

  return "I can help with:\n\n- 🫁 **Lung health** & breathing (Mom)\n- 🩸 **Diabetes** & Indian diet (Dad)\n- ❤️ **Heart health** & plaque (Dad)\n- 💊 **Medications & supplements**\n- 📈 **Height growth** (Daughter & Son)\n- 🧘 **Meditation & focus** (Daughter)\n- 🥗 **Nutrition** & healthy eating\n\nTry asking something specific like _\"How to reduce HbA1c?\"_"
}

export default function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm your Family Health Assistant. Ask me about lung health, diabetes, heart health, height growth, meditation, nutrition, and more. How can I help?" }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { inputRef.current?.focus() }, [])

  const send = (text) => {
    text = (text || input).trim()
    if (!text) return
    setMessages(p => [...p, { role: 'user', text }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setMessages(p => [...p, { role: 'bot', text: findResponse(text) }])
      setTyping(false)
    }, 400 + Math.random() * 600)
  }

  const fmt = (text) =>
    text.split('\n').map((line, i) => {
      const html = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
      return <p key={i} className={line === '' ? 'h-1.5' : 'leading-relaxed'} dangerouslySetInnerHTML={{ __html: html }} />
    })

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[80vh] max-h-[620px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-sm leading-none">Health Assistant</p>
              <p className="text-[10px] text-white/70">Ask me anything about family health</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
              {msg.role === 'bot' && (
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-indigo-600" />
                </div>
              )}
              <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
                <div className="text-xs space-y-0.5">{fmt(msg.text)}</div>
              </div>
              {msg.role === 'user' && (
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div className="flex items-end gap-2">
              <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <div className="chat-bubble-bot">
                <div className="flex gap-1 py-0.5">
                  {[0, 150, 300].map(d => (
                    <span key={d} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick questions */}
        {messages.length <= 2 && (
          <div className="px-3 pb-2 shrink-0">
            <p className="text-[10px] text-gray-400 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Quick questions:
            </p>
            <div className="flex flex-wrap gap-1">
              {quickQuestions.map((q, i) => (
                <button key={i} onClick={() => send(q)}
                  className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask a health question..."
              className="flex-1 px-3 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-xs"
            />
            <button onClick={() => send()} disabled={!input.trim()}
              className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-40">
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[9px] text-gray-400 mt-1.5 text-center">General health info only — always consult a doctor for medical advice.</p>
        </div>
      </div>
    </div>
  )
}
