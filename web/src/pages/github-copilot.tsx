import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { Link } from "wouter";

export default function GithubCopilotPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Integrations</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Gitbank + GitHub Copilot</h1>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-10 max-w-[640px]">
          GitHub Copilot can natively control your Gitbank vault via the Model Context Protocol (MCP). Perform on-chain operations without leaving your IDE or github.com.
        </p>

        <div className="border border-emerald-500/40 bg-card rounded-xl p-5 mb-10 max-w-2xl">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">LIVE</span>
          <h3 className="font-semibold text-foreground mt-4 mb-2">GitHub Copilot MCP Integration</h3>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            The Gitbank MCP server is live at <code>/api/mcp</code>. It exposes your vault directly to Copilot's reasoning engine.
          </p>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-5">Seamless Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="border border-border/40 bg-card rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-2">Check Balances Inline</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Ask Copilot "What's my vault balance?" while you're coding to instantly view your WETH and USDC without switching context.
            </p>
          </div>
          <div className="border border-border/40 bg-card rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-2">Assign Bounties from VS Code</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Tell Copilot to "Assign a 50 USDC bounty to the current issue." It drafts the transaction, you confirm on GitHub, and the escrow is locked.
            </p>
          </div>
        </div>

        <div className="border border-border/40 bg-card rounded-xl p-8 text-center max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-foreground mb-3">Setup Instructions</h2>
          <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
            Connecting Gitbank to GitHub Copilot takes about a minute. You just need to add the MCP server to your Copilot settings.
          </p>
          <Link href="/mcp/github-copilot" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            View Setup Guide
          </Link>
        </div>

      </motion.div>
    </PageWrapper>
  );
}
