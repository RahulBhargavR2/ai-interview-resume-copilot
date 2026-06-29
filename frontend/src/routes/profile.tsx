import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/lib/auth";
import { Briefcase, FolderGit2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Interview Copilot" }] }),
  component: () => (<AppShell><ProfilePage /></AppShell>),
});

function ProfilePage() {
  const { user, loading } = useAuth();

  const initials = (user?.name || user?.email || "U")
    .split(/\s+/).map((s) => s[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader title="Profile" subtitle="Your account and resume-extracted information." />

      <Card className="glass-strong rounded-2xl p-6">
        <div className="flex items-center gap-5">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-xl font-semibold text-white">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            {loading ? (
              <><Skeleton className="h-6 w-48" /><Skeleton className="mt-2 h-4 w-60" /></>
            ) : (
              <>
                <div className="text-2xl font-bold">{user?.name || "—"}</div>
                <div className="text-sm text-muted-foreground">{user?.email}</div>
                {user?.role && (
                  <Badge variant="outline" className="mt-2 rounded-md border-primary/40 bg-primary/10 text-primary">
                    {user.role}
                  </Badge>
                )}
              </>
            )}
          </div>
        </div>
      </Card>

      <Card className="glass rounded-2xl p-6">
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
          <Sparkles className="h-4 w-4 text-primary" /> Skills
        </h2>
        {loading ? (
          <div className="flex flex-wrap gap-2">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-7 w-20 rounded-lg" />)}</div>
        ) : user?.skills?.length ? (
          <div className="flex flex-wrap gap-2">
            {user.skills.map((s) => (
              <Badge key={s} variant="outline" className="rounded-lg border-primary/30 bg-primary/10 text-primary">{s}</Badge>
            ))}
          </div>
        ) : (
          <Empty label="Upload your resume to extract skills." />
        )}
      </Card>

      <Card className="glass rounded-2xl p-6">
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
          <FolderGit2 className="h-4 w-4 text-accent" /> Projects
        </h2>

        {loading ? (
          <Skeleton className="h-16" />
        ) : user?.projects?.length ? (
          <ul className="space-y-3">
            {user.projects.map((project, i) => (
              <li
                key={i}
                className="rounded-xl border border-border/60 bg-secondary/40 p-4"
              >
                <h3 className="font-medium text-foreground">
                  {project.name}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <Empty label="No projects detected yet." />
        )}
      </Card>

      <Card className="glass rounded-2xl p-6">
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
          <Briefcase className="h-4 w-4 text-emerald-400" /> Experience
        </h2>

        {loading ? (
          <Skeleton className="h-16" />
        ) : user?.experience?.length ? (
          <ul className="space-y-3">
            {user.experience.map((exp, i) => (
              <li
                key={i}
                className="rounded-xl border border-border/60 bg-secondary/40 p-4"
              >
                <h3 className="font-medium text-foreground">
                  {exp.role}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {exp.description}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <Empty label="No experience detected yet." />
        )}
      </Card>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="text-sm text-muted-foreground">{label}</div>;
}
