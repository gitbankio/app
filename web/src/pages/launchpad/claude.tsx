import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import DotGrid, { type PatternFn } from "@/components/DotGrid";
import { Link } from "wouter";
import { MessageSquare, Bot, Rocket, ArrowRight } from "lucide-react";

const aiPattern: PatternFn = (c, r, cols, rows) => {
  const cx = cols / 2, cy = rows / 2;
  const d = Math.sqrt((c - cx) ** 2 + (r - cy) ** 2);
  const pulse = Math.sin(d * 0.5 - Date.now() / 1000);
  if (d < 3) return 3;
  if (pulse > 0.5) return 2;
  if (pulse > 0) return 1;
  return 0;
};

export default function ClaudeLaunchpadPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        
        <div className="mb-14">
          <div className="mb-8">
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Integration</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 max-w-[720px] leading-[1.1]">
              Launch a Token via Claude
            </h1>
            <p className="text-[16px] text-muted-foreground leading-relaxed max-w-[620px] mb-6">
              Use Claude AI to launch your token on Base Mainnet via Gitbank MCP. Tell Claude what you want, it handles the rest.
            </p>
            <Link href="/mcp/claude" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2">
              Set up Claude MCP
            </Link>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-8 flex items-center justify-center overflow-hidden h-[180px]">
            <DotGrid cols={90} rows={18} dotRadius={2} gap={3} patternFn={aiPattern} stretch />
          </div>
        </div>

        <div className="mb-14">
          <div className="border border-emerald-500/40 bg-card rounded-xl p-5 mb-8">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mb-3 inline-block">LIVE</span>
            <p className="text-[14px] text-foreground font-medium">Claude Desktop MCP integration and Clanker integration are both live and ready to use.</p>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-6">The Launch Flow</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border border-border bg-card rounded-xl p-5 flex flex-col items-center text-center">
              <MessageSquare size={24} className="text-primary mb-3" />
              <h3 className="font-semibold text-foreground text-[14px]">1. Context</h3>
              <p className="text-[12px] text-muted-foreground mt-2">Claude reads your project context and goals.</p>
            </div>
            <div className="border border-border bg-card rounded-xl p-5 flex flex-col items-center text-center">
              <Bot size={24} className="text-primary mb-3" />
              <h3 className="font-semibold text-foreground text-[14px]">2. Suggestion</h3>
              <p className="text-[12px] text-muted-foreground mt-2">Suggests an optimized token name and ticker.</p>
            </div>
            <div className="border border-border bg-card rounded-xl p-5 flex flex-col items-center text-center">
              <ArrowRight size={24} className="text-primary mb-3" />
              <h3 className="font-semibold text-foreground text-[14px]">3. Execution</h3>
              <p className="text-[12px] text-muted-foreground mt-2">Calls Gitbank MCP tools securely.</p>
            </div>
            <div className="border border-border bg-card rounded-xl p-5 flex flex-col items-center text-center">
              <Rocket size={24} className="text-primary mb-3" />
              <h3 className="font-semibold text-foreground text-[14px]">4. Deployment</h3>
              <p className="text-[12px] text-muted-foreground mt-2">Clanker deploys. Token goes live on Base.</p>
            </div>
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">Example Conversation</h2>
          <div className="border border-border bg-card rounded-xl p-6 space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-[12px] font-medium">You</div>
              <div className="bg-muted/30 border border-border rounded-lg p-4 flex-1">
                <p className="text-[14px] text-foreground font-mono">Claude, launch a token for my open-source project called Luminary</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-[12px] font-medium text-primary">AI</div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex-1">
                <p className="text-[14px] text-foreground leading-relaxed">
                  I'll help you launch a token for Luminary. I've prepared the deployment using Gitbank MCP via Clanker.
                  <br/><br/>
                  <strong>Name:</strong> Luminary Network<br/>
                  <strong>Ticker:</strong> $LUMI
                  <br/><br/>
                  <em>Executing MCP tool: deploy_token...</em>
                  <br/><br/>
                  Success! Your token is now live on Base Mainnet.
                </p>
              </div>
            </div>
          </div>
        </div>

      </motion.div>
    </PageWrapper>
  );
}