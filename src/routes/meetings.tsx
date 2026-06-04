import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FileText, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { summarizeMeeting } from "@/lib/ai.functions";
import { PageHeader } from "@/components/PageHeader";
import { AIOutput, AIDisclaimer } from "@/components/AIOutput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace" },
      { name: "description", content: "Summarize meeting notes into key points and action items." },
    ],
  }),
  component: MeetingsPage,
});

const SAMPLE = `Q3 planning sync — Oct 14
Attendees: Priya (PM), Marco (Eng), Dana (Design), Sam (Sales)
- Marco: API migration is 60% done, ETA Oct 30. Needs sign-off on schema change by Friday.
- Dana: New onboarding flow ready for QA next week.
- Sam: 3 enterprise deals waiting on SSO. Asked if we can prioritize.
- Decision: SSO bumped to top of backlog for Q4.
- Open question: Do we hire a second backend engineer or contract out?
- Priya will draft hiring proposal by Oct 21.`;

function MeetingsPage() {
  const fn = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");

  const mutation = useMutation({
    mutationFn: () => fn({ data: { notes } }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Turn raw notes or transcripts into structured summaries with action items and deadlines."
      />

      <div className="space-y-6">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <Label htmlFor="notes">Meeting notes or transcript</Label>
            <button
              type="button"
              onClick={() => setNotes(SAMPLE)}
              className="text-xs font-medium text-primary hover:underline"
            >
              Load sample
            </button>
          </div>
          <Textarea
            id="notes"
            placeholder="Paste your raw notes or transcript here…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={12}
            maxLength={20000}
          />
          <div className="flex items-center justify-between">
            <AIDisclaimer />
            <Button onClick={() => mutation.mutate()} disabled={notes.length < 10 || mutation.isPending}>
              {mutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Summarizing…</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" /> Summarize</>
              )}
            </Button>
          </div>
        </div>

        {mutation.data && <AIOutput content={mutation.data.content} title="Meeting Summary" />}
      </div>
    </div>
  );
}
