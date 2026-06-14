import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { Link } from "wouter";
import { Rocket, ChevronLeft, ChevronRight, ExternalLink, Github, Bot } from "lucide-react";
import { useListLaunchedTokens } from "@workspace/api-client-react";
import type { LaunchedToken } from "@workspace/api-client-react";
import { useState } from "react";

const PAGE_SIZE = 15;

const MCP_CLIENTS = [
  { name: "Claude", href: "/mcp/claude", color: "text-orange-400" },
  { name: "Grok", href: "/mcp/grok", color: "text-blue-400" },
  { name: "Cursor", href: "/mcp/cursor", color: "text-violet-400" },
  { name: "VS Code", href: "/mcp/vscode", color: "text-blue-500" },
  { name: "Gemini", href: "/mcp/gemini", color: "text-emerald-400" },
  { name: "ChatGPT", href: "/mcp/chatgpt", color: "text-green-400" },
  { name: "Kimi", href: "/mcp/kimi", color: "text-cyan-400" },
  { name: "Copilot", href: "/mcp/github-copilot", color: "text-emerald-500" },
  { name: "Watsonx", href: "/mcp/watsonx", color: "text-purple-400" },
];

function formatMcap(v: number | null): string {
  if (!v || v === 0) return "--";
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

function TokenCard({ token }: { token: LaunchedToken }) {
  const clankerUrl = `https://clanker.world/clanker/${token.contractAddress}`;
  return (
    <a
      href={clankerUrl}
      target="_blank"
      rel="noreferrer"
      className="group border border-border bg-card rounded-xl p-4 flex flex-col gap-2 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-2">
        {token.imageUrl ? (
          <img
            src={token.imageUrl}
            alt={token.tokenSymbol}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-muted"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Rocket size={14} className="text-primary" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground text-[13px] truncate leading-tight">{token.tokenName}</p>
          <p className="text-muted-foreground text-[11px] font-mono">${token.tokenSymbol}</p>
        </div>
        <ExternalLink size={12} className="text-muted-foreground/40 group-hover:text-primary/60 flex-shrink-0 transition-colors" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          by <span className="text-foreground/70">@{token.deployerGithubLogin}</span>
        </span>
        <span className="text-[11px] font-mono text-emerald-400 font-semibold">
          {formatMcap(token.marketCapUsd ?? null)}
        </span>
      </div>
    </a>
  );
}

function TokenSkeleton() {
  return (
    <div className="border border-border bg-card rounded-xl p-4 flex flex-col gap-2 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 bg-muted rounded w-3/4" />
          <div className="h-2.5 bg-muted rounded w-1/3" />
        </div>
      </div>
      <div className="h-2.5 bg-muted rounded w-full" />
    </div>
  );
}

export default function LaunchpadIndexPage() {
  const [page, setPage] = useState(0);

  const { data: tokens = [], isLoading } = useListLaunchedTokens();

  const totalPages = Math.max(1, Math.ceil(tokens.length / PAGE_SIZE));
  const paginated = tokens.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const padded = [...paginated, ...Array(Math.max(0, PAGE_SIZE - paginated.length)).fill(null)];

  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        {/* Header */}
        <div className="mb-10">
          <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Launchpad</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3 max-w-[720px] leading-[1.1]">
            Recently Launched
          </h1>
          <p className="text-[16px] text-muted-foreground leading-relaxed max-w-[560px]">
            Tokens deployed on Base Mainnet via Gitbank. Launch yours in a GitHub comment or from any MCP-compatible AI.
          </p>
        </div>

        {/* Token Grid */}
        <div className="mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {isLoading
              ? Array(PAGE_SIZE).fill(null).map((_, i) => <TokenSkeleton key={i} />)
              : padded.map((token, i) =>
                  token ? (
                    <TokenCard key={token.id} token={token} />
                  ) : (
                    <div key={`empty-${i}`} className="border border-dashed border-border/30 rounded-xl" />
                  )
                )
            }
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mb-14">
          <span className="text-[12px] text-muted-foreground">
            {tokens.length} tokens total
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[12px] text-muted-foreground tabular-nums">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Launch via GitHub */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Github size={18} className="text-foreground" />
            <h2 className="text-xl font-bold text-foreground">Launch via GitHub</h2>
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">LIVE</span>
          </div>
          <div className="border border-border bg-card rounded-xl p-6 space-y-5">
            <p className="text-[14px] text-muted-foreground">
              Drop a comment in any GitHub Issue or PR. The bot deploys your token on Base Mainnet via Clanker automatically.
            </p>
            <div className="bg-muted/40 rounded-lg p-4 font-mono text-[13px] text-foreground border border-border">
              @gitbankbot launch token MyProject:MYP
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { step: "1", title: "Comment on GitHub", desc: "Use the command above in any Issue or PR" },
                { step: "2", title: "Clanker deploys", desc: "Bot calls Clanker API, token goes live on Base Mainnet" },
                { step: "3", title: "Get the receipt", desc: "Bot replies with contract address, Basescan link, and Clanker link" },
              ].map((s) => (
                <div key={s.step} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-[12px]">{s.step}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-[13px]">{s.title}</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Launch via MCP */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Bot size={18} className="text-foreground" />
            <h2 className="text-xl font-bold text-foreground">Launch via MCP</h2>
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">LIVE</span>
          </div>
          <p className="text-[14px] text-muted-foreground mb-5">
            Connect Gitbank to your AI assistant. Tell it to launch a token and it handles the rest.
          </p>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-5">
            {MCP_CLIENTS.map((c) => (
              <Link
                key={c.name}
                href={c.href}
                className="border border-border bg-card rounded-xl p-4 flex flex-col items-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-all group"
              >
                <span className={`font-semibold text-[14px] ${c.color} group-hover:opacity-100 opacity-80`}>{c.name}</span>
                <span className="text-[10px] text-muted-foreground">Setup guide</span>
              </Link>
            ))}
          </div>
          <div className="bg-muted/40 rounded-lg p-4 border border-border">
            <p className="text-[11px] text-muted-foreground font-mono mb-1">Example prompt</p>
            <p className="text-[13px] text-foreground font-mono">
              "Launch a token called Luminary with ticker LUMI on Base"
            </p>
          </div>
        </div>

      </motion.div>
    </PageWrapper>
  );
}
