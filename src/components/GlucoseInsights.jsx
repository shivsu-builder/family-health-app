import { useState, useMemo } from 'react'
import { TrendingDown, TrendingUp, Minus, Calendar } from 'lucide-react'
import { estimateHbA1c, estimatePostMealGlucose, glucoseLabel } from '../data/foodData'
import { LineChart, BarChart, HbA1cGauge } from './MiniChart'

const PERIODS = [
  { label: '7 days',  days: 7  },
  { label: '30 days', days: 30 },
  { label: '60 days', days: 60 },
  { label: '90 days', days: 90 },
]

export default function GlucoseInsights({ getLogsForPerson }) {
  const [period, setPeriod] = useState(30)

  const logs = useMemo(() => getLogsForPerson('dad', period), [getLogsForPerson, period])

  // Build daily glucose series from logs
  const dailyData = useMemo(() => {
    return logs.map(log => {
      // Use actual readings if logged, else estimate from meals
      const bs = log.bloodSugar || {}
      const fasting = parseFloat(bs.fasting) || null

      // Estimate post-meal glucose for each meal
      const mealReadings = ['postBreakfast', 'postLunch', 'postDinner'].map(k => parseFloat(bs[k]) || null).filter(Boolean)

      // If no actual readings, estimate from food log
      const estimatedPostMeals = ['breakfast', 'lunch', 'dinner'].map(meal => {
        const foods = log.meals?.[meal] || []
        if (!foods.length) return null
        const result = estimatePostMealGlucose(foods, fasting || 110)
        return result?.estimatedPeak || null
      }).filter(Boolean)

      const allReadings = [...mealReadings, ...estimatedPostMeals]
      const avgPostMeal = allReadings.length > 0
        ? Math.round(allReadings.reduce((a, b) => a + b, 0) / allReadings.length)
        : null

      // Daily average (fasting counts less, post-meal more)
      const dayAvg = fasting && avgPostMeal
        ? Math.round(fasting * 0.3 + avgPostMeal * 0.7)
        : avgPostMeal || fasting || null

      return {
        date:       log.date,
        label:      log.date.slice(5), // MM-DD
        fasting,
        avgPostMeal,
        dayAvg,
        estimated:  mealReadings.length === 0, // true if from food estimate
      }
    }).filter(d => d.dayAvg !== null)
  }, [logs])

  // Average glucose for the period
  const avgGlucose = useMemo(() => {
    if (!dailyData.length) return null
    const sum = dailyData.reduce((a, d) => a + (d.dayAvg || 0), 0)
    return Math.round(sum / dailyData.length)
  }, [dailyData])

  const estimatedHbA1c = useMemo(() => estimateHbA1c(avgGlucose), [avgGlucose])

  // Trend: compare first half vs second half of period
  const trend = useMemo(() => {
    if (dailyData.length < 4) return null
    const mid   = Math.floor(dailyData.length / 2)
    const first = dailyData.slice(0, mid).reduce((a, d) => a + d.dayAvg, 0) / mid
    const last  = dailyData.slice(mid).reduce((a, d) => a + d.dayAvg, 0) / (dailyData.length - mid)
    const diff  = last - first
    return { diff: Math.round(Math.abs(diff)), direction: diff < -2 ? 'down' : diff > 2 ? 'up' : 'flat' }
  }, [dailyData])

  // Post-meal bar data for latest 7 days
  const recentMeals = useMemo(() => {
    const recent = logs.slice(-7)
    const bars = []
    recent.forEach(log => {
      const dayLabel = log.date.slice(5)
      const bs = log.bloodSugar || {}
      const meals = { B: 'postBreakfast', L: 'postLunch', D: 'postDinner' }
      Object.entries(meals).forEach(([abbr, key]) => {
        const val = parseFloat(bs[key])
        if (val) {
          const lbl = glucoseLabel(val, 'postMeal')
          bars.push({ label: `${dayLabel}·${abbr}`, value: val, color: lbl.color })
        } else {
          // Try estimate
          const mealKey = abbr === 'B' ? 'breakfast' : abbr === 'L' ? 'lunch' : 'dinner'
          const foods = log.meals?.[mealKey] || []
          if (foods.length) {
            const fasting = parseFloat(bs.fasting) || 110
            const est = estimatePostMealGlucose(foods, fasting)
            if (est) bars.push({ label: `${dayLabel}·${abbr}~`, value: est.estimatedPeak, color: est.color })
          }
        }
      })
    })
    return bars
  }, [logs])

  // Line chart data
  const lineData = useMemo(() =>
    dailyData.map(d => ({ ...d, value: d.dayAvg })), [dailyData])

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Period selector */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-500 font-medium">Period:</span>
          <div className="flex gap-1">
            {PERIODS.map(p => (
              <button key={p.days} onClick={() => setPeriod(p.days)}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-all font-medium
                  ${period === p.days ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-500 bg-white border-gray-200 hover:border-blue-300'}`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
        {dailyData.length > 0 && (
          <div className="text-[10px] text-gray-400 flex items-center gap-1">
            <span>{dailyData.length} days logged</span>
            {trend && (
              <span className={`flex items-center gap-0.5 font-medium ${
                trend.direction === 'down' ? 'text-green-600' :
                trend.direction === 'up'   ? 'text-red-500'   : 'text-gray-400'}`}>
                {trend.direction === 'down' ? <TrendingDown className="w-3 h-3" /> :
                 trend.direction === 'up'   ? <TrendingUp   className="w-3 h-3" /> :
                                              <Minus        className="w-3 h-3" />}
                {trend.direction === 'flat' ? 'Stable' : `${trend.direction === 'down' ? '↓' : '↑'}${trend.diff} mg/dL`}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main grid */}
      <div className="flex-1 min-h-0 grid grid-cols-3 gap-2">

        {/* HbA1c + stats */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex flex-col gap-2">
          <p className="text-[11px] font-semibold text-gray-600">HbA1c Estimate</p>
          <HbA1cGauge value={estimatedHbA1c} target={5.6} />

          {avgGlucose && (
            <div className="space-y-1.5 pt-1 border-t border-gray-100">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-500">Avg glucose</span>
                <span className="font-bold text-gray-800">{avgGlucose} mg/dL</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-500">Current HbA1c</span>
                <span className="font-bold text-red-500">6.2%</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-500">Target</span>
                <span className="font-bold text-green-600">5.6%</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-500">Progress</span>
                <span className={`font-bold ${estimatedHbA1c <= 6.2 ? 'text-green-600' : 'text-orange-500'}`}>
                  {estimatedHbA1c <= 6.2 ? '↓ Improving' : '↑ Monitor'}
                </span>
              </div>
            </div>
          )}

          {!dailyData.length && (
            <p className="text-[10px] text-gray-400 text-center py-2">
              Start logging meals & blood sugar in Daily Log to see estimates here.
            </p>
          )}
        </div>

        {/* Average daily glucose trend */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex flex-col">
          <p className="text-[11px] font-semibold text-gray-600 mb-1">Daily Avg Glucose ({period}d)</p>
          <div className="flex-1 min-h-0">
            <LineChart
              data={lineData}
              color="#6366f1"
              yMin={60} yMax={220}
              targetLine={140}
              targetColor="#22c55e"
              label="value"
            />
          </div>
          <div className="flex items-center gap-3 mt-1 text-[9px] text-gray-400">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-indigo-500 inline-block" />Daily avg</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-green-500 inline-block border-dashed" />Target 140</span>
            <span className="italic">~ = estimated</span>
          </div>
        </div>

        {/* Per-meal post-meal glucose (recent 7 days) */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex flex-col">
          <p className="text-[11px] font-semibold text-gray-600 mb-1">Post-Meal Glucose (last 7d)</p>
          <div className="flex-1 min-h-0">
            <BarChart data={recentMeals} yMax={260} />
          </div>
          <div className="flex items-center gap-2 mt-1 text-[9px] text-gray-400">
            <span className="flex items-center gap-0.5"><span className="w-2 h-1.5 bg-green-500 rounded inline-block" />&lt;140 Good</span>
            <span className="flex items-center gap-0.5"><span className="w-2 h-1.5 bg-amber-400 rounded inline-block" />140-180</span>
            <span className="flex items-center gap-0.5"><span className="w-2 h-1.5 bg-red-500 rounded inline-block" />&gt;180 High</span>
            <span>B=Bfast L=Lunch D=Dinner ~=est</span>
          </div>
        </div>
      </div>
    </div>
  )
}
