import { useState } from "react";
import { useLocation } from "wouter";
import { useTheme } from "@/App";
import {
  LayoutDashboard, FolderKanban, Lock, LockOpen, Send,
  ArrowLeftRight, Key, Sun, Moon, Menu, X,
  Github, Copy, Check, GitBranch, Sparkles, TrendingUp,
} from "lucide-react";
import { useGetMe } from "@workspace/api-client-react";

const SIDEBAR_W = 185;

const NAV = [
  {
    section: "WORKSPACE",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/app/dashboard" },
      { label: "Projects", icon: FolderKanban, href: "/app/projects" },
      { label: "Repos", icon: GitBranch, href: "/app/repos" },
    ],
  },
  {
    section: "VAULT",
    items: [
      { label: "Shield", icon: Lock, href: "/app/vault/lock" },
      { label: "Unshield", icon: LockOpen, href: "/app/vault/unlock" },
      { label: "Transfer", icon: Send, href: "/app/vault/transfer" },
    ],
  },
  {
    section: "TRADE",
    items: [
      { label: "Swap", icon: ArrowLeftRight, href: "/app/swap" },
      { label: "Portfolio", icon: TrendingUp, href: "/app/portfolio" },
    ],
  },
  {
    section: "ACCOUNT",
    items: [
      { label: "Keys", icon: Key, href: "/app/keys" },
    ],
  },
];

function NavContent({ onNav }: { onNav?: () => void }) {
  const [location, navigate] = useLocation();
  const { dark, toggle } = useTheme();
  const [copied, setCopied] = useState(false);
  const { data: me } = useGetMe();

  const go = (href: string) => { navigate(href); onNav?.(); };

  const copyId = () => {
    navigator.clipboard.writeText(String(me?.githubId ?? ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-4 py-3.5 cursor-pointer border-b border-border/60"
        onClick={() => go("/")}
      >
        <img src="/logo.png" alt="Gitbank" className="w-6 h-6 rounded-md object-cover flex-shrink-0" />
        <span className="text-[14px] font-bold text-foreground tracking-tight">Gitbank</span>
        <span className="ml-auto text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">APP</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV.map(({ section, items }) => (
          <div key={section}>
            <p className="text-[9px] font-bold tracking-widest text-muted-foreground/50 px-2 mb-1.5">{section}</p>
            {items.map(({ label, icon: Icon, href }) => {
              const active = location === href || location.startsWith(href + "/");
              return (
                <button
                  key={href}
                  onClick={() => go(href)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors mb-0.5 ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* AutoGit CTA */}
      <div className="px-2 pb-2">
        <a
          href="/autogit/"
          className="w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-primary/8 border border-primary/20 hover:bg-primary/14 transition-colors group block"
        >
          <Sparkles size={13} className="text-primary mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-primary leading-tight">Try AutoGit</p>
            <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">Generate and deploy apps with AI</p>
          </div>
        </a>
      </div>

      {/* User + dark toggle */}
      <div className="border-t border-border/60 px-3 py-3 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Github size={13} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-foreground truncate">@{me?.githubLogin ?? "..."}</p>
          <button onClick={copyId} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
            {copied ? <Check size={9} /> : <Copy size={9} />}
            {me?.githubId ? `ID #${me.githubId}` : "..."}
          </button>
        </div>
        <button
          onClick={toggle}
          className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          {dark ? <Sun size={13} /> : <Moon size={13} />}
        </button>
      </div>
    </div>
  );
}

export default function DAppSidebar() {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();

  return (
    <>
      {/* Desktop */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-full bg-sidebar border-r border-border z-40"
        style={{ width: SIDEBAR_W }}
      >
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center gap-3 px-4 h-14 bg-sidebar border-b border-border">
        <button onClick={() => setOpen(true)} className="p-1.5 rounded-md hover:bg-accent/50">
          <Menu size={18} className="text-foreground" />
        </button>
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <img src="/logo.png" alt="Gitbank" className="w-6 h-6 rounded-md object-cover" />
          <span className="text-[14px] font-bold text-foreground">Gitbank</span>
          <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">APP</span>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative z-10 bg-sidebar border-r border-border h-full" style={{ width: SIDEBAR_W }}>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-accent/50"
            >
              <X size={16} className="text-muted-foreground" />
            </button>
            <NavContent onNav={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
