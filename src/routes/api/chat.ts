import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider, CHAT_MODEL } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are a professional workplace productivity assistant. Help users with everyday workplace tasks: drafting emails, summarizing meeting notes, improving written communication, explaining workplace concepts, generating presentation ideas, organizing projects, brainstorming solutions, and answering productivity questions.

Guidelines:
- Be professional, helpful, concise, and action-oriented.
- Use bullet points and short sections when they aid clarity.
- Recommend next steps and best practices where appropriate.
- Maintain a friendly, professional tone.
- Format responses in Markdown.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(body.messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        try {
          const gateway = createLovableAiGatewayProvider(key);
          const result = streamText({
            model: gateway(CHAT_MODEL),
            system: SYSTEM_PROMPT,
            messages: await convertToModelMessages(body.messages as UIMessage[]),
          });
          return result.toUIMessageStreamResponse({
            originalMessages: body.messages as UIMessage[],
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "AI request failed";
          return new Response(msg, { status: 500 });
        }
      },
    },
  },
});
