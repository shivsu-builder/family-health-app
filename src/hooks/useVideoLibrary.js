import { useState, useCallback } from 'react'
import { momYogaVideos, dadYoutubeVideos } from '../data/healthData'

const KEY = 'familyHealthVideos_v1'

const DEFAULTS = {
  mom:      momYogaVideos,
  dad:      dadYoutubeVideos,
  daughter: [],
  son:      [],
}

// YouTube search queries per person/category
export const youtubeSearchQueries = {
  mom:      'pranayama breathing exercises lung health yoga 2024',
  dad:      'heart health exercises diabetes diet Indian 2024',
  daughter: 'height growth exercises teenagers yoga 2024',
  son:      'kids height growth exercises activities 2024',
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : DEFAULTS
  } catch { return DEFAULTS }
}

function persist(d) {
  try { localStorage.setItem(KEY, JSON.stringify(d)) } catch {}
}

export function useVideoLibrary() {
  const [library, setLibrary] = useState(load)

  const removeVideo = useCallback((person, videoId) => {
    setLibrary(prev => {
      const next = { ...prev, [person]: prev[person].filter(v => v.id !== videoId) }
      persist(next)
      return next
    })
  }, [])

  const addVideo = useCallback((person, video) => {
    setLibrary(prev => {
      // Avoid duplicates
      if (prev[person].some(v => v.id === video.id)) return prev
      const next = { ...prev, [person]: [video, ...prev[person]] }
      persist(next)
      return next
    })
  }, [])

  const resetToDefaults = useCallback((person) => {
    setLibrary(prev => {
      const next = { ...prev, [person]: DEFAULTS[person] }
      persist(next)
      return next
    })
  }, [])

  return { library, removeVideo, addVideo, resetToDefaults }
}

// Extract YouTube video ID from a URL or raw ID
export function extractYoutubeId(input) {
  if (!input) return null
  input = input.trim()
  // youtu.be/ID
  const short = input.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (short) return short[1]
  // youtube.com/watch?v=ID
  const long = input.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  if (long) return long[1]
  // youtube.com/embed/ID
  const embed = input.match(/embed\/([a-zA-Z0-9_-]{11})/)
  if (embed) return embed[1]
  // Raw 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input
  return null
}
