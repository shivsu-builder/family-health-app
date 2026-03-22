import { useState, useCallback } from 'react'

const KEY = 'familyHealthLogs_v2'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : { logs: [] }
  } catch { return { logs: [] } }
}

function persist(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch {}
}

export function useHealthLog() {
  const [data, setData] = useState(load)

  const save = useCallback((next) => {
    setData(next)
    persist(next)
  }, [])

  const upsertLog = useCallback((entry) => {
    // One log per person per date — merge if exists
    setData(prev => {
      const existing = prev.logs.find(
        l => l.person === entry.person && l.date === entry.date
      )
      let logs
      if (existing) {
        logs = prev.logs.map(l =>
          l.person === entry.person && l.date === entry.date
            ? { ...l, ...entry }
            : l
        )
      } else {
        logs = [...prev.logs, { ...entry, id: Date.now() }]
      }
      const next = { ...prev, logs }
      persist(next)
      return next
    })
  }, [])

  const deleteLog = useCallback((person, date) => {
    setData(prev => {
      const next = { ...prev, logs: prev.logs.filter(l => !(l.person === person && l.date === date)) }
      persist(next)
      return next
    })
  }, [])

  const getLog = useCallback((person, date) =>
    data.logs.find(l => l.person === person && l.date === date) || null,
  [data])

  const getLogsForPerson = useCallback((person, days) => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    cutoff.setHours(0, 0, 0, 0)
    return data.logs
      .filter(l => l.person === person && new Date(l.date) >= cutoff)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [data])

  return { data, upsertLog, deleteLog, getLog, getLogsForPerson }
}

export function emptyLog(person, date) {
  return {
    person,
    date,
    meals: {
      breakfast: [],
      lunch:     [],
      dinner:    [],
      snacks:    [],
    },
    bloodSugar: { fasting: '', postBreakfast: '', postLunch: '', postDinner: '' },
    bpReadings: [],   // [{ time, systolic, diastolic, pulse, notes }]
    exercise: [],
    medications: { taken: [], notes: '' },
    notes: '',
  }
}
