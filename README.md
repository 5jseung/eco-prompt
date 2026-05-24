# Eco Prompt Genie

A prototype prompting interface that nudges users toward more efficient, detailed prompts for AI image generation. Built for HCI 팀과제 3.

The UI is a guided prompt builder (8 structured sections) paired with a seal character whose expression shifts from distressed → content as the user fills more sections. The app does **not** generate images directly; it generates a paste-ready image-generation prompt that users can edit and copy. The goal is an **eco-nudge**, not a literal impact metric.

Current flow:
1. The user fills structured prompt sections.
2. The app assembles a local prompt draft.
3. If `GEMINI_API_KEY` is configured, Gemini rewrites the form data into a polished, executable image-generation prompt.
4. If no key is configured, the local draft is shown as a fallback.
5. After generation, form sections collapse into selected-value summaries and the generated prompt remains editable in a fixed bottom panel.

---

## Stack

- **Vite + React + Tailwind CSS** — single-page frontend
- **Gemini API** — optional prompt-writing call that rewrites form inputs into a polished final prompt
- **Local Vite API middleware** — runs `/api/generate` during `npm run dev`
- **Vercel serverless function** (`/api/generate`) — uses the same API handler after deployment
- **GitHub** — version control / collaboration
- **Vercel** — hosting (free, deploys on every push)

Fallback behavior: if no Gemini key is configured, the "프롬프트 생성하기" button renders the locally assembled prompt draft as text. If a Gemini key is configured, Gemini rewrites the filled form information into a polished final image-generation prompt.

---

## Local setup (do this once)

```bash
# 1. Clone
git clone <github-repo-url>
cd hci

# 2. Install deps (Node 18+ required)
npm install

# 3. Run dev server
npm run dev
# → opens http://localhost:5173
```

That's it for working on the UI. In local development, Vite also runs a small local middleware for `/api/generate`, so Gemini prompt generation can be tested with `npm run dev` without using the Vercel CLI.

### Running with the Gemini API locally

Only do this when you actually want to test Gemini-powered prompt generation end-to-end.

```bash
# create your local env file
cp .env.example .env
# then put a real key from https://aistudio.google.com/apikey into .env

# run the normal dev server
npm run dev
# → http://localhost:5173, or the next available port
```

`.env`, `.env.local`, and other local env files are gitignored — your key never leaves your machine.

### When to use Vercel locally

You usually do **not** need Vercel for local development. Use `npm run dev` for UI work and Gemini prompt-generation testing.

Use `vercel dev` only when you specifically need to test the exact Vercel serverless runtime before deployment.

---

## Project structure

```
hci/
├── api/
│   └── generate.js        # Vercel serverless: asks Gemini to write a final prompt if key is set
├── docs/                  # meeting notes, wireframes, original PDFs
├── public/
│   └── seal/              # seal-1..5.png (sad → happy)
├── src/
│   ├── components/
│   │   ├── Character.jsx  # bottom-right seal expression + animation
│   │   ├── Field.jsx      # multi/single/text input primitives
│   │   └── Section.jsx    # one prompt section
│   ├── data/
│   │   └── sections.js    # ⭐ edit this to change the form layout
│   ├── utils/
│   │   └── buildPrompt.js # form-state → prompt string + fill counter
│   ├── App.jsx            # page layout
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js       # Vite config + local /api/generate middleware
└── .env.example
```

### Where to make common changes

| You want to…                                  | Edit this file                  |
|-----------------------------------------------|---------------------------------|
| Add/rename a prompt section                   | `src/data/sections.js`          |
| Change how the prompt string is assembled     | `src/utils/buildPrompt.js`      |
| Tweak the character animation triggers        | `src/components/Character.jsx`  |
| Change the layout / header / output area      | `src/App.jsx`                   |
| Change collapsed-section summary behavior     | `src/components/Section.jsx`    |
| Swap colors / animations                      | `tailwind.config.js`            |
| Use a different prompt model / endpoint       | `api/generate.js`               |

---

## Current UX behavior

- The bottom-right seal changes expression based on completed section count:
  - 0 sections → `seal-1`
  - 1-3 sections → `seal-2`
  - 4 sections → `seal-3`
  - 5 sections → `seal-4`
  - 6+ sections → `seal-5`
- The seal no longer shows always-on speech-bubble facts. This avoids unsupported environmental claims during user testing.
- After prompt generation, every section collapses into a summary showing only selected or typed values.
- A collapsed section can be clicked anywhere to reopen it. Open sections show a small `접기` control.
- The generated prompt is editable. The `복사` button copies the edited text, not the original generated text.
- The prompt editor stays fixed at the bottom after generation, with page padding reserved so sections are still reachable while scrolling.

---

## Git workflow with your teammate

Simple branch-per-feature flow. Works for two people.

```bash
# pull latest
git checkout main
git pull

# start a feature
git checkout -b feat/penguin-character

# ...make changes, commit small...
git add .
git commit -m "feat: add penguin character variant"
git push -u origin feat/penguin-character

# then open a Pull Request on GitHub → ask the other person to review → merge
```

Rules of thumb:
- **Never commit `.env.local`** — it's gitignored but double-check.
- **Don't push directly to `main`.** Use branches + PRs so the other person sees what changed.
- **Small commits beat one giant one.** Easier to review and easier to revert.
- If two people edit the same file, the second to push will hit a merge conflict — `git pull --rebase origin main` on your branch before pushing usually fixes it.

---

## Deploying to Vercel (so the team can share a live link)

1. Push the repo to GitHub.
2. Go to https://vercel.com → "Add New Project" → import the GitHub repo.
3. Framework preset: **Vite**. Build command and output dir are auto-detected.
4. (Optional) Add `GEMINI_API_KEY` under Settings → Environment Variables.
5. Click Deploy. You'll get a URL like `eco-prompt-genie.vercel.app`.
6. Every push to `main` redeploys automatically. PRs get preview URLs.

---

## What's still TODO

- [ ] Penguin and bee character sprites (only seal is wired up)
- [ ] Hover info card for endangered species, ideally with sourced animal facts
- [ ] Article/source links on character click
- [ ] Decide whether to bring back speech-bubble content with cited sources
- [ ] Tighten copy / Korean strings before user study
- [ ] Test Gemini prompt quality across sparse, Korean, and highly detailed inputs
