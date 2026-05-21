// Decides whether a section counts as "filled" (for the character animation)
// and turns the whole form state into a single prompt string for Gemini.

import { SECTIONS } from '../data/sections.js'

const flatten = (val) => {
  if (val == null) return []
  if (Array.isArray(val)) return val.filter(Boolean)
  if (typeof val === 'string') return val.trim() ? [val.trim()] : []
  if (typeof val === 'object') {
    return Object.values(val).flatMap(flatten)
  }
  return []
}

export function isSectionFilled(section, value) {
  if (value == null) return false
  if (section.type === 'group') {
    // any sub-field having content counts the section as touched
    return section.fields.some((f) => flatten(value?.[f.id]).length > 0)
  }
  return flatten(value).length > 0
}

export function countFilledSections(state) {
  return SECTIONS.reduce(
    (n, s) => n + (isSectionFilled(s, state[s.id]) ? 1 : 0),
    0,
  )
}

// Convert the form state into a single prompt string.
// Negative-prompt content is appended as `Negative prompt: ...` at the end
// (this is the convention most image models recognize).
export function buildPrompt(state) {
  const positiveParts = []
  let negative = ''

  for (const s of SECTIONS) {
    const v = state[s.id]
    if (!isSectionFilled(s, v)) continue

    if (s.id === 'negative') {
      negative = flatten(v).join(', ')
      continue
    }

    if (s.type === 'group') {
      const sub = s.fields
        .map((f) => {
          const vals = flatten(v?.[f.id])
          if (!vals.length) return null
          return `${f.label}: ${vals.join(', ')}`
        })
        .filter(Boolean)
        .join('; ')
      if (sub) positiveParts.push(`[${s.title}] ${sub}`)
    } else {
      positiveParts.push(`[${s.title}] ${flatten(v).join(', ')}`)
    }
  }

  let out = positiveParts.join('\n')
  if (negative) out += `\n\nNegative prompt: ${negative}`
  return out.trim()
}
