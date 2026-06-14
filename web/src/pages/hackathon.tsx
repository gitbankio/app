import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { Link } from "wouter";
import { Zap, HandCoins, ArrowRight } from "lucide-react";

export default function HackathonPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Infrastructure</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Build with Gitbank at Hackathons</h1>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-10 max-w-[640px]">
          Gitbank is the ultimate bounty infrastructure for hackathons. No escrow setup required, no complex payment rails to build. Just code and get paid.
        </p>

        <div className="border border-emerald-500/40 bg-card rounded-xl p-5 mb-10 max-w-2xl">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">LIVE</span>
          <h3 className="font-semibold text-foreground mt-4 mb-2">GitBounty Escrow</h3>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            GitBounty acts as a trustless escrow mechanism. Sponsors fund issues in USDC or WETH. Funds auto-release the moment the PR merges.
          </p>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-5">How Hackathons Use Gitbank</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="border border-border/40 bg-card rounded-xl p-5 relative">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mb-4">1</div>
            <h3 className="font-semibold text-foreground mb-2">Create Project</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">Sponsor creates a project using @gitbank commands.</p>
          </div>
          <div className="border border-border/40 bg-card rounded-xl p-5 relative">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mb-4">2</div>
            <h3 className="font-semibold text-foreground mb-2">Assign Bounties</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">Sponsor assigns USDC/WETH bounties to specific GitHub issues.</p>
          </div>
          <div className="border border-border/40 bg-card rounded-xl p-5 relative">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mb-4">3</div>
            <h3 className="font-semibold text-foreground mb-2">Fork & Build</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">Participants fork the repository and build the requested features.</p>
          </div>
          <div className="border border-border/40 bg-card rounded-xl p-5 relative">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mb-4">4</div>
            <h3 className="font-semibold text-foreground mb-2">Auto-Payout</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">Winner's PR merge auto-triggers the on-chain payout.</p>
          </div>
        </div>

        <div className="border border-border/40 bg-card rounded-xl p-8 mb-12 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground mb-3">Instant, Transparent Flow</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed">
              Prize flow is entirely on-chain, transparent, and instant. No more "we'll send you a check in 30 days" delays. The smart contract holds the funds, and the code merge releases them.
            </p>
          </div>
          <div className="flex items-center gap-4 text-primary">
            <HandCoins className="w-10 h-10" />
            <ArrowRight className="w-6 h-6 opacity-50" />
            <Zap className="w-10 h-10" />
          </div>
        </div>

        <div className="text-center">
          <Link href="/docs" className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            Run your hackathon on Gitbank
          </Link>
        </div>

      </motion.div>
    </PageWrapper>
  );
}
