import { MultiCheck, SingleSelect, TextInput, TextArea } from './Field.jsx'
import { isSectionFilled } from '../utils/buildPrompt.js'

function renderField(field, value, onChange) {
  if (field.type === 'multi')
    return <MultiCheck options={field.options} value={value} onChange={onChange} custom={field.custom} />
  if (field.type === 'single')
    return <SingleSelect options={field.options} value={value} onChange={onChange} />
  if (field.type === 'text')
    return <TextInput value={value} onChange={onChange} placeholder={field.placeholder} />
  if (field.type === 'textarea')
    return <TextArea value={value} onChange={onChange} placeholder={field.placeholder} />
  return null
}

export default function Section({ section, value, onChange }) {
  const filled = isSectionFilled(section, value)
  const setField = (id, v) => onChange({ ...(value || {}), [id]: v })

  return (
    <section
      className={
        'rounded-xl border bg-white p-4 transition shadow-sm ' +
        (filled ? 'border-eco-500/60 ring-1 ring-eco-500/30' : 'border-slate-200')
      }
    >
      <header className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-800">
          {section.title}{' '}
          {section.required ? (
            <span className="text-xs text-red-500 ml-1">REQUIRED</span>
          ) : (
            <span className="text-xs text-slate-400 ml-1">OPTIONAL</span>
          )}
        </h2>
        {filled && <span className="text-xs text-eco-600 font-medium">완료</span>}
      </header>

      {section.type === 'group' ? (
        <div className="space-y-3">
          {section.fields.map((f) => (
            <div key={f.id}>
              <div className="text-xs text-slate-500 mb-1">{f.label}</div>
              {renderField(f, value?.[f.id], (v) => setField(f.id, v))}
            </div>
          ))}
        </div>
      ) : (
        renderField(section, value, onChange)
      )}
    </section>
  )
}
