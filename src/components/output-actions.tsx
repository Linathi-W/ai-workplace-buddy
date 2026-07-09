import { Copy, Download, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  text: string;
  filename: string;
  onRegenerate?: () => void;
  onClear?: () => void;
  regenerating?: boolean;
};

export function OutputActions({ text, filename, onRegenerate, onClear, regenerating }: Props) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  };

  const download = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={copy} disabled={!text}>
        <Copy className="mr-1.5 h-4 w-4" /> Copy
      </Button>
      <Button variant="outline" size="sm" onClick={download} disabled={!text}>
        <Download className="mr-1.5 h-4 w-4" /> Download
      </Button>
      {onRegenerate && (
        <Button variant="outline" size="sm" onClick={onRegenerate} disabled={regenerating}>
          <RefreshCw className={`mr-1.5 h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
          Regenerate
        </Button>
      )}
      {onClear && (
        <Button variant="ghost" size="sm" onClick={onClear} disabled={!text}>
          <Trash2 className="mr-1.5 h-4 w-4" /> Clear
        </Button>
      )}
    </div>
  );
}
