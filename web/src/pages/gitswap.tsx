import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import DotGrid, { type PatternFn } from "@/components/DotGrid";
import { ArrowRightLeft, Shield, Zap, Lock, Activity } from "lucide-react";

const twinPattern: PatternFn = (c, r, cols, rows) => {
  const cy = (rows - 1) / 2;
  const lx = cols * 0.25, rx = cols * 0.75;
  const sig = cols * 0.15;
  const ld = Math.sqrt((c - lx) ** 2 + (r - cy) ** 2) / sig;
  const rd = Math.sqrt((c - rx) ** 2 + (r - cy) ** 2) / sig;
  const inBridge = Math.abs(r - cy) <= 1.2 && c > cols * 0.35 && c < cols * 0.65;
  if (inBridge) return 2;
  const v = Math.max(Math.exp(-(ld ** 2) / 2), Math.exp(-(rd ** 2) / 2));
  if (v > 0.82) return 3;
  if (v > 0.52) return 2;
  if (v > 0.16) return 1;
  return 0;
};

export default function GitSwapPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-14">
          <div className="mb-8">
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">gitSwap</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 max-w-[720px] leading-[1.1]">
              Trade Inside Your Vault
            </h1>
            <p className="text-[16px] text-muted-foreground leading-relaxed max-w-[600px] mb-6">
              Atomic swap inside your GitVault via Uniswap v3. Zero gas. One command: <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">@gitbank swap 100 USDC to WETH</code>
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-8 flex items-center justify-center">
            <DotGrid cols={80} rows={24} dotRadius={2.5} gap={2} patternFn={twinPattern} stretch />
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-border bg-card rounded-xl p-5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Lock size={16} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">1. Burn Input</h3>
              <p className="text-[13px] text-muted-foreground">Burn input GitToken from your vault balance.</p>
            </div>
            <div className="border border-border bg-card rounded-xl p-5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ArrowRightLeft size={16} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">2. DEX Swap</h3>
              <p className="text-[13px] text-muted-foreground">Swap via Uniswap v3 concentrated liquidity pools on Base Mainnet.</p>
            </div>
            <div className="border border-border bg-card rounded-xl p-5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Zap size={16} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">3. Mint Output</h3>
              <p className="text-[13px] text-muted-foreground">Mint output GitToken directly into your vault. All atomic.</p>
            </div>
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">Technical specs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div className="border border-emerald-500/40 bg-card rounded-xl p-5">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mb-3 inline-block">LIVE</span>
                <h3 className="font-semibold text-foreground mb-2">USDC &lt;&gt; WETH</h3>
                <p className="text-[13px] text-muted-foreground mb-4">
                  Trading enabled via 0.05% Uniswap v3 pool. This is the main pool on Base Mainnet.
                </p>
                <div className="text-[12px] font-mono text-muted-foreground bg-muted p-3 rounded-lg">
                  Whitelist: WETH + USDC only (enforced on-chain + relayer)
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="border border-border bg-card rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Shield size={16} className="text-primary" /> MEV Protection
                </h3>
                <p className="text-[13px] text-muted-foreground">
                  Relayer submits all transactions. 1% default slippage tolerance applied automatically.
                </p>
              </div>
              <div className="border border-border bg-card rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Activity size={16} className="text-primary" /> Protocol Fee
                </h3>
                <p className="text-[13px] text-muted-foreground mb-2">
                  0.30% swap fee (30 basis points), minimum $0.10. Fee collected in-token before swap.
                </p>
                <code className="text-[11px] font-mono text-muted-foreground block bg-muted p-2 rounded">
                  GitVault._collectFee(FEE_SWAP_BPS=30, MINIMUM_FEE=1e5)
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">Advanced Routing</h2>
          <p className="text-[14px] text-muted-foreground max-w-[600px] mb-6">
            Compared to Aerodrome LP pools, gitSwap uses Uniswap v3 concentrated liquidity for highly efficient swaps between major stablecoins and blue-chip assets.
          </p>
          <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default">
            <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50 mb-3 inline-block">Phase 4</span>
            <h3 className="font-semibold text-foreground mb-2">Advanced Trading Features</h3>
            <p className="text-[13px] text-muted-foreground">
              Synthetix V3 perpetuals, Lyra options, keeper-based limit orders, DCA automation, and stop-loss triggers built directly into the vault.
            </p>
          </div>
        </div>

      </motion.div>
    </PageWrapper>
  );
}