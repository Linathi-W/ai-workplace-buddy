import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { createLovableAiGatewayProvider, CHAT_MODEL } from "@/lib/ai-gateway.server";

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { system?: string; prompt?: string };
        if (!body.prompt || typeof body.prompt !== "string") {
          return new Response("prompt is required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        try {
          const gateway = createLovableAiGatewayProvider(key);
          const { text } = await generateText({
            model: gateway(CHAT_MODEL),
            system: body.system,
            prompt: body.prompt,
          });
          return Response.json({ text });
        } catch (err) {
          const message = err instanceof Error ? err.message : "AI request failed";
          const status = /429|rate/i.test(message)
            ? 429
            : /402|credit/i.test(message)
              ? 402
              : 500;
          const friendly =
            status === 429
              ? "The AI service is busy. Please try again in a moment."
              : status === 402
                ? "AI credits are exhausted. Please add credits to continue."
                : message;
          return new Response(friendly, { status });
        }
      },
    },
  },
});
