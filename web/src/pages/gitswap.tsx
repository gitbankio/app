import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import DotGrid, { type PatternFn } from "@/components/DotGrid";

// Hero: two Gaussian clusters with bridge
const twinPattern: PatternFn = (c, r, cols, rows) => {
  const cy = (rows - 1) / 2;
  const lx = cols * 0.21, rx = cols * 0.79;
  const sig = cols * 0.115;
  const ld = Math.sqrt((c - lx) ** 2 + (r - cy) ** 2) / sig;
  const rd = Math.sqrt((c - rx) ** 2 + (r - cy) ** 2) / sig;
  const inBridge = Math.abs(r - cy) <= 1.2 && c > cols * 0.32 && c < cols * 0.68;
  if (inBridge) return 2;
  const v = Math.max(Math.exp(-(ld ** 2) / 2), Math.exp(-(rd ** 2) / 2));
  if (v > 0.82) return 3;
  if (v > 0.52) return 2;
  if (v > 0.16) return 1;
  return 0;
};

// Section: route lines (DEX routing)
const routePattern: PatternFn = (c, r, cols, rows) => {
  const cy = (rows - 1) / 2;
  // Three horizontal routes at different y offsets
  const offsets = [-0.3, 0, 0.3];
  for (let i = 0; i < offsets.length; i++) {
    const y = cy + offsets[i] * rows;
    const wave = Math.sin((c / cols) * Math.PI * 4) * rows * 0.1;
    if (Math.abs(r - y - wave) < 1.2) return i === 1 ? 3 : 2;
    if (Math.abs(r - y - wave) < 2.2) return 1;
  }
  // Junction dots at 1/3 and 2/3
  const jx1 = cols * 0.33, jx2 = cols * 0.67;
  for (const jx of [jx1, jx2]) {
    const d = Math.sqrt((c - jx) ** 2 + (r - cy) ** 2);
    if (d < 2.2) return 3;
    if (d < 3.5) return 2;
  }
  return 0;
};

// Section: small receipt grid (vertical bars)
const receiptPattern: PatternFn = (c, r, cols, rows) => {
  const bars = 6;
  const bw = (cols - (bars - 1)) / bars;
  const heights = [0.9, 0.4, 0.7, 0.5, 0.8, 0.3];
  const bi = Math.floor(c / (bw + 1));
  const bc = c % (bw + 1);
  if (bc >= bw || bi >= bars) return 0;
  const barTop = (rows - 1) * (1 - heights[bi]);
  if (r < barTop) return 0;
  if (r < barTop + 1.2) return 3;
  if (r < barTop + 2.5 || bc < 1 || bc >= bw - 1) return 2;
  return 1;
};

