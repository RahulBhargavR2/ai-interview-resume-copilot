import { Badge } from "@/components/ui/badge";

export type Difficulty = "Easy" | "Medium" | "Hard" | "easy" | "medium" | "hard";

export function DifficultyBadge({ level }: { level: Difficulty }) {
  const norm = (level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()) as "Easy" | "Medium" | "Hard";
  const map = {
    Easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Hard: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  } as const;
  return <Badge variant="outline" className={`rounded-lg border ${map[norm] ?? map.Medium}`}>{norm}</Badge>;
}

export function ScoreRing({ score, size = 44 }: { score: number; size?: number }) {
  const safe = Math.max(0, Math.min(100, Math.round(score)));
  const radius = (size - 6) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (safe / 100) * circ;
  const color = safe >= 85 ? "#22c55e" : safe >= 70 ? "#3b82f6" : safe >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth="4" fill="none" className="stroke-secondary" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth="4"
          fill="none"
          stroke={color}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-xs font-semibold">{safe}</div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="glass flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center">
      {icon && <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-secondary/60 text-primary">{icon}</div>}
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
