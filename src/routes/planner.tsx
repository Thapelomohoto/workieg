import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ListChecks, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { planTasks } from "@/lib/ai.functions";
import { PageHeader } from "@/components/PageHeader";
import { AIOutput, AIDisclaimer } from "@/components/AIOutput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace" },
      { name: "description", content: "Prioritize and schedule your tasks intelligently." },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const fn = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [timeframe, setTimeframe] = useState("Today");

  const mutation = useMutation({
    mutationFn: () => fn({ data: { tasks, timeframe } }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="Get a prioritized, time-blocked plan for your workload."
      />

      <div className="space-y-6">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="space-y-2">
            <Label htmlFor="timeframe">Timeframe</Label>
            <Input
              id="timeframe"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              placeholder="Today, This week, Next 3 days…"
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tasks">Your tasks</Label>
            <Textarea
              id="tasks"
              placeholder={`- Finish Q4 roadmap doc\n- Review 3 PRs\n- 1:1 with Maya\n- Prep for board update`}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              rows={10}
              maxLength={10000}
            />
          </div>
          <div className="flex items-center justify-between">
            <AIDisclaimer />
            <Button onClick={() => mutation.mutate()} disabled={tasks.length < 5 || mutation.isPending}>
              {mutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Planning…</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" /> Plan My Day</>
              )}
            </Button>
          </div>
        </div>

        {mutation.data && <AIOutput content={mutation.data.content} title="Your Plan" />}
      </div>
    </div>
  );
}
