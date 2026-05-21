import { useMemo, useState } from 'react'
import { SECTIONS } from './data/sections.js'
import { DEFAULT_SPECIES_ID } from './data/species.js'
import { buildPrompt, countFilledSections } from './utils/buildPrompt.js'
import Section from './components/Section.jsx'
import Character from './components/Character.jsx'
import SpeciesPicker from './components/SpeciesPicker.jsx'
import useLocalStorage from './hooks/useLocalStorage.js'

const STORAGE_KEYS = {
  form: 'eco-prompt:form',
  ecoMode: 'eco-prompt:ecoMode',
  species: 'eco-prompt:species',
}

export default function App() {
  const [form, setForm] = useLocalStorage(STORAGE_KEYS.form, {})
  const [ecoMode, setEcoMode] = useLocalStorage(STORAGE_KEYS.ecoMode, true)
  const [speciesId, setSpeciesId] = useLocalStorage(STORAGE_KEYS.species, DEFAULT_SPECIES_ID)

  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')
  const [cheered, setCheered] = useState(false)

  const filled = useMemo(() => countFilledSections(form), [form])
  const prompt = useMemo(() => buildPrompt(form), [form])

  const setSection = (id, v) => setForm((f) => ({ ...f, [id]: v }))

  const handleGenerate = async () => {
    setOutput(prompt)
    setError('')
    setImageUrl('')
    setCheered(true)
    setTimeout(() => setCheered(false), 1800)
    if (!prompt) return

    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      if (!res.ok) {
        if (res.status !== 404) {
          const t = await res.text()
          setError(`이미지 생성 실패: ${t.slice(0, 200)}`)
        }
        return
      }
      const data = await res.json()
      if (data.imageBase64) setImageUrl(`data:image/png;base64,${data.imageBase64}`)
      else if (data.imageUrl) setImageUrl(data.imageUrl)
    } catch {
      /* dev mode without serverless — silent text fallback */
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!output) return
    try { await navigator.clipboard.writeText(output) } catch {}
  }

  const handleReset = () => {
    if (!confirm('모든 입력을 지울까요?')) return
    setForm({})
    setOutput('')
    setImageUrl('')
    setError('')
  }

  const required = SECTIONS.filter((s) => s.required)
  const optional = SECTIONS.filter((s) => !s.required)

  return (
    <div className="min-h-screen pb-40">
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <img src="/seal/seal-3.png" alt="" className="w-8 h-8 object-contain" />
            <div>
              <h1 className="text-base font-semibold text-slate-900">Interactive Exhibition Genie</h1>
              <p className="text-xs text-slate-500">이미지 생성 에코 모드 · 상세 프롬프트 템플릿</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {ecoMode && (
              <SpeciesPicker value={speciesId} onChange={setSpeciesId} />
            )}
            <EcoModeToggle on={ecoMode} onChange={setEcoMode} />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-3">
          <Progress filled={filled} total={SECTIONS.length} ecoMode={ecoMode} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Column title="[필수 섹션] REQUIRED" tone="required">
          {required.map((s) => (
            <Section key={s.id} section={s} value={form[s.id]} onChange={(v) => setSection(s.id, v)} />
          ))}
        </Column>
        <Column title="[선택 섹션] OPTIONAL" tone="optional">
          {optional.map((s) => (
            <Section key={s.id} section={s} value={form[s.id]} onChange={(v) => setSection(s.id, v)} />
          ))}
        </Column>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3 flex-wrap">
          <button
            onClick={handleGenerate}
            disabled={!prompt || loading}
            className="px-4 py-2 rounded-lg bg-seal text-white text-sm font-medium hover:bg-seal-dark disabled:opacity-40"
          >
            {loading ? '생성 중…' : '프롬프트 출력하기'}
          </button>
          <button
            onClick={handleCopy}
            disabled={!output}
            className="px-3 py-2 rounded-lg border border-slate-300 text-sm hover:border-seal disabled:opacity-40"
          >
            복사
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-500 hover:border-red-400 hover:text-red-500"
          >
            초기화
          </button>
          <div className="text-xs text-slate-500 flex-1 truncate min-w-[120px]">
            {output ? `${output.length}자 / ${filled}/${SECTIONS.length} 섹션 완료` : '템플릿 내용이 여기에 출력됩니다.'}
          </div>
        </div>
        {(output || error) && (
          <div className="max-w-6xl mx-auto px-6 pb-4">
            {error && <div className="text-xs text-red-600 mb-2">{error}</div>}
            <pre className="whitespace-pre-wrap text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 max-h-48 overflow-auto">
{output}
            </pre>
            {imageUrl && (
              <div className="mt-3">
                <img src={imageUrl} alt="generated" className="max-h-64 rounded-lg border border-slate-200" />
              </div>
            )}
          </div>
        )}
      </footer>

      {ecoMode && (
        <Character filledCount={filled} justCheered={cheered} speciesId={speciesId} />
      )}
    </div>
  )
}

function Column({ title, tone, children }) {
  return (
    <div>
      <h2 className={'text-xs font-semibold mb-3 ' + (tone === 'required' ? 'text-red-600' : 'text-slate-500')}>
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Progress({ filled, total, ecoMode }) {
  const pct = Math.round((filled / total) * 100)
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={
            'h-full transition-all duration-500 ' +
            (ecoMode
              ? 'bg-gradient-to-r from-eco-500 to-seal'
              : 'bg-slate-400')
          }
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-xs text-slate-600 tabular-nums">
        {filled}/{total} 섹션 · {pct}%
      </div>
    </div>
  )
}

function EcoModeToggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={
        'flex items-center gap-2 text-xs px-3 py-1.5 rounded-full transition ' +
        (on
          ? 'bg-eco-50 text-eco-600 border border-eco-500/40'
          : 'bg-slate-100 text-slate-500 border border-slate-200')
      }
      aria-pressed={on}
    >
      <span className={'w-2 h-2 rounded-full ' + (on ? 'bg-eco-500' : 'bg-slate-400')} />
      Eco Mode {on ? 'ON' : 'OFF'}
    </button>
  )
}
