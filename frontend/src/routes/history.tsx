import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Mic, ChevronDown, ChevronUp, Calendar, MessageSquare,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";
import { DifficultyBadge, ScoreRing, EmptyState } from "@/components/shared";
import { api } from "@/lib/api";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "Interview History — Interview Copilot" }] }),
  component: () => (<AppShell><HistoryPage /></AppShell>),
});

type Summary = {
  overall_score: number;
  technical_rating: number;
  communication_rating: number;
  problem_solving_rating: number;
  overall_feedback: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  hire_recommendation: string;
};
type Interview = {
  id: number;
  status: string;
  role: string;
  difficulty: string;
  question_count: number;
  summary: Summary | null;
};

type Report = {
  session_id: number;
  status: string;
  report: Summary;
};

function HistoryPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const interviews = useQuery<Interview[]>({
    queryKey: ["interviews"],
    queryFn: () => api("/interview/interviews"),
  });

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Interview History" subtitle="Every session you've completed — expand to see the full report." />

      {interviews.isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      ) : (interviews.data?.length ?? 0) === 0 ? (
        <EmptyState
          icon={<MessageSquare className="h-5 w-5" />}
          title="No history yet"
          description="Once you complete a mock interview, it'll appear here."
          action={
            <Button asChild className="rounded-xl" style={{ background: "var(--gradient-brand)" }}>
              <Link to="/mock-interview">Start one now</Link>
            </Button>
          }
        />
      ) : (
        <ol className="relative space-y-4 border-l border-border/60 pl-6">
          {interviews.data!.map((s) => {
            const open = expanded === s.id;
            return (
              <li key={s.id} className="relative">
                <span className="absolute -left-[27px] top-5 grid h-4 w-4 place-items-center rounded-full border-2 border-primary bg-background shadow-[0_0_12px_var(--color-primary)]" />
                <Card className="glass rounded-2xl p-5 transition-all">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
                      <Mic className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold">{s.role}</div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Session #{s.id}</span>
                        {s.difficulty && <DifficultyBadge level={s.difficulty.toLowerCase() as "easy" | "medium" | "hard"} />}
                        <Badge variant="outline" className="rounded-md text-[10px]">{s.status}</Badge>
                        <span>{s.question_count} questions</span>
                      </div>
                    </div>
                    {s.summary && typeof s.summary.overall_score === "number" && (
                      <ScoreRing score={s.summary.overall_score} size={52} />
                    )}
                    <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setExpanded(open ? null : s.id)}>
                      {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>

                  {open && <SessionDetail sessionId={s.id} initialSummary={s.summary} />}
                </Card>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function SessionDetail({ sessionId, initialSummary }: { sessionId: number; initialSummary: Summary | null }) {
  const reportQ = useQuery<Report>({
    queryKey: ["interview", "report", sessionId],
    queryFn: () => api(`/interview/${sessionId}/report`),
    enabled: !initialSummary,
    retry: false,
  });

  const summary = initialSummary ?? reportQ.data?.report ?? null;

  return (
    <div className="mt-5 border-t border-border/60 pt-5">
      {!summary ? (
        reportQ.isLoading ? (
          <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
        ) : (
          <div className="text-sm text-muted-foreground">No report available for this session.</div>
        )
      ) : (
        <Card className="glass-strong rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Final Summary</h4>
            <ScoreRing score={summary.overall_score} size={48} />
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <RatingPill label="Technical" value={`${summary.technical_rating}/10`} />
            <RatingPill label="Communication" value={`${summary.communication_rating}/10`} />
            <RatingPill label="Problem Solving" value={`${summary.problem_solving_rating}/10`} />
          </div>
          {summary.overall_feedback && <p className="mt-3 text-sm text-foreground/90">{summary.overall_feedback}</p>}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <PillList label="Strengths" tone="emerald" items={summary.strengths ?? []} />
            <PillList label="Weaknesses" tone="amber" items={summary.weaknesses ?? []} />
          </div>
          {summary.recommendations?.length > 0 && (
            <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
              <div className="mb-1 text-xs font-semibold text-primary">Recommendations</div>
              <ul className="space-y-0.5 text-foreground/90">
                {summary.recommendations.map((r, i) => <li key={i}>→ {r}</li>)}
              </ul>
            </div>
          )}
          {summary.hire_recommendation && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Hire recommendation:</span>
              <Badge variant="outline" className="rounded-md border-primary/40 bg-primary/10 text-primary">{summary.hire_recommendation}</Badge>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function RatingPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-secondary/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value || "—"}</div>
    </div>
  );
}

function PillList({ label, tone, items }: { label: string; tone: "emerald" | "amber"; items: string[] }) {
  const cls = tone === "emerald" ? "border-emerald-500/20 bg-emerald-500/5" : "border-amber-500/20 bg-amber-500/5";
  return (
    <div className={`rounded-lg border p-3 ${cls}`}>
      <div className="text-xs font-semibold">{label}</div>
      {items?.length ? (
        <ul className="mt-1.5 space-y-1 text-xs text-foreground/90">{items.map((s, i) => <li key={i}>• {s}</li>)}</ul>
      ) : <div className="mt-1 text-xs text-muted-foreground">None.</div>}
    </div>
  );
}
