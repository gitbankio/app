import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
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
            { tag: "On-Chain Banking", title: "Personal vault on Base L2", desc: "Deposit ETH, USDC, or WBTC. Assets are minted 1:1 as soul-bound gitTokens and held in a smart contract anchored to your GitHub identity. No wallet app required.", section: "gitlock" },
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
                  <FBox label="Claude Haiku" sub="returns JSON intent with confidence score" />
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
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-muted/40"><th className="text-left px-4 py-2.5 font-semibold text-foreground">Asset</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">GitToken</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Network</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Status</th></tr></thead>
            <tbody>
              {[["ETH","gitETH","Base L2","Supported"],["USDC","gitUSDC","Base L2","Supported"],["WBTC","gitWBTC","Base L2","Supported"],["Any ERC-20","gitXXX","Base L2","Via governance"]].map(([a,g,n,s],i)=>(
                <tr key={i} className="border-b border-border/50 last:border-0"><td className="px-4 py-2.5 text-foreground font-medium">{a}</td><td className="px-4 py-2.5 font-mono text-primary text-[12px]">{g}</td><td className="px-4 py-2.5 text-muted-foreground">{n}</td><td className="px-4 py-2.5 text-muted-foreground">{s}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },

  "how-it-works": {
    title: "How It Works",
    body: (
      <>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
          Every Gitbank operation follows the same authenticated pipeline. Understanding this pipeline explains both how to use the system and why it is safe. Claude Haiku parses the intent in any language, a confidence score gates execution, and the Relayer submits the transaction with the deployer wallet paying gas.
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
                  <FBox label="Step 3: Claude Haiku" sub="returns structured JSON intent + confidence" />
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
            <strong className="text-foreground">Bot-first onboarding:</strong> If you already have the bot installed in a repo, just mention <code className="font-mono text-[11px] bg-muted px-1 rounded">@gitbankbot balance</code> in any issue. The bot automatically deploys your vault on Base Mainnet (deployer pays gas) and replies with your new vault address. No dashboard visit required.
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
            desc: "Go to gitbank.io and click Sign in with GitHub, then open the Repos page and click Add Repos. You will be redirected to the GitHub App installation page where you select which repositories @gitbankbot should access. GitHub redirects you back once done. Alternatively, visit github.com/apps/gitbankbot and install directly from GitHub.",
          },
          {
            step: "2",
            title: "Deploy your vault (bot or dashboard)",
            desc: "Your vault is created automatically the first time you use any bot command in an installed repo. Just comment @gitbankbot balance and the bot generates your keypair, deploys a GitVault smart contract on Base Mainnet bound to your GitHub User ID, and replies with your vault address. Gas is covered by the Gitbank deployer wallet. You can also trigger this from the dashboard by clicking Deploy Vault after signing in.",
          },
          {
            step: "3",
            title: "Fund your vault",
            desc: "Send WETH or USDC on Base Mainnet to your vault address. Once the deposit confirms on Base (typically 2 seconds) the assets are locked in your vault. All subsequent operations (deposit, withdraw, swap, send, create project, assign bounty) happen by mentioning @gitbankbot in any issue or PR comment in your connected repos.",
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
                ["Deposit, withdraw, swap, send", "GitHub issue or PR comment"],
                ["Create project, assign bounty", "GitHub issue or PR comment"],
                ["Auto-payout on PR merge", "Automatic - no action required"],
                ["Monitor balances and history", "gitbank.io dashboard (anytime)"],
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
                  <FBox label="Fee deduction" sub="fee = max(amount x 0.10%, $0.05 minimum)" />
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
  address token,
  // ERC-20 contract address (WETH or USDC)
  uint256 amount,
  // gross amount including fee
  uint256 deadline,
  // Unix timestamp, must be > block.timestamp
  uint256 nonce
  // must equal current vault nonce
) external nonReentrant`}</pre>
                </div>
              </div>

              <div>
                <SectionLabel>Fee examples</SectionLabel>
                <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">The fee is 0.10% of the deposit amount with a $0.05 minimum. For small deposits under $50, the minimum fee applies. For large deposits the percentage fee applies. The fee is deducted from your input, not added on top.</p>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-[13px]">
                    <thead><tr className="border-b border-border bg-muted/40"><th className="text-left px-4 py-2.5 font-semibold text-foreground">You send</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Fee</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Minted</th></tr></thead>
                    <tbody>
                      {[["20 USDC","$0.05 min","19.95 gitUSDC"],["100 USDC","0.10 USDC","99.90 gitUSDC"],["0.02 WETH","0.000020 WETH","0.019980 gitWETH"],["0.5 WETH","0.000500 WETH","0.499500 gitWETH"]].map(([a,f,m],i)=>(
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
                  <FBox label="Fee deducted from input" sub="fee = max(amount x 0.10%, $0.05)" />
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
  address token,
  // WETH or USDC to release
  uint256 amount,
  // GitToken amount to burn (fee deducted)
  address destination,
  // any wallet on Base Mainnet
  uint256 deadline,
  uint256 nonce
) external nonReentrant`}</pre>
                </div>
              </div>

              <div>
                <SectionLabel>Important rules</SectionLabel>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Destination", desc: "Any wallet address on Base Mainnet. Example: @gitbankbot withdraw 50 USDC to 0x1234.... If omitted, defaults to vault owner address. The destination is locked inside the owner signature and cannot be changed by the server." },
                    { label: "Fee from input", desc: "The 0.10% fee is deducted from the amount you specify. If you say withdraw 50 USDC, you pay a fee on 50 USDC and receive the net amount." },
                    { label: "Minimum fee", desc: "$0.05 minimum. For withdrawals under $50, the minimum fee applies instead of the percentage." },
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
  address tokenIn,
  // WETH or USDC to sell
  address tokenOut,
  // WETH or USDC to buy (whitelisted)
  uint256 amountIn,
  // gross amount (0.30% fee deducted first)
  uint256 minOut,
  // minimum output, reverts if not met
  uint256 deadline,
  uint256 nonce
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
                ["20 USDC", "$0.05 (minimum)", "19.95 gitUSDC"],
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
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
          Installing the Gitbank GitHub App on a repository requires a one-time payment of 1,000,000 GITBANK tokens per repo. This fee activates the IssueOps bot for that repository and funds the protocol treasury. The treasury automatically burns 25% of collected GITBANK and converts the remaining 75% to WETH via an on-chain swap.
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

        <h2 className="text-lg font-bold text-foreground mb-3">Install fee flow</h2>
        <FlowWrap>
          <div className="flex flex-col items-center">
            <FBox label="Owner installs Gitbank GitHub App on a repo" sub="via GitHub Marketplace or gitbank.xyz" />
            <FDown />
            <FBox label="Gitbank detects installation_repositories webhook" sub="new repo added to the app" />
            <FDown label="checks if install fee paid for this repo" />
            <FBox label="1,000,000 GITBANK deducted from owner's vault" sub="one-time per repo, non-refundable" accent />
            <FDown label="fee sent to treasury contract" />
            <FBox label="Repo activated" sub="IssueOps bot now responds to @gitbankbotbot in this repo" accent />
          </div>
        </FlowWrap>

        <h2 className="text-lg font-bold text-foreground mb-3">Treasury mechanics</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
          Every time the treasury reaches 100,000,000 GITBANK collected, an automated on-chain process runs:
        </p>
        <div className="flex flex-col gap-2 mb-6">
          {[
            { pct: "25%", label: "Burned", desc: "25,000,000 GITBANK sent to the zero address permanently. Reduces circulating supply and increases scarcity with each milestone." },
            { pct: "75%", label: "Swapped to WETH", desc: "75,000,000 GITBANK swapped to WETH via an on-chain DEX. The WETH is held in the protocol multisig to fund ongoing operations, audits, and community grants." },
          ].map((row) => (
            <div key={row.label} className="flex gap-4 rounded-lg border border-border bg-card px-4 py-3 items-start">
              <p className="text-2xl font-bold text-primary w-14 flex-shrink-0 leading-none mt-0.5">{row.pct}</p>
              <div>
                <p className="text-[13px] font-semibold text-foreground mb-0.5">{row.label}</p>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{row.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Install fee summary</h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-border bg-muted/40"><th className="text-left px-4 py-2.5 font-semibold text-foreground">Property</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Value</th></tr></thead>
            <tbody>
              {[
                ["Fee amount", "1,000,000 GITBANK per repository"],
                ["Frequency", "One-time per repo (not per install)"],
                ["Refundable", "No"],
                ["Who pays", "The GitHub account that installs the app on the repo"],
                ["Treasury trigger", "Every 100,000,000 GITBANK collected"],
                ["Burn amount", "25,000,000 GITBANK (25%) sent to 0x000...0000"],
                ["Swap amount", "75,000,000 GITBANK (75%) swapped to WETH"],
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
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">Gitbank charges protocol fees only on operations that move real value: deposits, withdrawals, swaps, and bounty payouts. Administrative operations (vault deployment, project creation, task assignment, transfers between vaults, keypair rotation) are all free. The Relayer covers gas costs on every transaction.</p>

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
                ["gitShield (deposit)","0.10%","$0.05","Relayer"],
                ["gitUnshield (withdrawal)","0.10%","$0.05","Relayer"],
                ["gitSwap","0.30%","$0.10","Relayer"],
                ["Transfer (vault-to-vault)","Free","-","Relayer"],
                ["Project creation","Free","-","Relayer"],
                ["Task bounty assignment","Free","-","Relayer"],
                ["Bounty payout on PR merge","0.20%","$0.05","Relayer"],
                ["Budget swap (project funds)","0.30%","$0.10","Relayer"],
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

        <h2 className="text-lg font-bold text-foreground mb-3">Fee distribution</h2>
        <div className="flex flex-col gap-2">
          {[["60%","Protocol treasury","Multisig wallet, funds audits, development, and bug bounties."],["30%","Relayer operating costs","Reimburses gas costs the Relayer subsidizes on every user transaction."],["10%","Community fund","Grants, ecosystem growth, and contributor rewards."]].map(([pct,label,desc])=>(
            <div key={label} className="flex gap-4 rounded-lg border border-border bg-card px-4 py-3 items-center">
              <p className="text-xl font-bold text-primary w-12 flex-shrink-0">{pct}</p>
              <div><p className="text-[13px] font-semibold text-foreground">{label}</p><p className="text-[12px] text-muted-foreground">{desc}</p></div>
            </div>
          ))}
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
                <p className="text-[13px] text-muted-foreground leading-relaxed">The deployer wallet is funded with ETH on Base Mainnet. All gas costs are deducted from this wallet. At Base Mainnet prices (under $0.01 per transaction), gas costs are minimal. The deployer is replenished through 30% of all protocol fees collected across gitShield, gitUnshield, and gitSwap operations.</p>
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
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">The feeCollector is a multi-signature wallet address hardcoded into each GitVault contract at deployment. All protocol fees are forwarded to this address immediately as part of the transaction that generates them. The address is immutable after deployment and cannot be changed by the Relayer, any single key, or the protocol team.</p>

        <h2 className="text-lg font-bold text-foreground mb-3">Fee routing flow</h2>
        <FlowWrap>
          <div className="flex flex-col items-center">
            <FBox label="gitShield / gitUnshield / gitSwap called" />
            <FDown label="fee calculated" />
            <FBox label="ERC-20 fee transferred to feeCollector" accent />
            <FDown label="same transaction" />
            <FBox label="Multi-sig wallet receives fee" sub="requires M-of-N signers" />
            <FDown label="governance vote" />
            <div className="flex items-start gap-4 flex-wrap justify-center">
              {[["60%","Treasury"],["30%","Relayer gas"],["10%","Community"]].map(([pct,label])=>(
                <div key={label} className="flex flex-col items-center gap-1">
                  <FBox label={label} sub={pct} dim />
                </div>
              ))}
            </div>
          </div>
        </FlowWrap>

        <h2 className="text-lg font-bold text-foreground mb-3">Immutability guarantee</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">Because the feeCollector address is set at deployment and marked immutable in the Solidity contract, no upgrade, admin key, or governance vote can redirect fees mid-operation. Users can verify the feeCollector address by reading the public state variable on Basescan before depositing any funds.</p>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-2 border-b border-border bg-muted/40"><span className="text-[11px] font-mono text-muted-foreground">GitVault.sol (excerpt)</span></div>
          <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`// Set at construction, never changes
address public immutable feeCollector;

constructor(address _feeCollector, ...) {
  feeCollector = _feeCollector;
  // ...
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

        <h2 className="text-lg font-bold text-foreground mb-3">Rate limits</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">The bot enforces a rate limit of 10 commands per hour per GitHub User ID. For agents that need higher throughput, call the GitVault contract directly on Base Mainnet using the agent vault's execution keypair and relayer authorization. See Contract Reference for details.</p>
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

        <h2 className="text-lg font-bold text-foreground mb-3">Option A: via GitHub comment (simple)</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">If your bot can authenticate to GitHub and post issue comments, this is the simplest path. Create a GitHub account for the bot, install the Gitbank App, and use the GitHub REST API to post commands.</p>
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

        <h2 className="text-lg font-bold text-foreground mb-3">Option B: direct contract call (advanced)</h2>
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
          <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`// Deposit: lock ERC-20, mint gitToken
function gitShield(address token, uint256 amount, uint256 deadline, uint256 nonce) external;

// Withdraw: burn gitToken, release ERC-20 to destination
function gitUnshield(address token, uint256 amount, address destination, uint256 deadline, uint256 nonce) external;

// Swap: burn input gitToken, swap via Uniswap v3, mint output gitToken
function gitSwap(address tokenIn, address tokenOut, uint256 amountIn, uint256 minOut, uint256 deadline, uint256 nonce) external;

// Transfer phase 1: commit hash
function initTransfer(bytes32 commitHash, uint256 deadline, uint256 nonce) external;

// Transfer phase 2: execute within 600s
function finalizeTransfer(address token, uint256 amount, address recipientVault, uint256 nonce) external;

// Emergency: callable by owner directly after 6 months inactivity
function emergencyWithdraw(address token, uint256 amount) external;`}</pre>
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
  functionName: "getVault",
  args: [BigInt(githubUserId)],
});

// Read WETH balance inside vault
const WETH = "0x4200000000000000000000000000000000000006";
const balance = await client.readContract({
  address: vaultAddr,
  abi: vaultAbi,
  functionName: "balances",
  args: [WETH],
});`}</pre>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Deploy a vault for any GitHub User ID</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="px-4 py-2 border-b border-border bg-muted/40"><span className="text-[11px] font-mono text-muted-foreground">GitVaultFactory.sol</span></div>
          <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap">{`// Deploy a minimal proxy vault for a given GitHub User ID
// Only the Gitbank relayer signer is authorized to call this
function deployVault(
  uint256 githubUserId,
  address owner,          // execution keypair address
  address relayerSigner   // Gitbank relayer authorization address
) external returns (address vault);

// Lookup vault by GitHub User ID (returns address(0) if not deployed)
function getVault(uint256 githubUserId) external view returns (address);`}</pre>
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
            ["GitVault","The smart contract deployed per user on Base L2. It locks real ERC-20 assets, mints and burns GitTokens, enforces identity-based permissions, and manages project workspaces."],
            ["GitToken","A soul-bound ERC-20-like token (gitETH, gitUSDC, gitWBTC) representing a position inside a GitVault. Cannot be transferred, approved, or moved by any external actor."],
            ["GitHub Permanent User ID","An immutable integer assigned by GitHub at account creation. Used as the identity anchor for every GitVault. Different from and more stable than a GitHub username."],
            ["Relayer","The Gitbank backend Node.js service that holds encrypted execution keypairs and broadcasts transactions to Base L2 on behalf of users. Covers all gas costs."],
            ["gitShield","The deposit operation. Locks real ERC-20 assets into GitVault and mints the equivalent GitTokens after deducting the 0.10% protocol fee."],
            ["gitUnshield","The withdrawal operation. Burns GitTokens and releases the underlying ERC-20 to the vault owner address after deducting the 0.10% fee. Requires dual-sig."],
            ["gitSwap","The exchange operation. Burns input GitTokens, routes underlying assets through Uniswap v3 SwapRouter02 on Base Mainnet, and mints output GitTokens. Output is restricted to WETH or USDC (whitelist enforced on-chain and in the relayer). 0.30% fee."],
            ["IssueOps","The pattern of operating infrastructure or financial systems through GitHub issue comments. Gitbank is an IssueOps-native protocol."],
            ["feeCollector","The immutable multi-sig wallet address that receives all protocol fees at the moment they are generated."],
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

  faq: {
    title: "FAQ",
    body: (
      <>
        <div className="space-y-5">
          {[
            { q:"Do I need MetaMask or any wallet to use Gitbank?", a:"No. You operate your vault entirely through GitHub issue comments. No external wallet is required at any point." },
            { q:"What happens if my GitHub account is compromised?", a:"An attacker who controls your GitHub account can post commands in your name. However, the Gitbank server verifies each command arrives via GitHub's authenticated webhook and issues a short-lived relayer signature before executing anything on-chain. Soul-bound GitTokens have no transfer or approve function, so EVM-level phishing attacks cannot drain the vault regardless." },
            { q:"Can an AI agent have its own Gitbank vault?", a:"Yes. Any entity that can post comments on a GitHub repository, including humans, bots, and autonomous agents, can operate a Gitbank vault. The vault is anchored to a GitHub User ID, not to whether the operator is human. This makes Gitbank native to AI agent workflows that already use GitHub for coordination." },
            { q:"What languages does the bot understand?", a:"Any written language that Claude Haiku supports, which covers most major world languages including English, Indonesian, Japanese, Chinese (Simplified and Traditional), Spanish, French, German, Korean, Arabic, and many others. The bot always replies in English regardless of the input language." },
            { q:"What networks does Gitbank run on?", a:"Base Mainnet exclusively. Base is an OP Stack L2 built by Coinbase with approximately 2-second block times and gas costs consistently under $0.01 per transaction. Contracts are deployed and verified on Base Mainnet (chainId 8453). There are no plans to expand to other chains in the current roadmap." },
            { q:"Are the contracts audited?", a:"The contracts are live on Base Mainnet and verified on Basescan (Apache 2.0 license). A formal external security audit is planned as a follow-up milestone. The code is fully open source at github.com/gitbankio/contracts so anyone can review it. Exercise appropriate caution with amounts until a formal audit completes." },
            { q:"Who pays gas?", a:"The Gitbank Relayer pays all gas on behalf of users on every single operation. Users never need ETH for gas. The Relayer is compensated via the fee distribution mechanism: 30% of all protocol fees fund the Relayer operating wallet." },
            { q:"How is the confidentiality of my intent preserved?", a:"GitHub issue comments are public by default. Anyone viewing the issue can see your commands. Gitbank does not encrypt comments. If you need privacy in your operations, post commands in a private GitHub repository that only you and the Gitbank App can access." },
            { q:"Can I have multiple vaults?", a:"No. One GitHub account maps to exactly one GitVault. The vault is anchored to your GitHub Permanent User ID, which is unique per account. You can create multiple GitHub accounts if you need multiple vaults, but this is not recommended." },
            { q:"What is the maximum amount I can deposit?", a:"There is no protocol-level cap on deposit amounts. The practical limit is the ERC-20 token supply on Base Mainnet." },
            { q:"How do I verify the vault contract on Basescan?", a:"The GitVault factory and implementation contracts are already verified on Basescan with Apache 2.0 license. Factory: 0xAA0a4ff46733EBaE8E658642A1314f18980fc77B. You can read the feeCollector address, the githubUserId anchor, and the nonce state variable directly from the verified contract at basescan.org." },
            { q:"What happens to my funds if Gitbank shuts down?", a:"The GitVault contract is non-custodial and continues to hold your assets regardless of whether the Gitbank team or bot service is operating. The emergencyWithdraw() function intentionally does not require a relayer signature, so the vault owner can always call it directly after 6 months of inactivity, without going through the bot." },
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
  const [activeId, setActiveId] = useState("overview");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const [, navigate] = useLocation();
  const active = docContent[activeId] ?? docContent["overview"];
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [activeId]);

  function handleSelect(id: string) {
    setActiveId(id);
    setDrawerOpen(false);
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
