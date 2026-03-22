import { useState, useEffect, useRef, useCallback } from 'react'
import {
  ClipboardList, Utensils, Dumbbell, Pill, Droplets, Plus, Trash2,
  Save, CheckCircle2, ChevronDown, Camera, Loader2, Type, Activity, Heart,
} from 'lucide-react'
import { useHealthLog, emptyLog } from '../hooks/useHealthLog'
import { indianFoods, allFoods, estimatePostMealGlucose, exerciseTypes } from '../data/foodData'
import { analyzeFoodPhoto, analyzeFoodText, analyzeBPPhoto, fileToBase64, hasAnyKey } from '../services/aiService'
import Panel from '../components/Panel'

const PEOPLE = [
  { id: 'dad',      label: 'Dad',      emoji: '👨', color: 'bg-blue-500' },
  { id: 'mom',      label: 'Mom',      emoji: '👩', color: 'bg-pink-500' },
  { id: 'daughter', label: 'Daughter', emoji: '👧', color: 'bg-purple-500' },
  { id: 'son',      label: 'Son',      emoji: '👦', color: 'bg-green-500' },
]

const MEALS = ['breakfast', 'lunch', 'dinner', 'snacks']
const MEAL_LABELS = { breakfast: '🌅 Breakfast', lunch: '☀️ Lunch', dinner: '🌙 Dinner', snacks: '🍎 Snacks' }

const DAD_MEDS  = ['Atorvastatin 40mg (Night)', 'Valsartan 80mg (Morning)', 'Psyllium Husk (Night)']
const MOM_MEDS  = ['Inhalers (if any)', 'Vitamins/Supplements']
const INTENSITIES = ['Light', 'Moderate', 'Vigorous']

function todayStr() { return new Date().toISOString().slice(0, 10) }
function nowTimeStr() {
  const n = new Date()
  return `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`
}

// ── BP Classification ─────────────────────────────────────────────────────────
function bpCategory(sys, dia) {
  if (!sys || !dia) return null
  if (sys < 120 && dia < 80) return { label: 'Normal', color: '#22c55e' }
  if (sys < 130 && dia < 80) return { label: 'Elevated', color: '#f59e0b' }
  if (sys < 140 || dia < 90) return { label: 'Stage 1', color: '#f97316' }
  return { label: 'Stage 2', color: '#ef4444' }
}

// ── Glucose badge ─────────────────────────────────────────────────────────────
function GlucoseBadge({ foods, fasting }) {
  if (!foods?.length) return null
  const result = estimatePostMealGlucose(foods, parseFloat(fasting) || 110)
  if (!result) return null
  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[10px]"
      style={{ background: result.color + '15', borderColor: result.color + '40' }}>
      <Droplets className="w-3 h-3 shrink-0" style={{ color: result.color }} />
      <span className="font-semibold" style={{ color: result.color }}>
        Est. post-meal ~{result.estimatedPeak} mg/dL
      </span>
      <span className="text-gray-400">GL {result.glycemicLoad}</span>
    </div>
  )
}

