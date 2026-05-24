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

// Hover content — based on 0505 회의록 spec:
// "동물 icon 위에 hover 하면 '멸종위기종의 이름, 멸종위기 이유, 남은 개체수, 서식지' 한 줄로 소개.
//  click 하면 효율적인 프롬프팅이 기후위기에 주는 선한 영향에 대한 기사 하이퍼링크"
// Seal facts pulled from IUCN reclassification press release referenced in the PDF.
const SPECIES = {
  name: '남극 물개 (Antarctic Fur Seal)',
  reason: '해빙 감소 · 해수온 상승으로 크릴 먹이 부족',
  population: '약 94만 마리 (1999년 대비 50% ↓)',
  habitat: '남극 사우스조지아 섬 일대',
  source: 'https://iucn.org/press-release/202604/emperor-penguin-and-antarctic-fur-seal-now-endangered-due-climate-change-iucn',
  article: 'https://brunch.co.kr/@greenpeacekorea/391',
  articleLabel: '효율적인 프롬프팅이 기후위기에 주는 영향 →',
}

// How long each APNG runs before it would loop.
// We swap to a static still after this so the seal "stops moving".
const STAGE_ANIM_MS = 1500
const CELEBRATION_MS = 2000

export default function Character({ filledCount, justCheered, isComplete = false }) {
  const stage = stageFor(filledCount)

  // Three possible visual modes:
  //   'static'      → not moving, shows /seal/seal-{stage}.png
  //   'stage-anim'  → /seal/anim/stage{stage}.png playing once
  //   'celebrating' → /seal/anim/final_celebration.png playing once
  //                   (only when generate is pressed AND all sections filled)
  const [mode, setMode] = useState('static')
  const prevStage = useRef(stage)
  const [hover, setHover] = useState(false)
  // Bumped on every animation trigger to force <img> remount so the APNG
  // restarts from frame 1 (browsers won't replay an APNG otherwise).
  const [animToken, setAnimToken] = useState(0)

  // Stage changed (user just filled / unfilled a section) → play once.
  useEffect(() => {
    if (stage === prevStage.current) return
    prevStage.current = stage
    setMode('stage-anim')
    setAnimToken((n) => n + 1)
    const t = setTimeout(() => setMode('static'), STAGE_ANIM_MS)
    return () => clearTimeout(t)
  }, [stage])

  // User clicked 프롬프트 생성하기. If the form is 100% complete, play the
  // final celebration (with the hat); otherwise replay the current stage anim.
  useEffect(() => {
    if (!justCheered) return
    const nextMode = isComplete ? 'celebrating' : 'stage-anim'
    setMode(nextMode)
    setAnimToken((n) => n + 1)
    const duration = isComplete ? CELEBRATION_MS : STAGE_ANIM_MS
    const t = setTimeout(() => setMode('static'), duration)
    return () => clearTimeout(t)
  }, [justCheered, isComplete])

  // Pick which asset to show. `key` differs every animation run so the
  // browser remounts the <img> and the APNG plays from frame 1.
  let src
  let key
  if (mode === 'celebrating') {
    src = '/seal/anim/final_celebration.png'
    key = `cheer-${animToken}`
  } else if (mode === 'stage-anim') {
    src = `/seal/anim/stage${stage}.png`
    key = `stage-anim-${stage}-${animToken}`
  } else {
    src = `/seal/seal-${stage}.png`
    key = `static-${stage}`
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-50"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && (
        <div className="absolute bottom-full right-0 mb-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-xs text-slate-700">
          <div className="font-semibold text-slate-900 mb-1.5">{SPECIES.name}</div>
          <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5">
            <span className="text-slate-400">서식지</span>
            <span>{SPECIES.habitat}</span>
            <span className="text-slate-400">개체수</span>
            <span>{SPECIES.population}</span>
            <span className="text-slate-400">멸종위기 이유</span>
            <span>{SPECIES.reason}</span>
          </div>
          <a
            href={SPECIES.article}
            target="_blank"
            rel="noreferrer noopener"
            className="block mt-2 pt-2 border-t border-slate-100 text-eco-600 hover:underline"
          >
            {SPECIES.articleLabel}
          </a>
          <a
            href={SPECIES.source}
            target="_blank"
            rel="noreferrer noopener"
            className="block mt-0.5 text-[10px] text-slate-400 hover:underline"
          >
            출처: IUCN
          </a>
        </div>
      )}
      <img
        key={key}
        src={src}
        alt={`seal stage ${stage}`}
        className="w-40 h-40 sm:w-48 sm:h-48 object-contain drop-shadow cursor-pointer"
      />
    </div>
  )
}
