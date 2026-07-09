import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, CalendarClock, MessageSquare, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const tools = [
  {
    to: "/email" as const,
    title: "Smart Email Generator",
    description: "Draft polished professional emails in any tone in seconds.",
    icon: Mail,
  },
  {
    to: "/planner" as const,
    title: "AI Task Planner",
    description: "Turn your tasks, deadlines, and meetings into a focused schedule.",
    icon: CalendarClock,
  },
  {
    to: "/chat" as const,
    title: "AI Workplace Chatbot",
    description: "Ask anything about work — summarize, brainstorm, and refine.",
    icon: MessageSquare,
  },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <section className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Welcome to your AI workspace
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Generate professional emails, organize your workload, and chat with an AI workplace
          assistant. No sign-in required — everything stays in your browser session.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {tools.map((tool) => (
          <Card
            key={tool.to}
            className="group transition-shadow hover:shadow-md"
          >
            <CardHeader>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <tool.icon className="h-5 w-5" />
              </div>
              <CardTitle>{tool.title}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary" className="w-full justify-between">
                <Link to={tool.to}>
                  Open
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
