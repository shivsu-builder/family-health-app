import { useState } from 'react'
import { Stethoscope, Heart, Droplets, Pill, CheckCircle2, AlertTriangle, Clock, Activity } from 'lucide-react'
import { dadDiabetesData, dadHeartData, dadMedications, getTodayHeartTip } from '../data/healthData'
import { useVideoLibrary } from '../hooks/useVideoLibrary'
import { useHealthLog } from '../hooks/useHealthLog'
import Panel from '../components/Panel'
import VideoList from '../components/VideoList'
import GlucoseInsights from '../components/GlucoseInsights'

export default function DadHealth() {
  const [activeTab, setActiveTab] = useState('diabetes')
  const { library, removeVideo, addVideo } = useVideoLibrary()
  const { getLogsForPerson } = useHealthLog()
  const todayHeartTip = getTodayHeartTip()

  const tabs = [
    { id: 'diabetes',  label: 'Diabetes',      icon: Droplets, active: 'text-blue-600 bg-blue-50 border-blue-300' },
    { id: 'heart',     label: 'Heart Health',   icon: Heart,    active: 'text-red-600 bg-red-50 border-red-300' },
    { id: 'meds',      label: 'Medications',    icon: Pill,     active: 'text-purple-600 bg-purple-50 border-purple-300' },
    { id: 'glucose',   label: 'Glucose Log',    icon: Activity, active: 'text-green-600 bg-green-50 border-green-300' },
  ]

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl px-5 py-2.5 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5" />
          <div>
            <h2 className="font-bold text-base leading-none">Dad's Health Dashboard</h2>
            <p className="text-blue-100 text-xs mt-0.5">Diabetes · Heart · Medications · Glucose Log</p>
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap justify-end">
          {['HbA1c 6.2→5.6', 'Ca 13.1', '40mg Statin', '80mg Valsartan'].map(t => (
            <span key={t} className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
      </div>

      {/* Daily tip */}
      <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 shrink-0">
        <Heart className="w-3.5 h-3.5 text-red-400 shrink-0" />
        <p className="text-xs text-red-700 line-clamp-1">{todayHeartTip}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 shrink-0 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium border text-xs transition-all
              ${activeTab === t.id ? t.active + ' shadow-sm' : 'text-gray-500 bg-white border-gray-200 hover:border-gray-300'}`}>
            <t.icon className="w-3.5 h-3.5" />{t.label}
          </button>
        ))}
      </div>

      {/* ── DIABETES ── */}
      {activeTab === 'diabetes' && (
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-2">
          <Panel title="HbA1c & Blood Sugar" icon="🩸">
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-1.5 text-center">
                {[
                  { l: 'Current', v: '6.2%', cls: 'bg-red-50 text-red-700' },
                  { l: 'Target',  v: '5.6%', cls: 'bg-green-50 text-green-700' },
                  { l: 'ETA',     v: '~6 mo', cls: 'bg-blue-50 text-blue-700' },
                ].map(s => (
                  <div key={s.l} className={`rounded-lg p-2 ${s.cls}`}>
                    <p className="text-[10px] opacity-70">{s.l}</p>
                    <p className="text-base font-bold">{s.v}</p>
                  </div>
                ))}
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full" style={{ width: '65%' }} />
              </div>
              <p className="text-[10px] text-gray-400 text-center">0.6% reduction needed</p>
              {Object.entries(dadDiabetesData.sugarTracker).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-2.5 py-1.5">
                  <span className="font-medium text-gray-600">{k === 'hba1c' ? 'HbA1c' : k === 'fasting' ? 'Fasting' : 'Post-Meal'}</span>
                  <div className="text-right">
                    <span className="text-red-500 mr-2">{v.current}</span>
                    <span className="text-green-600">→ {v.target}</span>
                  </div>
                </div>
              ))}
              <div className="pt-1 space-y-1">
                <p className="text-[11px] font-semibold text-gray-600">Exercise Plan</p>
                {dadDiabetesData.exercisePlan.map((ex, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] bg-blue-50 rounded-lg px-2 py-1">
                    <Clock className="w-3 h-3 text-blue-400 shrink-0" />
                    <span className="font-medium text-blue-700 w-24 shrink-0">{ex.activity}</span>
                    <span className="text-gray-500">{ex.duration} · {ex.frequency}</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <Panel title="Indian Diet Plan" icon="🍛" className="lg:col-span-2">
            <div className="space-y-2">
              {dadDiabetesData.indianDietSuggestions.map((meal, i) => (
                <div key={i} className="border border-gray-100 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between bg-gray-50 px-3 py-1.5">
                    <span className="text-xs font-semibold text-gray-700">{meal.meal}</span>
                    <span className="text-[10px] text-gray-400">{meal.portion}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 px-3 py-2">
                    <div>
                      <p className="text-[10px] font-semibold text-green-600 flex items-center gap-0.5 mb-1">
                        <CheckCircle2 className="w-3 h-3" /> Good
                      </p>
                      <ul className="space-y-0.5">
                        {meal.good.slice(0, 4).map((g, j) => (
                          <li key={j} className="flex items-center gap-1 text-[11px] text-gray-600">
                            <span className="w-1 h-1 bg-green-400 rounded-full shrink-0" />{g}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-red-500 flex items-center gap-0.5 mb-1">
                        <AlertTriangle className="w-3 h-3" /> Avoid
                      </p>
                      <ul className="space-y-0.5">
                        {meal.avoid.slice(0, 4).map((a, j) => (
                          <li key={j} className="flex items-center gap-1 text-[11px] text-gray-600">
                            <span className="w-1 h-1 bg-red-400 rounded-full shrink-0" />{a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {/* ── HEART ── */}
      {activeTab === 'heart' && (
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-2">
          <div className="flex flex-col gap-2 min-h-0">
            <Panel title="Heart Status" icon="❤️">
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { l: 'Ca Score', v: '13.1',    cls: 'bg-amber-50 text-amber-700' },
                  { l: 'Soft Plaque', v: '20-40%', cls: 'bg-orange-50 text-orange-700' },
                  { l: 'Statin',    v: '40mg',    cls: 'bg-blue-50 text-blue-700' },
                  { l: 'Risk',      v: 'Low-Mod', cls: 'bg-green-50 text-green-700' },
                ].map(s => (
                  <div key={s.l} className={`rounded-lg p-2 text-center ${s.cls}`}>
                    <p className="text-[10px] opacity-70">{s.l}</p>
                    <p className="font-bold text-sm">{s.v}</p>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="Weekly Exercise" icon="🏋️" className="flex-1">
              <div className="space-y-1">
                {dadHeartData.weeklyPlan.exercise.map((d, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px]">
                    <span className="font-bold text-indigo-600 w-9 shrink-0">{d.day.slice(0, 3)}</span>
                    <span className="text-gray-600">{d.activity}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <Panel title="Do's & Don'ts" icon="📋">
            <div className="space-y-1.5">
              {dadHeartData.doList.slice(0, 6).map((item, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[11px]">
                  <span className="text-green-500 shrink-0 font-bold">✓</span>
                  <span className="text-gray-600">{item}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-1.5 mt-1.5 space-y-1.5">
                {dadHeartData.dontList.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[11px]">
                    <span className="text-red-500 shrink-0 font-bold">✗</span>
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <Panel title="Health Videos" icon="▶️" bodyClass="p-2">
            <VideoList
              videos={library.dad}
              person="dad"
              onRemove={(id)    => removeVideo('dad', id)}
              onAdd={(video)    => addVideo('dad', video)}
            />
          </Panel>
        </div>
      )}

      {/* ── MEDICATIONS ── */}
      {activeTab === 'meds' && (
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-2">
          <Panel title="Current Medications" icon="💊">
            <div className="space-y-2">
              {dadMedications.current.map((m, i) => (
                <div key={i} className="bg-purple-50 rounded-lg p-2.5 border border-purple-100">
                  <p className="font-bold text-purple-800 text-sm">{m.name}</p>
                  <p className="text-lg font-bold text-purple-600">{m.dose}</p>
                  <div className="flex items-center gap-1 text-[11px] text-purple-400">
                    <Clock className="w-3 h-3" />{m.timing}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">{m.purpose}</p>
                </div>
              ))}
              <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-100">
                <p className="text-[11px] font-semibold text-amber-700 mb-1">⚠️ Notes</p>
                {dadMedications.importantNotes.slice(0, 3).map((n, i) => (
                  <p key={i} className="text-[10px] text-amber-600 flex items-start gap-1 mb-0.5">
                    <span className="shrink-0">•</span>{n}
                  </p>
                ))}
              </div>
            </div>
          </Panel>

          <Panel title="Recommended Supplements" icon="🌿" className="lg:col-span-2">
            <div className="space-y-1.5">
              {dadMedications.suggestedSupplements.map((s, i) => (
                <div key={i} className={`flex items-start justify-between rounded-lg px-3 py-2 border gap-2
                  ${s.priority === 'High' ? 'bg-green-50 border-green-100' : s.priority === 'Current' ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-gray-800 text-xs">{s.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium
                        ${s.priority === 'High' ? 'bg-green-200 text-green-700' : s.priority === 'Current' ? 'bg-blue-200 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                        {s.priority}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{s.reason}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[11px] font-medium text-gray-700">{s.dose}</p>
                    <p className="text-[10px] text-gray-400">{s.timing}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {/* ── GLUCOSE LOG ── */}
      {activeTab === 'glucose' && (
        <div className="flex-1 min-h-0">
          <GlucoseInsights getLogsForPerson={getLogsForPerson} />
        </div>
      )}
    </div>
  )
}
