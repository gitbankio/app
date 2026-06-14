import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { BaseLogo } from "@/components/BaseLogo";
import PageWrapper from "@/components/layout/PageWrapper";
import DotGrid, { type PatternFn } from "@/components/DotGrid";
import { Terminal, Shield, ArrowRightLeft, Wallet, Zap, Coins } from "lucide-react";

const heroPat: PatternFn = (c, r, cols, rows) => {
  const cx = cols * 0.5, cy = rows * 0.5;
  const d = Math.sqrt((c - cx) ** 2 + (r - cy) ** 2);
  if (d < 1.8) return 3;
  if (d < 3.2) return 2;
  const maxR = Math.min(cols * 0.46, rows * 0.46);
  const spacing = maxR / 3.2;
  const ring = d % spacing;
  const rv: 0 | 1 | 2 | 3 = ring < 0.7 ? 3 : ring < 1.6 ? 2 : ring < 2.8 ? 1 : 0;
  const sats = [0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3];
  for (const a of sats) {
    const sx = cx + Math.cos(a) * spacing * 2.1;
    const sy = cy + Math.sin(a) * spacing * 2.1;
    const sd = Math.sqrt((c - sx) ** 2 + (r - sy) ** 2);
    if (sd < 1.6) return 3;
    if (sd < 2.8) return 2;
  }
  return d < maxR ? rv : 0;
};

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-muted" />
        <div className="w-2 h-2 rounded-full bg-muted" />
        <div className="w-2 h-2 rounded-full bg-muted" />
        <span className="text-[11px] font-mono text-muted-foreground ml-1">{title}</span>
      </div>
      <pre className="text-[12px] font-mono text-foreground p-5 whitespace-pre-wrap leading-relaxed overflow-x-auto">{code}</pre>
    </div>
  );
}

