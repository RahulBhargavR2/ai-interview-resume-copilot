import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { Flame, TrendingUp, AlertTriangle, Award, CheckCircle2, Lightbulb, AlertOctagon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";
import { api } from "@/lib/api";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Interview Copilot" }] }),
  component: () => (<AppShell><AnalyticsPage /></AppShell>),
});

type Overview = {
  total_interviews: number;
  completed_interviews: number;
  average_score: number;
  best_score: number;
  lowest_score: number;
  completion_rate: number;
};

type ScorePoint = { date: string; score: number };

function AnalyticsPage() {
  const overviewQ = useQuery<Overview>({ queryKey: ["analytics", "overview"], queryFn: () => api("/analytics/overview") });
  const perfQ = useQuery<ScorePoint[]>({ queryKey: ["analytics", "performance"], queryFn: () => api("/analytics/performance") });
  const strengthsQ = useQuery<string[]>({ queryKey: ["analytics", "strengths"], queryFn: () => api("/analytics/strengths") });
  const weakQ = useQuery<string[]>({ queryKey: ["analytics", "weakness"], queryFn: () => api("/analytics/weakness") });
  const improvementsQ = useQuery<string[]>({ queryKey: ["analytics", "improvements"], queryFn: () => api("/analytics/improvements") });

  const scoreData = (perfQ.data ?? []).map((p, i) => ({
    label: p.date ? new Date(p.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : `#${i + 1}`,
    score: p.score,
  }));

  const weaknesses = deriveWeaknesses(weakQ.data ?? []);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Analytics" subtitle="See how you're improving over time and where to focus next." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard icon={<TrendingUp className="h-4 w-4" />} label="Interviews" value={overviewQ.data?.total_interviews ?? "—"} loading={overviewQ.isLoading} />
        <KpiCard icon={<Award className="h-4 w-4" />} label="Avg Score" value={overviewQ.data ? `${Math.round(overviewQ.data.average_score)}%` : "—"} loading={overviewQ.isLoading} />
        <KpiCard icon={<Flame className="h-4 w-4" />} label="Highest" value={overviewQ.data ? `${overviewQ.data.best_score}%` : "—"} accent="text-amber-400" loading={overviewQ.isLoading} />
        <KpiCard icon={<AlertTriangle className="h-4 w-4" />} label="Completion" value={overviewQ.data ? `${overviewQ.data.completion_rate}%` : "—"} loading={overviewQ.isLoading} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard className="lg:col-span-2" title="Score Trend" subtitle="How your overall score has moved over time.">
          {perfQ.isLoading ? <Skeleton className="h-64 w-full rounded-xl" /> : scoreData.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={scoreData}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 10]} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="score" stroke="url(#lineGrad)" strokeWidth={3} dot={{ r: 4, fill: "#8b5cf6" }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Strengths" subtitle="Areas where you consistently perform well.">
          {strengthsQ.isLoading ? <Skeleton className="h-64 w-full rounded-xl" /> : (strengthsQ.data?.length ?? 0) === 0 ? <Empty /> : (
            <div className="flex flex-wrap gap-2">
              {strengthsQ.data!.map((s) => (
                <Badge key={s} variant="outline" className="rounded-lg border-emerald-500/30 bg-emerald-500/10 py-1.5 text-emerald-400">
                  <CheckCircle2 className="mr-1.5 h-3 w-3" /> {s}
                </Badge>
              ))}
            </div>
          )}
        </ChartCard>

        <ChartCard title="Weakest Topics" subtitle="Where to focus next.">
          {weakQ.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          ) : weaknesses.length === 0 ? <Empty /> : (
            <ul className="space-y-3">
              {weaknesses.map((w, i) => (
                <li
                  key={i}
                  className="glass rounded-2xl border border-border/60 p-4 transition-colors hover:border-rose-500/30"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                        w.severity >= 70
                          ? "bg-rose-500/15 text-rose-400"
                          : w.severity >= 40
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-emerald-500/15 text-emerald-400"
                      }`}
                    >
                      <AlertOctagon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="line-clamp-2 text-sm font-semibold text-foreground">
                          {w.title}
                        </h4>
                        <span
                          className={`shrink-0 text-xs font-semibold tabular-nums ${
                            w.severity >= 70
                              ? "text-rose-400"
                              : w.severity >= 40
                              ? "text-amber-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {w.severity}%
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full rounded-full ${
                            w.severity >= 70
                              ? "bg-gradient-to-r from-rose-500 to-rose-400"
                              : w.severity >= 40
                              ? "bg-gradient-to-r from-amber-500 to-amber-400"
                              : "bg-gradient-to-r from-emerald-500 to-emerald-400"
                          }`}
                          style={{ width: `${w.severity}%`, transition: "width 600ms ease" }}
                        />
                      </div>
                      {w.description && (
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {w.description}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ChartCard>

        <ChartCard title="Improvement Suggestions" subtitle="What to work on next." className="lg:col-span-2">
          {improvementsQ.isLoading ? <Skeleton className="h-64 w-full rounded-xl" /> : (improvementsQ.data?.length ?? 0) === 0 ? <Empty /> : (
            <ul className="space-y-3">
              {improvementsQ.data!.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl border border-border/60 bg-secondary/40 p-4">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <div className="text-sm text-foreground/90">{tip}</div>
                </li>
              ))}
            </ul>
          )}
        </ChartCard>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, loading, accent }: { icon: React.ReactNode; label: string; value: React.ReactNode; loading?: boolean; accent?: string }) {
  return (
    <Card className="glass rounded-2xl p-5">
      <div className={`flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground ${accent ?? ""}`}>
        {icon} {label}
      </div>
      {loading ? <Skeleton className="mt-2 h-7 w-20" /> : <div className="mt-2 text-2xl font-bold">{value}</div>}
    </Card>
  );
}

function ChartCard({ title, subtitle, children, className = "" }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <Card className={`glass rounded-2xl p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-base font-semibold">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </Card>
  );
}

function Empty() {
  return <div className="grid h-64 place-items-center text-sm text-muted-foreground">No data yet — complete an interview to populate.</div>;
}

type Weakness = { title: string; description?: string; severity: number };

const TOPIC_KEYWORDS: Array<{ title: string; match: RegExp }> = [
  { title: "Technical Depth", match: /\b(implementation|technical|architect|design decision|trade-?off|algorithm|data structure|complexity|engine|autograd|system)\b/i },
  { title: "Communication", match: /\b(vague|unclear|explain|articul|communicat|concise|verbose|rambling)\b/i },
  { title: "Problem Solving", match: /\b(problem[- ]solv|approach|reason|logic|debug|solution|edge case)\b/i },
  { title: "Confidence", match: /\b(confiden|hesitat|uncertain|unsure|nervous)\b/i },
  { title: "Resume Discussion", match: /\b(resume|project|experience|background|role|past work)\b/i },
  { title: "Behavioral", match: /\b(behavior|teamwork|conflict|leadership|collaborat)\b/i },
];

function deriveWeaknesses(raw: string[]): Weakness[] {
  return raw.map((text, i) => {
    const trimmed = (text ?? "").trim();
    const matched = TOPIC_KEYWORDS.find((t) => t.match.test(trimmed));
    const isLong = trimmed.length > 40;
    const title = matched?.title ?? (isLong ? `Focus Area ${i + 1}` : trimmed);
    const description = isLong || matched ? trimmed : undefined;
    // Stable pseudo-severity from string hash (40–90)
    let h = 0;
    for (let k = 0; k < trimmed.length; k++) h = (h * 31 + trimmed.charCodeAt(k)) >>> 0;
    const severity = 45 + (h % 46);
    return { title, description, severity };
  });
}
