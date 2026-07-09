import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OutputActions } from "@/components/output-actions";
import { toast } from "sonner";
import { CalendarClock, Loader2 } from "lucide-react";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — WorkAI" },
      {
        name: "description",
        content: "Turn tasks, deadlines, and meetings into a prioritized daily or weekly plan.",
      },
    ],
  }),
  component: PlannerPage,
});

type Scope = "Daily" | "Weekly";
type Priority = "Urgency first" | "Importance first" | "Balanced";

const SYSTEM = `You are an expert productivity coach. Build a realistic, prioritized workplace schedule in Markdown with these sections:
1. Overview (2–3 lines)
2. Priority buckets: High, Medium, Low
3. Time-blocked schedule (with clock times inside working hours)
4. Break suggestions
5. Productivity tips (3–5 bullets)

Prioritize tasks using urgency and importance. Respect the user's working hours and meetings.`;

function PlannerPage() {
  const [scope, setScope] = useState<Scope>("Daily");
  const [tasks, setTasks] = useState("");
  const [deadlines, setDeadlines] = useState("");
  const [meetings, setMeetings] = useState("");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [priority, setPriority] = useState<Priority>("Balanced");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!tasks.trim()) {
      toast.error("Please list at least one task.");
      return;
    }
    setLoading(true);
    try {
      const prompt = [
        `Plan scope: ${scope}`,
        `Working hours: ${start} – ${end}`,
        `Priority preference: ${priority}`,
        `Tasks (with estimated durations if known):\n${tasks}`,
        deadlines && `Deadlines:\n${deadlines}`,
        meetings && `Meetings (with times):\n${meetings}`,
        "",
        "Produce the plan now.",
      ]
        .filter(Boolean)
        .join("\n");

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: SYSTEM, prompt }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { text: string };
      setOutput(data.text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <CalendarClock className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI Task Planner</h1>
          <p className="text-sm text-muted-foreground">
            Get a prioritized, time-blocked schedule based on your workload.
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your workload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Plan scope</Label>
                <Select value={scope} onValueChange={(v) => setScope(v as Scope)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority preference</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Urgency first">Urgency first</SelectItem>
                    <SelectItem value="Importance first">Importance first</SelectItem>
                    <SelectItem value="Balanced">Balanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start">Working hours start</Label>
                <Input id="start" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">Working hours end</Label>
                <Input id="end" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tasks">Tasks *</Label>
              <Textarea
                id="tasks"
                rows={5}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                placeholder={"e.g.\n- Finish Q3 report (~2h)\n- Review 3 PRs (~1h)\n- Draft roadmap (~90m)"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadlines">Deadlines</Label>
              <Textarea
                id="deadlines"
                rows={3}
                value={deadlines}
                onChange={(e) => setDeadlines(e.target.value)}
                placeholder={"e.g.\n- Q3 report due today 5pm\n- Roadmap draft Friday"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meetings">Meetings</Label>
              <Textarea
                id="meetings"
                rows={3}
                value={meetings}
                onChange={(e) => setMeetings(e.target.value)}
                placeholder={"e.g.\n- 10:00–10:30 Standup\n- 14:00–15:00 Client call"}
              />
            </div>

            <Button onClick={generate} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Building your plan…
                </>
              ) : (
                "Generate plan"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Tabs defaultValue="edit">
              <TabsList>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="edit">
                <Textarea
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  placeholder="Your plan will appear here in Markdown. It stays fully editable."
                  className="min-h-[420px] font-mono text-sm"
                />
              </TabsContent>
              <TabsContent value="preview">
                <div className="prose prose-sm dark:prose-invert min-h-[420px] max-w-none rounded-md border bg-muted/30 p-4">
                  {output ? (
                    <ReactMarkdown>{output}</ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground">Nothing to preview yet.</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            <OutputActions
              text={output}
              filename="plan.md"
              regenerating={loading}
              onRegenerate={generate}
              onClear={() => setOutput("")}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
