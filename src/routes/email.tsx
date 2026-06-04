import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Mail, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { generateEmail } from "@/lib/ai.functions";
import { PageHeader } from "@/components/PageHeader";
import { AIOutput, AIDisclaimer } from "@/components/AIOutput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace" },
      { name: "description", content: "Generate professional emails by tone and audience." },
    ],
  }),
  component: EmailPage,
});

const tones = ["Professional", "Friendly", "Persuasive", "Concise", "Formal", "Casual"] as const;
const audiences = ["Client", "Manager", "Colleague", "Executive", "Vendor", "Team"] as const;

function EmailPage() {
  const fn = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<(typeof tones)[number]>("Professional");
  const [audience, setAudience] = useState<(typeof audiences)[number]>("Client");

  const mutation = useMutation({
    mutationFn: () => fn({ data: { recipient, topic, tone, audience } }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Generate polished emails tailored to tone and audience."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              placeholder="e.g., Sarah Chen, Product Manager"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              maxLength={200}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {tones.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={(v) => setAudience(v as typeof audience)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {audiences.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">What's the email about?</Label>
            <Textarea
              id="topic"
              placeholder="e.g., Follow up on yesterday's pricing discussion and propose next steps."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={6}
              maxLength={2000}
            />
          </div>

          <Button
            onClick={() => mutation.mutate()}
            disabled={!recipient || !topic || mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…</>
            ) : (
              <><Sparkles className="mr-2 h-4 w-4" /> Generate Email</>
            )}
          </Button>
          <AIDisclaimer />
        </div>

        <div>
          {mutation.data ? (
            <AIOutput content={mutation.data.content} title="Generated Email" />
          ) : (
            <div className="flex h-full min-h-[300px] items-center justify-center rounded-xl border border-dashed bg-card/50 p-8 text-center text-sm text-muted-foreground">
              Your generated email will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
