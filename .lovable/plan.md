
## AI Workplace Productivity Assistant

A modern SaaS-style productivity app with three AI tools. Fully public, session-only (state lives in React memory), no database, no auth, no persistence.

### Stack & Backend
- TanStack Start (existing template) + Tailwind v4 + shadcn/ui.
- AI via Lovable AI Gateway using the AI SDK. Server-side only; `LOVABLE_API_KEY` provisioned automatically.
- Chat model: `google/gemini-3-flash-preview` (fast, multimodal-capable, good for all three tools).
- No Lovable Cloud / no Supabase / no localStorage persistence.

### Layout & Design
- Sidebar (shadcn `Sidebar`, `collapsible="icon"`) with: Dashboard, Email Generator, Task Planner, Chatbot.
- Top bar with `SidebarTrigger` (mobile hamburger) + app name.
- Inter font loaded via `<link>` in `__root.tsx` head.
- Neutral professional palette (slate/indigo accent) via semantic tokens in `src/styles.css` — no hardcoded colors in components.
- Rounded cards, subtle shadows, smooth transitions. Responsive down to mobile.
- Persistent footer/banner with the Responsible AI Notice.

### Routes (`src/routes/`)
- `__root.tsx` — update title/description/OG, add Inter font link, wrap `<Outlet />` in `SidebarProvider` + `AppSidebar` + header shell.
- `index.tsx` — Dashboard: welcome hero + 3 tool cards linking to each feature.
- `email.tsx` — Smart Email Generator page.
- `planner.tsx` — AI Task Planner page.
- `chat.tsx` — AI Workplace Chatbot page.
- `api/chat.ts` — streaming chat endpoint (used by chatbot via `useChat`).
- `api/generate.ts` — non-streaming endpoint for email + planner (JSON `{prompt, system}` → `{text}`).

### Server helpers
- `src/lib/ai-gateway.server.ts` — Lovable AI Gateway provider helper (per knowledge file).
- Both API routes read `process.env.LOVABLE_API_KEY` inside handlers, surface 429/402 errors with clear messages.

### Feature 1 — Smart Email Generator (`/email`)
- Form: purpose, recipient, subject (optional), key info (textarea), extra instructions (textarea), tone select (Formal / Friendly / Persuasive).
- Submit → POST `/api/generate` with a system prompt instructing structured professional email (greeting, intro, body, closing, CTA).
- Result rendered in an editable `<Textarea>` (session state).
- Actions: Copy, Download (.txt), Regenerate, Clear.

### Feature 2 — AI Task Planner (`/planner`)
- Form: tasks (multiline), deadlines (multiline), meetings (multiline), working hours (start/end), priority preference (select).
- Submit → POST `/api/generate` with system prompt to produce a structured markdown plan (daily/weekly schedule, priority buckets, time blocks, breaks, tips).
- Editable textarea result rendered with markdown preview toggle (`react-markdown`).
- Actions: Copy, Download (.md), Regenerate.

### Feature 3 — AI Workplace Chatbot (`/chat`)
- `useChat` from `@ai-sdk/react` → `DefaultChatTransport({ api: '/api/chat' })`.
- Server route uses `streamText` + `toUIMessageStreamResponse`, system prompt: professional workplace assistant.
- UI: message list rendering `message.parts` with `react-markdown`, user bubbles right, assistant left, typing indicator while `status` is submitted/streaming, composer with Enter-to-send.
- Per-assistant-message actions: Edit (inline), Copy, Regenerate (removes last assistant msg and re-sends).
- "Clear chat" button. All state in-memory; refresh wipes.

### Responsible AI Notice
- Small persistent bar/footer visible on every page with the disclaimer text.

### Session-only guarantee
- No `localStorage`/`sessionStorage`/cookies used for content.
- No DB, no server storage; AI route handlers do not log or persist prompts/responses.

### Packages to add
- `ai`, `@ai-sdk/openai-compatible`, `@ai-sdk/react`, `react-markdown`.

### Files created/modified
- Modify: `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/styles.css`.
- Create: `src/components/app-sidebar.tsx`, `src/components/ai-notice.tsx`, `src/components/app-shell.tsx`, `src/lib/ai-gateway.server.ts`, `src/routes/email.tsx`, `src/routes/planner.tsx`, `src/routes/chat.tsx`, `src/routes/api/chat.ts`, `src/routes/api/generate.ts`.

### Out of scope
- No login, profiles, saved history, favorites, analytics, or any persistence.
