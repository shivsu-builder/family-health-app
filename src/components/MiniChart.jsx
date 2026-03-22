// Lightweight SVG chart components — no external dependencies

// ─── Line Chart ────────────────────────────────────────────────────────────────
export function LineChart({ data = [], width = 400, height = 120, color = '#6366f1',
  yMin, yMax, targetLine, targetColor = '#22c55e', label = 'value' }) {

  if (data.length < 2) return (
    <div className="flex items-center justify-center h-full text-xs text-gray-400">
      Not enough data yet — log more entries!
    </div>
  )

  const vals = data.map(d => d[label] ?? d.value)
  const lo   = yMin !== undefined ? yMin : Math.min(...vals) * 0.92
  const hi   = yMax !== undefined ? yMax : Math.max(...vals) * 1.08
  const PAD  = { t: 8, r: 10, b: 22, l: 36 }
  const W    = width  - PAD.l - PAD.r
  const H    = height - PAD.t - PAD.b

  const sx = (i) => PAD.l + (i / (data.length - 1)) * W
  const sy = (v) => PAD.t + H - ((v - lo) / (hi - lo)) * H

  const pts = data.map((d, i) => `${sx(i)},${sy(d[label] ?? d.value)}`).join(' ')

  // Y gridlines
  const gridVals = [lo, lo + (hi - lo) * 0.5, hi]

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      {/* Grid */}
      {gridVals.map((v, i) => (
        <g key={i}>
          <line x1={PAD.l} x2={width - PAD.r} y1={sy(v)} y2={sy(v)}
            stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" />
          <text x={PAD.l - 4} y={sy(v) + 3} textAnchor="end" fontSize="8" fill="#9ca3af">
            {Math.round(v)}
          </text>
        </g>
      ))}

      {/* Target line */}
      {targetLine !== undefined && (
        <line x1={PAD.l} x2={width - PAD.r}
          y1={sy(targetLine)} y2={sy(targetLine)}
          stroke={targetColor} strokeWidth="1.5" strokeDasharray="5,3" opacity="0.7" />
      )}

      {/* Area fill */}
      <polyline
        points={`${PAD.l},${PAD.t + H} ${pts} ${sx(data.length - 1)},${PAD.t + H}`}
        fill={color} fillOpacity="0.08" stroke="none" />

      {/* Line */}
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />

      {/* Points */}
      {data.map((d, i) => (
        <circle key={i} cx={sx(i)} cy={sy(d[label] ?? d.value)} r="3"
          fill={color} stroke="white" strokeWidth="1.5" />
      ))}

      {/* X labels */}
      {data.map((d, i) => {
        if (data.length > 14 && i % Math.ceil(data.length / 7) !== 0) return null
        return (
          <text key={i} x={sx(i)} y={height - 4} textAnchor="middle" fontSize="7.5" fill="#9ca3af">
            {d.label ?? d.date?.slice(5) ?? ''}
          </text>
        )
      })}
    </svg>
  )
}

// ─── Bar Chart ─────────────────────────────────────────────────────────────────
export function BarChart({ data = [], width = 400, height = 120, yMax }) {

  if (data.length === 0) return (
    <div className="flex items-center justify-center h-full text-xs text-gray-400">
      No data logged yet.
    </div>
  )

  const vals = data.map(d => d.value)
  const hi   = yMax !== undefined ? yMax : Math.max(...vals, 200) * 1.05
  const PAD  = { t: 10, r: 8, b: 20, l: 36 }
  const W    = width  - PAD.l - PAD.r
  const H    = height - PAD.t - PAD.b
  const bw   = Math.max((W / data.length) * 0.65, 4)

  const sx = (i) => PAD.l + (i + 0.5) * (W / data.length)
  const sy = (v) => PAD.t + H - (v / hi) * H
  const sh = (v) => (v / hi) * H

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      {/* Grid */}
      {[0, 0.5, 1].map((p, i) => {
        const v = hi * p
        return (
          <g key={i}>
            <line x1={PAD.l} x2={width - PAD.r} y1={sy(v)} y2={sy(v)}
              stroke="#e5e7eb" strokeWidth="1" />
            <text x={PAD.l - 4} y={sy(v) + 3} textAnchor="end" fontSize="8" fill="#9ca3af">
              {Math.round(v)}
            </text>
          </g>
        )
      })}
      {/* Reference lines */}
      {[140, 180].map((v, i) => (
        <line key={i} x1={PAD.l} x2={width - PAD.r} y1={sy(v)} y2={sy(v)}
          stroke={i === 0 ? '#22c55e' : '#ef4444'} strokeWidth="1"
          strokeDasharray="4,2" opacity="0.5" />
      ))}

      {/* Bars */}
      {data.map((d, i) => (
        <g key={i}>
          <rect
            x={sx(i) - bw / 2} y={sy(d.value)} width={bw} height={sh(d.value)}
            rx="2" fill={d.color || '#6366f1'} fillOpacity="0.85" />
          {/* X labels */}
          <text x={sx(i)} y={height - 3} textAnchor="middle" fontSize="7" fill="#9ca3af">
            {d.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

// ─── HbA1c Gauge ───────────────────────────────────────────────────────────────
export function HbA1cGauge({ value, target = 5.6 }) {
  if (!value) return null
  const pct = Math.min(Math.max((parseFloat(value) - 4.5) / (9.5 - 4.5), 0), 1)
  const color = value <= 5.6 ? '#22c55e' : value <= 6.4 ? '#f59e0b' : '#ef4444'
  const tgtPct = Math.min(Math.max((target - 4.5) / (9.5 - 4.5), 0), 1)

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-2xl font-bold" style={{ color }}>{value}%</div>
      <div className="text-[10px] text-gray-400">Estimated HbA1c</div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden relative">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct * 100}%`, background: color }} />
        {/* Target marker */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-green-600" style={{ left: `${tgtPct * 100}%` }} />
      </div>
      <div className="flex items-center gap-1 text-[9px] text-gray-400">
        <span className="w-2 h-0.5 bg-green-600 inline-block" />
        Target {target}%
      </div>
    </div>
  )
}
