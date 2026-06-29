import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import {
  Mic, Send, Bot, CheckCircle2, AlertCircle, Clock, ChevronRight,
  StopCircle, Loader2, Sparkles, Trophy,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";
import { DifficultyBadge, ScoreRing } from "@/components/shared";
import { api } from "@/lib/api";
import { toast } from "sonner";

const searchSchema = z.object({ session: z.string().optional() });

export const Route = createFileRoute("/mock-interview")({
  head: () => ({ meta: [{ title: "Mock Interview — Interview Copilot" }] }),
  validateSearch: (search: Record<string, unknown>) => searchSchema.parse(search),
  component: () => (<AppShell><MockInterview /></AppShell>),
});

type StartResponse = { session_id: number; question: string };
type Evaluation = { score: number; feedback: string; strengths: string[]; improvements: string[] };
type ReportSummary = {
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
type FinalReportT = {
  average_score: number;
  overall_score: number;
  questions_answered: number;
  summary: ReportSummary;
};
type AnswerResponse = {
  session_id: number;
  completed: boolean;
  evaluation: Evaluation;
  next_question: string | null;
  report: FinalReportT | null;
};

type TranscriptEntry = { question: string; answer: string; score: number; feedback: string };

const TOTAL_HINT = 5;

function MockInterview() {
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [setup, setSetup] = useState({
    role: "Backend Developer",
    difficulty: "Medium",
    interview_type: "resume" as "resume" | "general",
  });
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [report, setReport] = useState<FinalReportT | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!sessionId || report) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      return;
    }
    timerRef.current = window.setInterval(() => setElapsed((e) => e + 1), 1000) as unknown as number;
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [sessionId, report]);

  const startM = useMutation({
    mutationFn: () =>
      api<StartResponse>("/interview/start", {
        method: "POST",
        body: {
          user_id: 0,
          role: setup.role,
          difficulty: setup.difficulty,
          interview_type: setup.interview_type,
        },
      }),
    onSuccess: (data) => {
      setSessionId(data.session_id);
      setCurrentQuestion(data.question);
      setQuestionNumber(1);
      setEvaluation(null);
      setReport(null);
      setTranscript([]);
      setElapsed(0);
      navigate({ to: "/mock-interview", search: { session: String(data.session_id) }, replace: true });
      toast.success("Interview started — good luck!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const submitM = useMutation({
    mutationFn: (text: string) =>
      api<AnswerResponse>("/interview/answer", {
        method: "POST",
        body: { session_id: sessionId, answer: text },
      }),
    onSuccess: (data) => {
      const isCompleted = data?.completed === true;
      setEvaluation(data.evaluation);
      setTranscript((t) => [
        ...t,
        {
          question: currentQuestion ?? "",
          answer: answer,
          score: data.evaluation?.score ?? 0,
          feedback: data.evaluation?.feedback ?? "",
        },
      ]);
      // Only show the final report when the backend explicitly marks the session complete.
      if (isCompleted) {
        setReport(data.report);
        toast.success("Interview complete!");
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const submit = () => {
    if (!answer.trim()) return toast.error("Write an answer before submitting");
    submitM.mutate(answer.trim());
  };

  const next = () => {
    const data = submitM.data;
    if (!data) return;
    if (data.completed === true) return;
    if (!data.next_question) {
      toast.info("Waiting for the next question…");
      return;
    }
    setCurrentQuestion(data.next_question);
    setQuestionNumber((n) => n + 1);
    setAnswer("");
    setEvaluation(null);
    submitM.reset();
  };

  const endSession = () => {
    setSessionId(null);
    setCurrentQuestion(null);
    setQuestionNumber(0);
    setEvaluation(null);
    setReport(null);
    setAnswer("");
    setTranscript([]);
    setElapsed(0);
    navigate({ to: "/mock-interview", search: {}, replace: true });
  };

  // ============= Setup view =============
  if (!sessionId) {
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader title="Start a Mock Interview" subtitle="Pick a role and difficulty — your AI interviewer will adapt to you." />
        <Card className="glass-strong rounded-2xl p-8">
          <div className="grid gap-5">
            <div>
              <Label htmlFor="role">Target Role</Label>
              <Input id="role" value={setup.role} onChange={(e) => setSetup({ ...setup, role: e.target.value })} placeholder="e.g. Backend Developer" className="mt-1.5 h-11 rounded-xl" />
            </div>
            <div>
              <Label>Difficulty</Label>
              <Select value={setup.difficulty} onValueChange={(v) => setSetup({ ...setup, difficulty: v })}>
                <SelectTrigger className="mt-1.5 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/40 p-4">
              <div>
                <div className="text-sm font-medium">Resume-aware questions</div>
                <div className="text-xs text-muted-foreground">Tailor questions to your uploaded resume.</div>
              </div>
              <Switch
                checked={setup.interview_type === "resume"}
                onCheckedChange={(v) => setSetup({ ...setup, interview_type: v ? "resume" : "general" })}
              />
            </div>
            <Button
              onClick={() => startM.mutate()}
              disabled={startM.isPending || !setup.role.trim()}
              className="h-11 w-full rounded-xl"
              style={{ background: "var(--gradient-brand)" }}
            >
              {startM.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Sparkles className="mr-2 h-4 w-4" /> Begin Interview</>}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const progressPct = Math.min(100, (questionNumber / TOTAL_HINT) * 100);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Mock Interview"
        subtitle="Live AI interviewer — answer naturally, get instant feedback."
      />

      <Card className="glass mb-6 rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Meta label="Role" value={setup.role} />
          <Sep />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Difficulty</span>
            <DifficultyBadge level={setup.difficulty.toLowerCase() as "easy" | "medium" | "hard"} />
          </div>
          <Sep />
          <Meta label="Question" value={`${questionNumber || "—"}`} />
          <div className="ml-auto flex items-center gap-2 rounded-xl border border-border/60 bg-secondary/60 px-3 py-1.5 font-mono">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span className="tabular-nums">{formatTime(elapsed)}</span>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={endSession}>
            <StopCircle className="mr-1.5 h-3.5 w-3.5" /> End
          </Button>
        </div>
        <Progress value={progressPct} className="mt-4 h-1.5 bg-secondary" />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {report && submitM.data?.completed === true ? (
            <FinalReport report={report} onRestart={endSession} />
          ) : (
            <>
              <Card className="glass-strong relative overflow-hidden rounded-2xl p-6">
                <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">AI Interviewer</div>
                    {currentQuestion
                      ? <p className="mt-2 text-lg leading-relaxed text-foreground">{currentQuestion}</p>
                      : <Skeleton className="mt-2 h-12 w-full" />}
                  </div>
                </div>
              </Card>

              <Card className="glass rounded-2xl p-6">
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-medium text-muted-foreground">Your Answer</label>
                  <span className="text-xs text-muted-foreground">{answer.length} chars</span>
                </div>
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here…"
                  className="min-h-48 resize-none rounded-xl border-border/60 bg-secondary/40 text-base leading-relaxed focus-visible:ring-primary/40"
                  disabled={!!evaluation || submitM.isPending}
                />
                <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                  <Button variant="outline" className="rounded-xl" disabled>
                    <Mic className="mr-2 h-4 w-4" /> Record Voice
                  </Button>
                  <Button
                    onClick={submit}
                    disabled={!!evaluation || submitM.isPending || !currentQuestion}
                    className="rounded-xl"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    {submitM.isPending
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <><Send className="mr-2 h-4 w-4" /> Submit Answer</>}
                  </Button>
                </div>
              </Card>

              {evaluation && (
                <Card className="glass-strong rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">Evaluation</div>
                      <div className="mt-1 text-2xl font-bold">Score for this answer</div>
                      {evaluation.feedback && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{evaluation.feedback}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-3xl font-bold gradient-text">{evaluation.score}</div>
                        <div className="text-xs text-muted-foreground">out of 10</div>
                      </div>
                      <ScoreRing score={evaluation.score * 10} size={64} />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FeedbackList title="Strengths" tone="emerald" icon={<CheckCircle2 className="h-4 w-4" />} items={evaluation.strengths ?? []} />
                    <FeedbackList title="Areas for Improvement" tone="amber" icon={<AlertCircle className="h-4 w-4" />} items={evaluation.improvements ?? []} />
                  </div>

                  <div className="mt-6 flex flex-wrap justify-end gap-2">
                    <Button variant="outline" className="rounded-xl" onClick={endSession}>End Interview</Button>
                    {submitM.data && submitM.data.completed !== true && submitM.data.next_question && (
                      <Button onClick={next} className="rounded-xl" style={{ background: "var(--gradient-brand)" }}>
                        Next Question <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              )}
            </>
          )}
        </div>

        <Card className="glass h-fit rounded-2xl p-5 lg:sticky lg:top-20">
          <h3 className="mb-1 text-sm font-semibold">Question Progress</h3>
          <p className="mb-4 text-xs text-muted-foreground">Live timeline of your session</p>
          <Timeline transcript={transcript} currentQuestion={currentQuestion} questionNumber={questionNumber} completed={!!report} hasPendingEval={!!evaluation} />
        </Card>
      </div>
    </div>
  );
}

function Timeline({
  transcript, currentQuestion, questionNumber, completed, hasPendingEval,
}: {
  transcript: TranscriptEntry[];
  currentQuestion: string | null;
  questionNumber: number;
  completed: boolean;
  hasPendingEval: boolean;
}) {
  type Item = { kind: "done" | "current"; n: number; text: string; score?: number };
  const items: Item[] = transcript.map((m, i) => ({ kind: "done", n: i + 1, text: m.question, score: m.score }));
  // If we have an active question that hasn't been answered yet, append it.
  if (!completed && currentQuestion && !hasPendingEval) {
    items.push({ kind: "current", n: questionNumber, text: currentQuestion });
  }
  if (items.length === 0) {
    return <div className="text-xs text-muted-foreground">Your questions will appear here.</div>;
  }
  return (
    <ol className="relative space-y-3 border-l border-border/60 pl-5">
      {items.map((q) => (
        <li key={`${q.kind}-${q.n}`} className="relative">
          <span
            className={`absolute -left-[26px] top-1 grid h-4 w-4 place-items-center rounded-full border ${
              q.kind === "done"
                ? "border-emerald-500 bg-emerald-500/20"
                : "border-primary bg-primary shadow-[0_0_12px_var(--color-primary)]"
            }`}
          >
            {q.kind === "done" && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
          </span>
          <div className={`flex items-center justify-between gap-2 text-xs ${q.kind === "current" ? "text-foreground" : "text-muted-foreground"}`}>
            <span>Question {q.n}</span>
            {q.kind === "current"
              ? <Badge variant="outline" className="rounded-md border-primary/40 bg-primary/10 text-[10px] text-primary">Current</Badge>
              : typeof q.score === "number" && <span className="font-mono text-[10px]">{q.score}/10</span>}
          </div>
          <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{q.text}</div>
        </li>
      ))}
    </ol>
  );
}

function FeedbackList({ title, tone, icon, items }: { title: string; tone: "emerald" | "amber"; icon: React.ReactNode; items: string[] }) {
  const cls = tone === "emerald"
    ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
    : "border-amber-500/20 bg-amber-500/5 text-amber-400";
  return (
    <div className={`rounded-xl border p-4 ${cls.split(" ").slice(0, 2).join(" ")}`}>
      <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${cls.split(" ")[2]}`}>
        {icon} {title}
      </div>
      {items.length === 0
        ? <div className="text-sm text-muted-foreground">No notes.</div>
        : (
          <ul className="space-y-1.5 text-sm text-foreground/90">
            {items.map((s, i) => <li key={i}>{tone === "emerald" ? "✓" : "•"} {s}</li>)}
          </ul>
        )}
    </div>
  );
}

function FinalReport({ report, onRestart }: { report: FinalReportT; onRestart: () => void }) {
  const s = report.summary;
  return (
    <Card className="glass-strong relative overflow-hidden rounded-2xl p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/30 blur-3xl" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Trophy className="h-3.5 w-3.5" /> Final Report
          </div>
          <h2 className="mt-1 text-3xl font-bold">Interview complete</h2>
          <div className="mt-1 text-sm text-muted-foreground">
            {report.questions_answered} questions • avg {report.average_score}/10
          </div>
        </div>
        <ScoreRing score={s.overall_score} size={96} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <RatingCard label="Technical" value={`${s.technical_rating}/10`} />
        <RatingCard label="Communication" value={`${s.communication_rating}/10`} />
        <RatingCard label="Problem Solving" value={`${s.problem_solving_rating}/10`} />
      </div>
      {s.overall_feedback && (
        <div className="mt-6 rounded-xl border border-border/60 bg-secondary/40 p-4 text-sm leading-relaxed text-foreground/90">
          {s.overall_feedback}
        </div>
      )}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <FeedbackList title="Strengths" tone="emerald" icon={<CheckCircle2 className="h-4 w-4" />} items={s.strengths ?? []} />
        <FeedbackList title="Weaknesses" tone="amber" icon={<AlertCircle className="h-4 w-4" />} items={s.weaknesses ?? []} />
      </div>
      {s.recommendations?.length > 0 && (
        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="mb-2 text-sm font-semibold text-primary">Recommendations</div>
          <ul className="space-y-1 text-sm text-foreground/90">
            {s.recommendations.map((r, i) => <li key={i}>→ {r}</li>)}
          </ul>
        </div>
      )}
      {s.hire_recommendation && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Hire recommendation:</span>
          <Badge variant="outline" className="rounded-md border-primary/40 bg-primary/10 text-primary">{s.hire_recommendation}</Badge>
        </div>
      )}
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" className="rounded-xl" onClick={onRestart}>New Interview</Button>
      </div>
    </Card>
  );
}

function RatingCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-secondary/40 p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-base font-semibold">{value || "—"}</div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
function Sep() { return <div className="hidden h-8 w-px bg-border/60 md:block" />; }

function formatTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}
