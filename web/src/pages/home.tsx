import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { useLocation, Link } from "wouter";
import { BaseLogo } from "@/components/BaseLogo";
import AppSidebar from "@/components/layout/AppSidebar";
import Footer from "@/components/layout/Footer";
import { useTheme } from "@/App";
import { 
  Terminal, Shield, Zap, Cpu, Code2, Coins, ArrowRightLeft, 
  Wallet, Layers, Rocket, Fingerprint, Lock, X,
  Bot, GitPullRequest, Github, CheckCircle2, ChevronRight,
  GitBranch, CreditCard
} from "lucide-react";

function useDayNightTheme() {
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour <= 19;
    setIsDay(isDaytime);
    
    const root = document.documentElement;
    if (isDaytime) {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }
  }, []);

  return isDay;
}

/* ── Hero slideshow ──────────────────────────────────────────── */

type FlowSlide = {
  kind: "flow";
  tag: string;
  nodes: { label: string; sub: string }[];
};

type LogoSlide = { kind: "logo" };
type Slide = LogoSlide | FlowSlide;

const NODE_STEP = 680;

/* ── Patterned interactive dot background ────────────────────── */
type HeroPatternFn = (c: number, r: number, cols: number, rows: number) => 0 | 1 | 2 | 3;

const BG_COLS = 87, BG_ROWS = 54, BG_R = 2.2, BG_GAP = 4, BG_PITCH = BG_R * 2 + BG_GAP;
const BG_W = BG_COLS * BG_PITCH, BG_H = BG_ROWS * BG_PITCH;

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

const xPattern: HeroPatternFn = (c, r, cols, rows) => {
  const cy = (rows - 1) / 2;
  const lx = cols * 0.15, rx = cols * 0.85;
  const ld = Math.sqrt((c - lx) ** 2 + (r - cy) ** 2);
  const rd = Math.sqrt((c - rx) ** 2 + (r - cy) ** 2);
  
  if (ld < 3.0) return 3;
  if (rd < 3.0) return 3;
  if (ld < 5.0 || rd < 5.0) return 2;
  
  if (Math.abs(r - cy) <= 0.5 && c > lx && c < rx) {
    const dash = (c % 4) < 2;
    return dash ? 3 : 1;
  }
  
  return 1;
};

const swapPattern: HeroPatternFn = (c, r, cols, rows) => {
  const cy = (rows - 1) / 2;
  const cx1 = cols * 0.4;
  const cx2 = cols * 0.6;
  
  const d1 = Math.sqrt((c - cx1) ** 2 + (r - cy) ** 2);
  const d2 = Math.sqrt((c - cx2) ** 2 + (r - cy) ** 2);
  
  const ring1 = Math.abs(d1 - 6.0);
  const ring2 = Math.abs(d2 - 6.0);
  
  if (ring1 < 1.0 && ring2 < 1.0) return 3;
  if (ring1 < 1.5 || ring2 < 1.5) return 2;
  if (d1 < 5.0 || d2 < 5.0) return 1;
  
  return 1;
};

