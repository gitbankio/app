import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, FileCheck2, GitMerge, DollarSign, RefreshCcw } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import DotGrid, { type PatternFn } from "@/components/DotGrid";

const funnelPattern: PatternFn = (c, r, cols, rows) => {
  const mid = (cols - 1) / 2;
  const t = r / (rows - 1);
  const halfW = ((cols - 1) / 2) * (1 - t * 0.68);
  const dist = Math.abs(c - mid);
  if (dist > halfW) return 0;
  const edge = halfW - dist;
  if (edge < 1.3) return 3;
  if (t > 0.82) return 3;
  if (t > 0.65) return 2;
  const innerT = t % 0.18;
  if (innerT < 0.04) return 2;
  return 1;
};

export default function GitLockPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        
        {/* HERO */}
        <div className="mb-14">
          <div className="rounded-xl border border-border bg-muted/30 p-8 flex flex-col items-center">
            <DotGrid cols={72} rows={22} dotRadius={2.5} gap={2} patternFn={funnelPattern} />
            <div className="mt-7 text-center max-w-[640px]">
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">GitLock</p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
                Bounty Escrow for GitHub Teams
              </h1>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
                GitLock is the escrow system for GitHub project bounties. Assign bounties, hold funds securely, and auto-release on PR merge.
              </p>
              <Link href="/docs" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition-opacity">
                Start your first bounty <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* LIVE FEATURES */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">Live Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Assign Bounty", desc: "Use @gitbank assign 50 USDC to #issue to lock funds.", icon: DollarSign },
              { title: "Auto-Payout", desc: "Funds automatically release to the contributor when the PR merges.", icon: GitMerge },
              { title: "Reclaim", desc: "Reclaim funds back to the workspace if the task is abandoned.", icon: RefreshCcw },
              { title: "Multi-Bounty", desc: "Assign multiple distinct bounties per issue to different contributors.", icon: FileCheck2 },
            ].map((op, i) => (
              <div key={i} className="border border-emerald-500/40 bg-card rounded-xl p-5 flex flex-col items-start gap-3">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">LIVE</span>
                <op.icon size={20} className="text-primary" />
                <div>
                  <h3 className="text-[15px] font-bold text-foreground mb-1">{op.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{op.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PROJECT WORKSPACE */}
        <div className="mb-14 border border-emerald-500/40 bg-card rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-6 right-6">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">LIVE</span>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-3">Project workspace</h2>
          <p className="text-[14px] text-muted-foreground leading-relaxed max-w-[600px]">
            Create a dedicated project workspace with @gitbank commands. Track issue statuses, manage total budgets, and maintain complete oversight over all your open source or internal bounties directly from GitHub.
          </p>
        </div>

        {/* HOW IT WORKS & USE CASES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">How it works</h2>
            <ul className="space-y-4 text-[14px] text-muted-foreground">
              <li className="flex gap-3"><span className="text-primary font-bold">1.</span> Maintainer assigns a bounty in a GitHub comment.</li>
              <li className="flex gap-3"><span className="text-primary font-bold">2.</span> Funds are securely held in the vault escrow contract.</li>
              <li className="flex gap-3"><span className="text-primary font-bold">3.</span> The system automatically detects when the associated PR merges.</li>
              <li className="flex gap-3"><span className="text-primary font-bold">4.</span> Funds are auto-released, and an English receipt is posted back to the thread.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Use cases</h2>
            <div className="flex flex-wrap gap-2">
              {["Open Source Bounties", "Hackathon Prizes", "Contractor Payouts", "Bug Bounties"].map((uc) => (
                <span key={uc} className="px-3 py-1.5 rounded bg-muted/50 border border-border text-[13px] font-medium text-foreground">
                  {uc}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* PLANNED FEATURES */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Planned Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "DCA Bounty Pools", phase: "Phase 4" },
              { title: "Cross-Repo Bounty Routing", phase: "Phase 4" },
            ].map((op, i) => (
              <div key={i} className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default flex flex-col items-start gap-2">
                <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50">{op.phase}</span>
                <h3 className="text-[15px] font-bold text-foreground">{op.title}</h3>
              </div>
            ))}
          </div>
        </div>

      </motion.div>
    </PageWrapper>
  );
}
