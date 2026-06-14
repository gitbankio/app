import React from "react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { CodeBlock, Steps, TroubleItem, OtherClients, McpBreadcrumb } from "./_shared";

export default function McpBasePage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <McpBreadcrumb label="Base MCP" />

        <div className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-primary/30 text-primary bg-primary/5">Base Chain</span>
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-border text-muted-foreground">EIP-5792</span>
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-border text-muted-foreground">Coinbase Wallet</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3 max-w-[640px] leading-[1.1]">
            Base MCP + EIP-5792
          </h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[580px]">
            Leverage Base chain's native MCP integration. Allow AI agents to send calls via Coinbase Wallet effortlessly without an intermediary relayer.
          </p>
        </div>

        <div className="border border-emerald-500/40 bg-card rounded-xl p-5 mb-10">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mb-3 inline-block">LIVE</span>
          <h2 className="text-lg font-bold text-foreground mb-2">Live on Base Mainnet</h2>
          <p className="text-[13px] text-foreground/80 leading-relaxed">
            Gitbank integrates seamlessly with Base MCP. Vault operations become natively available through the Coinbase Wallet infrastructure, executing directly via EIP-5792.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">What is Base MCP?</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
              Base MCP is the native Model Context Protocol integration provided by Base. It leverages the EIP-5792 standard for batch transaction execution, utilizing <code className="text-[12px] bg-muted px-1.5 py-0.5 rounded font-mono">wallet_sendCalls</code>.
            </p>
            <p className="text-[14px] text-muted-foreground leading-relaxed">
              When used with Coinbase smart wallets, it enables direct wallet execution. No separate relayer is needed, streamlining your agentic interactions.
            </p>
          </div>
          <div className="border border-border bg-card rounded-xl p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">Connection Details</h3>
            <CodeBlock 
              title="Gitbank MCP URL"
              code="https://gitbank.io/api/mcp"
            />
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-6">Use Cases</h2>
        <div className="border border-border bg-card rounded-xl p-5 mb-14">
          <ul className="text-[14px] text-foreground/80 space-y-3">
            <li className="flex gap-3 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Direct wallet execution directly from Base Account native interfaces.
            </li>
            <li className="flex gap-3 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Bypass intermediaries and relayers for faster execution.
            </li>
            <li className="flex gap-3 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Batch calls efficiently using the EIP-5792 architecture.
            </li>
          </ul>
        </div>

        <OtherClients current="base" />
      </motion.div>
    </PageWrapper>
  );
}
