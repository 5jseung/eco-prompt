// Small renderers for each input type, used by Section.jsx
import { useState } from 'react'

const isOther = (opt) => opt === 'Other' || opt === '기타'

export function MultiCheck({ options, value = [], onChange, custom = false, placeholder }) {
  const visibleOptions = options.filter((opt) => !isOther(opt))

  // Custom values = anything in `value` that isn't one of the predefined options.
  const customVals = value.filter((v) => !visibleOptions.includes(v) && !isOther(v))
  const customStr = customVals.join(', ')
  const [customInput, setCustomInput] = useState(customStr)

  const toggle = (opt) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt))
    else onChange([...value, opt])
  }

  return (
    <div className="space-y-2">
      {custom && (
        <div>
          <div className="text-xs text-slate-500 mb-1">세부 사항 입력</div>
          <input
            type="text"
            placeholder={placeholder}
            value={customInput}
            onChange={(e) => {
              const raw = e.target.value
              setCustomInput(raw)
              const fixed = value.filter((v) => visibleOptions.includes(v))
              const extras = raw
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
              onChange([...fixed, ...extras])
            }}
            className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 text-sm focus:outline-none focus:border-seal"
          />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {visibleOptions.map((opt) => {
          const on = value.includes(opt)
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={
                'px-3 py-1.5 rounded-full text-sm border transition ' +
                (on
                  ? 'bg-seal text-white border-seal'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-seal')
              }
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function SingleSelect({ options, value = '', onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const on = value === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(on ? '' : opt)}
            className={
              'px-3 py-1.5 rounded-full text-sm border transition ' +
              (on
                ? 'bg-seal text-white border-seal'
                : 'bg-white text-slate-700 border-slate-300 hover:border-seal')
            }
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

export function TextInput({ value = '', onChange, placeholder, showLabel = false }) {
  return (
    <div>
      {showLabel && <div className="text-xs text-slate-500 mb-1">세부 사항 입력</div>}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm focus:outline-none focus:border-seal"
      />
    </div>
  )
}

export function TextArea({ value = '', onChange, placeholder, showLabel = false }) {
  return (
    <div>
      {showLabel && <div className="text-xs text-slate-500 mb-1">세부 사항 입력</div>}
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm focus:outline-none focus:border-seal resize-none"
      />
    </div>
  )
}