export default function GitSwapPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        {/* HERO: text top, full-width graphic band below */}
        <div className="mb-14">
          <div className="mb-8">
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">gitSwap</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 max-w-[720px] leading-[1.1]">Exchange assets inside your vault without withdrawing</h1>
            <p className="text-[16px] text-muted-foreground leading-relaxed max-w-[600px]">
              gitSwap burns your input GitTokens, routes the underlying assets through the optimal DEX on Base, and mints the output GitTokens back into your vault in a single atomic transaction.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-8 flex items-center justify-center">
            <DotGrid cols={80} rows={28} dotRadius={2.5} gap={2} patternFn={twinPattern} stretch />
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          {[
            { label: "Protocol Fee", value: "0.30%", desc: "Taken from the input amount before the swap executes." },
            { label: "Minimum Fee", value: "$0.10", desc: "Applied when 0.30% would fall below this threshold." },
            { label: "MEV Protection", value: "Flashbots", desc: "All swap transactions broadcast via Flashbots Protect RPC to prevent sandwich attacks." },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-card p-5">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">{item.label}</p>
              <p className="text-[18px] font-bold text-primary mb-1">{item.value}</p>
              <p className="text-[12px] text-muted-foreground leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* DEX ROUTING: centered route pattern above */}
        <div className="flex flex-col items-center mb-5">
          <div className="rounded-xl border border-border bg-muted/30 px-8 py-5 inline-flex">
            <DotGrid cols={56} rows={14} dotRadius={2} gap={2} patternFn={routePattern} />
          </div>
          <div className="mt-5 text-center max-w-[580px] mb-5">
            <h2 className="text-xl font-bold text-foreground mb-1">Supported DEX routing</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed">
              Gitbank queries available DEX routes before execution and routes through the one offering the best net output after fees.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 mb-14">
          {[
            { name: "Aerodrome Finance", priority: "Primary", desc: "The largest liquidity source on Base. Used for most pairs, especially USDC/ETH, USDC/WBTC. Both stable and volatile pool types are supported." },
            { name: "Uniswap v3", priority: "Secondary", desc: "Battle-tested concentrated liquidity pools. Deep liquidity for major pairs. Used as fallback or for better rates on specific routes." },
            { name: "Uniswap v4", priority: "Extended", desc: "Hook-based pool architecture. Supports pools created via Clanker and Bankr token launchers on Base. Used for newer or long-tail asset pairs." },
          ].map((dex) => (
            <div key={dex.name} className="flex gap-4 rounded-lg border border-border bg-card px-5 py-4">
              <div className="flex items-center gap-3 mb-1 flex-1">
                <p className="text-[14px] font-semibold text-foreground">{dex.name}</p>
                <span className="text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">{dex.priority}</span>
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed hidden md:block">{dex.desc}</p>
            </div>
          ))}
          <div className="flex flex-col gap-1">
            {[
              { name: "Aerodrome Finance", desc: "The largest liquidity source on Base. Used for most pairs, especially USDC/ETH, USDC/WBTC. Both stable and volatile pool types are supported." },
              { name: "Uniswap v3", desc: "Battle-tested concentrated liquidity pools. Deep liquidity for major pairs. Used as fallback or for better rates on specific routes." },
              { name: "Uniswap v4", desc: "Hook-based pool architecture. Supports pools created via Clanker and Bankr token launchers on Base. Used for newer or long-tail asset pairs." },
            ].map((dex) => (
              <p key={dex.name} className="text-[13px] text-muted-foreground md:hidden">{dex.desc}</p>
            ))}
          </div>
        </div>

        {/* HOW TO SWAP: receipt pattern right, terminal left */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-14">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">How to trigger a swap</h2>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/40">
                <div className="w-2.5 h-2.5 rounded-full bg-muted" /><div className="w-2.5 h-2.5 rounded-full bg-muted" /><div className="w-2.5 h-2.5 rounded-full bg-muted" />
                <span className="text-xs font-mono text-muted-foreground ml-2">issues / 3</span>
              </div>
              <div className="p-5 space-y-4 font-mono text-[13px]">
                {[
                  { lang: "EN", cmd: "@gitbankbot swap 0.02 ETH to USDC", reply: "Aerodrome. 0.02 gitETH burned. 67.82 gitUSDC minted." },
                  { lang: "EN", cmd: "@gitbankbot swap 30 USDC to ETH", reply: "Aerodrome. 30.00 gitUSDC burned. 0.00882 gitETH minted." },
                  { lang: "DE", cmd: "@gitbankbot 0.02 ETH in USDC tauschen", reply: "Aerodrome. 0.02 gitETH burned. 67.82 gitUSDC minted." },
                  { lang: "JA", cmd: "@gitbankbot 0.02 ETHをUSDCに交換する", reply: "Aerodrome. 0.02 gitETH burned. 67.82 gitUSDC minted." },
                  { lang: "ZH", cmd: "@gitbankbot 将 0.02 ETH 换成 USDC", reply: "Aerodrome. 0.02 gitETH burned. 67.82 gitUSDC minted." },
                  { lang: "RU", cmd: "@gitbankbot обменять 0.02 ETH на USDC", reply: "Aerodrome. 0.02 gitETH burned. 67.82 gitUSDC minted." },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center gap-2"><span className="text-[10px] font-mono font-semibold text-muted-foreground/50 w-6 flex-shrink-0">{item.lang}</span><span className="text-muted-foreground">{">"}</span><span className="text-foreground">{item.cmd}</span></div>
                    <div className="ml-10 text-primary pl-3 border-l-2 border-primary/30">{item.reply}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Swap receipt</h2>
            <div className="rounded-xl border border-border bg-muted/30 p-5 flex justify-center mb-4">
              <DotGrid cols={32} rows={14} dotRadius={2} gap={2} patternFn={receiptPattern} />
            </div>
            <div className="rounded-xl border border-border bg-card p-5 font-mono text-[13px] space-y-2">
              {[["Sold","0.020 gitETH",false],["Received","67.82 gitUSDC",true],["Protocol fee","0.000060 ETH",false],["DEX LP fee","~0.03 USDC",false],["Gas paid by","Gitbank",false]].map(([l,v,h],i) => (
                <div key={i} className={`flex justify-between ${i < 4 ? "border-b border-border pb-2" : "pt-1"}`}>
                  <span className="text-muted-foreground">{l}</span>
                  <span className={h ? "text-primary font-semibold" : "text-foreground"}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
