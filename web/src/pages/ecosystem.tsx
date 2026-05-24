import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import PageWrapper from "@/components/layout/PageWrapper";
import DotGrid, { type PatternFn } from "@/components/DotGrid";
import { useListLaunchedTokens } from "@workspace/api-client-react";

// DApp: laptop — screen + hinge + keyboard base (relative coords)
const ringPat: PatternFn = (c, r, cols, rows) => {
  const sL = Math.round(cols * 0.14), sR = Math.round(cols * 0.86);
  const sT = 0, sB = Math.round(rows * 0.65);
  const mid = Math.round(cols / 2);
  const inScreen = c >= sL && c <= sR && r >= sT && r <= sB;
  const onEdge = c === sL || c === sR || r === sT || r === sB;
  if (inScreen && onEdge) return 3;
  if (r === sT && Math.abs(c - mid) < 1) return 3;
  if (inScreen && r >= 2 && r % 3 === 0 && c >= sL + 3 && c <= sR - 3) return 1;
  if (inScreen) return 0;
  const hingeR = Math.round(rows * 0.72);
  if (r === hingeR && c >= Math.round(cols * 0.28) && c <= Math.round(cols * 0.72)) return 2;
  const bL = Math.round(cols * 0.05), bR = Math.round(cols * 0.95);
  const bT = Math.round(rows * 0.78), bB = rows - 1;
  if (c >= bL && c <= bR && r >= bT && r <= bB) {
    if (c === bL || c === bR || r === bT || r === bB) return 3;
    if (r === Math.round((bT + bB) / 2) && (c - bL - 2) % 5 < 4) return 2;
    return 1;
  }
  return 0;
};

// CLI: rightward chevrons >>>
const wavePat: PatternFn = (c, r, _cols, rows) => {
  const cy = (rows - 1) / 2;
  const x = c - Math.abs(r - cy) * 1.4;
  const band = ((x % 16) + 16) % 16;
  if (band < 1.2) return 3;
  if (band < 3.2) return 2;
  if (band < 5.8) return 1;
  return 0;
};

// Bot: robot face — head, eyes, mouth with teeth, antenna (relative coords)
const nodePat: PatternFn = (c, r, cols, rows) => {
  const mid = cols / 2;
  // antenna
  if (Math.abs(c - mid) < 1 && r === 0) return 3;
  if (Math.abs(c - mid) <= 1 && r === 1) return 2;
  // head bounds
  const hL = Math.round(cols * 0.08), hR = Math.round(cols * 0.92);
  const hT = Math.round(rows * 0.08), hB = rows - 1;
  if (c < hL || c > hR || r < hT || r > hB) return 0;
  if (c === hL || c === hR || r === hT || r === hB) return 3;
  // eyes
  const eyeY = rows * 0.38, eyeR = Math.min(cols, rows) * 0.08;
  const le = Math.sqrt((c - cols * 0.3) ** 2 + (r - eyeY) ** 2);
  if (le < eyeR * 0.55) return 3;
  if (le < eyeR) return 2;
  const re = Math.sqrt((c - cols * 0.7) ** 2 + (r - eyeY) ** 2);
  if (re < eyeR * 0.55) return 3;
  if (re < eyeR) return 2;
  // mouth
  const mL = Math.round(cols * 0.22), mR = Math.round(cols * 0.78);
  const mT = Math.round(rows * 0.65), mB = Math.round(rows * 0.85);
  if (c >= mL && c <= mR && r >= mT && r <= mB) {
    if (c === mL || c === mR || r === mT || r === mB) return 3;
    return ((c - mL) % 5 < 3) ? 2 : 1;
  }
  return 1;
};

// GitHub App: folder + link/connect icon (relative coords)
const funnelPat: PatternFn = (c, r, cols, rows) => {
  const tL = Math.round(cols * 0.08), tR = Math.round(cols * 0.36);
  const tT = Math.round(rows * 0.07), tB = Math.round(rows * 0.22);
  if (c >= tL && c <= tR && r >= tT && r <= tB) {
    return (c === tL || c === tR || r === tT) ? 3 : 2;
  }
  const fL = Math.round(cols * 0.08), fR = Math.round(cols * 0.92);
  const fT = Math.round(rows * 0.22), fB = rows - 1;
  const inBody = c >= fL && c <= fR && r >= fT && r <= fB;
  if (inBody && (c === fL || c === fR || r === fT || r === fB)) return 3;
  if (!inBody) return 0;
  const nodeY = rows * 0.58, nodeR = Math.min(cols, rows) * 0.1;
  const ld = Math.sqrt((c - cols * 0.35) ** 2 + (r - nodeY) ** 2);
  if (ld < nodeR * 0.55) return 3;
  if (ld < nodeR) return 2;
  const rd = Math.sqrt((c - cols * 0.65) ** 2 + (r - nodeY) ** 2);
  if (rd < nodeR * 0.55) return 3;
  if (rd < nodeR) return 2;
  if (Math.abs(r - nodeY) < 1 && c > cols * 0.42 && c < cols * 0.58) return 3;
  return 1;
};

