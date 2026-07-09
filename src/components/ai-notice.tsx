import { ShieldAlert } from "lucide-react";

export function AiNotice() {
  return (
    <div className="border-t bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
      <div className="mx-auto flex max-w-6xl items-start gap-2">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          <span className="font-medium text-foreground">Responsible AI Notice:</span> This app uses
          AI to assist with workplace productivity. AI-generated content may contain inaccuracies.
          Review and verify all emails, schedules, and recommendations before using them in
          professional settings. Human judgment should always be applied to important decisions.
        </p>
      </div>
    </div>
  );
}
