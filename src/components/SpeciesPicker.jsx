import { SPECIES } from '../data/species.js'

export default function SpeciesPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-slate-500 mr-1">캐릭터</span>
      {SPECIES.map((s) => {
        const on = value === s.id
        const disabled = !s.ready
        return (
          <button
            key={s.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(s.id)}
            title={disabled ? `${s.name} (캐릭터 준비 중)` : s.name}
            className={
              'text-xs px-2.5 py-1 rounded-full border transition ' +
              (on
                ? 'bg-seal text-white border-seal'
                : disabled
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-600 border-slate-300 hover:border-seal')
            }
          >
            {s.name}
            {disabled && <span className="ml-1 text-[10px]">(준비 중)</span>}
          </button>
        )
      })}
    </div>
  )
}
