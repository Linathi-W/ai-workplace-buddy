# AI Workplace Productivity Assistant

A modern, responsive web application that helps professionals automate everyday workplace tasks using artificial intelligence. The app delivers a clean, intuitive SaaS-like experience while remaining fully privacy-focused: no account required, no data persistence, and no tracking — everything happens in the current browser session.

## Project Overview

This application provides instant access to AI-powered workplace tools through a simple, professional interface. Users can generate professional emails, plan their workday, and chat with an AI assistant for workplace guidance. All AI interactions are handled server-side via the Lovable AI Gateway, and no user content is stored, logged, or persisted anywhere.

The app is built as a public, session-only experience:
- No authentication or login
- No database or cloud storage
- No `localStorage`/`sessionStorage`/cookies used for content
- Refreshing the page clears all in-memory state

## Features Implemented

### Dashboard (`/`)
- Welcome hero with app description
- Three feature cards linking to each AI tool
- Clean, responsive layout with quick navigation

### Smart Email Generator (`/email`)
- Form inputs: purpose, recipient, optional subject, key information, extra instructions, and tone (Formal / Friendly / Persuasive)
- Generates a structured professional email with greeting, intro, body, closing, and call-to-action
- Result is editable in a text area
- Actions: Copy to clipboard, Download as `.txt`, Regenerate, Clear

### AI Task Planner (`/planner`)
- Form inputs: tasks, deadlines, meetings, working hours, and priority preference
- Generates a structured markdown plan including daily/weekly schedule, priority buckets, time blocks, breaks, and productivity tips
- Editable result with markdown preview toggle
- Actions: Copy to clipboard, Download as `.md`, Regenerate

### AI Workplace Chatbot (`/chat`)
- Streaming chat interface using `@ai-sdk/react` and `useChat`
- Real-time assistant responses with typing indicator
- Messages rendered with markdown support
- User messages aligned right, assistant messages aligned left
- Per-message actions: Edit (inline), Copy, Regenerate
- Clear chat button to reset the conversation

### Responsible AI Notice
- A persistent banner/footer is visible on every page reminding users that AI-generated content should be reviewed for accuracy and appropriateness before use in professional settings.

## Technologies and Tools Used

### Core Stack
- **TanStack Start** — Full-stack React 19 framework with SSR/SSG and server functions
- **React 19** — UI library
- **TypeScript** — Type-safe development
- **Vite 8** — Build tool and dev server

### Styling & UI
- **Tailwind CSS v4** — Utility-first styling
- **shadcn/ui** — Accessible, composable UI components
- **Lucide React** — Icon library
- **Inter** — Primary font family

### AI & Backend
- **Lovable AI Gateway** — Server-side AI completions
- **AI SDK** (`ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`) — Streaming and non-streaming AI interactions
- **Google Gemini 3 Flash Preview** — Chat/completion model

### Utilities
- **React Hook Form** + **Zod** — Form handling and validation
- **react-markdown** — Markdown rendering for task plans and chat messages
- **TanStack Query** — Data synchronization and caching
- **Sonner** — Toast notifications
- **date-fns** — Date utilities

## Setup Instructions

### Prerequisites
- [Bun](https://bun.sh/) installed (recommended for this project)
- Node.js 20+ (if using npm/pnpm instead)

### 1. Install dependencies

```bash
bun install
```

Or with npm:

```bash
npm install
```

### 2. Configure environment variables

The app uses the Lovable AI Gateway, which is provisioned automatically in the Lovable environment. No manual API key setup is required when running inside the Lovable platform.

For local development outside Lovable, ensure `LOVABLE_API_KEY` is set in your environment:

```bash
export LOVABLE_API_KEY="your-lovable-api-key"
```

### 3. Run the development server

```bash
bun dev
```

The app will be available at `http://localhost:8080` by default.

### 4. Build for production

```bash
bun build
```

### 5. Preview the production build

```bash
bun preview
```

### Available scripts

| Script | Description |
|--------|-------------|
| `bun dev` | Start the development server |
| `bun build` | Build for production |
| `bun build:dev` | Build in development mode |
| `bun preview` | Preview the production build |
| `bun lint` | Run ESLint |
| `bun format` | Format code with Prettier |

## Project Structure

```
src/
  components/          # Reusable UI components (sidebar, app shell, AI notice, output actions)
  hooks/               # Custom React hooks
  lib/                 # Utility libraries (AI gateway helper, error handling)
  routes/              # TanStack Start file-based routes
    __root.tsx         # Root layout wrapping every page
    index.tsx          # Dashboard home page
    email.tsx          # Smart Email Generator
    planner.tsx        # AI Task Planner
    chat.tsx           # AI Workplace Chatbot
    api/
      chat.ts          # Streaming chat endpoint
      generate.ts      # Non-streaming generation endpoint
  styles.css           # Global styles and Tailwind theme tokens
```

## Privacy & Session-Only Guarantee

- All content lives only in React memory for the current session.
- No account, login, or personal information is collected.
- AI handlers do not log, store, or persist prompts or responses.
- Refreshing the browser clears all generated content and chat history.
