import { useEffect, useRef } from "react";

const FLOW_NODES = [
  { label: "GitHub", color: "#64748b" },
  { label: "Bot", color: "#d97706" },
  { label: "Vault", color: "#4f46e5" },
  { label: "Chain", color: "#d97706" },
  { label: "Token", color: "#059669" },
];

const NODE_ICONS: number[][][] = [
  [
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0],
  ],
  [
    [0,1,1,1,1,1,0],
    [1,0,0,0,0,0,1],
    [1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1],
    [1,0,1,0,1,0,1],
    [0,1,1,1,1,1,0],
    [0,0,0,0,0,0,0],
  ],
  [
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,1,1,0,0,1],
    [1,0,1,1,0,0,1],
    [1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0],
  ],
  [
    [0,1,1,1,1,1,0],
    [1,0,0,0,0,0,1],
    [1,0,0,1,0,0,1],
    [1,0,1,1,1,0,1],
    [1,0,0,1,0,0,1],
    [0,1,1,1,1,1,0],
    [0,0,0,0,0,0,0],
  ],
  [
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,0,1,0,0,1],
    [1,0,1,1,1,0,1],
    [1,0,0,1,0,0,1],
    [1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0],
  ],
];

const ARROW: number[][] = [
  [0,0,0,0,0],
  [0,1,0,0,0],
  [1,1,1,1,1],
  [0,1,0,0,0],
  [0,0,0,0,0],
];

function ProductFlowPixel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const S = 9;
    const ICON_W = 7;
    const ICON_H = 6;
    const ARR_W = 5;
    const COLS = FLOW_NODES.length * ICON_W + (FLOW_NODES.length - 1) * ARR_W;

    canvas.width = COLS * S;
    canvas.height = ICON_H * S;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    FLOW_NODES.forEach((node, i) => {
      const offsetX = i * (ICON_W + ARR_W);
      const icon = NODE_ICONS[i];
      for (let r = 0; r < ICON_H; r++) {
        for (let c = 0; c < ICON_W; c++) {
          if (icon?.[r]?.[c]) {
            ctx.fillStyle = node.color;
            ctx.fillRect((offsetX + c) * S, r * S, S - 1, S - 1);
          }
        }
      }
      if (i < FLOW_NODES.length - 1) {
        const arrOffX = offsetX + ICON_W;
        for (let r = 0; r < ARROW.length; r++) {
          for (let c = 0; c < ARR_W; c++) {
            if (ARROW[r]?.[c]) {
              ctx.fillStyle = "#cbd5e1";
              ctx.fillRect((arrOffX + c) * S, (r) * S, S - 1, S - 1);
            }
          }
        }
      }
    });
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <canvas
        ref={canvasRef}
        style={{ imageRendering: "pixelated", width: "100%", height: "auto" }}
      />
      <div className="flex items-center w-full">
        {FLOW_NODES.map((n, i) => (
          <div key={n.label} className="flex items-center flex-1 min-w-0">
            <span
              className="text-[10px] font-bold flex-1 text-center truncate"
              style={{ color: n.color }}
            >
              {n.label}
            </span>
            {i < FLOW_NODES.length - 1 && (
              <span className="text-slate-300 text-[9px] shrink-0">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const features = [
  { label: "Interactive Hero", sub: "4 tabs: Vault, MCP, Bounty, Base" },
  { label: "Adaptive Theme", sub: "day/night by local time" },
  { label: "MCP Clients Docs", sub: "Claude, Cursor, Grok" },
  { label: "Supported Assets", sub: "WETH + USDC only" },
];

const topFeatures = [
  { icon: "⬡", label: "Soul-bound vault", sub: "No transfer, no drain" },
  { icon: "#", label: "GitHub IssueOps", sub: "@gitbank in any issue" },
  { icon: "→", label: "MCP server live", sub: "gitbank.io/api/mcp" },
];

const bottomFeatures = [
  { icon: "⇄", label: "Gasless execution", sub: "Deployer pays all gas" },
  { icon: "◈", label: "Base Mainnet", sub: "chainId 8453" },
  { icon: "⚡", label: "10 tools, one URL", sub: "No API key needed" },
];

export default function UpdateNowPage() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white font-sans">
      {/* LEFT 30% */}
      <div className="w-[30%] min-w-[260px] flex flex-col justify-between bg-white px-8 py-10 border-r border-slate-100 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #6366f1 1.5px, transparent 1.5px)",
            backgroundSize: "18px 18px",
          }}
        />

        <div className="relative z-10 flex flex-col gap-7">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Gitbank" className="w-7 h-7 rounded-md" style={{ imageRendering: "pixelated" }} />
            <span className="text-[15px] font-bold tracking-tight text-slate-900">gitbank</span>
          </div>

          <div>
            <h1 className="text-[28px] font-black leading-tight tracking-tight text-slate-900 mb-2">
              Two updates.<br />Live now.
            </h1>
            <p className="text-[13px] text-slate-500 leading-relaxed">
              New interactive landing and full MCP client documentation.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {features.map((f) => (
              <div key={f.label} className="flex items-start gap-2.5">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                <div>
                  <div className="text-[12px] font-semibold text-slate-800">{f.label}</div>
                  <div className="text-[11px] text-slate-400">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-3 mt-6">
          <div className="text-[9px] font-bold tracking-widest uppercase text-slate-400 mb-1">Product Flow</div>
          <ProductFlowPixel />
          <div className="pt-1">
            <div className="text-[11px] font-semibold text-slate-700">gitbank.io</div>
            <div className="text-[10px] text-slate-400">MCP: gitbank.io/api/mcp</div>
          </div>
        </div>
      </div>

      {/* RIGHT 70% */}
      <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
        {/* Top feature strip */}
        <div className="flex items-stretch border-b border-slate-200 bg-white">
          {topFeatures.map((f, i) => (
            <div
              key={f.label}
              className={`flex-1 flex items-center gap-3 px-5 py-3.5 ${i < topFeatures.length - 1 ? "border-r border-slate-200" : ""}`}
            >
              <span className="text-indigo-400 text-[18px] leading-none font-mono">{f.icon}</span>
              <div>
                <div className="text-[11px] font-bold text-slate-800">{f.label}</div>
                <div className="text-[10px] text-slate-400">{f.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Video */}
        <div className="flex-1 bg-white flex items-center justify-center overflow-hidden px-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-contain"
          >
            <source src="/update-demo.mov" type="video/mp4" />
          </video>
        </div>

        {/* Bottom feature strip */}
        <div className="flex items-stretch border-t border-slate-200 bg-white">
          {bottomFeatures.map((f, i) => (
            <div
              key={f.label}
              className={`flex-1 flex items-center gap-3 px-5 py-3.5 ${i < bottomFeatures.length - 1 ? "border-r border-slate-200" : ""}`}
            >
              <span className="text-emerald-400 text-[18px] leading-none font-mono">{f.icon}</span>
              <div>
                <div className="text-[11px] font-bold text-slate-800">{f.label}</div>
                <div className="text-[10px] text-slate-400">{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
