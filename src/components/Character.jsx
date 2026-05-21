import { useEffect, useRef, useState } from 'react'
import { SECTIONS } from '../data/sections.js'
import { SPECIES } from '../data/species.js'

// Map fill ratio (0..1) → sprite index (1..5)
function spriteFor(filled, total) {
  if (total === 0) return 3
  const ratio = filled / total
  if (ratio <= 0)   return 1
  if (ratio < 0.3)  return 2
  if (ratio < 0.6)  return 3
  if (ratio < 0.95) return 4
  return 5
}

export default function Character({ filledCount, justCheered, speciesId }) {
  const species = SPECIES.find((s) => s.id === speciesId) || SPECIES[0]
  const total = SECTIONS.length
  const idx = spriteFor(filledCount, total)
  const [tilt, setTilt] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const lastFilled = useRef(filledCount)

  // tilt once when a new section is completed
  useEffect(() => {
    if (filledCount > lastFilled.current) {
      setTilt(true)
      const t = setTimeout(() => setTilt(false), 700)
      return () => clearTimeout(t)
    }
    lastFilled.current = filledCount
  }, [filledCount])

  // pick a fact roughly tied to how full the form is
  const facts = species.facts
  const fact = facts[Math.min(filledCount, facts.length - 1)]

  // fall back to seal art if a species' assets aren't in yet
  const artPath = species.ready ? species.spritePath : '/seal'
  const artBase = species.ready ? species.id : 'seal'

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-end gap-3">
      {/* speech bubble */}
      <div className="max-w-xs">
        <div className="relative bg-white border border-slate-200 rounded-2xl shadow-md px-3 py-2 text-xs text-slate-700">
          {fact}
          <div className="absolute -right-1 bottom-3 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-[-45deg]" />
        </div>
      </div>

      {/* character (clickable for info) */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowInfo((v) => !v)}
          onMouseEnter={() => setShowInfo(true)}
          aria-label={`${species.name} 정보 보기`}
          className={
            'w-32 h-32 sm:w-40 sm:h-40 block transition ' +
            (justCheered ? 'animate-cheer' : tilt ? 'animate-tilt' : 'animate-breathe')
          }
        >
          <img
            src={`${artPath}/${artBase}-${idx}.png`}
            alt={`${species.name} expression ${idx}`}
            className="w-full h-full object-contain drop-shadow"
          />
        </button>

        {showInfo && (
          <div
            onMouseLeave={() => setShowInfo(false)}
            className="absolute bottom-full right-0 mb-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg p-4 text-left"
          >
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="text-sm font-semibold text-slate-900">{species.name}</h3>
              <span className="text-xs text-slate-400">{species.en}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {species.speciesInfo.blurb}
            </p>
            <a
              href={species.speciesInfo.articleUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-eco-600 hover:underline"
            >
              자세히 알아보기 →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
