import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useState } from "react";
import { Moon, Bell, Sparkles, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Interview Copilot" }] }),
  component: () => (<AppShell><SettingsPage /></AppShell>),
});

function SettingsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [dark, setDark] = useState(true);
  const [notifs, setNotifs] = useState({ email: true, marketing: false, summary: true });
  const [defaults, setDefaults] = useState({ difficulty: "medium", resume_aware: true });

  const save = () => toast.success("Preferences saved");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader title="Settings" subtitle="Personalize your experience." />

      <Card className="glass rounded-2xl p-6">
        <Row icon={<Moon className="h-4 w-4" />} title="Dark mode" desc="Use the dark theme across the app.">
          <Switch checked={dark} onCheckedChange={(v) => { setDark(v); toast.info("Light mode coming soon"); }} />
        </Row>
      </Card>

      <Card className="glass rounded-2xl p-6">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold"><Bell className="h-4 w-4" /> Notifications</h2>
        <div className="space-y-4">
          <Row title="Email updates" desc="Important account updates and security alerts.">
            <Switch checked={notifs.email} onCheckedChange={(v) => setNotifs({ ...notifs, email: v })} />
          </Row>
          <Row title="Weekly summary" desc="A Monday-morning recap of your progress.">
            <Switch checked={notifs.summary} onCheckedChange={(v) => setNotifs({ ...notifs, summary: v })} />
          </Row>
          <Row title="Product updates" desc="New features and occasional tips.">
            <Switch checked={notifs.marketing} onCheckedChange={(v) => setNotifs({ ...notifs, marketing: v })} />
          </Row>
        </div>
      </Card>

      <Card className="glass rounded-2xl p-6">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold"><Sparkles className="h-4 w-4" /> Interview defaults</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="text-xs text-muted-foreground">Default difficulty</Label>
            <Select value={defaults.difficulty} onValueChange={(v) => setDefaults({ ...defaults, difficulty: v })}>
              <SelectTrigger className="mt-1.5 h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Row title="Resume-aware by default" desc="Tailor every interview to your resume.">
              <Switch checked={defaults.resume_aware} onCheckedChange={(v) => setDefaults({ ...defaults, resume_aware: v })} />
            </Row>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={save} className="rounded-xl" style={{ background: "var(--gradient-brand)" }}>Save preferences</Button>
        </div>
      </Card>

      <Card className="glass rounded-2xl p-6">
        <h2 className="mb-4 text-base font-semibold text-destructive">Account</h2>
        <Button variant="outline" className="rounded-xl" onClick={() => { logout(); navigate({ to: "/login" }); }}>
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </Card>
    </div>
  );
}

function Row({ icon, title, desc, children }: { icon?: React.ReactNode; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-secondary/40 p-4">
      <div className="flex items-start gap-3">
        {icon && <div className="mt-0.5 text-primary">{icon}</div>}
        <div>
          <div className="text-sm font-medium">{title}</div>
          {desc && <div className="text-xs text-muted-foreground">{desc}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}