// ── Food picker ───────────────────────────────────────────────────────────────
function FoodPicker({ foods, onChange, showGlucose, fasting }) {
  const [category, setCategory]     = useState('grains')
  const [search, setSearch]         = useState('')
  const [freeText, setFreeText]     = useState('')
  const [analyzing, setAnalyzing]   = useState(false)
  const [aiError, setAiError]       = useState('')
  const fileRef = useRef()

  const filteredFoods = search
    ? allFoods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
    : (indianFoods[category] || [])

  const addFood = (food) => {
    if (foods.some(f => f.foodId === food.id)) return
    onChange([...foods, {
      foodId: food.id, name: food.name, gi: food.gi,
      servingCarbs: food.servingCarbs, servings: 1, unit: food.unit,
    }])
  }

  const updateServings = (idx, val) => {
    const next = [...foods]
    next[idx] = { ...next[idx], servings: Math.max(0.5, parseFloat(val) || 1) }
    onChange(next)
  }

  const removeFood = (idx) => onChange(foods.filter((_, i) => i !== idx))

  // Photo analysis
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    if (!hasAnyKey()) { setAiError('Add an API key in ⚙ Settings to use photo analysis.'); return }
    setAnalyzing(true); setAiError('')
    try {
      const { base64, mediaType } = await fileToBase64(file)
      const items = await analyzeFoodPhoto(base64, mediaType)
      if (items.length === 0) {
        setAiError('Could not identify foods. Try a clearer photo.')
      } else {
        onChange([...foods, ...items])
      }
    } catch (err) {
      setAiError(err.message)
    } finally {
      setAnalyzing(false)
    }
  }

  // Free-text analysis
  const handleFreeText = async () => {
    if (!freeText.trim()) return
    if (!hasAnyKey()) { setAiError('Add an API key in ⚙ Settings to use AI food entry.'); return }
    setAnalyzing(true); setAiError('')
    try {
      const items = await analyzeFoodText(freeText.trim())
      if (items.length === 0) {
        setAiError('Could not parse food description. Try being more specific (e.g., "2 chapati, 1 bowl dal").')
      } else {
        onChange([...foods, ...items])
        setFreeText('')
      }
    } catch (err) {
      setAiError(err.message)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="space-y-2">
      {/* Selected foods */}
      {foods.length > 0 && (
        <div className="space-y-1">
          {foods.map((f, i) => (
            <div key={i} className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs ${f.fromPhoto ? 'bg-purple-50' : f.fromText ? 'bg-indigo-50' : 'bg-blue-50'}`}>
              {(f.fromPhoto || f.fromText) && (
                <span className="text-[9px] text-gray-400">{f.fromPhoto ? '📷' : '✍️'}</span>
              )}
              <span className="flex-1 text-gray-700 truncate">{f.name}</span>
              <span className="text-[9px] text-gray-400">{f.unit}</span>
              <span className="text-[9px] text-gray-500">×</span>
              <input
                type="number" min="0.5" step="0.5"
                value={f.servings}
                onChange={e => updateServings(i, e.target.value)}
                className="w-10 text-center text-xs border border-blue-200 rounded px-1 py-0.5 focus:outline-none bg-white"
              />
              <button onClick={() => removeFood(i)} className="text-gray-300 hover:text-red-500 transition-colors ml-0.5">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          {showGlucose && <GlucoseBadge foods={foods} fasting={fasting} />}
        </div>
      )}

      {/* AI tools row */}
      <div className="flex gap-1.5">
        {/* Photo upload */}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} capture="environment" />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={analyzing}
          title="Analyze food photo with AI"
          className="flex items-center gap-1 text-[10px] px-2.5 py-1.5 bg-purple-50 text-purple-600 border border-purple-100 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50">
          {analyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
          Photo
        </button>

        {/* Free-text entry */}
        <div className="flex-1 flex gap-1">
          <input
            value={freeText}
            onChange={e => setFreeText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleFreeText()}
            placeholder="e.g. 2 chapati with dal..."
            disabled={analyzing}
            className="flex-1 text-[10px] border border-indigo-100 bg-indigo-50 rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-400 placeholder-gray-400"
          />
          <button
            onClick={handleFreeText}
            disabled={!freeText.trim() || analyzing}
            title="Analyze with AI"
            className="flex items-center gap-0.5 text-[10px] px-2 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40 transition-colors">
            {analyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Type className="w-3 h-3" />}
            AI
          </button>
        </div>
      </div>

      {aiError && (
        <p className="text-[10px] text-red-500 bg-red-50 rounded-lg px-2.5 py-1.5 border border-red-100">{aiError}</p>
      )}

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search food database..."
        className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-400"
      />

      {/* Category tabs */}
      {!search && (
        <div className="flex flex-wrap gap-1">
          {Object.keys(indianFoods).map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`text-[10px] px-2 py-0.5 rounded-full capitalize transition-all
                ${category === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600'}`}>
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Food grid */}
      <div className="grid grid-cols-2 gap-1 max-h-28 overflow-y-auto pr-0.5">
        {filteredFoods.map(food => {
          const already = foods.some(f => f.foodId === food.id)
          return (
            <button key={food.id} onClick={() => !already && addFood(food)}
              className={`text-left px-2 py-1.5 rounded-lg text-[10px] border transition-all
                ${already
                  ? 'bg-blue-100 border-blue-200 text-blue-600 cursor-default'
                  : 'bg-white border-gray-100 text-gray-700 hover:bg-blue-50 hover:border-blue-200'}`}>
              <span className="font-medium block truncate">{food.name}</span>
              <span className="text-gray-400">GI {food.gi} · {food.unit}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── BP Reading row ────────────────────────────────────────────────────────────
function BPRow({ reading, onUpdate, onRemove }) {
  const cat = bpCategory(reading.systolic, reading.diastolic)
  return (
    <div className="bg-red-50 border border-red-100 rounded-xl p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-3.5 h-3.5 text-red-400" />
          <input
            type="time"
            value={reading.time || ''}
            onChange={e => onUpdate('time', e.target.value)}
            className="text-xs border border-red-200 rounded-lg px-2 py-1 focus:outline-none bg-white"
          />
          {cat && (
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{ background: cat.color + '20', color: cat.color }}>
              {cat.label}
            </span>
          )}
        </div>
        <button onClick={onRemove} className="text-gray-300 hover:text-red-500 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { key: 'systolic',  label: 'Systolic', unit: 'mmHg', normal: '< 120' },
          { key: 'diastolic', label: 'Diastolic', unit: 'mmHg', normal: '< 80' },
          { key: 'pulse',     label: 'Pulse',    unit: 'bpm',  normal: '60–100' },
        ].map(f => (
          <div key={f.key}>
            <label className="text-[9px] text-gray-500 block mb-0.5">{f.label} ({f.unit})</label>
            <input
              type="number"
              value={reading[f.key] || ''}
              onChange={e => onUpdate(f.key, e.target.value)}
              placeholder={f.normal}
              className="w-full text-xs border border-red-200 rounded-lg px-2 py-1.5 focus:outline-none bg-white text-center font-medium"
            />
          </div>
        ))}
      </div>
      <input
        value={reading.notes || ''}
        onChange={e => onUpdate('notes', e.target.value)}
        placeholder="Notes (e.g., after exercise, morning)"
        className="w-full text-[10px] border border-red-200 rounded-lg px-2.5 py-1 focus:outline-none bg-white"
      />
    </div>
  )
}

// ── Main DailyLog ─────────────────────────────────────────────────────────────
export default function DailyLog() {
  const [person, setPerson]     = useState('dad')
  const [date,   setDate]       = useState(todayStr())
  const [log,    setLog]        = useState(null)
  const [saved,  setSaved]      = useState(false)
  const [tab,    setTab]        = useState('meals')
  const [openMeal, setOpenMeal] = useState('breakfast')

  const { getLog, upsertLog, data } = useHealthLog()

  useEffect(() => {
    const existing = getLog(person, date)
    setLog(existing || emptyLog(person, date))
    setSaved(false)
  }, [person, date, data, getLog])

  const update = useCallback((path, value) => {
    setLog(prev => {
      const parts = path.split('.')
      if (parts.length === 1) return { ...prev, [parts[0]]: value }
      if (parts.length === 2) return { ...prev, [parts[0]]: { ...prev[parts[0]], [parts[1]]: value } }
      return prev
    })
    setSaved(false)
  }, [])

  const updateMeal = (meal, foods) => update(`meals.${meal}`, foods) && undefined || setLog(prev => ({ ...prev, meals: { ...prev.meals, [meal]: foods } })) || setSaved(false)

  const updateBS = (field, val) => {
    setLog(prev => ({ ...prev, bloodSugar: { ...prev.bloodSugar, [field]: val } }))
    setSaved(false)
  }

  // Exercise
  const addExercise = () => setLog(prev => ({
    ...prev, exercise: [...(prev.exercise || []), { type: 'Brisk Walking', duration: 30, intensity: 'Moderate' }]
  })) || setSaved(false)

  const updateExercise = (idx, field, val) => {
    setLog(prev => {
      const ex = [...prev.exercise]; ex[idx] = { ...ex[idx], [field]: val }
      return { ...prev, exercise: ex }
    })
    setSaved(false)
  }
  const removeExercise = (idx) => {
    setLog(prev => ({ ...prev, exercise: prev.exercise.filter((_, i) => i !== idx) }))
    setSaved(false)
  }

  // Medications
  const toggleMed = (med) => {
    setLog(prev => {
      const taken = prev.medications?.taken || []
      return { ...prev, medications: { ...prev.medications, taken: taken.includes(med) ? taken.filter(m => m !== med) : [...taken, med] } }
    })
    setSaved(false)
  }

  // BP readings
  const addBP = () => {
    setLog(prev => ({ ...prev, bpReadings: [...(prev.bpReadings || []), { time: nowTimeStr(), systolic: '', diastolic: '', pulse: '', notes: '' }] }))
    setSaved(false)
  }
  const updateBP = (idx, field, val) => {
    setLog(prev => {
      const bp = [...(prev.bpReadings || [])]; bp[idx] = { ...bp[idx], [field]: val }
      return { ...prev, bpReadings: bp }
    })
    setSaved(false)
  }
  const removeBP = (idx) => {
    setLog(prev => ({ ...prev, bpReadings: (prev.bpReadings || []).filter((_, i) => i !== idx) }))
    setSaved(false)
  }

  // BP photo
  const bpFileRef = useRef()
  const [bpPhotoLoading, setBpPhotoLoading] = useState(false)
  const [bpPhotoError,   setBpPhotoError]   = useState('')
  const handleBPPhoto = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    e.target.value = ''
    if (!hasAnyKey()) { setBpPhotoError('Add an API key in ⚙ Settings to use photo analysis.'); return }
    setBpPhotoLoading(true); setBpPhotoError('')
    try {
      const { base64, mediaType } = await fileToBase64(file)
      const result = await analyzeBPPhoto(base64, mediaType)
      if (!result.systolic && !result.diastolic) {
        setBpPhotoError('Could not read values. Make sure the display is clearly visible.')
      } else {
        setLog(prev => ({
          ...prev,
          bpReadings: [...(prev.bpReadings || []), {
            time: nowTimeStr(),
            systolic: result.systolic || '',
            diastolic: result.diastolic || '',
            pulse: result.pulse || '',
            notes: 'From photo',
          }]
        }))
        setSaved(false)
      }
    } catch (err) {
      setBpPhotoError(err.message)
    } finally {
      setBpPhotoLoading(false)
    }
  }

  const save = () => {
    if (!log) return
    upsertLog(log)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const meds = person === 'dad' ? DAD_MEDS : person === 'mom' ? MOM_MEDS : []
  const fasting = log?.bloodSugar?.fasting || ''

  const recentLogs = data.logs
    .filter(l => l.person === person)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7)

  const tabs = [
    { id: 'meals',    label: 'Meals',        icon: Utensils },
    { id: 'bp',       label: 'Blood Pressure', icon: Activity },
    { id: 'exercise', label: 'Exercise',     icon: Dumbbell },
    { id: 'meds',     label: 'Medications',  icon: Pill },
    { id: 'history',  label: 'History',      icon: ClipboardList },
  ]

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl px-5 py-2.5 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5" />
          <div>
            <h2 className="font-bold text-base leading-none">Daily Health Log</h2>
            <p className="text-teal-100 text-xs mt-0.5">Meals · Blood Pressure · Exercise · Medications</p>
          </div>
        </div>
        <input
          type="date" value={date}
          onChange={e => setDate(e.target.value)}
          className="text-xs bg-white/20 border border-white/30 rounded-lg px-2 py-1 text-white focus:outline-none focus:bg-white/30"
        />
      </div>

      {/* Person selector + save */}
      <div className="flex items-center justify-between gap-2 shrink-0">
        <div className="flex gap-1.5 flex-wrap">
          {PEOPLE.map(p => (
            <button key={p.id} onClick={() => setPerson(p.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all
                ${person === p.id ? `${p.color} text-white border-transparent shadow-sm` : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
              {p.emoji} {p.label}
            </button>
          ))}
        </div>
        <button onClick={save}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-medium transition-all shrink-0
            ${saved ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm'}`}>
          {saved ? <><CheckCircle2 className="w-3.5 h-3.5" /> Saved!</> : <><Save className="w-3.5 h-3.5" /> Save Log</>}
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 shrink-0 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all
              ${tab === t.id ? 'bg-teal-600 text-white border-teal-600 shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
            <t.icon className="w-3 h-3" />{t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {log && (
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-2">

          {/* ── MEALS TAB ─────────────────────────────────────────────────── */}
          {tab === 'meals' && (
            <>
              <div className="lg:col-span-2 overflow-y-auto space-y-2 pr-0.5">
                {MEALS.map(meal => (
                  <div key={meal} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <button
                      onClick={() => setOpenMeal(openMeal === meal ? null : meal)}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-700">{MEAL_LABELS[meal]}</span>
                        {log.meals[meal]?.length > 0 && (
                          <span className="bg-teal-100 text-teal-700 text-[10px] px-2 py-0.5 rounded-full">
                            {log.meals[meal].length} item{log.meals[meal].length !== 1 ? 's' : ''}
                          </span>
                        )}
                        {/* Photo badge */}
                        {log.meals[meal]?.some(f => f.fromPhoto) && (
                          <span className="bg-purple-100 text-purple-600 text-[9px] px-1.5 py-0.5 rounded-full">📷 AI</span>
                        )}
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openMeal === meal ? 'rotate-180' : ''}`} />
                    </button>

                    {openMeal === meal && (
                      <div className="px-4 pb-3 border-t border-gray-100 pt-3 space-y-2">
                        <FoodPicker
                          foods={log.meals[meal] || []}
                          onChange={foods => {
                            setLog(prev => ({ ...prev, meals: { ...prev.meals, [meal]: foods } }))
                            setSaved(false)
                          }}
                          showGlucose={person === 'dad'}
                          fasting={fasting}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Blood sugar readings */}
              <Panel title="Blood Sugar" icon="🩸">
                <div className="space-y-3">
                  <p className="text-[10px] text-gray-400">Enter actual readings (mg/dL). Leave blank to use food estimates.</p>
                  {[
                    { key: 'fasting',       label: 'Fasting (morning)',  target: '80–100' },
                    { key: 'postBreakfast', label: 'Post-Breakfast',      target: '< 140' },
                    { key: 'postLunch',     label: 'Post-Lunch',          target: '< 140' },
                    { key: 'postDinner',    label: 'Post-Dinner',         target: '< 140' },
                  ].map(f => (
                    <div key={f.key}>
                      <div className="flex justify-between items-center mb-0.5">
                        <label className="text-[11px] font-medium text-gray-600">{f.label}</label>
                        <span className="text-[9px] text-gray-400">Target: {f.target}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number" min="40" max="600"
                          value={log.bloodSugar?.[f.key] || ''}
                          onChange={e => updateBS(f.key, e.target.value)}
                          placeholder="mg/dL"
                          className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-400"
                        />
                        {log.bloodSugar?.[f.key] && (() => {
                          const v = parseFloat(log.bloodSugar[f.key])
                          const [c, l] = v < 140 ? ['#22c55e', '✓ Good'] : v < 180 ? ['#f59e0b', 'Elevated'] : ['#ef4444', 'High']
                          return <span className="text-[10px] font-semibold" style={{ color: c }}>{l}</span>
                        })()}
                      </div>
                    </div>
                  ))}
                  <div className="pt-1 border-t border-gray-100">
                    <label className="text-[11px] font-medium text-gray-600">Notes</label>
                    <textarea
                      value={log.notes || ''}
                      onChange={e => setLog(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="How are you feeling today?"
                      rows={2}
                      className="w-full mt-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-400 resize-none"
                    />
                  </div>
                </div>
              </Panel>
            </>
          )}

          {/* ── BLOOD PRESSURE TAB ────────────────────────────────────────── */}
          {tab === 'bp' && (
            <>
              <div className="lg:col-span-2 overflow-y-auto space-y-2 pr-0.5">
                <Panel title="Blood Pressure Log" icon="❤️">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {/* Add manually */}
                      <button onClick={addBP}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-sm">
                        <Plus className="w-3.5 h-3.5" /> Add Reading
                      </button>
                      {/* Upload photo */}
                      <input ref={bpFileRef} type="file" accept="image/*" className="hidden" onChange={handleBPPhoto} capture="environment" />
                      <button
                        onClick={() => bpFileRef.current?.click()}
                        disabled={bpPhotoLoading}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-purple-100 text-purple-700 border border-purple-200 rounded-xl hover:bg-purple-200 transition-colors">
                        {bpPhotoLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                        Photo of Monitor
                      </button>
                    </div>

                    {bpPhotoError && (
                      <p className="text-[11px] text-red-500 bg-red-50 rounded-lg px-2.5 py-1.5 border border-red-100">{bpPhotoError}</p>
                    )}

                    {(!log.bpReadings || log.bpReadings.length === 0) ? (
                      <div className="text-center py-6">
                        <Activity className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">No BP readings yet.</p>
                        <p className="text-[10px] text-gray-300 mt-1">Click "Add Reading" or photograph your BP monitor.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {(log.bpReadings || []).map((reading, i) => (
                          <BPRow
                            key={i}
                            reading={reading}
                            onUpdate={(field, val) => updateBP(i, field, val)}
                            onRemove={() => removeBP(i)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Panel>
              </div>

              {/* BP reference panel */}
              <Panel title="BP Reference Guide" icon="📊">
                <div className="space-y-2 text-[11px]">
                  {[
                    { label: 'Normal',     range: '< 120/80',    color: '#22c55e', desc: 'Healthy range. Keep it up!' },
                    { label: 'Elevated',   range: '120–129/< 80',color: '#f59e0b', desc: 'Lifestyle changes recommended.' },
                    { label: 'Stage 1',    range: '130–139/80–89',color: '#f97316', desc: 'Discuss with doctor.' },
                    { label: 'Stage 2',    range: '≥ 140/≥ 90',  color: '#ef4444', desc: 'Medical attention needed.' },
                    { label: 'Crisis',     range: '> 180/> 120', color: '#9f1239', desc: 'Seek emergency care!' },
                  ].map(b => (
                    <div key={b.label} className="flex items-start gap-2 p-2 rounded-lg border"
                      style={{ background: b.color + '10', borderColor: b.color + '30' }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: b.color }} />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-semibold" style={{ color: b.color }}>{b.label}</span>
                          <span className="text-gray-500 font-mono text-[10px]">{b.range}</span>
                        </div>
                        <p className="text-gray-500">{b.desc}</p>
                      </div>
                    </div>
                  ))}

                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 mt-2">
                    <p className="font-semibold text-blue-700 mb-1">Tips for accurate readings:</p>
                    {['Sit quietly 5 min before measuring', 'Same arm each time', 'Morning before medication is best', 'Avoid caffeine 30 min before'].map((t, i) => (
                      <p key={i} className="text-blue-600 flex items-center gap-1"><span>•</span>{t}</p>
                    ))}
                  </div>

                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-2">
                    <p className="font-semibold text-amber-700 mb-1">Dad's target</p>
                    <p className="text-amber-600">On Valsartan 80mg. Target BP: &lt; 130/80 mmHg</p>
                  </div>
                </div>
              </Panel>
            </>
          )}

          {/* ── EXERCISE TAB ──────────────────────────────────────────────── */}
          {tab === 'exercise' && (
            <>
              <div className="lg:col-span-2">
                <Panel title="Exercise Logged" icon="🏃">
                  <div className="space-y-2">
                    {!(log.exercise?.length) && (
                      <p className="text-xs text-gray-400 text-center py-3">No exercise logged yet.</p>
                    )}
                    {(log.exercise || []).map((ex, i) => (
                      <div key={i} className="grid grid-cols-3 gap-2 bg-orange-50 rounded-xl p-3 border border-orange-100">
                        <div>
                          <label className="text-[10px] text-gray-500 mb-1 block">Activity</label>
                          <select value={ex.type} onChange={e => updateExercise(i, 'type', e.target.value)}
                            className="w-full text-xs border border-orange-200 rounded-lg px-2 py-1.5 focus:outline-none bg-white">
                            {exerciseTypes.map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 mb-1 block">Duration (min)</label>
                          <input type="number" min="5" max="180" value={ex.duration}
                            onChange={e => updateExercise(i, 'duration', e.target.value)}
                            className="w-full text-xs border border-orange-200 rounded-lg px-2 py-1.5 focus:outline-none bg-white" />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 mb-1 block">Intensity</label>
                          <div className="flex gap-1">
                            {INTENSITIES.map(int => (
                              <button key={int} onClick={() => updateExercise(i, 'intensity', int)}
                                className={`flex-1 text-[10px] py-1.5 rounded-lg border transition-all
                                  ${ex.intensity === int ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-500 border-orange-200 hover:bg-orange-50'}`}>
                                {int.slice(0, 3)}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button onClick={() => removeExercise(i)}
                          className="col-span-3 flex items-center gap-1 text-[10px] text-gray-400 hover:text-red-500 transition-colors justify-end">
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    ))}
                    <button onClick={addExercise}
                      className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-orange-200 rounded-xl text-xs text-orange-500 hover:bg-orange-50 transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Add Activity
                    </button>
                  </div>
                </Panel>
              </div>
              <Panel title="Exercise Benefits" icon="💪">
                <div className="space-y-2 text-[11px] text-gray-600">
                  {[
                    { act: 'Brisk Walk 30 min', benefit: 'Lowers blood sugar by 30–50 mg/dL' },
                    { act: 'Yoga 20 min', benefit: 'Reduces cortisol, improves insulin sensitivity' },
                    { act: 'Cycling 30 min', benefit: 'Improves insulin sensitivity by 20–30%' },
                    { act: 'Resistance Training', benefit: 'Muscles use glucose 24–48h after' },
                    { act: 'Swimming 30 min', benefit: 'Low impact, great for heart & joints' },
                    { act: 'Walk after meals', benefit: 'Reduces post-meal glucose spike 30%' },
                  ].map((b, i) => (
                    <div key={i} className="bg-orange-50 rounded-lg p-2 border border-orange-100">
                      <p className="font-semibold text-gray-700">{b.act}</p>
                      <p className="text-gray-500">{b.benefit}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            </>
          )}

          {/* ── MEDICATIONS TAB ───────────────────────────────────────────── */}
          {tab === 'meds' && (
            <>
              <div className="lg:col-span-2">
                <Panel title="Medication Tracker" icon="💊">
                  {meds.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">No medication schedule for {person}.</p>
                  ) : (
                    <div className="space-y-2">
                      {meds.map((med, i) => {
                        const taken = log.medications?.taken?.includes(med) || false
                        return (
                          <button key={i} onClick={() => toggleMed(med)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all
                              ${taken ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100 hover:border-green-200'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${taken ? 'bg-green-500' : 'bg-gray-200'}`}>
                              {taken && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                            <div className="text-left">
                              <p className={`text-xs font-medium ${taken ? 'text-green-700' : 'text-gray-600'}`}>{med}</p>
                              {taken && <p className="text-[10px] text-green-500">Taken ✓</p>}
                            </div>
                          </button>
                        )
                      })}
                      <div>
                        <label className="text-[11px] font-medium text-gray-600 mb-1 block">Notes / Side effects</label>
                        <textarea
                          value={log.medications?.notes || ''}
                          onChange={e => setLog(prev => ({ ...prev, medications: { ...prev.medications, notes: e.target.value } }))}
                          placeholder="Any side effects or notes today..."
                          rows={2}
                          className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-400 resize-none"
                        />
                      </div>
                    </div>
                  )}
                </Panel>
              </div>
              <Panel title="Medication Schedule" icon="🕐">
                <div className="space-y-2 text-[11px]">
                  {person === 'dad' && [
                    { time: 'Morning',   items: ['Valsartan 80mg with water', 'CoQ10 100mg with breakfast', 'Omega-3 with breakfast', 'Vitamin D3 with meal'] },
                    { time: 'Afternoon', items: ['Berberine 500mg before lunch (if prescribed)'] },
                    { time: 'Evening',   items: ['Psyllium Husk + warm water (before dinner)'] },
                    { time: 'Night',     items: ['Atorvastatin 40mg after dinner', 'Magnesium Glycinate 200mg'] },
                  ].map((slot, i) => (
                    <div key={i} className="bg-blue-50 rounded-lg p-2 border border-blue-100">
                      <p className="font-bold text-blue-700 mb-1">{slot.time}</p>
                      {slot.items.map((item, j) => (
                        <p key={j} className="text-gray-600 flex items-center gap-1"><span className="text-blue-400">•</span>{item}</p>
                      ))}
                    </div>
                  ))}
                  {person === 'mom' && (
                    <div className="bg-pink-50 rounded-lg p-2 border border-pink-100">
                      <p className="text-pink-600">Log any medications prescribed by your doctor.</p>
                    </div>
                  )}
                  {(person === 'daughter' || person === 'son') && (
                    <div className="bg-purple-50 rounded-lg p-2 border border-purple-100">
                      <p className="text-purple-600">Log any vitamins or supplements taken today.</p>
                    </div>
                  )}
                </div>
              </Panel>
            </>
          )}

          {/* ── HISTORY TAB ───────────────────────────────────────────────── */}
          {tab === 'history' && (
            <div className="lg:col-span-3">
              <Panel title={`Recent History — ${PEOPLE.find(p => p.id === person)?.label}`} icon="📅">
                {recentLogs.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">No logs yet. Start logging to see history!</p>
                ) : (
                  <div className="space-y-2">
                    {recentLogs.map(entry => {
                      const totalFoods = MEALS.reduce((a, m) => a + (entry.meals?.[m]?.length || 0), 0)
                      const exCount   = entry.exercise?.length || 0
                      const medCount  = entry.medications?.taken?.length || 0
                      const bpCount   = entry.bpReadings?.length || 0
                      const latestBP  = entry.bpReadings?.slice(-1)[0]
                      return (
                        <div key={entry.date} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="shrink-0 text-center bg-teal-100 rounded-lg px-2 py-1.5">
                            <p className="text-[10px] text-teal-600">{entry.date.slice(5, 7)}/{entry.date.slice(8, 10)}</p>
                            <p className="text-[9px] text-teal-500">{new Date(entry.date).toLocaleDateString('en', { weekday: 'short' })}</p>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap gap-1.5 mb-1">
                              {totalFoods > 0 && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">{totalFoods} foods</span>}
                              {exCount > 0   && <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">{exCount} exercise</span>}
                              {medCount > 0  && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">{medCount} meds</span>}
                              {bpCount > 0   && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">{bpCount} BP</span>}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              {entry.bloodSugar?.fasting && <span className="text-[10px] text-gray-500">Fast: <strong>{entry.bloodSugar.fasting}</strong></span>}
                              {entry.bloodSugar?.postBreakfast && <span className="text-[10px] text-gray-500">Post-B: <strong>{entry.bloodSugar.postBreakfast}</strong></span>}
                              {latestBP?.systolic && <span className="text-[10px] text-red-600">BP: <strong>{latestBP.systolic}/{latestBP.diastolic}</strong></span>}
                            </div>
                            {entry.notes && <p className="text-[10px] text-gray-400 mt-0.5 italic truncate">"{entry.notes}"</p>}
                          </div>
                          <button onClick={() => { setDate(entry.date); setTab('meals') }}
                            className="text-[10px] text-teal-600 hover:text-teal-800 shrink-0">
                            View
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Panel>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
