# AI Workplace Productivity Assistant

A modern, responsive web application that helps professionals automate daily work tasks using AI. Built with TanStack Start, React 19, Tailwind CSS, and the Lovable AI Gateway.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/typescript-5.8-3178C6?logo=typescript)

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Smart Email Generator** | Generate professional emails tailored by tone (Professional, Friendly, Persuasive, etc.) and audience (Client, Manager, Executive, etc.). |
| **Meeting Notes Summarizer** | Extract summaries, key points, action items, decisions, and open questions from raw meeting notes or transcripts. |
| **AI Task Planner** | Prioritize tasks using the Eisenhower Matrix and build a realistic, time-blocked schedule for your day or week. |
| **AI Research Assistant** | Produce structured research briefs (Brief / Standard / Deep) with insights, trends, risks, and next steps. |
| **AI Chatbot Interface** | Interactive assistant for general workplace productivity questions, writing help, and brainstorming. |

## 🚀 Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (full-stack React 19 with SSR/SSG)
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **AI:** Lovable AI Gateway (`google/gemini-3-flash-preview`)
- **Validation:** Zod (structured prompt engineering & input validation)
- **State & Data:** TanStack Query + React Router
- **Markdown:** `react-markdown` for rich AI output rendering
- **Icons:** Lucide React

## 📁 Project Structure

```
src/
├── components/
│   ├── AIOutput.tsx          # Markdown renderer, copy-to-clipboard, AI disclaimer
│   ├── AppSidebar.tsx        # Collapsible sidebar navigation
│   ├── PageHeader.tsx        # Consistent page headers with branding
│   └── ui/                   # shadcn/ui primitives (button, card, select, etc.)
├── lib/
│   ├── ai.functions.ts       # Server functions for all 5 AI features
│   └── utils.ts              # Utility helpers (cn, etc.)
├── routes/                   # File-based TanStack Start routing
│   ├── __root.tsx            # Root layout (providers, sidebar, global states)
│   ├── index.tsx             # Dashboard home
│   ├── email.tsx             # Smart Email Generator
│   ├── meetings.tsx          # Meeting Notes Summarizer
│   ├── planner.tsx           # AI Task Planner
│   ├── research.tsx          # AI Research Assistant
│   └── chat.tsx              # AI Chatbot Interface
├── styles.css                # Global styles + design tokens
└── start.ts                  # App bootstrap (functionMiddleware, requestMiddleware)
```

## 🛠️ Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (or Node.js 20+)
- A Lovable API key (for AI Gateway access)

### Installation

```bash
# Install dependencies
bun install

# Configure environment
# Set LOVABLE_API_KEY in your environment or secrets manager
```

### Development

```bash
bun run dev
```

The app will be available at `http://localhost:3000`.

### Build

```bash
# Production build
bun run build

# Development build (for testing)
bun run build:dev
```

## 🔑 Environment Variables

| Variable | Context | Description |
|----------|---------|-------------|
| `LOVABLE_API_KEY` | Server only | Lovable AI Gateway API key |

## 🧠 AI Prompt Engineering

Each feature uses structured system prompts and Zod-validated inputs:

- **Email Generator** — Injects tone, audience, and recipient context into a business-writing prompt.
- **Meeting Summarizer** — Forces exact markdown sections (Summary, Key Points, Action Items, Decisions, Open Questions).
- **Task Planner** — Uses Eisenhower Matrix + time-blocking to build realistic schedules.
- **Research Assistant** — Produces consistent research briefs with insight depth control.
- **Chat** — General-purpose workplace assistant with markdown formatting.

All outputs include the disclaimer: **"AI-generated content may require human review."**

## 📱 Design System

- **Theme:** Professional SaaS aesthetic with semantic CSS tokens (`--primary`, `--accent`, `--muted`, etc.)
- **Colors:** Defined in `oklch` in `src/styles.css`
- **Layout:** Sidebar navigation + card-based content panels
- **Responsive:** Fully responsive from mobile to desktop

## 🤝 Contributing

Contributions are welcome. Please ensure:

1. Code follows the existing TypeScript strict mode settings.
2. All new AI features include Zod input validation.
3. UI changes use the design token system (`src/styles.css`).
4. Server functions are placed in `src/lib/*.functions.ts` (not `src/server/`).

## 📄 License

MIT

---

> **Disclaimer:** AI-generated content may require human review. Always verify critical business communications before sending.
