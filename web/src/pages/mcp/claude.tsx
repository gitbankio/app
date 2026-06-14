import React from "react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { CodeBlock, Steps, TroubleItem, OtherClients, McpBreadcrumb } from "./_shared";

export default function McpClaudePage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <McpBreadcrumb label="Claude Desktop" />

        <div className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-primary/30 text-primary bg-primary/5">Claude Desktop</span>
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-border text-muted-foreground">Free</span>
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-border text-muted-foreground">Mac / Windows / Linux</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3 max-w-[640px] leading-[1.1]">
            Connect Gitbank to Claude Desktop
          </h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[580px]">
            Claude Desktop has native MCP support. Connect your Gitbank vault on Base Mainnet directly to Claude. Read vault data and queue on-chain operations inside any chat.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card px-5 py-4 mb-10">
          <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Prerequisites</p>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-start">
              <div className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
              <p className="text-[13px] text-muted-foreground">Claude Desktop app installed and configured.</p>
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
              title: "Download Claude Desktop",
              desc: "Ensure you have the latest version of Claude Desktop installed."
            },
            {
              n: 2,
              title: "Find config file path",
              desc: "Locate your Claude configuration file based on your OS.",
              codeTitle: "Config paths",
              code: `Mac: ~/Library/Application Support/Claude/claude_desktop_config.json\nWindows: %APPDATA%\\Claude\\claude_desktop_config.json\nLinux: ~/.config/Claude/claude_desktop_config.json`
            },
            {
              n: 3,
              title: "Add Gitbank MCP config block",
              desc: "Add the following JSON to the mcpServers object in your config file.",
              codeTitle: "claude_desktop_config.json",
              code: `{\n  "mcpServers": {\n    "gitbank": {\n      "url": "https://gitbank.io/api/mcp",\n      "transport": "streamable-http"\n    }\n  }\n}`
            },
            {
              n: 4,
              title: "Restart Claude Desktop",
              desc: "Fully close and reopen Claude Desktop to apply the new configuration."
            }
          ]} />
        </div>

        <h2 className="text-xl font-bold text-foreground mb-6">Available Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {[
            { name: "request_deposit", desc: "Queue a USDC or WETH deposit. Requires GitHub confirmation." },
            { name: "request_withdraw", desc: "Queue a withdrawal to an external wallet address." },
            { name: "request_swap", desc: "Queue a Uniswap v3 swap inside your vault." },
            { name: "request_transfer", desc: "Queue a vault-to-vault transfer to another GitHub user." },
            { name: "get_vault_balance", desc: "Read current USDC and WETH vault balance." },
            { name: "request_assign_bounty", desc: "Queue a bounty assignment to a GitHub issue." }
          ].map(tool => (
            <div key={tool.name} className="border border-border bg-card rounded-xl p-4">
              <code className="text-[13px] font-bold text-primary mb-2 block">{tool.name}</code>
              <p className="text-[13px] text-muted-foreground">{tool.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-5 py-4 mb-12">
          <p className="text-[11px] font-bold tracking-widest uppercase text-amber-500 mb-2">Security Model</p>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            All write tools return a <code className="font-mono text-foreground text-[12px]">confirm_code</code>. You must post <code className="font-mono text-foreground text-[12px]">@gitbankbot confirm &lt;code&gt;</code> on GitHub to execute. Your GitHub account identity is verified at confirmation time: only the vault owner can authorize.
          </p>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-6">Troubleshooting</h2>
        <div className="flex flex-col gap-4 mb-14">
          <TroubleItem q="Tools not showing up?" a="Ensure you have fully restarted Claude Desktop after editing the config file." />
          <TroubleItem q="Authentication issues?" a="Verify your GitHub identity is correctly linked and your vault is deployed on Base Mainnet." />
          <TroubleItem q="Connection errors?" a="Check that the URL is exactly https://gitbank.io/api/mcp and the transport is set to streamable-http." />
        </div>

        <OtherClients current="claude" />
      </motion.div>
    </PageWrapper>
  );
}
