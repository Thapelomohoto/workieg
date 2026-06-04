import ReactMarkdown from "react-markdown";
import { Copy, Check, Info } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AIOutput({ content, title = "AI Output" }: { content: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border bg-card shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <Button variant="ghost" size="sm" onClick={copy} className="gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <div className="prose prose-sm max-w-none p-5 prose-headings:font-semibold prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 prose-strong:text-foreground prose-code:text-foreground">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      <div className="flex items-start gap-2 border-t bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>AI-generated content may require human review.</span>
      </div>
    </div>
  );
}

export function AIDisclaimer() {
  return (
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Info className="h-3.5 w-3.5" />
      AI-generated content may require human review.
    </p>
  );
}
