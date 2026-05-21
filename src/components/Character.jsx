import { useEffect, useRef, useState } from 'react'
import { SECTIONS } from '../data/sections.js'

// Map fill ratio (0..1) → seal sprite index (1..5)
// 0 sections   → seal-1 (sad)
// max sections → seal-5 (happy)
function spriteFor(filled, total) {
  if (total === 0) return 3
  const ratio = filled / total
  if (ratio <= 0)        return 1
  if (ratio < 0.3)       return 2
  if (ratio < 0.6)       return 3
  if (ratio < 0.95)      return 4
  return 5
}

const FACT = [
  'AI 이미지 한 장 = 휴대폰 완충 1회 수준의 전력을 쓸 수 있어요.',
  '프롬프트가 구체적일수록 재생성이 줄고, 그만큼 탄소 배출도 줄어듭니다.',
  '한 번에 잘 적은 프롬프트가 10번 시도한 프롬프트보다 효율적이에요.',
  '에코 모드는 더 적은 시도로 원하는 이미지에 가깝게 가는 걸 돕습니다.',
]

export default function Character({ filledCount, justCheered }) {
  const total = SECTIONS.length
  const idx = spriteFor(filledCount, total)
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

  const fact = FACT[Math.min(filledCount, FACT.length - 1)]

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-end gap-3 pointer-events-none">
      <div className="max-w-xs pointer-events-auto">
        <div className="relative bg-white border border-slate-200 rounded-2xl shadow-md px-3 py-2 text-xs text-slate-700">
          {fact}
          <div className="absolute -right-1 bottom-3 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-[-45deg]" />
        </div>
      </div>
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
