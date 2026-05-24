import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import DotGrid, { type PatternFn } from "@/components/DotGrid";

// Hero: downward funnel (coins flowing in)
const funnelPattern: PatternFn = (c, r, cols, rows) => {
  const mid = (cols - 1) / 2;
  const t = r / (rows - 1);
  const halfW = ((cols - 1) / 2) * (1 - t * 0.68);
  const dist = Math.abs(c - mid);
  if (dist > halfW) return 0;
  const edge = halfW - dist;
  if (edge < 1.3) return 3;
  if (t > 0.82) return 3;
  if (t > 0.65) return 2;
  const innerT = t % 0.18;
  if (innerT < 0.04) return 2;
  return 1;
};

// Section: step flow (dots forming a staircase)
const stepsPattern: PatternFn = (c, r, cols, rows) => {
  const steps = 5;
  const stepW = cols / steps;
  const stepIdx = Math.floor(c / stepW);
  const stepTop = rows - (stepIdx + 1) * (rows / steps);
  if (r < stepTop) return 0;
  if (r === Math.floor(stepTop)) return 3;
  if (r < stepTop + 2) return 2;
  if (c >= stepIdx * stepW && c < stepIdx * stepW + 2) return 2;
  return 1;
};

// Section: diagonal rain (coins falling)
const rainPattern: PatternFn = (c, r, cols, rows) => {
  const diag = (c + r * 1.4) % 6;
  const row_v = r / rows;
  if (diag < 0.8) return row_v > 0.7 ? 3 : 2;
  if (diag < 1.6) return 1;
  return 0;
};

export default function GitLockPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        {/* HERO: centered large funnel, text below */}
        <div className="rounded-xl border border-border bg-muted/30 p-8 flex flex-col items-center mb-14">
          <DotGrid cols={72} rows={22} dotRadius={2.5} gap={2} patternFn={funnelPattern} />
          <div className="mt-7 text-center max-w-[640px]">
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">gitShield</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Lock assets and receive soul-bound GitTokens</h1>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              gitShield accepts real ERC-20 assets, deducts the protocol fee, and mints soul-bound GitTokens into the caller's vault. Assets stay locked until an authorized gitUnshield call releases them.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          {[
            { label: "Protocol Fee", value: "0.10%", desc: "Deducted from the deposit amount before GitTokens are minted." },
            { label: "Minimum Fee", value: "$0.05", desc: "Applied when 0.10% would fall below this threshold." },
            { label: "Supported Assets", value: "ETH, USDC, WBTC", desc: "Additional ERC-20 tokens can be added by protocol governance." },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-card p-5">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">{item.label}</p>
              <p className="text-[18px] font-bold text-primary mb-1">{item.value}</p>
              <p className="text-[12px] text-muted-foreground leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* HOW TO TRIGGER: text right, rain pattern left */}
        <div className="flex items-start gap-8 mb-4">
          <div className="hidden md:block flex-shrink-0 opacity-80">
            <DotGrid cols={20} rows={14} dotRadius={2} gap={2} patternFn={rainPattern} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">How to trigger a deposit</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed mt-1">
              Comment on any GitHub issue in your repository. The Gitbank bot understands natural language in any language. All of the following are valid inputs for a 50 USDC deposit.
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-14">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/40">
            <div className="w-2.5 h-2.5 rounded-full bg-muted" /><div className="w-2.5 h-2.5 rounded-full bg-muted" /><div className="w-2.5 h-2.5 rounded-full bg-muted" />
            <span className="text-xs font-mono text-muted-foreground ml-2">github.com / your-repo / issues / 1</span>
          </div>
          <div className="p-5 space-y-4 font-mono text-[13px]">
            {[
              { lang: "EN", cmd: "@gitbankbot deposit 50 USDC", reply: "Vault ready. Send 50 USDC to 0x...a4b2. Awaiting on-chain confirmation." },
              { lang: "EN", cmd: "@gitbankbot lock 0.02 ETH into my vault", reply: "Vault ready. Send 0.02 ETH to 0x...a4b2. Awaiting on-chain confirmation." },
              { lang: "DE", cmd: "@gitbankbot 50 USDC einzahlen", reply: "Vault bereit. Sende 50 USDC an 0x...a4b2. Warte auf On-Chain-Bestätigung." },
              { lang: "JA", cmd: "@gitbankbot 50 USDCを入金する", reply: "Vault ready. Send 50 USDC to 0x...a4b2. Awaiting on-chain confirmation." },
              { lang: "ZH", cmd: "@gitbankbot 存入 50 USDC", reply: "Vault ready. Send 50 USDC to 0x...a4b2. Awaiting on-chain confirmation." },
              { lang: "RU", cmd: "@gitbankbot внести 50 USDC на мой vault", reply: "Vault ready. Send 50 USDC to 0x...a4b2. Awaiting on-chain confirmation." },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2"><span className="text-[10px] font-mono font-semibold text-muted-foreground/50 w-6 flex-shrink-0">{item.lang}</span><span className="text-muted-foreground">{">"}</span><span className="text-foreground">{item.cmd}</span></div>
                <div className="ml-10 text-primary pl-3 border-l-2 border-primary/30">{item.reply}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ON-CHAIN STEPS: steps pattern on right, title on left */}
        <div className="flex items-end justify-between mb-4 gap-8">
          <div>
            <h2 className="text-xl font-bold text-foreground">What happens on-chain</h2>
            <p className="text-[13px] text-muted-foreground mt-1">Five ordered steps from asset detection to GitHub receipt.</p>
          </div>
          <div className="flex-shrink-0 opacity-75">
            <DotGrid cols={26} rows={12} dotRadius={2} gap={2} patternFn={stepsPattern} />
          </div>
        </div>
        <div className="flex flex-col gap-3 mb-14">
          {[
            { step: "1", title: "Asset transfer detected", desc: "The Deposit Monitor service watches the vault's deposit address for incoming ERC-20 transfers on Base." },
            { step: "2", title: "Fee deducted", desc: "The contract calculates 0.10% of the deposit amount and forwards it to the feeCollector multisig address." },
            { step: "3", title: "GitTokens minted", desc: "The net amount after fee deduction is minted as soul-bound GitTokens into the caller's vault. 1 USDC deposited (minus fee) yields 1 gitUSDC." },
            { step: "4", title: "Events emitted", desc: "The contract emits a FeePaid event and a Locked event containing the token address, net amount, and the caller's GitHub User ID." },
            { step: "5", title: "Receipt posted", desc: "The bot posts a confirmation comment to the GitHub issue with the transaction hash and updated vault balance." },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 rounded-lg border border-border bg-card px-5 py-4">
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{item.step}</div>
              <div>
                <p className="text-[14px] font-semibold text-foreground mb-0.5">{item.title}</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FEE CALC: two-column: calculator on left, mini funnel on right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Fee calculation example</h2>
            <div className="rounded-xl border border-border bg-card p-5 font-mono text-[13px] space-y-2">
              {[["Deposit amount","1,000.00 USDC",false],["Protocol fee (0.10%)","1.00 USDC",false],["gitUSDC minted","999.00 gitUSDC",true]].map(([l,v,h],i) => (
                <div key={i} className={`flex justify-between ${i === 2 ? "pt-2 border-t border-border" : "border-b border-border pb-2"}`}>
                  <span className="text-muted-foreground">{l}</span>
                  <span className={h ? "text-primary font-semibold" : "text-foreground"}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-5 flex items-center justify-center">
            <DotGrid cols={32} rows={16} dotRadius={2} gap={2} patternFn={funnelPattern} />
          </div>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
