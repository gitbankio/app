import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { Users, User, ShieldCheck } from "lucide-react";

export default function GroupPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Architecture</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Team and Org Vaults</h1>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-10 max-w-[640px]">
          Individual vaults are live. Org vaults are coming. Scale Web3 IssueOps from solo developers to massive open source communities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="border border-emerald-500/40 bg-card rounded-xl p-5">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">LIVE</span>
            <div className="mt-4 flex items-center gap-3 mb-2">
              <User className="text-emerald-500 w-5 h-5" />
              <h3 className="font-semibold text-foreground">Individual Vaults</h3>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Each developer has their own soul-bound vault, anchored to their immutable GitHub user ID. Completely isolated and personal.
            </p>
          </div>

          <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default">
            <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50">Phase 6</span>
            <div className="mt-4 flex items-center gap-3 mb-2">
              <Users className="text-muted-foreground w-5 h-5" />
              <h3 className="font-semibold text-foreground">Org Vaults</h3>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              GitHub Org-level multi-sig vaults. N-of-M maintainer approval via GitHub comments. Example: 3-of-5 maintainers must approve a withdrawal before the transaction executes.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-5">Future Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default">
            <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50">Phase 6</span>
            <h3 className="font-semibold text-foreground mt-4 mb-2">Zero-Trust Payroll</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Stream USDC salaries directly from the org vault to contributor individual vaults.
            </p>
          </div>
          
          <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default">
            <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50">Phase 6</span>
            <h3 className="font-semibold text-foreground mt-4 mb-2">Supply Chain Finance</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Auto-pay dependencies and upstream open source projects based on package.json metrics.
            </p>
          </div>

          <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default">
            <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50">Phase 6</span>
            <h3 className="font-semibold text-foreground mt-4 mb-2">Bug Bounty Escrow</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Org-wide shared escrow pools for security researchers and white-hat hackers.
            </p>
          </div>

          <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default">
            <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50">Phase 6</span>
            <h3 className="font-semibold text-foreground mt-4 mb-2">DAO Treasury</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Manage entire DAO funds directly from GitHub, substituting token voting with maintainer consensus.
            </p>
          </div>
        </div>

        <div className="border border-border/40 bg-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="text-primary w-6 h-6" />
            <h2 className="text-lg font-bold text-foreground">How Org Vaults Will Work</h2>
          </div>
          <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
            Org vaults are tied cryptographically to a GitHub Organization ID. 
            Maintainers vote on proposals directly within GitHub Issues or PRs using <code className="text-primary">@gitbank approve</code>.
            Once the configured threshold (e.g. 3 out of 5) is met, the transaction automatically executes on-chain.
          </p>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
