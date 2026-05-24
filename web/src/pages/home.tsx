import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import AppSidebar from "@/components/layout/AppSidebar";
import Footer from "@/components/layout/Footer";

/* ── Hero slideshow ──────────────────────────────────────────── */

type FlowSlide = {
  kind: "flow";
  tag: string;
  nodes: { label: string; sub: string }[];
};
type LogoSlide = { kind: "logo" };
type Slide = LogoSlide | FlowSlide;

const SLIDES: Slide[] = [
  { kind: "logo" },
  {
    kind: "flow",
    tag: "Project setup",
    nodes: [
      { label: "Comment", sub: "@gitbankbot" },
      { label: "AI Bot", sub: "parses" },
      { label: "Workspace", sub: "created" },
      { label: "Budget", sub: "locked" },
    ],
  },
  {
    kind: "flow",
    tag: "Bounty lifecycle",
    nodes: [
      { label: "Assign", sub: "bounty" },
      { label: "Funds", sub: "escrowed" },
      { label: "PR", sub: "merged" },
      { label: "Payout", sub: "auto" },
    ],
  },
  {
    kind: "flow",
    tag: "On-chain settlement",
    nodes: [
      { label: "Gitbank", sub: "detects" },
      { label: "Base L2", sub: "tx queued" },
      { label: "Contract", sub: "executes" },
      { label: "Receipt", sub: "posted" },
    ],
  },
];

const SLIDE_DURATION = 3200;
const NODE_STEP = 680;

/* ── Patterned interactive dot background ────────────────────── */
type HeroPatternFn = (c: number, r: number, cols: number, rows: number) => 0 | 1 | 2 | 3;

const BG_COLS = 58, BG_ROWS = 36, BG_R = 2.2, BG_GAP = 4, BG_PITCH = BG_R * 2 + BG_GAP;
const BG_W = BG_COLS * BG_PITCH, BG_H = BG_ROWS * BG_PITCH;

// Slide 0: concentric rings (brand mark), full fill
const logoPattern: HeroPatternFn = (c, r, cols, rows) => {
  const cx = (cols - 1) / 2, cy = (rows - 1) / 2;
  const d = Math.sqrt((c - cx) ** 2 + (r - cy) ** 2);
  const maxD = Math.sqrt(cx * cx + cy * cy);
  if (d < 1.5) return 3;
  const ring = d % (maxD / 5.5);
  if (ring < 1.0) return 3;
  if (ring < 2.0) return 2;
  return 1;
};

// Slide 1: 4 nodes on a horizontal path, full fill
const setupPattern: HeroPatternFn = (c, r, cols, rows) => {
  const cy = (rows - 1) / 2;
  const nodeXs = [0.14, 0.38, 0.62, 0.86].map(x => x * cols);
  if (Math.abs(r - cy) <= 1.0 && c >= nodeXs[0] && c <= nodeXs[3]) return 2;
  for (const nx of nodeXs) {
    const d = Math.sqrt((c - nx) ** 2 + (r - cy) ** 2);
    if (d < 2.2) return 3;
    if (d < 4.2) return 2;
  }
  return 1;
};

// Slide 2: twin Gaussian blobs with bridge, full fill
const bountyPattern: HeroPatternFn = (c, r, cols, rows) => {
  const cy = (rows - 1) / 2;
  const lx = cols * 0.22, rx = cols * 0.78, sig = cols * 0.115;
  const ld = Math.sqrt((c - lx) ** 2 + (r - cy) ** 2) / sig;
  const rd = Math.sqrt((c - rx) ** 2 + (r - cy) ** 2) / sig;
  const inBridge = Math.abs(r - cy) <= 1.2 && c > cols * 0.33 && c < cols * 0.67;
  if (inBridge) return 2;
  const v = Math.max(Math.exp(-(ld ** 2) / 2), Math.exp(-(rd ** 2) / 2));
  if (v > 0.82) return 3;
  if (v > 0.52) return 2;
  if (v > 0.18) return 1;
  return 1;
};

