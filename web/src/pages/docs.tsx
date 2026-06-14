import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useParams } from "wouter";
import { useTheme } from "@/App";
import { Sun, Moon, ChevronRight, Menu, X } from "lucide-react";
import DotGrid, { type PatternFn } from "@/components/DotGrid";

// ── Flow diagram helpers ────────────────────────────────────────────────────

function FBox({ label, sub, accent = false, dim = false }: { label: string; sub?: string; accent?: boolean; dim?: boolean }) {
  return (
    <div className={`rounded-xl border px-4 py-2.5 text-center min-w-[120px] ${accent ? "bg-primary/10 border-primary/40" : dim ? "bg-muted/40 border-border/50" : "bg-card border-border"}`}>
      <p className={`text-[12px] font-semibold leading-tight ${accent ? "text-primary" : "text-foreground"}`}>{label}</p>
      {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

function FDown({ label = "" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center my-0.5">
      {label && <span className="text-[10px] text-muted-foreground/70 mb-0.5 whitespace-nowrap">{label}</span>}
      <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
        <line x1="7" y1="0" x2="7" y2="16" stroke="currentColor" strokeWidth="1.5" className="text-border"/>
        <polyline points="2,13 7,20 12,13" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" className="text-border"/>
      </svg>
    </div>
  );
}

function FRight({ label = "" }: { label?: string }) {
  return (
    <div className="flex items-center mx-1">
      {label && <span className="text-[10px] text-muted-foreground/70 mr-1 whitespace-nowrap">{label}</span>}
      <svg width="28" height="14" viewBox="0 0 28 14" fill="none">
        <line x1="0" y1="7" x2="21" y2="7" stroke="currentColor" strokeWidth="1.5" className="text-border"/>
        <polyline points="16,2 23,7 16,12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" className="text-border"/>
      </svg>
    </div>
  );
}

function FlowWrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-muted/20 p-6 my-0 overflow-x-auto ${className}`}>
      {children}
    </div>
  );
}

function TwoCol({ left, right, flip = false, gap = "gap-10" }: { left: React.ReactNode; right: React.ReactNode; flip?: boolean; gap?: string }) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 ${gap} items-start my-6`}>
      <div className={flip ? "lg:order-2" : "lg:order-1"}>{left}</div>
      <div className={flip ? "lg:order-1" : "lg:order-2"}>{right}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-bold text-foreground mt-0 mb-3 tracking-tight">{children}</h2>;
}

// ── Dot grid patterns ────────────────────────────────────────────────────────

const ringPat: PatternFn = (c, r, cols, rows) => {
  const cx = (cols-1)/2, cy = (rows-1)/2;
  const d = Math.sqrt((c-cx)**2 + (r-cy)**2);
  const maxD = Math.min(cx, cy) - 0.5;
  if (d > maxD) return 0;
  if (d > maxD-1) return 2;
  if (d < 1.2) return 3;
  const ring = d % (maxD/3);
  return ring < 0.8 ? 3 : ring < 1.5 ? 2 : 1;
};

const wavePat: PatternFn = (c, r, cols, rows) => {
  const wave = Math.sin((c/cols)*Math.PI*5 + (r/rows)*Math.PI*2);
  if (wave > 0.65) return 3;
  if (wave > 0.1) return 2;
  if (wave > -0.35) return 1;
  return 0;
};

const barsPat: PatternFn = (c, r, cols, rows) => {
  const H = [0.3,0.5,0.72,0.42,0.82,0.55,0.92,0.45,0.68,0.6];
  const bw = (cols-(H.length-1))/H.length;
  const bi = Math.floor(c/(bw+1));
  const bc = c%(bw+1);
  if (bc>=bw||bi>=H.length) return 0;
  const barTop = (rows-1)*(1-H[bi]);
  if (r<barTop) return 0;
  if (r<barTop+1.2) return 3;
  if (bc<1||bc>=bw-1) return 2;
  return 1;
};

const nodePat: PatternFn = (c, r, cols, rows) => {
  const seeds = [[0.18,0.3],[0.5,0.18],[0.82,0.38],[0.28,0.72],[0.72,0.68],[0.5,0.5]];
  let best = 0;
  for (const [sx,sy] of seeds) {
    const d = Math.sqrt((c/cols-sx)**2+(r/rows-sy)**2)*(cols/7);
    const v = Math.exp(-d*d/2);
    if (v>best) best=v;
  }
  return best>0.85?3:best>0.55?2:best>0.18?1:0;
};

const funnelPat: PatternFn = (c, r, cols, rows) => {
  const mid=(cols-1)/2, t=r/(rows-1);
  const halfW=((cols-1)/2)*(1-t*0.68);
  const dist=Math.abs(c-mid);
  if (dist>halfW) return 0;
  const edge=halfW-dist;
  if (edge<1.3) return 3;
  if (t>0.78) return 3;
  return 1;
};

// ── Sidebar definition ───────────────────────────────────────────────────────

const docsSidebar = [
  { group: "Introduction", items: [
    { id: "overview", label: "Overview" },
    { id: "how-it-works", label: "How It Works" },
    { id: "getting-started", label: "Getting Started" },
  ]},
  { group: "MCP Clients", items: [
    { id: "mcp-overview", label: "MCP Overview" },
    { id: "mcp-claude", label: "Claude Desktop" },
    { id: "mcp-cursor", label: "Cursor" },
    { id: "mcp-grok", label: "Grok" },
    { id: "mcp-base", label: "Base MCP (EIP-5792)" },
  ]},
  { group: "Vault", items: [
    { id: "gitlock", label: "gitShield" },
    { id: "gitunlock", label: "gitUnshield" },
    { id: "gitswap", label: "gitSwap" },
    { id: "transfer", label: "Transfer" },
  ]},
  { group: "Projects", items: [
    { id: "project-create", label: "Create a Project" },
    { id: "task-assign", label: "Assign Tasks & Bounties" },
    { id: "bounty-autopay", label: "Auto-Pay on PR Merge" },
    { id: "install-fee", label: "Install Fee & Treasury" },
  ]},
  { group: "Security", items: [
    { id: "identity-anchoring", label: "Identity Anchoring" },
    { id: "soul-bound-tokens", label: "Soul-Bound Tokens" },
    { id: "recovery", label: "Recovery" },
  ]},
  { group: "Fees", items: [
    { id: "fee-structure", label: "Fee Structure" },
    { id: "relayer", label: "Relayer" },
    { id: "fee-collector", label: "Fee Collector" },
  ]},
  { group: "Build with Gitbank", items: [
    { id: "agent-wallet", label: "AI Agent Wallet" },
    { id: "trading-bot", label: "Trading Bot Integration" },
    { id: "contract-reference", label: "Contract Reference" },
    { id: "agent-security", label: "Security for Agents" },
  ]},
  { group: "CLI and SDK", items: [
    { id: "cli-install", label: "CLI (gitbank)" },
    { id: "sdk-quickstart", label: "SDK (@gitbank-agent/sdk)" },
  ]},
  { group: "Reference", items: [
    { id: "glossary", label: "Glossary" },
    { id: "faq", label: "FAQ" },
  ]},
  { group: "Roadmap", items: [
    { id: "roadmap", label: "Overview" },
    { id: "roadmap-p1", label: "Phase 1: AI Agent Economy" },
    { id: "roadmap-p2", label: "Phase 2: DeFi Yield Layer" },
    { id: "roadmap-p3", label: "Phase 3: Protocol SDK + gitNeo" },
    { id: "roadmap-p4", label: "Phase 4: Advanced Trading" },
    { id: "roadmap-p5", label: "Phase 5: Token Economy" },
    { id: "roadmap-p6", label: "Phase 6: Privacy + Security" },
    { id: "roadmap-p7", label: "Phase 7: GitScore + Financial OS" },
  ]},
];

// ── Section content ──────────────────────────────────────────────────────────

const docContent: Record<string, { title: string; body: React.ReactNode }> = {

  overview: {
    title: "Gitbank Documentation",
    body: (
      <>
        <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 mb-6 flex items-start gap-3">
          <span className="text-[11px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-primary/40 text-primary bg-primary/10 flex-shrink-0 mt-0.5">Live</span>
          <p className="text-[13px] text-foreground leading-relaxed">
            Gitbank is deployed on <strong>Base Mainnet</strong>. Factory contract: <code className="font-mono text-[11px] bg-muted px-1 py-0.5 rounded">0xAA0a4ff46733EBaE8E658642A1314f18980fc77B</code>. Verified on Basescan with Apache 2.0 license. All bot commands execute on mainnet.
          </p>
        </div>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
          Gitbank is the secure on-chain bank inside your GitHub. It gives every user a personal vault on Base L2, lets teams run project workspaces and bounties entirely through issue comments, allows in-vault token swaps, and protects everything with soul-bound gitTokens that no AI agent, bot, or third party can drain. There is no wallet app to install, no seed phrase to manage, and no KYC.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {[
            { tag: "On-Chain Banking", title: "Personal vault on Base L2", desc: "Deposit WETH or USDC on Base Mainnet. Assets are minted 1:1 as soul-bound gitTokens and held in a smart contract anchored to your GitHub identity. No wallet app required.", section: "gitlock" },
            { tag: "IssueOps", title: "Projects, bounties, and auto-pay", desc: "Create project workspaces, assign bounties to contributors, and release payments automatically when a pull request merges. All from a GitHub issue comment.", section: "project-create" },
            { tag: "DeFi Swap", title: "Swap tokens inside your vault", desc: "Exchange gitTokens without leaving Gitbank. The underlying assets are routed through the best on-chain DEX and re-minted as the output gitToken in a single atomic transaction.", section: "gitswap" },
            { tag: "AI Security", title: "Bot-safe by design", desc: "gitTokens have no transfer or approve function. A compromised AI agent cannot drain your vault even with a valid signature. Soul-bound means no attack surface.", section: "soul-bound-tokens" },
          ].map((p) => (
            <div key={p.tag} className="rounded-xl border border-border bg-card p-5 flex flex-col gap-2">
              <span className="inline-block self-start text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-primary/30 text-primary bg-primary/5">{p.tag}</span>
              <p className="text-[14px] font-bold text-foreground leading-snug">{p.title}</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <TwoCol
          left={
            <div>
              <SectionLabel>How a command flows</SectionLabel>
              <p className="text-[13px] text-muted-foreground mb-4 leading-relaxed">Every Gitbank action follows the same authenticated pipeline: GitHub comment to on-chain execution. Five steps, roughly 2 to 3 seconds end-to-end on Base Mainnet. The user never touches a wallet, signs a transaction manually, or pays gas at any step.</p>
              <FlowWrap>
                <div className="flex flex-col items-center gap-0.5">
                  <FBox label="GitHub Issue Comment" sub="@gitbankbot deposit 0.01 WETH" />
                  <FDown label="HMAC-SHA256 webhook" />
                  <FBox label="Bot Service" sub="reads sender.id (permanent GitHub User ID)" />
                  <FDown label="comment text + User ID" />
                  <FBox label="Claude" sub="returns JSON intent with confidence score" />
                  <FDown label="confidence threshold check" />
                  <FBox label="Relayer" sub="sign intent + broadcast via deployer wallet" accent />
                  <FDown label="Base Mainnet tx, ~2s" />
                  <FBox label="GitVault smart contract" sub="executes on-chain, emits events" accent />
                  <FDown label="receipt posted" />
                  <FBox label="Bot replies to issue" sub="tx hash + basescan link + amounts" />
                </div>
              </FlowWrap>
            </div>
          }
          right={
            <div>
              <SectionLabel>Platform properties</SectionLabel>
              <div className="flex flex-col gap-3">
                {[
                  { title: "Identity-anchored", desc: "Every vault is permanently bound to a GitHub Permanent User ID, an immutable integer assigned at account creation. Renaming a GitHub username does not affect vault ownership." },
                  { title: "Soul-bound assets", desc: "gitTokens have no transfer or approve functions. Even a signed phishing transaction or a compromised AI agent cannot drain the vault through EVM-level exploits." },
                  { title: "IssueOps interface", desc: "All vault operations, project creation, bounty assignment, and swaps are triggered by @gitbankbot comments in GitHub issues or PRs. Any language accepted." },
                  { title: "Zero gas for users", desc: "The Gitbank deployer wallet pays all gas on Base Mainnet for every operation. Users never need to hold ETH." },
                  { title: "AI-agent ready", desc: "Humans, bots, and autonomous agents can all operate a vault. The vault is anchored to a GitHub identity, not to whether the operator is human." },
                  { title: "On-chain receipts", desc: "Every operation is recorded on Base Mainnet. The bot posts a receipt with transaction hash, block explorer link, amounts, and fee to the same GitHub issue." },
                  { title: "Auto-pay on merge", desc: "When a pull request merges, the bot automatically releases the assigned bounty to the contributor vault. No manual action needed." },
                  { title: "Non-custodial", desc: "Assets are held in the smart contract, not by Gitbank. The team cannot access or freeze user funds. An emergency exit is available after 6 months of vault inactivity." },
                ].map((item) => (
                  <div key={item.title} className="rounded-lg border border-border bg-card px-4 py-3">
                    <p className="text-[13px] font-semibold text-foreground mb-1 flex items-center gap-1">
                      <ChevronRight size={12} className="text-primary flex-shrink-0" />
                      {item.title}
                    </p>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          }
        />

        <h2 className="text-lg font-bold text-foreground mb-3">Supported assets</h2>
        <div className="rounded-xl border border-border overflow-hidden mb-3">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-muted/40"><th className="text-left px-4 py-2.5 font-semibold text-foreground">Asset</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">GitToken</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Contract (Base Mainnet)</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Status</th></tr></thead>
            <tbody>
              {[
                ["WETH","gitWETH","0x4200000000000000000000000000000000000006","Live"],
                ["USDC","gitUSDC","0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913","Live"],
              ].map(([a,g,addr,s],i)=>(
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 text-foreground font-medium">{a}</td>
                  <td className="px-4 py-2.5 font-mono text-primary text-[12px]">{g}</td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{addr}</td>
                  <td className="px-4 py-2.5 text-primary font-semibold text-[12px]">{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[12px] text-muted-foreground">Swap output is restricted to WETH and USDC only. This whitelist is enforced both on-chain in the GitVault contract and in the Relayer. Additional assets can be added via governance vote.</p>

        <h2 className="text-lg font-bold text-foreground mb-3 mt-8">7-phase roadmap</h2>
        <p className="text-[13px] text-muted-foreground mb-4 leading-relaxed">Gitbank ships in seven phases, each building directly on the previous one. All phases target Base Mainnet only.</p>
        <div className="flex flex-col gap-2">
          {[
            { phase: "0", title: "IssueOps Core (Live)", desc: "GitHub bot, GitVault, gitShield / gitUnshield / gitSwap, soul-bound gitTokens, MCP server (v0.2.0), bounty auto-pay on PR merge." },
            { phase: "1", title: "Agent Protocol", desc: "MCP expanded with per-agent spending limits, Eliza OS plugin, Coinbase AgentKit native integration, Virtuals support, x402 agent-to-agent payment." },
            { phase: "2", title: "DeFi Yield Layer", desc: "Idle vault balances earn yield on Morpho Blue, Moonwell, and Aave V3 while locked. Vault owners set a yield strategy; earnings compound automatically." },
            { phase: "3", title: "Token Launchpad", desc: "Launch ERC-20 tokens via Clanker directly from a vault. Pre-sell to community before launch. Already live as an MCP-exclusive tool." },
            { phase: "4", title: "Org Workspaces", desc: "Multi-sig project vaults, team billing, analytics dashboard, Jira/Linear sync. Subscription revenue model." },
            { phase: "5", title: "Cross-Chain", desc: "Vault bridging to other EVM chains via Chainlink CCIP. Start on Base, deploy anywhere." },
            { phase: "6", title: "Governance", desc: "$GITBANK token vote on protocol parameters: fee tiers, whitelisted assets, partner integrations." },
          ].map((item) => (
            <div key={item.phase} className="flex gap-4 rounded-lg border border-border bg-card px-4 py-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/30 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{item.phase}</div>
              <div>
                <p className="text-[13px] font-semibold text-foreground mb-0.5">{item.title}</p>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
  },

  "how-it-works": {
    title: "How It Works",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
          Every Gitbank operation follows the same authenticated pipeline. Understanding this pipeline explains both how to use the system and why it is safe. Claude parses the intent in any language, a confidence score gates execution, and the Relayer submits the transaction with the deployer wallet paying gas.
        </p>

        <TwoCol
          left={
            <div>
              <SectionLabel>The pipeline step by step</SectionLabel>
              <p className="text-[13px] text-muted-foreground mb-4 leading-relaxed">The bot reads <code className="font-mono text-[11px] bg-muted px-1 rounded">sender.id</code> from the GitHub webhook payload, not <code className="font-mono text-[11px] bg-muted px-1 rounded">sender.login</code>. This means renaming a GitHub account does not change which vault is affected. The ID is permanent and immutable.</p>
              <FlowWrap>
                <div className="flex flex-col items-center gap-0.5">
                  <FBox label="Step 1: GitHub Issue Comment" sub="@gitbankbot swap 1 WETH to USDC" />
                  <FDown label="HMAC-SHA256 webhook verification" />
                  <FBox label="Step 2: Bot Service" sub="reads sender.id (permanent User ID, not login)" />
                  <FDown label="comment text + GitHub User ID sent to Claude" />
                  <FBox label="Step 3: Claude" sub="returns structured JSON intent + confidence" />
                  <FDown label="confidence threshold gate" />
                  <div className="w-full mt-1">
                    <p className="text-[10px] text-center text-muted-foreground mb-2 font-medium">Three outcomes based on confidence score</p>
                    <div className="flex items-start gap-2 flex-wrap justify-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted-foreground font-mono px-1.5 py-0.5 rounded bg-muted">below 0.70</span>
                        <FBox label="Clarify" sub="bot asks follow-up question" dim />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted-foreground font-mono px-1.5 py-0.5 rounded bg-muted">0.70 to 0.84</span>
                        <FBox label="Confirm" sub="bot asks: did you mean?" dim />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-primary font-mono px-1.5 py-0.5 rounded bg-primary/10">0.85 and above</span>
                        <FBox label="Execute" sub="Relayer broadcasts tx" accent />
                      </div>
                    </div>
                  </div>
                  <FDown label="Base Mainnet confirms in ~2s" />
                  <FBox label="Step 4: Bot posts receipt" sub="tx hash + amounts + fee + basescan link" accent />
                </div>
              </FlowWrap>
            </div>
          }
          right={
            <div className="space-y-6">
              <div>
                <SectionLabel>Claude intent JSON format</SectionLabel>
                <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">Claude receives the raw comment text plus the sender GitHub User ID and returns a structured JSON object. The bot rejects any response where confidence is below 0.70 and asks the user to rephrase.</p>
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-muted"/><div className="w-2 h-2 rounded-full bg-muted"/><div className="w-2 h-2 rounded-full bg-muted"/>
                    <span className="text-[11px] font-mono text-muted-foreground ml-1">claude response</span>
                  </div>
                  <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`{
  "intent": "gitSwap",
  "token_in": "WETH",
  "token_out": "USDC",
  "amount": "1.0",
  "recipient": null,
  "confidence": 0.97
}`}</pre>
                </div>
              </div>

              <div>
                <SectionLabel>Supported intents</SectionLabel>
                <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">These are all the operation types Claude can extract from a comment. If Claude cannot map the comment to any of these intents with sufficient confidence, it asks for clarification rather than guessing.</p>
                <div className="grid grid-cols-2 gap-2">
                  {["deposit","withdraw","swap","transfer","balance_check","project_create","task_assign","bounty_reclaim","budget_swap","status","help","cancel","confirm"].map((i)=>(
                    <div key={i} className="rounded-lg bg-muted/50 border border-border px-3 py-2 font-mono text-[12px] text-foreground">{i}</div>
                  ))}
                </div>
              </div>

              <div>
                <SectionLabel>What the receipt contains</SectionLabel>
                <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">After the Relayer broadcasts the transaction, the bot waits for on-chain confirmation (approximately 2 seconds on Base Mainnet) then posts a reply to the same issue:</p>
                <div className="flex flex-col gap-2">
                  {[
                    ["Operation type", "gitShield, gitUnshield, gitSwap, transfer, etc."],
                    ["Amounts", "Input amount, fee deducted, net output"],
                    ["Protocol fee", "Exact amount paid to feeCollector"],
                    ["Tx hash", "Clickable link to basescan.org"],
                    ["Network", "Base Mainnet (chainId 8453)"],
                    ["Gas", "Covered by Gitbank Relayer"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-3 rounded-lg border border-border bg-card px-3 py-2">
                      <span className="text-[12px] font-semibold text-primary w-28 flex-shrink-0">{k}</span>
                      <span className="text-[12px] text-muted-foreground">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }
        />
      </>
    ),
  },

  "getting-started": {
    title: "Getting Started",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
          Getting started with Gitbank takes about two minutes. You need a GitHub account and tokens on Base Mainnet. No wallet app to install, no seed phrase, no KYC. You can onboard entirely via the bot without ever opening the web dashboard, or use the dashboard for a guided experience. All day-to-day operations happen through GitHub issue comments.
        </p>

        <div className="rounded-xl border border-border bg-card px-4 py-3 mb-6 flex items-start gap-3">
          <span className="text-[11px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-border text-muted-foreground bg-muted flex-shrink-0 mt-0.5">Tip</span>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Bot-first onboarding:</strong> If you already have the bot installed in a repo, just mention <code className="font-mono text-[11px] bg-muted px-1 rounded">@gitbankbot balance</code> in any issue. The bot automatically deploys your vault on Base Mainnet (deployer pays gas) and replies with your new vault address. No dashboard visit required. Prefer AI clients (Claude Desktop, Cursor)? Add the MCP server at <code className="font-mono text-[11px] bg-muted px-1 rounded">https://gitbank.io/api/mcp</code> and skip GitHub entirely.
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <DotGrid cols={42} rows={12} dotRadius={2} gap={2} patternFn={funnelPat} />
        </div>

        <h2 className="text-lg font-bold text-foreground mb-4">Setup steps</h2>
        {[
          {
            step: "1",
            title: "Install the Gitbank bot",
            desc: "Go to gitbank.io and click Sign in with GitHub, then open the Repos page and click Add Repos. You will be redirected to the GitHub App installation page where you select which repositories the bot should access. GitHub redirects you back once done. Alternatively, visit github.com/apps/gitbankbot and install directly from GitHub. Prefer an AI client? Skip this step and connect directly via MCP.",
          },
          {
            step: "2",
            title: "Deploy your vault (bot or dashboard)",
            desc: "Your vault is created automatically the first time you use any bot command in an installed repo. Just comment @gitbankbot balance and the bot generates your keypair, deploys a GitVault smart contract on Base Mainnet bound to your GitHub User ID, and replies with your vault address. Gas is covered by the Gitbank deployer wallet. You can also trigger this from the dashboard by clicking Deploy Vault after signing in. If using MCP, connect your AI client to https://gitbank.io/api/mcp and the vault is deployed on your first write tool call.",
          },
          {
            step: "3",
            title: "Fund your vault",
            desc: "Send WETH or USDC on Base Mainnet to your vault address. Once the deposit confirms on Base (typically 2 seconds) the assets are locked in your vault. All subsequent operations (deposit, withdraw, swap, send, create project, assign bounty) happen by mentioning @gitbankbot in any issue or PR comment in your connected repos, or via the MCP client of your choice.",
          },
        ].map((item) => (
          <div key={item.step} className="flex gap-4 mb-5">
            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{item.step}</div>
            <div><p className="text-[14px] font-semibold text-foreground mb-1">{item.title}</p><p className="text-[13px] text-muted-foreground leading-relaxed">{item.desc}</p></div>
          </div>
        ))}

        <hr className="border-border my-6" />

        <h2 className="text-lg font-bold text-foreground mb-3">Where things live</h2>
        <div className="rounded-xl border border-border overflow-hidden mb-6">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Action</th>
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Where</th>
            </tr></thead>
            <tbody>
              {[
                ["Install bot and connect repos", "gitbank.io Repos page or github.com/apps/gitbankbot"],
                ["Deploy vault (auto)", "First bot command in any connected repo"],
                ["Deploy vault (manual)", "gitbank.io dashboard after signing in"],
                ["Deposit, withdraw, swap, send", "GitHub issue/PR comment or MCP client (Claude, Cursor, Grok)"],
                ["Create project, assign bounty", "GitHub issue or PR comment"],
                ["Auto-payout on PR merge", "Automatic - no action required"],
                ["Monitor balances and history", "gitbank.io dashboard or MCP client"],
                ["MCP vault control (AI clients)", "https://gitbank.io/api/mcp"],
              ].map(([action, where], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 text-foreground">{action}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">First bot session</h2>
        <p className="text-[13px] text-muted-foreground mb-3">After your vault is deployed and at least one repo is connected, open any issue in that repo and try these commands:</p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted"/><div className="w-2 h-2 rounded-full bg-muted"/><div className="w-2 h-2 rounded-full bg-muted"/>
            <span className="text-[11px] font-mono text-muted-foreground ml-1">github.com / your-org / your-repo / issues / 1</span>
          </div>
          <div className="p-5 space-y-4 font-mono text-[13px]">
            {[
              { cmd: "@gitbankbot balance", reply: "gitWETH: 0.05 | gitUSDC: 49.95 | Dashboard: https://gitbank.io/app/dashboard" },
              { cmd: "@gitbankbot deposit 0.01 WETH", reply: "Locked 0.01 WETH. Minted 0.00999 gitWETH (fee: 0.00001 WETH). Tx: 0x...f4a1 - basescan.org" },
              { cmd: "@gitbankbot swap 0.01 WETH to USDC", reply: "Swapped 0.01 gitWETH for 23.41 gitUSDC via Uniswap v3. Tx: 0x...c9d2 - basescan.org" },
              { cmd: "@gitbankbot send 10 USDC to @alice", reply: "Transfer initiated. 10 gitUSDC sent to @alice vault. Tx: 0x...8b3f - basescan.org" },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex gap-3"><span className="text-muted-foreground">{">"}</span><span className="text-foreground">{item.cmd}</span></div>
                <div className="ml-6 text-primary pl-3 border-l-2 border-primary/30">{item.reply}</div>
              </div>
            ))}
          </div>
        </div>
      </>
    ),
  },

  "mcp-overview": {
    title: "MCP Overview",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">
          Gitbank exposes a Model Context Protocol (MCP) server that lets any compatible AI client control your vault through natural language. One URL, no API key, no custom integration code. Works with Claude Desktop, Cursor, Grok, Windsurf, VS Code, and any other MCP-compatible client.
        </p>

        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 mb-6 flex items-start gap-3">
          <span className="text-[11px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-primary/40 text-primary bg-primary/10 flex-shrink-0 mt-0.5">Live</span>
          <div>
            <p className="text-[13px] font-semibold text-foreground mb-1">MCP server is live on mainnet</p>
            <p className="text-[12px] text-muted-foreground">Endpoint: <code className="font-mono text-[11px] bg-muted px-1 rounded">https://gitbank.io/api/mcp</code>. Protocol version: MCP 2025-03-26. Transport: StreamableHTTP (POST) for calls, SSE (GET) for streaming results. No registration required.</p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Quick test with curl</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted"/><div className="w-2 h-2 rounded-full bg-muted"/><div className="w-2 h-2 rounded-full bg-muted"/>
            <span className="text-[11px] font-mono text-muted-foreground ml-1">terminal</span>
          </div>
          <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`# List all available MCP tools
curl -X POST https://gitbank.io/api/mcp \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json, text/event-stream" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'

# Get vault balance by GitHub username
curl -X POST https://gitbank.io/api/mcp \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json, text/event-stream" \\
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_vault_balance","arguments":{"github_username":"alice"}}}'`}</pre>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">2-step confirm flow (write operations)</h2>
        <FlowWrap>
          <div className="flex flex-col items-center gap-0.5">
            <FBox label="AI Client calls write tool" sub="e.g. request_swap(github_username, amount, ...)" />
            <FDown label="MCP protocol (SSE or stdio)" />
            <FBox label="Gitbank MCP Server" sub="stages command, returns confirm_code" accent />
            <FDown label="confirm_code returned to AI client" />
            <FBox label="User / Bot posts on GitHub" sub="@gitbankbot confirm &lt;confirm_code&gt;" />
            <FDown label="GitHub webhook (HMAC-SHA256 verified)" />
            <FBox label="Gitbank Relayer" sub="verifies GitHub identity, builds calldata, signs" accent />
            <FDown label="broadcast via deployer wallet" />
            <FBox label="Base Mainnet GitVault" sub="state confirmed on-chain in ~2s" accent />
          </div>
        </FlowWrap>
        <p className="text-[12px] text-muted-foreground mt-3 mb-6 leading-relaxed">Read-only tools (<code className="font-mono text-[10px] bg-muted px-0.5 rounded">get_vault_balance</code>, <code className="font-mono text-[10px] bg-muted px-0.5 rounded">get_transactions</code>, <code className="font-mono text-[10px] bg-muted px-0.5 rounded">get_project_status</code>, <code className="font-mono text-[10px] bg-muted px-0.5 rounded">list_repos</code>, <code className="font-mono text-[10px] bg-muted px-0.5 rounded">check_pending</code>) return data immediately with no confirmation step.</p>

        <h2 className="text-lg font-bold text-foreground mb-3">Available tools</h2>
        <div className="rounded-xl border border-border overflow-hidden mb-6">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Tool</th>
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">What it does</th>
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Status</th>
            </tr></thead>
            <tbody>
              {[
                ["get_vault_balance","Get WETH and USDC locked balance + vault address for a GitHub username","Live / Read"],
                ["get_transactions","Paginated on-chain transaction history for a vault (deposits, withdrawals, swaps)","Live / Read"],
                ["get_project_status","Budget and task status for a project: total, spent, remaining, all bounties","Live / Read"],
                ["list_repos","List GitHub repos where the Gitbank bot is installed for a user","Live / Read"],
                ["request_deposit","Deposit WETH or USDC into the vault; returns confirm_code","Live / Write"],
                ["request_withdraw","Withdraw from vault to a destination address; returns confirm_code","Live / Write"],
                ["request_swap","Swap WETH to USDC or USDC to WETH inside vault; returns confirm_code","Live / Write"],
                ["request_transfer","Transfer to another GitHub user's vault (2-step); returns confirm_code","Live / Write"],
                ["request_assign_bounty","Lock a bounty to a GitHub issue; auto-pays on PR merge; returns confirm_code","Live / Write"],
                ["request_launch_token","Stage a Clanker token launch (MCP-exclusive); returns confirm_code","Live / Write"],
                ["check_pending","Poll status of a staged command by confirm_code","Live / Read"],
              ].map(([tool, desc, status], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 font-mono text-primary text-[11px]">{tool}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{desc}</td>
                  <td className={`px-4 py-2.5 text-[11px] font-semibold ${status.startsWith("Live") ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Supported clients</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[
            { name: "Claude Desktop", status: "Supported", note: "claude_desktop_config.json" },
            { name: "Cursor", status: "Supported", note: ".cursor/mcp.json" },
            { name: "Grok", status: "Supported", note: "Tools panel" },
            { name: "Windsurf", status: "Supported", note: "MCP settings" },
            { name: "VS Code (Copilot)", status: "Supported", note: ".vscode/mcp.json" },
            { name: "Base MCP", status: "Live", note: "EIP-5792 mode" },
          ].map((c) => (
            <div key={c.name} className="rounded-xl border border-border bg-card px-4 py-3">
              <p className="text-[13px] font-semibold text-foreground mb-0.5">{c.name}</p>
              <p className="text-[11px] font-mono text-muted-foreground">{c.note}</p>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">MCP vs GitHub bot</h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Property</th>
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">GitHub Bot</th>
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">MCP Server</th>
            </tr></thead>
            <tbody>
              {[
                ["Interface","@gitbankbot comment in Issue/PR","AI client (Claude, Cursor, Grok)"],
                ["Auth","GitHub webhook HMAC + sender.id","GitHub OAuth session"],
                ["NLP processing","Claude parses comment","AI client native, structured tool call"],
                ["Requires GitHub repo","Yes","No"],
                ["Receipt","Posted to GitHub issue thread","Returned as tool response"],
                ["Use case","Project management, bounties, team ops","Developer tooling, AI agents, IDE workflows"],
              ].map(([p, bot, mcp], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 font-semibold text-foreground">{p}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{bot}</td>
                  <td className="px-4 py-2.5 text-primary">{mcp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },

  "mcp-claude": {
    title: "Claude Desktop",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">
          Connect Gitbank to Claude Desktop in one step. After connecting, tell Claude what you want to do and it calls the right vault tool automatically. No command syntax to memorize.
        </p>

        <h2 className="text-lg font-bold text-foreground mb-3">Add to claude_desktop_config.json</h2>
        <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">
          The config file lives at <code className="font-mono text-[11px] bg-muted px-1 rounded">~/Library/Application Support/Claude/claude_desktop_config.json</code> on macOS and <code className="font-mono text-[11px] bg-muted px-1 rounded">%APPDATA%\Claude\claude_desktop_config.json</code> on Windows. Requires Claude Desktop v0.10 or later.
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted"/><div className="w-2 h-2 rounded-full bg-muted"/><div className="w-2 h-2 rounded-full bg-muted"/>
            <span className="text-[11px] font-mono text-muted-foreground ml-1">claude_desktop_config.json</span>
          </div>
          <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`{
  "mcpServers": {
    "gitbank": {
      "type": "sse",
      "url": "https://gitbank.io/api/mcp"
    }
  }
}`}</pre>
        </div>

        <p className="text-[13px] text-muted-foreground mb-5 leading-relaxed">
          Restart Claude Desktop after saving. On next launch, Claude will show a tool icon for Gitbank. If you see a connection error, verify your internet connection and that the URL resolves to <code className="font-mono text-[11px] bg-muted px-1 rounded">https://gitbank.io/api/mcp</code>.
        </p>

        <h2 className="text-lg font-bold text-foreground mb-3">Example prompts</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="px-4 py-2.5 border-b border-border bg-muted/40">
            <span className="text-[11px] font-mono text-muted-foreground">Claude Desktop chat</span>
          </div>
          <div className="p-5 space-y-4 font-mono text-[13px]">
            {[
              { user: "What's my current vault balance?", ai: "Your vault holds 0.025 gitWETH and 41.50 gitUSDC. Vault address: 0x70Bf...7495" },
              { user: "Swap 20 USDC to WETH inside my vault", ai: "Swapped 20 gitUSDC to 0.00872 gitWETH via Uniswap v3. Fee: 0.006 USDC. Tx: 0x...f4a2" },
              { user: "Send 0.01 WETH to @alice on GitHub", ai: "Transfer initiated. 0.01 gitWETH sent to @alice vault (0x4a3B...). Tx: 0x...9c1e" },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex gap-3">
                  <span className="text-muted-foreground text-[11px] w-5 flex-shrink-0 mt-0.5">You</span>
                  <span className="text-foreground">{item.user}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary text-[11px] w-5 flex-shrink-0 mt-0.5">AI</span>
                  <span className="text-muted-foreground">{item.ai}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Auth note:</strong> On first use, Claude will prompt you to authorize via GitHub OAuth. This links your GitHub identity to the MCP session so vault operations are attributed to the correct GitHub User ID.
          </p>
        </div>
      </>
    ),
  },

  "mcp-cursor": {
    title: "Cursor",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">
          Add Gitbank to Cursor and manage your vault without leaving your IDE. Check balances, fund bounties, and pay contributors while staying in your coding context.
        </p>

        <h2 className="text-lg font-bold text-foreground mb-3">Add via .cursor/mcp.json</h2>
        <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">
          Place this file in your project root at <code className="font-mono text-[11px] bg-muted px-1 rounded">.cursor/mcp.json</code>. Cursor loads it automatically when you open the project. You can also add it globally via <strong className="text-foreground">Cursor Settings &gt; Features &gt; MCP Servers</strong>.
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted"/><div className="w-2 h-2 rounded-full bg-muted"/><div className="w-2 h-2 rounded-full bg-muted"/>
            <span className="text-[11px] font-mono text-muted-foreground ml-1">.cursor/mcp.json</span>
          </div>
          <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`{
  "mcpServers": {
    "gitbank": {
      "type": "sse",
      "url": "https://gitbank.io/api/mcp"
    }
  }
}`}</pre>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Verify connection</h2>
        <div className="flex flex-col gap-3 mb-6">
          {[
            { step: "1", title: "Open Cursor Chat (Cmd+L)", desc: "Switch to Agent mode using the mode selector at the bottom of the chat panel." },
            { step: "2", title: "Check available tools", desc: 'Type "What Gitbank tools do you have?" and Cursor will list all 10 available vault tools.' },
            { step: "3", title: "Run a balance check", desc: 'Ask "What is my Gitbank vault balance?" to confirm auth and connectivity.' },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 rounded-lg border border-border bg-card px-4 py-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">{item.step}</div>
              <div><p className="text-[13px] font-semibold text-foreground mb-0.5">{item.title}</p><p className="text-[12px] text-muted-foreground">{item.desc}</p></div>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Cursor-specific workflow</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border bg-muted/40">
            <span className="text-[11px] font-mono text-muted-foreground">Cursor Agent chat</span>
          </div>
          <div className="p-5 space-y-3 text-[13px]">
            <div className="flex gap-2">
              <span className="text-muted-foreground text-[11px] w-5 flex-shrink-0 mt-0.5">You</span>
              <span className="text-foreground font-mono">Assign a 50 USDC bounty on issue #42 to the contributor who closes it</span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary text-[11px] w-5 flex-shrink-0 mt-0.5">AI</span>
              <span className="text-muted-foreground">Calling request_assign_bounty with repo=org/repo, issue=42, amount=50, token=USDC, contributor=alice... Staged. Returns confirm_code. Post @gitbankbot confirm &lt;code&gt; on GitHub to execute. When a PR merges and closes issue #42, the payout triggers automatically.</span>
            </div>
          </div>
        </div>
      </>
    ),
  },

  "mcp-grok": {
    title: "Grok",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">
          Gitbank MCP integration for Grok is in early access. There is no official plugin store listing yet. You connect the MCP server manually by configuring the Gitbank endpoint in your Grok API settings or system prompt. Once connected, Grok can call all 10 vault tools through natural language.
        </p>

        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 mb-6 flex items-start gap-3">
          <span className="text-[11px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-border text-muted-foreground bg-muted flex-shrink-0 mt-0.5">Early Access</span>
          <p className="text-[13px] text-muted-foreground leading-relaxed">Grok MCP support is in early access. The setup below uses manual configuration. An official Grok plugin listing is planned once Grok opens its plugin catalog to third-party MCP servers.</p>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Setup steps (manual config)</h2>
        <div className="flex flex-col gap-3 mb-6">
          {[
            { step: "1", title: "Open Grok API settings", desc: "Go to x.ai/grok or use the Grok API. In the system prompt or tool configuration, you will add the Gitbank MCP server URL." },
            { step: "2", title: "Add MCP endpoint to system prompt", desc: 'Include the Gitbank MCP URL (https://gitbank.io/api/mcp) in your Grok session config or system prompt as an available tool source. See the Grok developer docs for the exact format.' },
            { step: "3", title: "Authorize via GitHub OAuth", desc: "On the first tool call that requires vault access, Grok prompts you to authorize with your GitHub account. This links your GitHub User ID to the session." },
            { step: "4", title: "Use vault tools in conversation", desc: "Ask Grok about your balance, request a swap, or assign a bounty. Grok calls the MCP tools automatically." },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 rounded-lg border border-border bg-card px-4 py-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">{item.step}</div>
              <div><p className="text-[13px] font-semibold text-foreground mb-0.5">{item.title}</p><p className="text-[12px] text-muted-foreground">{item.desc}</p></div>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Example session</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="px-4 py-2.5 border-b border-border bg-muted/40">
            <span className="text-[11px] font-mono text-muted-foreground">Grok conversation</span>
          </div>
          <div className="p-5 space-y-4 text-[13px]">
            {[
              { user: "Show me my Gitbank vault balance", grok: "Your vault (0x70Bf...7495) holds: 0.025 gitWETH and 41.50 gitUSDC. Total value approx $96.30 at current prices." },
              { user: "Swap all USDC to WETH", grok: "Swapping 41.50 gitUSDC to WETH via Uniswap v3. Received 0.01802 gitWETH (after 0.30% fee). Tx confirmed: 0x...4c91 on Base Mainnet." },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex gap-3">
                  <span className="text-muted-foreground text-[11px] w-10 flex-shrink-0 mt-0.5">You</span>
                  <span className="text-foreground">{item.user}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary text-[11px] w-10 flex-shrink-0 mt-0.5">Grok</span>
                  <span className="text-muted-foreground">{item.grok}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Demo video:</strong> A full Grok + Gitbank demo is available at <a href="https://gitbank.io/grok" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">gitbank.io/grok</a>. The demo shows a vault balance check, a swap, and a bounty assignment all executed from a single Grok conversation.
          </p>
        </div>
      </>
    ),
  },

  "mcp-base": {
    title: "Base MCP (EIP-5792)",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">
          Base MCP is a second operating mode for the Gitbank MCP server. Instead of routing through the Gitbank Relayer, it uses EIP-5792 <code className="font-mono text-[11px] bg-muted px-1 rounded">wallet_sendCalls</code> to submit transactions directly from your connected wallet (Coinbase Wallet, Smart Wallet). The Relayer is not involved. You sign and broadcast yourself.
        </p>

        <h2 className="text-lg font-bold text-foreground mb-3">Standard MCP vs Base MCP</h2>
        <div className="rounded-xl border border-border overflow-hidden mb-6">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Property</th>
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Standard MCP</th>
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Base MCP (EIP-5792)</th>
            </tr></thead>
            <tbody>
              {[
                ["Auth","GitHub OAuth session","Wallet connect (Coinbase Wallet)"],
                ["Tx submission","Gitbank deployer wallet","Your wallet via wallet_sendCalls"],
                ["Relayer required","Yes","No"],
                ["Gas paid by","Gitbank deployer","Your wallet (or Paymaster)"],
                ["Requires GitHub account","Yes","No"],
                ["Batch calls","No","Yes (EIP-5792 batch)"],
                ["Smart Wallet support","No","Yes (Coinbase Smart Wallet)"],
              ].map(([p, s, b], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 font-semibold text-foreground">{p}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{s}</td>
                  <td className="px-4 py-2.5 text-primary font-medium">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">How EIP-5792 send_calls works</h2>
        <FlowWrap>
          <div className="flex flex-col items-center gap-0.5">
            <FBox label="AI Client sends tool call" sub="request_deposit, request_swap, etc." />
            <FDown label="Base MCP mode active" />
            <FBox label="MCP server prepares call batch" sub="encodes calldata for wallet_sendCalls" accent />
            <FDown label="returned to AI client as unsigned payload" />
            <FBox label="User confirms in Coinbase Wallet" sub="sees decoded calls before signing" />
            <FDown label="wallet_sendCalls submitted" />
            <FBox label="Base Mainnet confirms" sub="chainId 8453, ~2s block time" accent />
          </div>
        </FlowWrap>

        <h2 className="text-lg font-bold text-foreground mb-3">Connect to Base MCP</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-5">
          <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted"/><div className="w-2 h-2 rounded-full bg-muted"/><div className="w-2 h-2 rounded-full bg-muted"/>
            <span className="text-[11px] font-mono text-muted-foreground ml-1">MCP config</span>
          </div>
          <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`{
  "mcpServers": {
    "gitbank-base": {
      "type": "sse",
      "url": "https://gitbank.io/api/mcp?mode=base"
    }
  }
}`}</pre>
        </div>

        <p className="text-[13px] text-muted-foreground mb-5 leading-relaxed">
          Add <code className="font-mono text-[11px] bg-muted px-1 rounded">?mode=base</code> to the MCP URL to activate Base MCP mode. The server returns EIP-5792 call batches instead of executing transactions directly. Your wallet client handles signing and submission.
        </p>

        <h2 className="text-lg font-bold text-foreground mb-3">EIP-5792 protocol fields</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="px-4 py-2 border-b border-border bg-muted/40"><span className="text-[11px] font-mono text-muted-foreground">wallet_sendCalls request (EIP-5792)</span></div>
          <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`{
  "method": "wallet_sendCalls",
  "params": [{
    "version": "1.0",
    "chainId": "0x2105",           // 8453 = Base Mainnet
    "from": "0xYourWalletAddress",
    "calls": [                     // atomicBatch: all succeed or all revert
      {
        "to": "0xVaultAddress",
        "data": "0x...",           // gitShield calldata
        "value": "0x0"
      },
      {
        "to": "0xVaultAddress",
        "data": "0x...",           // gitSwap calldata (batched)
        "value": "0x0"
      }
    ],
    "capabilities": {             // EIP-5792 capabilities
      "paymasterService": {       // optional: sponsor gas via Paymaster
        "url": "https://paymaster.coinbase.com"
      },
      "atomicBatch": {            // all calls are atomic (succeed or revert together)
        "supported": true
      }
    }
  }]
}`}</pre>
        </div>

        <p className="text-[13px] text-muted-foreground mb-5 leading-relaxed">
          The <code className="font-mono text-[11px] bg-muted px-1 rounded">calls</code> array is an <strong className="text-foreground">atomicBatch</strong>: all calls execute atomically in a single transaction. If any call reverts, the entire batch reverts. The <code className="font-mono text-[11px] bg-muted px-1 rounded">capabilities</code> field declares optional features the wallet supports, such as <code className="font-mono text-[11px] bg-muted px-1 rounded">paymasterService</code> for gas sponsorship and <code className="font-mono text-[11px] bg-muted px-1 rounded">atomicBatch</code> for multi-call atomicity.
        </p>

        <h2 className="text-lg font-bold text-foreground mb-3">When to use Base MCP</h2>
        <div className="flex flex-col gap-3">
          {[
            { title: "You prefer self-custody signing", desc: "You want every transaction to go through your own wallet signature. The Relayer never touches your keys in this mode." },
            { title: "You are building an agent without GitHub", desc: "Base MCP does not require a GitHub account or webhook. Any entity with a Coinbase Wallet can operate a vault." },
            { title: "You want Paymaster gas sponsorship", desc: "Coinbase Smart Wallet supports EIP-5792 capabilities.paymasterService. Configure a Paymaster URL to cover gas costs without needing ETH in your wallet." },
            { title: "You want to batch multiple calls atomically", desc: "EIP-5792 atomicBatch lets you deposit, swap, and assign a bounty in a single atomic transaction. If any step fails, the entire batch reverts." },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 rounded-lg border border-border bg-card px-4 py-3">
              <ChevronRight size={14} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-semibold text-foreground mb-0.5">{item.title}</p>
                <p className="text-[12px] text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
  },

  gitlock: {
    title: "gitShield",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">gitShield is the deposit operation. You send a real ERC-20 token (WETH or USDC) to your vault address on Base Mainnet. The contract deducts the 0.10% protocol fee and mints the net amount as soul-bound GitTokens locked inside your vault. The underlying asset cannot leave until you call gitUnshield.</p>

        <TwoCol
          left={
            <div>
              <SectionLabel>On-chain execution flow</SectionLabel>
              <p className="text-[13px] text-muted-foreground mb-4 leading-relaxed">The deposit is detected automatically. You do not need to send a bot command to trigger a deposit. Sending tokens to your vault address is enough. The bot detects the ERC-20 transfer event on Base Mainnet and processes it.</p>
              <FlowWrap>
                <div className="flex flex-col items-center gap-0.5">
                  <FBox label="You send WETH or USDC to vault address" sub="standard on-chain ERC-20 transfer" />
                  <FDown label="bot detects transfer event on Base" />
                  <FBox label="Signature validation" sub="deadline check, nonce match, relayer auth" />
                  <FDown />
                  <FBox label="Fee deduction" sub="fee = max(amount x 0.10%, $0.10 minimum)" />
                  <FDown label="fee forwarded to feeCollector instantly" />
                  <FBox label="GitToken minted 1:1 into vault" sub="net amount after fee, soul-bound" accent />
                  <FDown />
                  <FBox label="Events emitted on Base Mainnet" sub="FeePaid and Locked events" />
                  <FDown />
                  <FBox label="Bot replies to issue with receipt" sub="tx hash + new balance + basescan link" />
                </div>
              </FlowWrap>
            </div>
          }
          right={
            <div className="space-y-6">
              <div>
                <SectionLabel>Function signature</SectionLabel>
                <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">The relayer calls this on your behalf. You never sign or submit the transaction directly. The nonce must match the current vault nonce or the transaction reverts, preventing replay attacks.</p>
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="px-4 py-2 border-b border-border bg-muted/40"><span className="text-[11px] font-mono text-muted-foreground">GitVault.sol</span></div>
                  <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`function gitShield(
  address tokenAddress,   // ERC-20 contract address (WETH or USDC)
  uint256 amount,         // gross amount including fee
  uint256 expectedNonce,  // must equal current vault nonce
  uint256 deadline,       // Unix timestamp, must be > block.timestamp
  bytes calldata ownerSig,   // ECDSA sig from owner keypair
  bytes calldata relayerSig  // short-lived sig from Gitbank relayer
) external nonReentrant`}</pre>
                </div>
              </div>

              <div>
                <SectionLabel>Fee examples</SectionLabel>
                <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">The fee is 0.10% of the deposit amount with a $0.10 minimum. For small deposits under $50, the minimum fee applies. For large deposits the percentage fee applies. The fee is deducted from your input, not added on top.</p>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-[13px]">
                    <thead><tr className="border-b border-border bg-muted/40"><th className="text-left px-4 py-2.5 font-semibold text-foreground">You send</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Fee</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Minted</th></tr></thead>
                    <tbody>
                      {[["20 USDC","$0.10 min","19.90 gitUSDC"],["100 USDC","0.10 USDC","99.90 gitUSDC"],["0.02 WETH","0.000020 WETH","0.019980 gitWETH"],["0.5 WETH","0.000500 WETH","0.499500 gitWETH"]].map(([a,f,m],i)=>(
                        <tr key={i} className="border-b border-border/50 last:border-0"><td className="px-4 py-2.5 text-foreground">{a}</td><td className="px-4 py-2.5 text-primary font-medium">{f}</td><td className="px-4 py-2.5 text-muted-foreground font-mono text-[11px]">{m}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <SectionLabel>Trigger phrases (any language)</SectionLabel>
                <div className="rounded-xl border border-border bg-card p-4 font-mono text-[12px] space-y-2">
                  {[{l:"EN",c:"@gitbankbot deposit 0.02 WETH"},{l:"EN",c:"@gitbankbot lock 50 USDC into my vault"},{l:"ID",c:"@gitbankbot setor 50 USDC"},{l:"JA",c:"@gitbankbot 0.02 WETHを入金する"},{l:"ZH",c:"@gitbankbot 存入 0.02 WETH"},{l:"RU",c:"@gitbankbot внести 0.02 WETH"}].map(({l,c})=>(<div key={c} className="flex items-center gap-2"><span className="text-[10px] font-mono font-semibold text-muted-foreground/50 w-6 flex-shrink-0">{l}</span><p className="text-foreground">{c}</p></div>))}
                </div>
              </div>
            </div>
          }
        />
      </>
    ),
  },

  gitunlock: {
    title: "gitUnshield",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">gitUnshield is the withdrawal operation. It burns GitTokens from your vault and releases the equivalent underlying ERC-20 to any wallet address you specify. Every withdrawal requires both your vault's owner keypair and a fresh short-lived relayer signature, so even a leaked keypair cannot drain the vault without the relayer's authorization.</p>

        <TwoCol
          left={
            <div>
              <SectionLabel>Execution flow</SectionLabel>
              <p className="text-[13px] text-muted-foreground mb-4 leading-relaxed">The destination address is cryptographically bound inside the owner signature at the moment the bot generates the transaction. This means neither the Gitbank server nor any interceptor can change where the funds go after you send the command.</p>
              <FlowWrap>
                <div className="flex flex-col items-center gap-0.5">
                  <FBox label="You comment in GitHub issue" sub="@gitbankbot withdraw 50 USDC to 0x1234..." />
                  <FDown label="Claude extracts intent, confidence check" />
                  <FBox label="Relayer builds calldata" sub="destination address bound in owner signature" />
                  <FDown label="dual-sig: owner keypair + relayer auth" />
                  <FBox label="Signature validation on-chain" sub="deadline, nonce, both sigs verified" />
                  <FDown />
                  <FBox label="Fee deducted from input" sub="fee = max(amount x 0.10%, $0.10)" />
                  <FDown label="fee forwarded to feeCollector" />
                  <FBox label="GitToken burned from vault" sub="soul-bound position removed" />
                  <FDown />
                  <FBox label="Underlying ERC-20 released" sub="sent to destination address on Base" accent />
                  <FDown />
                  <FBox label="Bot replies with receipt" sub="tx hash + net received + remaining balance" />
                </div>
              </FlowWrap>
            </div>
          }
          right={
            <div className="space-y-6">
              <div>
                <SectionLabel>Function signature</SectionLabel>
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="px-4 py-2 border-b border-border bg-muted/40"><span className="text-[11px] font-mono text-muted-foreground">GitVault.sol</span></div>
                  <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`function gitUnshield(
  address tokenAddress,   // WETH or USDC to release
  uint256 amount,         // GitToken amount to burn (fee deducted from output)
  address destination,    // any wallet on Base Mainnet (bound in ownerSig)
  uint256 expectedNonce,  // must equal current vault nonce
  uint256 deadline,       // Unix timestamp, must be > block.timestamp
  bytes calldata ownerSig,   // ECDSA sig from owner keypair (includes destination)
  bytes calldata relayerSig  // short-lived sig from Gitbank relayer
) external nonReentrant`}</pre>
                </div>
              </div>

              <div>
                <SectionLabel>Important rules</SectionLabel>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Destination", desc: "Any wallet address on Base Mainnet. Example: @gitbankbot withdraw 50 USDC to 0x1234.... If omitted, defaults to vault owner address. The destination is locked inside the owner signature and cannot be changed by the server." },
                    { label: "Fee from input", desc: "The 0.10% fee is deducted from the amount you specify. If you say withdraw 50 USDC, you pay a fee on 50 USDC and receive the net amount." },
                    { label: "Minimum fee", desc: "$0.10 minimum. For withdrawals under $50, the minimum fee applies instead of the percentage." },
                    { label: "Nonce protection", desc: "The nonce increments after every operation. Two simultaneous withdrawal commands will fail on the second one." },
                    { label: "Dual-sig required", desc: "Execution requires both the vault owner keypair and a fresh relayer signature. A stolen owner keypair alone is not enough to drain the vault." },
                  ].map((row) => (
                    <div key={row.label} className="flex gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
                      <p className="text-[12px] font-semibold text-primary w-32 flex-shrink-0">{row.label}</p>
                      <p className="text-[12px] text-muted-foreground leading-relaxed">{row.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <SectionLabel>Trigger phrases</SectionLabel>
                <div className="rounded-xl border border-border bg-card p-4 font-mono text-[12px] space-y-2">
                  {[{l:"EN",c:"@gitbankbot withdraw 0.5 WETH"},{l:"EN",c:"@gitbankbot withdraw 50 USDC to 0x1234..."},{l:"ID",c:"@gitbankbot tarik 0.5 WETH"},{l:"JA",c:"@gitbankbot 0.5 WETHを出金する"},{l:"ZH",c:"@gitbankbot 提取 0.5 WETH"},{l:"RU",c:"@gitbankbot вывести 0.5 WETH"}].map(({l,c})=>(<div key={c} className="flex items-center gap-2"><span className="text-[10px] font-mono font-semibold text-muted-foreground/50 w-6 flex-shrink-0">{l}</span><p className="text-foreground">{c}</p></div>))}
                </div>
              </div>
            </div>
          }
        />
      </>
    ),
  },

  gitswap: {
    title: "gitSwap",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">gitSwap exchanges one GitToken for another inside your vault in a single atomic transaction. The input GitToken is burned, the underlying asset is routed through Uniswap v3 on Base Mainnet, and the output GitToken is minted. You never hold the intermediate asset. The swap output is restricted to WETH or USDC by both the smart contract and the relayer.</p>

        <TwoCol
          left={
            <div>
              <SectionLabel>Swap execution flow</SectionLabel>
              <p className="text-[13px] text-muted-foreground mb-4 leading-relaxed">The swap is atomic. Either the full swap succeeds and the output gitToken is minted, or the entire transaction reverts and your vault is unchanged. There is no partial execution.</p>
              <FlowWrap>
                <div className="flex flex-col items-center gap-0.5">
                  <FBox label="You comment in GitHub issue" sub="@gitbankbot swap 0.5 WETH to USDC" />
                  <FDown label="Claude extracts intent, confidence check" />
                  <FBox label="Relayer calculates minOut" sub="applies slippage tolerance, builds calldata" />
                  <FDown label="0.30% fee deducted from amountIn" />
                  <FBox label="gitSwap called on GitVault" sub="input gitToken burned atomically" />
                  <FDown label="underlying WETH sent to SwapRouter02" />
                  <FBox label="Uniswap v3 SwapRouter02" sub="0x2626...e481 on Base Mainnet" accent />
                  <FDown label="USDC output returned to vault" />
                  <FBox label="Output whitelist check" sub="must be WETH or USDC, enforced on-chain" accent />
                  <FDown label="minOut enforced, reverts if slippage too high" />
                  <FBox label="Output gitToken minted into vault" sub="gitUSDC minted 1:1 to USDC received" accent />
                  <FDown />
                  <FBox label="Bot replies with receipt" sub="rate achieved + amounts + tx hash" />
                </div>
              </FlowWrap>
            </div>
          }
          right={
            <div className="space-y-6">
              <div>
                <SectionLabel>Function signature</SectionLabel>
                <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">The <code className="font-mono text-[11px] bg-muted px-1 rounded">minOut</code> parameter is calculated by the relayer based on current market price plus a slippage tolerance. If the DEX returns less than minOut, the transaction reverts and your vault is unchanged.</p>
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="px-4 py-2 border-b border-border bg-muted/40"><span className="text-[11px] font-mono text-muted-foreground">GitVault.sol</span></div>
                  <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`function gitSwap(
  address tokenIn,        // WETH or USDC to sell
  address tokenOut,       // WETH or USDC to buy (on-chain whitelist enforced)
  uint256 amountIn,       // gross amount (0.30% fee deducted before swap)
  uint256 minAmountOut,   // minimum DEX output; reverts if slippage too high
  address dexRouter,      // Uniswap v3 SwapRouter02 address (set by relayer)
  bytes calldata routerData, // ABI-encoded swap calldata (built by relayer)
  uint256 expectedNonce,  // must equal current vault nonce
  uint256 deadline,       // Unix timestamp, must be > block.timestamp
  bytes calldata ownerSig,   // ECDSA sig from owner keypair
  bytes calldata relayerSig  // short-lived sig from Gitbank relayer
) external nonReentrant`}</pre>
                </div>
              </div>

              <div>
                <SectionLabel>MEV protection</SectionLabel>
                <p className="text-[13px] text-muted-foreground leading-relaxed">All gitSwap transactions are broadcast via Flashbots Protect RPC, bypassing the public mempool entirely. This blocks sandwich attacks where a MEV bot front-runs your swap to worsen your price and then back-runs it to pocket the difference. Even without Flashbots, the <code className="font-mono text-[11px] bg-muted px-1 rounded">minOut</code> floor means slippage beyond your tolerance always causes a revert rather than a bad fill.</p>
              </div>

              <div>
                <SectionLabel>Output whitelist</SectionLabel>
                <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">The smart contract rejects any swap where the output token is not on the whitelist. This is enforced both in the relayer before the transaction is built and in the Solidity contract at execution time.</p>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-[13px]">
                    <thead><tr className="border-b border-border bg-muted/40"><th className="text-left px-3 py-2 font-semibold text-foreground">Token</th><th className="text-left px-3 py-2 font-semibold text-foreground">Address (Base Mainnet)</th></tr></thead>
                    <tbody>
                      {[["WETH","0x4200000000000000000000000000000000000006"],["USDC","0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"]].map(([t,a],i)=>(
                        <tr key={i} className="border-b border-border/50 last:border-0"><td className="px-3 py-2 text-foreground font-semibold">{t}</td><td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{a}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <SectionLabel>Trigger phrases</SectionLabel>
                <div className="rounded-xl border border-border bg-card p-4 font-mono text-[12px] space-y-2">
                  {[{l:"EN",c:"@gitbankbot swap 1 WETH to USDC"},{l:"EN",c:"@gitbankbot exchange all WETH for USDC"},{l:"ID",c:"@gitbankbot tukar 1 WETH ke USDC"},{l:"JA",c:"@gitbankbot 1 WETHをUSDCに交換する"},{l:"ZH",c:"@gitbankbot 将 1 WETH 换成 USDC"},{l:"RU",c:"@gitbankbot обменять 1 WETH на USDC"}].map(({l,c})=>(<div key={c} className="flex items-center gap-2"><span className="text-[10px] font-mono font-semibold text-muted-foreground/50 w-6 flex-shrink-0">{l}</span><p className="text-foreground">{c}</p></div>))}
                </div>
              </div>
            </div>
          }
        />
      </>
    ),
  },

  transfer: {
    title: "Transfer",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">Transfer sends GitTokens from your vault to another Gitbank vault identified by GitHub username. If the recipient does not have a vault yet, the bot automatically deploys one for them before executing the transfer. Vault-to-vault transfers are free. Gas is always covered by the Gitbank deployer wallet.</p>

        <TwoCol
          left={
            <div>
              <SectionLabel>Auto-vault creation for new recipients</SectionLabel>
              <p className="text-[13px] text-muted-foreground mb-4 leading-relaxed">This is one of the most powerful features. You can send funds to any GitHub user even if they have never heard of Gitbank. The bot creates their vault, executes the transfer, and notifies them in the same reply. The recipient only needs to sign in to gitbank.io to access their funds.</p>
              <FlowWrap>
                <div className="flex flex-col items-center gap-0.5">
                  <FBox label="@gitbankbot send 20 USDC to @newuser" sub="recipient has never used Gitbank" />
                  <FDown label="bot checks DB: no vault found for @newuser" />
                  <FBox label="Bot posts interim reply" sub="@sender: deploying vault for @newuser, ~10s" accent />
                  <FDown label="bot fetches GitHub ID for @newuser via GitHub API" />
                  <FBox label="Deployer deploys vault for @newuser on Base" sub="EIP-1167 minimal proxy clone, gas paid by deployer" />
                  <FDown label="bot polls on-chain until vault address resolves" />
                  <FBox label="Transfer executes: vault to vault" sub="20 USDC from sender vault to newuser vault" accent />
                  <FDown />
                  <FBox label="Bot posts final reply in same issue" sub="@sender: tx hash | @newuser: you received 20 USDC" />
                  <FDown label="@newuser gets GitHub notification" />
                  <FBox label="Recipient opens gitbank.io/app/onboarding" sub="signs in, vault with 20 USDC already there" dim />
                </div>
              </FlowWrap>
            </div>
          }
          right={
            <div className="space-y-6">
              <div>
                <SectionLabel>Two-phase commit-reveal pattern</SectionLabel>
                <p className="text-[13px] text-muted-foreground mb-4 leading-relaxed">To prevent front-running, vault-to-vault transfers use a two-phase pattern. Phase 1 commits a hash of the transfer details on-chain without revealing the recipient or amount. Phase 2 executes the transfer within a 600-second window. If the window expires, the commitment is cancelled and funds stay in the sender vault.</p>
                <FlowWrap>
                  <div className="flex flex-col items-center gap-0.5">
                    <FBox label="Phase 1: initTransfer" sub="commit hash on-chain, nonce locked" />
                    <FDown label="600-second window opens" />
                    <div className="flex items-start gap-3 flex-wrap justify-center w-full mt-1">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-semibold">Success path</span>
                        <FBox label="Phase 2: finalizeTransfer" sub="execute within 600s" accent />
                        <FDown />
                        <FBox label="Recipient vault credited" accent />
                      </div>
                      <div className="flex flex-col items-center gap-1 opacity-60">
                        <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Timeout path</span>
                        <FBox label="600s elapsed" dim />
                        <FDown />
                        <FBox label="Cancelled, funds stay" dim />
                      </div>
                    </div>
                  </div>
                </FlowWrap>
              </div>

              <div>
                <SectionLabel>Fee schedule</SectionLabel>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-[13px]">
                    <thead><tr className="border-b border-border bg-muted/40"><th className="text-left px-4 py-2.5 font-semibold text-foreground">Transfer type</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Fee</th></tr></thead>
                    <tbody>
                      {[["Vault-to-vault (gitToken stays in Gitbank)","Free"],["Auto-vault creation for new recipient","Free (deployer pays gas)"]].map(([t,f],i)=>(
                        <tr key={i} className="border-b border-border/50 last:border-0"><td className="px-4 py-2.5 text-foreground">{t}</td><td className="px-4 py-2.5 text-muted-foreground font-medium">{f}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <SectionLabel>Trigger phrases</SectionLabel>
                <div className="rounded-xl border border-border bg-card p-4 font-mono text-[12px] space-y-2">
                  {[{l:"EN",c:"@gitbankbot send 20 USDC to @alice"},{l:"EN",c:"@gitbankbot transfer 0.005 WETH to @bob"},{l:"ID",c:"@gitbankbot kirim 20 USDC ke @alice"},{l:"JA",c:"@gitbankbot @aliceに20 USDCを送る"},{l:"ZH",c:"@gitbankbot 发送 20 USDC 给 @alice"},{l:"RU",c:"@gitbankbot отправить 20 USDC для @alice"}].map(({l,c})=>(<div key={c} className="flex items-center gap-2"><span className="text-[10px] font-mono font-semibold text-muted-foreground/50 w-6 flex-shrink-0">{l}</span><p className="text-foreground">{c}</p></div>))}
                </div>
              </div>
            </div>
          }
        />
      </>
    ),
  },

  "project-create": {
    title: "Create a Project",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
          A Gitbank project is an on-chain workspace tied to a GitHub repository. It holds a budget in gitTokens, tracks contributors, and automatically releases bounties when pull requests merge. Projects are created entirely through GitHub issue comments. No dashboard, no form, no external tool.
        </p>

        <h2 className="text-lg font-bold text-foreground mb-3">Project creation flow</h2>
        <FlowWrap>
          <div className="flex flex-col items-center">
            <FBox label="@gitbankbot create project 'API v2' budget 80 USDC" sub="posted in any issue of the repo" />
            <FDown label="HMAC-SHA256 verified" />
            <FBox label="Claude extracts: project name, budget, repo" sub="intent: project_create" />
            <FDown />
            <FBox label="Relayer calls GitVault.createProject()" sub="locks 80 gitUSDC into project escrow" accent />
            <FDown label="Base L2 confirmed" />
            <FBox label="Bot replies" sub="project ID, escrow address, tx hash" />
          </div>
        </FlowWrap>

        <h2 className="text-lg font-bold text-foreground mb-3">What gets created on-chain</h2>
        <div className="flex flex-col gap-2 mb-6">
          {[
            { label: "Project ID", desc: "An on-chain integer ID scoped to the repo. Referenced in all subsequent task and bounty commands." },
            { label: "Budget escrow", desc: "The specified gitToken amount is moved from your vault into a project-level escrow inside GitVault. It cannot be spent except by assigning tasks or reclaiming unallocated budget." },
            { label: "Repo binding", desc: "The project is linked to the GitHub repository where the command was posted. Only issues and PRs in that repo trigger auto-pay for this project." },
            { label: "Owner", desc: "The GitHub Permanent User ID of the commenter becomes the project owner. Only the owner can assign tasks, swap budget, or archive the project." },
          ].map((row) => (
            <div key={row.label} className="flex gap-4 rounded-lg border border-border bg-card px-4 py-3">
              <p className="text-[12px] font-semibold text-primary w-32 flex-shrink-0">{row.label}</p>
              <p className="text-[13px] text-muted-foreground">{row.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Trigger phrases</h2>
        <div className="rounded-xl border border-border bg-card p-5 font-mono text-[13px] space-y-2">
          {[
            { l: "EN", c: "@gitbankbot create project 'API v2' budget 80 USDC" },
            { l: "EN", c: "@gitbankbot new project 'Docs rewrite' 50 USDC" },
            { l: "ID", c: "@gitbankbot buat proyek 'Halaman login' anggaran 60 USDC" },
            { l: "JA", c: "@gitbankbot プロジェクト '決済API' 予算80 USDCを作成する" },
            { l: "ZH", c: "@gitbankbot 创建项目 'API v2' 预算 80 USDC" },
          ].map(({ l, c }) => (
            <div key={c} className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold text-muted-foreground/50 w-6 flex-shrink-0">{l}</span>
              <p className="text-foreground">{c}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },

  "task-assign": {
    title: "Assign Tasks & Bounties",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
          Once a project has a budget, the project owner can assign bounties to any GitHub contributor by commenting on an issue. The bounty amount is moved from the project escrow into a task-specific escrow locked to that contributor's GitHub Permanent User ID. No one else can claim it.
        </p>

        <h2 className="text-lg font-bold text-foreground mb-3">Bounty assignment flow</h2>
        <FlowWrap>
          <div className="flex flex-col items-center">
            <FBox label="@gitbankbot assign @alice 20 USDC for this task" sub="owner comments on a GitHub issue" />
            <FDown label="owner identity verified" />
            <FBox label="Claude extracts: assignee, amount, issue number" sub="intent: task_assign" />
            <FDown />
            <FBox label="Relayer calls GitVault.assignTask()" sub="20 gitUSDC from project escrow → task escrow" accent />
            <FDown label="Base L2 confirmed" />
            <FBox label="Bot replies to the issue" sub="task ID, assignee vault, locked amount, tx hash" />
          </div>
        </FlowWrap>

        <h2 className="text-lg font-bold text-foreground mb-3">Task escrow rules</h2>
        <div className="flex flex-col gap-2 mb-6">
          {[
            { label: "Locked to User ID", desc: "The escrow is bound to the assignee's GitHub Permanent User ID. Even if they change username, the same identity receives the payout." },
            { label: "One assignee per task", desc: "Each issue can have one active task escrow at a time. Reassigning replaces the previous escrow (the previous assignee is removed, funds return to project escrow)." },
            { label: "No fee on assignment", desc: "Creating or reassigning a task costs nothing. The 0.20% bounty fee is deducted only when the payout actually executes on PR merge." },
            { label: "Owner can reclaim", desc: "If a task is cancelled or the contributor does not deliver, the project owner can reclaim the bounty back to the project escrow at any time." },
          ].map((row) => (
            <div key={row.label} className="flex gap-4 rounded-lg border border-border bg-card px-4 py-3">
              <p className="text-[12px] font-semibold text-primary w-36 flex-shrink-0">{row.label}</p>
              <p className="text-[13px] text-muted-foreground">{row.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Trigger phrases</h2>
        <div className="rounded-xl border border-border bg-card p-5 font-mono text-[13px] space-y-2">
          {[
            { l: "EN", c: "@gitbankbot assign @alice 20 USDC for this task" },
            { l: "EN", c: "@gitbankbot bounty @bob 0.005 ETH" },
            { l: "EN", c: "@gitbankbot reclaim bounty on issue #12" },
            { l: "ID", c: "@gitbankbot tugaskan @alice 20 USDC untuk ini" },
            { l: "JA", c: "@gitbankbot @aliceにこのタスク20 USDCを割り当てる" },
          ].map(({ l, c }) => (
            <div key={c} className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold text-muted-foreground/50 w-6 flex-shrink-0">{l}</span>
              <p className="text-foreground">{c}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },

  "bounty-autopay": {
    title: "Auto-Pay on PR Merge",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
          When a pull request merges in a Gitbank-enabled repository, the bot automatically detects the merge event, matches it to any open task linked to that PR or issue, and releases the bounty to the contributor's vault. The contributor does not need to comment, request payment, or take any manual action.
        </p>

        <h2 className="text-lg font-bold text-foreground mb-3">Auto-pay pipeline</h2>
        <FlowWrap>
          <div className="flex flex-col items-center">
            <FBox label="GitHub sends pull_request webhook" sub="action: closed, merged: true" />
            <FDown label="HMAC-SHA256 verified" />
            <FBox label="Bot matches PR to open task escrows" sub="by repo + issue reference in PR body or branch" />
            <FDown label="task escrow found" />
            <FBox label="Relayer calls GitVault.releaseBounty()" sub="task escrow released to assignee vault" accent />
            <FDown label="0.20% fee deducted, net minted as gitToken" />
            <FBox label="Bot replies to the merged PR" sub="payout receipt, tx hash, assignee vault balance" accent />
          </div>
        </FlowWrap>

        <h2 className="text-lg font-bold text-foreground mb-3">Matching rules</h2>
        <div className="flex flex-col gap-2 mb-6">
          {[
            { label: "PR body reference", desc: "If the PR body contains 'closes #12', 'fixes #12', or 'resolves #12', Gitbank checks issue #12 for an open task escrow in the same repo." },
            { label: "Branch name reference", desc: "If the branch name contains the issue number (e.g. feature/issue-12-...), it is treated as a secondary match signal." },
            { label: "Multiple tasks", desc: "If a PR closes multiple issues that each have an open task escrow, all of them are paid out in the same merge event." },
            { label: "No match", desc: "If no open task escrow is found, the merge event is silently ignored. No error is posted." },
          ].map((row) => (
            <div key={row.label} className="flex gap-4 rounded-lg border border-border bg-card px-4 py-3">
              <p className="text-[12px] font-semibold text-primary w-40 flex-shrink-0">{row.label}</p>
              <p className="text-[13px] text-muted-foreground">{row.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Payout fee</h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-muted/40"><th className="text-left px-4 py-2.5 font-semibold text-foreground">Bounty amount</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Fee (0.20%)</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Contributor receives</th></tr></thead>
            <tbody>
              {[
                ["20 USDC", "$0.10 (minimum)", "19.90 gitUSDC"],
                ["50 USDC", "0.10 USDC", "49.90 gitUSDC"],
                ["80 USDC", "0.16 USDC", "79.84 gitUSDC"],
                ["0.005 ETH", "0.000010 ETH", "0.004990 gitETH"],
              ].map(([a, f, r], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 text-foreground">{a}</td>
                  <td className="px-4 py-2.5 text-primary font-medium">{f}</td>
                  <td className="px-4 py-2.5 text-muted-foreground font-mono text-[12px]">{r}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },

  "install-fee": {
    title: "Install Fee & Treasury",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">
          Installing the Gitbank GitHub App on a repository is free today. There is no token fee, no activation payment, and no cost per repo. The bot activates as soon as GitHub processes the installation webhook.
        </p>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 mb-6 flex items-start gap-3">
          <span className="text-[11px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 flex-shrink-0 mt-0.5">Free Today</span>
          <p className="text-[13px] text-foreground leading-relaxed">
            Vault deployment is free. Repo installation is free. The Relayer covers all gas costs. The only fees charged by the protocol are the small transaction fees on gitShield, gitUnshield, and gitSwap operations.
          </p>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Current install flow</h2>
        <FlowWrap>
          <div className="flex flex-col items-center">
            <FBox label="Owner installs Gitbank GitHub App on a repo" sub="via GitHub Marketplace or gitbank.io" />
            <FDown />
            <FBox label="Gitbank detects installation_repositories webhook" sub="new repo added to the app" />
            <FDown label="no fee required" />
            <FBox label="Repo activated immediately" sub="IssueOps bot responds to @gitbankbot in this repo" accent />
            <FDown />
            <FBox label="First command auto-deploys the vault" sub="deployer pays all gas, vault live in ~10s" accent />
          </div>
        </FlowWrap>

        <h2 className="text-lg font-bold text-foreground mb-3">GITBANK token</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
          The GITBANK token exists on Base Mainnet and is the governance and reward token for the protocol. It is not required to use Gitbank today. Phase 5 of the roadmap (Gitbank Token Economy) introduces launchpad mechanics and treasury distributions for GITBANK holders.
        </p>
        <div className="flex flex-wrap items-center gap-3 mb-6 p-3 rounded-lg border border-border bg-muted/30">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Contract Address (CA)</p>
            <p className="text-[12px] font-mono text-foreground select-all">0xC21dd0eE043930711C2a3e55F39C7d3144d09B07</p>
          </div>
          <a href="https://clanker.world/clanker/0xC21dd0eE043930711C2a3e55F39C7d3144d09B07" target="_blank" rel="noreferrer" className="ml-auto px-3 py-1.5 rounded-lg border border-primary/40 bg-primary/5 text-primary text-[12px] font-semibold hover:bg-primary/10 transition-colors whitespace-nowrap">
            $GITBANK on Clanker
          </a>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Phase 5: Token Economy (planned)</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
          Phase 5 introduces a paid token launchpad. Creators buy 1% of their token supply and send it to the Gitbank treasury. The treasury distributes to GITBANK holders proportionally across 7-day epochs. GitStake tiers amplify rewards. See the Phase 5 roadmap section for full details.
        </p>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-muted/40"><th className="text-left px-4 py-2.5 font-semibold text-foreground">Property</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Value</th></tr></thead>
            <tbody>
              {[
                ["Install fee (today)", "Free"],
                ["Vault deployment", "Free (Relayer pays gas)"],
                ["Repo activation", "Instant on webhook"],
                ["GITBANK required to use", "No"],
                ["GITBANK launchpad fee (Phase 5)", "1% of new token supply"],
                ["Treasury distribution (Phase 5)", "7-day epochs, proportional to GITBANK held"],
              ].map(([p, v], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 font-medium text-foreground">{p}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },

  "identity-anchoring": {
    title: "Identity Anchoring",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">Every GitVault is permanently bound to a GitHub Permanent User ID at deployment time. This integer is assigned by GitHub when an account is created and is completely immutable. It differs from the GitHub username, which can be changed by the user at any time and can be claimed by another person after it is released.</p>

        <h2 className="text-lg font-bold text-foreground mb-3">How to find your GitHub User ID</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="px-4 py-2 border-b border-border bg-muted/40"><span className="text-[11px] font-mono text-muted-foreground">terminal</span></div>
          <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`# Replace "alice" with any GitHub username
curl https://api.github.com/users/alice | jq .id
# Returns: 12345678

# Or open in browser:
# https://api.github.com/users/alice
# Look for the "id" field (not "node_id")`}</pre>
        </div>

        <p className="text-[13px] text-muted-foreground mb-5 leading-relaxed">
          The <code className="font-mono text-[11px] bg-muted px-1 rounded">id</code> field is the integer you need. It never changes even if the username changes. The <code className="font-mono text-[11px] bg-muted px-1 rounded">node_id</code> field is a different identifier used by the GraphQL API and is not accepted by GitVaultFactory.
        </p>

        <h2 className="text-lg font-bold text-foreground mb-3">On-chain vault mapping</h2>
        <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">
          GitVaultFactory maintains a private <code className="font-mono text-[11px] bg-muted px-1 rounded">mapping(uint256 ={">"} address)</code> from GitHub User ID to vault address, exposed through view functions. Once a vault is deployed for an ID, the mapping entry cannot be overwritten.
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="px-4 py-2 border-b border-border bg-muted/40"><span className="text-[11px] font-mono text-muted-foreground">GitVaultFactory.sol (Base Mainnet: 0xAA0a...77B)</span></div>
          <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`mapping(uint256 => address) private vaultByGithubId;

function getVaultByGithubId(uint256 githubUserId) external view returns (address) {
    return vaultByGithubId[githubUserId];
}

function hasVault(uint256 githubUserId) external view returns (bool) {
    return vaultByGithubId[githubUserId] != address(0);
}

// Returns address(0) if vault not yet deployed for this GitHub ID`}</pre>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Webhook authentication flow</h2>
        <FlowWrap>
          <div className="flex flex-col items-center">
            <FBox label="GitHub sends issue_comment webhook" sub="POST to Gitbank webhook endpoint" />
            <FDown label="HTTPS" />
            <FBox label="HMAC-SHA256 signature check" sub="validate X-Hub-Signature-256 header" />
            <FDown label="fail → 401 rejected" />
            <FBox label="Read sender.id from payload" sub="immutable integer, not sender.login" accent />
            <FDown />
            <FBox label="Lookup vault by githubUserId" sub="database query by User ID, not username" />
            <FDown label="no vault → onboarding prompt" />
            <FBox label="Proceed with intent extraction" sub="pass to Claude with verified User ID" accent />
          </div>
        </FlowWrap>

        <h2 className="text-lg font-bold text-foreground mb-3">Permanent ID vs username</h2>
        <div className="rounded-xl border border-border overflow-hidden mb-6">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-muted/40"><th className="text-left px-4 py-2.5 font-semibold text-foreground">Property</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Permanent User ID</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Username (login)</th></tr></thead>
            <tbody>
              {[["Format","Integer (e.g. 12345678)","String (e.g. 'alice')"],["Can it change?","Never","Yes, user can rename any time"],["Can another user claim it?","No","Yes, after the original owner releases it"],["Used by Gitbank?","Yes (vault anchor)","No (never used for auth)"],["Risk if compromised?","None (immutable)","High (hijacking risk)"]].map(([p,id,un],i)=>(
                <tr key={i} className="border-b border-border/50 last:border-0"><td className="px-4 py-2.5 font-medium text-foreground">{p}</td><td className="px-4 py-2.5 text-primary">{id}</td><td className="px-4 py-2.5 text-muted-foreground">{un}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Webhook payload reference</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-2 border-b border-border bg-muted/40"><span className="text-[11px] font-mono text-muted-foreground">GitHub issue_comment webhook payload</span></div>
          <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`{
  "action": "created",
  "comment": {
    "body": "@gitbankbot swap 1 ETH to USDC"
  },
  "sender": {
    "login": "alice",           // username - IGNORED by Gitbank
    "id": 12345678              // Permanent User ID - vault anchor
  },
  "installation": { ... }       // GitHub App installation context
}`}</pre>
        </div>
      </>
    ),
  },

  "soul-bound-tokens": {
    title: "Soul-Bound Tokens",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">GitTokens are ERC-20-compatible in their interface but soul-bound in behavior. The transfer, transferFrom, and approve functions exist at the interface level but revert unconditionally when called by any address. They can only be minted or burned by the GitVault contract itself through authorized operations.</p>

        <div className="flex justify-center my-5">
          <DotGrid cols={44} rows={14} dotRadius={2} gap={2} patternFn={nodePat} />
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">ERC-20 vs GitToken comparison</h2>
        <div className="rounded-xl border border-border overflow-hidden mb-6">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-muted/40"><th className="text-left px-4 py-2.5 font-semibold text-foreground">Function</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">ERC-20</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">GitToken</th></tr></thead>
            <tbody>
              {[["transfer(to, amount)","Transfers tokens to any address","Reverts: soul-bound"],["transferFrom(from, to, amount)","Transfers on behalf of owner","Reverts: soul-bound"],["approve(spender, amount)","Grants allowance to spender","Reverts: soul-bound"],["balanceOf(owner)","Returns balance","Returns balance ✓"],["totalSupply()","Returns total supply","Returns total supply ✓"],["mint()","Not part of standard","Only GitVault can call"],["burn()","Not part of standard","Only GitVault can call"]].map(([f,e,g],i)=>(
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 font-mono text-[11px] text-foreground">{f}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{e}</td>
                  <td className={`px-4 py-2.5 font-medium ${g.includes("Reverts") ? "text-red-500" : "text-primary"}`}>{g}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Phishing resistance</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">A typical ERC-20 phishing attack works by tricking the user into signing an approve() call, which grants the attacker's contract unlimited access to the user's tokens. With GitTokens, this attack is impossible because approve() always reverts. There is nothing to drain even with a valid signature.</p>

        <h2 className="text-lg font-bold text-foreground mb-3">Token lifecycle</h2>
        <FlowWrap>
          <div className="flex items-center justify-center flex-wrap gap-1">
            <FBox label="gitShield" sub="ERC-20 deposited" />
            <FRight label="mint" />
            <FBox label="GitToken" sub="held in vault" accent />
            <FRight label="burn" />
            <FBox label="gitUnshield / gitSwap" sub="ERC-20 released" />
          </div>
        </FlowWrap>
      </>
    ),
  },

  recovery: {
    title: "Recovery",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">Gitbank uses a two-address model to separate day-to-day operations from emergency controls. The execution keypair (managed by the Relayer) handles all normal vault operations. The recovery address (a wallet you control) handles keypair rotation and emergency access.</p>

        <h2 className="text-lg font-bold text-foreground mb-3">Dual-signature model</h2>
        <FlowWrap>
          <div className="flex flex-col items-center gap-0">
            <FBox label="GitVault" sub="smart contract on Base" />
            <div className="flex items-start gap-10 mt-3 flex-wrap justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="text-[10px] font-semibold text-primary">owner (execution keypair)</div>
                <FBox label="Relayer Keypair" sub="managed by Gitbank backend" accent />
                <div className="text-[10px] text-muted-foreground text-center max-w-[140px]">Signs every vault transaction (tx sender)</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-[10px] font-semibold text-primary">relayerSigner (server key)</div>
                <FBox label="Gitbank Server Key" sub="issues 5-min auth signatures" accent />
                <div className="text-[10px] text-muted-foreground text-center max-w-[140px]">Signs after verifying GitHub bot command. Both required.</div>
              </div>
            </div>
          </div>
        </FlowWrap>

        <h2 className="text-lg font-bold text-foreground mb-3">Why dual-sig protects your vault</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">Every state-changing vault operation requires two independent signatures. If the execution keypair is leaked, an attacker still cannot drain the vault without also compromising the Gitbank server's relayer signing key, which is only used after verifying a real GitHub bot command from the vault owner.</p>
        <div className="flex flex-col gap-2 mb-6">
          {[
            { n:"1", t:"GitHub command triggers webhook", d:"A verified @gitbankbot comment arrives. The HMAC-SHA256 signature is checked against the GitHub webhook secret." },
            { n:"2", t:"Relayer issues short-lived signature", d:"The server signs keccak256(vaultAddress, githubUserId, deadline) with the relayer signing key. The signature expires in 5 minutes." },
            { n:"3", t:"Both signatures sent on-chain", d:"The relayer broadcasts the transaction using the execution keypair (tx sender). The contract verifies the relayer signature on-chain." },
            { n:"4", t:"Contract enforces both", d:"requireRelayerAuth() reverts if the signature is missing, expired, or from the wrong signer. The execution keypair alone is not enough." },
          ].map((item)=>(
            <div key={item.n} className="flex gap-4 rounded-lg border border-border bg-card px-4 py-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">{item.n}</div>
              <div><p className="text-[13px] font-semibold text-foreground mb-0.5">{item.t}</p><p className="text-[12px] text-muted-foreground">{item.d}</p></div>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Emergency withdrawal</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">The emergencyWithdraw() function allows recovery of all vault assets after a continuous inactivity period of 15,552,000 seconds (180 days). This function intentionally does not require a relayer signature so funds remain accessible even if the Gitbank server is permanently offline. The 6-month delay prevents social-engineering attacks.</p>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-muted/40"><th className="text-left px-4 py-2.5 font-semibold text-foreground">Function</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Who can call</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Time lock</th></tr></thead>
            <tbody>
              {[["emergencyWithdraw(tokens[])","Vault owner (execution keypair)","180 days of inactivity"]].map(([f,w,t],i)=>(
                <tr key={i} className="border-b border-border/50 last:border-0"><td className="px-4 py-2.5 font-mono text-[11px] text-foreground">{f}</td><td className="px-4 py-2.5 text-muted-foreground">{w}</td><td className="px-4 py-2.5 text-muted-foreground">{t}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },

  "fee-structure": {
    title: "Fee Structure",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">Gitbank charges protocol fees only on operations that move real value out of or within the vault: deposits (gitShield), withdrawals (gitUnshield), swaps (gitSwap), and bounty payouts on PR merge. Administrative operations (vault deployment, project creation, bounty task assignment, vault-to-vault transfers, keypair rotation) are free. The Relayer covers gas costs on every transaction.</p>

        <div className="flex justify-center my-5">
          <DotGrid cols={48} rows={14} dotRadius={2} gap={2} patternFn={barsPat} />
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Complete fee table</h2>
        <div className="rounded-xl border border-border overflow-hidden mb-6">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-muted/40"><th className="text-left px-4 py-2.5 font-semibold text-foreground">Operation</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Fee</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Min.</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Gas</th></tr></thead>
            <tbody>
              {[
                ["Vault deployment","Free","-","Relayer"],
                ["gitShield (deposit)","0.10%","$0.10","Relayer"],
                ["gitUnshield (withdrawal)","0.10%","$0.10","Relayer"],
                ["gitSwap","0.30%","$0.10","Relayer"],
                ["Bounty payout (PR merge)","0.20%","$0.10","Relayer"],
                ["Transfer (vault-to-vault)","Free","-","Relayer"],
                ["Project creation","Free","-","Relayer"],
                ["Task bounty assignment","Free","-","Relayer"],
                ["Bounty reclaim","Free","-","Relayer"],
                ["Keypair rotation","Free","-","Relayer"],
                ["Emergency withdrawal","Free","-","Relayer"],
              ].map(([op,fee,min,gas],i)=>(
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 text-foreground">{op}</td>
                  <td className={`px-4 py-2.5 font-semibold ${fee==="Free"?"text-muted-foreground":"text-primary"}`}>{fee}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{min}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{gas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Fee destination</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
          All protocol fees are transferred immediately to the feeCollector address at the moment the transaction executes. There is no distribution split or secondary routing. The feeCollector is the deployer address, set during vault initialization and fixed after that point.
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-2 border-b border-border bg-muted/40"><span className="text-[11px] font-mono text-muted-foreground">feeCollector address (Base Mainnet)</span></div>
          <div className="px-4 py-3">
            <p className="text-[12px] font-mono text-primary select-all">0x1e660A9A1f1F08AFEF9c03c96D66260122464CF2</p>
            <p className="text-[11px] text-muted-foreground mt-1">Deployer and feeCollector. Set in initialize() and fixed thereafter. Verify on Basescan.</p>
          </div>
        </div>
      </>
    ),
  },

  relayer: {
    title: "Relayer",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
          The Gitbank Relayer is a Node.js service that bridges GitHub issue comments to Base Mainnet transactions. It uses a 3-party meta-transaction model. The vault owner keypair signs the intent. The relayer signer issues a short-lived authorization. The deployer wallet broadcasts and pays all gas. Users never hold ETH, never sign raw transactions, and never interact with the blockchain directly.
        </p>

        <TwoCol
          left={
            <div>
              <SectionLabel>Relayer architecture flow</SectionLabel>
              <p className="text-[13px] text-muted-foreground mb-4 leading-relaxed">Every validated intent from the GitHub bot enters the relayer pipeline. The key engine decrypts the owner keypair in memory for less than 200 milliseconds, signs the calldata, then immediately discards the plaintext key. The deployer wallet submits the signed transaction to Base Mainnet.</p>
              <FlowWrap>
                <div className="flex flex-col items-center gap-0.5">
                  <FBox label="Validated intent arrives" sub="from GitHub Bot webhook handler" />
                  <FDown />
                  <FBox label="Calldata Generator" sub="encodes function call with all parameters" />
                  <FDown />
                  <FBox label="Relayer Signer" sub="issues short-lived ECDSA auth (5-min expiry)" accent />
                  <FDown />
                  <FBox label="Key Engine" sub="decrypts owner keypair (AES-256-GCM, under 200ms)" accent />
                  <FDown label="plaintext key discarded after signing" />
                  <div className="flex items-start gap-3 flex-wrap justify-center mt-1 w-full">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Standard ops</span>
                      <FBox label="Base Mainnet RPC" sub="deposit, withdraw, transfer" dim />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-semibold">Swap only</span>
                      <FBox label="Flashbots Protect RPC" sub="MEV protection for gitSwap" accent />
                    </div>
                  </div>
                  <FDown label="deployer wallet pays gas and broadcasts" />
                  <FBox label="Tx confirmed on Base Mainnet (~2s)" />
                  <FDown />
                  <FBox label="Bot posts receipt to GitHub issue" sub="tx hash + basescan link + amounts" />
                </div>
              </FlowWrap>
            </div>
          }
          right={
            <div className="space-y-6">
              <div>
                <SectionLabel>3-party meta-tx model</SectionLabel>
                <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">Three separate keys are involved in every vault operation. Compromising any one of them alone is not enough to execute a transaction. All three must cooperate.</p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Owner keypair", desc: "Generated per user at vault creation. Stored AES-256-GCM encrypted in the database. Signs the transaction calldata (the intent). Never holds ETH. Decrypted in memory for under 200ms per operation." },
                    { label: "Relayer signer", desc: "A server-side signing key that issues short-lived ECDSA authorizations with a 5-minute expiry. Required alongside the owner signature for every vault operation. Prevents replay attacks from stale signatures." },
                    { label: "Deployer wallet", desc: "The Gitbank-controlled address that broadcasts every transaction to Base Mainnet and pays gas. Entirely separate from vault keypairs. Funded by Gitbank. Users never interact with this address." },
                  ].map((row) => (
                    <div key={row.label} className="rounded-lg border border-border bg-card px-4 py-3">
                      <p className="text-[12px] font-semibold text-primary mb-1">{row.label}</p>
                      <p className="text-[12px] text-muted-foreground leading-relaxed">{row.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <SectionLabel>Key lifecycle per transaction</SectionLabel>
                <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">The AES-256-GCM master decryption key never touches disk. It lives only in process memory and is used to decrypt each vault keypair individually for the minimum time needed to sign.</p>
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="px-4 py-2 border-b border-border bg-muted/40"><span className="text-[11px] font-mono text-muted-foreground">Key lifecycle (per operation)</span></div>
                  <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`1. Retrieve encrypted keypair from database
2. Decrypt with AES-256-GCM in memory
3. Sign transaction calldata (under 10ms)
4. Discard plaintext keypair from memory
5. Total exposure window: under 200ms`}</pre>
                </div>
              </div>

              <div>
                <SectionLabel>Gas sponsorship</SectionLabel>
                <p className="text-[13px] text-muted-foreground leading-relaxed">The deployer wallet is funded with ETH on Base Mainnet. All gas costs are deducted from this wallet. At Base Mainnet prices (under $0.01 per transaction), gas costs are minimal. Protocol fees from gitShield, gitUnshield, and gitSwap operations go to the feeCollector (deployer) address, which also funds ongoing Relayer gas costs.</p>
              </div>
            </div>
          }
        />
      </>
    ),
  },

  "fee-collector": {
    title: "Fee Collector",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">The feeCollector is the deployer address set during vault initialization. All protocol fees are forwarded to this address immediately within the same transaction that generates them. The address is fixed after initialization and cannot be changed by the Relayer, any user key, or any admin action.</p>

        <div className="flex flex-wrap items-center gap-3 mb-6 p-3 rounded-lg border border-border bg-muted/30">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">feeCollector address (Base Mainnet)</p>
            <p className="text-[12px] font-mono text-primary select-all">0x1e660A9A1f1F08AFEF9c03c96D66260122464CF2</p>
          </div>
          <a href="https://basescan.org/address/0x1e660A9A1f1F08AFEF9c03c96D66260122464CF2" target="_blank" rel="noreferrer" className="ml-auto px-3 py-1.5 rounded-lg border border-primary/40 bg-primary/5 text-primary text-[12px] font-semibold hover:bg-primary/10 transition-colors whitespace-nowrap">
            View on Basescan
          </a>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Fee routing flow</h2>
        <FlowWrap>
          <div className="flex flex-col items-center">
            <FBox label="gitShield / gitUnshield / gitSwap called" />
            <FDown label="fee calculated on-chain" />
            <FBox label="ERC-20 fee transferred to feeCollector" accent />
            <FDown label="same transaction, atomic" />
            <FBox label="Deployer address receives fee" sub="0x1e660A9A1f1F08AFEF9c03c96D66260122464CF2" accent />
          </div>
        </FlowWrap>

        <h2 className="text-lg font-bold text-foreground mb-3">Permanence guarantee</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">Because the feeCollector address is set during vault initialization and the contract has no setter function for it, no upgrade, admin key, or governance vote can redirect fees mid-operation. Users can verify the feeCollector address by reading the public state variable directly on Basescan before depositing any funds.</p>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-2 border-b border-border bg-muted/40"><span className="text-[11px] font-mono text-muted-foreground">GitVault.sol (excerpt)</span></div>
          <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`// Set during initialize(), fixed thereafter (no setter)
address public feeCollector;

// Fee constants
uint256 public constant FEE_LOCK_UNLOCK_BPS = 10;  // 0.10% (shield/unshield)
uint256 public constant FEE_SWAP_BPS        = 30;  // 0.30% (swap)
uint256 public constant MINIMUM_FEE         = 1e5; // $0.10 floor (6-decimal tokens)

function initialize(
  uint256 _githubUserId,
  address _ownerAddress,
  address _feeCollector,
  address _relayerSigner
) external {
  require(!initialized, "GitVault: already initialized");
  feeCollector  = _feeCollector;  // deployer address, fixed after this
  owner         = _ownerAddress;
  relayerSigner = _relayerSigner;
  initialized   = true;
}`}</pre>
        </div>
      </>
    ),
  },

  "agent-wallet": {
    title: "AI Agent Wallet",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
          Any autonomous agent, trading bot, Twitter bot, LLM agent, or AI system that has a GitHub account can use Gitbank as its on-chain wallet on Base Mainnet. The vault gives the agent a secure, non-custodial treasury with no gas management, no seed phrase, and soul-bound assets that cannot be drained by external exploits.
        </p>

        <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 mb-6 flex items-start gap-3">
          <span className="text-[11px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-primary/40 text-primary bg-primary/10 flex-shrink-0 mt-0.5">Key insight</span>
          <p className="text-[13px] text-foreground leading-relaxed">
            Gitbank does not care whether the GitHub account is operated by a human or a machine. If an agent can post a comment to a GitHub issue, it can deposit, withdraw, swap, and send funds. The vault is anchored to a GitHub Permanent User ID, not to humanness.
          </p>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Agent onboarding flow</h2>
        <FlowWrap>
          <div className="flex flex-col items-center">
            <FBox label="Create a GitHub account for your agent" sub="e.g. github.com/myagent-bot" />
            <FDown label="install Gitbank GitHub App" />
            <FBox label="Add bot to a repo the agent controls" sub="github.com/apps/gitbankbot" />
            <FDown label="agent posts first command" />
            <FBox label="Bot auto-deploys vault for agent GitHub ID" sub="deployer pays gas, vault live in ~10s" accent />
            <FDown />
            <FBox label="Agent has a live vault on Base Mainnet" sub="WETH and USDC supported" accent />
          </div>
        </FlowWrap>

        <h2 className="text-lg font-bold text-foreground mb-3">What the agent can do via GitHub comments</h2>
        <div className="rounded-xl border border-border overflow-hidden mb-6">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Action</th>
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Command example</th>
            </tr></thead>
            <tbody>
              {[
                ["Check balance", "@gitbankbot balance"],
                ["Receive WETH or USDC", "Send to agent vault address (on-chain)"],
                ["Withdraw to any address", "@gitbankbot withdraw 10 USDC to 0x1234..."],
                ["Swap WETH to USDC", "@gitbankbot swap 0.01 WETH to USDC"],
                ["Pay a human contributor", "@gitbankbot send 20 USDC to @alice"],
                ["Create a project treasury", "@gitbankbot create project 'Sprint 1' budget 100 USDC"],
                ["Assign bounty to contributor", "@gitbankbot assign @alice 30 USDC for this task"],
              ].map(([action, cmd], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 text-foreground">{action}</td>
                  <td className="px-4 py-2.5 font-mono text-[12px] text-primary">{cmd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Use cases</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {[
            { tag: "DeFi Agent", title: "Autonomous trading bot", desc: "Agent holds WETH in vault, swaps to USDC when conditions are met, withdraws profits to an external address. Zero gas management. No seed phrase exposure." },
            { tag: "Social Agent", title: "Twitter or Discord tip bot", desc: "Bot receives USDC tips from the community into its vault. Distributes rewards to top contributors via @gitbankbot send. Full on-chain receipt for every payment." },
            { tag: "LLM Agent", title: "AI agent with budget", desc: "Give an LLM agent a USDC budget in a Gitbank vault. Agent pays for API calls, data access, or contractor work by posting commands to a private GitHub repo it controls." },
            { tag: "CI/CD Bot", title: "Automated bounty release", desc: "A CI bot monitors test coverage or code quality metrics. When targets are met, it comments @gitbankbot assign and bounties are released automatically on PR merge." },
          ].map((p) => (
            <div key={p.tag} className="rounded-xl border border-border bg-card p-5 flex flex-col gap-2">
              <span className="inline-block self-start text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-primary/30 text-primary bg-primary/5">{p.tag}</span>
              <p className="text-[14px] font-bold text-foreground leading-snug">{p.title}</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">MCP path for agents (recommended)</h2>
        <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">Agents can also control vaults via the Gitbank MCP server without needing GitHub at all. Connect to <code className="font-mono text-[11px] bg-muted px-1 rounded">https://gitbank.io/api/mcp</code> and call tools directly from any MCP-compatible client or agent framework.</p>
        <div className="rounded-xl border border-border overflow-hidden mb-6">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Action</th>
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">MCP tool</th>
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Autonomy level</th>
            </tr></thead>
            <tbody>
              {[
                ["Check vault balance", "get_vault_balance", "Read-only"],
                ["Transaction history", "get_transactions", "Read-only"],
                ["Project / bounty status", "get_project_status", "Read-only"],
                ["Connected repos", "list_repos", "Read-only"],
                ["Stage a deposit", "request_deposit", "Confirm via GitHub"],
                ["Stage a withdrawal", "request_withdraw", "Confirm via GitHub"],
                ["Stage a swap", "request_swap", "Confirm via GitHub"],
                ["Stage bounty assignment", "request_assign_bounty", "Confirm via GitHub"],
                ["Poll staged command", "check_pending", "Read-only"],
              ].map(([action, tool, level], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 text-foreground">{action}</td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-primary">{tool}</td>
                  <td className={`px-4 py-2.5 text-[11px] font-semibold ${level === "Read-only" ? "text-muted-foreground" : "text-emerald-600 dark:text-emerald-400"}`}>{level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Agent spending limits (Planned Phase 1)</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">Phase 1 adds per-agent daily spending caps. A vault owner will be able to grant an agent read-only or execute access with a configurable daily limit. The agent can operate autonomously within that cap without any further approval. Attempts to exceed the cap revert on-chain.</p>

        <h2 className="text-lg font-bold text-foreground mb-3">Rate limits (GitHub bot path)</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">The GitHub bot enforces a rate limit of 10 commands per hour per GitHub User ID (in-memory, resets on server restart). Agents that need higher throughput should use the MCP path, which has no equivalent per-session rate limit, or call the GitVault contract directly on Base Mainnet via the relayer endpoint.</p>
      </>
    ),
  },

  "trading-bot": {
    title: "Trading Bot Integration",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
          A trading bot or DeFi agent can use a Gitbank vault as its on-chain treasury on Base Mainnet. Assets held inside the vault are protected by soul-bound gitTokens. No external actor, including the Gitbank team, can drain the vault. The bot controls all movements by signing intent via its encrypted execution keypair.
        </p>

        <h2 className="text-lg font-bold text-foreground mb-3">Integration architecture</h2>
        <FlowWrap>
          <div className="flex flex-col items-center">
            <FBox label="Your trading bot (any language)" sub="monitors markets, decides to swap or withdraw" />
            <FDown label="two options" />
            <div className="flex items-start gap-6 flex-wrap justify-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Via GitHub bot</span>
                <FBox label="Post GitHub comment" sub="@gitbankbot swap 1 WETH to USDC" dim />
                <FDown />
                <FBox label="Gitbank bot executes" sub="Uniswap v3 on Base Mainnet" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Direct contract call</span>
                <FBox label="Build calldata + sign with owner keypair" sub="+ relayer signature required" dim />
                <FDown />
                <FBox label="GitVault.gitSwap() on Base Mainnet" sub="high-frequency, no rate limit" accent />
              </div>
            </div>
          </div>
        </FlowWrap>

        <h2 className="text-lg font-bold text-foreground mb-3">Option A: via MCP + GitHub confirm (recommended for bots)</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">Call the Gitbank MCP server to stage operations, then confirm via GitHub. Read-only tools return results immediately. Write tools return a <code className="font-mono text-[11px] bg-muted px-1 rounded">confirm_code</code>; the bot must post <code className="font-mono text-[11px] bg-muted px-1 rounded">@gitbankbot confirm &lt;code&gt;</code> in any GitHub issue where the bot is installed. This keeps GitHub account security (2FA, YubiKey) as the final authorization gate for all writes.</p>
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="px-4 py-2 border-b border-border bg-muted/40"><span className="text-[11px] font-mono text-muted-foreground">MCP tool calls (pseudocode)</span></div>
          <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`// 1. Read-only call: get balance immediately (no confirmation needed)
const balance = await mcpClient.callTool("get_vault_balance", {
  github_username: "my-bot-account",   // GitHub username, not numeric ID
});
// Returns: { vault_address: "0x...", balances: { WETH: "0.025", USDC: "41.50" } }

// 2. Stage a write operation: returns confirm_code (does NOT execute yet)
if (shouldSwap) {
  const staged = await mcpClient.callTool("request_swap", {
    github_username: "my-bot-account",
    amount: 0.01,
    from_token: "WETH",
    to_token: "USDC",
  });
  // Returns: { confirm_code: "abc123", expires_in: "10 minutes" }

  // 3. Confirm: bot posts "@gitbankbot confirm abc123" via GitHub API
  await octokit.issues.createComment({
    owner: "my-org", repo: "my-repo", issue_number: 1,
    body: "@gitbankbot confirm " + staged.confirm_code,
  });

  // 4. Poll until executed
  let status;
  do {
    await sleep(3000);
    status = await mcpClient.callTool("check_pending", {
      confirm_code: staged.confirm_code,
    });
  } while (status.status === "pending");
  // status.status: "executed" | "expired" | "confirmed"
}`}</pre>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 mb-6">
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Rate limit (MCP path):</strong> No hard per-session rate limit on the MCP server. The underlying relayer enforces 10 commands/hour per GitHub User ID on the server side. For higher-frequency bots, use direct contract calls with the relayer endpoint.
          </p>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Option B: via GitHub comment (simple)</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">If your bot can authenticate to GitHub and post issue comments, this is a simple alternative. Rate limit: 10 commands/hour per GitHub User ID (in-memory, resets on server restart).</p>
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="px-4 py-2 border-b border-border bg-muted/40"><span className="text-[11px] font-mono text-muted-foreground">GitHub REST API (Node.js example)</span></div>
          <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`// Post a swap command from your bot's GitHub account
await octokit.issues.createComment({
  owner: "your-org",
  repo:  "your-repo",
  issue_number: 1,
  body: "@gitbankbot swap 0.5 WETH to USDC",
});
// Bot replies with receipt + tx hash in the same issue`}</pre>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Option C: direct contract call (advanced)</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">For high-frequency bots or when you want full control, call GitVault directly on Base Mainnet. You need the vault's owner keypair (stored encrypted in Gitbank DB) and a fresh relayer authorization signature from the Gitbank relayer endpoint.</p>
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="px-4 py-2 border-b border-border bg-muted/40"><span className="text-[11px] font-mono text-muted-foreground">viem (TypeScript) - gitSwap direct call</span></div>
          <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`import { createWalletClient, http } from "viem";
import { base } from "viem/chains";

// 1. Get relayer authorization from Gitbank API
const { relayerSig, deadline } = await fetch(
  "https://gitbank.io/api/relayer/authorize",
  { method: "POST", body: JSON.stringify({ github_id, intent: "gitSwap" }) }
).then(r => r.json());

// 2. Sign with owner keypair (decrypted in memory)
const ownerSig = await walletClient.signTypedData({ ... });

// 3. Call GitVault.gitSwap()
await vaultContract.write.gitSwap([
  WETH_ADDRESS, USDC_ADDRESS,
  amountIn, minOut,
  deadline, nonce,
  ownerSig, relayerSig,
]);`}</pre>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Supported assets on Base Mainnet</h2>
        <div className="rounded-xl border border-border overflow-hidden mb-6">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Asset</th>
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Contract address (Base Mainnet)</th>
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Swap output</th>
            </tr></thead>
            <tbody>
              {[
                ["WETH", "0x4200000000000000000000000000000000000006", "Yes (whitelisted)"],
                ["USDC", "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", "Yes (whitelisted)"],
              ].map(([asset, addr, swap], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 text-foreground font-semibold">{asset}</td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{addr}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{swap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },

  "contract-reference": {
    title: "Contract Reference",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
          All Gitbank contracts are deployed and verified on Base Mainnet (chainId 8453) with Apache 2.0 license. Source code is at github.com/gitbankio/contracts.
        </p>

        <h2 className="text-lg font-bold text-foreground mb-3">Deployed addresses</h2>
        <div className="rounded-xl border border-border overflow-hidden mb-6">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Contract</th>
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Address</th>
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Basescan</th>
            </tr></thead>
            <tbody>
              {[
                ["GitVaultFactory", "0xAA0a4ff46733EBaE8E658642A1314f18980fc77B", "basescan.org/address/0xAA0a..."],
                ["GitVault impl", "0x3602197A1b445AA4746c47C9D69436d9B7cF5dc9", "basescan.org/address/0x3602..."],
                ["Uniswap v3 SwapRouter02", "0x2626664c2603336E57B271c5C0b26F421741e481", "basescan.org/address/0x2626..."],
                ["Deployer / feeCollector", "0x1e660A9A1f1F08AFEF9c03c96D66260122464CF2", "basescan.org/address/0x1e66..."],
                ["Relayer signer", "0x750E6E4C5DF3483a6235D3DDAB4087266D6EF510", "basescan.org/address/0x750E..."],
              ].map(([name, addr, scan], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 text-foreground font-semibold">{name}</td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-primary">{addr}</td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{scan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Key function signatures</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="px-4 py-2 border-b border-border bg-muted/40"><span className="text-[11px] font-mono text-muted-foreground">GitVault.sol - state-changing functions</span></div>
          <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`// Deposit: lock ERC-20, mint gitToken (fee: 0.10%)
function gitShield(
    address tokenAddress, uint256 amount,
    uint256 expectedNonce, uint256 deadline,
    bytes calldata ownerSig, bytes calldata relayerSig
) external nonReentrant;

// Withdraw: burn gitToken, release ERC-20 to destination (fee: 0.10%)
function gitUnshield(
    address tokenAddress, uint256 amount, address destination,
    uint256 expectedNonce, uint256 deadline,
    bytes calldata ownerSig, bytes calldata relayerSig
) external nonReentrant;

// Swap via Uniswap v3, burn input gitToken, mint output gitToken (fee: 0.30%)
function gitSwap(
    address tokenIn, address tokenOut,
    uint256 amountIn, uint256 minAmountOut,
    address dexRouter, bytes calldata routerData,
    uint256 expectedNonce, uint256 deadline,
    bytes calldata ownerSig, bytes calldata relayerSig
) external nonReentrant;

// Transfer phase 1: commit hash intent (free)
function initTransfer(
    bytes32 initHash, uint256 deadline,
    bytes calldata ownerSig, bytes calldata relayerSig
) external;

// Transfer phase 2: execute committed transfer (free, must wait 1 block)
function finalizeTransfer(
    address tokenAddress, address to, uint256 amount,
    uint256 expectedNonce, uint256 initNonce, uint256 deadline,
    bytes calldata ownerSig, bytes calldata relayerSig
) external nonReentrant;

// Emergency: owner-only, after 6 months inactivity (no relayer sig needed)
function emergencyWithdraw(address[] calldata tokenAddresses) external onlyOwner nonReentrant;`}</pre>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Read vault state (no signature needed)</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="px-4 py-2 border-b border-border bg-muted/40"><span className="text-[11px] font-mono text-muted-foreground">viem - read on-chain state</span></div>
          <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

const client = createPublicClient({ chain: base, transport: http() });

// Get vault address for a GitHub User ID
const FACTORY = "0xAA0a4ff46733EBaE8E658642A1314f18980fc77B";
const vaultAddr = await client.readContract({
  address: FACTORY,
  abi: factoryAbi,
  functionName: "getVaultByGithubId",
  args: [BigInt(githubUserId)],
});

// Read locked WETH balance inside vault
const WETH = "0x4200000000000000000000000000000000000006";
const balance = await client.readContract({
  address: vaultAddr,
  abi: vaultAbi,
  functionName: "getGitLockedBalance",
  args: [WETH],
});`}</pre>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Factory function signatures</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="px-4 py-2 border-b border-border bg-muted/40"><span className="text-[11px] font-mono text-muted-foreground">GitVaultFactory.sol</span></div>
          <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`// Deploy a minimal proxy vault for a given GitHub User ID
// No access control modifier; anyone can call. Reverts if vault already exists.
function createGitVault(
  uint256 githubUserId,
  address ownerAddress    // execution keypair address generated by Gitbank
) external returns (address vault);

// Lookup vault by GitHub User ID (returns address(0) if not deployed)
function getVaultByGithubId(uint256 githubUserId) external view returns (address);

// Quick existence check
function hasVault(uint256 githubUserId) external view returns (bool);

// Lookup vault by owner keypair address
function getVaultByOwner(address ownerAddress) external view returns (address);`}</pre>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Sepolia testnet (Base Sepolia, chainId 84532)</h2>
        <div className="rounded-xl border border-border overflow-hidden mb-6">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Contract</th>
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Sepolia Address</th>
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Basescan</th>
            </tr></thead>
            <tbody>
              {[
                ["GitVaultFactory", "0xe492ABc6ddFfa154451fC7c7E1CE6BEac826b54A", "sepolia.basescan.org/address/0xe492..."],
                ["GitVault impl", "0xa44532Ff0647a2016135843659576E06E8171847", "sepolia.basescan.org/address/0xa445..."],
                ["Deployer / feeCollector", "0x1e660A9A1f1F08AFEF9c03c96D66260122464CF2", "sepolia.basescan.org/address/0x1e66..."],
                ["Relayer signer", "0x750E6E4C5DF3483a6235D3DDAB4087266D6EF510", "sepolia.basescan.org/address/0x750E..."],
              ].map(([name, addr, scan], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 text-foreground font-semibold">{name}</td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-primary">{addr}</td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{scan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Deployment pattern:</strong> EIP-1167 minimal proxy clones via GitVaultFactory. The factory deploys one implementation contract once, and each user vault is a cheap clone pointing to it. All clones share the same implementation bytecode but have isolated storage. License: Apache 2.0 (verified on Basescan).
          </p>
        </div>
      </>
    ),
  },

  "agent-security": {
    title: "Security for Agents",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
          AI agents and autonomous bots face unique security risks that traditional wallets do not solve. A compromised signing key, a prompt injection attack, or a malicious instruction from an orchestrating system can all direct an agent to drain its own wallet. Gitbank is designed to prevent this.
        </p>

        <div className="flex justify-center mb-6">
          <DotGrid cols={48} rows={12} dotRadius={2} gap={2} patternFn={nodePat} />
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Threat model: what attackers try</h2>
        <div className="flex flex-col gap-2 mb-6">
          {[
            { label: "EVM approval exploit", desc: "Attacker tricks agent into signing an ERC-20 approve() call, then drains the wallet via transferFrom. gitTokens have no approve or transfer function. This attack vector does not exist." },
            { label: "Prompt injection", desc: "Malicious input to an LLM agent instructs it to send funds to an attacker address. The bot still requires a valid GitHub webhook origin (HMAC-SHA256) and a relayer signature. A prompt alone cannot trigger an on-chain transaction." },
            { label: "Leaked owner keypair", desc: "Even if the agent vault's owner private key is leaked, an attacker cannot execute any vault operation without also having a fresh relayer signature from the Gitbank server (5-minute expiry, issued only after GitHub webhook verification)." },
            { label: "Front-running on swap", desc: "MEV bot sandwiches the agent swap to extract value. All gitSwap transactions use Flashbots Protect RPC, bypassing the public mempool. The minOut parameter also enforces a slippage floor at the contract level." },
            { label: "Social engineering via GitHub", desc: "Someone tricks the agent into posting a malicious command in a public issue. The bot processes commands only from the vault owner GitHub ID verified by GitHub webhook. Other users commenting cannot trigger operations on someone else vault." },
          ].map((row) => (
            <div key={row.label} className="flex gap-4 rounded-lg border border-border bg-card px-4 py-3">
              <p className="text-[12px] font-semibold text-primary w-44 flex-shrink-0">{row.label}</p>
              <p className="text-[13px] text-muted-foreground">{row.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Defense layers</h2>
        <FlowWrap>
          <div className="flex flex-col items-center">
            <FBox label="Layer 1: Soul-bound gitTokens" sub="no transfer(), no approve() - phishing has no surface" accent />
            <FDown />
            <FBox label="Layer 2: Dual-sig (owner + relayer)" sub="leaked owner key alone cannot execute anything" accent />
            <FDown />
            <FBox label="Layer 3: GitHub webhook HMAC" sub="bot only responds to genuine GitHub events" />
            <FDown />
            <FBox label="Layer 4: Short-lived relayer sig" sub="5-minute expiry, issued once per verified intent" />
            <FDown />
            <FBox label="Layer 5: Nonce per operation" sub="replay attacks fail, concurrent commands fail" />
            <FDown />
            <FBox label="Layer 6: Emergency exit" sub="owner can withdraw directly after 6 months inactivity" dim />
          </div>
        </FlowWrap>

        <h2 className="text-lg font-bold text-foreground mb-3">Key management for agent vaults</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">Each vault's execution keypair is generated server-side by the Gitbank relayer, encrypted with AES-256-GCM using a master key that never touches disk, and stored in the database. The plaintext keypair exists in process memory for less than 200 milliseconds per operation.</p>
        <div className="rounded-xl border border-border overflow-hidden mb-6">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Property</th>
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Traditional EOA wallet</th>
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Gitbank vault</th>
            </tr></thead>
            <tbody>
              {[
                ["Key storage", "File / env var / hardware", "AES-256-GCM encrypted in DB"],
                ["Key exposure window", "Always in memory", "Less than 200ms per tx"],
                ["Drain via approve exploit", "Yes", "No (soul-bound)"],
                ["Drain via leaked key", "Yes", "No (dual-sig required)"],
                ["Gas management", "Agent holds ETH", "Deployer pays all gas"],
                ["Emergency recovery", "Lose key = lose funds", "6-month emergency exit"],
              ].map(([prop, eoa, gb], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 text-foreground font-semibold">{prop}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{eoa}</td>
                  <td className="px-4 py-2.5 text-primary font-medium">{gb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Recommended setup for production agents</h2>
        <div className="flex flex-col gap-2">
          {[
            { step: "1", title: "Use a dedicated GitHub account for your agent", desc: "Do not share the agent GitHub account with any human. This isolates the GitHub identity and makes audit logs clean." },
            { step: "2", title: "Install the bot only on private repos", desc: "If your agent issues commands in a private repo, no public observer can see the command history. Use a private org repo for agent operations." },
            { step: "3", title: "Set a withdrawal address and pin it", desc: "Use gitUnshield with an explicit destination address so the bot never defaults to sending to an unexpected address. Bind the destination in the owner signature." },
            { step: "4", title: "Monitor vault nonce", desc: "Read the vault nonce from Base Mainnet RPC before each operation. An unexpected nonce increment means a command executed that your system did not initiate." },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 rounded-lg border border-border bg-card px-4 py-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{item.step}</div>
              <div>
                <p className="text-[13px] font-semibold text-foreground mb-0.5">{item.title}</p>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3 mt-8">MCP auth model: 2-step confirm</h2>
        <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">All MCP write tools (<code className="font-mono text-[11px] bg-muted px-1 rounded">request_deposit</code>, <code className="font-mono text-[11px] bg-muted px-1 rounded">request_withdraw</code>, <code className="font-mono text-[11px] bg-muted px-1 rounded">request_swap</code>, <code className="font-mono text-[11px] bg-muted px-1 rounded">request_assign_bounty</code>) return a <code className="font-mono text-[11px] bg-muted px-1 rounded">confirm_code</code> and do NOT execute immediately. Execution only happens after the GitHub account posts <code className="font-mono text-[11px] bg-muted px-1 rounded">@gitbankbot confirm &lt;code&gt;</code> in a GitHub issue where the bot is installed. This is a security architecture, not a limitation:</p>
        <div className="flex flex-col gap-2 mb-6">
          {[
            { label: "GitHub 2FA as a write gate", desc: "A prompt injection attack that tricks an LLM into calling request_swap cannot execute without the GitHub account also posting the confirm comment. The 2FA on the GitHub account (TOTP, YubiKey, passkey) protects every write." },
            { label: "Confirm_code expiry", desc: "Each confirm_code expires in 10 minutes. A leaked code cannot be used after it expires. An attacker would need to intercept both the MCP response AND trigger GitHub confirmation within 10 minutes." },
            { label: "GitHub identity verification", desc: "The bot reads sender.id from the GitHub webhook to verify confirm_code origin. A different GitHub account posting the code cannot authorize a write to someone else's vault." },
          ].map((row) => (
            <div key={row.label} className="flex gap-4 rounded-lg border border-border bg-card px-4 py-3">
              <p className="text-[12px] font-semibold text-primary w-48 flex-shrink-0">{row.label}</p>
              <p className="text-[13px] text-muted-foreground">{row.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">x402 agent payment threat model (Phase 1)</h2>
        <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">x402 is an HTTP-native payment protocol where agents pay for API access using USDC on Base. Phase 1 exposes x402 payment endpoints on Gitbank. This opens a new threat surface: a malicious API could serve a 402 Payment Required response with an inflated price, causing an agent to drain its vault paying for fake services.</p>
        <div className="flex flex-col gap-2">
          {[
            { label: "Price cap per request", desc: "Phase 1 will enforce a maximum USDC amount per x402 payment. The agent refuses to pay above the configured cap regardless of what the 402 response specifies." },
            { label: "Allowlist of payee addresses", desc: "Agents will only send x402 payments to pre-approved destination addresses. Attempts to pay an unknown address are rejected before any transaction is staged." },
            { label: "Daily spend limit", desc: "Per-agent spending caps (set by vault owner) bound total x402 expenditure. An agent cannot spend more than its daily limit even if it calls the same endpoint repeatedly." },
            { label: "Audit trail", desc: "Every x402 payment is recorded as a vault transaction on Base Mainnet and appears in get_transactions. Agents can be audited for all payments made." },
          ].map((row) => (
            <div key={row.label} className="flex gap-4 rounded-lg border border-border bg-card px-4 py-3">
              <p className="text-[12px] font-semibold text-primary w-48 flex-shrink-0">{row.label}</p>
              <p className="text-[13px] text-muted-foreground">{row.desc}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },

  glossary: {
    title: "Glossary",
    body: (
      <>
        <div className="flex justify-center mb-6">
          <DotGrid cols={48} rows={12} dotRadius={2} gap={2} patternFn={wavePat} />
        </div>
        <dl className="space-y-5">
          {[
            ["MCP (Model Context Protocol)","An open standard that lets AI clients (Claude Desktop, Cursor, Grok, Windsurf) call external tools via a structured protocol. Gitbank exposes an MCP server at https://gitbank.io/api/mcp with 10 vault tools. No API key required."],
            ["Base MCP","An operating mode for the Gitbank MCP server that uses EIP-5792 wallet_sendCalls instead of the Gitbank Relayer. The MCP server prepares unsigned call batches that the user submits directly from a Coinbase Wallet or Smart Wallet."],
            ["EIP-5792","An Ethereum Improvement Proposal that defines a wallet_sendCalls JSON-RPC method for submitting atomic call batches from a wallet client. Used by Base MCP mode to let AI clients prepare transactions that users sign and submit themselves."],
            ["send_calls (wallet_sendCalls)","The JSON-RPC method defined in EIP-5792. Accepts an array of encoded calls and submits them atomically from the connected wallet. Supported by Coinbase Wallet and Coinbase Smart Wallet on Base Mainnet."],
            ["GitVault","The smart contract deployed per user on Base L2. It locks real ERC-20 assets, mints and burns GitTokens, enforces identity-based permissions, and manages project workspaces."],
            ["GitToken","A soul-bound ERC-20-like token (gitWETH or gitUSDC) representing a locked position inside a GitVault. Cannot be transferred, approved, or moved by any external actor."],
            ["GitHub Permanent User ID","An immutable integer assigned by GitHub at account creation. Used as the identity anchor for every GitVault. Different from and more stable than a GitHub username."],
            ["Relayer","The Gitbank backend Node.js service that holds encrypted execution keypairs and broadcasts transactions to Base L2 on behalf of users. Covers all gas costs."],
            ["gitShield","The deposit operation. Locks real ERC-20 assets into GitVault and mints the equivalent GitTokens after deducting the 0.10% protocol fee."],
            ["gitUnshield","The withdrawal operation. Burns GitTokens and releases the underlying ERC-20 to the vault owner address after deducting the 0.10% fee. Requires dual-sig."],
            ["gitSwap","The exchange operation. Burns input GitTokens, routes underlying assets through Uniswap v3 SwapRouter02 on Base Mainnet, and mints output GitTokens. Output is restricted to WETH or USDC (whitelist enforced on-chain and in the relayer). 0.30% fee."],
            ["IssueOps","The pattern of operating infrastructure or financial systems through GitHub issue comments. Gitbank is an IssueOps-native protocol."],
            ["feeCollector","The deployer address that receives all protocol fees at the moment they are generated. Set during vault initialization, fixed thereafter. Address: 0x1e660A9A1f1F08AFEF9c03c96D66260122464CF2 on Base Mainnet."],
            ["relayerSigner","The Gitbank server signing address. Issues short-lived ECDSA authorization signatures (5-minute expiry) after verifying GitHub bot commands. Required alongside the execution keypair for every vault operation."],
            ["Soul-bound token","An ERC-20 token whose transfer and approve functions always revert. Position can only be moved by the vault contract itself through authorized operations."],
            ["HMAC-SHA256","Hash-based message authentication code used to verify that incoming GitHub webhooks are genuinely from GitHub and have not been tampered with."],
            ["initTransfer / finalizeTransfer","The two-phase commit-reveal pattern used for vault transfers. initTransfer commits a hash; finalizeTransfer executes within 600 seconds."],
            ["MEV (Miner Extractable Value)","Value extracted by block producers (or bots) by reordering or front-running transactions. Gitbank uses Flashbots Protect RPC to prevent MEV on swap operations."],
            ["Base Mainnet","The Ethereum Layer 2 network built by Coinbase using the OP Stack (chainId 8453). Gitbank contracts are deployed and verified on Base Mainnet. 2-second block times, sub-$0.01 gas costs. Explorer: basescan.org."],
            ["Uniswap v3 SwapRouter02","The DEX router used by gitSwap on Base Mainnet. Contract address: 0x2626664c2603336E57B271c5C0b26F421741e481. Handles exact-input single swaps for WETH and USDC pairs."],
            ["Deployer wallet","The Gitbank-controlled address that broadcasts every user transaction and pays gas on Base Mainnet. Separate from vault owner keypairs. Address: 0x1e660A9A1f1F08AFEF9c03c96D66260122464CF2."],
            ["Nonce","A monotonically incrementing counter stored per vault. Every state-changing operation must include the current nonce value. Prevents replay attacks."],
            ["Sprint","A time-boxed development period in the Gitbank roadmap. Each sprint delivers a defined set of contract functions, backend services, or user-facing features."],
            ["x402","An HTTP-native machine-to-machine payment protocol built on the 402 Payment Required status code. Allows autonomous agents to pay for API access in USDC on Base without API keys or OAuth. Gitbank Phase 1 exposes x402 payment endpoints so agents can pay each other directly."],
            ["ZK","A privacy protocol deployed on Base that uses zkSNARK proofs to shield ERC-20 transfers. Vault-to-vault transfers routed through ZK hide amounts and recipients from public block explorers while remaining verifiably valid on-chain. Planned for Phase 6."],
            ["GitScore","A soul-bound NFT that accumulates with every on-chain bounty payout. Represents a contributor's verifiable track record of open-source work on Base. Used as reputational collateral for undercollateralized lending in Phase 7."],
            ["cbETH","Coinbase Wrapped Staked ETH. A liquid staking token native to Base where holders earn ETH staking yield (~3.5% APY) while keeping the asset liquid. Planned as an opt-in yield option for WETH held in GitVaults in Phase 2."],
            ["Pendle","A yield tokenization protocol on Base that splits yield-bearing assets into Principal Tokens (PT) and Yield Tokens (YT). GitVaults can hold PT positions to lock in a fixed APY on idle USDC. Planned for Phase 2."],
            ["Morpho","A peer-to-peer lending optimization protocol on Base. Morpho Blue markets offer higher supply rates for USDC than standard money markets by matching lenders and borrowers directly. Planned as the default yield routing for idle vault USDC in Phase 2."],
          ].map(([term, def])=>(
            <div key={term as string}>
              <dt className="text-[14px] font-semibold text-foreground mb-1">{term}</dt>
              <dd className="text-[13px] text-muted-foreground leading-relaxed">{def}</dd>
            </div>
          ))}
        </dl>
      </>
    ),
  },

  "cli-install": {
    title: "CLI (gitbank)",
    body: (
      <>
        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 mb-5 flex items-start gap-3">
          <span className="text-[11px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-border text-muted-foreground bg-muted flex-shrink-0 mt-0.5">Coming Soon</span>
          <p className="text-[13px] text-muted-foreground leading-relaxed">The gitbank CLI package is in active development. The MCP server at <code className="font-mono text-[11px] bg-muted px-1 rounded">https://gitbank.io/api/mcp</code> is available today and can be used from any MCP-compatible client (Claude Desktop, Cursor, Grok).</p>
        </div>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
          The Gitbank CLI lets you run vault operations directly from your terminal. Same commands as the GitHub bot, no browser required. Install it once and use it from any machine.
        </p>

        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted"/><div className="w-2 h-2 rounded-full bg-muted"/><div className="w-2 h-2 rounded-full bg-muted"/>
            <span className="text-[11px] font-mono text-muted-foreground ml-1">terminal</span>
          </div>
          <pre className="text-[13px] font-mono text-foreground p-5 whitespace-pre-wrap leading-relaxed">{`# Install globally
npm install -g gitbank

# Log in with GitHub
gitbank auth login

# Check your vault balance
gitbank balance

# Deposit 10 USDC into your vault
gitbank deposit 10 USDC

# Withdraw 5 USDC to an address
gitbank withdraw 5 USDC to 0xYourWalletAddress

# Swap USDC to WETH inside the vault
gitbank swap 2 USDC to WETH

# Send tokens to another GitHub user
gitbank send 1 WETH to @alice`}</pre>
        </div>

        <SectionLabel>Available commands</SectionLabel>
        <div className="rounded-xl border border-border overflow-hidden mb-6">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-2.5 font-semibold text-foreground">Command</th>
                <th className="text-left px-4 py-2.5 font-semibold text-foreground">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["gitbank auth login", "Connect your GitHub account via OAuth"],
                ["gitbank auth logout", "Sign out and clear local credentials"],
                ["gitbank balance", "Show all gitToken balances in your vault"],
                ["gitbank deposit <amt> <token>", "Lock tokens into your vault"],
                ["gitbank withdraw <amt> <token> to <addr>", "Withdraw from vault to a wallet address"],
                ["gitbank swap <amt> <from> to <to>", "Swap tokens inside the vault via Uniswap v3"],
                ["gitbank send <amt> <token> to @user", "Transfer to another GitHub user vault"],
                ["gitbank vault deploy", "Deploy your vault if not yet deployed"],
                ["gitbank vault key", "Export your vault execution keypair"],
              ].map(([cmd, desc], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 font-mono text-primary text-[11px]">{cmd}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-start gap-3">
          <span className="text-[11px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-primary/40 text-primary bg-primary/10 flex-shrink-0 mt-0.5">npm</span>
          <div>
            <p className="text-[13px] font-semibold text-foreground mb-1">Open source on npm</p>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              Package: <a href="https://npmjs.com/package/gitbank" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">npmjs.com/package/gitbank</a>
              {" "} / Source: <a href="https://github.com/gitbankio/gitbank-cli" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">github.com/gitbankio/gitbank-cli</a>
            </p>
          </div>
        </div>
      </>
    ),
  },

  "sdk-quickstart": {
    title: "SDK (@gitbank-agent/sdk)",
    body: (
      <>
        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 mb-5 flex items-start gap-3">
          <span className="text-[11px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-border text-muted-foreground bg-muted flex-shrink-0 mt-0.5">Coming Soon</span>
          <p className="text-[13px] text-muted-foreground leading-relaxed">The TypeScript SDK is planned for Phase 3. For programmatic vault access today, use the MCP server (<code className="font-mono text-[11px] bg-muted px-1 rounded">https://gitbank.io/api/mcp</code>) from any MCP-compatible client or directly via the REST API.</p>
        </div>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
          The Gitbank SDK lets you embed vault operations into your own TypeScript or JavaScript project. Use it to build AI agents, automation scripts, CI/CD pipelines, or any tool that needs to interact with a Gitbank vault programmatically.
        </p>

        <SectionLabel>Install</SectionLabel>
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted"/><div className="w-2 h-2 rounded-full bg-muted"/><div className="w-2 h-2 rounded-full bg-muted"/>
            <span className="text-[11px] font-mono text-muted-foreground ml-1">terminal</span>
          </div>
          <pre className="text-[13px] font-mono text-foreground p-5">{`npm install @gitbank-agent/sdk`}</pre>
        </div>

        <SectionLabel>Basic usage</SectionLabel>
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted"/><div className="w-2 h-2 rounded-full bg-muted"/><div className="w-2 h-2 rounded-full bg-muted"/>
            <span className="text-[11px] font-mono text-muted-foreground ml-1">TypeScript</span>
          </div>
          <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap leading-relaxed">{`import { GitbankAgent } from "@gitbank-agent/sdk";

const agent = new GitbankAgent({
  githubToken: process.env.GITHUB_TOKEN,
});

// Check vault balance
const balance = await agent.balance();
console.log(balance);

// Deposit tokens
await agent.deposit({ amount: "10", token: "USDC" });

// Swap inside the vault
await agent.swap({ from: "USDC", to: "WETH", amount: "5" });

// Assign a bounty via IssueOps
await agent.assignBounty({
  repo: "acme-org/mobile-app",
  issue: 42,
  assignee: "alice",
  amount: "80",
  token: "USDC",
});`}</pre>
        </div>

        <SectionLabel>What you can build</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {[
            { title: "AI Agent Wallet", desc: "Give your autonomous agent a non-custodial vault it can fund itself, send payments, and receive bounties through." },
            { title: "CI/CD Auto-pay", desc: "Trigger bounty payouts automatically when tests pass or builds succeed, without any manual GitHub comment." },
            { title: "Bounty Bot", desc: "Build a custom bot that monitors your repos and assigns bounties to issues based on your own criteria or scoring logic." },
            { title: "Portfolio Dashboard", desc: "Pull real-time vault balances for multiple GitHub users and display them in your own internal tooling or analytics." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-4">
              <p className="text-[13px] font-semibold text-foreground mb-1 flex items-center gap-1">
                <ChevronRight size={12} className="text-primary flex-shrink-0" />
                {item.title}
              </p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <SectionLabel>MCP support</SectionLabel>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
          The SDK includes built-in Model Context Protocol (MCP) tools, so you can expose Gitbank vault operations directly to AI assistants like Claude, Cursor, or Windsurf. The AI can call <code className="font-mono text-[11px] bg-muted px-1 rounded">gitbank.deposit</code>, <code className="font-mono text-[11px] bg-muted px-1 rounded">gitbank.swap</code>, and other operations as native tools without any custom integration code.
        </p>

        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-start gap-3">
          <span className="text-[11px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-primary/40 text-primary bg-primary/10 flex-shrink-0 mt-0.5">npm</span>
          <div>
            <p className="text-[13px] font-semibold text-foreground mb-1">Open source on npm</p>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              Package: <a href="https://npmjs.com/package/@gitbank-agent/sdk" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">npmjs.com/package/@gitbank-agent/sdk</a>
              {" "} / Source: <a href="https://github.com/gitbankio/gitbank-sdk" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">github.com/gitbankio/gitbank-sdk</a>
            </p>
          </div>
        </div>
      </>
    ),
  },

  roadmap: {
    title: "Roadmap",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
          Seven phases that take Gitbank from a GitHub bot to a full financial operating system for contributors, AI agents, open-source teams, and Web3 protocols. All operations run on Base Mainnet (chainId 8453). Phases are directional, not fixed-date commitments.
        </p>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-4 mb-8">
          <p className="text-[11px] font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 mb-3">Live on Base Mainnet Today</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {[
              "GitVault: soul-bound, non-custodial vault on Base",
              "GitHub bot: @gitbankbot in any Issue or PR",
              "gitShield (deposit USDC/WETH)",
              "gitUnshield (withdraw to any address)",
              "gitSwap (Uniswap v3, 0.05% pool)",
              "gitSend (2-step commit-reveal transfer)",
              "GitBounty: assign, escrow, auto-payout on PR merge",
              "MCP server: Claude Desktop, Cursor, Grok",
              "Base MCP via EIP-5792 wallet_sendCalls",
              "Clanker token launchpad integration",
              "x402 agent payment protocol",
              "Gasless: relayer pays all gas, zero ETH needed",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-[12px] text-muted-foreground">
                <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8">
          {[
            {
              phase: "Phase 1",
              title: "AI Agent Economy",
              tag: "MCP as open protocol",
              status: "In progress",
              statusColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
              desc: "Expand MCP into a full open protocol: agent spending limits, Eliza OS plugin, Coinbase AgentKit native integration, Virtuals support, and agent-to-agent payment via x402. Any autonomous agent with a GitHub identity can manage its own vault.",
              color: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
              dot: "bg-blue-500",
            },
            {
              phase: "Phase 2",
              title: "DeFi Yield Layer",
              tag: "Idle vault funds working",
              status: "Planned",
              statusColor: "bg-muted text-muted-foreground",
              desc: "Route idle USDC/WETH in vaults to yield protocols on Base: Morpho Blue, Moonwell, Aave V3, Compound V3. Add cbETH liquid staking, Pendle yield tokenization, EigenLayer restaking via bridged wstETH, and opt-in Aerodrome LP positions. Yield accrues inside the vault.",
              color: "bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400",
              dot: "bg-violet-500",
            },
            {
              phase: "Phase 3",
              title: "Protocol SDK + gitNeo",
              tag: "From product to neobank infrastructure",
              status: "Planned",
              statusColor: "bg-muted text-muted-foreground",
              desc: "Publish @gitbank/sdk on npm. Launch gitNeo: virtual Mastercard powered by GitVault USDC. Pay for Claude credits, AWS, gift cards, or any service that accepts Mastercard. Issue team cards to contributors. Open webhook ecosystem and plugin standard for Linear, Jira, and GitLab.",
              color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
              dot: "bg-emerald-500",
            },
            {
              phase: "Phase 4",
              title: "Advanced Trading + Derivatives",
              tag: "Programmatic market access",
              status: "Planned",
              statusColor: "bg-muted text-muted-foreground",
              desc: "Open programmatic access to Base-native trading: Synthetix V3 perpetuals, Lyra Finance options, limit orders and DCA via keeper automation, stop-loss triggers, and portfolio rebalancing, all via @gitbankbot commands in GitHub or MCP tools.",
              color: "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400",
              dot: "bg-orange-500",
            },
            {
              phase: "Phase 5",
              title: "Gitbank Token Economy",
              tag: "Launchpad flywheel",
              status: "Planned",
              statusColor: "bg-muted text-muted-foreground",
              desc: "Paid token launchpad: creators buy 1% of their token supply and send it to the Gitbank treasury. Treasury distributions go to GITBANK holders proportionally. GitStake tiers amplify rewards. RWA integration: Ondo USDY and Backed bCSPX tokenized S&P500, both live on Base.",
              color: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
              dot: "bg-amber-500",
            },
            {
              phase: "Phase 6",
              title: "Privacy + Security Layer",
              tag: "Enterprise-grade confidentiality",
              status: "Planned",
              statusColor: "bg-muted text-muted-foreground",
              desc: "ZK privacy protocol on Base for shielded vault-to-vault transfers. Multi-sig org vaults anchored to GitHub Organization identity with N-of-M maintainer approval. Zero-trust payroll, bug bounty escrow platform, and on-chain audit trail for supply chain finance.",
              color: "bg-pink-500/10 border-pink-500/30 text-pink-600 dark:text-pink-400",
              dot: "bg-pink-500",
            },
            {
              phase: "Phase 7",
              title: "GitScore + Financial OS",
              tag: "Contributor identity + cross-chain",
              status: "Planned",
              statusColor: "bg-muted text-muted-foreground",
              desc: "Soul-bound GitScore NFTs accumulate with every bounty payout. Reputational collateral for undercollateralized lending. Fork royalty routing, DAO-native payroll streaming, cross-chain CCIP, and GitVault as the standard treasury primitive for all open-source AI agents on Base.",
              color: "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400",
              dot: "bg-rose-500",
            },
          ].map((p) => (
            <div key={p.phase} className={`rounded-xl border p-5 flex gap-5 items-start ${p.color}`}>
              <div className="flex-shrink-0 flex flex-col items-center gap-2 pt-0.5">
                <div className={`w-3 h-3 rounded-full ${p.dot}`} />
                <div className="w-px h-full bg-border" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="text-[11px] font-bold tracking-widest uppercase opacity-70">{p.phase}</span>
                  <span className="text-[11px] font-semibold opacity-80">{p.tag}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.statusColor}`}>{p.status}</span>
                </div>
                <p className="text-[15px] font-bold text-foreground mb-1">{p.title}</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-muted/30 px-5 py-4">
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            All phases are Base Mainnet only. No multi-chain complexity. One chain, one identity primitive, one security model. The roadmap is ordered by leverage: each phase makes the next one more powerful.
          </p>
        </div>
      </>
    ),
  },

  "roadmap-p1": {
    title: "Phase 1: AI Agent Economy",
    body: (
      <>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[13px] text-muted-foreground">MCP as open protocol for AI agents and IDEs</span>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 mb-6">
          <p className="text-[11px] font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 mb-2">Already Live</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
            {[
              "MCP server at /api/mcp (StreamableHTTP + SSE)",
              "Claude Desktop integration",
              "Cursor integration",
              "Grok early access",
              "Base MCP via EIP-5792",
              "x402 agent payment protocol",
              "10 core vault tools",
              "Gasless execution via relayer",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <span className="text-emerald-500 shrink-0">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
          Phase 1 expands the MCP server into a full open agent protocol: richer tool catalog, per-agent spending limits, native integration with the top AI agent frameworks on Base, and autonomous agent-to-agent payment. Any entity with a GitHub identity (human, bot, or autonomous agent) can operate a GitVault.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {[
            { title: "Richer MCP tool catalog", desc: "pay_contributor, check_vault_balance, create_bounty, finalize_transfer, list_projects, get_payout_history. Structured inputs with Zod validation. Streaming responses." },
            { title: "Agent spending limits", desc: "Vault owner sets a per-agent daily spending limit. Agent operates within that budget autonomously without requiring approval for each individual action." },
            { title: "Eliza OS plugin (official)", desc: "Native Gitbank plugin for Eliza OS (AI16z framework, 10k+ stars). Any Eliza agent on Base can manage a vault, pay contributors, and track bounties without custom integration code." },
            { title: "Coinbase AgentKit native", desc: "Official integration with Coinbase AgentKit. GitVault becomes the default treasury for AgentKit-powered agents on Base. Composable with existing AgentKit wallet actions." },
            { title: "Virtuals support", desc: "Integration with Virtuals Protocol framework. AI agents launched via Virtuals on Base can hold and manage GitVaults as their on-chain treasury." },
            { title: "Agent-to-agent payment", desc: "Autonomous agents pay and receive payment from other agents via x402 + EIP-3009 transferWithAuthorization. No API keys, no intermediary, settlement on Base in 2 seconds." },
            { title: "IDE integration", desc: "Claude Projects, Cursor, Windsurf, and VS Code can call gitbank.deposit, gitbank.swap, gitbank.pay natively. Developer asks budget status from inside their editor." },
            { title: "Autonomous treasury management", desc: "Agent receives a funding budget via GitVault, manages its own operational spending (infra, APIs, bounties), and reports balance via MCP tools to its supervisor agent." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-5">
              <p className="text-[13px] font-bold text-foreground mb-1.5">{item.title}</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-[15px] font-bold text-foreground mb-3">MCP tools: current + planned</h2>
        <div className="rounded-xl border border-border overflow-hidden mb-6">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border bg-muted/40"><th className="text-left px-4 py-2.5 font-semibold text-foreground">Tool</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Description</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Status</th></tr></thead>
            <tbody>
              {[
                ["get_vault_balance","Read WETH and USDC balance + vault address for a GitHub username","Live / Read"],
                ["get_transactions","Paginated on-chain transaction history for a vault","Live / Read"],
                ["get_project_status","Budget and task status for a named project","Live / Read"],
                ["list_repos","List repos where the Gitbank bot is installed for a user","Live / Read"],
                ["request_deposit","Stage a deposit; returns confirm_code to post on GitHub","Live / Write"],
                ["request_withdraw","Stage a withdrawal to destination; returns confirm_code","Live / Write"],
                ["request_swap","Stage a WETH/USDC swap; returns confirm_code","Live / Write"],
                ["request_transfer","Stage a transfer to another user's vault; returns confirm_code","Live / Write"],
                ["request_assign_bounty","Stage bounty assignment on an issue; returns confirm_code","Live / Write"],
                ["request_launch_token","Stage a Clanker token launch (MCP-exclusive); returns confirm_code","Live / Write"],
                ["check_pending","Poll confirm_code status: pending / confirmed / executed / expired","Live / Read"],
                ["set_agent_limit","Per-agent daily spending cap (vault owner grants explicit budget)","Planned"],
              ].map(([t, d, s], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 font-mono text-primary text-[11px]">{t}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{d}</td>
                  <td className={`px-4 py-2.5 text-[11px] font-semibold ${s.startsWith("Live") ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },

  "roadmap-p2": {
    title: "Phase 2: DeFi Yield Layer",
    body: (
      <>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[13px] text-muted-foreground">Idle vault funds earning yield while contributors wait for bounties</span>
        </div>

        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
          A vault holding 1,000 USDC in bounty escrow earns nothing today. Phase 2 changes that: idle assets route to yield protocols on Base automatically, contributors receive payouts in their preferred token, and advanced users can access liquid staking and LP positions. Everything stays inside the vault contract with no change to the bot interface.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {[
            { title: "Morpho Blue (Base)", desc: "Default yield routing for idle USDC. Morpho Blue markets on Base offer peer-to-peer optimized rates. MetaMorpho vaults curated by Gauntlet and B.Protocol for risk management. Estimated APY: 5-9%." },
            { title: "Moonwell (Base native)", desc: "Base's largest lending protocol by TVL. Compound V2 fork backed by Coinbase Ventures. USDC and WETH supply markets. Simple integration with audited contracts and deep liquidity." },
            { title: "Aave V3 (Base)", desc: "Multi-asset lending market. Supply USDC or WETH, earn aToken yield. E-mode for correlated assets. Proven security track record across multiple chains." },
            { title: "Compound V3 Comet (Base)", desc: "USDC-base market on Base. Single-asset supply, simple interest accrual. No governance token complexity. Preferred option for risk-conservative vaults." },
            { title: "cbETH liquid staking", desc: "Coinbase's cbETH is native to Base. Vault deposits WETH and receives cbETH, earning ETH staking yield (~3.5% APY) while maintaining liquidity. Redeemable any time." },
            { title: "Pendle yield tokenization (Base)", desc: "Split yield-bearing assets into Principal Tokens and Yield Tokens. Lock in a fixed APY today by selling the YT. Vault can hold PT positions for predictable yield." },
            { title: "EigenLayer restaking", desc: "wstETH bridged to Base can be restaked via EigenLayer for additional AVS security rewards on top of base staking yield. Opt-in, high-risk tier." },
            { title: "Aerodrome LP (advanced)", desc: "Opt-in liquidity provision on Aerodrome, the leading DEX on Base by volume. Vault holds LP position, earns swap fees and AERO emissions. Advanced tier requiring manual opt-in." },
            { title: "Auto-swap on payout", desc: "Contributor sets a preferred output token. When a bounty pays out, the vault swaps automatically via Uniswap v3 before releasing to the recipient. Zero extra steps." },
            { title: "Multi-token whitelist expansion", desc: "Governance vote to expand supported ERC-20s beyond WETH and USDC. Token proposals go through a 7-day voting window using GITBANK token weight." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-5">
              <p className="text-[13px] font-bold text-foreground mb-1.5">{item.title}</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-[15px] font-bold text-foreground mb-3">Yield sources (Base Mainnet only)</h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border bg-muted/40"><th className="text-left px-4 py-2.5 font-semibold">Protocol</th><th className="text-left px-4 py-2.5 font-semibold">Asset</th><th className="text-left px-4 py-2.5 font-semibold">Est. APY</th><th className="text-left px-4 py-2.5 font-semibold">Risk</th><th className="text-left px-4 py-2.5 font-semibold">Opt-in</th></tr></thead>
            <tbody>
              {[
                ["Morpho Blue","USDC","5-9%","Low","Default"],
                ["Moonwell","USDC / WETH","4-7%","Low","Default"],
                ["Aave V3","USDC / WETH","3-6%","Low","Default"],
                ["Compound V3","USDC","3-5%","Low","Default"],
                ["cbETH staking","WETH","3-4%","Low","Manual"],
                ["Pendle PT","USDC / WETH","Fixed","Medium","Manual"],
                ["EigenLayer","wstETH","+1-3%","High","Manual"],
                ["Aerodrome LP","WETH/USDC","8-20%","Medium","Manual"],
              ].map(([p, a, y, r, o], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 font-medium text-foreground">{p}</td>
                  <td className="px-4 py-2.5 text-muted-foreground font-mono text-[11px]">{a}</td>
                  <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">{y}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{r}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{o}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },

  "roadmap-p3": {
    title: "Phase 3: Protocol SDK + gitNeo",
    body: (
      <>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[13px] text-muted-foreground">From product to neobank infrastructure</span>
        </div>

        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
          Phase 3 ships gitNeo, Gitbank's neobank layer. Issue virtual Mastercards loaded from your GitVault USDC balance. Pay for Claude credits, AWS, gift cards, Figma, or any service that accepts Mastercard. Issue team cards to contributors with per-card spending limits. The SDK also ships on npm so any platform can integrate Gitbank vault primitives.
        </p>

        <h2 className="text-[15px] font-bold text-foreground mb-3">Developer Infrastructure</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {[
            { title: "Protocol SDK on npm", desc: "Package: @gitbank/sdk. Wraps vault primitives: deploy, deposit, withdraw, swap, create_project, assign_bounty, finalize_payout. Typed with Zod. Works in Node.js and browser." },
            { title: "Webhook ecosystem", desc: "Third-party apps subscribe to vault events: bounty_created, payout_triggered, swap_executed, project_created. HMAC-signed payloads delivered to registered endpoints." },
            { title: "Plugin standard", desc: "Defined interface for external platforms. A Linear or Jira plugin triggers a bounty assignment from a ticket status change without writing custom API code." },
            { title: "Revenue model", desc: "30bps swap fee already live. Phase 3 adds fee-per-bounty-payout (flat rate), org workspace subscriptions (monthly), and plugin partner revenue sharing." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-5">
              <p className="text-[13px] font-bold text-foreground mb-1.5">{item.title}</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-[15px] font-bold text-foreground mb-3">gitNeo Neobank</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {[
            { title: "Virtual Mastercard issuance", desc: "@gitbankbot issue-card 200 USDC provisions a virtual Mastercard loaded from your GitVault balance. Use it anywhere Mastercard is accepted online. No bank account required." },
            { title: "Pay any service with crypto", desc: "Top up Claude API credits, buy AWS credits, pay Figma, Vercel, Linear, or purchase gift cards. Your USDC converts to fiat at the point of payment, invisible to the merchant." },
            { title: "Auto-reload from vault", desc: "Set a minimum balance threshold. When card balance drops below it, gitNeo automatically pulls USDC from your GitVault to reload. Zero manual top-ups." },
            { title: "Team cards for contributors", desc: "Issue disposable virtual cards to contributors from your vault with per-card spending limits and expiry dates. Revoke instantly via @gitbankbot revoke-card." },
            { title: "GitHub-native expense tracking", desc: "Every card transaction posts a receipt comment to the originating GitHub Issue. Full audit trail on-chain and in your GitHub thread." },
            { title: "No bank, no KYC", desc: "gitNeo is anchored to your GitHub ID and GitVault. No bank account, no SSN, no credit check. Your vault balance is your credit limit." },
            { title: "Recurring card stipends", desc: "Set up automatic monthly card reloads via GitHub Actions cron. Covers contributor tooling budgets, SaaS subscriptions, and team spending allowances." },
            { title: "Instant card revocation", desc: "Any unspent balance on a revoked card returns to your GitVault on-chain immediately. Zero loss, zero friction, zero paperwork." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-5">
              <p className="text-[13px] font-bold text-foreground mb-1.5">{item.title}</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-[15px] font-bold text-foreground mb-3">Webhook event types</h2>
        <div className="flex flex-col gap-2">
          {[
            ["bounty_created", "A new bounty was locked on an issue"],
            ["payout_triggered", "A PR merged and a bounty payout was initiated"],
            ["payout_confirmed", "The on-chain transaction was confirmed"],
            ["swap_executed", "A gitSwap completed inside a vault"],
            ["deposit_confirmed", "A vault deposit settled on Base"],
            ["transfer_initiated", "Step 1 of a 2-step transfer was committed"],
            ["transfer_finalized", "Step 2 confirmed and funds released"],
            ["project_created", "A new project workspace was opened"],
            ["payment_received", "A merchant payment settled from a customer vault"],
            ["invoice_paid", "A GitHub Issues invoice was settled on-chain"],
            ["dca_executed", "A scheduled DCA swap completed"],
          ].map(([event, desc]) => (
            <div key={event} className="flex gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
              <code className="font-mono text-[11px] text-primary w-48 flex-shrink-0">{event}</code>
              <span className="text-[12px] text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },

  "roadmap-p4": {
    title: "Phase 4: Advanced Trading + Derivatives",
    body: (
      <>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[13px] text-muted-foreground">Programmatic market access via @gitbankbot commands and MCP tools, Base only</span>
        </div>

        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
          Phase 4 opens the vault to sophisticated market operations: perpetuals via Synthetix V3, options via Lyra Finance, automated DCA and limit orders via keeper networks, and stop-loss protection. All executed on Base Mainnet through the same @gitbankbot bot interface or MCP tools, with no separate wallet, account, or gas required.
        </p>

        <h2 className="text-[15px] font-bold text-foreground mb-3">Perps and Derivatives (Base)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {[
            { title: "Synthetix V3 perpetuals", desc: "Synthetix Andromeda is live on Base. Open leveraged long or short positions on ETH, BTC, and more. @gitbankbot long 500 USDC ETH 2x → vault opens perp position via Synthetix V3 router." },
            { title: "Lyra Finance options", desc: "Lyra is live on Base. Buy call or put options for directional exposure or hedging. @gitbankbot hedge 1000 USDC ETH → vault buys put options sized to offset ETH exposure." },
            { title: "Limit orders via keeper", desc: "Submit a limit order from vault: buy 1 WETH at $2,800 USDC. A keeper network monitors Base Mainnet and executes the swap via Uniswap v3 when the price is hit." },
            { title: "DCA automation", desc: "@gitbankbot dca 100 USDC into WETH weekly. Vault executes recurring Uniswap v3 swaps on a schedule. Stops on command. No external account needed." },
            { title: "Stop-loss protection", desc: "@gitbankbot stoploss WETH at $2,400. Keeper triggers vault swap from WETH to USDC if price falls below threshold. Protects bounty value in volatile conditions." },
            { title: "Portfolio rebalancing", desc: "@gitbankbot rebalance 60% USDC 40% WETH. Vault calculates current allocation, swaps the delta via Uniswap v3, and reports the new allocation on-chain." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-5">
              <p className="text-[13px] font-bold text-foreground mb-1.5">{item.title}</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-[15px] font-bold text-foreground mb-3">Protocols (Base Mainnet only)</h2>
        <div className="rounded-xl border border-border overflow-hidden mb-6">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border bg-muted/40"><th className="text-left px-4 py-2.5 font-semibold">Protocol</th><th className="text-left px-4 py-2.5 font-semibold">Category</th><th className="text-left px-4 py-2.5 font-semibold">On Base?</th><th className="text-left px-4 py-2.5 font-semibold">Command</th></tr></thead>
            <tbody>
              {[
                ["Synthetix V3","Perpetuals","Live","@gitbankbot long / short"],
                ["Lyra Finance","Options","Live","@gitbankbot hedge / buy-option"],
                ["Uniswap v3","Spot + limit","Live","@gitbankbot swap / limit-buy"],
                ["1inch Fusion","Best-price aggregation","Live","@gitbankbot swap --best"],
                ["CoW Protocol","MEV-protected batch","Expanding","@gitbankbot swap --cow"],
                ["Keeper network","DCA / stop-loss","Planned","@gitbankbot dca / stoploss"],
              ].map(([p, c, s, cmd], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 font-medium text-foreground">{p}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{c}</td>
                  <td className={`px-4 py-2.5 text-[11px] font-semibold ${s === "Live" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>{s}</td>
                  <td className="px-4 py-2.5 font-mono text-primary text-[11px]">{cmd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-3">
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Security note:</strong> All positions are held inside the GitVault contract. Soul-bound design means a compromised GitHub session cannot drain a leveraged position. Only the authorized relayer can execute signed commands from the vault owner.
          </p>
        </div>
      </>
    ),
  },

  "roadmap-p5": {
    title: "Phase 5: Gitbank Token Economy",
    body: (
      <>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[13px] text-muted-foreground">Paid launchpad + RWA integration creates a self-reinforcing flywheel</span>
        </div>

        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
          Every token launched via Gitbank must have skin in the game. Creators buy 1% of their own token supply and send it to the Gitbank treasury. That treasury is distributed to GITBANK holders proportionally. Phase 5 also adds Real World Asset (RWA) positions into vaults: tokenized T-bills and equities, all live on Base.
        </p>

        <h2 className="text-[15px] font-bold text-foreground mb-3">Launchpad mechanics</h2>
        <div className="flex flex-col gap-3 mb-6">
          {[
            { step: "1", title: "Creator runs the launch command", desc: "@gitbankbot launch [name] [ticker] in a GitHub issue. Bot confirms Clanker parameters and calculates the 1% requirement." },
            { step: "2", title: "Creator buys 1% of supply", desc: "Before the token goes live, creator must purchase 1% of total supply using USDC or WETH from their GitVault. Enforced on-chain." },
            { step: "3", title: "1% sent to Gitbank treasury", desc: "Purchased tokens go directly to the Gitbank Treasury vault. The treasury contract is public and immutable." },
            { step: "4", title: "Treasury distributes to GITBANK holders", desc: "Distributions run on a 7-day epoch. Each holder receives a share proportional to their GITBANK balance at snapshot." },
            { step: "5", title: "Creator gets launch completion", desc: "Token goes live on Clanker with creator address set to their GitVault. Creator reputation score initialized." },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-amber-600 dark:text-amber-400">{item.step}</div>
              <div className="pb-5 border-b border-border/50 flex-1">
                <p className="text-[13px] font-semibold text-foreground mb-1">{item.title}</p>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-[15px] font-bold text-foreground mb-3">Real World Assets on Base</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {[
            { title: "Ondo USDY (Base)", desc: "Tokenized US Treasury yield from Ondo Finance, live on Base. Vault holds USDY to earn T-bill yield (~5% APY) on USDC. Full on-chain, redeemable any time. Lowest-risk RWA option." },
            { title: "Mountain USDM", desc: "Yield-bearing stablecoin backed by US Treasuries from Mountain Protocol. Multi-chain including Base. Vault earns T-bill rate on idle stablecoin with no lock-up period." },
            { title: "Backed bCSPX (Base)", desc: "Tokenized S&P 500 index (CSPX ETF) from Backed Finance, live on Base. Vault gains exposure to US equity markets without leaving the Base ecosystem. ERC-20 backed 1:1." },
            { title: "PAXG gold exposure", desc: "PAX Gold (PAXG) is available on Base via bridge. Each token represents 1 troy ounce of physical gold. Vault diversification into commodities without leaving on-chain." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-5">
              <p className="text-[13px] font-bold text-foreground mb-1.5">{item.title}</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-[15px] font-bold text-foreground mb-3">GitStake reward tiers</h2>
        <div className="rounded-xl border border-border overflow-hidden mb-6">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border bg-muted/40"><th className="text-left px-4 py-2.5 font-semibold">Tier</th><th className="text-left px-4 py-2.5 font-semibold">Min GITBANK staked</th><th className="text-left px-4 py-2.5 font-semibold">Multiplier</th><th className="text-left px-4 py-2.5 font-semibold">Extras</th></tr></thead>
            <tbody>
              {[
                ["Bronze","1,000 GITBANK","1.0x","Base distribution"],
                ["Silver","10,000 GITBANK","1.5x","Governance vote weight"],
                ["Gold","100,000 GITBANK","2.5x","Token whitelist proposals"],
              ].map(([t, m, r, e], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 font-semibold text-foreground">{t}</td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{m}</td>
                  <td className="px-4 py-2.5 text-primary font-semibold">{r}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Creator incentive:</strong> Creators who survive beyond 30 days with an active token community receive a reduced launchpad fee on their next launch and a Gold creator badge visible in the Gitbank UI.
          </p>
        </div>
      </>
    ),
  },

  "roadmap-p6": {
    title: "Phase 6: Privacy + Security Layer",
    body: (
      <>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[13px] text-muted-foreground">Enterprise-grade privacy and multi-party trust on Base</span>
        </div>

        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
          Every GitVault transaction is public on Base. Phase 6 adds an opt-in privacy layer via ZK: shielded vault-to-vault transfers where only the parties involved can see the amount and recipient. It also introduces org-level multi-sig vaults, a zero-trust payroll system, and a native bug bounty escrow platform for security researchers.
        </p>

        <h2 className="text-[15px] font-bold text-foreground mb-3">Privacy Layer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {[
            { title: "ZK private transfers (Base)", desc: "ZK is deployed on Base. Vault-to-vault transfers can be routed through ZK's zkSNARK shield, hiding the amount and recipient from public block explorers. On-chain validity is preserved; only the data is private." },
            { title: "Private bounty payouts", desc: "Enterprise clients paying contributors don't want competitors to know their compensation rates. ZK-shielded payouts settle on-chain without revealing amounts publicly. Audit trail available only to vault owners." },
            { title: "Shielded treasury management", desc: "Org vaults can hold and move assets privately. Competitive strategy (how much budget a team allocates to specific contributors or projects) stays confidential while remaining verifiable to authorized parties." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-5">
              <p className="text-[13px] font-bold text-foreground mb-1.5">{item.title}</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-[15px] font-bold text-foreground mb-3">Multi-sig Org Vaults</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {[
            { title: "GitHub Org identity", desc: "A GitHub Organization maps to one Org Vault. The vault is controlled by N-of-M GitHub maintainer accounts, each signing via the same soul-bound mechanism as individual vaults." },
            { title: "N-of-M approval via GitHub", desc: "Spending above a threshold requires M-of-N maintainer approval in GitHub comments. Bot counts approvals, verifies identities on-chain, and executes when quorum is reached. Immutable governance record in Issues." },
            { title: "Zero-trust payroll", desc: "Company deploys org vault, contributors deploy personal vaults. Monthly payroll goes through GitHub-approved vault transfers. No private key can unilaterally move funds. Audit trail is the GitHub Issues thread." },
            { title: "Supply chain finance", desc: "Vendor submits invoice via GitHub Issue. N-of-M maintainer approval in comments authorizes payment. Bot executes vault transfer. Zero invoice fraud because payment is tied to verified GitHub Org identity." },
            { title: "Bug bounty platform", desc: "Security researchers submit findings via private GitHub Issue. Triagers approve via comment. Escrow in vault releases automatically on fix merge. Replaces HackerOne/Immunefi with native GitHub flow and on-chain settlement." },
            { title: "RegTech audit trail", desc: "Every transaction is linked to a GitHub Issue or PR. Regulators and auditors can verify the complete financial history of an org vault by reading GitHub alone, with no blockchain explorer required." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-5">
              <p className="text-[13px] font-bold text-foreground mb-1.5">{item.title}</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-pink-500/20 bg-pink-500/5 px-4 py-3">
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Why ZK on Base:</strong> ZK is already deployed and audited on Base. It uses zkSNARK proofs so transfers are valid on-chain even though the amounts are hidden. This is not mixing or obfuscation. It is cryptographically private but still verifiable by the parties involved.
          </p>
        </div>
      </>
    ),
  },

  "roadmap-p7": {
    title: "Phase 7: GitScore + Financial OS",
    body: (
      <>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[13px] text-muted-foreground">On-chain contributor identity and GitVault as the financial OS for open-source</span>
        </div>

        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
          GitHub contribution graphs can be faked. GitScore cannot. Every bounty payout creates an immutable on-chain record: contributor GitHub User ID, PR hash, amount earned, project address, timestamp. Phase 7 also adds DAO-native payroll streaming, cross-chain reachability via Chainlink CCIP, and reputation-based undercollateralized lending, making GitVault the financial operating system for all open-source internet.
        </p>

        <h2 className="text-[15px] font-bold text-foreground mb-3">GitScore Identity</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {[
            { title: "GitScore NFT", desc: "Soul-bound NFTs auto-minted at contribution milestones: 100 USDC earned, 10 bounties settled, 5 different repos. Non-transferable. Stays on the contributor's record forever. Cannot be bought, sold, or delegated." },
            { title: "On-chain contribution proof", desc: "Each payout event links the PR number, vault addresses, and settled amount on Base Mainnet. Any third party can verify a contributor's history with a single contract read. No centralized database." },
            { title: "Reputational collateral", desc: "Lending protocols use GitScore as a trust signal. A developer with 50 settled bounties and consistent on-chain history can borrow against their reputation without overcollateralizing." },
            { title: "Access gating", desc: "Project owners set a minimum GitScore to apply for high-value bounties. Filters out bots and low-effort applications without requiring KYC or manual review." },
            { title: "Fork royalties", desc: "When a repo is forked and earns bounties under the fork, the original repo author receives a configurable royalty percentage routed automatically by the vault contract." },
            { title: "Cross-protocol portability", desc: "GitScore is a standard on Base. Other DeFi protocols, DAOs, and grant programs read contributor history directly from the contract without Gitbank involvement." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-5">
              <p className="text-[13px] font-bold text-foreground mb-1.5">{item.title}</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-[15px] font-bold text-foreground mb-3">Financial OS Layer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {[
            { title: "DAO-native payroll streaming", desc: "DAOs stream salaries to contributor GitVaults per second using Sablier or Superfluid on Base. Contributor can withdraw earned amount any time. No monthly batch, no bank account needed." },
            { title: "Cross-chain CCIP", desc: "Chainlink CCIP lets GitVault receive and send assets from other EVM chains (Arbitrum, Optimism, Ethereum mainnet) without leaving the vault model. One GitHub identity, multiple chain balances." },
            { title: "Reputation-based credit", desc: "Contributors with high GitScore can access undercollateralized loans from Maple Finance or Goldfinch using their on-chain contribution history as credit signal. No credit bureau, no KYC, no bias." },
            { title: "Protocol-owned vaults", desc: "DeFi protocols use GitVault to manage contributor rewards and grants. Treasury decisions go through GitHub Issues, executed on-chain. Combines DAO governance with GitHub-native workflow." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-5">
              <p className="text-[13px] font-bold text-foreground mb-1.5">{item.title}</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-[15px] font-bold text-foreground mb-3">GitScore milestone tiers</h2>
        <div className="rounded-xl border border-border overflow-hidden mb-6">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border bg-muted/40"><th className="text-left px-4 py-2.5 font-semibold">Milestone</th><th className="text-left px-4 py-2.5 font-semibold">Condition</th><th className="text-left px-4 py-2.5 font-semibold">NFT issued</th></tr></thead>
            <tbody>
              {[
                ["First Commit","First bounty settled on-chain","GitScore Genesis"],
                ["Century","100 USDC total earned","GitScore 100"],
                ["Multiproject","Bounties from 5+ distinct repos","GitScore Multi"],
                ["Veteran","50+ bounties settled lifetime","GitScore Veteran"],
                ["Grand","10,000 USDC lifetime earned","GitScore Grand"],
              ].map(([m, c, n], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2.5 font-semibold text-foreground">{m}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{c}</td>
                  <td className="px-4 py-2.5 font-mono text-primary text-[11px]">{n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3">
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">The end state:</strong> GitVault becomes the financial primitive for all open-source internet. Every contributor, AI agent, DAO, and protocol that operates through GitHub has a verified, non-custodial, programmable treasury, anchored to identity, secured by soul-bound design, and composable with every DeFi protocol on Base.
          </p>
        </div>
      </>
    ),
  },

  faq: {
    title: "FAQ",
    body: (
      <>
        <div className="space-y-5">
          {[
            { q:"Can I use Gitbank from Claude Desktop, Cursor, or Grok?", a:"Yes. Gitbank has a live MCP (Model Context Protocol) server at https://gitbank.io/api/mcp. Add it to your MCP client config and you can check balances and read vault data without visiting GitHub. Write operations (deposit, withdraw, swap) still require a GitHub confirm step: the AI client receives a confirm_code, then you or your bot posts @gitbankbot confirm <code> in any GitHub issue. See the MCP Clients section for setup instructions." },
            { q:"What is Base MCP and how is it different from the standard MCP?", a:"Standard MCP routes vault operations through the Gitbank Relayer, which pays gas and broadcasts transactions on your behalf. Base MCP uses EIP-5792 wallet_sendCalls to return unsigned transaction batches to your wallet (Coinbase Wallet or Smart Wallet). You sign and submit directly. No Relayer, no GitHub account required, and you can batch multiple calls atomically. Use the URL https://gitbank.io/api/mcp?mode=base to activate Base MCP mode." },
            { q:"Can an AI agent using MCP drain my vault?", a:"No. The same security model that protects the GitHub bot applies to MCP. Every write operation (deposit, withdraw, swap) requires a valid GitHub OAuth session linked to the vault owner GitHub User ID, plus a short-lived relayer signature (5-minute expiry) issued by the Gitbank server after verifying the session. Soul-bound gitTokens have no transfer or approve function, so even if an MCP session were hijacked, EVM-level draining is structurally impossible." },
            { q:"Do I need MetaMask or any wallet to use Gitbank?", a:"No. You operate your vault entirely through GitHub issue comments or MCP clients. No external wallet is required. If you use Base MCP mode (EIP-5792), you do need a Coinbase Wallet or Smart Wallet to sign and submit transactions, but this is optional." },
            { q:"What happens if my GitHub account is compromised?", a:"An attacker who controls your GitHub account can post commands in your name. However, the Gitbank server verifies each command arrives via GitHub's authenticated webhook and issues a short-lived relayer signature before executing anything on-chain. Soul-bound GitTokens have no transfer or approve function, so EVM-level phishing attacks cannot drain the vault regardless." },
            { q:"Can an AI agent have its own Gitbank vault?", a:"Yes. Any entity that can post comments on a GitHub repository, including humans, bots, and autonomous agents, can operate a Gitbank vault. The vault is anchored to a GitHub User ID, not to whether the operator is human. This makes Gitbank native to AI agent workflows that already use GitHub for coordination." },
            { q:"What languages does the bot understand?", a:"Any written language that Claude supports, which covers most major world languages including English, Indonesian, Japanese, Chinese (Simplified and Traditional), Spanish, French, German, Korean, Arabic, and many others. The bot always replies in English regardless of the input language." },
            { q:"What networks does Gitbank run on?", a:"Base Mainnet exclusively. Base is an OP Stack L2 built by Coinbase with approximately 2-second block times and gas costs consistently under $0.01 per transaction. Contracts are deployed and verified on Base Mainnet (chainId 8453). There are no plans to expand to other chains in the current roadmap." },
            { q:"Are the contracts audited?", a:"The contracts are live on Base Mainnet and verified on Basescan (Apache 2.0 license). A formal external security audit is planned as a follow-up milestone. The code is fully open source at github.com/gitbankio/contracts so anyone can review it. Exercise appropriate caution with amounts until a formal audit completes." },
            { q:"Who pays gas?", a:"The Gitbank Relayer pays all gas on behalf of users on every single operation. Users never need ETH for gas. The deployer wallet (which is also the feeCollector) covers all gas costs and is funded through protocol fees collected on gitShield, gitUnshield, and gitSwap operations." },
            { q:"How is the confidentiality of my intent preserved?", a:"GitHub issue comments are public by default. Anyone viewing the issue can see your commands. Gitbank does not encrypt comments. If you need privacy in your operations, post commands in a private GitHub repository that only you and the Gitbank App can access." },
            { q:"Can I have multiple vaults?", a:"No. One GitHub account maps to exactly one GitVault. The vault is anchored to your GitHub Permanent User ID, which is unique per account. You can create multiple GitHub accounts if you need multiple vaults, but this is not recommended." },
            { q:"What is the maximum amount I can deposit?", a:"There is no protocol-level cap on deposit amounts. The practical limit is the ERC-20 token supply on Base Mainnet." },
            { q:"How do I verify the vault contract on Basescan?", a:"The GitVault factory and implementation contracts are already verified on Basescan with Apache 2.0 license. Factory: 0xAA0a4ff46733EBaE8E658642A1314f18980fc77B. You can read the feeCollector address, the githubUserId anchor, and the nonce state variable directly from the verified contract at basescan.org." },
            { q:"What happens to my funds if Gitbank shuts down?", a:"The GitVault contract is non-custodial and continues to hold your assets regardless of whether the Gitbank team or bot service is operating. The emergencyWithdraw() function intentionally does not require a relayer signature, so the vault owner can always call it directly after 6 months of inactivity, without going through the bot." },
            { q:"Can I use Gitbank without the GitHub bot?", a:"Partially. The MCP server at https://gitbank.io/api/mcp lets you read balances and history without any GitHub interaction. Write operations (deposit, withdraw, swap) still require a GitHub confirm step: the MCP tool returns a confirm_code, and you post @gitbankbot confirm <code> in any GitHub issue where the bot is installed. If you want fully GitHub-free operation, use Base MCP mode (EIP-5792): it returns unsigned transaction batches that you sign and submit directly from a Coinbase Wallet, with no Relayer and no GitHub account required." },
            { q:"What tokens are supported?", a:"Gitbank supports USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913) and WETH (0x4200000000000000000000000000000000000006) on Base Mainnet only. These are the only two assets you can deposit, withdraw, or swap. The swap output whitelist is enforced both on-chain in the GitVault contract and in the Relayer to prevent other tokens from being routed through gitSwap." },
            { q:"Is there a mobile app?", a:"No. Gitbank is a GitHub-native protocol. You operate your vault through GitHub issue comments on desktop or mobile GitHub, through AI clients like Claude Desktop or Cursor that support MCP, or through Base MCP mode on Coinbase Wallet. A dedicated mobile app is not on the current roadmap." },
            { q:"How does the Relayer keep my funds safe?", a:"The Relayer uses a dual-signature model. Every vault operation requires both the vault owner keypair (encrypted with AES-256-GCM in the database, decrypted in memory for under 200ms per operation) and a short-lived ECDSA authorization signature from the Gitbank server (5-minute expiry). Neither key alone can execute a transaction. The deployer wallet that pays gas is entirely separate from vault keypairs." },
            { q:"What is the minimum deposit amount?", a:"The protocol-level minimum is set by the fee floor. MINIMUM_FEE = 1e5, which with USDC's 6 decimals equals $0.10. For gitShield (deposit) and gitUnshield (withdrawal) at 0.10% fee, the minimum applies for amounts under $100. For gitSwap at 0.30%, it applies under $33. In practice, any deposit above $10 is reasonable since the flat $0.10 fee is negligible at that scale." },
          ].map((item)=>(
            <div key={item.q} className="border-b border-border pb-5">
              <p className="text-[14px] font-semibold text-foreground mb-2">{item.q}</p>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
};

// ── Docs component ───────────────────────────────────────────────────────────

function SidebarNav({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  return (
    <>
      {docsSidebar.map((group, gi) => (
        <div key={group.group} className={`${gi > 0 ? "mt-6 pt-6 border-t border-border" : ""}`}>
          <p className="text-[11px] font-extrabold tracking-widest uppercase text-foreground px-2 mb-2">{group.group}</p>
          {group.items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`w-full text-left px-2 py-2 rounded-md text-[13px] transition-colors mb-0.5 ${activeId === item.id ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      ))}
    </>
  );
}

export default function Docs() {
  const params = useParams<{ section?: string }>();
  const urlSection = params.section ?? "overview";
  const initialId = docContent[urlSection] ? urlSection : "overview";
  const [activeId, setActiveId] = useState(initialId);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const [, navigate] = useLocation();
  const active = docContent[activeId] ?? docContent["overview"];
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const id = params.section ?? "overview";
    if (docContent[id] && id !== activeId) {
      setActiveId(id);
    }
  }, [params.section]);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [activeId]);

  function handleSelect(id: string) {
    setActiveId(id);
    setDrawerOpen(false);
    navigate("/docs/" + id);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur-sm flex items-center px-4 md:px-6 gap-3 md:gap-8">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 font-semibold text-[15px] text-foreground tracking-tight">
          <img src="/logo.png" alt="Gitbank" className="w-6 h-6 rounded-md object-cover" />
          Gitbank
        </button>
        <nav className="hidden md:flex items-center gap-6 text-[13px] text-muted-foreground">
          <span className="font-medium text-foreground">Docs</span>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={toggle} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-[12px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            {dark ? <Sun size={13} /> : <Moon size={13} />}
            <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
          </button>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setDrawerOpen((v) => !v)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle navigation"
          >
            {drawerOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed left-0 top-14 bottom-0 z-40 w-72 bg-background border-r border-border overflow-y-auto py-6 px-4 md:hidden"
            >
              <SidebarNav activeId={activeId} onSelect={handleSelect} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-1 pt-14">
        {/* Desktop sidebar */}
        <aside className="hidden md:block fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-[248px] border-r border-border bg-background overflow-y-auto py-6 px-4">
          <SidebarNav activeId={activeId} onSelect={handleSelect} />
        </aside>

        {/* Main content */}
        <main ref={mainRef} className="flex-1 md:ml-[248px] min-h-[calc(100vh-3.5rem)] overflow-y-auto h-[calc(100vh-3.5rem)]">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="px-6 py-8 md:px-14 md:py-10 w-full"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-5 md:mb-6 tracking-tight leading-tight">{active.title}</h1>
            {active.body}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
