import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Search, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { researchTopic } from "@/lib/ai.functions";
import { PageHeader } from "@/components/PageHeader";
import { AIOutput, AIDisclaimer } from "@/components/AIOutput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AI Workplace" },
      { name: "description", content: "Get structured insights and summaries on any topic." },
    ],
  }),
  component: ResearchPage,
});

const depths = ["Brief", "Standard", "Deep"] as const;

function ResearchPage() {
  const fn = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState<(typeof depths)[number]>("Standard");

  const mutation = useMutation({
    mutationFn: () => fn({ data: { topic, depth } }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        icon={Search}
        title="AI Research Assistant"
        description="Structured insights, trends, and considerations on any topic."
      />

      <div className="space-y-6">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
            <div className="space-y-2">
              <Label htmlFor="topic">Research topic</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Trends in remote-first hiring for engineering teams"
                maxLength={500}
              />
            </div>
            <div className="space-y-2">
              <Label>Depth</Label>
              <Select value={depth} onValueChange={(v) => setDepth(v as typeof depth)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {depths.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <AIDisclaimer />
            <Button onClick={() => mutation.mutate()} disabled={topic.length < 2 || mutation.isPending}>
              {mutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Researching…</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" /> Research</>
              )}
            </Button>
          </div>
        </div>

        {mutation.data && <AIOutput content={mutation.data.content} title="Research Brief" />}
      </div>
    </div>
  );
}
