import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Check } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import DotGrid, { type PatternFn } from "@/components/DotGrid";

const timelinePattern: PatternFn = (c, r, cols, rows) => {
  const trackR = (rows - 1) * 0.55;
  const nodes = [0.07, 0.22, 0.38, 0.54, 0.70, 0.86].map(x => (cols - 1) * x);
  for (let i = 0; i < nodes.length; i++) {
    const d = Math.sqrt((c - nodes[i]) ** 2 + (r - trackR) ** 2);
    if (d < 2.0) return 3;
    if (d < 3.4) return 2;
  }
  if (Math.abs(r - trackR) <= 0.5) return 2;
  if (Math.abs(r - trackR) <= 1.5) return 1;
  return 0;
};

const LIVE_CHECKLIST = [
  "GitVault deploy (EIP-1167 minimal proxy clone)",
  "gitShield: deposit USDC or WETH into vault",
  "gitUnshield: withdraw to any address",
  "gitSwap: atomic Uniswap v3 swap inside vault",
  "gitSend: 2-step commit-reveal vault-to-vault transfer",
  "GitBounty: assign + auto-payout on PR merge",
  "GitHub bot responding to @gitbank mentions",
  "MCP server at /api/mcp (StreamableHTTP + SSE)",
  "Base Mainnet deployment (chainId 8453)",
  "Clanker integration: tokenize projects via @gitbank",
  "x402 protocol: agent-native HTTP payment layer",
  "Gasless relayer: deployer pays all gas, zero ETH needed by users",
];

const PHASES = [
  {
    phase: "Phase 1",
    status: "In progress",
    live: true,
    title: "Core Platform",
    items: LIVE_CHECKLIST,
  },
  {
    phase: "Phase 2",
    status: "Planned",
    live: false,
    title: "DeFi Yield Layer",
    items: ["Morpho Blue", "Moonwell", "Aave V3", "Compound V3", "cbETH staking", "Pendle yield tokenization", "EigenLayer restaking"],
  },
  {
    phase: "Phase 3",
    status: "Planned",
    live: false,
    title: "Protocol SDK + gitNeo",
    items: ["@gitbank/sdk on npm", "gitNeo virtual Mastercard", "Crypto neobank card issuance", "Pay any service with USDC", "GitHub Issues expense tracking"],
  },
  {
    phase: "Phase 4",
    status: "Planned",
    live: false,
    title: "Advanced Trading",
    items: ["Synthetix V3 perpetuals", "Lyra Finance options", "Keeper-based limit orders", "DCA automation", "Stop-loss triggers"],
  },
  {
    phase: "Phase 5",
    status: "Planned",
    live: false,
    title: "Token Economy",
    items: ["GITBANK token launchpad flywheel", "Ondo USDY tokenized T-bill", "Backed bCSPX (tokenized S&P500)", "GITBANK staking tiers"],
  },
  {
    phase: "Phase 6",
    status: "Planned",
    live: false,
    title: "Privacy + Security",
    items: ["Railgun private transfers", "GitHub Org multi-sig vaults", "N-of-M maintainer approval", "Zero-trust payroll", "Bug bounty escrow"],
  },
  {
    phase: "Phase 7",
    status: "Planned",
    live: false,
    title: "GitScore + Financial OS",
    items: ["GitScore on-chain reputation system", "Chainlink CCIP cross-chain", "Financial OS for open source"],
  },
];

export default function RoadmapPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        <div className="rounded-xl border border-border bg-muted/30 p-8 flex flex-col items-center mb-14">
          <DotGrid cols={72} rows={22} dotRadius={2.5} gap={2} patternFn={timelinePattern} />
          <div className="mt-7 text-center max-w-[640px]">
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Roadmap</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Gitbank Roadmap</h1>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              7 phases from core vault to full financial OS for open source. Base Mainnet only.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-5 py-3 text-[13px] text-amber-600 dark:text-amber-400 mb-10 flex items-start gap-2">
          <span className="font-bold mt-0.5">Note:</span>
          <span>Gitbank operates exclusively on Base Mainnet (chainId 8453). No other chains are planned at this time.</span>
        </div>

        <div className="flex flex-col gap-4 mb-14">
          {PHASES.map((item) => (
            item.live ? (
              <div key={item.phase} className="border border-emerald-500/40 bg-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                    {item.status}
                  </span>
                  <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">{item.phase}</span>
                </div>
                <h3 className="text-[18px] font-bold text-foreground mb-4">{item.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {item.items.map((feat) => (
                    <div key={feat} className="flex items-start gap-2">
                      <Check size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-[13px] text-muted-foreground">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div key={item.phase} className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50">
                    {item.status}
                  </span>
                  <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">{item.phase}</span>
                </div>
                <h3 className="text-[16px] font-bold text-foreground mb-3">{item.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                  {item.items.map((feat) => (
                    <div key={feat} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                      <span className="text-[12px] text-muted-foreground">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        <div className="flex justify-center mb-8">
          <Link href="/docs/roadmap" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-[14px] font-semibold hover:opacity-90 transition-opacity">
            View full roadmap docs <ArrowRight size={16} />
          </Link>
        </div>

      </motion.div>
    </PageWrapper>
  );
}
