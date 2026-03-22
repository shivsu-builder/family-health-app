import { Baby, Sun, Moon, Star } from 'lucide-react'
import { sonData } from '../data/healthData'
import Panel from '../components/Panel'

const emojiMap = { star: '⭐', muscle: '💪', bone: '🦴', energy: '⚡', brain: '🧠' }

export default function SonHealth() {
  const d = sonData

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl px-5 py-2.5 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Baby className="w-5 h-5" />
          <div>
            <h2 className="font-bold text-base leading-none">Son's Health</h2>
            <p className="text-green-100 text-xs mt-0.5">Age {d.age} · Building strong growth foundations</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          {['Height Growth','Fun Activities','Nutrition'].map(t => (
            <span key={t} className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
      </div>

      {/* 3-column grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-2">

        {/* Tips + Daily Routine */}
        <div className="flex flex-col gap-2 min-h-0">
          <Panel title="Height Growth Tips" icon="📈" className="flex-1">
            <div className="space-y-1.5">
              {d.heightGrowth.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 p-2 bg-green-50 rounded-lg border border-green-100">
                  <span className="w-5 h-5 bg-green-200 text-green-700 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</span>
                  <p className="text-[11px] text-gray-600 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Daily Routine */}
        <Panel title="Ideal Daily Routine" icon="🕐">
          <div className="space-y-2">
            {[
              { label: 'Morning', icon: Sun, color: 'text-yellow-500', bg: 'bg-yellow-50 border-yellow-100', items: d.heightGrowth.dailyRoutine.morning },
              { label: 'After School', icon: Star, color: 'text-orange-500', bg: 'bg-orange-50 border-orange-100', items: d.heightGrowth.dailyRoutine.afterSchool },
              { label: 'Evening', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-100', items: d.heightGrowth.dailyRoutine.evening },
            ].map(section => (
              <div key={section.label}>
                <div className="flex items-center gap-1.5 mb-1">
                  <section.icon className={`w-3.5 h-3.5 ${section.color}`} />
                  <span className="text-[11px] font-bold text-gray-600">{section.label}</span>
                </div>
                <div className="space-y-1">
                  {section.items.map((item, i) => (
                    <div key={i} className={`text-[11px] text-gray-600 px-2.5 py-1.5 rounded-lg border ${section.bg}`}>{item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Foods + Activities + Supplements + Tracker */}
        <div className="flex flex-col gap-2 min-h-0">
          <Panel title="Growth Foods" icon="🥛" className="flex-1">
            <div className="space-y-1.5">
              {d.heightGrowth.foods.map((cat, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-2">
                  <p className="text-[10px] font-bold text-green-700 mb-1">{emojiMap[cat.emoji]} {cat.category}</p>
                  <div className="flex flex-wrap gap-1">
                    {cat.items.map((item, j) => (
                      <span key={j} className="bg-green-50 text-green-700 text-[10px] px-1.5 py-0.5 rounded-full">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Fun Activities" icon="🎮">
            <div className="space-y-1">
              {d.heightGrowth.funActivities.map((a, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] bg-emerald-50 rounded-lg px-2 py-1.5">
                  <span className="font-medium text-gray-700">{a.name}</span>
                  <span className="text-emerald-600 text-[10px] ml-2 shrink-0">{a.duration}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Supplements" icon="💊">
            <div className="space-y-1">
              {d.heightGrowth.supplements.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-gray-700">{s.name}</span>
                  <span className="text-green-600 font-semibold shrink-0 ml-2">{s.dose}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Height & Weight Tracker" icon="📏">
            <div className="grid grid-cols-4 gap-1">
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
                <div key={m} className="text-center">
                  <p className="text-[9px] text-green-500 font-medium">{m}</p>
                  <input type="text" placeholder="cm" className="w-full text-center text-[9px] border border-green-100 rounded px-0.5 py-0.5 focus:outline-none focus:border-green-400 bg-green-50" />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
