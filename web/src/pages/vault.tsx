import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import DotGrid, { type PatternFn } from "@/components/DotGrid";

// Hero: concentric rings (combination lock dial)
const heroPattern: PatternFn = (c, r, cols, rows) => {
  const cx = (cols - 1) / 2, cy = (rows - 1) / 2;
  const d = Math.sqrt((c - cx) ** 2 + (r - cy) ** 2);
  const maxD = Math.min(cx, cy) - 0.5;
  if (d > maxD) return 0;
  if (d > maxD - 1.2) return 2;
  if (d < 1.4) return 3;
  const ring = d % (maxD / 3.5);
  if (ring < 0.9) return 3;
  if (ring < 1.8) return 2;
  return 1;
};

// Token label pills floating over the dot art
const TOKEN_PILLS = [
  { symbol: "gitWETH",  top: "18%", left: "12%" },
  { symbol: "gitUSDC",  top: "18%", left: "38%" },
  { symbol: "gitCBBTC", top: "18%", left: "63%" },
  { symbol: "gitDAI",   top: "62%", left: "22%" },
  { symbol: "gitETH",   top: "62%", left: "48%" },
  { symbol: "gitOP",    top: "62%", left: "70%" },
];

function VaultIllustration() {
  return (
    <div className="relative rounded-xl border border-border bg-muted/30 overflow-hidden">
      <DotGrid cols={80} rows={28} dotRadius={2.5} gap={2} patternFn={heroPattern} stretch />
      {/* floating token labels */}
      {TOKEN_PILLS.map((p, i) => (
        <motion.span
          key={p.symbol}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 * i, ease: "easeOut" }}
          className="absolute font-mono text-[12px] font-bold text-primary bg-background/80 backdrop-blur-sm border border-primary/25 px-2.5 py-1 rounded-full shadow-sm"
          style={{ top: p.top, left: p.left }}
        >
          {p.symbol}
        </motion.span>
      ))}
    </div>
  );
}

// Section: scattered node cloud (keys / state vars)
const nodePattern: PatternFn = (c, r, cols, rows) => {
  const seeds = [[0.15,0.3],[0.4,0.7],[0.65,0.2],[0.85,0.6],[0.25,0.8],[0.75,0.4],[0.5,0.5]];
  let best = 0;
  for (const [sx, sy] of seeds) {
    const dx = c / cols - sx, dy = r / rows - sy;
    const d = Math.sqrt(dx * dx + dy * dy) * (cols / 8);
    const v = Math.exp(-(d * d) / 2);
    if (v > best) best = v;
  }
  if (best > 0.88) return 3;
  if (best > 0.62) return 2;
  if (best > 0.28) return 1;
  return 0;
};

// Section: horizontal stripes with phase offset (proxy pattern)
const stripePattern: PatternFn = (c, r, cols, rows) => {
  const wave = Math.sin((c / cols) * Math.PI * 3 + (r / rows) * Math.PI * 2);
  if (wave > 0.7) return 3;
  if (wave > 0.3) return 2;
  if (wave > -0.1) return 1;
  return 0;
};

