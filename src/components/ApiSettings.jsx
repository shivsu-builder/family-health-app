import { useState, useEffect } from 'react'
import { X, Key, Eye, EyeOff, CheckCircle2, ExternalLink, Sparkles } from 'lucide-react'
import { getApiKeys, saveApiKeys, getActiveAI } from '../services/aiService'

export default function ApiSettings({ onClose }) {
  const [keys, setKeys] = useState({ claude: '', gemini: '' })
  const [show, setShow] = useState({ claude: false, gemini: false })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setKeys(getApiKeys())
  }, [])

  const handleSave = () => {
    saveApiKeys(keys)
    setSaved(true)
    setTimeout(() => { setSaved(false); onClose() }, 1500)
  }

  const activeAI = getActiveAI()

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Key className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-sm leading-none">AI API Settings</h2>
              {activeAI && <p className="text-[10px] text-green-600 mt-0.5 flex items-center gap-0.5"><Sparkles className="w-3 h-3" />Active: {activeAI}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <p className="text-xs text-gray-500 leading-relaxed">
            Add your API keys to enable AI-powered chat, food photo analysis, blood pressure reading extraction, and free-text food logging. Keys are stored <strong>only on your device</strong> in localStorage.
          </p>

          {/* Claude key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <span className="w-5 h-5 bg-indigo-600 rounded text-white text-[9px] flex items-center justify-center font-bold">C</span>
                Claude API Key
              </label>
              <a href="https://console.anthropic.com/account/keys" target="_blank" rel="noopener noreferrer"
                className="text-[10px] text-indigo-500 hover:text-indigo-700 flex items-center gap-0.5 hover:underline">
                Get key <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <div className="relative">
              <input
                type={show.claude ? 'text' : 'password'}
                value={keys.claude}
                onChange={e => setKeys(k => ({ ...k, claude: e.target.value }))}
                placeholder="sk-ant-api03-..."
                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 pr-10 focus:outline-none focus:border-indigo-400 transition-colors"
              />
              <button
                onClick={() => setShow(s => ({ ...s, claude: !s.claude }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {show.claude ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              Claude Opus 4.6 — best accuracy for food analysis & health questions. Takes priority over Gemini.
            </p>
          </div>

          {/* Gemini key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <span className="w-5 h-5 bg-blue-500 rounded text-white text-[9px] flex items-center justify-center font-bold">G</span>
                Gemini API Key
              </label>
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
                className="text-[10px] text-indigo-500 hover:text-indigo-700 flex items-center gap-0.5 hover:underline">
                Get free key <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <div className="relative">
              <input
                type={show.gemini ? 'text' : 'password'}
                value={keys.gemini}
                onChange={e => setKeys(k => ({ ...k, gemini: e.target.value }))}
                placeholder="AIzaSy..."
                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 pr-10 focus:outline-none focus:border-blue-400 transition-colors"
              />
              <button
                onClick={() => setShow(s => ({ ...s, gemini: !s.gemini }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {show.gemini ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              Gemini 1.5 Flash — free tier available. Great alternative if you don't have a Claude key.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 space-y-1">
            <p className="text-[11px] font-semibold text-amber-700">How it works</p>
            <p className="text-[10px] text-amber-600">• Claude key = Claude Opus 4.6 is used for all AI features</p>
            <p className="text-[10px] text-amber-600">• Gemini key = Gemini 1.5 Flash is used as fallback</p>
            <p className="text-[10px] text-amber-600">• No keys = Keyword-based chatbot (limited responses)</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <button
            onClick={handleSave}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2
              ${saved
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 shadow-md'}`}>
            {saved
              ? <><CheckCircle2 className="w-4 h-4" /> Saved Successfully!</>
              : 'Save API Keys'}
          </button>
          <p className="text-[10px] text-gray-400 text-center mt-2">Keys never leave your device — stored in browser localStorage</p>
        </div>
      </div>
    </div>
  )
}
