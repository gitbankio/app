import React from "react";
import { Link } from "wouter";

export function CodeBlock({ title, code }: { title: string; code: string }) {
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

export function Steps({ items }: { items: { n: number; title: string; desc?: string; code?: string; codeTitle?: string }[] }) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((s) => (
        <div key={s.n} className="flex gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-[11px] font-bold text-primary mt-0.5">{s.n}</div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-foreground mb-1">{s.title}</p>
            {s.desc && <p className="text-[12px] text-muted-foreground leading-relaxed mb-2">{s.desc}</p>}
            {s.code && <CodeBlock title={s.codeTitle ?? ""} code={s.code} />}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TroubleItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <p className="text-[12px] font-semibold text-foreground mb-1">{q}</p>
      <p className="text-[12px] text-muted-foreground leading-relaxed">{a}</p>
    </div>
  );
}

export const ALL_CLIENTS = [
  { slug: "claude",          label: "Claude Desktop",    desc: "Best native MCP support" },
  { slug: "cursor",          label: "Cursor",             desc: "Built-in, Agent mode" },
  { slug: "chatgpt",         label: "ChatGPT Desktop",   desc: "Plus/Pro, one config file" },
  { slug: "gemini",          label: "Gemini CLI",         desc: "Terminal, one command" },
  { slug: "watsonx",         label: "IBM watsonx.ai",     desc: "Agent Lab + IBM Bob" },
  { slug: "kimi",            label: "Kimi.ai",            desc: "Plugin store" },
  { slug: "vscode",          label: "VS Code Copilot",    desc: "Repo-level .vscode/" },
  { slug: "github-copilot",  label: "GitHub Copilot",     desc: "Repo Settings, github.com" },
  { slug: "grok",            label: "Grok",               desc: "grok.com Connectors, no install" },
  { slug: "base",            label: "Base",               desc: "send_calls, Base Account, no relayer" },
  { slug: "hermes",          label: "Hermes Agent",       desc: "Local model, NLP passthrough" },
];

export function OtherClients({ current }: { current: string }) {
  const others = ALL_CLIENTS.filter((c) => c.slug !== current);
  return (
    <div className="mt-14 pt-8 border-t border-border">
      <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-4">Other clients</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {others.map((c) => (
          <Link key={c.slug} href={`/mcp/${c.slug}`}>
            <div className="rounded-lg border border-border bg-card hover:bg-muted/60 transition-colors px-3 py-2.5 cursor-pointer">
              <p className="text-[12px] font-semibold text-foreground">{c.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function McpBreadcrumb({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-[12px] text-muted-foreground mb-8">
      <Link href="/mcp" className="hover:text-foreground transition-colors">MCP</Link>
      <span>/</span>
      <span className="text-foreground font-medium">{label}</span>
    </div>
  );
}
