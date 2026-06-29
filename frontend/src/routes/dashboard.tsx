import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useQuery } from "@tanstack/react-query";
import {
  Mic, FileText, PlayCircle, BarChart3,
  TrendingUp, ListChecks, BookOpen, AlertTriangle,
  ArrowUpRight, Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";
import { DifficultyBadge, ScoreRing, EmptyState } from "@/components/shared";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Interview Copilot" }] }),
  component: () => (<AppShell><Dashboard /></AppShell>),
});

type Overview = {
  total_interviews: number;
  completed_interviews: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  completion_rate: number;
};

type Session = {
  session_id: number;
  role: string;
  difficulty: string;
  status: string;
  overall_score: number;
  created_at: string;
  completed_at: string;
};

function Dashboard() {
  const { user } = useAuth();
  const overview = useQuery<Overview>({ queryKey: ["analytics", "overview"], queryFn: () => api("/analytics/overview") });
  const sessions = useQuery<Session[]>({ queryKey: ["analytics", "sessions"], queryFn: () => api("/analytics/sessions") });
  const weaknesses = useQuery<string[]>({ queryKey: ["analytics", "weakness"], queryFn: () => api("/analytics/weakness") });

  const statCards = [
    { label: "Total Interviews", value: overview.data?.total_interviews ?? 0, icon: TrendingUp, accent: "from-blue-500/20 to-blue-500/0", iconColor: "text-blue-400" },
    { label: "Average Score", value: overview.data ? `${Math.round(overview.data.average_score)}%` : "—", icon: ListChecks, accent: "from-violet-500/20 to-violet-500/0", iconColor: "text-violet-400" },
    { label: "Completed", value: overview.data?.completed_interviews ?? 0, icon: BookOpen, accent: "from-emerald-500/20 to-emerald-500/0", iconColor: "text-emerald-400" },
    { label: "Weakest Topic", value: weaknesses.data?.[0] ?? "—", icon: AlertTriangle, accent: "from-amber-500/20 to-amber-500/0", iconColor: "text-amber-400" },
  ];

  const sorted = (sessions.data ?? []).slice().sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
  const recent = sorted.slice(0, 4);
  const last = recent[0];

  const quickActions = [
    { label: "Start Mock Interview", desc: "AI-tailored questions in seconds", icon: Mic, to: "/mock-interview" as const },
    { label: "Upload Resume", desc: "Get resume-aware questions", icon: FileText, to: "/resume" as const },
    { label: "View History", desc: last ? `Last: ${last.role}` : "No previous session", icon: PlayCircle, to: "/history" as const },
    { label: "View Analytics", desc: "Track progress over time", icon: BarChart3, to: "/analytics" as const },
  ];

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title={<>Welcome back, <span className="gradient-text">{firstName}</span> 👋</>}
        subtitle="Pick up where you left off, or start a new session."
        actions={
          <Button asChild className="rounded-xl" style={{ background: "var(--gradient-brand)" }}>
            <Link to="/mock-interview"><Mic className="mr-2 h-4 w-4" />Start Interview</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="glass group relative overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-0.5">
              <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${s.accent} blur-2xl`} />
              <div className="flex items-center justify-between">
                <div className={`grid h-10 w-10 place-items-center rounded-xl bg-secondary/80 ${s.iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              {overview.isLoading
                ? <Skeleton className="mt-1 h-7 w-24" />
                : <div className="mt-1 text-2xl font-bold">{s.value}</div>}
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Interviews</h2>
            <Link to="/history" className="text-xs text-muted-foreground hover:text-foreground">View all →</Link>
          </div>
          {sessions.isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
            </div>
          ) : recent.length === 0 ? (
            <EmptyState
              icon={<Mic className="h-5 w-5" />}
              title="No interviews yet"
              description="Start your first AI mock interview to see your progress here."
              action={
                <Button asChild className="rounded-xl" style={{ background: "var(--gradient-brand)" }}>
                  <Link to="/mock-interview">Start your first</Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {recent.map((r) => (
                <Link
                  key={r.session_id}
                  to="/history"
                  className="group flex items-center justify-between rounded-xl border border-border/60 bg-secondary/40 p-4 transition-all hover:border-primary/40 hover:bg-secondary/70"
                >
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
                      <Mic className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{r.role}</div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> {formatWhen(r.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {r.difficulty && <DifficultyBadge level={r.difficulty.toLowerCase() as "easy" | "medium" | "hard"} />}
                    {typeof r.overall_score === "number" && <ScoreRing score={r.overall_score} />}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card className="glass rounded-2xl p-6">
          <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.label}
                  to={a.to}
                  className="group flex items-start gap-3 rounded-xl border border-border/60 bg-secondary/40 p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{a.label}</div>
                    <div className="text-xs text-muted-foreground">{a.desc}</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

function formatWhen(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString();
}
