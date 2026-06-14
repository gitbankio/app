import React from "react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { CodeBlock, Steps, TroubleItem, OtherClients, McpBreadcrumb } from "./_shared";
import { Brain, Cpu, Lock, Zap } from "lucide-react";

export default function McpHermesPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <McpBreadcrumb label="Hermes Agent" />

        {/* HEADER */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-primary/30 text-primary bg-primary/5">NousResearch Hermes</span>
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-border text-muted-foreground">Local / Offline</span>
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-border text-muted-foreground">macOS / Windows / Linux</span>
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-emerald-500/40 text-emerald-500 bg-emerald-500/5">Free</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3 max-w-[680px] leading-[1.1]">
            Connect Gitbank to Hermes Agent
          </h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[600px]">
            Run Gitbank commands locally using NousResearch Hermes Agent. No cloud API key required. NLP processing happens server-side so even smaller local models work out of the box.
          </p>
        </div>

        {/* WHY DIFFERENT */}
        <div className="mb-10">
          <div className="rounded-xl border border-primary/20 bg-primary/5 px-5 py-5">
            <p className="text-[11px] font-bold tracking-widest uppercase text-primary mb-3">Why a dedicated endpoint?</p>
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">
              The standard Gitbank MCP endpoint (<code className="font-mono text-foreground text-[12px]">gitbank.io/api/mcp</code>) exposes 16 tools. Larger models like Claude or GPT-4 handle tool selection well. Smaller local models often pick the wrong tool or fall back to web search entirely.
            </p>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              The Hermes endpoint (<code className="font-mono text-foreground text-[12px]">gitbank.io/api/mcp/hermes</code>) exposes just <span className="text-foreground font-semibold">one tool</span>. You type in plain language, NLP parsing runs on our server, and the right action is dispatched. Any model can call one tool.
            </p>
          </div>
        </div>

        {/* COMPARISON */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-muted-foreground" />
              <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">Standard endpoint</p>
            </div>
            <code className="text-[12px] font-mono text-foreground block mb-3">gitbank.io/api/mcp</code>
            <p className="text-[13px] text-muted-foreground mb-2">16 separate tools. Model must pick the right one.</p>
            <p className="text-[12px] text-muted-foreground">Best for: Claude Desktop, Cursor, GPT-4</p>
          </div>
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={14} className="text-primary" />
              <p className="text-[11px] font-bold tracking-widest uppercase text-primary">Hermes endpoint</p>
            </div>
            <code className="text-[12px] font-mono text-foreground block mb-3">gitbank.io/api/mcp/hermes</code>
            <p className="text-[13px] text-muted-foreground mb-2">1 tool. Type anything in plain language. Server handles intent.</p>
            <p className="text-[12px] text-muted-foreground">Best for: Hermes Agent, local models, offline use</p>
          </div>
        </div>

        {/* PREREQUISITES */}
        <div className="rounded-xl border border-border bg-card px-5 py-4 mb-10">
          <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Prerequisites</p>
          <div className="flex flex-col gap-2">
            {[
              "Hermes Agent desktop app installed (hermes-agent.nousresearch.com).",
              "A Gitbank vault deployed on Base Mainnet. You need your GitHub username.",
              "Internet connection for the API call (commands execute on Base Mainnet, not locally).",
            ].map((item, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                <p className="text-[13px] text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SETUP STEPS */}
        <h2 className="text-xl font-bold text-foreground mb-6">Setup Steps</h2>
        <div className="mb-12">
          <Steps items={[
            {
              n: 1,
              title: "Download and install Hermes Agent",
              desc: "Get the latest Hermes Agent desktop app from NousResearch. Available for macOS, Windows, and Linux.",
              codeTitle: "Download",
              code: "https://hermes-agent.nousresearch.com",
            },
            {
              n: 2,
              title: "Open Settings",
              desc: "Launch Hermes Agent. Open Settings from the top-right menu or use the keyboard shortcut.",
            },
            {
              n: 3,
              title: "Navigate to MCP tab",
              desc: "Inside Settings, go to the MCP section. This is where you register external MCP servers.",
            },
            {
              n: 4,
              title: "Add a new MCP server",
              desc: "Click 'New server'. Fill in the name field (e.g. 'Gitbank') and paste the server JSON below into the Server JSON field.",
              codeTitle: "MCP Server JSON",
              code: `{\n  "url": "https://gitbank.io/api/mcp/hermes",\n  "transport": "streamable-http"\n}`,
            },
            {
              n: 5,
              title: "Save and reload MCP",
              desc: "Click 'Save server', then click 'Reload MCP' (or restart Hermes Agent). The Gitbank tool should appear in the tool list.",
            },
            {
              n: 6,
              title: "Start a new chat and use Gitbank",
              desc: "Open a new chat. Type your command in plain language. Always include your GitHub username.",
              codeTitle: "Example prompts",
              code: `check my vault balance, github username: yourname\nswap 10 USDC to WETH, github username: yourname\nbuy 50 USDC of NVDA, github username: yourname\nshow my transaction history, github username: yourname`,
            },
          ]} />
        </div>

        {/* WHAT YOU CAN DO */}
        <h2 className="text-xl font-bold text-foreground mb-2">What you can do</h2>
        <p className="text-[13px] text-muted-foreground mb-6">All commands accept natural language. Examples below show how to phrase each action.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {[
            {
              category: "Read",
              items: [
                { label: "Check balance", example: `"what's my vault balance, username: yourname"` },
                { label: "Transaction history", example: `"show my last transactions, username: yourname"` },
                { label: "Project status", example: `"status of project myproject, username: yourname"` },
              ]
            },
            {
              category: "Vault",
              items: [
                { label: "Deposit", example: `"deposit 10 USDC, username: yourname"` },
                { label: "Withdraw", example: `"withdraw 5 WETH to 0xabc..., username: yourname"` },
                { label: "Swap", example: `"swap 20 USDC to WETH, username: yourname"` },
              ]
            },
          ].map(group => (
            <div key={group.category} className="rounded-xl border border-border bg-card p-5">
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3">{group.category}</p>
              <div className="flex flex-col gap-3">
                {group.items.map(item => (
                  <div key={item.label}>
                    <p className="text-[13px] font-semibold text-foreground mb-0.5">{item.label}</p>
                    <code className="text-[11px] font-mono text-muted-foreground">{item.example}</code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {[
            {
              category: "Transfer",
              items: [
                { label: "Send to GitHub user", example: `"send 10 USDC to @octocat, username: yourname"` },
              ]
            },
            {
              category: "Stocks (coming soon)",
              items: [
                { label: "List stocks", example: `"list available stocks"` },
                { label: "Stock price", example: `"price of NVDA"` },
                { label: "Buy stock", example: `"buy 50 USDC of AAPL, username: yourname"` },
              ]
            },
          ].map(group => (
            <div key={group.category} className="rounded-xl border border-border bg-card p-5">
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3">{group.category}</p>
              <div className="flex flex-col gap-3">
                {group.items.map(item => (
                  <div key={item.label}>
                    <p className="text-[13px] font-semibold text-foreground mb-0.5">{item.label}</p>
                    <code className="text-[11px] font-mono text-muted-foreground">{item.example}</code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* HOW CONFIRMATION WORKS */}
        <h2 className="text-xl font-bold text-foreground mb-4">How confirmation works</h2>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-5 py-5 mb-12">
          <div className="flex items-start gap-3">
            <Lock size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-semibold text-foreground mb-2">Two-step security for all write operations</p>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">
                When you queue a deposit, withdraw, swap, or transfer, the tool returns a <code className="font-mono text-foreground text-[12px]">confirm_code</code>. Nothing happens on-chain yet.
              </p>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">
                To execute, go to any GitHub Issue or PR where Gitbank bot is installed and post:
              </p>
              <CodeBlock title="GitHub comment" code={`@gitbankbot confirm ABC123`} />
              <p className="text-[13px] text-muted-foreground leading-relaxed mt-3">
                The bot verifies your GitHub identity, matches the code, and submits the transaction on Base Mainnet. You pay zero gas. The relayer covers it.
              </p>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS UNDER THE HOOD */}
        <h2 className="text-xl font-bold text-foreground mb-4">How it works under the hood</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            {
              icon: <Cpu size={16} className="text-primary" />,
              title: "Local model in Hermes",
              desc: "Hermes Agent calls the single 'gitbank' tool with your message as plain text. No tool selection needed.",
            },
            {
              icon: <Brain size={16} className="text-primary" />,
              title: "NLP on our server",
              desc: "The Hermes MCP server parses your message server-side to extract intent: command, token, amount, recipient.",
            },
            {
              icon: <Zap size={16} className="text-primary" />,
              title: "On-chain via relayer",
              desc: "After GitHub confirmation, the relayer signs and submits the transaction on Base Mainnet. You pay no gas.",
            },
          ].map(card => (
            <div key={card.title} className="rounded-xl border border-border bg-card p-5">
              <div className="mb-3">{card.icon}</div>
              <p className="text-[13px] font-semibold text-foreground mb-2">{card.title}</p>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* TROUBLESHOOTING */}
        <h2 className="text-xl font-bold text-foreground mb-6">Troubleshooting</h2>
        <div className="flex flex-col gap-4 mb-14">
          <TroubleItem
            q="Tool not showing up in Hermes Agent?"
            a="Click 'Reload MCP' in Settings after adding the server. If it still doesn't appear, restart Hermes Agent completely."
          />
          <TroubleItem
            q="Model calls web search instead of the Gitbank tool?"
            a="Start your message with 'use gitbank to...' or select the Gitbank tool explicitly from the tool list before sending."
          />
          <TroubleItem
            q="Command returns 'github_username required'?"
            a="Include your GitHub username in the message. Example: 'check balance, github username: yourname'."
          />
          <TroubleItem
            q="Connection error or timeout?"
            a="Verify the URL is exactly https://gitbank.io/api/mcp/hermes and transport is set to streamable-http. Check your internet connection."
          />
          <TroubleItem
            q="confirm_code expired?"
            a="Confirm codes expire after 15 minutes. If it expired, run the command again in Hermes to get a new code."
          />
          <TroubleItem
            q="'Vault not found' error?"
            a="Your vault must be deployed on Base Mainnet first. Visit gitbank.io and complete the onboarding to deploy your vault."
          />
        </div>

        <OtherClients current="hermes" />
      </motion.div>
    </PageWrapper>
  );
}
