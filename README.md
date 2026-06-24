# SearchJobs

A resume-powered job search web app built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- **Resume upload** — drag-and-drop or click to upload PDF, DOCX, or TXT
- **Automatic extraction** — skills and job title parsed from your resume
- **Country selection** — 15 countries (US, UK, Canada, Australia, Germany, France, Netherlands, Singapore, India, and more)
- **Multi-source search** — queries Adzuna, JSearch (LinkedIn/Indeed/Glassdoor/ZipRecruiter), and Remotive simultaneously
- **Job cards** — title, company, location, salary, description, and a direct **Apply** link to the original posting
- **Source filter** — filter results by job board

## Getting Started

### 1. Install

```bash
npm install
```

### 2. Configure API keys

```bash
cp .env.local.example .env.local
```

| Variable | Source | Free tier |
|---|---|---|
| `ADZUNA_APP_ID` + `ADZUNA_APP_KEY` | https://developer.adzuna.com/ | Yes |
| `JSEARCH_API_KEY` | https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch | Yes |

> **Remotive** (remote jobs) is always searched for free — no key needed.

### 3. Run

```bash
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel

```bash
npx vercel
```

Set `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`, and `JSEARCH_API_KEY` in your Vercel project settings.
