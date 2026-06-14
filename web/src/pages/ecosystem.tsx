import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import DotGrid, { type PatternFn } from "@/components/DotGrid";
import { Link } from "wouter";

const gridPat: PatternFn = (c, r, cols, rows) => {
  const cx = cols / 2, cy = rows / 2;
  const d = Math.sqrt((c - cx) ** 2 + (r - cy) ** 2);
  if (d < 2) return 3;
  if (d < 5) return 2;
  const gridX = c % 6;
  const gridY = r % 6;
  if (gridX === 0 && gridY === 0) return 3;
  if (gridX === 0 || gridY === 0) return 1;
  return 0;
};

const LIVE_PROTOCOLS = [
  { name: "Uniswap v3", desc: "Atomic swap inside vault (gitSwap)" },
  { name: "Clanker", desc: "Token launch via @gitbank mention" },
  { name: "Base Mainnet", desc: "L2 execution layer (chainId 8453)" },
  { name: "x402", desc: "Agent-native HTTP 402 payment protocol" },
  { name: "GitHub", desc: "Bot + webhooks + App authentication" },
];

const PLANNED_PROTOCOLS: { phase: string; name: string; desc: string }[] = [
  { phase: "Phase 2", name: "Morpho Blue", desc: "Vault yield via isolated lending markets" },
  { phase: "Phase 2", name: "Moonwell", desc: "Lending and borrowing on Base" },
  { phase: "Phase 2", name: "Aave V3", desc: "Supply/borrow with vault collateral" },
  { phase: "Phase 2", name: "Compound V3", desc: "cUSDCv3 yield from vault holdings" },
  { phase: "Phase 2", name: "cbETH staking", desc: "Coinbase Wrapped Staked ETH yield" },
  { phase: "Phase 2", name: "Pendle", desc: "Yield tokenization and fixed-rate strategies" },
  { phase: "Phase 2", name: "EigenLayer", desc: "ETH restaking for additional yield" },
  { phase: "Phase 3", name: "Shopify Plugin", desc: "Accept crypto payments in Shopify checkout" },
  { phase: "Phase 3", name: "WooCommerce Gateway", desc: "Vault-powered WooCommerce payments" },
  { phase: "Phase 4", name: "Synthetix V3", desc: "Perpetual futures from vault collateral" },
  { phase: "Phase 4", name: "Lyra Finance", desc: "On-chain options trading" },
  { phase: "Phase 5", name: "Ondo USDY", desc: "Tokenized T-bill yield in vault" },
  { phase: "Phase 5", name: "Backed bCSPX", desc: "Tokenized S&P 500 exposure" },
  { phase: "Phase 6", name: "Railgun", desc: "Private transfers with shielded balances" },
  { phase: "Phase 7", name: "Chainlink CCIP", desc: "Cross-chain vault asset bridging" },
];

export default function EcosystemPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        <div className="mb-14">
          <div className="mb-8">
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Ecosystem</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 max-w-[720px] leading-[1.1]">
              Built on Base. Integrated with Everything.
            </h1>
            <p className="text-[16px] text-muted-foreground leading-relaxed max-w-[620px] mb-6">
              Gitbank sits at the intersection of GitHub, Base Mainnet, and AI agents. A single soul-bound vault connecting human intent with machine execution.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-8 flex items-center justify-center overflow-hidden h-[160px]">
            <DotGrid cols={80} rows={16} dotRadius={2} gap={3} patternFn={gridPat} stretch />
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">Protocol Integrations</h2>

          <h3 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Live Now</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {LIVE_PROTOCOLS.map((p) => (
              <div key={p.name} className="border border-emerald-500/40 bg-card rounded-xl p-5">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mb-3 inline-block">LIVE</span>
                <h4 className="font-semibold text-foreground mb-1">{p.name}</h4>
                <p className="text-[12px] text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>

          <h3 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Planned</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLANNED_PROTOCOLS.map((p) => (
              <div key={p.name} className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default">
                <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50 mb-3 inline-block">{p.phase}</span>
                <h4 className="font-semibold text-foreground mb-1">{p.name}</h4>
                <p className="text-[12px] text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">AI Client Integrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-emerald-500/40 bg-card rounded-xl p-5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mb-3 inline-block">LIVE</span>
              <div className="flex gap-2 flex-wrap mt-2">
                <span className="px-3 py-1 bg-muted rounded-full text-[12px] font-medium border border-border text-foreground">Claude Desktop</span>
                <span className="px-3 py-1 bg-muted rounded-full text-[12px] font-medium border border-border text-foreground">Cursor</span>
                <span className="px-3 py-1 bg-muted rounded-full text-[12px] font-medium border border-border text-foreground">Grok</span>
              </div>
            </div>

            <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default flex flex-col gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50 mb-2 inline-block">Phase 1 Completion</span>
                <p className="text-[12px] text-foreground font-medium">ChatGPT Desktop, Gemini CLI, VS Code, GitHub Copilot, Kimi, WatsonX</p>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50 mb-2 inline-block">Phase 2</span>
                <p className="text-[12px] text-foreground font-medium">Eliza OS, AgentKit, Virtuals</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">Developer Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-emerald-500/40 bg-card rounded-xl p-5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mb-3 inline-block">LIVE</span>
              <h3 className="font-semibold text-foreground mb-1">MCP Server</h3>
              <p className="text-[13px] text-muted-foreground mb-3">Available natively via <code className="font-mono text-[11px] bg-muted px-1 rounded">/api/mcp</code></p>
              <Link href="/mcp" className="text-[12px] text-primary hover:underline">View docs</Link>
            </div>
            <div className="border border-emerald-500/40 bg-card rounded-xl p-5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mb-3 inline-block">LIVE</span>
              <h3 className="font-semibold text-foreground mb-1">GitHub App</h3>
              <p className="text-[13px] text-muted-foreground mb-3">Repo integrations and IssueOps</p>
              <Link href="/github-app" className="text-[12px] text-primary hover:underline">Install guide</Link>
            </div>
            <div className="border border-emerald-500/40 bg-card rounded-xl p-5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mb-3 inline-block">LIVE</span>
              <h3 className="font-semibold text-foreground mb-1">x402 SDK</h3>
              <p className="text-[13px] text-muted-foreground mb-3">Implement HTTP 402 payments</p>
              <Link href="/x402" className="text-[12px] text-primary hover:underline">Integration</Link>
            </div>
          </div>
        </div>

      </motion.div>
    </PageWrapper>
  );
}
