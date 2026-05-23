import { useEffect, useRef, useState } from 'react'

// Map filled section count → animation stage (1..5).
// Mirrors the asset stages stage1..stage5 from /public/seal/anim/.
function stageFor(filled) {
  if (filled <= 0) return 1
  if (filled <= 3) return 2
  if (filled === 4) return 3
  if (filled === 5) return 4
  return 5
}

export default function Character({ filledCount, justCheered }) {
  const stage = stageFor(filledCount)
  const [celebrating, setCelebrating] = useState(false)
  const lastFilled = useRef(filledCount)

  // When the user finishes a new section OR hits the generate button,
  // play the final_celebration animation once, then return to the idle stage.
  useEffect(() => {
    const sectionJustCompleted = filledCount > lastFilled.current
    lastFilled.current = filledCount
    if (!justCheered && !sectionJustCompleted) return

    setCelebrating(true)
    // final_celebration runs ~2s at 12fps; give it a beat
    const t = setTimeout(() => setCelebrating(false), 1800)
    return () => clearTimeout(t)
  }, [filledCount, justCheered])

  // Key forces the browser to restart the APNG when it changes — so the
  // celebration plays from frame 1 every time, not from wherever it was paused.
  const src = celebrating
    ? '/seal/anim/final_celebration.png'
    : `/seal/anim/stage${stage}.png`
  const key = celebrating ? `cheer-${filledCount}-${Date.now()}` : `stage-${stage}`

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
      <img
        key={key}
        src={src}
        alt={celebrating ? 'seal celebrating' : `seal stage ${stage}`}
        className="w-40 h-40 sm:w-48 sm:h-48 object-contain drop-shadow"
      />
    </div>
  )
}