// Playground: starburst / radial spokes from center
const barsPat: PatternFn = (c, r, cols, rows) => {
  const cx = cols * 0.5, cy = rows * 0.5;
  const dx = c - cx, dy = r - cy;
  const angle = Math.atan2(dy, dx);
  const radius = Math.sqrt(dx * dx + dy * dy);
  if (radius < 1.5) return 3;
  const maxR = Math.sqrt(cx * cx + cy * cy);
  if (radius > maxR * 0.97) return 0;
  const spoke = Math.abs(Math.sin(angle * 8));
  const fade = 1 - radius / maxR;
  if (spoke > 0.93) return 3;
  if (spoke > 0.78 && fade > 0.08) return 2;
  if (spoke > 0.6 && fade > 0.18) return 1;
  return 0;
};

// SDK: two interlocking gears — 1 large (10 teeth) + 1 small (6 teeth)
const gridPat: PatternFn = (c, r, cols, rows) => {
  const TWO_PI = Math.PI * 2;
  const gearDot = (px: number, py: number, cx: number, cy: number, ri: number, ro: number, th: number, N: number): 0 | 1 | 2 | 3 => {
    const d = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);
    if (d > ro + th + 1) return 0;
    const a = Math.atan2(py - cy, px - cx);
    const seg = TWO_PI / N;
    const ta = ((a % seg) + seg) % seg;
    if (d < ri * 0.5) return 0;          // center hole
    if (d < ri) return 1;                 // inner rim
    if (d <= ro) return d > ro * 0.85 ? 2 : 1;  // body (outer ring brighter)
    if (d <= ro + th && ta < seg * 0.42) return 3; // tooth
    return 0;
  };
  // Large gear — left-center
  const cx1 = cols * 0.38, cy1 = rows * 0.46;
  const g1 = gearDot(c, r, cx1, cy1, rows * 0.10, rows * 0.21, rows * 0.057, 10);
  // Small gear — right, meshing with large
  const cx2 = cols * 0.65, cy2 = rows * 0.56;
  const g2 = gearDot(c, r, cx2, cy2, rows * 0.055, rows * 0.125, rows * 0.04, 6);
  return g1 || g2;
};

function SectionIllustration({ patternFn, label, children }: { patternFn: PatternFn; label?: string; children?: React.ReactNode }) {
  return (
    <div className="relative rounded-xl border border-border bg-muted/20 overflow-hidden">
      <DotGrid cols={60} rows={40} dotRadius={2} gap={2} patternFn={patternFn} stretch />
      {(label || children) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {label && (
            <span className="font-mono text-[13px] font-bold text-primary bg-background/85 backdrop-blur-sm border border-primary/25 px-3 py-1.5 rounded-full shadow-sm">
              {label}
            </span>
          )}
          {children}
        </div>
      )}
    </div>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-muted" />
        <div className="w-2 h-2 rounded-full bg-muted" />
        <div className="w-2 h-2 rounded-full bg-muted" />
        <span className="text-[11px] font-mono text-muted-foreground ml-1">{title}</span>
      </div>
      <pre className="text-[13px] font-mono text-foreground p-5 whitespace-pre-wrap leading-relaxed">{code}</pre>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block self-start text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-primary/30 text-primary bg-primary/5 mb-3">
      {children}
    </span>
  );
}

