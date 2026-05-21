import { useMemo, useState } from 'react'
import { SECTIONS } from './data/sections.js'
import { buildPrompt, countFilledSections } from './utils/buildPrompt.js'
import Section from './components/Section.jsx'
import Character from './components/Character.jsx'

export default function App() {
  const [form, setForm] = useState({})
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

    // Try the serverless endpoint. If not deployed (404), just keep the text.
    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      if (!res.ok) {
        if (res.status === 404) {
          // No backend in dev → that's the fallback path; do nothing.
        } else {
          const t = await res.text()
          setError(`이미지 생성 실패: ${t.slice(0, 200)}`)
        }
        return
      }
      const data = await res.json()
      if (data.imageBase64) setImageUrl(`data:image/png;base64,${data.imageBase64}`)
      else if (data.imageUrl) setImageUrl(data.imageUrl)
    } catch (e) {
      // No /api in dev → silently fall back to text output
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!output) return
    try { await navigator.clipboard.writeText(output) } catch {}
  }

  const required = SECTIONS.filter((s) => s.required)
  const optional = SECTIONS.filter((s) => !s.required)

  return (
    <div className="min-h-screen pb-40">
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/seal/seal-3.png" alt="" className="w-8 h-8 object-contain" />
            <div>
              <h1 className="text-base font-semibold text-slate-900">Interactive Exhibition Genie</h1>
              <p className="text-xs text-slate-500">이미지 생성 에코 모드 · 상세 프롬프트 템플릿</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-eco-600 bg-eco-50 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-eco-500" />
            Eco Mode ON
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-3">
          <Progress filled={filled} total={SECTIONS.length} />
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
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
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
          <div className="text-xs text-slate-500 flex-1 truncate">
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

      <Character filledCount={filled} justCheered={cheered} />
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

function Progress({ filled, total }) {
  const pct = Math.round((filled / total) * 100)
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-eco-500 to-seal transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-xs text-slate-600 tabular-nums">
        {filled}/{total} 섹션 · {pct}%
      </div>
    </div>
  )
}
