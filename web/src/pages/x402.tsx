import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import DotGrid, { type PatternFn } from "@/components/DotGrid";
import { Server, ShieldCheck, Zap, Activity } from "lucide-react";

const flowPattern: PatternFn = (c, r, cols, rows) => {
  const t = r / rows;
  const wave1 = Math.sin((c / cols) * Math.PI * 6 - t * Math.PI * 2);
  const wave2 = Math.sin((c / cols) * Math.PI * 4 + t * Math.PI * 2 + 1);
  const pulse = Math.exp(-((c / cols - 0.5) ** 2) / 0.15);
  const v = (wave1 * 0.5 + wave2 * 0.5) * pulse;
  if (v > 0.6) return 3;
  if (v > 0.2) return 2;
  if (v > -0.1) return 1;
  return 0;
};

export default function X402Page() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        
        <div className="mb-14">
          <div className="mb-8">
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Protocol</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 max-w-[720px] leading-[1.1]">
              x402: The Payment Protocol for AI Agents
            </h1>
            <p className="text-[16px] text-muted-foreground leading-relaxed max-w-[620px] mb-6">
              HTTP 402 Payment Required. Machines pay machines. No API keys, no credit cards, no OAuth.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-8 flex items-center justify-center overflow-hidden h-[180px]">
            <DotGrid cols={90} rows={18} dotRadius={2} gap={3} patternFn={flowPattern} stretch />
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">What is x402</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border bg-card rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Server size={18} className="text-primary" /> Agent-Native Payment Layer
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                An agent-native payment layer built directly on HTTP. When a service needs payment, it returns a 402 status code with payment instructions. The agent reads the header, signs an EIP-3009 transferWithAuthorization, and the server verifies on Base. Settlement in ~2 seconds.
              </p>
            </div>
            <div className="border border-border bg-card rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Zap size={18} className="text-primary" /> Technical Foundation
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Uses EIP-3009 transferWithAuthorization for seamless execution. Powered by USDC on Base Mainnet. Zero wallet popups required, enabling fully headless machine-to-machine interactions.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">Implementation Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-emerald-500/40 bg-card rounded-xl p-5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mb-3 inline-block">LIVE</span>
              <h3 className="font-semibold text-foreground mb-2">x402 in Gitbank</h3>
              <p className="text-[13px] text-muted-foreground">
                x402 protocol is active in Gitbank vault operations. AI agents can pay for services autonomously, securely authenticated via GitHub identities and vault smart contracts.
              </p>
            </div>
            <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default">
              <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50 mb-3 inline-block">Phase 3</span>
              <h3 className="font-semibold text-foreground mb-2">x402 Marketplace</h3>
              <p className="text-[13px] text-muted-foreground">
                A decentralized x402 marketplace, cross-agent payment routing, and dynamic rate limiting by identity.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">Use Cases & Integration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <div className="border border-border bg-card rounded-xl p-4 flex gap-3 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <p className="text-[13px] font-medium text-foreground">AI agent pays for API calls</p>
              </div>
              <div className="border border-border bg-card rounded-xl p-4 flex gap-3 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <p className="text-[13px] font-medium text-foreground">Agent-to-agent micropayments</p>
              </div>
              <div className="border border-border bg-card rounded-xl p-4 flex gap-3 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <p className="text-[13px] font-medium text-foreground">Autonomous treasury management</p>
              </div>
              <div className="border border-border bg-card rounded-xl p-4 flex gap-3 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <p className="text-[13px] font-medium text-foreground">Pay-per-request compute</p>
              </div>
            </div>
            <div className="border border-border bg-card rounded-xl p-5 bg-muted/10">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" /> How to add 402 to your service
              </h3>
              <div className="space-y-4 text-[13px] text-muted-foreground font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-primary">1.</span> Respond with HTTP 402 header
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">2.</span> Accept USDC on Base
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">3.</span> Verify signed signature on-chain
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">4.</span> Serve the request
                </div>
              </div>
            </div>
          </div>
        </div>

      </motion.div>
    </PageWrapper>
  );
}