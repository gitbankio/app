import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import DotGrid, { type PatternFn } from "@/components/DotGrid";

const H1 = [0.32, 0.50, 0.70, 0.42, 0.85, 0.58, 0.92, 0.46, 0.74, 0.62];

// Token split: 25% burn (left) | 75% swap (right)
const splitPattern: PatternFn = (c, r, cols, rows) => {
  const splitX = cols * 0.25;
  const padX = 1, padY = 1;
  if (c < padX || c >= cols - padX || r < padY || r >= rows - padY) return 1;
  if (Math.abs(c - splitX) < 1.2) return 3;
  if (c < splitX) {
    // burn side: diagonal hatch
    return ((c + r) % 4 < 2) ? 2 : 1;
  } else {
    // swap side: denser fill
    return ((c + r) % 3 === 0) ? 2 : 1;
  }
};

// Hero: ascending bar chart
const barPattern: PatternFn = (c, r, cols, rows) => {
  const bars = H1.length;
  const bw = (cols - (bars - 1)) / bars;
  const bi = Math.floor(c / (bw + 1));
  const bc = c % (bw + 1);
  if (bc >= bw || bi >= bars) return 0;
  const barTop = (rows - 1) * (1 - H1[Math.min(bi, H1.length - 1)]);
  if (r < barTop) return 0;
  if (r < barTop + 1.2) return 3;
  if (r < barTop + 2.5 || bc < 1 || bc >= bw - 1) return 2;
  return 1;
};

// Section: pie-like segments (fee distribution)
const piePattern: PatternFn = (c, r, cols, rows) => {
  const cx = (cols - 1) / 2, cy = (rows - 1) / 2;
  const d = Math.sqrt((c - cx) ** 2 + (r - cy) ** 2);
  const maxD = Math.min(cx, cy) - 0.5;
  if (d > maxD) return 0;
  const angle = Math.atan2(r - cy, c - cx);
  const norm = (angle + Math.PI) / (2 * Math.PI);
  // Three segments: 60%, 30%, 10%
  if (norm < 0.60) {
    if (d < 2) return 3;
    if (d > maxD - 1.5) return 2;
    return norm < 0.05 || norm > 0.58 ? 2 : 1;
  } else if (norm < 0.90) {
    if (d < 2) return 3;
    if (d > maxD - 1.5) return 2;
    return norm < 0.62 || norm > 0.88 ? 2 : 1;
  } else {
    if (d > maxD - 1.5) return 2;
    return 1;
  }
};

// Section: small bars for examples
const exBarPattern = (heights: number[]): PatternFn => (c, r, cols, rows) => {
  const bars = heights.length;
  const bw = (cols - (bars - 1)) / bars;
  const bi = Math.floor(c / (bw + 1));
  const bc = c % (bw + 1);
  if (bc >= bw || bi >= bars) return 0;
  const barTop = (rows - 1) * (1 - heights[Math.min(bi, heights.length - 1)]);
  if (r < barTop) return 0;
  if (r < barTop + 1.2) return 3;
  if (bc < 1 || bc >= bw - 1) return 2;
  return 1;
};

const calcBar = exBarPattern([1.0, 0.999, 0]);
const swapBar = exBarPattern([1.0, 0.997, 0.951]);
const payBar  = exBarPattern([1.0, 0.998]);
const minBar  = exBarPattern([0.4, 0.25, 0.1, 0.3]);