export default function McpPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {/* HERO */}
        <div className="mb-14">
          <div className="mb-8 relative z-10">
            <p className="text-[10px] font-bold tracking-widest uppercase text-primary mb-2">Gitbank MCP</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 max-w-[720px] leading-[1.1]">
              MCP: AI Agents Meet Web3 Finance
            </h1>
            <p className="text-[16px] text-muted-foreground leading-relaxed max-w-[620px]">
              Gitbank MCP server lets AI agents control real money on Base Mainnet via the Model Context Protocol. StreamableHTTP + SSE transport. No API key needed. Agents authenticate via your GitHub identity.
            </p>
          </div>

          <div className="relative rounded-xl border border-border bg-muted/20 overflow-hidden mt-8">
            <DotGrid cols={84} rows={26} dotRadius={2.5} gap={2} patternFn={heroPat} stretch />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80 pointer-events-none" />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-mono text-[13px] font-bold text-primary bg-background/90 backdrop-blur border border-primary/30 px-4 py-2 rounded-full shadow-sm">
                https://gitbank.io/api/mcp
              </span>
            </div>
          </div>
        </div>

        {/* 2 WAYS TO USE */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-2">Two ways to use Gitbank AI</h2>
          <p className="text-[13px] text-muted-foreground mb-6">Pick the option that fits your AI client.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Option 1: MCP Server */}
            <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Option 1
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">MCP Server</span>
              </div>
              <div>
                <p className="text-[15px] font-bold text-foreground mb-1">Connect via URL</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  For Claude Desktop, Cursor, Grok, VS Code, and any MCP-compatible client. Paste one URL and get all tools instantly. No download needed.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-4 py-2 border-b border-border bg-muted/40 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-muted" />
                  <div className="w-2 h-2 rounded-full bg-muted" />
                  <div className="w-2 h-2 rounded-full bg-muted" />
                  <span className="text-[10px] font-mono text-muted-foreground ml-1">MCP server URL</span>
                </div>
                <pre className="text-[12px] font-mono text-primary p-4 select-all">https://gitbank.io/api/mcp</pre>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono">Works with: Claude Desktop, Cursor, Grok, VS Code, IBM watsonx, Windsurf</p>
            </div>

            {/* Option 2: Plugin file */}
            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[9px] font-bold tracking-widest uppercase border border-border">
                  Option 2
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">Plugin file</span>
              </div>
              <div>
                <p className="text-[15px] font-bold text-foreground mb-1">Download and upload to any AI</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  For Claude Projects, ChatGPT custom GPTs, Gemini Gems, or any AI that accepts a knowledge file. Download the plugin reference and upload it as a document.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <a
                  href="/api/public/plugin/download-relayer"
                  className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition-colors group"
                >
                  <div>
                    <p className="text-[12px] font-bold text-foreground">Relayer mode</p>
                    <p className="text-[11px] text-muted-foreground font-mono">Gitbank pays gas. No wallet needed.</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-muted-foreground group-hover:text-foreground transition-colors"><path d="M7 2v7M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a
                  href="/api/public/plugin/download"
                  className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition-colors group"
                >
                  <div>
                    <p className="text-[12px] font-bold text-foreground">Base / Coinbase Wallet mode</p>
                    <p className="text-[11px] text-muted-foreground font-mono">User submits tx via EIP-5792.</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-muted-foreground group-hover:text-foreground transition-colors"><path d="M7 2v7M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono">Works with: Claude Projects, ChatGPT, Gemini Gems, Meta AI, Grok custom, any AI</p>
            </div>

          </div>
        </div>

        {/* LIVE INTEGRATIONS */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-2">LIVE Integrations</h2>
          <p className="text-[13px] text-muted-foreground mb-6">Connect Gitbank MCP to any AI client. One URL, all tools.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Link href="/mcp/claude" className="border border-emerald-500/40 bg-card rounded-xl p-5 hover:border-emerald-500/60 transition-colors block group">
              <div className="flex items-center justify-between mb-4">
                <img src="/logos/claude.png" alt="Claude" className="h-8 w-8 rounded-lg dark:[filter:invert(1)_hue-rotate(180deg)]" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">LIVE</span>
              </div>
              <h3 className="text-base font-bold text-foreground mb-1">Claude Desktop</h3>
              <p className="text-[13px] text-muted-foreground">Native MCP support. Full toolset in every chat.</p>
            </Link>
            <Link href="/mcp/cursor" className="border border-emerald-500/40 bg-card rounded-xl p-5 hover:border-emerald-500/60 transition-colors block group">
              <div className="flex items-center justify-between mb-4">
                <img src="/logos/cursor.png" alt="Cursor" className="h-8 w-8 rounded-lg" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">LIVE</span>
              </div>
              <h3 className="text-base font-bold text-foreground mb-1">Cursor</h3>
              <p className="text-[13px] text-muted-foreground">Built-in MCP support in Agent mode.</p>
            </Link>
            <Link href="/mcp/grok" className="border border-emerald-500/40 bg-card rounded-xl p-5 hover:border-emerald-500/60 transition-colors block group">
              <div className="flex items-center justify-between mb-4">
                <img src="/logos/grok.png" alt="Grok" className="h-8 w-8 rounded-lg bg-black p-1 dark:bg-transparent" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">LIVE</span>
              </div>
              <h3 className="text-base font-bold text-foreground mb-1">Grok</h3>
              <p className="text-[13px] text-muted-foreground">Add via grok.com Connectors. No install needed.</p>
            </Link>
            <Link href="/mcp/base" className="border border-emerald-500/40 bg-card rounded-xl p-5 hover:border-emerald-500/60 transition-colors block group">
              <div className="flex items-center justify-between mb-4">
                <BaseLogo className="h-8 w-auto text-foreground" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">LIVE</span>
              </div>
              <h3 className="text-base font-bold text-foreground mb-1">Base MCP</h3>
              <p className="text-[13px] text-muted-foreground">Coinbase Wallet native integration via EIP-5792.</p>
            </Link>
            <Link href="/mcp/hermes" className="border border-emerald-500/40 bg-card rounded-xl p-5 hover:border-emerald-500/60 transition-colors block group">
              <div className="flex items-center justify-between mb-4">
                <img src="/logos/hermes.png" alt="Hermes" className="h-8 w-8 rounded-lg" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">LIVE</span>
              </div>
              <h3 className="text-base font-bold text-foreground mb-1">Hermes Agent</h3>
              <p className="text-[13px] text-muted-foreground">Local model, NLP passthrough. One tool, plain language.</p>
            </Link>
          </div>

          {/* Coming soon clients */}
          <h3 className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-4">Coming Soon</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { logo: "/logos/gemini.png", name: "Gemini", bg: false },
              { logo: "/logos/kimi.png", name: "Kimi", bg: false },
              { logo: "/logos/windsurf.png", name: "Windsurf", bg: false },
              { logo: "/logos/vscode.png", name: "VS Code", bg: false },
              { logo: "/logos/chatgpt.png", name: "ChatGPT", bg: false },
              { logo: "/logos/ibm.png", name: "IBM watsonx", bg: false },
            ].map((c) => (
              <div key={c.name} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-dashed border-border/50 bg-muted/10 opacity-60 cursor-default">
                <img src={c.logo} alt={c.name} className="h-8 w-8 object-contain grayscale" />
                <span className="text-[11px] font-mono text-muted-foreground text-center">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MCP TOOL CATALOG */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">MCP Tool Catalog</h2>
          
          <h3 className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-4">Available Now</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="border border-emerald-500/40 bg-card rounded-xl p-5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mb-3 inline-block">LIVE</span>
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-primary" />
                <code className="text-sm font-bold">request_deposit</code>
              </div>
              <p className="text-[12px] font-mono text-muted-foreground mb-2">args: amount, token</p>
              <p className="text-[13px] text-foreground/80">Deposit USDC or WETH into your vault.</p>
            </div>
            
            <div className="border border-emerald-500/40 bg-card rounded-xl p-5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mb-3 inline-block">LIVE</span>
              <div className="flex items-center gap-2 mb-2">
                <Wallet size={16} className="text-primary" />
                <code className="text-sm font-bold">request_withdraw</code>
              </div>
              <p className="text-[12px] font-mono text-muted-foreground mb-2">args: amount, token, to_address</p>
              <p className="text-[13px] text-foreground/80">Withdraw tokens to any destination address.</p>
            </div>

            <div className="border border-emerald-500/40 bg-card rounded-xl p-5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mb-3 inline-block">LIVE</span>
              <div className="flex items-center gap-2 mb-2">
                <ArrowRightLeft size={16} className="text-primary" />
                <code className="text-sm font-bold">request_swap</code>
              </div>
              <p className="text-[12px] font-mono text-muted-foreground mb-2">args: amount, from_token, to_token</p>
              <p className="text-[13px] text-foreground/80">Swap assets inside the vault via Uniswap v3.</p>
            </div>

            <div className="border border-emerald-500/40 bg-card rounded-xl p-5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mb-3 inline-block">LIVE</span>
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-primary" />
                <code className="text-sm font-bold">request_transfer</code>
              </div>
              <p className="text-[12px] font-mono text-muted-foreground mb-2">args: amount, token, recipient_github_username</p>
              <p className="text-[13px] text-foreground/80">Vault-to-vault transfer.</p>
            </div>

            <div className="border border-emerald-500/40 bg-card rounded-xl p-5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mb-3 inline-block">LIVE</span>
              <div className="flex items-center gap-2 mb-2">
                <Terminal size={16} className="text-primary" />
                <code className="text-sm font-bold">get_vault_balance</code>
              </div>
              <p className="text-[12px] font-mono text-muted-foreground mb-2">args: github_username</p>
              <p className="text-[13px] text-foreground/80">Read vault balances and on-chain status.</p>
            </div>

            <div className="border border-emerald-500/40 bg-card rounded-xl p-5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mb-3 inline-block">LIVE</span>
              <div className="flex items-center gap-2 mb-2">
                <Coins size={16} className="text-primary" />
                <code className="text-sm font-bold">request_assign_bounty</code>
              </div>
              <p className="text-[12px] font-mono text-muted-foreground mb-2">args: amount, token, repo, issue</p>
              <p className="text-[13px] text-foreground/80">Escrow a bounty for a GitHub issue.</p>
            </div>
          </div>

          <h3 className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-4">Planned for Phase 3</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default">
              <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50 mb-3 inline-block">Phase 3</span>
              <code className="text-sm font-bold block mb-2">gitbank_pay_contributor</code>
              <p className="text-[13px] text-foreground/80">Direct payout without escrow.</p>
            </div>
            <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default">
              <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50 mb-3 inline-block">Phase 3</span>
              <code className="text-sm font-bold block mb-2">gitbank_set_agent_limit</code>
              <p className="text-[13px] text-foreground/80">Configure spending caps for AI agents.</p>
            </div>
            <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default">
              <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50 mb-3 inline-block">Phase 3</span>
              <code className="text-sm font-bold block mb-2">gitbank_list_projects</code>
              <p className="text-[13px] text-foreground/80">Query active projects and tasks.</p>
            </div>
          </div>
        </div>

        {/* AGENT FRAMEWORKS & ROADMAP */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">Agent Frameworks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default">
              <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50 mb-3 inline-block">Phase 1</span>
              <h3 className="text-lg font-bold text-foreground mb-2">AgentKit + Virtuals</h3>
              <p className="text-[13px] text-foreground/80">Coinbase AgentKit and Virtuals framework integrations. Agents get a vault, can hold and spend on-chain.</p>
            </div>
            <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-5 opacity-60 cursor-default">
              <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50 mb-3 inline-block">Phase 1</span>
              <h3 className="text-lg font-bold text-foreground mb-2">x402 Agent Payments</h3>
              <p className="text-[13px] text-foreground/80">Agent-to-agent payment protocol via HTTP 402 with per-agent spending limits. No API key. On-chain settlement.</p>
            </div>
          </div>
        </div>

        {/* CONNECTION CONFIG */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-2">How to connect</h2>
          <p className="text-[14px] text-muted-foreground mb-8">Add the Gitbank MCP server to your client config. Same JSON block for all clients.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Claude Desktop</p>
              <CodeBlock
                title="claude_desktop_config.json"
                code={`{
  "mcpServers": {
    "gitbank": {
      "url": "https://gitbank.io/api/mcp",
      "transport": "streamable-http"
    }
  }
}`}
              />
              <p className="text-[11px] text-muted-foreground mt-2">Mac: ~/Library/Application Support/Claude/</p>
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Cursor</p>
              <CodeBlock
                title=".cursor/mcp.json"
                code={`{
  "mcpServers": {
    "gitbank": {
      "url": "https://gitbank.io/api/mcp",
      "transport": "streamable-http"
    }
  }
}`}
              />
              <p className="text-[11px] text-muted-foreground mt-2">Add to project root or Cursor global settings</p>
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Grok</p>
              <CodeBlock
                title="grok.com Connectors"
                code={`1. Go to grok.com
2. Open Connectors tab
3. Add MCP Server
4. Paste URL:
   https://gitbank.io/api/mcp`}
              />
              <p className="text-[11px] text-muted-foreground mt-2">No config file needed. Browser-based only.</p>
            </div>
          </div>
        </div>

      </motion.div>
    </PageWrapper>
  );
}
