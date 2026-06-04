import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Search, MessageSquare, Sparkles, ArrowRight } from "lucide-react";
import { AIDisclaimer } from "@/components/AIOutput";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      { name: "description", content: "Your AI-powered workplace productivity dashboard." },
    ],
  }),
  component: Dashboard,
});

const features = [
  {
    title: "Smart Email Generator",
    description: "Draft polished emails by tone and audience in seconds.",
    icon: Mail,
    to: "/email",
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Extract key points, action items, and deadlines.",
    icon: FileText,
    to: "/meetings",
  },
  {
    title: "AI Task Planner",
    description: "Prioritize and schedule your work intelligently.",
    icon: ListChecks,
    to: "/planner",
  },
  {
    title: "AI Research Assistant",
    description: "Get structured insights and summaries on any topic.",
    icon: Search,
    to: "/research",
  },
  {
    title: "AI Chatbot",
    description: "Open-ended conversation for any workplace task.",
    icon: MessageSquare,
    to: "/chat",
  },
] as const;

function Dashboard() {
  return (
    <div>
      <section
        className="mb-10 overflow-hidden rounded-2xl p-8 text-primary-foreground shadow-[var(--shadow-elegant)]"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="flex items-center gap-2 text-sm font-medium opacity-90">
          <Sparkles className="h-4 w-4" /> Powered by AI
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Automate your daily work
        </h1>
        <p className="mt-2 max-w-2xl text-sm opacity-90 md:text-base">
          A focused suite of AI tools for writing, planning, summarizing, and researching — built for
          professionals who want to move faster without sacrificing quality.
        </p>
      </section>

      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Tools
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Link
            key={f.to}
            to={f.to}
            className="group rounded-xl border bg-card p-5 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
          >
            <div
              className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
            <div className="mt-4 flex items-center text-sm font-medium text-primary">
              Open
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <AIDisclaimer />
      </div>
    </div>
  );
}
