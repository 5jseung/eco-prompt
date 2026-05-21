// Small renderers for each input type, used by Section.jsx

export function MultiCheck({ options, value = [], onChange, custom = false }) {
  const toggle = (opt) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt))
    else onChange([...value, opt])
  }
  const customVals = value.filter((v) => !options.includes(v))
  const customStr = customVals.join(', ')
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
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
      {custom && (
        <input
          type="text"
          placeholder="직접 입력 (쉼표로 구분)"
          value={customStr}
          onChange={(e) => {
            const fixed = value.filter((v) => options.includes(v))
            const extras = e.target.value
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
            onChange([...fixed, ...extras])
          }}
          className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 text-sm focus:outline-none focus:border-seal"
        />
      )}
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

export function TextInput({ value = '', onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm focus:outline-none focus:border-seal"
    />
  )
}

export function TextArea({ value = '', onChange, placeholder }) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      rows={2}
      className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm focus:outline-none focus:border-seal resize-none"
    />
  )
}
