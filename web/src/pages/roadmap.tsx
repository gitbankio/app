import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import DotGrid, { type PatternFn } from "@/components/DotGrid";

const NODE_XS = [0.07, 0.22, 0.38, 0.54, 0.70, 0.86];
const BAR_H   = [1.0, 0.45, 0.65, 0.30, 0.58, 0.38];

const timelinePattern: PatternFn = (c, r, cols, rows) => {
  const trackR = (rows - 1) * 0.55;
  const nodes = NODE_XS.map(x => (cols - 1) * x);
  for (let i = 0; i < nodes.length; i++) {
    const d = Math.sqrt((c - nodes[i]) ** 2 + (r - trackR) ** 2);
    if (d < 2.0) return 3;
    if (d < 3.4) return 2;
  }
  if (Math.abs(r - trackR) <= 0.5) return 2;
  if (Math.abs(r - trackR) <= 1.5) return 1;
  for (let i = 0; i < nodes.length; i++) {
    const nx = nodes[i];
    const barTop = trackR - (rows - 1) * 0.42 * BAR_H[i];
    if (Math.abs(c - nx) <= 1.0 && r >= barTop && r < trackR - 3.5) {
      return i === 0 ? 3 : i % 2 === 0 ? 2 : 1;
    }
  }
  return 0;
};

const progressPattern = (fillRatio: number): PatternFn => (c, r, cols, rows) => {
  const filled = c < cols * fillRatio;
  const edge = Math.abs(c - cols * fillRatio) < 1.5;
  if (edge) return filled ? 3 : 0;
  if (filled) {
    const wave = Math.sin((c / cols) * Math.PI * 6 + r * 0.4);
    return wave > 0.3 ? 2 : 1;
  }
  return Math.random() > 0.85 ? 1 : 0;
};

const phaseDots = (active: boolean): PatternFn => (c, r, cols, rows) => {
  const cx = (cols - 1) / 2, cy = (rows - 1) / 2;
  const d = Math.sqrt((c - cx) ** 2 + (r - cy) ** 2);
  const maxD = Math.min(cx, cy) - 0.5;
  if (d > maxD) return 0;
  if (d > maxD - 1.2) return active ? 2 : 1;
  if (d < 1.5) return active ? 3 : 1;
  return active ? 1 : 0;
};

const progLive: PatternFn = () => 2;
const progInProgress = progressPattern(0.55);
const progPlanned    = progressPattern(0);
const dotLive        = phaseDots(true);
const dotInProgress  = phaseDots(true);
const dotPlanned     = phaseDots(false);

type Deliverable = { text: string; done: boolean };

const d = (text: string, done = true): Deliverable => ({ text, done });

