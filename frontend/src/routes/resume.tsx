import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import {
  Upload, Sparkles, Loader2, ArrowRight, FileText, BadgeCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/resume")({
  head: () => ({ meta: [{ title: "Resume Analyzer — Interview Copilot" }] }),
  component: () => (<AppShell><ResumePage /></AppShell>),
});

// type Skill = {
//   skill_name: string;
//   weightage: number;
// };

type Project = {
  title: string;
  description:string;
  tech_stack: string[];
};

type Experience = {
  title: string;
  description: string;
};

type UploadResponse = {
  filename: string;
  analysis: {
    ats_score: number;
    skills: string[];
    projects: Project[];
    experience: Experience[];
    missing_keywords: string[];
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  };
};

function ResumePage() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [result, setResult] = useState<UploadResponse | null>(null);

  const uploadM = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      return api<UploadResponse>("/resume/analyze", { method: "POST", formData: fd });
    },
    onSuccess: (data) => {
      setResult(data);
      toast.success("Resume uploaded and analyzed");
      void refresh();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const onFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (f.size > 10 * 1024 * 1024) return toast.error("File too large (max 10MB)");
    uploadM.mutate(f);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Resume Analyzer"
        subtitle="Upload your resume to unlock resume-aware mock interviews."
      />

      <Card
        className={`glass rounded-2xl p-8 transition-all ${drag ? "border-primary/60 ring-2 ring-primary/30" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); onFiles(e.dataTransfer.files); }}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
            <Upload className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-semibold">Drop your resume here</h3>
          <p className="mt-1 text-sm text-muted-foreground">PDF or DOCX up to 10MB. We'll extract skills, projects, and experience.</p>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
          <Button
            onClick={() => inputRef.current?.click()}
            disabled={uploadM.isPending}
            className="mt-5 rounded-xl"
            style={{ background: "var(--gradient-brand)" }}
          >
            {uploadM.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Browse files"}
          </Button>
        </div>
      </Card>

      {result && (
        <div className="mt-6 space-y-6">
          <Card className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{result.filename}</div>
                <div className="text-xs text-muted-foreground">Resume analyzed successfully</div>
              </div>
              <Badge variant="outline" className="rounded-lg border-emerald-500/30 bg-emerald-500/10 py-1.5 text-emerald-400">
                <BadgeCheck className="mr-1.5 h-3 w-3" /> ATS Score: {result.analysis.ats_score}/100
              </Badge>
            </div>
          </Card>

          <SectionCard title="Skills">
            {result.analysis.skills?.length ? (
              <div className="flex flex-wrap gap-2">
                {result.analysis.skills.map((skill, index) => (
                  <Badge
                    key={`${skill}-${index}`}
                    variant="outline"
                    className="rounded-lg border-primary/30 bg-primary/10 text-primary"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <Empty label="No skills extracted." />
            )}
          </SectionCard>

          <SectionCard title="Projects">
            {result.analysis.projects?.length ? (
              <ul className="space-y-3">
                {result.analysis.projects.map((project, index) => (
                  <li
                    key={`${project.title}-${index}`}
                    className="rounded-xl border border-border/60 bg-secondary/40 p-4"
                  >
                    <h3 className="font-semibold text-foreground">
                      {project.title}
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.tech_stack.map((tech, techIndex) => (
                        <Badge
                          key={`${tech}-${techIndex}`}
                          variant="outline"
                          className="rounded-lg border-primary/30 bg-primary/10 text-primary"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty label="Nothing extracted." />
            )}
          </SectionCard>

          <SectionCard title="Experience">
            {result.analysis.experience?.length ? (
              <ul className="space-y-2">
                {result.analysis.experience.map((e, i) => (
                  <li key={i} className="rounded-xl border border-border/60 bg-secondary/40 p-3 text-sm">
                    <div className="font-semibold">{e.title}</div>
                    <div className="mt-0.5 text-muted-foreground">{e.description}</div>
                  </li>
                ))}
              </ul>
            ) : <Empty label="Nothing extracted." />}
          </SectionCard>

          <SectionCard title="Missing Keywords">
            {result.analysis.missing_keywords?.length ? (
              <div className="flex flex-wrap gap-2">
                {result.analysis.missing_keywords.map((keyword, index) => (
                  <Badge key={`${keyword}-${index}`} variant="outline" className="rounded-lg border-rose-500/30 bg-rose-500/10 text-rose-400">{keyword}</Badge>
                ))}
              </div>
            ) : <Empty label="No missing keywords." />}
          </SectionCard>

          <SectionCard title="Strengths">
            {result.analysis.strengths?.length ? (
              <ul className="space-y-2">
                {result.analysis.strengths.map((strength, index) => (
                  <li key={`${strength}-${index}`} className="rounded-xl border border-border/60 bg-secondary/40 p-3 text-sm">{strength}</li>
                ))}
              </ul>
            ) : <Empty label="No strengths listed." />}
          </SectionCard>

          <SectionCard title="Weaknesses">
            {result.analysis.weaknesses?.length ? (
              <ul className="space-y-2">
                {result.analysis.weaknesses.map((weakness, index) => (
                  <li key={`${weakness}-${index}`} className="rounded-xl border border-border/60 bg-secondary/40 p-3 text-sm">{weakness}</li>
                ))}
              </ul>
            ) : <Empty label="No weaknesses listed." />}
          </SectionCard>

          <SectionCard title="Suggestions">
            {result.analysis.suggestions?.length ? (
              <ul className="space-y-2">
                {result.analysis.suggestions.map((suggestion, index) => (
                  <li key={`${suggestion}-${index}`} className="rounded-xl border border-border/60 bg-secondary/40 p-3 text-sm">{suggestion}</li>
                ))}
              </ul>
            ) : <Empty label="No suggestions available." />}
          </SectionCard>

          <div className="flex justify-end">
            <Button
              onClick={() => navigate({ to: "/mock-interview" })}
              className="rounded-xl"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Sparkles className="mr-2 h-4 w-4" /> Generate Resume-Aware Interview <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="glass rounded-2xl p-6">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </Card>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="text-sm text-muted-foreground">{label}</div>;
}
