import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
import { OutputActions } from "@/components/output-actions";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkAI" },
      {
        name: "description",
        content: "Generate professional workplace emails in your chosen tone with AI.",
      },
    ],
  }),
  component: EmailPage,
});

type Tone = "Formal" | "Friendly" | "Persuasive";

const SYSTEM = `You are an expert professional email writer. Produce a complete, ready-to-send workplace email that includes:
- an appropriate greeting
- a professional opening
- a clear, well-structured body
- a call to action when appropriate
- a professional closing and sign-off placeholder ([Your name])

Use plain text only, no markdown. Keep it concise and workplace-appropriate.`;

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [keyInfo, setKeyInfo] = useState("");
  const [instructions, setInstructions] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!purpose.trim() || !recipient.trim()) {
      toast.error("Please provide at least a purpose and recipient.");
      return;
    }
    setLoading(true);
    try {
      const prompt = [
        `Purpose: ${purpose}`,
        `Recipient: ${recipient}`,
        subject && `Suggested subject: ${subject}`,
        `Tone: ${tone}`,
        keyInfo && `Key information to include:\n${keyInfo}`,
        instructions && `Additional instructions:\n${instructions}`,
        "",
        "Write the email now. If no subject was provided, propose one on the first line as 'Subject: ...'.",
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
      toast.error(err instanceof Error ? err.message : "Failed to generate email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Smart Email Generator</h1>
          <p className="text-sm text-muted-foreground">
            Draft a professional email tailored to your purpose and tone.
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Email details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose *</Label>
              <Input
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Request a project deadline extension"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient *</Label>
                <Input
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. My manager Sarah"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject (optional)</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Deadline extension request"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="keyInfo">Key information</Label>
              <Textarea
                id="keyInfo"
                rows={4}
                value={keyInfo}
                onChange={(e) => setKeyInfo(e.target.value)}
                placeholder="Bullet points, context, dates, names…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions">Additional instructions</Label>
              <Textarea
                id="instructions"
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Keep under 150 words; end with a specific ask."
              />
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generate} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…
                </>
              ) : (
                "Generate email"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder="Your generated email will appear here. It stays fully editable."
              className="min-h-[380px] font-mono text-sm"
            />
            <OutputActions
              text={output}
              filename="email.txt"
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
