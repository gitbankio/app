import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import DotGrid, { type PatternFn } from "@/components/DotGrid";
import { Link } from "wouter";
import { Twitter, Bell, Search, Activity } from "lucide-react";

const xPattern: PatternFn = (c, r, cols, rows) => {
  const cx = cols / 2, cy = rows / 2;
  const d1 = Math.abs(c - cx - (r - cy));
  const d2 = Math.abs(c - cx + (r - cy));
  if (d1 < 1.5 || d2 < 1.5) return 3;
  if (d1 < 3 || d2 < 3) return 2;
  if (d1 < 5 || d2 < 5) return 1;
  return 0;
};

export default function GitbankXPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        
        <div className="mb-14">
          <div className="mb-8">
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Social Integration</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 max-w-[720px] leading-[1.1]">
              Gitbank on X
            </h1>
            <p className="text-[16px] text-muted-foreground leading-relaxed max-w-[620px] mb-6">
              Your vault, accessible via X. Track deposits, monitor balances, and get real-time transaction notifications via <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">@gitbankbot</code>.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-8 flex items-center justify-center overflow-hidden h-[180px]">
            <DotGrid cols={90} rows={18} dotRadius={2} gap={3} patternFn={xPattern} stretch />
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-emerald-500/40 bg-card rounded-xl p-5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mb-3 inline-block">LIVE</span>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Bell size={16} className="text-primary" /> Bot Notifications
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                @gitbankbot tweets verifiable receipts for major vault events directly on your timeline.
              </p>
            </div>
            
            <div className="border border-emerald-500/40 bg-card rounded-xl p-5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mb-3 inline-block">LIVE</span>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Search size={16} className="text-primary" /> Deposit Tracker
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Every vault has a public URL at <code className="font-mono bg-muted px-1 rounded">/v/:xUserId</code> showing verified balance and recent activity.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">How it Works</h2>
          <div className="border border-border bg-card rounded-xl p-6">
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
              Your X user ID links securely to a GitVault. We apply the same robust identity-anchoring model used for GitHub IDs.
            </p>
            <div className="bg-muted/30 border border-border rounded-lg p-4 font-mono text-[12px] text-muted-foreground flex items-start gap-3">
              <Activity size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <span>Note: X user IDs are stored as text strings (not numbers) to eliminate any risk of precision loss on large numerical IDs.</span>
            </div>
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">Future Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default">
              <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50 mb-3 inline-block">Phase 3</span>
              <h3 className="font-semibold text-foreground mb-2">X-Triggered Commands</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Reply to @gitbankbot to directly execute vault operations without leaving the timeline. Fully gasless, fully authenticated.
              </p>
            </div>
            
            <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default">
              <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50 mb-3 inline-block">Phase 3</span>
              <h3 className="font-semibold text-foreground mb-2">X-Gated Bounties</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Assign bounties directly to X users. Escrow unlocks when they reply with proof of work. Seamless crypto-native social coordination.
              </p>
            </div>
          </div>
        </div>

      </motion.div>
    </PageWrapper>
  );
}