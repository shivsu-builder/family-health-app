import { Play, Clock } from 'lucide-react'

export default function VideoCard({ video, small = false }) {
  return (
    <div className={`rounded-xl overflow-hidden bg-gray-900 ${small ? '' : ''}`}>
      <div className="relative">
        <iframe
          className="w-full aspect-video"
          src={`https://www.youtube.com/embed/${video.id}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="p-3 bg-white">
        <h4 className={`font-medium text-gray-800 ${small ? 'text-sm' : ''}`}>{video.title}</h4>
        <div className="flex items-center gap-2 mt-1">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-500">{video.duration}</span>
        </div>
      </div>
    </div>
  )
}
