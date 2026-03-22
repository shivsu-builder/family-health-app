import { useMemo } from 'react'
import { Heart, Stethoscope, Flower2, Baby, ArrowRight, Wind, Droplets, TrendingUp, Brain } from 'lucide-react'
import { useHealthLog } from '../hooks/useHealthLog'
import { estimateHbA1c } from '../data/foodData'

// ── SVG health ring ───────────────────────────────────────────────────────────
function HealthRing({ value, max = 100, color, size = 46, strokeWidth = 5, label, sublabel }) {
  const r = (size - strokeWidth * 2) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(value / max, 1))
  const dash = circ * pct
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
            strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={`${dash} ${circ - dash}`} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[9px] font-bold leading-none" style={{ color }}>{label}</span>
        </div>
      </div>
      {sublabel && <p className="text-[8px] text-gray-400 text-center leading-tight">{sublabel}</p>}
    </div>
  )
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ label, value, color }) {
  return (
    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: color + '20', color }}>
      {label}: {value}
    </span>
  )
}

const reminders = [
  { emoji: '🫁', name: 'Mom',      note: 'Breathing exercises & yoga video today' },
  { emoji: '💊', name: 'Dad',      note: 'Atorvastatin tonight · 30-min walk after dinner' },
  { emoji: '🧘', name: 'Daughter', note: '5-min meditation · stretching · protein meal' },
  { emoji: '⚽', name: 'Son',      note: '60-min outdoor play · milk · bed by 8:30 PM' },
]

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard({ onNavigate }) {
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)
  const greeting = today.getHours() < 12 ? 'Good Morning' : today.getHours() < 17 ? 'Good Afternoon' : 'Good Evening'

  const { data } = useHealthLog()

  // ── Dad stats from logs ─────────────────────────────────────────────────────
  const dadStats = useMemo(() => {
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30)
    const logs30 = data.logs.filter(l => l.person === 'dad' && new Date(l.date) >= cutoff)

    const readings = logs30.flatMap(l =>
      ['fasting', 'postBreakfast', 'postLunch', 'postDinner']
        .map(k => parseFloat(l.bloodSugar?.[k]))
        .filter(v => v > 0)
    )
    const avgGlucose = readings.length ? readings.reduce((a, b) => a + b, 0) / readings.length : null
    const estHba1c = avgGlucose ? parseFloat(estimateHbA1c(avgGlucose)) : 6.2

    const medDays = logs30.filter(l => (l.medications?.taken?.length || 0) >= 2).length
    const medAdherence = logs30.length ? Math.round(medDays / logs30.length * 100) : 0
    const exerciseDays = logs30.filter(l => l.exercise?.length > 0).length

    // HbA1c progress: 6.2 is start, 5.6 is target. % progress toward target.
    const hba1cProgress = Math.max(0, Math.min(100, (6.2 - estHba1c) / (6.2 - 5.6) * 100))

    // BP stats from logs
    const bpReadings = logs30.flatMap(l => l.bpReadings || [])
      .filter(r => r.systolic && r.diastolic)
    const latestBP = bpReadings.length ? bpReadings[bpReadings.length - 1] : null

    return { estHba1c, hba1cProgress, medAdherence, exerciseDays, logsCount: logs30.length, latestBP }
  }, [data])

  // ── Mom stats ──────────────────────────────────────────────────────────────
  const momStats = useMemo(() => {
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 7)
    const logs7 = data.logs.filter(l => l.person === 'mom' && new Date(l.date) >= cutoff)
    const exerciseDays = logs7.filter(l => l.exercise?.length > 0).length
    const exercisePct = Math.round(exerciseDays / 7 * 100)
    return { exerciseDays, exercisePct }
  }, [data])

  // ── Today logged? ──────────────────────────────────────────────────────────
  const todayLogged = (person) => !!data.logs.find(l => l.person === person && l.date === todayStr)

  // ── Family member cards config ─────────────────────────────────────────────
  const familyMembers = [
    {
      id: 'mom', name: 'Mom', icon: Heart,
      gradient: 'from-pink-500 to-rose-500',
      bg: 'bg-pink-50', text: 'text-pink-600',
      focus: 'Lung Health', focusIcon: Wind,
      desc: 'Daily breathing exercises, yoga videos & lung tips',
      rings: [
        { value: momStats.exercisePct, color: '#f43f5e', label: `${momStats.exerciseDays}d`, sublabel: 'Exercise 7d' },
        { value: todayLogged('mom') ? 100 : 0, color: '#fb7185', label: todayLogged('mom') ? '✓' : '—', sublabel: 'Logged' },
      ],
      badges: [
        { label: 'Exercise', value: `${momStats.exerciseDays}/7d`, color: '#f43f5e' },
      ],
    },
    {
      id: 'dad', name: 'Dad', icon: Stethoscope,
      gradient: 'from-blue-500 to-indigo-500',
      bg: 'bg-blue-50', text: 'text-blue-600',
      focus: 'Diabetes & Heart', focusIcon: Droplets,
      desc: `HbA1c ${dadStats.estHba1c}% → target 5.6%`,
      rings: [
        {
          value: dadStats.hba1cProgress,
          color: dadStats.estHba1c <= 5.9 ? '#22c55e' : dadStats.estHba1c <= 6.1 ? '#f59e0b' : '#ef4444',
          label: `${dadStats.estHba1c}%`, sublabel: 'HbA1c'
        },
        { value: dadStats.medAdherence, color: '#3b82f6', label: `${dadStats.medAdherence}%`, sublabel: 'Meds' },
        { value: Math.min(100, dadStats.exerciseDays / 22 * 100), color: '#6366f1', label: `${dadStats.exerciseDays}d`, sublabel: 'Exercise' },
      ],
      badges: [
        { label: 'HbA1c', value: `${dadStats.estHba1c}%`, color: dadStats.estHba1c <= 6.0 ? '#22c55e' : '#ef4444' },
        { label: 'BP', value: dadStats.latestBP ? `${dadStats.latestBP.systolic}/${dadStats.latestBP.diastolic}` : 'No data', color: '#3b82f6' },
      ],
    },
    {
      id: 'daughter', name: 'Daughter', icon: Flower2,
      gradient: 'from-purple-500 to-violet-500',
      bg: 'bg-purple-50', text: 'text-purple-600',
      focus: 'Growth & Focus', focusIcon: TrendingUp,
      desc: 'Height growth · nutrition · meditation & focus',
      rings: [
        { value: 68, color: '#8b5cf6', label: '5\'2"', sublabel: 'Height' },
        { value: 75, color: '#a78bfa', label: '75%', sublabel: 'Growth goal' },
      ],
      badges: [
        { label: 'Age', value: '14 yrs', color: '#8b5cf6' },
        { label: 'Target', value: '5\'5"', color: '#a78bfa' },
      ],
    },
    {
      id: 'son', name: 'Son', icon: Baby,
      gradient: 'from-green-500 to-emerald-500',
      bg: 'bg-green-50', text: 'text-green-600',
      focus: 'Height Growth', focusIcon: Brain,
      desc: 'Daily routine · outdoor play · nutrition',
      rings: [
        { value: 60, color: '#22c55e', label: '4\'2"', sublabel: 'Height' },
        { value: 60, color: '#4ade80', label: '60%', sublabel: 'Growth goal' },
      ],
      badges: [
        { label: 'Age', value: '8 yrs', color: '#22c55e' },
        { label: 'Target', value: '5\'8"', color: '#4ade80' },
      ],
    },
  ]

  return (
    <div className="h-full flex flex-col gap-2">

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-xl px-5 py-3 text-white flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-base font-bold leading-tight">{greeting}, Family! 👨‍👩‍👧‍👦</h1>
          <p className="text-white/70 text-xs">{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="hidden sm:flex gap-2 text-center">
          {[
            { label: 'HbA1c', value: `${dadStats.estHba1c}%`, bg: dadStats.estHba1c <= 6.0 ? 'bg-green-400/30' : 'bg-white/20' },
            { label: 'Meds', value: `${dadStats.medAdherence}%`, bg: 'bg-white/20' },
            { label: 'Exercise', value: `${dadStats.exerciseDays}d`, bg: 'bg-white/20' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-lg px-3 py-1.5`}>
              <p className="text-[10px] text-white/70">{s.label}</p>
              <p className="text-sm font-bold">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Family cards + reminders */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-2">

        {/* 2×2 family cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-2">
          {familyMembers.map(m => (
            <button
              key={m.id}
              onClick={() => onNavigate(m.id)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-left hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col gap-1.5 min-h-0"
            >
              {/* Name row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 bg-gradient-to-br ${m.gradient} rounded-xl flex items-center justify-center shadow`}>
                    <m.icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm leading-none">{m.name}</p>
                    <p className={`text-[10px] ${m.text} flex items-center gap-0.5 mt-0.5`}>
                      <m.focusIcon className="w-2.5 h-2.5" />{m.focus}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </div>

              {/* Description */}
              <p className="text-[10px] text-gray-400 leading-snug line-clamp-1">{m.desc}</p>

              {/* Health rings + badges */}
              <div className="flex items-end gap-2 mt-auto">
                <div className="flex gap-2">
                  {m.rings.map((ring, i) => (
                    <HealthRing key={i} {...ring} size={44} strokeWidth={4.5} />
                  ))}
                </div>
                <div className="flex flex-col gap-1 ml-auto shrink-0">
                  {m.badges.map((b, i) => (
                    <StatusBadge key={i} {...b} />
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Reminders panel */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col min-h-0">
          <div className="px-3 py-2.5 border-b border-gray-100 shrink-0">
            <h3 className="font-semibold text-gray-700 text-sm">📋 Today's Reminders</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
            {reminders.map((r, i) => (
              <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                <span className="text-lg leading-none shrink-0">{r.emoji}</span>
                <div>
                  <p className="text-xs font-semibold text-gray-700">{r.name}</p>
                  <p className="text-[10px] text-gray-400 leading-snug">{r.note}</p>
                </div>
              </div>
            ))}

            {/* Log status */}
            <div className="border-t border-gray-100 pt-2">
              <p className="text-[10px] font-semibold text-gray-400 mb-1.5">Today's Log</p>
              <div className="space-y-1">
                {['dad', 'mom', 'daughter', 'son'].map(person => {
                  const logged = todayLogged(person)
                  const emojis = { dad: '👨', mom: '👩', daughter: '👧', son: '👦' }
                  const labels = { dad: 'Dad', mom: 'Mom', daughter: 'Daughter', son: 'Son' }
                  return (
                    <div key={person} className={`flex items-center gap-1.5 p-1.5 rounded-lg ${logged ? 'bg-green-50' : 'bg-gray-50'}`}>
                      <span className="text-xs">{emojis[person]}</span>
                      <span className="text-[10px] text-gray-600 flex-1">{labels[person]}</span>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${logged ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        {logged ? '✓ Done' : 'Pending'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <button
              onClick={() => {}}
              className="w-full text-center text-[10px] text-indigo-500 bg-indigo-50 border border-indigo-100 rounded-lg py-1.5 hover:bg-indigo-100 transition-colors font-medium">
              💡 Open Health Chatbot for AI advice
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
