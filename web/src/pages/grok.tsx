import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import PageWrapper from "@/components/layout/PageWrapper";
import DotGrid, { type PatternFn } from "@/components/DotGrid";

const grokPat: PatternFn = (c, r, cols, rows) => {
  const cx = cols * 0.5, cy = rows * 0.5;
  const d = Math.sqrt((c - cx) ** 2 + (r - cy) ** 2);
  if (d < 2.0) return 3;
  if (d < 4.0) return 2;
  const maxR = Math.min(cols * 0.46, rows * 0.46);
  const spacing = maxR / 3.5;
  const ring = d % spacing;
  return d < maxR && ring < 1.0 ? 1 : 0;
};

export default function GrokMarketingPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 max-w-[720px] leading-[1.1]">
            Gitbank + Grok: AI-Native Web3 Finance
          </h1>
          <p className="text-[16px] text-muted-foreground leading-relaxed max-w-[620px] mb-8">
            Grok can now control your Gitbank vault. No installs, no config files. Just add Gitbank as a Grok Connector and ask it to manage your on-chain finances in natural language.
          </p>

          <div className="relative rounded-xl border border-border bg-muted/20 overflow-hidden mt-8">
            <DotGrid cols={84} rows={26} dotRadius={2.5} gap={2} patternFn={grokPat} stretch />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 pointer-events-none" />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-mono text-[14px] font-bold text-foreground bg-background/90 backdrop-blur border border-border px-5 py-2.5 rounded-full shadow-lg">
                grok.com/connectors
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="border border-emerald-500/40 bg-card rounded-xl p-6 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mb-4 self-start">LIVE</span>
            <h2 className="text-2xl font-bold text-foreground mb-2 relative z-10">Available Now</h2>
            <p className="text-[14px] text-foreground/80 relative z-10">
              The Gitbank MCP integration is officially active on grok.com. Add it instantly and command your vault.
            </p>
          </div>
          
          <div className="border border-border bg-card rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">What you can do</h3>
            <ul className="text-[14px] text-muted-foreground space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Check vault balances in real-time.
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Swap USDC to WETH seamlessly.
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Assign bounties directly to GitHub issues.
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Discuss strategies utilizing true on-chain state.
              </li>
            </ul>
          </div>
        </div>

        <div className="border border-border bg-muted/20 rounded-xl p-8 mb-16 text-center">
          <h3 className="text-xl font-bold text-foreground mb-6">Natural Language Use Cases</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 font-mono text-[12px] text-foreground/80 italic">
              "Swap half my USDC to WETH"
            </div>
            <div className="bg-card border border-border rounded-lg p-4 font-mono text-[12px] text-foreground/80 italic">
              "Assign 50 USDC bounty to issue #42"
            </div>
            <div className="bg-card border border-border rounded-lg p-4 font-mono text-[12px] text-foreground/80 italic">
              "What's my vault balance?"
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center border border-border bg-card rounded-xl p-10 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to start?</h2>
          <p className="text-[15px] text-muted-foreground max-w-[400px] mb-8">
            Add Gitbank via the Connectors tab and elevate your AI workflow. Check out the setup guide for full details.
          </p>
          <Link href="/mcp/grok" className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
            Connect Grok now
          </Link>
        </div>

      </motion.div>
    </PageWrapper>
  );
}