export default function VaultPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        {/* HERO: text top, full-width graphic band below */}
        <div className="mb-14">
          <div className="mb-8">
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">GitVault</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 max-w-[720px] leading-[1.1]">The smart contract that holds your funds</h1>
            <p className="text-[16px] text-muted-foreground leading-relaxed max-w-[600px]">
              GitVault is the core smart contract deployed on Base L2. One vault is deployed per user or organization. It stores real assets, manages project treasuries, enforces identity-based permissions, and mints or burns soul-bound GitTokens in response to authorized operations.
            </p>
          </div>
          <VaultIllustration />
        </div>

        {/* STATS: 2x2 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
          {[
            { label: "Identity Anchor", value: "GitHub Permanent User ID", desc: "Set once at deployment. Immutable. Cannot be changed by any caller." },
            { label: "Token Standard", value: "Soul-Bound ERC-20", desc: "GitTokens have no transfer or approve function. Minted and burned by the vault only." },
            { label: "Network", value: "Base L2", desc: "OP Stack, 2-second blocks, gas under $0.01 per transaction." },
            { label: "Proxy Pattern", value: "EIP-1167 Minimal Clone", desc: "Deployed by GitVaultFactory. Reduces deployment cost by over 90%." },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-card p-5">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">{item.label}</p>
              <p className="text-[16px] font-bold text-primary mb-1">{item.value}</p>
              <p className="text-[12px] text-muted-foreground leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* PERSONAL OPS: section header with dot grid on right */}
        <div className="flex items-end justify-between mb-4 gap-8">
          <div>
            <h2 className="text-xl font-bold text-foreground">Personal vault operations</h2>
            <p className="text-[13px] text-muted-foreground mt-1">Functions callable by the execution keypair for the vault owner's own assets.</p>
          </div>
          <div className="hidden md:block flex-shrink-0 opacity-80">
            <DotGrid cols={24} rows={10} dotRadius={2} gap={2} patternFn={nodePattern} />
          </div>
        </div>
        <div className="rounded-xl border border-border overflow-x-auto mb-14">
          <table className="w-full text-[13px] min-w-[560px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-3 font-semibold text-foreground">Function</th>
                <th className="text-left px-5 py-3 font-semibold text-foreground">Description</th>
                <th className="text-left px-5 py-3 font-semibold text-foreground">Fee</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["gitShield(token, amount, nonce, deadline, sig)", "Lock ERC-20, mint gitToken 1:1 after fee. Requires dual-sig.", "0.10%"],
                ["gitUnshield(token, amount, nonce, deadline, sig)", "Burn gitToken, release ERC-20 to owner. Requires dual-sig.", "0.10%"],
                ["gitSwap(tokenIn, tokenOut, amountIn, minOut, router, data, nonce, deadline, sig)", "Atomic burn, DEX swap, mint. Requires dual-sig.", "0.30%"],
                ["initTransfer(initHash, deadline, sig)", "Commit a transfer intent on-chain. Requires dual-sig.", "Free"],
                ["finalizeTransfer(token, to, amount, nonce, initNonce, deadline, sig)", "Execute committed transfer within 600 seconds. Requires dual-sig.", "Free"],
                ["emergencyWithdraw(tokens[])", "Recover assets after 6 months of inactivity. No relayer sig needed.", "Free"],
              ].map(([fn, desc, fee], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-5 py-3 font-mono text-[12px] text-foreground align-top">{fn}</td>
                  <td className="px-5 py-3 text-muted-foreground align-top">{desc}</td>
                  <td className="px-5 py-3 text-primary font-medium align-top whitespace-nowrap">{fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PROJECT OPS: small dot grid on left, text on right */}
        <div className="flex items-start gap-8 mb-4">
          <div className="hidden md:block flex-shrink-0 opacity-75 pt-1">
            <DotGrid cols={18} rows={12} dotRadius={2} gap={2} patternFn={stripePattern} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Project workspace operations</h2>
            <p className="text-[13px] text-muted-foreground mt-1">Functions available to project managers for creating workspaces, assigning tasks, and executing payouts.</p>
          </div>
        </div>
        <div className="rounded-xl border border-border overflow-x-auto mb-14">
          <table className="w-full text-[13px] min-w-[560px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-3 font-semibold text-foreground">Function</th>
                <th className="text-left px-5 py-3 font-semibold text-foreground">Description</th>
                <th className="text-left px-5 py-3 font-semibold text-foreground">Fee</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["createProject(projectId, budget, token, nonce)", "Register project and lock budget in escrow", "Free"],
                ["assignTaskBounty(projectId, issueId, contributorId, amount, nonce)", "Move project funds into task-specific escrow", "Free"],
                ["executeBountyPayout(issueId, nonce)", "Triggered on PR merge: release escrow to contributor", "0.20%"],
                ["gitSwapBudget(projectId, tokenIn, tokenOut, amountIn, minOut, nonce)", "Rebalance project budget via DEX", "0.30%"],
                ["reclaimBounty(issueId, nonce)", "Return escrowed bounty to project budget if task is cancelled", "Free"],
              ].map(([fn, desc, fee], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-5 py-3 font-mono text-[12px] text-foreground align-top">{fn}</td>
                  <td className="px-5 py-3 text-muted-foreground align-top">{desc}</td>
                  <td className="px-5 py-3 text-primary font-medium align-top whitespace-nowrap">{fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* STATE VARIABLES: centered mini rings above */}
        <div className="flex flex-col items-center mb-5">
          <DotGrid cols={48} rows={10} dotRadius={2} gap={2} patternFn={nodePattern} />
          <h2 className="text-xl font-bold text-foreground mt-5">Vault state variables</h2>
          <p className="text-[13px] text-muted-foreground mt-1">Core storage fields that define each vault's identity, permissions, and on-chain records.</p>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { name: "githubUserId", type: "uint256 immutable", desc: "The GitHub Permanent User ID this vault belongs to. Set at deployment, never changes." },
            { name: "owner", type: "address", desc: "The execution keypair address used by the Relayer to sign and submit transactions." },
            { name: "relayerSigner", type: "address", desc: "Gitbank server signing address. Issues short-lived authorization signatures after verifying GitHub commands." },
            { name: "nonce", type: "uint256", desc: "Monotonic counter incremented on every state-changing call. Prevents replay attacks." },
            { name: "projects", type: "mapping(bytes32 => Project)", desc: "Per-project budget, manager list, status, and allocation records." },
            { name: "tasks", type: "mapping(uint256 => Task)", desc: "Per-issue contributor assignment, bounty amount, status, and linked PR." },
          ].map((v) => (
            <div key={v.name} className="flex flex-col sm:flex-row gap-1 sm:gap-4 rounded-lg border border-border bg-card px-4 py-3 sm:px-5 sm:py-3.5">
              <code className="text-[12px] font-mono text-primary sm:w-40 sm:flex-shrink-0">{v.name}</code>
              <code className="text-[11px] font-mono text-muted-foreground sm:w-44 sm:flex-shrink-0">{v.type}</code>
              <p className="text-[13px] text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </PageWrapper>
  );
}
