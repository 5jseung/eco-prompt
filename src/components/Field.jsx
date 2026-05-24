// Small renderers for each input type, used by Section.jsx
import { useRef, useState } from 'react'

const isOther = (opt) => opt === 'Other' || opt === '기타'

export function MultiCheck({ options, value = [], onChange, custom = false }) {
  const inputRef = useRef(null)
  // Whether the options list contains an "Other" / "기타" button.
  // If so, the custom input is hidden until that button is clicked.
  // If not (e.g. PURPOSE, MOOD), the custom input is always visible.
  const otherExists = options.some(isOther)

  // Custom values = anything in `value` that isn't one of the predefined options.
  const customVals = value.filter((v) => !options.includes(v))
  const customStr = customVals.join(', ')
  const hasCustom = customVals.length > 0

  // Tracks whether the user explicitly opened the custom input via "Other".
  // Resets on unmount. hasCustom keeps the input visible if the user has typed.
  const [otherClicked, setOtherClicked] = useState(false)
  const showCustom = custom && (!otherExists || hasCustom || otherClicked)

  const toggle = (opt) => {
    // "Other" with custom enabled is a virtual button that toggles the input.
    // It is NOT added to the value array literally — we never want the bare
    // string "Other" leaking into the final prompt.
    if (custom && isOther(opt)) {
      const turningOn = !(hasCustom || otherClicked)
      if (turningOn) {
        setOtherClicked(true)
        setTimeout(() => inputRef.current?.focus(), 0)
      } else {
        setOtherClicked(false)
        if (hasCustom) {
          // Also clear any custom-typed values so the toggle feels symmetric.
          onChange(value.filter((v) => options.includes(v) && !isOther(v)))
        }
      }
      return
    }
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt))
    else onChange([...value, opt])
  }

  const isOn = (opt) => {
    if (custom && isOther(opt)) return hasCustom || otherClicked
    return value.includes(opt)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const on = isOn(opt)
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
      {showCustom && (
        <input
          ref={inputRef}
          type="text"
          placeholder="직접 입력 (쉼표로 여러 개 입력 가능)"
          value={customStr}
          onChange={(e) => {
            const fixed = value.filter((v) => options.includes(v) && !isOther(v))
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
