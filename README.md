# Eco Prompt Genie

A prototype prompting interface that nudges users toward more efficient, detailed prompts for AI image generation. Built for HCI 팀과제 3.

The UI is a guided prompt builder (8 structured sections) paired with a seal character whose expression shifts from distressed → content as the user fills more sections. The goal is an **eco-nudge**, not a literal impact metric.

---

## Stack

- **Vite + React + Tailwind CSS** — single-page frontend
- **Vercel serverless function** (`/api/generate`) — optional Gemini API call (key kept server-side)
- **GitHub** — version control / collaboration
- **Vercel** — hosting (free, deploys on every push)

Fallback behavior: if no Gemini key is configured, the "프롬프트 출력하기" button just renders the assembled prompt as text. That covers the user-study fallback path from the meeting notes.

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

That's it for working on the UI. The `/api/generate` endpoint is a Vercel function — it won't run under `npm run dev` (the frontend silently falls back to text output, which is fine while iterating).

### Running with the Gemini API locally

Only do this when you actually want to test image generation end-to-end.

```bash
# install vercel cli once
npm i -g vercel

# create your local env file
cp .env.example .env.local
# then put a real key from https://aistudio.google.com/apikey into .env.local

# run with the serverless function active
vercel dev
# → http://localhost:3000
```

`.env.local` is gitignored — your key never leaves your machine.

---

## Project structure

```
hci/
├── api/
│   └── generate.js        # Vercel serverless: calls Gemini if key is set
├── docs/                  # meeting notes, wireframes, original PDFs
├── public/
│   └── seal/              # seal-1..5.png (sad → happy)
├── src/
│   ├── components/
│   │   ├── Character.jsx  # bottom-right seal + speech bubble
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
├── vite.config.js
└── .env.example
```

### Where to make common changes

| You want to…                                  | Edit this file                  |
|-----------------------------------------------|---------------------------------|
| Add/rename a prompt section                   | `src/data/sections.js`          |
| Change how the prompt string is assembled     | `src/utils/buildPrompt.js`      |
| Tweak the character animation triggers        | `src/components/Character.jsx`  |
| Change the layout / header / output area      | `src/App.jsx`                   |
| Swap colors / animations                      | `tailwind.config.js`            |
| Use a different image model / endpoint        | `api/generate.js`               |

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
- [ ] Hover info on endangered species (from 회의록 0517)
- [ ] Article links on character click
- [ ] Speech-bubble content review (currently placeholder facts)
- [ ] Tighten copy / Korean strings before user study
