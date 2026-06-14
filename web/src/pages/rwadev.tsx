import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

const TICKERS = [
  "$SPCX","$NVDA","$AAPL","$TSLA","$META",
  "$MSFT","$GOOGL","$AMZN","$CRCL","$SPY","$QQQ",
];

const TECH = [
  "Base L2", "Solana", "Ondo Global Markets",
  "Jupiter v6", "CCTP V2", "Pyth Oracle",
];

const CHANNELS = [
  "GitHub Bot", "Claude MCP", "Cursor MCP", "Grok MCP", "Gemini MCP",
];

const DIAGRAM = `flowchart TD
    A1(["@gitbankbot"])
    A2(["Claude"])
    A3(["Cursor"])
    A4(["Grok"])
    A5(["Gemini"])

    W["Gitbank Server"]
    C["CCTP V2: Base to Solana"]
    J["Jupiter v6"]
    M["Mint GitStockToken: Base L2"]
    V[("GitVault: Soul-bound")]

    A1 --> W
    A2 --> W
    A3 --> W
    A4 --> W
    A5 --> W
    W -->|bridge USDC| C
    C -->|swap| J
    J -->|ERC-20 mint| M
    M --> V

    style A1 fill:#18181b,stroke:#6366f1,color:#c7d2fe,rx:12
    style A2 fill:#1a1a2e,stroke:#f59e0b,color:#fde68a,rx:12
    style A3 fill:#0f172a,stroke:#06b6d4,color:#a5f3fc,rx:12
    style A4 fill:#1a0a2e,stroke:#a855f7,color:#e9d5ff,rx:12
    style A5 fill:#0a1628,stroke:#3b82f6,color:#bfdbfe,rx:12
    style W fill:#f4f4f5,stroke:#52525b,color:#18181b
    style C fill:#f4f4f5,stroke:#52525b,color:#18181b
    style J fill:#f4f4f5,stroke:#52525b,color:#18181b
    style M fill:#f4f4f5,stroke:#52525b,color:#18181b
    style V fill:#f0fdf4,stroke:#16a34a,color:#15803d`;

export default function RwaDevPage() {
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "neutral",
      themeVariables: {
        primaryColor: "#f4f4f5",
        primaryTextColor: "#18181b",
        primaryBorderColor: "#a1a1aa",
        lineColor: "#52525b",
        secondaryColor: "#f4f4f5",
        tertiaryColor: "#fafafa",
        edgeLabelBackground: "#ffffff",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        fontSize: "15px",
        clusterBkg: "#f4f4f5",
        clusterBorder: "#d4d4d8",
      },
    });
    mermaid.render("rwa-flow", DIAGRAM).then(({ svg }) => {
      // Remove fixed dimensions — CSS controls sizing via width:100% height:auto
      const stretched = svg
        .replace(/\s+width="[^"]*"/, "")
        .replace(/\s+height="[^"]*"/, "")
        .replace(/\s+style="[^"]*max-width[^"]*"/, "");
      setSvgContent(stretched);
    }).catch(() => {});
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-white">

      {/* ── LEFT: Hero ── */}
      <div className="w-[44%] flex flex-col py-8 px-12 border-r border-zinc-100 shrink-0">

        {/* Top: logos + badge */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-2.5">
            <img src="/logo-gitbank.png" alt="Gitbank" className="h-7 w-auto" />
            <span className="text-zinc-300 font-light text-base">×</span>
            <img src="/ondo-logo.png" alt="Ondo Finance" className="h-6 w-6 object-contain" />
            <span className="text-zinc-700 text-sm font-semibold">Ondo Finance</span>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-bold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Under Build
          </span>
        </div>

        {/* Main hero text */}
        <div className="flex flex-col gap-5 flex-1">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-2">
              gitStock RWA Integration
            </p>
            <h1 className="text-[2.4rem] font-bold text-zinc-900 leading-[1.1] tracking-tight mb-3">
              Trade tokenized<br />real-world stocks<br />from any AI client.
            </h1>
            <p className="text-[14px] text-zinc-500 leading-relaxed max-w-[340px]">
              Hold, buy, and sell Ondo Finance RWA assets directly inside your Gitbank vault. No wallet setup. No gas. No sign-up.
            </p>
          </div>

          {/* Channels */}
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400 mb-2">
              Works from
            </p>
            <div className="flex flex-wrap gap-1.5">
              {CHANNELS.map((c) => (
                <span key={c} className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-600 text-[12px] font-medium">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Tickers */}
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400 mb-2">
              Supported Assets
            </p>
            <div className="flex flex-wrap gap-1.5">
              {TICKERS.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-md border border-zinc-200 bg-white text-zinc-800 text-[12px] font-mono font-semibold">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Tech chips */}
          <div className="flex flex-wrap gap-1.5">
            {TECH.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded text-[11px] text-zinc-400 font-medium">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom: github link */}
        <a
          href="https://github.com/gitbankio/gitbank-rwa"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-700 transition-colors text-[12px] font-medium group w-fit"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span className="group-hover:underline">github.com/gitbankio/gitbank-rwa</span>
        </a>
      </div>

      {/* ── RIGHT: Diagram ── */}
      <div className="flex-1 flex flex-col bg-zinc-50 border-l border-zinc-100">

        {/* Label bar */}
        <div className="flex items-center justify-between px-10 pt-8 pb-4 shrink-0">
          <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">
            Architecture Flow
          </p>
          <p className="text-[11px] text-zinc-400">
            Mainnet deployment pending Ondo Global Markets mint address confirmation.
          </p>
        </div>

        {/* Diagram fills remaining space — height-constrained for portrait */}
        <div className="flex-1 flex items-center justify-center px-6 pb-6 min-h-0 overflow-hidden">
          {svgContent ? (
            <div
              dangerouslySetInnerHTML={{ __html: svgContent }}
              className="h-full flex items-center justify-center [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-w-full"
            />
          ) : (
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Rendering...
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
