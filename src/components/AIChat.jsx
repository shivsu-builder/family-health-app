import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, Bot, Settings, AlertCircle, Sparkles, RotateCcw } from 'lucide-react'
import { callAI, hasAnyKey, getActiveAI } from '../services/aiService'
import ApiSettings from './ApiSettings'

// ── Keyword fallback (when no API key) ────────────────────────────────────────
const KEYWORD_KB = [
  { kw: ['lung', 'breathing', 'asthma', 'copd', 'inhale', 'exhale', 'pranayama'],
    a: `**Lung Health Tips for Mom:**\n\n• **Diaphragmatic Breathing** – hand on belly, inhale 4s through nose, exhale 6s through pursed lips. 3 sets of 10 daily.\n• **Pursed-Lip Breathing** – inhale 2 counts, exhale slowly 4 counts. Great for COPD.\n• **Anulom Vilom** – alternate nostril breathing, 5 min daily.\n• **Steam inhalation** – with eucalyptus oil, 2× daily in winter.\n\n**Diet:** Turmeric, ginger, garlic, green tea, walnuts, apples.\n**Environment:** Keep air purifier running, avoid incense, open windows 6–8 AM.` },

  { kw: ['diabetes', 'blood sugar', 'glucose', 'sugar', 'hba1c', 'insulin'],
    a: `**Diabetes Management for Dad:**\n\n• **Target:** HbA1c 6.2% → 5.6% (estimated ~6 months with lifestyle changes)\n• **Diet:** Low-GI Indian foods – brown rice, moong dal, methi roti, vegetables.\n• **Exercise:** 30 min brisk walk after dinner lowers blood sugar by 30–50 mg/dL.\n• **Fasting glucose target:** 80–100 mg/dL\n• **Post-meal target:** < 140 mg/dL at 2 hours\n\n**Key foods to avoid:** White rice (in excess), maida, sugary drinks, fried snacks.\n**Best foods:** Bitter gourd (karela), fenugreek (methi), cinnamon, amla.` },

  { kw: ['heart', 'cardiac', 'calcium', 'plaque', 'statin', 'cholesterol', 'bp', 'blood pressure'],
    a: `**Heart Health for Dad (Calcium Score 13.1):**\n\n• **Risk level:** Low-to-moderate — manageable with lifestyle!\n• **Medications:** Atorvastatin 40mg (night), Valsartan 80mg (morning) — take consistently.\n• **Exercise:** 30 min moderate cardio 5×/week. Avoid high-intensity until cleared by doctor.\n• **Diet:** Mediterranean + Indian – olive oil, nuts, whole grains, lots of vegetables.\n• **Targets:** LDL < 70 mg/dL, BP < 130/80 mmHg\n\n**Avoid:** Trans fats (vanaspati), excess salt, processed foods, smoking.` },

  { kw: ['height', 'grow', 'growth', 'tall', 'hgh', 'growth hormone'],
    a: `**Height Growth Tips:**\n\n**For Daughter (14) and Son (8):**\n• **Sleep:** Growth hormone peaks 10 PM–2 AM during deep sleep. Fixed bedtime crucial!\n• **Nutrition:** Protein (eggs, paneer, dal, milk), Calcium (milk, ragi), Vitamin D (sunlight + eggs).\n• **Exercise:** Stretching, swimming, basketball, skipping rope — all promote height.\n• **Posture:** Good posture makes you appear taller and supports spine health.\n\n**Son (8):** 10–11 hours sleep, 60 min outdoor play daily.\n**Daughter (14):** 8–10 hours sleep, yoga/stretching, protein at every meal.` },

  { kw: ['meditation', 'focus', 'study', 'concentration', 'stress', 'mental', 'anxiety'],
    a: `**Meditation & Focus for Daughter (14):**\n\n• **5-4-3-2-1 Grounding** – notice 5 things you see, 4 hear, 3 touch... great before exams.\n• **Box Breathing** – inhale 4s, hold 4s, exhale 4s, hold 4s. Reduces exam anxiety instantly.\n• **Body Scan Meditation** – 10 min before sleep, improves sleep quality.\n• **Focus technique:** 25 min study, 5 min break (Pomodoro) — works well for teens.\n\n**Recommended apps:** Headspace, Calm, Insight Timer (free content available).` },

  { kw: ['supplement', 'vitamin', 'omega', 'coq10', 'magnesium', 'berberine'],
    a: `**Supplements for Dad:**\n\n• **CoQ10 100mg** – heart health, energy (especially with statin use)\n• **Omega-3 2g** – reduces triglycerides, anti-inflammatory\n• **Vitamin D3 2000 IU** – important for heart and metabolic health\n• **Magnesium Glycinate 200mg** – blood sugar regulation, sleep\n• **Berberine 500mg** (if prescribed) – natural blood sugar support\n\n⚠️ Always consult doctor before starting supplements. Some interact with Valsartan/Atorvastatin.` },
]

function keywordResponse(text) {
  const lower = text.toLowerCase()
  if (/^(hi|hello|hey|namaste|good\s)/i.test(lower.trim())) {
    return "Hello! 👋 I'm your Family Health Assistant. I can help with:\n\n• Dad's diabetes & heart health\n• Mom's lung health & breathing\n• Height growth tips for your children\n• Nutrition, exercise, and wellness\n\nAsk me anything! (Tip: Add a Claude or Gemini API key in ⚙️ Settings for real AI responses)"
  }
  if (/^(thanks|thank\s?you|thx|ty|great)/i.test(lower.trim())) {
    return "You're welcome! 😊 Consistency is the key to lasting health. Feel free to ask anything else!"
  }
  for (const entry of KEYWORD_KB) {
    if (entry.kw.some(kw => lower.includes(kw))) return entry.a
  }
  return "I don't have specific information on that topic in my offline knowledge base.\n\n💡 **Add an AI API key** (Claude or Gemini) in ⚙️ Settings to get comprehensive, personalized answers to any health question!"
}