const phases = [
  {
    phase: "Phase 1",
    title: "Smart contracts + Base Mainnet",
    status: "Live",
    pat: dotLive,
    prog: progLive,
    deliverables: [
      d("GitToken.sol: soul-bound ERC-20 with transfer and approve permanently disabled."),
      d("GitVault.sol: personal vault with gitShield, gitUnshield, gitSwap, initTransfer, finalizeTransfer, and emergencyWithdraw."),
      d("GitVaultFactory.sol: EIP-1167 minimal clone factory, one vault per GitHub User ID."),
      d("Project workspace layer on-chain: createProject, assignTaskBounty, executeBountyPayout, reclaimBounty."),
      d("Dual-sig scheme: every operation requires both execution keypair and short-lived relayer ECDSA signature."),
      d("Nonce-based replay protection on all state-changing calls."),
      d("Deployed and verified on Base Mainnet. Factory: 0xAA0a4ff46733EBaE8E658642A1314f18980fc77B."),
    ],
  },
  {
    phase: "Phase 2",
    title: "Backend + DApp vault",
    status: "Live",
    pat: dotLive,
    prog: progLive,
    deliverables: [
      d("PostgreSQL schema: users, vaults, transactions, projects, tasks, installations, command_log tables."),
      d("Key Engine: AES-256-GCM encrypted keypair storage with sub-200ms in-memory decryption window."),
      d("Vault API: REST endpoints for balance queries, vault status, and operation history."),
      d("GitHub OAuth integration for DApp user authentication."),
      d("Dashboard: real-time balances (gitWETH, gitUSDC, gitcbBTC), activity feed, and project overview."),
      d("Onboarding: vault deploy flow with GitHub OAuth and automatic keypair registration."),
      d("Connected Repos: install and manage bot repos directly from the DApp."),
    ],
  },
  {
    phase: "Phase 3",
    title: "GitHub bot + project workspaces",
    status: "In Progress",
    pat: dotInProgress,
    prog: progInProgress,
    deliverables: [
      d("GitHub App with webhook receiver and HMAC-SHA256 signature verification."),
      d("Claude Haiku NLP layer: intent classification for deposit, withdraw, swap, transfer, balance, help, and cancel."),
      d("Reply bot: posts receipts with Basescan links back to GitHub Issues, PRs, and Discussions."),
      d("Deposit poller: auto-shields incoming ERC-20 transfers within 15 seconds."),
      d("Relayer pattern: deployer wallet covers all gas, zero cost for users."),
      d("Project commands: create project, assign bounty, project status, cancel task and reclaim bounty.", false),
      d("PR merge webhook handler and automatic bounty payout to contributor vault.", false),
    ],
  },
  {
    phase: "Phase 4",
    title: "Gitbank Challenge",
    status: "Planned",
    pat: dotPlanned,
    prog: progPlanned,
    deliverables: [
      d("A public security challenge where anyone can attempt to break the vault on Base Mainnet.", false),
      d("A prize pool locked inside a live GitVault, open to the community.", false),
      d("All contract source code open on GitHub under Apache-2.0 for anyone to audit.", false),
      d("Full documentation of the security model, dual-sig scheme, and known attack surfaces.", false),
      d("Participants post attempts as GitHub issues, bot responds with on-chain results.", false),
      d("Verified exploit that drains the vault without the owner signing wins the prize.", false),
    ],
  },
  {
    phase: "Phase 5",
    title: "AI-Native finance",
    status: "Planned",
    pat: dotPlanned,
    prog: progPlanned,
    deliverables: [
      d("AI Agent API: headless REST and WebSocket interface for agents to deposit, withdraw, swap, and transfer without GitHub comments.", false),
      d("Agent Budget Caps: whitelist an agent address and set a maximum spend per session, enforced on-chain by the vault.", false),
      d("Gitbank Pay Links: shareable gitbank.io/pay/@username links that route to any contributor vault on Base.", false),
      d("GitFi: opt-in yield on idle USDC inside the vault via Aerodrome and Base lending protocols.", false),
      d("Clanker integration: deploy and fund a token directly from a GitHub issue via @gitbankbot.", false),
    ],
  },
  {
    phase: "Phase 6",
    title: "Open ecosystem",
    status: "Planned",
    pat: dotPlanned,
    prog: progPlanned,
    deliverables: [
      d("Public Bounty Board: open GitHub issues with attached bounties, discoverable at gitbank.io by any contributor.", false),
      d("Multi-sig Team Vault: shared vault for a GitHub org requiring N-of-M maintainer approval to execute any operation.", false),
      d("Cross-chain Bridge: move vault assets from Base to Arbitrum, Optimism, and other OP Stack chains.", false),
      d("External contributor registry: non-org contributors can receive bounty payouts via a verified GitHub identity.", false),
      d("DAO budget layer: on-chain voting for project budget allocation, integrated with GitHub Discussions.", false),
    ],
  },
];

export default function RoadmapPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        {/* HERO */}
        <div className="rounded-xl border border-border bg-muted/30 p-8 flex flex-col items-center mb-14">
          <DotGrid cols={72} rows={22} dotRadius={2.5} gap={2} patternFn={timelinePattern} />
          <div className="mt-7 text-center max-w-[640px]">
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Roadmap</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Live on mainnet. Here is what comes next.</h1>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              Smart contracts, backend, GitHub bot, and project workspaces are live on Base Mainnet. Phases 4 through 6 cover the security challenge, AI-native finance, and the open ecosystem.
            </p>
          </div>
        </div>

        {/* PHASE CARDS */}
        <div className="flex flex-col gap-5">
          {phases.map((item, i) => {
            const isLive       = item.status === "Live";
            const isInProgress = item.status === "In Progress";
            const badgeCls = isLive
              ? "bg-emerald-500/10 text-emerald-600"
              : isInProgress
                ? "bg-amber-500/10 text-amber-600"
                : "bg-muted text-muted-foreground";
            const bulletCls = isLive
              ? "text-emerald-500"
              : isInProgress
                ? "text-amber-500"
                : "text-primary";
            return (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-mono font-bold text-primary">{item.phase}</span>
                    <div>
                      <p className="text-[14px] font-semibold text-foreground">{item.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block opacity-70">
                      <DotGrid cols={16} rows={8} dotRadius={1.5} gap={2} patternFn={item.pat} />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${badgeCls}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="px-5 pt-4 pb-2">
                  <div className="rounded-lg overflow-hidden border border-border bg-muted/20">
                    <DotGrid cols={80} rows={4} dotRadius={1.5} gap={1} patternFn={item.prog} stretch />
                  </div>
                </div>
                <div className="px-5 pb-4 pt-2">
                  <ul className="flex flex-col gap-2">
                    {item.deliverables.map((del, j) => {
                      const itemDone = del.done;
                      const itemCls  = itemDone ? "text-emerald-500" : "text-amber-500";
                      return (
                        <li key={j} className="flex gap-3 text-[13px] text-muted-foreground leading-relaxed">
                          <span className={`mt-1 flex-shrink-0 ${itemCls}`}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              {itemDone
                                ? <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                : <circle cx="6" cy="6" r="2.5" fill="currentColor"/>
                              }
                            </svg>
                          </span>
                          {del.text}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </PageWrapper>
  );
}
