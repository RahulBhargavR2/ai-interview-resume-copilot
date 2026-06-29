import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles, Mic, FileText, BarChart3, ShieldCheck, Zap, Check, ArrowRight, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Interview & Resume Copilot — Ace your next interview" },
      { name: "description", content: "AI mock interviews, resume-aware questions, and analytics. Practice like a pro and land your dream role." },
      { property: "og:title", content: "AI Interview & Resume Copilot" },
      { property: "og:description", content: "AI mock interviews, resume-aware questions, and analytics." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="text-sm font-semibold">Interview Copilot</div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#testimonials" className="hover:text-foreground">Reviews</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="rounded-xl"><Link to="/login">Sign in</Link></Button>
          <Button asChild className="rounded-xl" style={{ background: "var(--gradient-brand)" }}>
            <Link to="/register">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl" />
      </div>
      <div className="mx-auto max-w-5xl text-center">
        <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 px-3 py-1 text-primary">
          <Sparkles className="mr-1.5 inline h-3 w-3" /> Now in public beta
        </Badge>
        <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          Practice interviews with an <span className="gradient-text">AI that actually listens</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
          Resume-aware mock interviews, instant scoring, and analytics designed to make you genuinely better — not just busier.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-xl" style={{ background: "var(--gradient-brand)" }}>
            <Link to="/register">Start free <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl">
            <Link to="/login">I have an account</Link>
          </Button>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" /> No credit card</div>
          <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" /> Resume-aware</div>
          <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" /> 10+ tracks</div>
        </div>
      </div>
    </section>
  );
}

const features = [
  { icon: Mic, title: "Live mock interviews", desc: "ChatGPT-style sessions with role, difficulty, and a smart interviewer that adapts to your answers." },
  { icon: FileText, title: "Resume-aware questions", desc: "Upload your PDF and get tailored questions based on your skills, projects, and experience." },
  { icon: BarChart3, title: "Deep analytics", desc: "Per-topic radar, score trends, and weak-topic detection so you always know what to practice next." },
  { icon: ShieldCheck, title: "Honest evaluation", desc: "Per-answer scoring with strengths, improvements, and a final report covering communication and problem solving." },
  { icon: Zap, title: "Instant feedback", desc: "Submit an answer, get the score, see what to improve, and move on. No waiting on a recruiter." },
  { icon: Sparkles, title: "Premium UX", desc: "Dark-mode SaaS quality, keyboard-friendly, blazing fast — built for engineers who hate slow tools." },
];

function Features() {
  return (
    <section id="features" className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Everything you need to feel ready</h2>
          <p className="mt-3 text-muted-foreground">A complete interview-prep toolkit, not just a chatbot.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="glass group rounded-2xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-20px_rgba(59,130,246,0.4)]">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  { name: "Priya S.", role: "SDE @ FAANG", quote: "I went from freezing mid-interview to walking in calm. The per-topic analytics genuinely changed how I practice." },
  { name: "Marcus T.", role: "Backend Engineer", quote: "The resume-aware questions felt eerily accurate — like the interviewer had read my LinkedIn before the call." },
  { name: "Ananya K.", role: "ML Engineer", quote: "Best $0 I've spent on interview prep. The feedback is sharper than what I get from human mocks." },
];

function Testimonials() {
  return (
    <section id="testimonials" className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Loved by engineers preparing for the next step</h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="glass rounded-2xl p-6">
              <div className="mb-3 flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-sm text-foreground/90">"{t.quote}"</p>
              <div className="mt-4 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{t.name}</span> · {t.role}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const plans = [
  { name: "Free", price: "$0", desc: "Get a feel for the platform.", features: ["3 mock interviews/mo", "Basic analytics", "Resume upload"], cta: "Start free" },
  { name: "Pro", price: "$19", desc: "For serious interview prep.", features: ["Unlimited interviews", "Full analytics & radar", "Resume-aware questions", "Priority AI model"], cta: "Go Pro", featured: true },
  { name: "Team", price: "$49", desc: "Coach a cohort or class.", features: ["Everything in Pro", "Up to 10 seats", "Admin dashboard", "Shared question packs"], cta: "Contact sales" },
];

function Pricing() {
  return (
    <section id="pricing" className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Simple pricing</h2>
          <p className="mt-3 text-muted-foreground">Start free. Upgrade when you're ready.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <Card
              key={p.name}
              className={`rounded-2xl p-6 ${p.featured ? "gradient-border glass-strong" : "glass"}`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                {p.featured && <Badge className="rounded-md bg-primary/15 text-primary">Popular</Badge>}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <div className="text-4xl font-bold">{p.price}</div>
                <div className="text-sm text-muted-foreground">/mo</div>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="mt-6 w-full rounded-xl"
                style={p.featured ? { background: "var(--gradient-brand)" } : undefined}
                variant={p.featured ? "default" : "outline"}
              >
                <Link to="/register">{p.cta}</Link>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <Card className="glass-strong relative overflow-hidden rounded-3xl p-10 text-center md:p-16">
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-60" style={{ background: "var(--gradient-brand)" }} />
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Your next interview, handled.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-foreground/80">Join thousands prepping smarter with Interview Copilot.</p>
          <Button asChild size="lg" className="mt-6 rounded-xl bg-white text-slate-900 hover:bg-white/90">
            <Link to="/register">Get started free <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
        </Card>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 px-4 py-10 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: "var(--gradient-brand)" }}>
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span>© {new Date().getFullYear()} Interview Copilot</span>
        </div>
        <div className="flex gap-5">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Contact</a>
        </div>
      </div>
    </footer>
  );
}
