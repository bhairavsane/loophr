# LoopHR — Automate Your HR

LoopHR discovers repetitive HR workflows from historical cases, reconciles them with official policy, and backtests the proposed automation against those same real-world cases before you ever deploy it.

## The Problem
Enterprise HR teams are drowning in repetitive requests (adding dependents, verification letters, address updates) that standard automation can't handle because the *actual* process is buried in tribal knowledge and often contradicts official policy.

## The Solution
LoopHR flips the model: it learns the automation by watching how humans *actually* do the work, then proves it's safe by replaying historical cases.

## Tech Stack
- **Framework**: Next.js (App Router, Webpack)
- **Styling**: Tailwind CSS, custom Linear-inspired design tokens
- **Graphs**: React Flow
- **AI**: Vercel AI SDK + Groq (`openai/gpt-oss-120b`)
- **Validation**: Zod
- **Motion**: Framer Motion

## Local Development
1. Clone the repository
2. Run `npm install`
3. Copy `.env.example` to `.env` and add your Groq API key: `GROQ_API_KEY=gsk_your_key`
4. Run `npm run dev` (or `npm run build && npm start`)
5. Open [http://localhost:27981](http://localhost:27981)