function PatternedDotBg({ patternFn }: { patternFn: HeroPatternFn }) {
  const [hov, setHov] = useState<{ r: number; c: number } | null>(null);

  const getFill = (val: 0 | 1 | 2 | 3, r: number, c: number): string => {
    if (!val) return "none";
    const d = hov ? Math.sqrt((hov.r - r) ** 2 + (hov.c - c) ** 2) : Infinity;
    if (d === 0)   return "hsl(38 92% 62%)";
    if (d <= 1.5)  return "hsl(142 70% 60%)";
    if (d <= 2.8)  return "hsl(142 62% 45%)";
    if (d <= 4.2)  return "hsl(142 54% 35%)";
    if (val === 1) return "hsl(142 35% 50% / 0.15)";
    if (val === 2) return "hsl(142 48% 40% / 0.4)";
    return "hsl(142 48% 52% / 0.7)";
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
          style={{ cursor: "crosshair", transition: "fill 0.15s ease-out" }}
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
    <div className="flex items-start justify-center w-full relative z-10">
      {nodes.map((node, i) => (
        <div key={i} className="flex items-start">
          <div className="flex flex-col items-center gap-2.5">
            <div className="relative flex items-center justify-center" style={{ width: 32, height: 32 }}>
              {active === i && (
                <motion.div
                  className="absolute rounded-full"
                  style={{ width: 32, height: 32, background: "hsl(142 70% 50%)" }}
                  animate={{ scale: [1, 1.9], opacity: [0.3, 0] }}
                  transition={{ duration: 0.75, repeat: Infinity }}
                />
              )}
              <div
                className="rounded-full border-2 transition-all duration-300"
                style={{
                  width: 14,
                  height: 14,
                  borderColor: active >= i ? "hsl(142 70% 50%)" : "hsl(var(--border)/0.5)",
                  background: active === i
                    ? "hsl(142 70% 50%)"
                    : active > i
                    ? "hsl(142 70% 50%/0.35)"
                    : "hsl(var(--background)/0.8)",
                  boxShadow: active === i ? "0 0 10px hsl(142 70% 50%/0.5)" : "none"
                }}
              />
            </div>
            <div className="flex flex-col items-center" style={{ width: 62 }}>
              <span
                className="text-[11px] font-bold text-center leading-tight transition-colors duration-300 tracking-wide font-mono"
                style={{ color: active === i ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))" }}
              >
                {node.label}
              </span>
              <span className="text-[9px] text-center leading-tight font-mono opacity-80" style={{ color: "hsl(var(--muted-foreground))" }}>
                {node.sub}
              </span>
            </div>
          </div>
          {i < nodes.length - 1 && (
            <div style={{ width: 28, marginTop: 15, height: 2, position: "relative", flexShrink: 0 }}>
              <div className="absolute inset-0 rounded-full" style={{ background: "hsl(var(--border)/0.4)" }} />
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: "hsl(142 70% 50%)", boxShadow: "0 0 5px hsl(142 70% 50%/0.5)" }}
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

const SHOWCASE_TABS = [
  { id: "vault", label: "Vault" },
  { id: "mcp", label: "MCP" },
  { id: "bounty", label: "Bounty" },
  { id: "base", label: "Base" },
  { id: "x402", label: "x402" },
  { id: "swap", label: "Swap" },
];

function ProductShowcase() {
  const [idx, setIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const { toggle } = useTheme();
  const isDay = useDayNightTheme();

  useEffect(() => {
    if (hovered) return;
    const id = setInterval(() => {
      setIdx((p) => (p + 1) % SHOWCASE_TABS.length);
    }, 4500);
    return () => clearInterval(id);
  }, [hovered]);

  const renderVisual = () => {
    switch (idx) {
      case 0:
        return (
          <>
            <PatternedDotBg patternFn={logoPattern} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ background: "radial-gradient(ellipse at center, hsl(var(--background)/0.85) 30%, hsl(var(--background)/0.5) 100%)" }}>
              <FlowNodes slideActive={true} nodes={[{label:"Deposit",sub:"USDC/WETH"},{label:"Hold",sub:"soul-bound"},{label:"Swap",sub:"Uniswap v3"},{label:"Track",sub:"portfolio"}]} />
            </div>
          </>
        );
      case 1:
        return (
          <>
            <PatternedDotBg patternFn={settlePattern} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ background: "radial-gradient(ellipse at center, hsl(var(--background)/0.85) 30%, hsl(var(--background)/0.5) 100%)" }}>
              <FlowNodes slideActive={true} nodes={[{label:"Connect",sub:"one URL"},{label:"Call",sub:"10 tools"},{label:"Execute",sub:"on-chain"},{label:"Receipt",sub:"returned"}]} />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <PatternedDotBg patternFn={bountyPattern} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ background: "radial-gradient(ellipse at center, hsl(var(--background)/0.85) 30%, hsl(var(--background)/0.5) 100%)" }}>
              <FlowNodes slideActive={true} nodes={[{label:"Assign",sub:"bounty"},{label:"Escrow",sub:"locked"},{label:"PR merge",sub:"detected"},{label:"Payout",sub:"auto"}]} />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <PatternedDotBg patternFn={setupPattern} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ background: "radial-gradient(ellipse at center, hsl(var(--background)/0.85) 30%, hsl(var(--background)/0.5) 100%)" }}>
              <FlowNodes slideActive={true} nodes={[{label:"Prepare",sub:"call API"},{label:"Confirm",sub:"on GitHub"},{label:"Execute",sub:"token ready"},{label:"Submit",sub:"via wallet"}]} />
            </div>
          </>
        );
      case 4:
        return (
          <>
            <PatternedDotBg patternFn={xPattern} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ background: "radial-gradient(ellipse at center, hsl(var(--background)/0.85) 30%, hsl(var(--background)/0.5) 100%)" }}>
              <FlowNodes slideActive={true} nodes={[{label:"Agent",sub:"request"},{label:"HTTP 402",sub:"required"},{label:"Sign",sub:"tx"},{label:"Settle",sub:"on-chain"}]} />
            </div>
          </>
        );
      case 5:
        return (
          <>
            <PatternedDotBg patternFn={swapPattern} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ background: "radial-gradient(ellipse at center, hsl(var(--background)/0.85) 30%, hsl(var(--background)/0.5) 100%)" }}>
              <FlowNodes slideActive={true} nodes={[{label:"Input",sub:"USDC"},{label:"Route",sub:"found"},{label:"DEX",sub:"executes"},{label:"Output",sub:"WETH"}]} />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const getDetails = () => {
    switch (idx) {
      case 0:
        return { tag: "GitVault", desc: "Personal on-chain bank on Base L2. Soul-bound tokens anchored to your GitHub ID.", specs: ["No transfer", "No approve", "Base L2", "Gasless"] };
      case 1:
        return { tag: "MCP Clients", desc: "Works in Claude Desktop, Cursor, and Grok. Paste one URL, get 10 tools.", specs: ["Claude Desktop", "Cursor", "Grok", "Zero config"] };
      case 2:
        return { tag: "GitBounty", desc: "Assign bounties in GitHub comments. Auto-payout when PR merges. Zero manual invoicing.", specs: ["Auto payout", "Per-task escrow", "PR trigger", "USDC/WETH"] };
      case 3:
        return { tag: "Base MCP", desc: "EIP-5792 send_calls mode. No relayer. Submit transactions directly from Coinbase Wallet.", specs: ["No relayer", "EIP-5792", "Base Account", "Mainnet"] };
      case 4:
        return { tag: "x402", desc: "Agent-to-agent HTTP payment protocol. No API keys, just cryptographic signatures and on-chain settlement.", specs: ["Agent ready", "HTTP 402", "Cryptographic", "Trustless"] };
      case 5:
        return { tag: "gitSwap", desc: "Swap between tokens inside your vault via Uniswap v3 on Base. Zero gas, settled directly on-chain.", specs: ["Uniswap v3", "Zero gas", "In-vault", "On-chain"] };
      default: return { tag: "", desc: "", specs: [] };
    }
  };

  const details = getDetails();

  return (
    <div className="relative w-full max-w-[560px] font-sans">
      <button 
        onClick={toggle}
        className="absolute -top-4 -right-2 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-background/90 backdrop-blur border border-border text-[10px] font-bold tracking-wider uppercase text-foreground cursor-pointer hover:bg-muted transition-colors shadow-sm"
      >
        {isDay ? (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            <span>Day</span>
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <span>Night</span>
          </>
        )}
      </button>

      <div 
        className="w-full overflow-hidden border border-border flex flex-col bg-card mt-3 shadow-2xl relative"
        style={{ borderRadius: 16 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary/30 rounded-tl-[16px] pointer-events-none z-10" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/30 rounded-tr-[16px] pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-primary/30 rounded-bl-[16px] pointer-events-none z-10" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-primary/30 rounded-br-[16px] pointer-events-none z-10" />

        <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-border bg-muted/30 overflow-x-auto hide-scrollbar">
          {SHOWCASE_TABS.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => { setIdx(i); }}
              className={`px-3 py-1.5 text-[11px] font-bold font-mono tracking-wide rounded-md transition-colors whitespace-nowrap ${i === idx ? "bg-primary/10 text-primary border border-primary/30" : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full overflow-hidden border-b border-border bg-background" style={{ height: 320 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              {renderVisual()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-3 px-6 py-6 min-h-[170px] bg-card relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 pointer-events-none" />
          <div className="flex flex-col gap-2 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border self-start font-mono" style={{ color: "hsl(142 70% 45%)", borderColor: "hsl(142 70% 45%/0.3)", background: "hsl(142 70% 45%/0.08)" }}>
                {details.tag}
              </span>
            </div>
            <p className="text-[14px] text-foreground/80 leading-relaxed mt-1 font-medium">{details.desc}</p>
            {idx === 1 && (
              <div className="flex items-center gap-2.5 mt-2">
                <img src="/logos/claude.png" alt="Claude" className="w-5 h-5 rounded dark:[filter:invert(1)_hue-rotate(180deg)] opacity-80" />
                <img src="/logos/cursor.png" alt="Cursor" className="w-5 h-5 rounded opacity-80" />
                <img src="/logos/grok.png" alt="Grok" className="w-5 h-5 rounded bg-black dark:bg-transparent opacity-80" />
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-auto relative z-10 pt-2">
            {details.specs.map(s => (
              <span key={s} className="px-2 py-1 rounded bg-muted/50 text-foreground/70 text-[10px] font-mono font-medium border border-border">{s}</span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/20">
          <div className="flex items-center gap-2">
            {SHOWCASE_TABS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setIdx(i); }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === idx ? 16 : 6,
                  height: 6,
                  background: i === idx ? "hsl(142 70% 50%)" : "hsl(var(--border))",
                }}
              />
            ))}
          </div>
          <Link href="/docs" className="text-[11px] font-bold font-mono text-primary hover:text-primary/80 flex items-center gap-1 transition-colors uppercase tracking-wider">
            Details <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function useProtocolStats() {
  const [stats, setStats] = useState<{ vaultsDeployed: number; commandsProcessed: number; txOnChain: number } | null>(null);
  const fetched = useRef(false);
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetch("/api/stats")
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {});
  }, []);
  return stats;
}

/* ── Classification section ──────────────────────────────────── */

 interface ModalData {
  title: string;
  tagline: string;
  accent: string;
  icon: ReactNode;
  badge?: string;
  mascot?: ReactNode;
  features: string[];
  steps: { step: string; title: string; desc: string }[];
  example: string;
  docsPath: string;
  path: string;
}

/* ── Hacker Cat mascot (IssueOps Banking) ────────────────────── */
function HackerCat() {
  return (
    <>
      <style>{`
        @keyframes hcPawL {
          0%,100% { transform: translateY(0px); }
          45%,55% { transform: translateY(-7px); }
        }
        @keyframes hcPawR {
          0%,50%  { transform: translateY(-7px); }
          20%,80% { transform: translateY(0px); }
        }
        @keyframes hcBlink {
          0%,90%,100% { transform: scaleY(1); }
          95% { transform: scaleY(0.08); }
        }
        @keyframes hcCursor {
          0%,49% { opacity: 1; }
          50%,100% { opacity: 0; }
        }
        @keyframes hcEyeGlow {
          0%,100% { filter: drop-shadow(0 0 2px #10b981); }
          50%     { filter: drop-shadow(0 0 6px #10b981); }
        }
        @keyframes hcScreenLine {
          0%     { transform: translateY(0px); opacity: 1; }
          90%    { transform: translateY(-14px); opacity: 1; }
          91%    { transform: translateY(-14px); opacity: 0; }
          92%,100% { transform: translateY(0px); opacity: 0.8; }
        }
      `}</style>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ imageRendering: "pixelated", display: "block" }}>

        {/* ── Terminal monitor (top-left) ── */}
        <rect x="0"  y="0"  width="26" height="22" fill="#1e293b"/>
        <rect x="2"  y="2"  width="22" height="18" fill="#0d1117"/>
        <rect x="0"  y="20" width="26" height="3"  fill="#334155"/>
        {/* Screen text lines — scroll up */}
        <g style={{ animation: "hcScreenLine 2.4s linear infinite", clipPath: "inset(0 0 0 0)" }}>
          <rect x="4"  y="5"  width="16" height="2" fill="#10b981" opacity="0.9"/>
          <rect x="4"  y="9"  width="11" height="2" fill="#10b981" opacity="0.65"/>
          <rect x="4"  y="13" width="14" height="2" fill="#10b981" opacity="0.45"/>
          <rect x="4"  y="17" width="9"  height="2" fill="#10b981" opacity="0.3"/>
        </g>
        {/* Cursor blink */}
        <rect x="16" y="17" width="3" height="2" fill="#10b981" style={{ animation: "hcCursor 0.9s step-end infinite" }}/>

        {/* ── Left ear ── */}
        <rect x="26" y="1"  width="8" height="11" fill="#6b7280"/>
        <rect x="28" y="3"  width="4" height="7"  fill="#f9a8d4"/>
        {/* ── Right ear ── */}
        <rect x="46" y="1"  width="8" height="11" fill="#6b7280"/>
        <rect x="48" y="3"  width="4" height="7"  fill="#f9a8d4"/>

        {/* ── Head ── */}
        <rect x="22" y="8"  width="36" height="26" fill="#6b7280"/>
        <rect x="24" y="9"  width="32" height="3"  fill="#9ca3af" opacity="0.25"/>

        {/* ── Left eye (blink + glow) ── */}
        <g style={{ animation: "hcBlink 3.2s ease-in-out infinite", transformBox: "fill-box", transformOrigin: "50% 50%" }}>
          <rect x="26" y="15" width="11" height="9" fill="#10b981" style={{ animation: "hcEyeGlow 2s ease-in-out infinite" }}/>
          <rect x="29" y="17" width="5"  height="5" fill="#052e16"/>
          <rect x="27" y="15" width="3"  height="3" fill="white" opacity="0.7"/>
        </g>

        {/* ── Right eye (blink offset) ── */}
        <g style={{ animation: "hcBlink 3.2s ease-in-out infinite 0.14s", transformBox: "fill-box", transformOrigin: "50% 50%" }}>
          <rect x="43" y="15" width="11" height="9" fill="#10b981" style={{ animation: "hcEyeGlow 2s ease-in-out infinite 0.3s" }}/>
          <rect x="46" y="17" width="5"  height="5" fill="#052e16"/>
          <rect x="44" y="15" width="3"  height="3" fill="white" opacity="0.7"/>
        </g>

        {/* ── Nose ── */}
        <rect x="37" y="26" width="6"  height="4"  fill="#f9a8d4"/>
        {/* ── Mouth ── */}
        <rect x="33" y="31" width="5"  height="2"  fill="#4b5563"/>
        <rect x="42" y="31" width="5"  height="2"  fill="#4b5563"/>

        {/* ── Whiskers ── */}
        <rect x="0"  y="23" width="20" height="2" fill="#9ca3af" opacity="0.55"/>
        <rect x="0"  y="27" width="16" height="2" fill="#9ca3af" opacity="0.35"/>
        <rect x="60" y="23" width="20" height="2" fill="#9ca3af" opacity="0.55"/>
        <rect x="64" y="27" width="16" height="2" fill="#9ca3af" opacity="0.35"/>

        {/* ── Body (dark hoodie) ── */}
        <rect x="18" y="34" width="44" height="24" fill="#6b7280"/>
        <rect x="22" y="36" width="36" height="20" fill="#1e293b"/>

        {/* ── "> _" code symbol on chest ── */}
        <rect x="27" y="40" width="4" height="2" fill="#10b981" opacity="0.95"/>
        <rect x="25" y="42" width="2" height="2" fill="#10b981" opacity="0.95"/>
        <rect x="27" y="44" width="4" height="2" fill="#10b981" opacity="0.95"/>
        <rect x="33" y="44" width="7" height="2" fill="#10b981" opacity="0.95"/>

        {/* ── Left arm ── */}
        <rect x="6"  y="36" width="12" height="18" fill="#6b7280"/>
        {/* ── Right arm ── */}
        <rect x="62" y="36" width="12" height="18" fill="#6b7280"/>

        {/* ── Left paw group (typing: up phase) ── */}
        <g style={{ animation: "hcPawL 0.45s cubic-bezier(.4,0,.6,1) infinite", transformOrigin: "14px 58px" }}>
          <rect x="4"  y="54" width="20" height="8"  fill="#9ca3af"/>
          <rect x="4"  y="54" width="4"  height="5"  fill="#d1d5db"/>
          <rect x="9"  y="54" width="4"  height="5"  fill="#d1d5db"/>
          <rect x="14" y="54" width="4"  height="5"  fill="#d1d5db"/>
          <rect x="19" y="54" width="4"  height="5"  fill="#d1d5db"/>
        </g>

        {/* ── Right paw group (typing: down phase) ── */}
        <g style={{ animation: "hcPawR 0.45s cubic-bezier(.4,0,.6,1) infinite", transformOrigin: "66px 58px" }}>
          <rect x="56" y="54" width="20" height="8"  fill="#9ca3af"/>
          <rect x="56" y="54" width="4"  height="5"  fill="#d1d5db"/>
          <rect x="61" y="54" width="4"  height="5"  fill="#d1d5db"/>
          <rect x="66" y="54" width="4"  height="5"  fill="#d1d5db"/>
          <rect x="71" y="54" width="4"  height="5"  fill="#d1d5db"/>
        </g>

        {/* ── Keyboard ── */}
        <rect x="0"  y="64" width="80" height="16" fill="#1e293b"/>
        <rect x="0"  y="64" width="80" height="3"  fill="#334155"/>
        {/* Key row */}
        {([4,11,18,25,32,39,46,53,60,67,74] as number[]).map((kx, i) => (
          <rect key={i} x={kx} y={69} width="5" height="5" fill="#475569"/>
        ))}
        {/* Spacebar */}
        <rect x="18" y="69" width="44" height="5" fill="#475569" opacity="0.55"/>
      </svg>
    </>
  );
}

function IssueOpsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ imageRendering: "pixelated" }}>
      <rect x="2" y="2" width="18" height="4" fill="currentColor" opacity="0.9" />
      <rect x="2" y="8" width="14" height="3" fill="currentColor" opacity="0.7" />
      <rect x="2" y="13" width="10" height="3" fill="currentColor" opacity="0.5" />
      <rect x="16" y="13" width="4" height="4" fill="currentColor" />
      <rect x="14" y="15" width="8" height="2" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
function DefiIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ imageRendering: "pixelated" }}>
      <rect x="9" y="2" width="4" height="4" fill="currentColor" />
      <rect x="5" y="6" width="12" height="2" fill="currentColor" opacity="0.7" />
      <rect x="2" y="8" width="4" height="8" fill="currentColor" opacity="0.6" />
      <rect x="9" y="8" width="4" height="8" fill="currentColor" />
      <rect x="16" y="8" width="4" height="8" fill="currentColor" opacity="0.6" />
      <rect x="2" y="16" width="18" height="2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
function RwaIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ imageRendering: "pixelated" }}>
      <rect x="1" y="7" width="6" height="8" fill="currentColor" opacity="0.6" />
      <rect x="8" y="4" width="6" height="11" fill="currentColor" />
      <rect x="15" y="9" width="6" height="6" fill="currentColor" opacity="0.6" />
      <rect x="1" y="15" width="20" height="2" fill="currentColor" opacity="0.8" />
      <rect x="9" y="2" width="4" height="2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
function AiIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ imageRendering: "pixelated" }}>
      <rect x="7" y="2" width="8" height="6" fill="currentColor" opacity="0.8" />
      <rect x="5" y="4" width="2" height="2" fill="currentColor" />
      <rect x="15" y="4" width="2" height="2" fill="currentColor" />
      <rect x="3" y="8" width="16" height="8" fill="currentColor" opacity="0.7" />
      <rect x="7" y="10" width="2" height="2" fill="currentColor" />
      <rect x="13" y="10" width="2" height="2" fill="currentColor" />
      <rect x="9" y="16" width="4" height="4" fill="currentColor" opacity="0.6" />
      <rect x="6" y="18" width="3" height="2" fill="currentColor" opacity="0.5" />
      <rect x="13" y="18" width="3" height="2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
function SecurityIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ imageRendering: "pixelated" }}>
      <rect x="7" y="2" width="8" height="2" fill="currentColor" />
      <rect x="5" y="4" width="12" height="2" fill="currentColor" opacity="0.8" />
      <rect x="3" y="6" width="2" height="12" fill="currentColor" opacity="0.7" />
      <rect x="17" y="6" width="2" height="12" fill="currentColor" opacity="0.7" />
      <rect x="5" y="6" width="12" height="4" fill="currentColor" opacity="0.5" />
      <rect x="9" y="10" width="4" height="4" fill="currentColor" />
      <rect x="5" y="14" width="12" height="4" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
function PrivacyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ imageRendering: "pixelated" }}>
      <rect x="4" y="4" width="2" height="14" fill="currentColor" opacity="0.3" />
      <rect x="8" y="2" width="2" height="18" fill="currentColor" opacity="0.5" />
      <rect x="12" y="6" width="2" height="10" fill="currentColor" opacity="0.7" />
      <rect x="16" y="4" width="2" height="14" fill="currentColor" opacity="0.4" />
      <rect x="6" y="9" width="10" height="4" fill="currentColor" opacity="0.15" />
    </svg>
  );
}

/* ── Banker Cat (DeFi - blue) ─────────────────────────────────────── */
function BankerCat() {
  return (
    <>
      <style>{`
        @keyframes bcCoin  { 0%,100%{transform:translateY(0)}  45%{transform:translateY(-16px)} }
        @keyframes bcArm   { 0%,100%{transform:translateY(0)}  45%{transform:translateY(-14px)} }
        @keyframes bcBlink { 0%,88%,100%{transform:scaleY(1)}  93%{transform:scaleY(0.1)} }
      `}</style>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{imageRendering:"pixelated",display:"block"}}>
        <rect x="22" y="2"  width="8"  height="10" fill="#9ca3af"/>
        <rect x="24" y="4"  width="4"  height="6"  fill="#f9a8d4"/>
        <rect x="50" y="2"  width="8"  height="10" fill="#9ca3af"/>
        <rect x="52" y="4"  width="4"  height="6"  fill="#f9a8d4"/>
        <rect x="18" y="10" width="44" height="26" fill="#9ca3af"/>
        <g style={{animation:"bcBlink 3.5s ease-in-out infinite",transformBox:"fill-box",transformOrigin:"50% 50%"}}>
          <rect x="24" y="16" width="10" height="8" fill="#3b82f6"/>
          <rect x="27" y="18" width="4"  height="4" fill="#1e3a5f"/>
          <rect x="24" y="16" width="3"  height="3" fill="white" opacity="0.7"/>
        </g>
        <g style={{animation:"bcBlink 3.5s ease-in-out infinite 0.1s",transformBox:"fill-box",transformOrigin:"50% 50%"}}>
          <rect x="46" y="16" width="10" height="8" fill="#3b82f6"/>
          <rect x="49" y="18" width="4"  height="4" fill="#1e3a5f"/>
          <rect x="46" y="16" width="3"  height="3" fill="white" opacity="0.7"/>
        </g>
        <rect x="38" y="26" width="4"  height="3"  fill="#f9a8d4"/>
        <rect x="2"  y="26" width="14" height="2"  fill="#d1d5db" opacity="0.5"/>
        <rect x="64" y="26" width="14" height="2"  fill="#d1d5db" opacity="0.5"/>
        <rect x="14" y="36" width="52" height="32" fill="#1e3a5f"/>
        <rect x="32" y="38" width="16" height="28" fill="#e5e7eb"/>
        <rect x="37" y="40" width="6"  height="24" fill="#3b82f6"/>
        <rect x="35" y="62" width="10" height="4"  fill="#3b82f6"/>
        <rect x="4"  y="38" width="12" height="20" fill="#9ca3af"/>
        <rect x="2"  y="56" width="14" height="6"  fill="#9ca3af"/>
        <g style={{animation:"bcArm 1.8s ease-in-out infinite"}}>
          <rect x="64" y="36" width="12" height="20" fill="#9ca3af"/>
          <rect x="64" y="54" width="14" height="6"  fill="#9ca3af"/>
          <g style={{animation:"bcCoin 1.8s ease-in-out infinite"}}>
            <rect x="65" y="42" width="12" height="12" rx="6" fill="#fbbf24"/>
            <rect x="67" y="44" width="8"  height="8"  rx="4" fill="#f59e0b"/>
            <rect x="70" y="46" width="2"  height="4"  fill="#fde68a"/>
          </g>
        </g>
        <rect x="22" y="68" width="14" height="12" fill="#1e3a5f"/>
        <rect x="44" y="68" width="14" height="12" fill="#1e3a5f"/>
        <rect x="18" y="74" width="18" height="6"  fill="#1f2937"/>
        <rect x="44" y="74" width="18" height="6"  fill="#1f2937"/>
      </svg>
    </>
  );
}

/* ── Stock Cat (RWA - amber) ──────────────────────────────────────────── */
function StockCat() {
  return (
    <>
      <style>{`
        @keyframes scTail  { 0%,100%{transform:rotate(-8deg)} 50%{transform:rotate(12deg)} }
        @keyframes scBar1  { 0%,5%{opacity:0}  20%,80%{opacity:1} 95%,100%{opacity:0} }
        @keyframes scBar2  { 0%,20%{opacity:0} 35%,80%{opacity:1} 95%,100%{opacity:0} }
        @keyframes scBar3  { 0%,35%{opacity:0} 50%,80%{opacity:1} 95%,100%{opacity:0} }
        @keyframes scBar4  { 0%,50%{opacity:0} 65%,80%{opacity:1} 95%,100%{opacity:0} }
        @keyframes scBlink { 0%,88%,100%{transform:scaleY(1)} 93%{transform:scaleY(0.1)} }
      `}</style>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{imageRendering:"pixelated",display:"block"}}>
        <g style={{animation:"scTail 1.4s ease-in-out infinite",transformOrigin:"6px 62px"}}>
          <rect x="2"  y="52" width="8"  height="26" fill="#9ca3af"/>
        </g>
        <rect x="24" y="2"  width="8"  height="10" fill="#9ca3af"/>
        <rect x="26" y="4"  width="4"  height="6"  fill="#f9a8d4"/>
        <rect x="48" y="2"  width="8"  height="10" fill="#9ca3af"/>
        <rect x="50" y="4"  width="4"  height="6"  fill="#f9a8d4"/>
        <rect x="20" y="10" width="40" height="24" fill="#9ca3af"/>
        <g style={{animation:"scBlink 3.2s ease-in-out infinite",transformBox:"fill-box",transformOrigin:"50% 50%"}}>
          <rect x="26" y="15" width="9"  height="7"  fill="#f59e0b"/>
          <rect x="28" y="17" width="4"  height="3"  fill="#78350f"/>
          <rect x="26" y="15" width="3"  height="3"  fill="white" opacity="0.6"/>
        </g>
        <g style={{animation:"scBlink 3.2s ease-in-out infinite 0.12s",transformBox:"fill-box",transformOrigin:"50% 50%"}}>
          <rect x="45" y="15" width="9"  height="7"  fill="#f59e0b"/>
          <rect x="47" y="17" width="4"  height="3"  fill="#78350f"/>
          <rect x="45" y="15" width="3"  height="3"  fill="white" opacity="0.6"/>
        </g>
        <rect x="38" y="24" width="4"  height="3"  fill="#f9a8d4"/>
        <rect x="8"  y="23" width="10" height="2"  fill="#d1d5db" opacity="0.5"/>
        <rect x="62" y="23" width="10" height="2"  fill="#d1d5db" opacity="0.5"/>
        <rect x="16" y="34" width="48" height="30" fill="#78350f"/>
        <rect x="30" y="36" width="20" height="26" fill="#e5e7eb"/>
        <rect x="18" y="37" width="6"  height="5"  fill="#fde68a"/>
        <rect x="4"  y="36" width="14" height="18" fill="#9ca3af"/>
        <rect x="2"  y="52" width="16" height="6"  fill="#9ca3af"/>
        <rect x="62" y="34" width="14" height="20" fill="#9ca3af"/>
        <rect x="50" y="4"  width="24" height="32" fill="#1e293b"/>
        <rect x="52" y="6"  width="20" height="28" fill="#0f172a"/>
        <rect x="52" y="12" width="20" height="1"  fill="#334155" opacity="0.6"/>
        <rect x="52" y="18" width="20" height="1"  fill="#334155" opacity="0.5"/>
        <rect x="52" y="24" width="20" height="1"  fill="#334155" opacity="0.4"/>
        <rect x="53" y="22" width="4"  height="10" fill="#f59e0b" opacity="0" style={{animation:"scBar1 3s ease-in-out infinite"}}/>
        <rect x="58" y="18" width="4"  height="14" fill="#f59e0b" opacity="0" style={{animation:"scBar2 3s ease-in-out infinite"}}/>
        <rect x="63" y="14" width="4"  height="18" fill="#fbbf24" opacity="0" style={{animation:"scBar3 3s ease-in-out infinite"}}/>
        <rect x="68" y="9"  width="4"  height="23" fill="#fde68a" opacity="0" style={{animation:"scBar4 3s ease-in-out infinite"}}/>
        <rect x="61" y="36" width="4"  height="32" fill="#374151"/>
        <rect x="24" y="64" width="12" height="14" fill="#78350f"/>
        <rect x="44" y="64" width="12" height="14" fill="#78350f"/>
        <rect x="20" y="72" width="16" height="6"  fill="#1f2937"/>
        <rect x="44" y="72" width="16" height="6"  fill="#1f2937"/>
      </svg>
    </>
  );
}

/* ── Robot Cat (AI Agent - violet) ───────────────────────────────────── */
function RobotCat() {
  return (
    <>
      <style>{`
        @keyframes rcAnt     { 0%,100%{transform:rotate(-14deg)} 50%{transform:rotate(14deg)} }
        @keyframes rcLED     { 0%,75%,100%{opacity:1} 80%{opacity:0.1} 85%{opacity:1} 90%{opacity:0.2} 95%{opacity:1} }
        @keyframes rcScan    { 0%{transform:translateY(0);opacity:0.9} 100%{transform:translateY(8px);opacity:0} }
        @keyframes rcBlink   { 0%,88%,100%{transform:scaleY(1)} 93%{transform:scaleY(0.1)} }
        @keyframes rcCircuit { 0%,100%{opacity:0.4} 50%{opacity:0.85} }
      `}</style>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{imageRendering:"pixelated",display:"block"}}>
        <g style={{animation:"rcAnt 0.9s ease-in-out infinite",transformOrigin:"40px 8px"}}>
          <rect x="38" y="0"  width="4"  height="10" fill="#94a3b8"/>
          <rect x="36" y="0"  width="8"  height="3"  fill="#8b5cf6"/>
        </g>
        <rect x="20" y="10" width="8"  height="10" fill="#6b7280"/>
        <rect x="22" y="12" width="4"  height="6"  fill="#f9a8d4"/>
        <rect x="52" y="10" width="8"  height="10" fill="#94a3b8"/>
        <rect x="53" y="11" width="6"  height="6"  fill="#475569"/>
        <rect x="55" y="12" width="2"  height="3"  fill="#8b5cf6" style={{animation:"rcLED 2.2s ease-in-out infinite"}}/>
        <rect x="18" y="18" width="22" height="22" fill="#6b7280"/>
        <rect x="40" y="18" width="22" height="22" fill="#94a3b8"/>
        <rect x="39" y="18" width="2"  height="22" fill="#475569"/>
        <g style={{animation:"rcBlink 4s ease-in-out infinite",transformBox:"fill-box",transformOrigin:"50% 50%"}}>
          <rect x="22" y="22" width="12" height="8" fill="#10b981"/>
          <rect x="25" y="24" width="5"  height="4" fill="#052e16"/>
          <rect x="22" y="22" width="3"  height="3" fill="white" opacity="0.7"/>
        </g>
        <rect x="46" y="22" width="12" height="8" fill="#1e1b4b"/>
        <rect x="47" y="23" width="10" height="6" fill="#8b5cf6" style={{animation:"rcLED 1.8s steps(1) infinite"}}/>
        <rect x="47" y="25" width="10" height="2" fill="#c4b5fd" opacity="0.8" style={{animation:"rcScan 1.1s linear infinite"}}/>
        <rect x="30" y="31" width="4"  height="3"  fill="#f9a8d4"/>
        <rect x="22" y="35" width="8"  height="2"  fill="#4b5563"/>
        <rect x="40" y="34" width="16" height="4"  fill="#475569"/>
        <rect x="42" y="35" width="3"  height="2"  fill="#8b5cf6" opacity="0.6"/>
        <rect x="47" y="35" width="3"  height="2"  fill="#8b5cf6" opacity="0.6"/>
        <rect x="52" y="35" width="2"  height="2"  fill="#8b5cf6" opacity="0.6"/>
        <rect x="0"  y="29" width="18" height="2"  fill="#9ca3af" opacity="0.4"/>
        <rect x="14" y="40" width="22" height="28" fill="#6b7280"/>
        <rect x="36" y="40" width="30" height="28" fill="#94a3b8"/>
        <rect x="35" y="40" width="2"  height="28" fill="#475569"/>
        <rect x="40" y="44" width="10" height="2"  fill="#8b5cf6" style={{animation:"rcCircuit 2s ease-in-out infinite"}}/>
        <rect x="50" y="44" width="2"  height="8"  fill="#8b5cf6" style={{animation:"rcCircuit 2s ease-in-out infinite 0.4s"}}/>
        <rect x="40" y="52" width="8"  height="2"  fill="#8b5cf6" style={{animation:"rcCircuit 2s ease-in-out infinite 0.8s"}}/>
        <rect x="60" y="46" width="2"  height="8"  fill="#8b5cf6" style={{animation:"rcCircuit 2s ease-in-out infinite 0.2s"}}/>
        <rect x="4"  y="42" width="12" height="18" fill="#6b7280"/>
        <rect x="2"  y="58" width="14" height="6"  fill="#9ca3af"/>
        <rect x="64" y="42" width="12" height="18" fill="#94a3b8"/>
        <rect x="64" y="58" width="4"  height="10" fill="#64748b"/>
        <rect x="69" y="58" width="4"  height="12" fill="#64748b"/>
        <rect x="74" y="60" width="4"  height="8"  fill="#64748b"/>
        <rect x="20" y="68" width="12" height="12" fill="#6b7280"/>
        <rect x="44" y="68" width="20" height="12" fill="#94a3b8"/>
      </svg>
    </>
  );
}

/* ── Ninja Cat (Security - red) ──────────────────────────────────────── */
function NinjaCat() {
  return (
    <>
      <style>{`
        @keyframes ncSway     { 0%,100%{transform:rotate(0deg)} 30%{transform:rotate(-3deg)} 70%{transform:rotate(3deg)} }
        @keyframes ncShuriken { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes ncEyes     { 0%,100%{filter:drop-shadow(0 0 2px #ef4444)} 50%{filter:drop-shadow(0 0 6px #ef4444)} }
      `}</style>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{imageRendering:"pixelated",display:"block"}}>
        <g style={{animation:"ncShuriken 1s linear infinite",transformOrigin:"12px 48px"}}>
          <rect x="8"  y="44" width="8"  height="8"  fill="#ef4444"/>
          <rect x="6"  y="46" width="12" height="4"  fill="#dc2626"/>
          <rect x="10" y="42" width="4"  height="12" fill="#dc2626"/>
          <rect x="7"  y="45" width="5"  height="5"  fill="#f87171" opacity="0.5"/>
        </g>
        <g style={{animation:"ncSway 2.2s ease-in-out infinite",transformOrigin:"40px 50px"}}>
          <rect x="24" y="4"  width="8"  height="10" fill="#1f2937"/>
          <rect x="48" y="4"  width="8"  height="10" fill="#1f2937"/>
          <rect x="18" y="10" width="44" height="30" fill="#111827"/>
          <rect x="16" y="18" width="48" height="6"  fill="#991b1b"/>
          <rect x="36" y="14" width="8"  height="10" fill="#b91c1c"/>
          <rect x="38" y="12" width="4"  height="4"  fill="#b91c1c"/>
          <g style={{animation:"ncEyes 1.6s ease-in-out infinite"}}>
            <rect x="24" y="20" width="12" height="7" fill="#ef4444"/>
            <rect x="27" y="22" width="5"  height="3" fill="#7f1d1d"/>
            <rect x="24" y="20" width="3"  height="3" fill="#fca5a5" opacity="0.5"/>
          </g>
          <g style={{animation:"ncEyes 1.6s ease-in-out infinite 0.2s"}}>
            <rect x="44" y="20" width="12" height="7" fill="#ef4444"/>
            <rect x="47" y="22" width="5"  height="3" fill="#7f1d1d"/>
            <rect x="44" y="20" width="3"  height="3" fill="#fca5a5" opacity="0.5"/>
          </g>
          <rect x="18" y="27" width="44" height="12" fill="#111827"/>
          <rect x="16" y="40" width="48" height="28" fill="#1f2937"/>
          <rect x="24" y="42" width="32" height="2"  fill="#374151"/>
          <rect x="20" y="44" width="4"  height="18" fill="#374151" opacity="0.4"/>
          <rect x="56" y="44" width="4"  height="18" fill="#374151" opacity="0.4"/>
          <rect x="16" y="56" width="48" height="4"  fill="#ef4444"/>
          <rect x="4"  y="40" width="14" height="18" fill="#1f2937"/>
          <rect x="2"  y="56" width="16" height="6"  fill="#374151"/>
          <rect x="62" y="34" width="14" height="22" fill="#1f2937"/>
          <rect x="62" y="32" width="16" height="6"  fill="#374151"/>
          <rect x="22" y="68" width="14" height="12" fill="#1f2937"/>
          <rect x="44" y="68" width="14" height="12" fill="#1f2937"/>
          <rect x="18" y="74" width="18" height="6"  fill="#111827"/>
          <rect x="44" y="74" width="18" height="6"  fill="#111827"/>
        </g>
      </svg>
    </>
  );
}

/* ── Shadow Cat (Privacy - indigo) ───────────────────────────────────── */
function ShadowCat() {
  return (
    <>
      <style>{`
        @keyframes shcFade { 0%,100%{opacity:0.9} 50%{opacity:0.5} }
        @keyframes shcEyes { 0%,100%{filter:drop-shadow(0 0 3px #6366f1)} 50%{filter:drop-shadow(0 0 8px #6366f1)} }
        @keyframes shcR1   { 0%{transform:translateY(0);opacity:0.8} 100%{transform:translateY(-20px);opacity:0} }
        @keyframes shcR2   { 0%{transform:translateY(0);opacity:0.6} 100%{transform:translateY(-16px);opacity:0} }
        @keyframes shcR3   { 0%{transform:translateY(0);opacity:0.7} 100%{transform:translateY(-24px);opacity:0} }
      `}</style>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{imageRendering:"pixelated",display:"block"}}>
        <rect x="4"  y="42" width="6"  height="6"  fill="#6366f1" style={{animation:"shcR1 2.3s linear infinite"}}/>
        <rect x="10" y="50" width="4"  height="4"  fill="#6366f1" opacity="0.7" style={{animation:"shcR1 2.3s linear infinite 0.5s"}}/>
        <rect x="68" y="40" width="6"  height="6"  fill="#6366f1" style={{animation:"shcR2 2s linear infinite 0.7s"}}/>
        <rect x="72" y="52" width="4"  height="4"  fill="#6366f1" opacity="0.6" style={{animation:"shcR2 2s linear infinite"}}/>
        <rect x="14" y="60" width="6"  height="4"  fill="#6366f1" opacity="0.5" style={{animation:"shcR3 2.6s linear infinite 1s"}}/>
        <rect x="62" y="62" width="6"  height="4"  fill="#6366f1" opacity="0.5" style={{animation:"shcR3 2.6s linear infinite 0.3s"}}/>
        <g style={{animation:"shcFade 3s ease-in-out infinite"}}>
          <rect x="30" y="0"  width="20" height="4"  fill="#312e81"/>
          <rect x="24" y="4"  width="32" height="4"  fill="#312e81"/>
          <rect x="18" y="8"  width="44" height="6"  fill="#312e81"/>
          <rect x="14" y="14" width="52" height="22" fill="#312e81"/>
          <rect x="18" y="16" width="44" height="18" fill="#1e1b4b"/>
          <g style={{animation:"shcEyes 1.8s ease-in-out infinite"}}>
            <rect x="24" y="20" width="12" height="8" fill="#6366f1"/>
            <rect x="27" y="22" width="5"  height="4" fill="#1e1b4b"/>
            <rect x="24" y="20" width="3"  height="3" fill="#a5b4fc" opacity="0.7"/>
          </g>
          <g style={{animation:"shcEyes 1.8s ease-in-out infinite 0.18s"}}>
            <rect x="44" y="20" width="12" height="8" fill="#6366f1"/>
            <rect x="47" y="22" width="5"  height="4" fill="#1e1b4b"/>
            <rect x="44" y="20" width="3"  height="3" fill="#a5b4fc" opacity="0.7"/>
          </g>
          <rect x="8"  y="36" width="64" height="36" fill="#312e81"/>
          <rect x="26" y="36" width="28" height="36" fill="#1e1b4b" opacity="0.5"/>
          <rect x="14" y="38" width="4"  height="30" fill="#1e1b4b" opacity="0.3"/>
          <rect x="62" y="38" width="4"  height="30" fill="#1e1b4b" opacity="0.3"/>
          <rect x="32" y="48" width="16" height="2"  fill="#6366f1" opacity="0.7"/>
          <rect x="34" y="50" width="12" height="2"  fill="#6366f1" opacity="0.5"/>
          <rect x="32" y="52" width="16" height="2"  fill="#6366f1" opacity="0.7"/>
          <rect x="36" y="50" width="6"  height="2"  fill="#6366f1" opacity="0.9"/>
          <rect x="8"  y="72" width="64" height="8"  fill="#1e1b4b" opacity="0.6"/>
          <rect x="12" y="74" width="14" height="6"  fill="#312e81"/>
          <rect x="34" y="74" width="12" height="6"  fill="#312e81"/>
          <rect x="54" y="74" width="14" height="6"  fill="#312e81"/>
        </g>
      </svg>
    </>
  );
}

/* ── Builder Cat (AutoGit - orange) ───────────────────────────────────── */
function BuilderCat() {
  return (
    <>
      <style>{`
        @keyframes bcType  { 0%,100%{opacity:1} 45%,55%{opacity:0} }
        @keyframes bcGlow  { 0%,100%{opacity:0.65} 50%{opacity:1} }
        @keyframes bcBlink { 0%,88%,100%{transform:scaleY(1)} 93%{transform:scaleY(0.1)} }
        @keyframes bcSpark { 0%,80%,100%{opacity:0;transform:scale(0.6)} 40%{opacity:1;transform:scale(1)} }
        @keyframes bcHelm  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-1px)} }
      `}</style>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{imageRendering:"pixelated",display:"block"}}>
        {/* Hard hat */}
        <g style={{animation:"bcHelm 1.8s ease-in-out infinite"}}>
          <rect x="28" y="2"  width="24" height="4"  fill="#f97316"/>
          <rect x="22" y="6"  width="36" height="6"  fill="#fb923c"/>
          <rect x="14" y="12" width="52" height="4"  fill="#f97316"/>
          <rect x="16" y="16" width="48" height="2"  fill="#fed7aa" opacity="0.4"/>
        </g>
        {/* Ears */}
        <rect x="20" y="12" width="8"  height="8"  fill="#ea580c"/>
        <rect x="52" y="12" width="8"  height="8"  fill="#ea580c"/>
        <rect x="22" y="14" width="4"  height="4"  fill="#fdba74"/>
        <rect x="54" y="14" width="4"  height="4"  fill="#fdba74"/>
        {/* Head */}
        <rect x="18" y="16" width="44" height="22" fill="#fde8d0"/>
        {/* Eyes */}
        <g style={{animation:"bcBlink 3.2s ease-in-out infinite",transformBox:"fill-box",transformOrigin:"50% 50%"}}>
          <rect x="24" y="22" width="10" height="7"  fill="#1c1917"/>
          <rect x="26" y="23" width="6"  height="4"  fill="#f97316" style={{animation:"bcGlow 1.4s ease-in-out infinite"}}/>
          <rect x="24" y="22" width="3"  height="2"  fill="white" opacity="0.6"/>
        </g>
        <g style={{animation:"bcBlink 3.2s ease-in-out infinite 0.12s",transformBox:"fill-box",transformOrigin:"50% 50%"}}>
          <rect x="46" y="22" width="10" height="7"  fill="#1c1917"/>
          <rect x="48" y="23" width="6"  height="4"  fill="#f97316" style={{animation:"bcGlow 1.4s ease-in-out infinite 0.3s"}}/>
          <rect x="46" y="22" width="3"  height="2"  fill="white" opacity="0.6"/>
        </g>
        {/* Nose + smile */}
        <rect x="37" y="30" width="6"  height="3"  fill="#c2410c" opacity="0.5"/>
        <rect x="33" y="33" width="4"  height="2"  fill="#c2410c" opacity="0.4"/>
        <rect x="43" y="33" width="4"  height="2"  fill="#c2410c" opacity="0.4"/>
        {/* Body - orange jacket */}
        <rect x="16" y="38" width="48" height="30" fill="#ea580c"/>
        <rect x="20" y="40" width="40" height="26" fill="#f97316"/>
        {/* Laptop screen */}
        <rect x="24" y="42" width="32" height="18" fill="#1c1917"/>
        <rect x="26" y="44" width="28" height="14" fill="#0f172a"/>
        {/* Code lines on screen */}
        <rect x="28" y="46" width="12" height="2"  fill="#fb923c" style={{animation:"bcGlow 1.2s ease-in-out infinite"}}/>
        <rect x="28" y="50" width="18" height="2"  fill="#fbbf24" style={{animation:"bcGlow 1.2s ease-in-out infinite 0.25s"}}/>
        <rect x="28" y="54" width="10" height="2"  fill="#fb923c" style={{animation:"bcGlow 1.2s ease-in-out infinite 0.5s"}}/>
        {/* Blinking cursor */}
        <rect x="38" y="54" width="2"  height="2"  fill="#fef3c7" style={{animation:"bcType 0.8s step-end infinite"}}/>
        {/* Laptop base */}
        <rect x="20" y="60" width="40" height="4"  fill="#292524"/>
        {/* Arms */}
        <rect x="4"  y="40" width="14" height="16" fill="#ea580c"/>
        <rect x="2"  y="54" width="16" height="6"  fill="#f97316"/>
        <rect x="62" y="40" width="14" height="16" fill="#ea580c"/>
        <rect x="62" y="54" width="16" height="6"  fill="#f97316"/>
        {/* Legs + feet */}
        <rect x="22" y="68" width="12" height="12" fill="#ea580c"/>
        <rect x="46" y="68" width="12" height="12" fill="#ea580c"/>
        <rect x="18" y="74" width="16" height="6"  fill="#c2410c"/>
        <rect x="46" y="74" width="16" height="6"  fill="#c2410c"/>
        {/* Spark notification */}
        <g style={{animation:"bcSpark 2s ease-in-out infinite",transformOrigin:"71px 11px"}}>
          <rect x="67" y="7"  width="8"  height="8"  fill="#fbbf24"/>
          <rect x="69" y="5"  width="4"  height="12" fill="#fbbf24" opacity="0.5"/>
          <rect x="63" y="9"  width="12" height="4"  fill="#fbbf24" opacity="0.5"/>
          <rect x="67" y="7"  width="4"  height="4"  fill="#fef9c3" opacity="0.8"/>
        </g>
      </svg>
    </>
  );
}

/* ── Merchant Cat (eCommerce - emerald) ──────────────────────────────── */
function MerchantCat() {
  return (
    <>
      <style>{`
        @keyframes mctCoin   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes mctGlow   { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes mctBlink  { 0%,90%,100%{transform:scaleY(1)} 95%{transform:scaleY(0.1)} }
        @keyframes mctSpin   { 0%{transform:scaleX(1)} 40%{transform:scaleX(0.1)} 50%{transform:scaleX(-1)} 90%{transform:scaleX(-0.1)} 100%{transform:scaleX(1)} }
      `}</style>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{imageRendering:"pixelated",display:"block"}}>
        {/* Merchant top hat */}
        <rect x="30" y="0"  width="20" height="6"  fill="#14532d"/>
        <rect x="26" y="6"  width="28" height="6"  fill="#166534"/>
        <rect x="14" y="12" width="52" height="4"  fill="#15803d"/>
        <rect x="16" y="16" width="48" height="2"  fill="#86efac" opacity="0.3"/>
        {/* Ears */}
        <rect x="20" y="10" width="8"  height="8"  fill="#10b981"/>
        <rect x="52" y="10" width="8"  height="8"  fill="#10b981"/>
        <rect x="22" y="12" width="4"  height="4"  fill="#6ee7b7"/>
        <rect x="54" y="12" width="4"  height="4"  fill="#6ee7b7"/>
        {/* Head */}
        <rect x="18" y="16" width="44" height="22" fill="#fde8d0"/>
        {/* Eyes */}
        <g style={{animation:"mctBlink 3.8s ease-in-out infinite",transformBox:"fill-box",transformOrigin:"50% 50%"}}>
          <rect x="24" y="22" width="10" height="7"  fill="#1c1917"/>
          <rect x="26" y="23" width="6"  height="4"  fill="#10b981" style={{animation:"mctGlow 2s ease-in-out infinite"}}/>
          <rect x="24" y="22" width="3"  height="2"  fill="white" opacity="0.7"/>
        </g>
        <g style={{animation:"mctBlink 3.8s ease-in-out infinite 0.2s",transformBox:"fill-box",transformOrigin:"50% 50%"}}>
          <rect x="46" y="22" width="10" height="7"  fill="#1c1917"/>
          <rect x="48" y="23" width="6"  height="4"  fill="#10b981" style={{animation:"mctGlow 2s ease-in-out infinite 0.4s"}}/>
          <rect x="46" y="22" width="3"  height="2"  fill="white" opacity="0.7"/>
        </g>
        {/* Smile - wide grin */}
        <rect x="34" y="30" width="12" height="3"  fill="#10b981" opacity="0.7"/>
        <rect x="30" y="32" width="4"  height="2"  fill="#10b981" opacity="0.5"/>
        <rect x="46" y="32" width="4"  height="2"  fill="#10b981" opacity="0.5"/>
        {/* Body - green merchant vest */}
        <rect x="16" y="38" width="48" height="30" fill="#064e3b"/>
        <rect x="20" y="40" width="40" height="26" fill="#065f46"/>
        {/* Credit card in hand */}
        <rect x="22" y="44" width="20" height="12" fill="#1d4ed8"/>
        <rect x="24" y="46" width="16" height="8"  fill="#2563eb"/>
        <rect x="24" y="48" width="16" height="2"  fill="#93c5fd" opacity="0.6"/>
        <rect x="24" y="52" width="8"  height="2"  fill="#bfdbfe" opacity="0.7"/>
        <rect x="24" y="46" width="6"  height="4"  fill="#fbbf24" opacity="0.9"/>
        {/* USDC symbol */}
        <rect x="46" y="44" width="10" height="10" fill="#fde047"/>
        <rect x="48" y="46" width="6"  height="6"  fill="#f59e0b"/>
        <rect x="50" y="46" width="2"  height="1"  fill="#1d4ed8"/>
        <rect x="51" y="47" width="1"  height="4"  fill="#1d4ed8"/>
        <rect x="50" y="51" width="2"  height="1"  fill="#1d4ed8"/>
        {/* Bouncing coin */}
        <g style={{animation:"mctCoin 1.2s ease-in-out infinite"}}>
          <rect x="4"  y="30" width="10" height="10" fill="#fde047"/>
          <rect x="6"  y="32" width="6"  height="6"  fill="#f59e0b"/>
          <g style={{animation:"mctSpin 1.6s ease-in-out infinite",transformBox:"fill-box",transformOrigin:"50% 50%"}}>
            <rect x="8"  y="34" width="2"  height="4"  fill="#fef3c7" opacity="0.8"/>
          </g>
          <rect x="4"  y="30" width="4"  height="4"  fill="#fef9c3" opacity="0.5"/>
        </g>
        {/* Arms */}
        <rect x="4"  y="40" width="14" height="16" fill="#065f46"/>
        <rect x="2"  y="54" width="16" height="6"  fill="#064e3b"/>
        <rect x="62" y="40" width="14" height="16" fill="#065f46"/>
        <rect x="62" y="54" width="16" height="6"  fill="#064e3b"/>
        {/* Legs + feet */}
        <rect x="22" y="68" width="12" height="12" fill="#064e3b"/>
        <rect x="46" y="68" width="12" height="12" fill="#064e3b"/>
        <rect x="18" y="74" width="16" height="6"  fill="#052e16"/>
        <rect x="46" y="74" width="16" height="6"  fill="#052e16"/>
      </svg>
    </>
  );
}

const CLASSIFICATION_CARDS: ModalData[] = [
  {
    title: "IssueOps Banking",
    tagline: "GitHub comments that move money",
    accent: "hsl(var(--primary))",
    icon: <IssueOpsIcon />,
    features: [
      "@gitbankbot commands in Issues + PRs",
      "Claude NLP parses intent and amounts",
      "Relayer pays all gas, zero ETH needed",
      "English receipt posted back to thread",
    ],
    steps: [
      { step: "01", title: "Install bot", desc: "One-click GitHub App install on any repo" },
      { step: "02", title: "Fund vault", desc: "Deposit USDC or WETH via @gitbankbot deposit" },
      { step: "03", title: "Comment command", desc: "@gitbankbot assign 100 USDC bounty #42" },
      { step: "04", title: "Settlement", desc: "PR merges, webhook fires, escrow releases on Base" },
    ],
    example: "@gitbankbot assign 500 USDC bounty #42",
    docsPath: "/docs",
    path: "/features/issueops",
    mascot: <HackerCat />,
  },
  {
    title: "DeFi Infrastructure",
    tagline: "Vault, swap, yield: all gasless",
    accent: "#3b82f6",
    icon: <DefiIcon />,
    features: [
      "Soul-bound GitVault on Base Mainnet",
      "Uniswap v3 USDC/WETH swaps via gitSwap",
      "Non-custodial: you own the keys",
      "Gasless relayer handles all on-chain execution",
    ],
    steps: [
      { step: "01", title: "Deploy vault", desc: "Install bot: relayer auto-deploys your vault" },
      { step: "02", title: "Deposit", desc: "@gitbankbot deposit 100 USDC" },
      { step: "03", title: "Swap", desc: "@gitbankbot swap 50 USDC to WETH" },
      { step: "04", title: "Withdraw", desc: "@gitbankbot withdraw 0.01 WETH to 0x..." },
    ],
    example: "@gitbankbot swap 100 USDC to WETH",
    docsPath: "/docs#defi",
    path: "/features/defi",
    mascot: <BankerCat />,
  },
  {
    title: "RWA Layer",
    tagline: "Tokenized real-world assets on Base",
    accent: "#f59e0b",
    icon: <RwaIcon />,
    badge: "BUILDING",
    features: [
      "GitStock: tokenized equity positions on Base",
      "CCTP cross-chain USDC bridging (Solana/Ethereum)",
      "Soul-bound, non-transferable share tokens",
      "Automated settlement via relayer",
    ],
    steps: [
      { step: "01", title: "Browse stocks", desc: "List tokenized equities available on GitStock" },
      { step: "02", title: "Buy shares", desc: "@gitbankbot buy 10 AAPL" },
      { step: "03", title: "Hold position", desc: "GitStockToken minted to your vault" },
      { step: "04", title: "Sell", desc: "@gitbankbot sell 5 AAPL, USDC returned" },
    ],
    example: "@gitbankbot buy 10 AAPL",
    docsPath: "/docs#rwa",
    path: "/features/rwa",
    mascot: <StockCat />,
  },
  {
    title: "AI Agent Economy",
    tagline: "Any GitHub ID is a bank account",
    accent: "#8b5cf6",
    icon: <AiIcon />,
    features: [
      "x402 HTTP payments, no API key needed",
      "MCP tools for Claude, Cursor, Grok",
      "Human, bot, or AI agent: same vault",
      "Per-agent spending limits (Phase 1)",
    ],
    steps: [
      { step: "01", title: "Connect LLM", desc: "Add Gitbank MCP server to Claude Desktop or Cursor" },
      { step: "02", title: "Query vault", desc: "Ask your AI to check your gitbank balance" },
      { step: "03", title: "Pay with x402", desc: "Agent authenticates via L402 over HTTP" },
      { step: "04", title: "Settle on Base", desc: "Payment recorded on-chain, receipt returned" },
    ],
    example: "gitbank_vault_balance({ github_id: 938102 })",
    docsPath: "/mcp",
    path: "/features/ai-agent",
    mascot: <RobotCat />,
  },
  {
    title: "Security Layer",
    tagline: "Institutional grade, zero attack surface",
    accent: "#ef4444",
    icon: <SecurityIcon />,
    features: [
      "Soul-bound tokens: no transfer(), no approve()",
      "Dual-sig: Owner + Relayer required for every tx",
      "Bound to permanent immutable GitHub integer ID",
      "2-step commit-reveal prevents front-running",
    ],
    steps: [
      { step: "01", title: "Soul-bound", desc: "GitToken cannot be transferred or approved" },
      { step: "02", title: "Dual-sig", desc: "Both owner + relayer must sign every meta-tx" },
      { step: "03", title: "Permanent ID", desc: "GitHub integer ID, cannot be renamed or spoofed" },
      { step: "04", title: "Commit-reveal", desc: "2-step transfer prevents MEV front-running" },
    ],
    example: "@gitbankbot send 10 USDC to @contributor",
    docsPath: "/docs#security",
    path: "/features/security",
    mascot: <NinjaCat />,
  },
  {
    title: "Privacy Infra",
    tagline: "ZK transfers and multi-sig orgs",
    accent: "#6366f1",
    icon: <PrivacyIcon />,
    badge: "PHASE 6",
    features: [
      "ZK private transfers on Base",
      "GitHub Org multi-sig vaults (N-of-M)",
      "Zero-trust payroll streaming",
      "Bug bounty escrow with private disclosure",
    ],
    steps: [
      { step: "01", title: "Org vault", desc: "Deploy multi-sig vault for your GitHub org" },
      { step: "02", title: "Set quorum", desc: "N-of-M maintainer approval for large txs" },
      { step: "03", title: "Private transfer", desc: "ZK proof hides amount and recipient" },
      { step: "04", title: "Audit trail", desc: "On-chain receipts, off-chain privacy" },
    ],
    example: "@gitbankbot org-pay 1000 USDC @team",
    docsPath: "/docs#privacy",
    path: "/features/privacy",
    mascot: <ShadowCat />,
  },
  {
    title: "AutoGit Builder",
    tagline: "Push code to GitHub from any AI client",
    accent: "#f97316",
    icon: <GitBranch size={20} />,
    features: [
      "Claude Desktop, Cursor, Grok: push code directly from chat",
      "Auto-generate commit messages with AI context",
      "Create pull requests without leaving your AI assistant",
      "Works with any MCP-compatible client in one config line",
    ],
    steps: [
      { step: "01", title: "Add MCP", desc: "Paste AutoGit MCP URL into Claude, Cursor, or Grok" },
      { step: "02", title: "Build", desc: "Write code with your AI assistant as normal" },
      { step: "03", title: "Push", desc: "Tell your AI: push my changes to main" },
      { step: "04", title: "Done", desc: "Commit lands on GitHub, PR opened automatically" },
    ],
    example: `autogit_push({ message: "feat: add payment handler" })`,
    docsPath: "/docs#autogit",
    path: "/features/autogit",
    mascot: <BuilderCat />,
  },
  {
    title: "gitNeo",
    tagline: "Spend crypto anywhere Mastercard is accepted",
    accent: "#10b981",
    icon: <CreditCard size={20} />,
    badge: "BUILDING",
    features: [
      "Virtual Mastercard loaded from your GitVault USDC balance",
      "Pay for Claude credits, AWS, gift cards, any SaaS",
      "Issue team cards to contributors with spending limits",
      "Auto-reload from vault when balance drops low",
    ],
    steps: [
      { step: "01", title: "Request", desc: "@gitbankbot issue-card 200 USDC" },
      { step: "02", title: "Provisioned", desc: "Virtual Mastercard details posted to thread" },
      { step: "03", title: "Pay", desc: "Use card at Claude, AWS, gift cards, any merchant" },
      { step: "04", title: "Receipt", desc: "Transaction receipts posted back to GitHub Issue" },
    ],
    example: "@gitbankbot issue-card 200 USDC",
    docsPath: "/docs#gitneo",
    path: "/features/commerce",
    mascot: <MerchantCat />,
  },
];

function PhoneVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
      setPlaying(false);
    } else {
      v.play();
      setPlaying(true);
    }
  }

  return (
    <div className="flex justify-center lg:sticky lg:top-8">
      <div className="relative w-[320px] flex flex-col items-center">
        {/* Phone frame */}
        <div
          className="relative w-full rounded-[44px] border-[7px] border-foreground/15 bg-black overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.4)]"
          style={{ aspectRatio: "9/19" }}
        >
          {/* Notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-[18px] bg-black rounded-full z-20" />

          {/* Video */}
          <video
            ref={videoRef}
            src="/demo.mp4"
            playsInline
            loop
            className="absolute inset-0 w-full h-full object-cover"
            onEnded={() => setPlaying(false)}
          />

          {/* Play/pause overlay — always clickable */}
          <button
            onClick={toggle}
            className="absolute inset-0 z-10 flex items-center justify-center group"
            aria-label={playing ? "Pause" : "Play"}
          >
            <AnimatePresence>
              {!playing && (
                <motion.div
                  key="play-btn"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.18 }}
                  className="w-16 h-16 rounded-full bg-black/60 backdrop-blur flex items-center justify-center border border-white/20 shadow-xl"
                >
                  <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 translate-x-0.5">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Side hardware buttons */}
        <div className="absolute -right-[10px] top-[100px] w-[6px] h-12 rounded-r-full bg-foreground/10" />
        <div className="absolute -left-[10px] top-[80px] w-[6px] h-9 rounded-l-full bg-foreground/10" />
        <div className="absolute -left-[10px] top-[126px] w-[6px] h-9 rounded-l-full bg-foreground/10" />

        {/* Label below phone */}
        <p className="mt-4 text-[11px] font-mono text-muted-foreground text-center">
          {playing ? "tap to pause" : "tap to play demo"}
        </p>
      </div>
    </div>
  );
}

function ClassificationSection({ onOpen }: { onOpen: (d: ModalData) => void }) {
  return (
    <section className="relative w-full min-h-screen flex items-center py-8 px-4 lg:px-8 border-b border-border bg-background overflow-hidden">
      <motion.div
        className="w-full max-w-[1400px] mx-auto border border-border bg-card overflow-hidden"
        initial={{ opacity: 0, y: 380, scale: 0.76, borderRadius: 40 }}
        whileInView={{ opacity: 1, y: 0, scale: 1, borderRadius: 16 }}
        viewport={{ once: false, amount: 0.04 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{ boxShadow: "0 40px 120px rgba(0,0,0,0.22)" }}
      >
      <div className="p-8 lg:p-12 flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Protocol Surface</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">What Gitbank does</h2>
          <p className="text-muted-foreground font-mono text-sm max-w-xl">Eight interlocking systems. All driven by GitHub comments.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left — cards grid */}
          <div className="grid grid-cols-2 gap-3">
            {CLASSIFICATION_CARDS.map((card) => (
              <button
                key={card.title}
                onClick={() => onOpen(card)}
                className="flex flex-col gap-3 p-4 bg-card border border-border rounded-lg text-left hover:border-primary/40 transition-all group relative overflow-hidden"
                style={{ "--card-accent": card.accent } as React.CSSProperties}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top left, ${card.accent}08 0%, transparent 60%)` }} />
                <div className="flex items-start justify-between">
                  <div className="p-1.5 rounded-md" style={{ background: `${card.accent}18`, color: card.accent }}>
                    {card.icon}
                  </div>
                  {card.badge && (
                    <span className="text-[8px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-full border"
                      style={{ color: card.accent, borderColor: `${card.accent}40`, background: `${card.accent}12` }}>
                      {card.badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-foreground text-[12px] font-mono leading-tight">{card.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{card.tagline}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono mt-auto pt-2 border-t border-border/50"
                  style={{ color: card.accent }}>
                  <span>Learn more</span>
                  <ChevronRight size={10} />
                </div>
              </button>
            ))}
          </div>

          {/* Right — phone video */}
          <PhoneVideo />
        </div>
      </div>
      </motion.div>
    </section>
  );
}

function ClassificationModal({ data, onClose }: { data: ModalData; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      >
        <motion.div
          key="modal-panel"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ type: "spring", stiffness: 360, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-card border border-border rounded-xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto"
          style={{ boxShadow: `0 0 60px ${data.accent}20, 0 20px 60px rgba(0,0,0,0.5)` }}
        >
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: data.accent }} />
          <div className="p-6 flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2.5 rounded-lg flex-shrink-0" style={{ background: `${data.accent}18`, color: data.accent }}>
                  {data.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-bold text-foreground text-lg font-mono">{data.title}</h2>
                    {data.badge && (
                      <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border"
                        style={{ color: data.accent, borderColor: `${data.accent}40`, background: `${data.accent}12` }}>
                        {data.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{data.tagline}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 flex-shrink-0">
                {data.mascot && (
                  <div className="opacity-90 mt-1 hidden sm:block" style={{ imageRendering: "pixelated" }}>
                    {data.mascot}
                  </div>
                )}
                <button onClick={onClose} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Features</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: data.accent }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">How it works</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {data.steps.map((s, i) => (
                  <div key={i} className="flex flex-col gap-2 p-3 rounded-lg border border-border bg-background/50">
                    <span className="text-[10px] font-mono font-bold" style={{ color: data.accent }}>{s.step}</span>
                    <p className="text-xs font-bold text-foreground">{s.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Example command</p>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background font-mono text-sm" style={{ borderColor: `${data.accent}30` }}>
                <span className="text-[11px] flex-shrink-0" style={{ color: data.accent }}>$</span>
                <code className="text-foreground text-xs flex-1 break-all">{data.example}</code>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border gap-3">
              <Link href={data.docsPath} onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-mono border transition-all text-muted-foreground hover:text-foreground"
                style={{ borderColor: "var(--border)" }}>
                Docs <ChevronRight size={13} />
              </Link>
              <Link href={data.path} onClick={onClose}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-mono font-bold border transition-all"
                style={{ color: data.accent, borderColor: `${data.accent}40`, background: `${data.accent}10` }}>
                Full details <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Main page ───────────────────────────────────────────────── */

export default function Home() {
  const [, navigate] = useLocation();
  const stats = useProtocolStats();
  const [modal, setModal] = useState<ModalData | null>(null);

  const liveFeatures: { icon: React.ReactNode; name: string; desc: string; href: string; external?: boolean; badge?: string }[] = [
    { icon: <Wallet size={18}/>, name: "GitVault", desc: "Soul-bound non-custodial vault on Base Mainnet", href: "/vault" },
    { icon: <Bot size={18}/>, name: "GitHub bot", desc: "@gitbankbot in any Issue or PR comment", href: "/github-app" },
    { icon: <Shield size={18}/>, name: "gitShield", desc: "Deposit USDC or WETH into your vault", href: "/vault" },
    { icon: <Lock size={18}/>, name: "gitUnshield", desc: "Withdraw to any address, any time", href: "/vault" },
    { icon: <ArrowRightLeft size={18}/>, name: "gitSwap", desc: "Uniswap v3 USDC/WETH swap, 0.05% pool", href: "/gitswap" },
    { icon: <Zap size={18}/>, name: "gitSend", desc: "2-step commit-reveal vault-to-vault transfer", href: "/docs#transfer" },
    { icon: <Coins size={18}/>, name: "GitBounty", desc: "Assign escrow, auto-release when PR merges", href: "/docs#bounty" },
    { icon: <Terminal size={18}/>, name: "MCP Server", desc: "Claude Desktop, Cursor, Grok integration", href: "/mcp" },
    { icon: <Layers size={18}/>, name: "Base MCP", desc: "EIP-5792 wallet_sendCalls, Coinbase Wallet native", href: "/mcp/base" },
    { icon: <Rocket size={18}/>, name: "Clanker", desc: "Recently launched tokens + launch your own via GitHub or MCP", href: "/launchpad", badge: "LAUNCHED" },
    { icon: <Cpu size={18}/>, name: "x402", desc: "Agent-to-agent HTTP payment protocol, no API key", href: "/x402" },
    { icon: <GitPullRequest size={18}/>, name: "AutoGit", desc: "AI-powered git automation for Web3 repos", href: "/autogit/", badge: "NEW" },
  ];

  const plannedPhases = [
    { phase: "P1", title: "AI Agent Economy", desc: "Coinbase AgentKit, Virtuals, agent-to-agent x402 payments, per-agent spending limits" },
    { phase: "P2", title: "DeFi Yield Layer", desc: "Morpho Blue, Moonwell, Aave V3, Compound V3, cbETH staking, Pendle yield tokenization, EigenLayer restaking - all on Base" },
    { phase: "P3", title: "Protocol SDK + gitNeo", desc: "@gitbank/sdk on npm, gitNeo virtual Mastercard, crypto neobank card issuance, pay any service with USDC from vault" },
    { phase: "P4", title: "Advanced Trading", desc: "Synthetix V3 perpetuals on Base, Lyra Finance options on Base, long/short stock positions, keeper-based limit orders, DCA automation, stop-loss triggers" },
    { phase: "P5", title: "Token Economy", desc: "Token launchpad flywheel, Ondo USDY (tokenized T-bill on Base), Backed bCSPX (tokenized S&P500 on Base), GITBANK staking tiers" },
    { phase: "P6", title: "Privacy + Security", desc: "ZK private transfers on Base, GitHub Org multi-sig vaults, N-of-M maintainer approval, zero-trust payroll, bug bounty escrow" },
    { phase: "P7", title: "GitScore + Financial OS", desc: "Soul-bound contribution NFTs, reputational collateral for lending, DAO payroll streaming, Chainlink CCIP cross-chain, fork royalties" }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {modal && <ClassificationModal data={modal} onClose={() => setModal(null)} />}
      <AppSidebar />
      <main className="md:ml-[48px] mt-14 md:mt-0 flex-1 min-h-screen overflow-y-auto">
        <div className="w-full flex flex-col font-sans relative">
          
          {/* News Banner — single compact bar */}
          <div className="w-full flex items-center justify-center gap-6 border-b border-border bg-muted/30 px-4 py-2 flex-wrap">
            <Link href="/mcp" className="flex items-center gap-2 group">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[12px] font-mono text-emerald-500 font-semibold group-hover:underline">MCP live in Claude, Cursor, Grok</span>
            </Link>
            <span className="text-border hidden sm:block">|</span>
            <Link href="/mcp/base" className="flex items-center gap-2 group">
              <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[12px] font-mono text-blue-500 font-semibold group-hover:underline">Base MCP live + EIP-5792</span>
            </Link>
            <span className="text-border hidden sm:block">|</span>
            <a href="https://clanker.world/clanker/0xC21dd0eE043930711C2a3e55F39C7d3144d09B07" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
              <span className="flex h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-[12px] font-mono text-orange-400 font-semibold group-hover:underline">GITBANK token launched on Clanker</span>
            </a>
          </div>

          {/* Hero Section */}
          <section className="relative w-full pt-3 pb-6 md:pt-5 md:pb-10 px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 flex flex-col gap-5 z-10 relative">
              <div className="absolute -left-12 -top-12 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="flex flex-col gap-4 max-w-2xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] font-sans">
                  The on-chain bank that runs inside your GitHub.
                </h1>
                
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl border-l-2 border-primary/40 pl-4 font-medium">
                  Every @gitbankbot command in a GitHub Issue or PR triggers a smart contract on Base Mainnet. Deposit, swap, send, and pay bounties - zero gas, zero wallet popups, zero setup friction. Built for developers and AI agents that need financial infrastructure that actually works.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                <Link href="/github-app" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-bold font-mono text-sm uppercase tracking-wide rounded-md hover:bg-primary/90 transition-all border border-primary-foreground/10 shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                  Get Started <ChevronRight size={16} />
                </Link>
                <Link href="/docs" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-card text-foreground font-bold font-mono text-sm uppercase tracking-wide rounded-md border border-border hover:bg-muted transition-all">
                  Docs
                </Link>
                <a href="https://clanker.world/clanker/0xC21dd0eE043930711C2a3e55F39C7d3144d09B07" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-orange-500/10 text-orange-400 font-bold font-mono text-sm uppercase tracking-wide rounded-md border border-orange-500/30 hover:bg-orange-500/20 transition-all">
                  <Rocket size={14} /> Clanker
                </a>
              </div>

              {/* Powered-by logo strip — visible in first view */}
              <div className="flex items-center gap-5 pt-2 flex-wrap">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Built with</span>
                <img src="/logos/github.png" alt="GitHub App" title="GitHub App" className="h-5 w-auto opacity-80 hover:opacity-100 transition-opacity" />
                <img src="/logos/claude.png" alt="Anthropic Claude" title="Anthropic Claude" className="h-5 w-auto opacity-80 hover:opacity-100 transition-opacity dark:[filter:invert(1)_hue-rotate(180deg)]" />
                <BaseLogo className="h-5 w-auto opacity-80 hover:opacity-100 transition-opacity text-foreground" />
                <img src="/logos/npm.png" alt="npm" title="npm" className="h-5 w-auto opacity-80 hover:opacity-100 transition-opacity" />
              </div>

              {stats && (
                <div className="flex items-center gap-8 pt-3 mt-1 border-t border-border">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold font-mono text-foreground">{stats.vaultsDeployed.toLocaleString()}</span>
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Vaults Deployed</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold font-mono text-foreground">{stats.txOnChain.toLocaleString()}</span>
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Tx On-Chain</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 flex justify-end w-full lg:w-auto relative z-10">
              <ProductShowcase />
            </div>
          </section>

          {/* Protocol Stats */}
          {stats && (
            <section className="w-full border-y border-border bg-muted/10 py-10 px-6 lg:px-12">
              <div className="max-w-[1400px] mx-auto grid grid-cols-3 gap-8">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-4xl font-bold font-mono text-foreground">{stats.vaultsDeployed.toLocaleString()}</span>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">Vaults Deployed</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-x border-border px-8">
                  <span className="text-4xl font-bold font-mono text-foreground">{(stats.commandsProcessed ?? 0).toLocaleString()}</span>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">Commands Processed</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-4xl font-bold font-mono text-foreground">{stats.txOnChain.toLocaleString()}</span>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">Tx On-Chain</span>
                </div>
              </div>
            </section>
          )}

          {/* EVENTS */}
          <section className="w-full py-10 px-6 lg:px-12">
            <div className="max-w-[1400px] mx-auto">
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-6">Live Events</p>

              {/* AutoGit Hackathon card */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                onClick={() => window.open("https://gitbankio.github.io/autogit-hackathon", "_blank")}
                className="relative mb-5 rounded-2xl border border-primary/40 bg-primary/5 overflow-hidden cursor-pointer group hover:border-primary/70 hover:bg-primary/8 transition-all"
              >
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                <div className="absolute top-4 right-44 md:right-64 opacity-20 text-primary pointer-events-none select-none">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ imageRendering: "pixelated" }}>
                    {([[0,16],[8,8],[16,0],[24,8],[32,16],[32,24]] as [number,number][]).map(([x,y],i) => (
                      <rect key={i} x={x} y={y} width="8" height="8" fill="currentColor" />
                    ))}
                  </svg>
                </div>
                <div className="absolute bottom-3 left-10 opacity-10 text-primary pointer-events-none select-none">
                  <svg width="60" height="16" viewBox="0 0 60 16" fill="none" style={{ imageRendering: "pixelated" }}>
                    {([0,10,20,30,40,50] as number[]).map((x,i) => (
                      <rect key={i} x={x} y={i%2===0?0:6} width="8" height="8" fill="currentColor" />
                    ))}
                  </svg>
                </div>
                <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 px-6 py-6 sm:px-8">
                  <div className="flex-shrink-0 hidden sm:block">
                    <img src="/gitbank-logo.png" alt="Gitbank" width={56} height={56} style={{ borderRadius: "50%" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold tracking-widest uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Live Now
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">100 slots</span>
                    </div>
                    <p className="text-[15px] sm:text-[17px] font-bold text-foreground leading-snug mb-1">AutoGit Hackathon</p>
                    <p className="text-[13px] text-muted-foreground leading-snug">
                      Submit a prompt template. Get paid 5 gitUSDC automatically when your PR merges. Top 3 win 300 / 200 / 100 gitUSDC bonus.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="hidden md:flex flex-col gap-1.5">
                      {[
                        { label: "Entry", amt: "5 gitUSDC", color: "text-primary bg-primary/10 border-primary/20" },
                        { label: "Top prize", amt: "300 gitUSDC", color: "text-yellow-600 dark:text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
                      ].map(p => (
                        <div key={p.label} className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${p.color}`}>
                          <span className="text-muted-foreground font-normal">{p.label}</span>
                          <span>{p.amt}</span>
                        </div>
                      ))}
                    </div>
                    <div className="w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all flex-shrink-0">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* OpenHack card */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                onClick={() => navigate("/openhack")}
                className="relative rounded-2xl border border-red-500/30 bg-red-500/5 overflow-hidden cursor-pointer group hover:border-red-500/60 hover:bg-red-500/8 transition-all"
              >
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #ef4444 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                <div className="absolute top-4 right-44 md:right-64 opacity-15 text-red-500 pointer-events-none select-none">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ imageRendering: "pixelated" }}>
                    {([[0,8],[8,0],[16,8],[8,16],[16,24],[24,16],[32,24],[24,32]] as [number,number][]).map(([x,y],i) => (
                      <rect key={i} x={x} y={y} width="8" height="8" fill="currentColor" />
                    ))}
                  </svg>
                </div>
                <div className="absolute bottom-3 right-8 opacity-10 text-red-500 pointer-events-none select-none">
                  <svg width="48" height="20" viewBox="0 0 48 20" fill="none" style={{ imageRendering: "pixelated" }}>
                    <rect x="0"  y="6"  width="4"  height="8" fill="currentColor" />
                    <rect x="4"  y="4"  width="4"  height="12" fill="currentColor" />
                    <rect x="8"  y="2"  width="4"  height="16" fill="currentColor" />
                    <rect x="12" y="4"  width="4"  height="12" fill="currentColor" />
                    <rect x="16" y="6"  width="4"  height="8" fill="currentColor" />
                    <rect x="22" y="9"  width="26" height="2" fill="currentColor" />
                    <rect x="38" y="11" width="4"  height="4" fill="currentColor" />
                    <rect x="44" y="11" width="4"  height="4" fill="currentColor" />
                  </svg>
                </div>
                <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 px-6 py-6 sm:px-8">
                  <div className="flex-shrink-0 hidden sm:block">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ imageRendering: "pixelated" }}>
                      <rect x="12" y="4"  width="24" height="4"  fill="#ef4444" />
                      <rect x="8"  y="8"  width="32" height="4"  fill="#ef4444" />
                      <rect x="8"  y="12" width="4"  height="12" fill="#ef4444" />
                      <rect x="36" y="12" width="4"  height="12" fill="#ef4444" />
                      <rect x="4"  y="24" width="40" height="20" fill="#ef4444" />
                      <rect x="8"  y="28" width="32" height="12" fill="#7f1d1d" />
                      <rect x="20" y="30" width="8"  height="4"  fill="#fca5a5" />
                      <rect x="22" y="34" width="4"  height="4"  fill="#fca5a5" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold tracking-widest uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Live Challenge
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">OpenHack</span>
                    </div>
                    <p className="text-[15px] sm:text-[17px] font-bold text-foreground leading-snug mb-1">Hack the Vault. Keep the Prize.</p>
                    <p className="text-[13px] text-muted-foreground leading-snug">
                      We published the owner private key to a live vault. 504 gitUSDC inside. Drain it if you can -- the funds are yours.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="hidden md:flex flex-col gap-1.5">
                      {[
                        { label: "Prize", amt: "504 gitUSDC", color: "text-yellow-600 dark:text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
                        { label: "Time limit", amt: "None", color: "text-red-500 dark:text-red-400 bg-red-400/10 border-red-400/20" },
                      ].map(p => (
                        <div key={p.label} className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${p.color}`}>
                          <span className="text-muted-foreground font-normal">{p.label}</span>
                          <span>{p.amt}</span>
                        </div>
                      ))}
                    </div>
                    <div className="w-8 h-8 rounded-full border border-red-500/30 flex items-center justify-center text-red-400 group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500 transition-all flex-shrink-0">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Classification Section */}
          <ClassificationSection onOpen={setModal} />

          {/* LIVE Features */}
          <section className="relative w-full min-h-screen flex items-center py-8 px-4 lg:px-8 bg-background overflow-hidden">
            <motion.div
              className="w-full max-w-[1400px] mx-auto border border-emerald-500/30 bg-card overflow-hidden"
              initial={{ opacity: 0, y: 380, scale: 0.76, borderRadius: 40 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, borderRadius: 16 }}
              viewport={{ once: false, amount: 0.04 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              style={{ boxShadow: "0 40px 120px rgba(16,185,129,0.08), 0 20px 60px rgba(0,0,0,0.18)" }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.03),transparent_70%)] pointer-events-none" />
              <div className="p-8 lg:p-12 flex flex-col gap-12 relative z-10">
                <div className="flex flex-col gap-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                    Active Systems
                  </h2>
                  <p className="text-muted-foreground font-mono text-sm">MODULES DEPLOYED ON BASE MAINNET</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {liveFeatures.map((f, i) => {
                    const inner = (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-md group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            {f.icon}
                          </div>
                          <div className="flex items-center gap-1.5">
                            {f.badge && (
                              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30 uppercase tracking-widest">{f.badge}</span>
                            )}
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 uppercase tracking-widest">LIVE</span>
                          </div>
                        </div>
                        <h3 className="font-bold text-foreground text-sm font-mono mt-2">{f.name}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                      </>
                    );
                    const cls = "flex flex-col gap-3 p-5 bg-background border border-emerald-500/40 hover:border-emerald-500/70 rounded-lg transition-all hover:shadow-[0_0_18px_rgba(16,185,129,0.12)] group cursor-pointer";
                    return f.external
                      ? <a key={i} href={f.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
                      : <Link key={i} href={f.href} className={cls}>{inner}</Link>;
                  })}
                </div>
              </div>
            </motion.div>
          </section>

          {/* Roadmap */}
          <section className="w-full py-24 px-6 lg:px-12 border-b border-border">
            <div className="max-w-[1400px] mx-auto flex flex-col gap-12">
              <div className="flex flex-col gap-3">
                <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Roadmap</p>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Coming Soon</h2>
                <p className="text-muted-foreground font-mono text-sm">UPCOMING PROTOCOL UPGRADES</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[
                  {
                    phase: "P1", title: "AI Agent Economy",
                    icon: <AiIcon />, accent: "#8b5cf6",
                    desc: "Coinbase AgentKit, Virtuals, agent-to-agent x402 payments, per-agent spending limits",
                    items: ["AgentKit integration", "Per-agent spending limits", "x402 agent auth", "Virtuals protocol"],
                  },
                  {
                    phase: "P2", title: "DeFi Yield Layer",
                    icon: <DefiIcon />, accent: "#3b82f6",
                    desc: "Morpho Blue, Moonwell, Aave V3, cbETH staking, Pendle yield tokenization, EigenLayer restaking",
                    items: ["Morpho Blue vaults", "cbETH staking", "Pendle yield", "EigenLayer restaking"],
                  },
                  {
                    phase: "P3", title: "Protocol SDK + gitNeo",
                    icon: <IssueOpsIcon />, accent: "hsl(var(--primary))",
                    desc: "@gitbank/sdk on npm, gitNeo virtual Mastercard, pay any service with crypto, team card issuance",
                    items: ["@gitbank/sdk npm", "gitNeo virtual card", "Crypto neobank layer", "Team card issuance"],
                  },
                  {
                    phase: "P4", title: "Advanced Trading",
                    icon: <RwaIcon />, accent: "#f59e0b",
                    desc: "Synthetix V3 perpetuals on Base, Lyra Finance options, long/short positions, DCA automation",
                    items: ["Synthetix V3 perps", "Lyra options", "DCA automation", "Stop-loss triggers"],
                  },
                  {
                    phase: "P5", title: "Token Economy",
                    icon: <DefiIcon />, accent: "#10b981",
                    desc: "Token launchpad flywheel, Ondo USDY, Backed bCSPX (tokenized S&P500), GITBANK staking tiers",
                    items: ["Ondo USDY", "Backed bCSPX", "GITBANK staking", "Launchpad flywheel"],
                  },
                  {
                    phase: "P6", title: "Privacy + Security",
                    icon: <PrivacyIcon />, accent: "#6366f1",
                    desc: "ZK private transfers on Base, GitHub Org multi-sig vaults, N-of-M maintainer approval",
                    items: ["ZK transfers", "Org multi-sig", "N-of-M approval", "Bug bounty escrow"],
                  },
                  {
                    phase: "P7", title: "GitScore + Financial OS",
                    icon: <SecurityIcon />, accent: "#ec4899",
                    desc: "Soul-bound contribution NFTs, reputational collateral, DAO payroll streaming, CCIP cross-chain",
                    items: ["Contribution NFTs", "Reputational collateral", "DAO payroll", "CCIP cross-chain"],
                  },
                ].map((p, i) => (
                  <div key={i} className="flex flex-col gap-4 p-5 bg-card border border-border/60 rounded-lg relative overflow-hidden group hover:border-border transition-all cursor-default">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{ background: `radial-gradient(ellipse at top left, ${p.accent}06 0%, transparent 60%)` }} />
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md flex-shrink-0" style={{ background: `${p.accent}15`, color: p.accent }}>
                        {p.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold tracking-widest uppercase font-mono" style={{ color: p.accent }}>{p.phase}</span>
                          <span className="text-[9px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase tracking-wide">PLANNED</span>
                        </div>
                        <h3 className="font-bold text-foreground text-sm font-mono">{p.title}</h3>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                    <ul className="grid grid-cols-2 gap-x-3 gap-y-1 pt-2 border-t border-border/40">
                      {p.items.map((item, j) => (
                        <li key={j} className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
                          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: `${p.accent}60` }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="w-full py-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
            <div className="flex flex-col gap-16">
              <div className="flex flex-col gap-4 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Execution Flow</h2>
                <p className="text-muted-foreground font-mono text-sm">FROM COMMENT TO ON-CHAIN SETTLEMENT IN SECONDS</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                <div className="absolute top-8 left-6 right-6 h-0.5 bg-border hidden md:block" />
                
                {[
                  { step: "01", title: "Install the GitHub App", desc: "One-click install. The bot joins your repositories and listens for commands." },
                  { step: "02", title: "Fund your vault", desc: "Deposit USDC or WETH. Our relayer deploys your smart contract vault automatically, zero gas." },
                  { step: "03", title: "Comment to command", desc: "@gitbankbot assign 500 USDC bounty #42 - parsed by Claude, confirmed, executed." },
                  { step: "04", title: "Settlement on Base", desc: "PR merges, webhook fires. Smart contract releases escrow to contributor. Receipt in thread in 2 seconds." }
                ].map((s, i) => (
                  <div key={i} className="flex flex-col gap-5 relative pt-4 md:pt-0">
                    <div className="w-16 h-16 rounded-xl bg-card border border-border flex items-center justify-center font-mono text-xl font-bold text-primary relative z-10 shadow-sm">
                      {s.step}
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-bold text-foreground text-lg">{s.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed font-mono opacity-80">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* AI Agent Ready */}
          <section className="w-full bg-card border-y border-border py-24 px-6 lg:px-12 relative">
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-16 items-center relative z-10">
              <div className="flex-1 flex flex-col gap-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit text-primary font-mono text-xs font-bold uppercase tracking-wider">
                  <Cpu size={14} /> Agent Ready
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-[1.1]">
                  Any GitHub identity can hold a vault.
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Human, bot, or AI agent - if it has a GitHub ID, it has a bank account on Base. We provide the missing financial primitives for autonomous systems.
                </p>
                
                <ul className="flex flex-col gap-4 font-mono text-sm text-muted-foreground mt-2">
                  <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-primary"/> x402 agent-to-agent HTTP payments</li>
                  <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-primary"/> MCP tool access for LLMs</li>
                  <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-primary"/> Soul-bound security (agents can't drain vaults)</li>
                  <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-primary"/> Per-agent spending limits <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded ml-2 border border-primary/20">PHASE 1</span></li>
                </ul>

                <div className="flex items-center gap-6 mt-6">
                  <img src="/logos/claude.png" alt="Claude" className="h-8 w-auto grayscale contrast-125 dark:[filter:invert(1)_hue-rotate(180deg)] opacity-70" />
                  <img src="/logos/cursor.png" alt="Cursor" className="h-8 w-auto grayscale contrast-125 opacity-70" />
                  <img src="/logos/grok.png" alt="Grok" className="h-8 w-auto grayscale contrast-125 opacity-70" />
                </div>
              </div>
              
              <div className="flex-1 w-full bg-background rounded-xl border border-border p-6 font-mono text-sm shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                <div className="flex items-center justify-between border-b border-border pb-4 mb-4 text-muted-foreground">
                  <span>agent_x402_auth.ts</span>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                </div>
                <pre className="text-muted-foreground whitespace-pre-wrap break-all leading-relaxed">
<span className="text-blue-400">const</span> response = <span className="text-blue-400">await</span> fetch(<span className="text-green-400">"https://api.gitbank.io/v1/agent/task"</span>, {'{'}
  headers: {'{'}
    <span className="text-green-400">"Authorization"</span>: <span className="text-green-400">"L402 ..."</span>,
    <span className="text-green-400">"X-Agent-ID"</span>: <span className="text-green-400">"github_938102"</span>
  {'}'}
{'}'});

<span className="text-muted-foreground">// No API keys. Just cryptographic signatures</span>
<span className="text-muted-foreground">// and on-chain settlement on Base.</span>
<span className="text-blue-400">if</span> (response.status === <span className="text-orange-400">402</span>) {'{'}
  <span className="text-blue-400">await</span> payInvoice(response.headers.get(<span className="text-green-400">"WWW-Authenticate"</span>));
{'}'}
                </pre>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="w-full bg-muted/10 border-y border-border py-24 px-6 lg:px-12 relative overflow-hidden">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-16 relative z-10">
              <div className="flex-1 flex flex-col gap-6 max-w-xl">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Institutional Security. <br/>Zero attack surface.</h2>
                <p className="text-lg text-muted-foreground">We re-engineered the smart contract wallet to remove the vulnerabilities that plague standard designs.</p>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-foreground font-bold font-mono text-sm">
                    <Fingerprint size={16} className="text-primary"/> Soul-bound
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">No transfer(), no approve(). Tokens are permanently locked to your identity. Zero attack surface for drainers.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-foreground font-bold font-mono text-sm">
                    <Shield size={16} className="text-primary"/> Dual-sig
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Owner + Relayer. Both signatures are cryptographically required to execute any state change.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-foreground font-bold font-mono text-sm">
                    <Github size={16} className="text-primary"/> Permanent ID
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Bound to your immutable GitHub integer ID. Cannot be spoofed, bypassed, or broken by username renames.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-foreground font-bold font-mono text-sm">
                    <ArrowRightLeft size={16} className="text-primary"/> 2-Step Transfer
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Commit-reveal architecture prevents front-running and MEV manipulation on vault-to-vault transfers.</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="w-full py-32 px-6 lg:px-12 flex flex-col items-center justify-center text-center max-w-[1400px] mx-auto relative">
            <div className="flex flex-col items-center gap-8 max-w-3xl relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-[1.1]">
                Deploy your vault. <br/>Zero gas.
              </h2>
              <p className="text-xl text-muted-foreground font-mono">
                Install the bot. The relayer handles the rest.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
                <Link href="/github-app" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold font-mono text-sm uppercase tracking-wide rounded-md hover:bg-primary/90 transition-all border border-primary-foreground/10 shadow-[0_0_30px_hsl(var(--primary)/0.4)] hover:scale-105 duration-300">
                  <Github size={18} /> Install the Bot
                </Link>
                <Link href="/docs" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-foreground font-bold font-mono text-sm uppercase tracking-wide rounded-md border border-border hover:bg-muted transition-all">
                  Read the docs
                </Link>
              </div>
            </div>
          </section>

          <Footer />
        </div>
      </main>
    </div>
  );
}
