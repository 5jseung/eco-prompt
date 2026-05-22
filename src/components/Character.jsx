import { useEffect, useRef, useState } from 'react'

// Map filled section count to seal sprite index (1..5)
function spriteFor(filled) {
  if (filled <= 0) return 1
  if (filled <= 3) return 2
  if (filled === 4) return 3
  if (filled === 5) return 4
  return 5
}

export default function Character({ filledCount, justCheered }) {
  const idx = spriteFor(filledCount)
  const [tilt, setTilt] = useState(false)
  const lastFilled = useRef(filledCount)

  // Trigger a one-shot tilt whenever the user finishes a new section
  useEffect(() => {
    if (filledCount > lastFilled.current) {
      setTilt(true)
      const t = setTimeout(() => setTilt(false), 700)
      return () => clearTimeout(t)
    }
    lastFilled.current = filledCount
  }, [filledCount])

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
      <div
        className={
          'w-32 h-32 sm:w-40 sm:h-40 ' +
          (justCheered ? 'animate-cheer' : tilt ? 'animate-tilt' : 'animate-breathe')
        }
      >
        <img
          src={`/seal/seal-${idx}.png`}
          alt={`seal expression ${idx}`}
          className="w-full h-full object-contain drop-shadow"
        />
      </div>
    </div>
  )
}
