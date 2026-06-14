import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import DotGrid, { type PatternFn } from "@/components/DotGrid";
import { Link } from "wouter";
import { Github, CheckCircle, ShieldCheck } from "lucide-react";

const funnelPat: PatternFn = (c, r, cols, rows) => {
  const mid = cols / 2;
  const spread = (r / rows) * 15;
  const dist = Math.abs(c - mid);
  if (dist < 1) return 3;
  if (dist < spread) return 2;
  if (dist < spread + 2) return 1;
  return 0;
};

export default function GitHubAppPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        
        <div className="mb-14">
          <div className="mb-8">
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Integration</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 max-w-[720px] leading-[1.1]">
              Install the Gitbank GitHub App
            </h1>
            <p className="text-[16px] text-muted-foreground leading-relaxed max-w-[620px] mb-6">
              The entry point to Gitbank. Install it, and <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">@gitbank</code> responds in any Issue or PR, securely executing transactions on Base.
            </p>
            <a href="https://github.com/apps/gitbankbot/installations/new" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2">
              <Github className="mr-2 h-4 w-4" /> Install GitHub App
            </a>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-8 flex items-center justify-center overflow-hidden h-[180px]">
            <DotGrid cols={90} rows={18} dotRadius={2} gap={3} patternFn={funnelPat} stretch />
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">How it works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-emerald-500/40 bg-card rounded-xl p-5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mb-3 inline-block">LIVE</span>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <CheckCircle size={16} className="text-primary" /> Bot Interaction
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                The bot listens for <code className="font-mono bg-muted px-1 rounded">@gitbank</code> mentions in Issues and PRs. First time use? Run <code className="font-mono bg-muted px-1 rounded">@gitbank deploy vault</code>. After that, all commands are instantly available.
              </p>
            </div>
            
            <div className="border border-border bg-card rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <ShieldCheck size={16} className="text-primary" /> Privacy & Security
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Your GitHub User ID is securely anchored as your vault key. Webhooks are HMAC-verified. The bot <strong>only</strong> processes and reads comments starting with <code className="font-mono bg-muted px-1 rounded">@gitbank</code>.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">Installation & Permissions</h2>
          <div className="border border-border bg-card rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold text-foreground mb-2">Setup Steps</h3>
              <ol className="list-decimal pl-5 space-y-2 text-[13px] text-muted-foreground">
                <li>Go to <a href="https://github.com/apps/gitbankbot/installations/new" target="_blank" rel="noreferrer" className="text-primary hover:underline">github.com/apps/gitbankbot/installations/new</a></li>
                <li>Select the repositories you want the bot to access.</li>
                <li>Review permissions and authorize.</li>
              </ol>
            </div>
            <div className="p-6 bg-muted/10">
              <h3 className="font-semibold text-foreground mb-3">Required Permissions</h3>
              <div className="grid grid-cols-2 gap-4 text-[13px]">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Read Issues
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Read Pull Requests
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Write Comments
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Webhook Access
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">Command Examples</h2>
          <div className="space-y-3">
            <div className="border border-border bg-card rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <code className="text-[13px] font-mono text-foreground bg-muted px-3 py-1.5 rounded-md border border-border">@gitbank shield 100 USDC</code>
              <span className="text-[13px] text-muted-foreground">Deposits USDC into your secure vault</span>
            </div>
            <div className="border border-border bg-card rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <code className="text-[13px] font-mono text-foreground bg-muted px-3 py-1.5 rounded-md border border-border">@gitbank swap 50 USDC to WETH</code>
              <span className="text-[13px] text-muted-foreground">Executes atomic swap via Uniswap v3</span>
            </div>
            <div className="border border-border bg-card rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <code className="text-[13px] font-mono text-foreground bg-muted px-3 py-1.5 rounded-md border border-border">@gitbank assign 25 USDC to #42</code>
              <span className="text-[13px] text-muted-foreground">Creates an issue bounty, escrows funds</span>
            </div>
          </div>
        </div>

      </motion.div>
    </PageWrapper>
  );
}