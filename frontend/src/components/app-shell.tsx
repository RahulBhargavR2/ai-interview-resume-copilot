import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import {
  Home, Mic, FileText, History as HistoryIcon, BarChart3, User as UserIcon, Settings,
  Search, Bell, Sparkles, LogOut, Menu,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/mock-interview", label: "Mock Interview", icon: Mic },
  { to: "/resume", label: "Resume Analyzer", icon: FileText },
  { to: "/history", label: "Interview History", icon: HistoryIcon },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: UserIcon },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-border/60 bg-sidebar/80 backdrop-blur-xl md:flex">
      <Link to="/dashboard" className="flex h-16 items-center gap-2 px-5">
        <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">Interview Copilot</div>
          <div className="text-[11px] text-muted-foreground">AI-powered prep</div>
        </div>
      </Link>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                active
                  ? "bg-sidebar-accent text-foreground shadow-[inset_0_0_0_1px_var(--color-border)]"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
              }`}
            >
              <Icon className={`h-4 w-4 transition-colors ${active ? "text-primary" : "group-hover:text-foreground"}`} />
              <span>{item.label}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--color-primary)]" />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function MobileBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = navItems.slice(0, 5);
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-border/60 bg-sidebar/90 px-2 py-2 backdrop-blur-xl md:hidden">
      {items.map((item) => {
        const active = pathname === item.to || pathname.startsWith(item.to + "/");
        const Icon = item.icon;
        return (
          <Link key={item.to} to={item.to} className={`flex flex-col items-center gap-1 rounded-lg px-3 py-1 text-[10px] ${active ? "text-primary" : "text-muted-foreground"}`}>
            <Icon className="h-5 w-5" />
            <span>{item.label.split(" ")[0]}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = (user?.name ?? user?.email ?? "U").split(/\s+/).map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-xl border border-border/60 bg-secondary/60 py-1 pl-1 pr-2 transition-colors hover:bg-secondary">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-[11px] font-semibold text-white">{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:block">{user?.name ?? "Account"}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl">
        <DropdownMenuLabel className="text-xs text-muted-foreground">{user?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/settings">Settings</Link></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => { logout(); navigate({ to: "/login" }); }}>
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TopNav() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/60 bg-background/60 px-4 backdrop-blur-xl md:px-6">
      <Link to="/dashboard" className="md:hidden">
        <Menu className="h-5 w-5 text-muted-foreground" />
      </Link>
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search interviews, topics…" className="h-10 rounded-xl border-border/60 bg-secondary/60 pl-9" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
        </Button>
        <UserMenu />
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:pl-[260px]">
        <TopNav />
        <main className="px-4 pb-24 pt-6 md:px-8 md:pb-10">
          {loading || !user ? (
            <div className="grid min-h-[60vh] place-items-center">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Loading…
              </div>
            </div>
          ) : children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