// ── Message formatter ─────────────────────────────────────────────────────────
function MessageContent({ text }) {
  const lines = text.split('\n')
  return (
    <div className="space-y-0.5 text-[12px] leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
          return <p key={i} className="font-bold text-gray-800 mt-1.5 first:mt-0">{line.slice(2, -2)}</p>
        }
        if (line.match(/^\*\*(.+)\*\*:/)) {
          const [bold, ...rest] = line.split(':')
          return <p key={i} className="font-semibold text-gray-700 mt-1 first:mt-0"><span>{bold.replace(/\*\*/g, '')}: </span>{rest.join(':')}</p>
        }
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return (
            <div key={i} className="flex items-start gap-1.5">
              <span className="text-indigo-400 shrink-0 mt-0.5">•</span>
              <span className="text-gray-600">{line.slice(2)}</span>
            </div>
          )
        }
        if (line.match(/^\d+\.\s/)) {
          return <p key={i} className="text-gray-600 ml-3">{line}</p>
        }
        if (line === '') return <div key={i} className="h-1" />
        if (line.startsWith('⚠️')) return <p key={i} className="text-amber-600 bg-amber-50 rounded px-2 py-1 text-[11px]">{line}</p>
        if (line.startsWith('💡')) return <p key={i} className="text-indigo-600 bg-indigo-50 rounded px-2 py-1 text-[11px]">{line}</p>
        return <p key={i} className="text-gray-600">{line}</p>
      })}
    </div>
  )
}

const QUICK_QUESTIONS = [
  "What foods lower blood sugar?",
  "Best breathing exercises for lungs?",
  "Height growth tips for teens?",
  "How to reduce HbA1c naturally?",
  "Heart-healthy Indian diet?",
]

// ── Main AIChat component ─────────────────────────────────────────────────────
export default function AIChat({ onClose }) {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Hello! 👋 I'm your Family Health Assistant.\n\nI have full context about your family's health conditions:\n• **Dad** — Diabetes (HbA1c 6.2%), Heart health (Ca 13.1)\n• **Mom** — Lung health\n• **Daughter** (14) — Growth & focus\n• **Son** (8) — Growth & activities\n\nAsk me anything about health, nutrition, medications, or wellness!"
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)
  const aiName = getActiveAI()
  const hasKey = hasAnyKey()

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = useCallback(async (text) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput('')

    const userMsg = { role: 'user', content: msg }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setLoading(true)

    try {
      let response
      if (hasKey) {
        // Send last 12 messages (6 turns) for context
        const apiMessages = newMessages
          .slice(-12)
          .map(m => ({ role: m.role, content: m.content }))
        response = await callAI(apiMessages)
      } else {
        await new Promise(r => setTimeout(r, 500))
        response = keywordResponse(msg)
      }
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ ${err.message}`
      }])
    } finally {
      setLoading(false)
    }
  }, [messages, input, loading, hasKey])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared! How can I help you with your family's health today?"
    }])
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Chat panel */}
      <div className="fixed bottom-0 right-0 sm:bottom-4 sm:right-4 z-50 w-full sm:w-[420px] h-[88vh] sm:h-[620px] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-none">Health Assistant</p>
              <p className="text-white/70 text-[10px] mt-0.5">
                {hasKey ? `Powered by ${aiName} AI` : 'Keyword mode — add API key for real AI'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={clearChat}
              title="Clear chat"
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
              <RotateCcw className="w-3.5 h-3.5 text-white" />
            </button>
            <button onClick={() => setShowSettings(true)}
              title="API Settings"
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
              <Settings className="w-4 h-4 text-white" />
            </button>
            <button onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* No API key banner */}
        {!hasKey && (
          <div className="bg-amber-50 border-b border-amber-100 px-3 py-2 flex items-center gap-2 shrink-0">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <p className="text-[11px] text-amber-700 flex-1">Add Claude or Gemini API key for real AI answers.</p>
            <button onClick={() => setShowSettings(true)}
              className="text-[10px] bg-amber-200 text-amber-800 px-2.5 py-1 rounded-full hover:bg-amber-300 font-semibold shrink-0">
              Add Key
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-indigo-600" />
                </div>
              )}
              <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-sm
                ${msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-sm'
                  : 'bg-white border border-gray-100 rounded-tl-sm'}`}>
                {msg.role === 'assistant'
                  ? <MessageContent text={msg.content} />
                  : <span className="text-[12px] leading-relaxed">{msg.content}</span>}
              </div>
            </div>
          ))}

          {/* Loading dots */}
          {loading && (
            <div className="flex gap-2 justify-start">
              <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center h-3">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick questions — shown only at start */}
        {messages.length <= 1 && (
          <div className="px-3 py-2 bg-white border-t border-gray-100 shrink-0">
            <p className="text-[10px] text-gray-400 mb-1.5 font-medium">Quick questions:</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_QUESTIONS.map((q, i) => (
                <button key={i} onClick={() => send(q)}
                  className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-1 rounded-full hover:bg-indigo-100 transition-colors font-medium">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-100 p-3 bg-white shrink-0">
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a health question..."
              rows={1}
              style={{ resize: 'none' }}
              className="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-400 transition-colors bg-gray-50 min-h-[38px] max-h-[80px] overflow-y-auto"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[9px] text-gray-300 text-center mt-1.5">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* API Settings modal */}
      {showSettings && <ApiSettings onClose={() => setShowSettings(false)} />}
    </>
  )
}
