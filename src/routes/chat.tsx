import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Copy,
  Loader2,
  MessageSquare,
  RefreshCw,
  Pencil,
  Check,
  X,
  Send,
  Trash2,
} from "lucide-react";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chatbot — WorkAI" },
      {
        name: "description",
        content:
          "Chat with an AI workplace assistant. Drafts, summaries, brainstorms — session-only, no sign-in.",
      },
    ],
  }),
  component: ChatPage,
});

function getText(m: UIMessage): string {
  return m.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("")
    .trim();
}

function ChatPage() {
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);

  const { messages, setMessages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (e) => toast.error(e.message || "Chat request failed"),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const submit = () => {
    const value = input.trim();
    if (!value || isLoading) return;
    sendMessage({ text: value });
    setInput("");
  };

  const regenerate = () => {
    // Find last user message; drop everything after it and resend it.
    let lastUserIdx = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        lastUserIdx = i;
        break;
      }
    }
    if (lastUserIdx < 0) return;
    const last = messages[lastUserIdx];
    const text = getText(last);
    setMessages(messages.slice(0, lastUserIdx));
    sendMessage({ text });
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  const startEdit = (m: UIMessage) => {
    setEditingId(m.id);
    setEditingText(getText(m));
  };

  const saveEdit = (id: string) => {
    setMessages(
      messages.map((m) =>
        m.id === id
          ? ({ ...m, parts: [{ type: "text", text: editingText }] } as UIMessage)
          : m,
      ),
    );
    setEditingId(null);
    setEditingText("");
  };

  const clearChat = () => {
    setMessages([]);
    setEditingId(null);
    setInput("");
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-4xl flex-col px-4 py-6">
      <header className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">AI Workplace Chatbot</h1>
          <p className="text-sm text-muted-foreground">
            Ask for drafts, summaries, or brainstorms — this conversation lives only in your browser.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={clearChat} disabled={messages.length === 0}>
          <Trash2 className="mr-1.5 h-4 w-4" /> Clear
        </Button>
      </header>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden p-4">
          <div ref={scrollerRef} className="flex-1 space-y-4 overflow-y-auto pr-2">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground">
                <p className="mb-3">Try asking:</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    "Summarize these meeting notes: …",
                    "Draft a follow-up email to a client",
                    "Give me 5 ideas for a Q3 kickoff presentation",
                    "How do I run a good weekly 1:1?",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="rounded-md border bg-background px-3 py-2 text-left hover:bg-accent"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => {
              const text = getText(m);
              const isUser = m.role === "user";
              const isEditing = editingId === m.id;
              return (
                <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {isEditing ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="min-h-24 bg-background text-foreground"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" onClick={() => saveEdit(m.id)}>
                            <Check className="mr-1 h-3.5 w-3.5" /> Save
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                            <X className="mr-1 h-3.5 w-3.5" /> Cancel
                          </Button>
                        </div>
                      </div>
                    ) : isUser ? (
                      <p className="whitespace-pre-wrap">{text}</p>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{text || " "}</ReactMarkdown>
                      </div>
                    )}

                    {!isEditing && (
                      <div
                        className={`mt-2 flex gap-1 ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <button
                          onClick={() => copy(text)}
                          className={`rounded p-1 text-xs opacity-70 hover:opacity-100 ${
                            isUser ? "hover:bg-primary-foreground/10" : "hover:bg-background"
                          }`}
                          title="Copy"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => startEdit(m)}
                          className={`rounded p-1 text-xs opacity-70 hover:opacity-100 ${
                            isUser ? "hover:bg-primary-foreground/10" : "hover:bg-background"
                          }`}
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {status === "submitted" && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
                  </span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-2 text-xs text-destructive">
              {error.message}
            </div>
          )}

          <div className="flex items-end gap-2 border-t pt-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Ask anything about work… (Shift+Enter for a new line)"
              className="min-h-[52px] max-h-40 flex-1 resize-none"
              disabled={isLoading}
            />
            <div className="flex flex-col gap-2">
              <Button onClick={submit} disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={regenerate}
                disabled={isLoading || messages.length === 0}
                title="Regenerate last response"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
