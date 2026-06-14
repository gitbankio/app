import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { Github, Users } from "lucide-react";
import { Link } from "wouter";
import { useGetStats } from "@workspace/api-client-react";

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.518-8.587L1.655 2.25H8.08l4.213 5.567L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

export default function CommunityPage() {
  const { data: stats } = useGetStats();
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Community</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Join the Gitbank Community</h1>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-10 max-w-[640px]">
          Gitbank is built in public. Join the community driving Web3 IssueOps, shaping the roadmap, and contributing to the open-source protocol.
        </p>

        {/* Live stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { label: "Vaults Deployed", value: stats?.vaultsDeployed ?? 0 },
            { label: "Commands Processed", value: stats?.commandsProcessed ?? 0 },
            { label: "Tx On-Chain", value: stats?.txOnChain ?? 0 },
          ].map((s) => (
            <div key={s.label} className="border border-emerald-500/40 bg-card rounded-xl px-5 py-4 text-center">
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-foreground mb-5">Community Channels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <a href="https://x.com/gitbankio" target="_blank" rel="noreferrer" className="border border-emerald-500/40 bg-card rounded-xl p-5 hover:border-emerald-500/60 transition-colors block">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">LIVE</span>
            <div className="mt-4 flex items-center gap-3 mb-2">
              <XLogo className="text-emerald-500 w-5 h-5" />
              <h3 className="font-semibold text-foreground">X</h3>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">Follow @gitbankio for major announcements, product updates, and sprint recaps.</p>
          </a>

          <a href="https://github.com/gitbankio" target="_blank" rel="noreferrer" className="border border-emerald-500/40 bg-card rounded-xl p-5 hover:border-emerald-500/60 transition-colors block">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">LIVE</span>
            <div className="mt-4 flex items-center gap-3 mb-2">
              <Github className="text-emerald-500 w-5 h-5" />
              <h3 className="font-semibold text-foreground">GitHub</h3>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">Follow github.com/gitbankio for code updates. Everything we build is open source.</p>
          </a>

          <Link href="/group" className="border border-emerald-500/40 bg-card rounded-xl p-5 hover:border-emerald-500/60 transition-colors block">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">LIVE</span>
            <div className="mt-4 flex items-center gap-3 mb-2">
              <Users className="text-emerald-500 w-5 h-5" />
              <h3 className="font-semibold text-foreground">Gitbank Group</h3>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">Our community space. Discuss, ask questions, and hang out with the core team and contributors.</p>
          </Link>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-5">How to Contribute</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="border border-border/40 bg-card rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-2">Open GitHub Issues</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">Report bugs, suggest features, and help us prioritize the roadmap.</p>
          </div>
          <div className="border border-border/40 bg-card rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-2">Take Bounties</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">Claim open issues with USDC bounties attached. Get paid automatically on PR merge.</p>
          </div>
          <div className="border border-border/40 bg-card rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-2">Submit PRs</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">Fix typos, improve docs, or tackle technical debt. We welcome all contributions.</p>
          </div>
          <div className="border border-border/40 bg-card rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-2">Write Docs</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">Help us improve the developer experience by writing guides and tutorials.</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-5">Future Reputation</h2>
        <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default">
          <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50">Phase 7</span>
          <h3 className="font-semibold text-foreground mt-4 mb-2">GitScore</h3>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Every PR you merge earns on-chain reputation. GitScore = your on-chain GitHub credibility.
          </p>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
