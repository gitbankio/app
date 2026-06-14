import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";

export default function FeesPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        
        {/* HEADER */}
        <div className="mb-14">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Transparent Protocol Fees
          </h1>
          <p className="text-[16px] text-muted-foreground leading-relaxed max-w-[600px] mb-6">
            All fees are taken in-token at execution time. No hidden charges.
          </p>
        </div>

        {/* LIVE FEES */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">Active Operations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { op: "gitShield (deposit)", fee: "0.10% of deposit", min: "Min: $0.05" },
              { op: "gitUnshield (withdraw)", fee: "0.10% of withdrawal", min: "Min: $0.05" },
              { op: "gitSwap", fee: "0.30% (30 bps)", min: "Min: $0.10" },
              { op: "gitSend", fee: "0 fee", min: "No minimum" },
              { op: "GitBounty assign", fee: "0 fee", min: "No minimum" },
              { op: "GitBounty payout", fee: "0 fee", min: "No minimum" },
            ].map((item, i) => (
              <div key={i} className="border border-emerald-500/40 bg-card rounded-xl p-5 flex flex-col items-start gap-2">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">LIVE</span>
                <h3 className="text-[15px] font-bold text-foreground mt-1">{item.op}</h3>
                <p className="text-[14px] text-primary font-medium">{item.fee}</p>
                <p className="text-[12px] text-muted-foreground">{item.min}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">Revenue model</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
              Protocol fees accumulate in the treasury. The fee collector address resides on Base Mainnet.
            </p>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Fee Collector</p>
              <code className="text-[12px] font-mono text-foreground break-all">0x1e660A9A1f1F08AFEF9c03c96D66260122464CF2</code>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">Zero Gas for Users</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed">
              The Relayer (deployer) pays all gas fees. Zero ETH is needed by the user. This frictionless experience is enabled by our meta-transaction architecture.
            </p>
          </div>
        </div>

        {/* PLANNED */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Planned Updates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { op: "GitBounty payout fee", fee: "0.50%", phase: "Phase 5" },
              { op: "Org subscription tier", fee: "Flat monthly fee", phase: "Phase 5" },
              { op: "SDK partner rev share", fee: "Revenue sharing", phase: "Phase 5" },
            ].map((item, i) => (
              <div key={i} className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default flex flex-col items-start gap-2">
                <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50">{item.phase}</span>
                <h3 className="text-[14px] font-bold text-foreground mt-1">{item.op}</h3>
                <p className="text-[13px] text-muted-foreground">{item.fee}</p>
              </div>
            ))}
          </div>
        </div>

      </motion.div>
    </PageWrapper>
  );
}
