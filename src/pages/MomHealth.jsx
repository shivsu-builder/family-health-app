import { useState } from 'react'
import { Star, CheckCircle2, Wind } from 'lucide-react'
import { momLungTips, momMotivation, getTodayTipIndex, getTodayMotivation } from '../data/healthData'
import { useVideoLibrary } from '../hooks/useVideoLibrary'
import Panel from '../components/Panel'
import VideoList from '../components/VideoList'

const lungFoods = [
  { food: 'Turmeric',   benefit: 'Reduces airway swelling' },
  { food: 'Ginger',     benefit: 'Natural bronchodilator' },
  { food: 'Garlic',     benefit: 'Fights respiratory infections' },
  { food: 'Green Tea',  benefit: 'Protects lung tissue' },
  { food: 'Tulsi',      benefit: 'Clears airways' },
  { food: 'Walnuts',    benefit: 'Omega-3 reduces inflammation' },
  { food: 'Honey',      benefit: 'Soothes airways' },
  { food: 'Apples',     benefit: 'Quercetin protects lungs' },
]

const envTips = [
  'Keep Snake Plant / Peace Lily indoors — they purify air',
  'Use air purifier in bedroom on high-pollution days',
  'Avoid burning incense / agarbatti — irritates airways',
  'Open windows 6–8 AM for fresh morning air',
  'Steam inhale with eucalyptus oil 2× daily in winter',
  'Warm water & herbal teas keep airways moist',
]

export default function MomHealth() {
  const [done, setDone] = useState({})
  const { library, removeVideo, addVideo } = useVideoLibrary()

  const todayTips  = momLungTips[getTodayTipIndex()]
  const motivation = getTodayMotivation()

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl px-5 py-2.5 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5" />
          <div>
            <h2 className="font-bold text-base leading-none">Mom's Lung Health</h2>
            <p className="text-pink-100 text-xs mt-0.5">Daily exercises · tips · motivation</p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-1.5 max-w-md">
          <Star className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
          <p className="text-xs text-white/90 leading-snug line-clamp-2">{motivation}</p>
        </div>
      </div>

      {/* 3-column panels */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-2">

        {/* Tips */}
        <Panel title="Today's 3 Lung Tips" icon="💡">
          <div className="space-y-2">
            {todayTips.map((tip, i) => (
              <div key={i} onClick={() => setDone(p => ({ ...p, [i]: !p[i] }))}
                className={`flex items-start gap-2.5 p-2.5 rounded-lg border-2 cursor-pointer transition-all
                  ${done[i] ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100 hover:border-pink-200'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${done[i] ? 'bg-green-500' : 'bg-pink-100'}`}>
                  {done[i] ? <CheckCircle2 className="w-4 h-4 text-white" /> : <span className="text-pink-600 font-bold text-xs">{i + 1}</span>}
                </div>
                <p className={`text-xs leading-relaxed ${done[i] ? 'text-green-700' : 'text-gray-600'}`}>{tip}</p>
              </div>
            ))}
            <p className="text-[10px] text-gray-400 text-center pt-1">Tap to mark done · tips rotate daily</p>
          </div>
        </Panel>

        {/* Videos with management */}
        <Panel title="Yoga & Exercise Videos" icon="▶️" bodyClass="p-2">
          <VideoList
            videos={library.mom}
            person="mom"
            onRemove={(id) => removeVideo('mom', id)}
            onAdd={(video)  => addVideo('mom', video)}
          />
        </Panel>

        {/* Foods + Environment */}
        <div className="flex flex-col gap-2 min-h-0">
          <Panel title="Lung-Friendly Foods" icon="🥦" className="flex-1">
            <div className="space-y-1.5">
              {lungFoods.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-gray-700 w-20 shrink-0">{f.food}</span>
                  <span className="text-gray-400">{f.benefit}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Environment Tips" icon="🌿" className="flex-1">
            <ul className="space-y-1.5">
              {envTips.map((t, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                  <span className="text-pink-400 shrink-0 mt-0.5">•</span>{t}
                </li>
              ))}
            </ul>
          </Panel>
        </div>

      </div>
    </div>
  )
}
