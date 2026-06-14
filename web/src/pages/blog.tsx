import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";

const PHASE_COLORS: Record<string, string> = {
  "Phase 1": "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
  "Protocol": "text-primary bg-primary/10 border-primary/20",
  "Product": "text-primary bg-primary/10 border-primary/20",
  "Roadmap": "text-muted-foreground bg-muted border-border/50",
};

function PhaseTag({ label }: { label: string }) {
  const cls = PHASE_COLORS[label] ?? "text-muted-foreground bg-muted border-border/50";
  return (
    <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${cls}`}>
      {label}
    </span>
  );
}

const ARTICLES = [
  {
    date: "May 19, 2026",
    tags: ["Phase 1", "Product"],
    title: "Week 1 Recap: Gitbank Goes Live on Base Mainnet",
    excerpt: "Vaults deployed, first transactions executed on Base Mainnet. The gitSwap fix (gross vs net amountIn alignment) shipped same day. Relayer model proven under real load: deployer pays all gas, users pay zero ETH. MCP server live for AI agents.",
    body: [
      "On May 19, 2026, Gitbank deployed GitVaultFactory to Base Mainnet at 0xAA0a4ff46733EBaE8E658642A1314f18980fc77B. First vault clones created via EIP-1167 minimal proxy pattern.",
      "The gitSwap command surfaced a fee alignment bug on day one: the router was passed the gross amountIn while the vault only approved the net amount after fee collection. The fix (computeSwapNetAmount mirrors GitVault._collectFee) shipped within hours.",
      "Relayer model verified: all gas paid by the deployer account. Users executed gitShield, gitUnshield, and gitSwap with zero ETH in their wallets.",
      "MCP server deployed at /api/mcp. Claude Desktop, Cursor, and Grok confirmed working against the live server the same week.",
    ],
  },
  {
    date: "May 20, 2026",
    tags: ["Roadmap", "Protocol"],
    title: "Gitbank Roadmap: 7 Phases to Financial OS for Open Source",
    excerpt: "Phase 1 is live. Phases 2 through 7 take Gitbank from a vault + bounty tool to a full financial OS for GitHub teams: DeFi yield, gitNeo neobank card, advanced trading, token economy, privacy, and on-chain reputation.",
    body: [
      "Phase 1 (live): GitVault, gitShield, gitUnshield, gitSwap, gitSend, GitBounty, GitHub bot, MCP server, Clanker, x402, Base MCP, gasless relayer.",
      "Phase 2 (planned): DeFi yield via Morpho Blue, Moonwell, Aave V3, Compound V3, cbETH staking, Pendle yield tokenization, EigenLayer restaking.",
      "Phase 3 (planned): @gitbank/sdk on npm, gitNeo virtual Mastercard, crypto neobank card to pay any service with USDC.",
      "Phase 4 (planned): Synthetix V3 perps, Lyra options, limit orders, DCA, stop-loss triggers.",
      "Phase 5 (planned): GITBANK token economy, Ondo USDY, Backed bCSPX, staking tiers.",
      "Phase 6 (planned): Railgun private transfers, GitHub Org multi-sig vaults, N-of-M maintainer approval.",
      "Phase 7 (planned): GitScore on-chain reputation, Chainlink CCIP cross-chain, full financial OS.",
    ],
  },
];

export default function BlogPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Updates</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Gitbank Blog</h1>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-10 max-w-[640px]">
          News, technical deep dives, and roadmap updates from the core team.
        </p>

        <div className="flex flex-col gap-8 mb-14">
          {ARTICLES.map((article) => (
            <article key={article.title} className="border border-border/40 bg-card rounded-xl overflow-hidden">
              <div className="p-6 border-b border-border/40">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {article.tags.map((t) => <PhaseTag key={t} label={t} />)}
                  <span className="text-[12px] text-muted-foreground ml-1">{article.date}</span>
                </div>
                <h2 className="text-xl font-bold text-foreground mb-3">{article.title}</h2>
                <p className="text-[14px] text-muted-foreground leading-relaxed">{article.excerpt}</p>
              </div>
              <div className="p-6 bg-muted/20">
                <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-4">Article</p>
                <div className="flex flex-col gap-3">
                  {article.body.map((para, i) => (
                    <p key={i} className="text-[13px] text-muted-foreground leading-relaxed">{para}</p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="border border-border/40 bg-card rounded-xl p-8 text-center max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-foreground mb-3">Join the Conversation</h2>
          <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
            Get weekly updates directly from the team, participate in roadmap discussions, and help shape the future of Web3 IssueOps.
          </p>
          <a href="https://discord.com" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            Join Discord
          </a>
        </div>

      </motion.div>
    </PageWrapper>
  );
}
