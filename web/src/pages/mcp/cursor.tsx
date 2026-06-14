import React from "react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { CodeBlock, Steps, TroubleItem, OtherClients, McpBreadcrumb } from "./_shared";

export default function McpCursorPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <McpBreadcrumb label="Cursor" />

        <div className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-primary/30 text-primary bg-primary/5">Cursor IDE</span>
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-border text-muted-foreground">Built-in MCP</span>
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-border text-muted-foreground">Agent Mode</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3 max-w-[640px] leading-[1.1]">
            Connect Gitbank to Cursor
          </h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[580px]">
            Cursor IDE includes built-in MCP support in Agent mode. Quickly check vault balances or assign issue bounties directly from your coding workspace.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card px-5 py-4 mb-10">
          <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Prerequisites</p>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-start">
              <div className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
              <p className="text-[13px] text-muted-foreground">Cursor IDE installed.</p>
            </div>
            <div className="flex gap-2 items-start">
              <div className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
              <p className="text-[13px] text-muted-foreground">A Gitbank vault deployed on Base Mainnet.</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-6">Setup Steps</h2>
        <div className="mb-12">
          <Steps items={[
            {
              n: 1,
              title: "Open Cursor Settings",
              desc: "Navigate to Cursor Settings > MCP > Add Server. Alternatively, add a .cursor/mcp.json file in your project root."
            },
            {
              n: 2,
              title: "Add Gitbank Server",
              desc: "Configure the server connection details.",
              codeTitle: ".cursor/mcp.json",
              code: `{\n  "mcpServers": {\n    "gitbank": {\n      "url": "https://gitbank.io/api/mcp",\n      "transport": "streamable-http"\n    }\n  }\n}`
            },
            {
              n: 3,
              title: "Enable Agent Mode",
              desc: "Switch from Chat mode to Agent mode. MCP tools are only available in Agent mode."
            }
          ]} />
        </div>

        <h2 className="text-xl font-bold text-foreground mb-6">Use Cases & Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="border border-border bg-card rounded-xl p-5">
            <h3 className="text-sm font-bold text-foreground mb-2">Coding Use Cases</h3>
            <ul className="text-[13px] text-muted-foreground space-y-2">
              <li>• Check vault balance while reviewing a PR.</li>
              <li>• Assign bounties to GitHub issues directly from your IDE.</li>
              <li>• Queue a token swap via Uniswap v3 inside the editor.</li>
              <li>• Transfer tokens to a teammate vault without leaving Cursor.</li>
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
          <TroubleItem q="Tools not visible?" a="Ensure you have enabled Agent mode. Tools are not available in standard Chat mode. If they still don't appear, restart Cursor." />
          <TroubleItem q="Config file not recognized?" a="Verify the file is named .cursor/mcp.json and placed in the root directory of your workspace." />
        </div>

        <OtherClients current="cursor" />
      </motion.div>
    </PageWrapper>
  );
}
