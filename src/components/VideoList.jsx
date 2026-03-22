import { useState } from 'react'
import { Play, Clock, Trash2, Plus, Search, X, AlertCircle, Check } from 'lucide-react'
import VideoModal from './VideoModal'
import { extractYoutubeId, youtubeSearchQueries } from '../hooks/useVideoLibrary'

export default function VideoList({ videos = [], person, onRemove, onAdd }) {
  const [selected,   setSelected]   = useState(null)
  const [showAdd,    setShowAdd]     = useState(false)
  const [urlInput,   setUrlInput]    = useState('')
  const [titleInput, setTitleInput]  = useState('')
  const [durInput,   setDurInput]    = useState('')
  const [addError,   setAddError]    = useState('')
  const [addSuccess, setAddSuccess]  = useState(false)

  const handleAdd = () => {
    setAddError('')
    const id = extractYoutubeId(urlInput)
    if (!id) { setAddError('Could not find a valid YouTube video ID. Paste a YouTube URL or 11-char ID.'); return }
    if (!titleInput.trim()) { setAddError('Please enter a title.'); return }
    onAdd?.({ id, title: titleInput.trim(), duration: durInput.trim() || '?' })
    setUrlInput(''); setTitleInput(''); setDurInput(''); setShowAdd(false)
    setAddSuccess(true)
    setTimeout(() => setAddSuccess(false), 3000)
  }

  const openSearch = () => {
    const q = youtubeSearchQueries[person] || 'health wellness exercises 2024'
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`, '_blank')
  }

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Toolbar */}
      <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
        <button onClick={() => setShowAdd(s => !s)}
          className="flex items-center gap-1 text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-200 px-2 py-1 rounded-lg hover:bg-indigo-100 transition-colors">
          <Plus className="w-3 h-3" /> Add Video
        </button>
        <button onClick={openSearch}
          className="flex items-center gap-1 text-[10px] bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded-lg hover:bg-red-100 transition-colors">
          <Search className="w-3 h-3" /> Find on YouTube
        </button>
        {addSuccess && (
          <span className="flex items-center gap-1 text-[10px] text-green-600">
            <Check className="w-3 h-3" /> Added!
          </span>
        )}
      </div>

      {/* Add video form */}
      {showAdd && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 shrink-0 space-y-2">
          <p className="text-[11px] font-semibold text-indigo-700">Add a YouTube Video</p>
          <input
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="Paste YouTube URL or Video ID"
            className="w-full text-xs border border-indigo-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-400 bg-white"
          />
          <input
            value={titleInput}
            onChange={e => setTitleInput(e.target.value)}
            placeholder="Video title (required)"
            className="w-full text-xs border border-indigo-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-400 bg-white"
          />
          <input
            value={durInput}
            onChange={e => setDurInput(e.target.value)}
            placeholder="Duration e.g. 12 min (optional)"
            className="w-full text-xs border border-indigo-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-400 bg-white"
          />
          {addError && (
            <div className="flex items-start gap-1 text-[10px] text-red-600">
              <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />{addError}
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={handleAdd}
              className="flex-1 text-xs bg-indigo-600 text-white rounded-lg py-1.5 hover:bg-indigo-700 transition-colors">
              Add Video
            </button>
            <button onClick={() => { setShowAdd(false); setAddError('') }}
              className="text-xs bg-white text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
          <p className="text-[9px] text-indigo-400">Tip: Click "Find on YouTube" above → copy URL of video you want → paste here</p>
        </div>
      )}

      {/* Video list */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-1.5 pr-0.5">
        {videos.length === 0 && (
          <div className="text-center py-6 text-gray-400 text-xs">
            <Play className="w-8 h-8 mx-auto mb-2 opacity-30" />
            No videos yet. Click "Find on YouTube" to discover videos!
          </div>
        )}
        {videos.map(video => (
          <div key={video.id}
            className="flex items-center gap-2.5 p-2 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group">
            {/* Thumbnail */}
            <button
              onClick={() => setSelected(video)}
              className="relative shrink-0 w-20 h-12 rounded-lg overflow-hidden bg-gray-900"
            >
              <img
                src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none' }}
              />
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/10 transition-all">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
            </button>

            {/* Title */}
            <button
              onClick={() => setSelected(video)}
              className="flex-1 text-left min-w-0"
            >
              <p className="text-xs font-medium text-gray-700 line-clamp-2 leading-snug">{video.title}</p>
              {video.duration && (
                <div className="flex items-center gap-1 mt-0.5 text-gray-400">
                  <Clock className="w-2.5 h-2.5" />
                  <span className="text-[10px]">{video.duration}</span>
                </div>
              )}
            </button>

            {/* Remove button */}
            {onRemove && (
              <button
                onClick={() => onRemove(video.id)}
                title="Remove video"
                className="shrink-0 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {selected && <VideoModal video={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