// Slide 3: three route lines with junction dots, full fill
const settlePattern: HeroPatternFn = (c, r, cols, rows) => {
  const cy = (rows - 1) / 2;
  for (let i = 0; i < 3; i++) {
    const y = cy + (i - 1) * rows * 0.26;
    const wave = Math.sin((c / cols) * Math.PI * 3.5) * rows * 0.07;
    if (Math.abs(r - y - wave) < 1.2) return i === 1 ? 3 : 2;
    if (Math.abs(r - y - wave) < 2.5) return 2;
  }
  for (const jx of [cols * 0.34, cols * 0.66]) {
    const d = Math.sqrt((c - jx) ** 2 + (r - cy) ** 2);
    if (d < 2.5) return 3;
    if (d < 4.2) return 2;
  }
  return 1;
};

const SLIDE_PATTERNS: HeroPatternFn[] = [logoPattern, setupPattern, bountyPattern, settlePattern];

function PatternedDotBg({ patternFn }: { patternFn: HeroPatternFn }) {
  const [hov, setHov] = useState<{ r: number; c: number } | null>(null);

  const getFill = (val: 0 | 1 | 2 | 3, r: number, c: number): string => {
    if (!val) return "none";
    const d = hov ? Math.sqrt((hov.r - r) ** 2 + (hov.c - c) ** 2) : Infinity;
    if (d === 0)   return "hsl(38 92% 62%)";
    if (d <= 1.5)  return "hsl(231 70% 74%)";
    if (d <= 2.8)  return "hsl(231 62% 60%)";
    if (d <= 4.2)  return "hsl(231 54% 53%)";
    if (val === 1) return "hsl(231 35% 60% / 0.17)";
    if (val === 2) return "hsl(231 48% 48% / 0.52)";
    return "hsl(231 48% 52% / 0.88)";
  };

  const circles: React.ReactNode[] = [];
  for (let r = 0; r < BG_ROWS; r++) {
    for (let c = 0; c < BG_COLS; c++) {
      const val = patternFn(c, r, BG_COLS, BG_ROWS);
      if (!val) continue;
      circles.push(
        <circle
          key={`${r}-${c}`}
          cx={c * BG_PITCH + BG_R}
          cy={r * BG_PITCH + BG_R}
          r={BG_R}
          fill={getFill(val, r, c)}
          onMouseEnter={() => setHov({ r, c })}
          style={{ cursor: "crosshair" }}
        />
      );
    }
  }

  return (
    <svg
      viewBox={`0 0 ${BG_W} ${BG_H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, display: "block", userSelect: "none" }}
      onMouseLeave={() => setHov(null)}
    >
      {circles}
    </svg>
  );
}

function FlowNodes({ nodes, slideActive }: { nodes: FlowSlide["nodes"]; slideActive: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!slideActive) { setActive(0); return; }
    const id = setInterval(() => setActive((p) => (p + 1) % nodes.length), NODE_STEP);
    return () => clearInterval(id);
  }, [slideActive, nodes.length]);

  return (
    <div className="flex items-start justify-center w-full">
      {nodes.map((node, i) => (
        <div key={i} className="flex items-start">
          <div className="flex flex-col items-center gap-2.5">
            {/* dot node */}
            <div className="relative flex items-center justify-center" style={{ width: 32, height: 32 }}>
              {active === i && (
                <motion.div
                  className="absolute rounded-full"
                  style={{ width: 32, height: 32, background: "hsl(var(--primary))" }}
                  animate={{ scale: [1, 1.9], opacity: [0.22, 0] }}
                  transition={{ duration: 0.75, repeat: Infinity }}
                />
              )}
              <div
                className="rounded-full border-2 transition-all duration-300"
                style={{
                  width: 14,
                  height: 14,
                  borderColor: active >= i ? "hsl(var(--primary))" : "hsl(var(--border)/0.5)",
                  background: active === i
                    ? "hsl(var(--primary))"
                    : active > i
                    ? "hsl(var(--primary)/0.35)"
                    : "hsl(var(--background)/0.6)",
                }}
              />
            </div>
            {/* label */}
            <div className="flex flex-col items-center" style={{ width: 62 }}>
              <span
                className="text-[11px] font-semibold text-center leading-tight transition-colors duration-300"
                style={{ color: active === i ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))" }}
              >
                {node.label}
              </span>
              <span className="text-[9px] text-center leading-tight" style={{ color: "hsl(var(--muted-foreground)/0.6)" }}>
                {node.sub}
              </span>
            </div>
          </div>
          {/* connector */}
          {i < nodes.length - 1 && (
            <div style={{ width: 28, marginTop: 15, height: 2, position: "relative", flexShrink: 0 }}>
              <div className="absolute inset-0 rounded-full" style={{ background: "hsl(var(--border)/0.4)" }} />
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: "hsl(var(--primary))" }}
                animate={{ width: active > i ? "100%" : "0%" }}
                transition={{ duration: 0.32, ease: "easeOut" }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function HeroSlides() {
  const [idx, setIdx] = useState(0);
  const [activeSlide, setActiveSlide] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide(false);
      setTimeout(() => {
        setIdx((p) => (p + 1) % SLIDES.length);
        setActiveSlide(true);
      }, 300);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[idx];

  return (
    <div
      className="relative w-full overflow-hidden border border-border"
      style={{ maxWidth: 480, minHeight: 360, borderRadius: 16 }}
    >
      {/* Full interactive dot background */}
      <PatternedDotBg patternFn={SLIDE_PATTERNS[idx]} />

      {/* Dark overlay so content is readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, hsl(var(--background)/0.72) 30%, hsl(var(--background)/0.45) 100%)" }}
      />

      {/* Slide content */}
      <div className="relative z-10 flex flex-col items-center justify-center" style={{ minHeight: 360, padding: "56px 48px 72px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-col items-center gap-5 w-full"
          >
            {slide.kind === "logo" ? (
              <div className="flex flex-col items-center gap-4">
                <img src="/logo.png" alt="Gitbank" style={{ width: 72, height: 72, borderRadius: 16, objectFit: "cover" }} />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[22px] font-bold tracking-tight text-foreground">Gitbank</span>
                  <span className="text-[13px] text-muted-foreground text-center leading-snug">
                    Manage projects, track portfolios, and pay teams<br />directly from your repo
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6 w-full">
                <span
                  className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border"
                  style={{
                    color: "hsl(var(--primary))",
                    borderColor: "hsl(var(--primary)/0.3)",
                    background: "hsl(var(--primary)/0.08)",
                  }}
                >
                  {slide.tag}
                </span>
                <FlowNodes nodes={slide.nodes} slideActive={activeSlide} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setIdx(i); setActiveSlide(true); }}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === idx ? 18 : 6,
              height: 6,
              background: i === idx ? "hsl(var(--primary))" : "hsl(var(--border)/0.6)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

const ProjectsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="6" height="8" rx="1.5" />
    <rect x="12" y="2" width="6" height="5" rx="1.5" />
    <rect x="12" y="11" width="6" height="7" rx="1.5" />
    <rect x="2" y="14" width="6" height="4" rx="1.5" />
  </svg>
);

const BountiesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="8" />
    <circle cx="10" cy="10" r="4.5" />
    <circle cx="10" cy="10" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const VaultIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="10" cy="6" rx="7" ry="3" />
    <path d="M3 6v5c0 1.66 3.13 3 7 3s7-1.34 7-3V6" />
    <path d="M3 11v3c0 1.66 3.13 3 7 3s7-1.34 7-3v-3" />
    <circle cx="10" cy="11" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

const RelayerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 2L4 11h6l-1 7 7-9h-6l1-7z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2L3 5v5c0 4.1 3 7.5 7 8.5 4-1 7-4.4 7-8.5V5L10 2z" />
    <path d="M7 10l2 2 4-4" />
  </svg>
);

const RoadmapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 5h7" />
    <path d="M9 5c0 0 2 0 2 2s2 2 2 2h5" />
    <path d="M18 9v6" />
    <path d="M18 15c0 0-2 0-2 2s-2 2-2 2H2" />
    <circle cx="2" cy="5" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="18" cy="9" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="2" cy="19" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const pillars = [
  {
    title: "On-Chain Banking",
    tag: "Vault",
    desc: "Every user gets a personal vault on Base L2. Deposit, hold, transfer, and track your crypto portfolio without ever leaving Gitbank.",
  },
  {
    title: "Bounty Management",
    tag: "Projects",
    desc: "Create projects, assign bounties, and release payments directly from GitHub issues and pull requests. No external dashboards, no manual invoices.",
  },
  {
    title: "DeFi Swap",
    tag: "Trade",
    desc: "Swap tokens inside your vault using on-chain liquidity. One action, settled on Base L2, with gas covered by Gitbank.",
  },
  {
    title: "AI Security",
    tag: "Protection",
    desc: "The only on-chain bank account safe enough to give an AI agent access. No approve function, no transfer surface. Even a fully compromised agent cannot move a single token without explicit on-chain permission.",
  },
];

const steps = [
  {
    title: "Create a project with a budget",
    desc: "Tag @gitbankbot in any GitHub issue and describe the project in any language. The AI bot initializes a workspace and locks the budget allocation in a smart contract escrow on Base.",
  },
  {
    title: "Assign bounties to contributors",
    desc: "Comment on any issue to assign a contributor and set a bounty amount. The funds move from the project escrow into a task-specific escrow bound to that contributor's GitHub Permanent User ID.",
  },
  {
    title: "Merge the pull request",
    desc: "When a maintainer merges the linked pull request, Gitbank detects the event automatically through the GitHub webhook and queues the payout transaction.",
  },
  {
    title: "Payout executes on-chain",
    desc: "The smart contract burns the task escrow and releases the underlying assets to the contributor's wallet. A full receipt is posted back to the GitHub issue thread within seconds.",
  },
];

const protocolSections = [
  { icon: <VaultIcon />, title: "Personal Vault", desc: "Non-custodial GitVault on Base L2. Deposit USDC, ETH, or WBTC and receive soul-bound gitTokens anchored to your GitHub ID.", href: "/vault" },
  { icon: <ProjectsIcon />, title: "Portfolio", desc: "See all gitToken balances valued in USD using Chainlink price feeds. Full transaction history in one view.", href: "/vault" },
  { icon: <RelayerIcon />, title: "gitSwap", desc: "Swap between gitToken pairs inside your vault via Uniswap v3 on Base. Zero gas, settled on-chain.", href: "/gitswap" },
  { icon: <BountiesIcon />, title: "Project Workspaces", desc: "Create on-chain projects with locked budgets. Assign bounties to GitHub issues and auto-release payment when the PR merges.", href: "/gitlock" },
  { icon: <ShieldIcon />, title: "Security", desc: "Soul-bound gitTokens cannot be transferred or drained. Two-step commit/reveal vault transfers. Recovery address protection.", href: "/security" },
  { icon: <RoadmapIcon />, title: "Key Management", desc: "Set a recovery address and rotate your vault signing key on-chain at any time. Your vault, your control.", href: "/security" },
];

type ProtocolStats = { vaultsDeployed: number; commandsProcessed: number; txOnChain: number; reposConnected: number };

function useProtocolStats() {
  const [stats, setStats] = useState<ProtocolStats | null>(null);
  const fetched = useRef(false);
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetch("/api/stats").then(r => r.ok ? r.json() : null).then(d => d && setStats(d)).catch(() => null);
  }, []);
  return stats;
}

export default function Home() {
  const [, navigate] = useLocation();
  const stats = useProtocolStats();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="md:ml-[48px] mt-14 md:mt-0 flex-1 min-h-screen overflow-y-auto">
        <div className="w-full max-w-[1360px] mx-auto">

          {/* ── Above fold: hero + logos — fills full viewport height on desktop ── */}
          <div className="min-h-screen flex flex-col px-4 sm:px-8 md:px-16 pt-12 md:pt-24 lg:pt-32 pb-6 md:pb-10">

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: "easeOut" }}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] mb-5 text-foreground">
                The secure on-chain bank{" "}
                <span className="text-primary">inside your GitHub.</span>
              </h1>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
                AI agents are taking over developer workflows, but most wallet infrastructure was never designed with them in mind. A single compromised approval is all it takes to drain everything. Gitbank vaults have no approve function and no transferable tokens, so there is no attack surface for agents to exploit. Your team runs commands, your bots execute payouts, and your vault stays intact no matter what.
              </p>

              {/* Hero graphic - mobile only, between description and feature list */}
              <div className="lg:hidden flex justify-center mb-6">
                <HeroSlides />
              </div>

              <div className="hidden lg:grid grid-cols-2 gap-2 mb-8 [grid-auto-rows:1fr]">
                {[
                  "Soul-bound: no transfer, no drain",
                  "Constrained vault access",
                  "Unphishable: no approve, no drain",
                  "Gasless: Gitbank covers all gas",
                  "In-vault token swap and portfolio",
                  "Auto-pay bounties on PR merge",
                ].map(label => (
                  <div key={label} className="h-full flex items-center gap-2 bg-muted/40 border border-border/50 rounded-lg px-3 py-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-primary" />
                    <span className="text-[11.5px] text-foreground leading-snug">{label}</span>
                  </div>
                ))}
              </div>

              {/* Stats - mobile only, above CTA */}
              <div className="lg:hidden grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
                {[
                  { value: stats?.vaultsDeployed, label: "Vaults deployed" },
                  { value: stats?.txOnChain, label: "Txs on-chain" },
                  { value: stats?.commandsProcessed, label: "Commands" },
                  { value: stats?.reposConnected, label: "Repos connected" },
                ].map(({ value, label }) => (
                  <div key={label} className="flex flex-col">
                    <span className="text-[18px] font-bold text-foreground tabular-nums leading-none">
                      {value == null ? <span className="inline-block w-6 h-4 rounded bg-muted animate-pulse mt-1" /> : value.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={() => navigate("/ecosystem")} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity" data-testid="btn-ecosystem">
                  Ecosystem
                </button>
                <button onClick={() => navigate("/docs")} className="px-5 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-semibold hover:bg-muted transition-colors" data-testid="btn-read-docs">
                  Read Docs
                </button>
                <a href="https://clanker.world/clanker/0xC21dd0eE043930711C2a3e55F39C7d3144d09B07" target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-lg border border-primary/40 bg-primary/5 text-primary text-sm font-semibold hover:bg-primary/10 transition-colors">
                  $GITBANK
                </a>
              </div>
            </motion.div>

            {/* Hero graphic + stats - desktop only, right column */}
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }} className="hidden lg:flex flex-col items-center gap-5">
              <HeroSlides />
              <div className="grid grid-cols-4 gap-x-6 w-full">
                {[
                  { value: stats?.vaultsDeployed, label: "Vaults deployed" },
                  { value: stats?.txOnChain, label: "Txs on-chain" },
                  { value: stats?.commandsProcessed, label: "Commands" },
                  { value: stats?.reposConnected, label: "Repos connected" },
                ].map(({ value, label }) => (
                  <div key={label} className="flex flex-col items-center text-center">
                    <span className="text-[20px] font-bold text-foreground tabular-nums leading-none">
                      {value == null ? <span className="inline-block w-7 h-4 rounded bg-muted animate-pulse mt-1" /> : value.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-0.5">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* Logos bar */}
          <div className="mt-16 md:mt-20 pt-5 border-t border-border/40">
            <div className="grid grid-cols-2 sm:flex sm:flex-nowrap sm:justify-center items-center gap-4 sm:gap-10">
              <div className="flex justify-center items-center">
                <img src="/logos/npm.png" alt="npm" className="h-7 sm:h-10 w-auto" />
              </div>
              <div className="flex justify-center items-center gap-1.5 sm:gap-2">
                <div className="w-[18px] h-[18px] sm:w-[30px] sm:h-[30px] rounded-[2px] sm:rounded-[4px] flex-shrink-0" style={{ backgroundColor: "#0052FF" }} />
                <span className="text-[30px] sm:text-[48px] font-bold tracking-tight leading-none text-[#1a1a2e] dark:text-white">base</span>
              </div>
              <div className="flex justify-center items-center">
                <img src="/logos/claude.png" alt="Claude" className="h-7 sm:h-10 w-auto dark:[filter:invert(1)_hue-rotate(180deg)]" />
              </div>
              <div className="flex justify-center items-center gap-1.5 sm:gap-2.5">
                <img src="/logos/github.png" alt="GitHub" className="h-5 sm:h-8 w-auto object-contain dark:invert flex-shrink-0" />
                <span className="text-[16px] sm:text-[32px] font-bold text-foreground whitespace-nowrap">GitHub App</span>
              </div>
            </div>
          </div>

          </div>{/* end above-fold */}

          {/* ── Below fold: reordered sections ── */}
          <div className="px-4 sm:px-8 md:px-16 pb-10">

          {/* 1. How it works + Platform sections */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10 mb-14">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Protocol</p>
              <h2 className="text-2xl font-bold tracking-tight mb-2 text-foreground">How it works</h2>
              <p className="text-[14px] text-muted-foreground mb-7 leading-relaxed">
                Gitbank runs on one principle: every team operation, from planning to payment, should happen in the same place where the code lives. Bot-first by design - the same interface your AI agents use is the same one your team uses.
              </p>
              <div className="flex flex-col gap-5">
                {steps.map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }} className="flex gap-4">
                    <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                    <div>
                      <p className="text-[14px] font-semibold text-foreground mb-0.5">{step.title}</p>
                      <p className="text-[13px] text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Explore</p>
              <h2 className="text-2xl font-bold tracking-tight mb-7 text-foreground">Platform sections</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {protocolSections.map((section, i) => (
                  <motion.div key={section.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4 }}
                    className="rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:bg-accent/30 transition-colors cursor-pointer"
                    onClick={() => navigate(section.href)}
                  >
                    <div className="text-primary mb-2">{section.icon}</div>
                    <p className="text-[13px] font-semibold text-foreground mb-1">{section.title}</p>
                    <p className="text-[12px] text-muted-foreground leading-snug">{section.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* 2. Pillars */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-14">
            {pillars.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }} className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
                <span className="inline-block self-start text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-primary/30 text-primary bg-primary/5">{p.tag}</span>
                <p className="text-[17px] font-bold text-foreground leading-snug">{p.title}</p>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </section>

          {/* 3. Terminal demo */}
          <section className="mb-16" id="demo">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/40">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted" />
                  <div className="w-3 h-3 rounded-full bg-muted" />
                  <div className="w-3 h-3 rounded-full bg-muted" />
                </div>
                <span className="text-xs font-mono text-muted-foreground truncate">acme-org / mobile-app / issues / 47</span>
                <div className="w-16" />
              </div>
              <div className="p-6 space-y-5 font-mono text-sm">
                {[
                  {
                    text: "@gitbankbot create project Mobile App v2 with 500 USDC budget",
                    reply: "Project Mobile App v2 initialized. 500.00 gitUSDC locked in project escrow. Budget available for task assignment.",
                  },
                  {
                    text: "@gitbankbot assign this task to @alex_dev with 45 USDC bounty",
                    reply: "Task registered. 45.00 gitUSDC escrowed for @alex_dev (GitHub ID: 789102). Funds release automatically on PR merge.",
                  },
                  {
                    text: "GitHub: PR #110 merged by @maintainer",
                    reply: "Task #47 closed via PR #110. 45.00 USDC released to @alex_dev. Fee: 0.09 USDC (0.2%). Tx: 0x4a1...9ef. Budget remaining: 455.00 gitUSDC.",
                  },
                ].map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="space-y-1.5">
                    <div className="flex items-start gap-3">
                      <span className="text-muted-foreground select-none mt-0.5">{">"}</span>
                      <span className="text-foreground">{msg.text}</span>
                    </div>
                    <div className="ml-6 text-[13px] text-primary pl-3 border-l-2 border-primary/30">{msg.reply}</div>
                  </motion.div>
                ))}
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground select-none">{">"}</span>
                  <span className="w-2 h-4 bg-primary animate-pulse rounded-sm" />
                </div>
              </div>
            </div>
          </section>

          {/* 4. Security */}
          <section id="security" className="mb-14">
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Security</p>
            <h2 className="text-2xl font-bold tracking-tight mb-2 text-foreground">Safe enough for AI agents. Cryptographically un-phishable.</h2>
            <p className="text-[14px] text-muted-foreground mb-7 leading-relaxed max-w-[620px]">Most wallets hand every key to whoever holds the private key - including the AI agents you deploy. Gitbank is built differently: the vault enforces what agents can and cannot do at the contract level, not at the trust level.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "No approve, no drain surface", desc: "GitTokens have no transfer or approve function. An AI agent with full bot access cannot drain the vault - there is simply no function to call. A compromised key is worthless without an exploit path." },
                { title: "Permanent identity anchoring", desc: "Every vault, project, and permission is bound to a GitHub Permanent User ID: an immutable integer that cannot be changed by renaming an account, cannot be claimed by another user, and cannot be spoofed in a webhook payload." },
                { title: "On-chain permission enforcement", desc: "The smart contract verifies manager permissions before any operation executes. Budget allocation, task assignment, and fund reclamation all require the caller to hold a verified manager role - enforced at the EVM level, not application level." },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-xl border border-border bg-card p-5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mb-4">0{i + 1}</div>
                  <p className="text-[14px] font-semibold text-foreground mb-2">{item.title}</p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          </div>{/* end below-fold */}
        </div>{/* end max-width container */}

        <Footer />
      </main>
    </div>
  );
}
