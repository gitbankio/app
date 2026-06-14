import React from "react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { CodeBlock, Steps, TroubleItem, OtherClients, McpBreadcrumb } from "./_shared";

export default function McpGrokPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <McpBreadcrumb label="Grok" />

        <div className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-primary/30 text-primary bg-primary/5">Grok Platform</span>
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-border text-muted-foreground">Browser based</span>
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">LIVE</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3 max-w-[640px] leading-[1.1]">
            Connect Gitbank to Grok
          </h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[580px]">
            Integrate Gitbank directly into Grok via browser-based Connectors. No installation or config files required. Discuss DeFi strategies with real vault data.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card px-5 py-4 mb-10">
          <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Prerequisites</p>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-start">
              <div className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
              <p className="text-[13px] text-muted-foreground">A Gitbank vault deployed on Base Mainnet.</p>
            </div>
            <div className="flex gap-2 items-start">
              <div className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
              <p className="text-[13px] text-muted-foreground">Access to Grok with Connectors support.</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-6">Setup Steps</h2>
        <div className="mb-12">
          <Steps items={[
            {
              n: 1,
              title: "Open Grok Connectors",
              desc: "Navigate to grok.com and open the Connectors tab."
            },
            {
              n: 2,
              title: "Add MCP Server",
              desc: "Click 'Add MCP Server' and enter the Gitbank connection URL.",
              codeTitle: "Server URL",
              code: `https://gitbank.io/api/mcp`
            },
            {
              n: 3,
              title: "Start Chatting",
              desc: "No config file needed. The Gitbank tools are now available natively in the web UI."
            }
          ]} />
        </div>

        <h2 className="text-xl font-bold text-foreground mb-6">Use Cases & Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="border border-border bg-card rounded-xl p-5">
            <h3 className="text-sm font-bold text-foreground mb-2">Web Interface Use Cases</h3>
            <ul className="text-[13px] text-muted-foreground space-y-2">
              <li>• Check vault balances from any browser.</li>
              <li>• Queue transactions safely while on the go.</li>
              <li>• Discuss DeFi strategy with live, accurate vault data.</li>
              <li>• Transfer tokens to a teammate vault.</li>
            </ul>
          </div>
          <div className="border border-border bg-card rounded-xl p-5">
            <h3 className="text-sm font-bold text-foreground mb-2">Available Tools</h3>
            <ul className="text-[13px] text-muted-foreground space-y-2">
              <li>• <code className="font-mono text-primary text-[12px]">request_deposit</code></li>
              <li>• <code className="font-mono text-primary text-[12px]">request_withdraw</code></li>
              <li>• <code className="font-mono text-primary text-[12px]">request_swap</code></li>
              <li>• <code className="font-mono text-primary text-[12px]">request_transfer</code></li>
              <li>• <code className="font-mono text-primary text-[12px]">get_vault_balance</code></li>
              <li>• <code className="font-mono text-primary text-[12px]">request_assign_bounty</code></li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-5 py-4 mb-12">
          <p className="text-[11px] font-bold tracking-widest uppercase text-amber-500 mb-2">Security Model</p>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            All write tools return a <code className="font-mono text-foreground text-[12px]">confirm_code</code>. Post <code className="font-mono text-foreground text-[12px]">@gitbankbot confirm &lt;code&gt;</code> on GitHub to execute. GitHub identity is verified at confirmation time.
          </p>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-6">Troubleshooting</h2>
        <div className="flex flex-col gap-4 mb-14">
          <TroubleItem q="Connectors tab not available?" a="Ensure you have the required access level. The Connectors tab may require Grok Pro or API access." />
        </div>

        <OtherClients current="grok" />
      </motion.div>
    </PageWrapper>
  );
}
