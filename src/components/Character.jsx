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
}

// How long each APNG runs before it would loop.
// We swap to a static still after this so the seal "stops moving".
const STAGE_ANIM_MS = 1500
const CELEBRATION_MS = 2000
const HOVER_CLOSE_DELAY_MS = 250
const SEAL_ASSET_VERSION = 'bg-clean-1'
const SEAL_ASSET_PATHS = [
  '/seal/seal-1.png',
  '/seal/seal-2.png',
  '/seal/seal-3.png',
  '/seal/seal-4.png',
  '/seal/seal-5.png',
  '/seal/anim/stage1.png',
  '/seal/anim/stage2.png',
  '/seal/anim/stage3.png',
  '/seal/anim/stage4.png',
  '/seal/anim/stage5.png',
  '/seal/anim/final_celebration.png',
]

function sealAsset(path) {
  return `${path}?v=${SEAL_ASSET_VERSION}`
}

export default function Character({ filledCount, justCheered, isComplete = false }) {
  const stage = stageFor(filledCount)

  // Three possible visual modes:
  //   'static'      → not moving, shows /seal/seal-{stage}.png
  //   'stage-anim'  → /seal/anim/stage{stage}.png playing once
  //   'celebrating' → /seal/anim/final_celebration.png playing once
  //                   (only when generate is pressed AND all sections filled)
  const [mode, setMode] = useState('static')
  const prevFilledCount = useRef(filledCount)
  const hoverCloseTimer = useRef(null)
  const [hover, setHover] = useState(false)
  // Bumped on every animation trigger to force <img> remount so the APNG
  // restarts from frame 1 (browsers won't replay an APNG otherwise).
  const [animToken, setAnimToken] = useState(0)

  // Filled section count changed → replay the current stage animation once.
  useEffect(() => {
    if (filledCount === prevFilledCount.current) return
    prevFilledCount.current = filledCount
    setMode('stage-anim')
    setAnimToken((n) => n + 1)
    const t = setTimeout(() => setMode('static'), STAGE_ANIM_MS)
    return () => clearTimeout(t)
  }, [filledCount])

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

  useEffect(() => {
    return () => {
      if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current)
    }
  }, [])

  useEffect(() => {
    const preloaded = SEAL_ASSET_PATHS.map((path) => {
      const img = new Image()
      img.src = sealAsset(path)
      return img
    })
    return () => {
      preloaded.forEach((img) => {
        img.onload = null
        img.onerror = null
      })
    }
  }, [])

  function showHover() {
    if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current)
    setHover(true)
  }

  function scheduleHideHover() {
    if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current)
    hoverCloseTimer.current = setTimeout(() => setHover(false), HOVER_CLOSE_DELAY_MS)
  }

  // Pick which asset to show. `key` differs every animation run so the
  // browser remounts the <img> and the APNG plays from frame 1.
  let src
  let key
  if (mode === 'celebrating') {
    src = sealAsset('/seal/anim/final_celebration.png')
    key = `cheer-${animToken}`
  } else if (mode === 'stage-anim') {
    src = sealAsset(`/seal/anim/stage${stage}.png`)
    key = `stage-anim-${stage}-${animToken}`
  } else {
    src = sealAsset(`/seal/seal-${stage}.png`)
    key = `static-${stage}`
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-50"
      onMouseEnter={showHover}
      onMouseLeave={scheduleHideHover}
    >
      {hover && (
        <div
          className="absolute bottom-full right-0 mb-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-xs text-slate-700"
          onMouseEnter={showHover}
          onMouseLeave={scheduleHideHover}
        >
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
            href={SPECIES.source}
            target="_blank"
            rel="noreferrer noopener"
            className="block mt-2 pt-2 border-t border-slate-100 text-eco-600 hover:underline"
          >
            관련 뉴스 기사 보기
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
