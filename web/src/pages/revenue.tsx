import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import DotGrid, { type PatternFn } from "@/components/DotGrid";

const heroPattern: PatternFn = (c, r, cols, rows) => {
  const cx = cols / 2, cy = rows / 2;
  const d = Math.sqrt((c - cx) ** 2 + (r - cy) ** 2);
  if (d < 3) return 3;
  if (d < 6) return 2;
  return 1;
};

export default function RevenuePage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Protocol</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Protocol Revenue and GITBANK Token</h1>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-10 max-w-[640px]">
          Gitbank generates real protocol revenue from day 1. All fees flow directly to the on-chain treasury to support the long-term sustainability of the protocol.
        </p>

        <div className="rounded-xl border border-border bg-muted/30 p-8 flex items-center justify-center mb-12">
          <DotGrid cols={60} rows={20} dotRadius={2.5} gap={3} patternFn={heroPattern} stretch />
        </div>

        <h2 className="text-xl font-bold text-foreground mb-5">Current Revenue</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="border border-emerald-500/40 bg-card rounded-xl p-5">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">LIVE</span>
            <h3 className="font-semibold text-foreground mt-4 mb-2">gitShield</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">0.10% fee on all incoming deposits.</p>
          </div>
          
          <div className="border border-emerald-500/40 bg-card rounded-xl p-5">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">LIVE</span>
            <h3 className="font-semibold text-foreground mt-4 mb-2">gitUnshield</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">0.10% fee on all withdrawals.</p>
          </div>

          <div className="border border-emerald-500/40 bg-card rounded-xl p-5">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">LIVE</span>
            <h3 className="font-semibold text-foreground mt-4 mb-2">gitSwap</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">0.30% fee on in-vault swaps.</p>
          </div>
        </div>

        <div className="rounded-lg border border-border/40 bg-card px-5 py-4 mb-12">
          <p className="text-[13px] text-muted-foreground">
            All fees accumulate in the treasury at: <code className="text-primary font-mono text-[12px]">0x1e660A9A1f1F08AFEF9c03c96D66260122464CF2</code>
          </p>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-5">Future Tokenomics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default">
            <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50">Phase 5</span>
            <h3 className="font-semibold text-foreground mt-4 mb-2">GITBANK Token</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Token economy, staking tiers (Bronze/Silver/Gold), governance, and fee sharing with stakers.
            </p>
          </div>

          <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default">
            <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50">Phase 5</span>
            <h3 className="font-semibold text-foreground mt-4 mb-2">Launchpad Flywheel</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              1% of every token launch supply goes to the treasury. As the launchpad grows, the treasury grows.
            </p>
          </div>

          <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default">
            <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50">Phase 5</span>
            <h3 className="font-semibold text-foreground mt-4 mb-2">Treasury Dashboard</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              An on-chain view of cumulative fees, token distribution, and staker rewards.
            </p>
          </div>
        </div>

      </motion.div>
    </PageWrapper>
  );
}
