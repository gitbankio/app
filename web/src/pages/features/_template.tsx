import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import type { ReactNode } from "react";

export interface FeatureItem {
  title: string;
  desc: string;
  live?: boolean;
}

export interface CmdItem {
  cmd: string;
  desc: string;
  output?: string;
}

export interface ArchItem {
  layer: string;
  what: string;
  why: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface FeaturePageData {
  status: "LIVE" | "BUILDING" | "PLANNED";
  statusLabel?: string;
  accent: string;
  title: string;
  tagline: string;
  description: string;
  icon: ReactNode;
  mascot?: ReactNode;
  heroDiagram?: ReactNode;
  features: FeatureItem[];
  steps: { step: string; title: string; desc: string }[];
  commands?: CmdItem[];
  architecture?: ArchItem[];
  faq?: FaqItem[];
}

const GRID = 20;

function HeroBg({ accent }: { accent: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none" aria-hidden>
      <defs>
        <pattern id="fp" width={GRID} height={GRID} patternUnits="userSpaceOnUse">
          <circle cx={GRID / 2} cy={GRID / 2} r={1.5} fill="currentColor" />
        </pattern>
        <radialGradient id="fg" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <mask id="fm">
          <rect width="100%" height="100%" fill="url(#fg)" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#fp)" mask="url(#fm)" />
    </svg>
  );
}

export default function FeaturePage({ data }: { data: FeaturePageData }) {
  const isLive     = data.status === "LIVE";
  const isBuilding = data.status === "BUILDING";

  const badge = data.statusLabel ?? data.status;

  const badgeCls = isLive
    ? "text-emerald-500 border-emerald-500/40 bg-emerald-500/10"
    : isBuilding
    ? "text-amber-500 border-amber-500/40 bg-amber-500/10"
    : "text-muted-foreground border-border bg-muted/50";

  function featureBadge(f: FeatureItem) {
    const isItemLive = f.live !== false;
    if (isLive && isItemLive)     return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
    if (f.live === true)          return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
    if (isBuilding)               return "bg-amber-500/10 text-amber-500 border-amber-500/30";
    return "bg-muted/50 text-muted-foreground border-border";
  }

  function featureBadgeLabel(f: FeatureItem) {
    if (isLive && f.live !== false) return "LIVE";
    if (f.live === true)            return "LIVE";
    if (isBuilding)                 return "BUILDING";
    return "PLANNED";
  }

  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div className="mb-16 rounded-xl border border-border overflow-hidden relative bg-card">
          <HeroBg accent={data.accent} />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${data.accent}14 0%, transparent 65%)` }}
          />
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: data.accent }} />
          <div className="relative z-10 px-8 py-12 md:px-12 md:py-14 flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-14">
            {/* ── Text column ── */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-5 flex-1 min-w-0">
              <span
                className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border font-mono ${badgeCls}`}
              >
                {badge}
              </span>
              <div
                className="p-3 rounded-xl"
                style={{ background: `${data.accent}18`, color: data.accent }}
              >
                {data.icon}
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
                  {data.title}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground">{data.tagline}</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{data.description}</p>
              {isLive && (
                <Link
                  href="/app/onboarding"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-[13px] font-semibold hover:opacity-90 transition-opacity"
                  style={{ background: data.accent }}
                >
                  Get started <ArrowRight size={15} />
                </Link>
              )}
            </div>
            {/* ── Visual column (mascot + diagram) ── */}
            {(data.mascot || data.heroDiagram) && (
              <div className="flex flex-col items-center gap-8 flex-shrink-0">
                {data.mascot && (
                  <div
                    style={{
                      width: 160, height: 160,
                      imageRendering: "pixelated",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ transform: "scale(2)", transformOrigin: "top left" }}>
                      {data.mascot}
                    </div>
                  </div>
                )}
                {data.heroDiagram && (
                  <div className="opacity-80">{data.heroDiagram}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Features ─────────────────────────────────────────────────────── */}
        <div className="mb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-1">Features</h2>
            <p className="text-sm text-muted-foreground">
              {isLive
                ? "All features are live on Base Mainnet."
                : isBuilding
                ? "Features marked LIVE are deployed. Others are in active development."
                : "Planned for this phase."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.features.map((f, i) => (
              <div
                key={i}
                className="border border-border bg-card rounded-xl p-5 flex flex-col gap-3"
              >
                <span
                  className={`self-start text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${featureBadge(f)}`}
                >
                  {featureBadgeLabel(f)}
                </span>
                <div>
                  <h3 className="text-[15px] font-bold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── How it works ─────────────────────────────────────────────────── */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.steps.map((s, i) => (
              <div
                key={i}
                className="relative flex flex-col gap-3 p-5 bg-card border border-border rounded-xl"
              >
                <span className="text-[11px] font-mono font-bold tracking-widest text-muted-foreground">
                  {s.step}
                </span>
                <h3 className="font-bold text-foreground text-sm">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                {i < data.steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute -right-[9px] top-1/2 -translate-y-1/2 w-4 h-0.5 z-10"
                    style={{ background: `${data.accent}50` }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Commands ─────────────────────────────────────────────────────── */}
        {data.commands && data.commands.length > 0 && (
          <div className="mb-16">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-1">
                {isLive ? "Commands" : "Planned commands"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Post these in any GitHub Issue or PR where the bot is installed.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {data.commands.map((c, i) => (
                <div key={i} className="border border-border bg-card rounded-xl p-5 flex flex-col gap-2">
                  <code
                    className="text-sm font-mono font-bold"
                    style={{ color: data.accent }}
                  >
                    {c.cmd}
                  </code>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                  {c.output && (
                    <div className="mt-1 rounded-lg bg-muted/40 px-3 py-2 text-xs font-mono text-muted-foreground border border-border/60">
                      {c.output}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Architecture ─────────────────────────────────────────────────── */}
        {data.architecture && data.architecture.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Architecture</h2>
            <div className="flex flex-col gap-0">
              {data.architecture.map((a, i) => (
                <div key={i} className="flex gap-5">
                  <div className="flex flex-col items-center flex-shrink-0 pt-1">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: data.accent }}
                    />
                    {i < data.architecture!.length - 1 && (
                      <div
                        className="w-0.5 flex-1 mt-1 mb-1 min-h-[24px]"
                        style={{ background: `${data.accent}25` }}
                      />
                    )}
                  </div>
                  <div className="pb-8">
                    <p
                      className="text-[10px] font-mono font-bold tracking-widest uppercase mb-1"
                      style={{ color: data.accent }}
                    >
                      {a.layer}
                    </p>
                    <h3 className="font-bold text-foreground mb-1">{a.what}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{a.why}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        {data.faq && data.faq.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">FAQ</h2>
            <div className="flex flex-col gap-3">
              {data.faq.map((f, i) => (
                <div key={i} className="border border-border bg-card rounded-xl p-5">
                  <h3 className="font-bold text-foreground mb-2">{f.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </motion.div>
    </PageWrapper>
  );
}