const dividerPats: PatternFn[] = [
  (c, r, cols, rows) => {
    const wave = Math.sin((c / cols) * Math.PI * 6 + (r / rows) * Math.PI);
    return wave > 0.55 ? 3 : wave > 0 ? 2 : wave > -0.4 ? 1 : 0;
  },
  (c, r, cols, rows) => {
    const seeds = [[0.1,0.5],[0.3,0.5],[0.5,0.5],[0.7,0.5],[0.9,0.5]];
    let best = 0;
    for (const [sx, sy] of seeds) {
      const d = Math.sqrt((c/cols-sx)**2 + (r/rows-sy)**2) * (cols/5);
      const v = Math.exp(-(d*d)/2);
      if (v > best) best = v;
    }
    return best > 0.82 ? 3 : best > 0.5 ? 2 : best > 0.15 ? 1 : 0;
  },
  (c, r, cols, rows) => {
    const cx = (cols-1)/2, cy = (rows-1)/2;
    const d = Math.sqrt((c-cx)**2 + (r-cy)**2);
    const maxD = Math.sqrt(cx*cx + cy*cy);
    const ring = d % (maxD/4);
    return ring < 0.7 ? 3 : ring < 1.5 ? 2 : 1;
  },
];

function SectionDivider({ idx = 0 }: { idx?: number }) {
  const pat = dividerPats[idx % dividerPats.length];
  return (
    <div className="relative my-14 overflow-hidden rounded-xl border border-border/50 bg-muted/15" style={{ height: 64 }}>
      <div className="absolute inset-0 opacity-60">
        <DotGrid cols={80} rows={8} dotRadius={2} gap={2.5} patternFn={pat} stretch />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80 pointer-events-none" />
    </div>
  );
}

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function EcosystemPage() {
  const [, navigate] = useLocation();

  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const HASH_MAP: Record<string, string> = {
      launchpad: "section-launchpad",
      bot: "section-bot",
      dapp: "section-dapp",
      community: "section-community",
      docs: "section-docs",
    };
    const targetId = HASH_MAP[hash] ?? `section-${hash}`;
    const el = document.getElementById(targetId);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, []);

  const cards = [
    {
      id: "dapp",
      tag: "DApp",
      title: "Web Dashboard",
      desc: "Onboard, monitor your vault, manage repos, and track every transaction from gitbank.io/app. Built for teams who want a visual overview without leaving the browser.",
      cta: "Open Dashboard",
      onCta: () => navigate("/app/onboarding"),
      patternFn: ringPat,
    },
    {
      id: "bot",
      tag: "GitHub Bot",
      title: "@gitbankbot",
      desc: "Mention the bot in any issue or PR to deposit, withdraw, swap, create projects, and assign bounties. AI-parsed, on-chain executed, zero gas for users.",
      cta: "How it works",
      onCta: () => scrollTo("section-bot"),
      patternFn: nodePat,
    },
    {
      id: "github-app",
      tag: "GitHub App",
      title: "Repo Connect",
      desc: "Install the Gitbank GitHub App to give the bot webhook access to your repositories. Granular per-repo permissions, instant setup, auto-payout on PR merge.",
      cta: "Install App",
      onCta: () => window.open("https://github.com/apps/gitbankbot/installations/new", "_blank"),
      patternFn: funnelPat,
    },
    {
      id: "playground",
      tag: "Playground",
      title: "Try it Live",
      desc: "A public GitHub repo where anyone can try bot commands without deploying a vault. Runs on Base Mainnet. No setup required.",
      cta: "Open Playground",
      onCta: () => window.open("https://github.com/gitbankio/playground/discussions/4", "_blank"),
      patternFn: barsPat,
    },
    {
      id: "cli",
      tag: "CLI",
      title: "Terminal",
      desc: "Run vault operations from your own terminal. Same commands as the bot. Install once, use from any machine. Scriptable and JSON-parseable.",
      cta: "View on npm",
      onCta: () => window.open("https://npmjs.com/package/gitbank", "_blank"),
      patternFn: wavePat,
    },
    {
      id: "sdk",
      tag: "SDK",
      title: "Developer SDK",
      desc: "Embed vault operations into TypeScript projects. Build AI agents, CI/CD pipelines, and automation scripts. Includes MCP tools for Claude and Cursor.",
      cta: "View on npm",
      onCta: () => window.open("https://npmjs.com/package/@gitbank-agent/sdk", "_blank"),
      patternFn: gridPat,
    },
    {
      id: "launchpad",
      tag: "Launchpad",
      title: "Token Launchpad",
      desc: "Deploy a token on Base Mainnet via a single GitHub comment. Clanker creates the Uniswap v4 LP. 80% of LP trading fees go to you automatically.",
      cta: "See launched tokens",
      onCta: () => scrollTo("section-launchpad"),
      patternFn: barsPat,
    },
  ];

  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Ecosystem</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Everything built around one vault
        </h1>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-10 max-w-[580px]">
          The Gitbank ecosystem is a set of interfaces built on top of the same smart contracts on Base. Every tool talks to the same vault, the same identity anchor, and the same on-chain settlement layer.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i, duration: 0.4 }}
              className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col group hover:border-primary/40 transition-colors duration-200"
            >
              {/* Interactive dot art */}
              <div className="relative overflow-hidden bg-muted/20" style={{ height: 140 }}>
                <div className="absolute inset-0">
                  <DotGrid cols={48} rows={14} dotRadius={2.2} gap={2.5} patternFn={card.patternFn} stretch />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/90 pointer-events-none" />
                <div className="absolute top-3 left-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-primary/35 text-primary bg-background/80 backdrop-blur-sm">
                    {card.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 px-5 pt-4 pb-5 gap-3">
                <p className="text-[17px] font-bold text-foreground leading-snug">{card.title}</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed flex-1">{card.desc}</p>
                <button
                  onClick={card.onCta}
                  className="mt-1 self-start text-[13px] font-semibold text-primary hover:text-primary/70 transition-colors flex items-center gap-1.5"
                >
                  {card.cta}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 6h7M6.5 3l3 3-3 3" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── DApp ──────────────────────────────────────────────────────── */}
        <section id="section-dapp" className="pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <Tag>DApp</Tag>
              <h2 className="text-2xl font-bold text-foreground mb-3 leading-tight">Web Dashboard</h2>
              <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">
                The Gitbank web app at <strong className="text-foreground">gitbank.io/app</strong> is your onboarding and monitoring hub. It handles vault deployment, connected repo management, and real-time balance tracking. All day-to-day operations still happen through the GitHub bot.
              </p>
              <div className="flex flex-col gap-3 mb-6">
                {[
                  { title: "Vault onboarding", desc: "Connect your GitHub account, deploy your GitVault on Base, and set a recovery address in under two minutes." },
                  { title: "Real-time balances", desc: "View gitWETH, gitUSDC, gitCBBTC and all other gitToken balances valued in USD using Chainlink price feeds." },
                  { title: "Transaction history", desc: "Every deposit, withdrawal, swap, and transfer is logged with tx hash and a direct link to Basescan." },
                  { title: "Connected repos", desc: "Install and remove the Gitbank bot from your repositories without leaving the dashboard." },
                  { title: "Project monitoring", desc: "See all active projects, budget allocation, task status, and contributor assignments across your repos." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3 rounded-lg border border-border bg-card px-4 py-3">
                    <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                    <div>
                      <p className="text-[13px] font-semibold text-foreground mb-0.5">{item.title}</p>
                      <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/app/onboarding")}
                className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Launch App
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <SectionIllustration patternFn={ringPat}>
                <div className="flex flex-col items-center gap-2">
                  <span className="font-mono text-[12px] font-bold text-primary bg-background/85 backdrop-blur-sm border border-primary/25 px-3 py-1.5 rounded-full">gitbank.io/app</span>
                  <span className="font-mono text-[11px] text-muted-foreground bg-background/75 border border-border px-2.5 py-1 rounded-full">onboarding + monitoring</span>
                </div>
              </SectionIllustration>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Vault", sub: "Deploy once" },
                  { label: "Balance", sub: "Live on-chain" },
                  { label: "Repos", sub: "Add or remove" },
                  { label: "History", sub: "Every tx" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-[14px] font-bold text-foreground">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SectionDivider idx={0} />

        {/* ── GitHub Bot ──────────────────────────────────────────────── */}
        <section id="section-bot" className="pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="lg:order-2">
              <Tag>Bot</Tag>
              <h2 className="text-2xl font-bold text-foreground mb-3 leading-tight">GitHub Bot (@gitbankbot)</h2>
              <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">
                The bot is the primary interface for all vault and project operations. Mention <code className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">@gitbankbot</code> in any issue or pull request comment. Claude Haiku parses your intent in any language, and the Relayer submits the transaction to Base. Gas is always covered.
              </p>
              <div className="flex flex-col gap-3 mb-6">
                {[
                  { cmd: "@gitbankbot deposit 10 USDC", desc: "Lock USDC into your vault. Receive gitUSDC." },
                  { cmd: "@gitbankbot withdraw 5 USDC to 0x...", desc: "Unlock and send underlying asset to any wallet." },
                  { cmd: "@gitbankbot swap 2 USDC to WETH", desc: "Swap inside the vault via Uniswap v3. Zero gas." },
                  { cmd: "@gitbankbot send 1 WETH to @alice", desc: "Two-step transfer to another user vault." },
                  { cmd: "@gitbankbot create project Sprint 1 with 500 USDC", desc: "Deploy a project workspace with locked budget." },
                  { cmd: "@gitbankbot assign this task to @alice with 80 USDC", desc: "Escrow bounty, release automatically on PR merge." },
                ].map((item) => (
                  <div key={item.cmd} className="rounded-lg border border-border bg-card px-4 py-3">
                    <code className="text-[11px] font-mono text-primary block mb-1">{item.cmd}</code>
                    <p className="text-[12px] text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:order-1 flex flex-col gap-4">
              <SectionIllustration patternFn={nodePat} />
              <CodeBlock
                title="GitHub Issue comment thread"
                code={`> @gitbankbot deposit 10 USDC

@gitbankbot replied:
gitShield complete. 10.00 gitUSDC minted.
Fee: 0.02 USDC (0.2%)
Tx: 0x4a1...9ef
basescan.org/tx/0x4a1...9ef`}
              />
            </div>
          </div>
        </section>

        <SectionDivider idx={1} />

        {/* ── GitHub App ──────────────────────────────────────────────── */}
        <section id="section-github-app" className="pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <Tag>GitHub App</Tag>
              <h2 className="text-2xl font-bold text-foreground mb-3 leading-tight">Connect Your Repositories</h2>
              <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">
                The Gitbank GitHub App gives <code className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">@gitbankbot</code> access to your repositories so it can receive webhook events for issue comments and pull request merges. Install it on any number of public or private repositories.
              </p>
              <div className="flex flex-col gap-3 mb-6">
                {[
                  { title: "Granular permissions", desc: "You choose which repos get access. Gitbank only requests read access to issues, pull requests, and repository metadata." },
                  { title: "Instant setup", desc: "Install in under 60 seconds from the dashboard or directly from github.com/apps/gitbankbot. No configuration file needed." },
                  { title: "Webhook verification", desc: "Every incoming event is verified with HMAC-SHA256 using your installation secret before any action is taken." },
                  { title: "Auto-payout on merge", desc: "When a linked pull request is merged, the bot detects the event and automatically releases the assigned bounty to the contributor vault." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3 rounded-lg border border-border bg-card px-4 py-3">
                    <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                    <div>
                      <p className="text-[13px] font-semibold text-foreground mb-0.5">{item.title}</p>
                      <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <a
                  href="https://github.com/apps/gitbankbot/installations/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-lg border border-primary/40 bg-primary/5 text-primary text-sm font-semibold hover:bg-primary/10 transition-colors"
                >
                  Install GitHub App
                </a>
                <button
                  onClick={() => navigate("/app/repos")}
                  className="px-5 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Manage Repos
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <SectionIllustration patternFn={funnelPat} label="github.com/apps/gitbankbot" />
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-[12px] font-bold text-foreground mb-3">Permissions requested</p>
                <div className="flex flex-col gap-2">
                  {[
                    ["Issues", "Read and write"],
                    ["Pull requests", "Read and write"],
                    ["Contents", "Read-only"],
                    ["Metadata", "Read-only"],
                    ["Webhooks", "Receive events"],
                  ].map(([perm, level]) => (
                    <div key={perm} className="flex justify-between text-[12px]">
                      <span className="text-muted-foreground">{perm}</span>
                      <span className="font-mono text-primary text-[11px]">{level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider idx={2} />

        {/* ── Playground ──────────────────────────────────────────────── */}
        <section id="section-playground" className="pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="lg:order-2">
              <Tag>Playground</Tag>
              <h2 className="text-2xl font-bold text-foreground mb-3 leading-tight">Try Gitbank Without a Vault</h2>
              <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">
                The Gitbank Playground is a public GitHub repository where anyone can try bot commands without deploying a vault. Post commands as discussion comments and the bot responds in real time on Base Mainnet.
              </p>
              <div className="flex flex-col gap-3 mb-6">
                {[
                  { title: "No setup required", desc: "No vault to deploy, no tokens to acquire. Just open a discussion thread and start typing commands." },
                  { title: "Live on Base Mainnet", desc: "All transactions in the playground run on Base Mainnet. Real contracts, real bot, real on-chain settlement." },
                  { title: "Full command support", desc: "Every bot command works in the playground including deposit, withdraw, swap, project creation, and bounty assignment." },
                  { title: "Open for everyone", desc: "Anyone with a GitHub account can post in the playground. Contributions and questions are also welcome." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3 rounded-lg border border-border bg-card px-4 py-3">
                    <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                    <div>
                      <p className="text-[13px] font-semibold text-foreground mb-0.5">{item.title}</p>
                      <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="https://github.com/gitbankio/playground/discussions/4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Open Playground
              </a>
            </div>
            <div className="lg:order-1 flex flex-col gap-4">
              <SectionIllustration patternFn={barsPat} />
              <CodeBlock
                title="gitbankio / playground / discussions"
                code={`# Try any command in the playground
@gitbankbot balance

@gitbankbot deposit 0.001 WETH

@gitbankbot swap 1 USDC to WETH

# Bot runs on Base Mainnet
# No vault or wallet needed`}
              />
            </div>
          </div>
        </section>

        <SectionDivider idx={0} />

        {/* ── CLI ─────────────────────────────────────────────────────── */}
        <section id="section-cli" className="pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* text → illustration → features+buttons — left */}
            <div className="flex flex-col gap-4">
              <div>
                <Tag>CLI</Tag>
                <h2 className="text-2xl font-bold text-foreground mb-3 leading-tight">Terminal</h2>
                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  Run vault operations directly from your own terminal. The <code className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">gitbank</code> CLI gives you the same commands as the GitHub bot, without needing to open a browser or create a GitHub issue. Install once, use from any machine.
                </p>
              </div>
              <SectionIllustration patternFn={wavePat} label="npm install -g gitbank" />
              <div className="flex flex-col gap-3">
                {[
                  { title: "Same commands as the bot", desc: "deposit, withdraw, swap, send, balance, project create, assign bounty. All commands match the bot syntax." },
                  { title: "GitHub OAuth login", desc: "Authenticate with your GitHub account. The CLI uses the same GitHub identity as your vault anchor." },
                  { title: "Scriptable", desc: "Pipe commands into shell scripts, CI workflows, or cron jobs. All output is JSON-parseable." },
                  { title: "Open source", desc: "MIT licensed. Source at github.com/gitbankio/gitbank-cli. Contributions welcome." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3 rounded-lg border border-border bg-card px-4 py-3">
                    <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                    <div>
                      <p className="text-[13px] font-semibold text-foreground mb-0.5">{item.title}</p>
                      <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <a href="https://npmjs.com/package/gitbank" target="_blank" rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                  View on npm
                </a>
                <a href="https://github.com/gitbankio/gitbank-cli" target="_blank" rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-semibold hover:bg-muted transition-colors">
                  Source on GitHub
                </a>
              </div>
            </div>
            {/* code + table — right */}
            <div className="flex flex-col gap-4">
              <CodeBlock
                title="terminal"
                code={`# Install globally
npm install -g gitbank

# Authenticate with GitHub
gitbank auth login

# Check your vault balance
gitbank balance

# Deposit tokens
gitbank deposit 10 USDC

# Swap inside the vault
gitbank swap 5 USDC to WETH

# Send to another user vault
gitbank send 1 WETH to @alice

# All commands (same as bot)
gitbank --help`}
              />
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="text-left px-4 py-2 font-semibold text-foreground">Command</th>
                      <th className="text-left px-4 py-2 font-semibold text-foreground">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["gitbank auth login", "Connect GitHub account"],
                      ["gitbank balance", "Show vault balances"],
                      ["gitbank deposit", "Lock tokens into vault"],
                      ["gitbank withdraw", "Withdraw to wallet address"],
                      ["gitbank swap", "Swap inside vault"],
                      ["gitbank send", "Transfer to another user"],
                      ["gitbank vault deploy", "Deploy vault if needed"],
                      ["gitbank vault key", "Export vault keypair"],
                    ].map(([cmd, desc], i) => (
                      <tr key={i} className="border-b border-border/50 last:border-0">
                        <td className="px-4 py-2 font-mono text-primary text-[11px]">{cmd}</td>
                        <td className="px-4 py-2 text-muted-foreground">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider idx={1} />

        {/* ── SDK ─────────────────────────────────────────────────────── */}
        <section id="section-sdk" className="pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* code + use-case cards — left */}
            <div className="flex flex-col gap-4">
              <CodeBlock
                title="TypeScript"
                code={`import { GitbankAgent } from "@gitbank-agent/sdk";

const agent = new GitbankAgent({
  githubToken: process.env.GITHUB_TOKEN,
});

// Check vault balance
const balance = await agent.balance();

// Deposit tokens
await agent.deposit({ amount: "10", token: "USDC" });

// Swap inside the vault
await agent.swap({
  from: "USDC",
  to: "WETH",
  amount: "5",
});

// Assign a bounty
await agent.assignBounty({
  repo: "acme-org/mobile-app",
  issue: 42,
  assignee: "alice",
  amount: "80",
  token: "USDC",
});`}
              />
              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: "AI Agent Wallet", desc: "Give your agent a self-funded vault for payments and bounties." },
                  { title: "CI/CD Auto-pay", desc: "Trigger bounty payouts when tests pass, no GitHub comment needed." },
                  { title: "Bounty Bot", desc: "Monitor repos and auto-assign bounties by your own scoring logic." },
                  { title: "Portfolio Dashboard", desc: "Pull live balances for multiple vaults into your own tooling." },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl border border-border bg-card p-4">
                    <p className="text-[13px] font-bold text-foreground mb-1">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* text → illustration → features+buttons — right */}
            <div className="flex flex-col gap-4">
              <div>
                <Tag>SDK</Tag>
                <h2 className="text-2xl font-bold text-foreground mb-3 leading-tight">Developer SDK</h2>
                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  Embed Gitbank into your own TypeScript or JavaScript project. Use the <code className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">@gitbank-agent/sdk</code> to build AI agents, automation scripts, CI/CD pipelines, or any tool that needs vault operations programmatically.
                </p>
              </div>
              <SectionIllustration patternFn={gridPat} label="npm install @gitbank-agent/sdk" />
              <div className="flex flex-col gap-3">
                {[
                  { title: "Full TypeScript support", desc: "Every method is typed end-to-end. IntelliSense works out of the box with zero extra config." },
                  { title: "MCP tools included", desc: "The SDK ships with Model Context Protocol tools. Expose vault operations directly to Claude, Cursor, or Windsurf as native AI tools." },
                  { title: "AI agent ready", desc: "Give your autonomous agent its own non-custodial vault. The agent deposits, swaps, and sends without any human in the loop." },
                  { title: "Same security model", desc: "The SDK uses the same GitHub identity anchor and soul-bound vault as the DApp and bot. An SDK-driven agent still cannot drain its own vault via EVM exploits." },
                  { title: "Open source", desc: "MIT licensed. Source at github.com/gitbankio/gitbank-sdk. Contributions welcome." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3 rounded-lg border border-border bg-card px-4 py-3">
                    <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                    <div>
                      <p className="text-[13px] font-semibold text-foreground mb-0.5">{item.title}</p>
                      <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <a href="https://npmjs.com/package/@gitbank-agent/sdk" target="_blank" rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                  View on npm
                </a>
                <a href="https://github.com/gitbankio/gitbank-sdk" target="_blank" rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-semibold hover:bg-muted transition-colors">
                  Source on GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider idx={2} />

        {/* ── Launchpad ───────────────────────────────────────────────── */}
        <LaunchpadSection />

      </motion.div>
    </PageWrapper>
  );
}

const TOKEN_GRADIENTS = [
  ["#6366f1","#8b5cf6"], // indigo → violet
  ["#3b82f6","#06b6d4"], // blue → cyan
  ["#10b981","#3b82f6"], // emerald → blue
  ["#f59e0b","#ef4444"], // amber → red
  ["#ec4899","#8b5cf6"], // pink → violet
  ["#14b8a6","#6366f1"], // teal → indigo
  ["#f97316","#eab308"], // orange → yellow
  ["#8b5cf6","#ec4899"], // violet → pink
  ["#06b6d4","#10b981"], // cyan → emerald
  ["#ef4444","#f97316"], // red → orange
];

function tokenGradient(symbol: string): string {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) hash = (hash * 31 + symbol.charCodeAt(i)) & 0xffffffff;
  const [a, b] = TOKEN_GRADIENTS[Math.abs(hash) % TOKEN_GRADIENTS.length];
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;
}

function useItemsPerPage() {
  const [items, setItems] = React.useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? 10 : 15
  );
  React.useEffect(() => {
    const handler = () => setItems(window.innerWidth < 768 ? 10 : 15);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return items;
}

function LaunchpadSection() {
  const { data: tokens, isLoading } = useListLaunchedTokens();
  const itemsPerPage = useItemsPerPage();
  const [page, setPage] = React.useState(1);

  const total = tokens?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
  const paged = tokens?.slice((page - 1) * itemsPerPage, page * itemsPerPage) ?? [];

  React.useEffect(() => { setPage(1); }, [itemsPerPage]);

  const truncateAddr = (addr: string) =>
    addr.length > 12 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const pageNumbers = () => {
    const pages: (number | "…")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("…");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <section id="section-launchpad" className="pb-16">
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Launchpad</p>
        <h2 className="text-2xl font-bold text-foreground mb-2 leading-tight">Tokens Launched via Gitbank</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed max-w-[580px]">
          Every token below was deployed on Base Mainnet via a single GitHub comment using the Gitbank bot and Clanker. LP trading fees go directly to the creator.
        </p>
      </div>

      {isLoading && (
        <div className="text-[13px] text-muted-foreground">Loading tokens...</div>
      )}

      {!isLoading && total === 0 && (
        <div className="rounded-xl border border-border bg-card px-6 py-8 text-center">
          <p className="text-[14px] font-semibold text-foreground mb-1">No tokens launched yet</p>
          <p className="text-[13px] text-muted-foreground mb-4">Be the first to launch a token via IssueOps.</p>
          <a
            href="https://github.com/gitbankio/playground/discussions/4"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Try in Playground
          </a>
        </div>
      )}

      {total > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paged.map((token, i) => (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.3 }}
                className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col hover:border-primary/40 transition-colors duration-200"
              >
                <div className="px-5 pt-5 pb-4 flex flex-col flex-1 gap-3">
                  {/* Header: logo + symbol + Base badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {token.imageUrl ? (
                        <img
                          src={token.imageUrl}
                          alt={token.tokenSymbol}
                          className="w-10 h-10 rounded-full object-cover shrink-0 border border-border"
                          onError={(e) => {
                            const img = e.currentTarget as HTMLImageElement;
                            img.style.display = "none";
                            const fb = img.nextElementSibling as HTMLElement | null;
                            if (fb) fb.style.removeProperty("display");
                          }}
                        />
                      ) : null}
                      <div
                        className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-[12px] font-bold text-white select-none"
                        style={{
                          display: token.imageUrl ? "none" : "flex",
                          background: tokenGradient(token.tokenSymbol),
                        }}
                      >
                        {token.tokenSymbol.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[18px] font-bold text-foreground leading-none">{token.tokenSymbol}</p>
                        <p className="text-[12px] text-muted-foreground mt-0.5">{token.tokenName}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-primary/30 text-primary bg-primary/5">
                      Base
                    </span>
                  </div>

                  {/* Meta rows */}
                  <div className="flex flex-col gap-1.5 text-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Contract</span>
                      <code className="font-mono text-foreground text-[11px]">{truncateAddr(token.contractAddress)}</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Launched by</span>
                      <a
                        href={`https://github.com/${token.deployerGithubLogin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        @{token.deployerGithubLogin}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="text-foreground">{formatDate(token.launchedAt)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">LP fees</span>
                      <span className="text-foreground font-medium">80% creator</span>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex gap-2 mt-auto pt-2 border-t border-border/50">
                    <a
                      href={token.githubCommentUrl ?? "https://github.com/gitbankio/playground/discussions/4"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-[12px] font-semibold px-3 py-1.5 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors"
                    >
                      GitHub
                    </a>
                    <a
                      href={`https://www.clanker.world/clanker/${token.contractAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-[12px] font-semibold px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
                    >
                      Clanker
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold border border-border bg-background text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>
              {pageNumbers().map((p, idx) =>
                p === "…" ? (
                  <span key={`ellipsis-${idx}`} className="px-1 text-[12px] text-muted-foreground select-none">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 rounded-lg text-[12px] font-semibold border transition-colors ${
                      page === p
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold border border-border bg-background text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <div className="mt-8 flex items-center gap-4">
        <a
          href="https://github.com/gitbankio/playground/discussions/4"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-lg border border-primary/40 bg-primary/5 text-primary text-sm font-semibold hover:bg-primary/10 transition-colors"
        >
          Launch your token
        </a>
        <p className="text-[12px] text-muted-foreground">
          One GitHub comment. Token live on Base in seconds.
        </p>
      </div>
    </section>
  );
}