export default function FeesPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        {/* HERO: text top, full-width graphic band below */}
        <div className="mb-14">
          <div className="mb-8">
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Fees</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 max-w-[720px] leading-[1.1]">Simple, transparent fee structure</h1>
            <p className="text-[16px] text-muted-foreground leading-relaxed max-w-[600px]">
              Gitbank charges only on value-moving operations. Creating projects, assigning tasks, transferring between vaults, and rotating keys are all free. Gas is covered by Gitbank on every operation.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-8 flex items-center justify-center">
            <DotGrid cols={80} rows={28} dotRadius={2.5} gap={2} patternFn={barPattern} stretch />
          </div>
        </div>

        {/* FEE TABLE */}
        <div className="rounded-xl border border-border overflow-x-auto mb-14">
          <table className="w-full text-[13px] min-w-[480px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-3 font-semibold text-foreground">Operation</th>
                <th className="text-left px-5 py-3 font-semibold text-foreground">Fee</th>
                <th className="text-left px-5 py-3 font-semibold text-foreground">Minimum</th>
                <th className="text-left px-5 py-3 font-semibold text-foreground">Gas</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["GitHub App installation","1,000,000 GITBANK","-","Covered by Gitbank"],
                ["Vault deployment","Free","-","Covered by Gitbank"],
                ["gitShield (deposit ERC-20)","0.10%","$0.05","Covered by Gitbank"],
                ["gitUnshield (withdraw ERC-20)","0.10%","$0.05","Covered by Gitbank"],
                ["gitSwap (exchange inside vault)","0.30%","$0.10","Covered by Gitbank"],
                ["Project creation","Free","-","Covered by Gitbank"],
                ["Task bounty assignment","Free","-","Covered by Gitbank"],
                ["Bounty payout on PR merge","0.20%","$0.05","Covered by Gitbank"],
                ["Budget swap (project funds)","0.30%","$0.10","Covered by Gitbank"],
                ["Bounty reclaim (cancel task)","Free","-","Covered by Gitbank"],
                ["Vault-to-vault transfer","Free","-","Covered by Gitbank"],
                ["Key rotation","Free","-","Covered by Gitbank"],
                ["Emergency withdrawal","Free","-","Covered by Gitbank"],
              ].map(([op, fee, min, gas], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-5 py-3.5 text-foreground align-top">{op}</td>
                  <td className={`px-5 py-3.5 font-semibold align-top ${fee === "Free" ? "text-muted-foreground" : "text-primary"}`}>{fee}</td>
                  <td className="px-5 py-3.5 text-muted-foreground align-top">{min}</td>
                  <td className="px-5 py-3.5 text-muted-foreground align-top">{gas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EXAMPLES: each card has a mini bar chart */}
        <div className="flex items-end justify-between mb-5 gap-8">
          <div>
            <h2 className="text-xl font-bold text-foreground">Calculation examples</h2>
            <p className="text-[13px] text-muted-foreground mt-1">Exact numbers for common operations with real amounts.</p>
          </div>
          <div className="flex-shrink-0 opacity-70">
            <DotGrid cols={22} rows={10} dotRadius={2} gap={2} patternFn={barPattern} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
          {[
            { title: "75 USDC deposit via gitShield", pat: calcBar, rows: [["Deposit amount","75.00 USDC"],["Protocol fee (0.10%)","0.08 USDC"],["gitUSDC minted","74.92 gitUSDC"]] },
            { title: "0.02 ETH swap to USDC via gitSwap", pat: swapBar, rows: [["Input amount","0.020 ETH"],["Protocol fee (0.30%)","0.000060 ETH"],["Routed to DEX","0.019940 ETH"],["gitUSDC minted (approx)","67.82 gitUSDC"]] },
            { title: "35 USDC bounty payout on PR merge", pat: payBar, rows: [["Bounty amount","35.00 gitUSDC"],["Protocol fee (0.20%)","0.07 USDC"],["Contributor receives","34.93 USDC"]] },
            { title: "Small deposit: minimum fee applied", pat: minBar, rows: [["Deposit amount","20.00 USDC"],["0.10% would be","0.02 USDC"],["Minimum fee applied","0.05 USDC"],["gitUSDC minted","19.95 gitUSDC"]] },
          ].map((example) => (
            <div key={example.title} className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="border-b border-border bg-muted/30 px-5 py-3 flex items-center justify-between gap-4">
                <p className="text-[13px] font-semibold text-foreground">{example.title}</p>
                <div className="flex-shrink-0 opacity-70">
                  <DotGrid cols={16} rows={8} dotRadius={1.5} gap={2} patternFn={example.pat} />
                </div>
              </div>
              <div className="p-5 font-mono text-[12px] space-y-1.5">
                {example.rows.map(([label, val], i) => (
                  <div key={i} className={`flex justify-between ${i === example.rows.length - 1 ? "pt-2 border-t border-border" : ""}`}>
                    <span className="text-muted-foreground">{label}</span>
                    <span className={i === example.rows.length - 1 ? "text-primary font-semibold" : "text-foreground"}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FEE DISTRIBUTION: pie pattern centered, then cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-14">
          <div className="rounded-xl border border-border bg-muted/30 p-6 flex items-center justify-center">
            <DotGrid cols={36} rows={22} dotRadius={2.5} gap={2} patternFn={piePattern} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Where fees go</h2>
            <div className="flex flex-col gap-3">
              {[
                { pct: "60%", label: "Protocol treasury", desc: "Held in a multisig. Used for protocol development, audits, and bug bounty payouts." },
                { pct: "30%", label: "Infrastructure and gas", desc: "Covers the gas costs Gitbank pays on behalf of every user on every transaction." },
                { pct: "10%", label: "Community fund", desc: "Reserved for grants, contributor rewards, and ecosystem growth initiatives." },
              ].map((item) => (
                <div key={item.label} className="flex gap-5 rounded-lg border border-border bg-card px-5 py-4">
                  <p className="text-2xl font-bold text-primary w-14 flex-shrink-0">{item.pct}</p>
                  <div>
                    <p className="text-[14px] font-semibold text-foreground mb-0.5">{item.label}</p>
                    <p className="text-[13px] text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GITBANK TOKEN ECONOMICS */}
        <div className="mb-2">
          <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Token</p>
          <h2 className="text-xl font-bold text-foreground mb-1">GITBANK token mechanics</h2>
          <p className="text-[14px] text-muted-foreground leading-relaxed mb-4 max-w-[600px]">
            Installing the Gitbank GitHub App on any repository requires a one-time payment of <span className="text-foreground font-semibold">1,000,000 GITBANK</span>. These tokens flow directly to the protocol treasury. When the treasury accumulates 100,000,000 GITBANK, the conversion cycle triggers automatically.
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-8 p-3 rounded-lg border border-border bg-muted/30 max-w-[600px]">
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Contract Address (CA)</p>
              <p className="text-[12px] font-mono text-foreground select-all">0xC21dd0eE043930711C2a3e55F39C7d3144d09B07</p>
            </div>
            <a href="https://clanker.world/clanker/0xC21dd0eE043930711C2a3e55F39C7d3144d09B07" target="_blank" rel="noreferrer" className="ml-auto px-3 py-1.5 rounded-lg border border-primary/40 bg-primary/5 text-primary text-[12px] font-semibold hover:bg-primary/10 transition-colors whitespace-nowrap">
              $GITBANK on Clanker
            </a>
          </div>
        </div>

        {/* Flow: install → treasury → burn/swap */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              step: "01",
              title: "Install GitHub App",
              desc: "Pay 1,000,000 GITBANK to activate Gitbank on your repository. One-time per repo. The bot is live immediately.",
              tag: "1,000,000 GITBANK per repo",
            },
            {
              step: "02",
              title: "Treasury accumulates",
              desc: "Every install payment is collected in the protocol treasury multisig on Base. The conversion cycle triggers at each 100,000,000 GITBANK threshold.",
              tag: "Threshold: 100,000,000 GITBANK",
            },
            {
              step: "03",
              title: "Burn and swap cycle",
              desc: "When the threshold is reached: 25,000,000 GITBANK (25%) are permanently burned, reducing supply. The remaining 75,000,000 GITBANK (75%) are swapped to WETH via DEX and held in treasury.",
              tag: "25% burned · 75% to WETH",
            },
          ].map((card) => (
            <div key={card.step} className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 pt-5 pb-4">
                <p className="text-[10px] font-bold tracking-widest text-muted-foreground/60 mb-3">STEP {card.step}</p>
                <p className="text-[14px] font-semibold text-foreground mb-2">{card.title}</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
              <div className="px-5 py-2.5 border-t border-border bg-muted/30">
                <p className="text-[11px] font-semibold text-primary font-mono">{card.tag}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Split visualization */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border bg-muted/30 px-5 py-3 flex items-center justify-between gap-4">
            <p className="text-[13px] font-semibold text-foreground">Treasury conversion: per 100,000,000 GITBANK collected</p>
            <div className="flex-shrink-0 opacity-60">
              <DotGrid cols={32} rows={10} dotRadius={1.8} gap={2} patternFn={splitPattern} />
            </div>
          </div>
          <div className="grid grid-cols-2 divide-x divide-border">
            <div className="p-5">
              <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Burn (25%)</p>
              <p className="text-2xl font-bold text-foreground mb-1">25,000,000</p>
              <p className="text-[12px] text-muted-foreground font-mono mb-3">GITBANK permanently destroyed</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">Tokens are sent to the zero address. Supply decreases with every cycle, creating deflationary pressure as adoption grows.</p>
            </div>
            <div className="p-5">
              <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Swap to WETH (75%)</p>
              <p className="text-2xl font-bold text-primary mb-1">75,000,000</p>
              <p className="text-[12px] text-muted-foreground font-mono mb-3">GITBANK swapped via DEX</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">Converted to WETH on Base and held in the protocol treasury. Used to fund infrastructure, audits, and ecosystem growth.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
