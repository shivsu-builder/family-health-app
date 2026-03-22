import { useState } from 'react'
import { Flower2, TrendingUp, Brain, Clock } from 'lucide-react'
import { daughterData } from '../data/healthData'
import Panel from '../components/Panel'

export default function DaughterHealth() {
  const [activeTab, setActiveTab] = useState('height')
  const d = daughterData

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl px-5 py-2.5 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Flower2 className="w-5 h-5" />
          <div>
            <h2 className="font-bold text-base leading-none">Daughter's Health</h2>
            <p className="text-purple-100 text-xs mt-0.5">Age {d.age} · Height Growth · Mental Focus</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          {['Height Growth','Meditation','Focus'].map(t => (
            <span key={t} className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 shrink-0">
        <button
          onClick={() => setActiveTab('height')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium border text-xs transition-all
            ${activeTab === 'height' ? 'text-purple-600 bg-purple-50 border-purple-200 shadow-sm' : 'text-gray-500 bg-white border-gray-200'}`}
        >
          <TrendingUp className="w-3.5 h-3.5" /> Height Growth
        </button>
        <button
          onClick={() => setActiveTab('focus')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium border text-xs transition-all
            ${activeTab === 'focus' ? 'text-violet-600 bg-violet-50 border-violet-200 shadow-sm' : 'text-gray-500 bg-white border-gray-200'}`}
        >
          <Brain className="w-3.5 h-3.5" /> Mental Focus
        </button>
      </div>

      {/* HEIGHT TAB */}
      {activeTab === 'height' && (
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Tips */}
          <Panel title="Height Growth Tips" icon="📈">
            <div className="space-y-1.5">
              {d.heightGrowth.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg border border-purple-100">
                  <span className="w-5 h-5 bg-purple-200 text-purple-700 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</span>
                  <p className="text-[11px] text-gray-600 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </Panel>

          {/* Foods + Exercises */}
          <Panel title="Growth Foods & Exercises" icon="🥗">
            <div className="space-y-2">
              {d.heightGrowth.foods.map((cat, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-2">
                  <p className="text-[10px] font-bold text-purple-700 mb-1">{cat.category}</p>
                  <p className="text-[10px] text-gray-400 mb-1.5">{cat.why}</p>
                  <div className="flex flex-wrap gap-1">
                    {cat.items.map((item, j) => (
                      <span key={j} className="bg-purple-50 text-purple-700 text-[10px] px-2 py-0.5 rounded-full">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Exercises + Supplements + Tracker */}
          <div className="flex flex-col gap-2 min-h-0">
            <Panel title="Exercises" icon="🏊">
              <div className="space-y-1.5">
                {d.heightGrowth.exercises.map((ex, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px]">
                    <div className="flex-1 font-medium text-gray-700">{ex.name}</div>
                    <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />{ex.duration}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="Supplements" icon="💊" className="flex-1">
              <div className="space-y-1.5">
                {d.heightGrowth.supplements.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-gray-700">{s.name}</span>
                    <span className="text-purple-600 font-semibold ml-2 shrink-0">{s.dose}</span>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="Monthly Height Tracker" icon="📏">
              <div className="grid grid-cols-6 gap-1">
                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
                  <div key={m} className="text-center">
                    <p className="text-[9px] text-purple-500 font-medium">{m}</p>
                    <input type="text" placeholder="cm" className="w-full text-center text-[10px] border border-purple-100 rounded-md px-0.5 py-0.5 mt-0.5 focus:outline-none focus:border-purple-400 bg-purple-50" />
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      )}

      {/* FOCUS TAB */}
      {activeTab === 'focus' && (
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Meditation guide */}
          <Panel title="Meditation Guide" icon="🧘">
            <div className="space-y-2">
              {d.mentalFocus.meditationGuide.map((med, i) => (
                <div key={i} className="bg-violet-50 rounded-lg p-2.5 border border-violet-100">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-violet-800 text-xs">{med.name}</p>
                    <span className="text-[10px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full">{med.duration}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">{med.description}</p>
                </div>
              ))}
            </div>
          </Panel>

          {/* Focus tips */}
          <Panel title="Focus & Study Tips" icon="📚">
            <div className="space-y-1.5">
              {d.mentalFocus.focusTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 p-2 bg-indigo-50 rounded-lg">
                  <span className="w-5 h-5 bg-indigo-200 text-indigo-700 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</span>
                  <p className="text-[11px] text-gray-600 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </Panel>

          {/* Apps + tracker */}
          <div className="flex flex-col gap-2 min-h-0">
            <Panel title="Recommended Apps" icon="📱">
              <div className="space-y-2">
                {d.mentalFocus.apps.map((app, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="font-semibold text-gray-700 text-xs">{app.name}</p>
                    <p className="text-[11px] text-gray-400">{app.purpose}</p>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="Weekly Meditation Tracker" icon="✅" className="flex-1">
              <div className="space-y-2">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => (
                  <label key={day} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded accent-violet-500" />
                    <span className="text-xs text-gray-600">{day}</span>
                  </label>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      )}
    </div>
  )
}
