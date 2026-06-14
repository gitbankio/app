import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Shield, Wallet, Zap, Coins, ArrowRightLeft } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import DotGrid, { type PatternFn } from "@/components/DotGrid";

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

export default function VaultPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        
        {/* HERO */}
        <div className="mb-14">
          <div className="mb-8">
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">GitVault</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 max-w-[720px] leading-[1.1]">
              Your On-Chain Bank on Base
            </h1>
            <p className="text-[16px] text-muted-foreground leading-relaxed max-w-[600px] mb-6">
              Soul-bound non-custodial vault on Base Mainnet. Zero gas for users. Deploy with a single command.
            </p>
            <div className="rounded-lg border border-border bg-card px-4 py-3 font-mono text-[13px] text-foreground inline-flex items-center gap-3">
              <span className="text-muted-foreground">{">"}</span>
              @gitbank deploy vault
            </div>
          </div>
          
          <div className="relative rounded-xl border border-border bg-muted/30 overflow-hidden flex items-center justify-center p-8">
             <DotGrid cols={80} rows={24} dotRadius={2.5} gap={2} patternFn={heroPattern} stretch />
          </div>
        </div>

        {/* LIVE OPERATIONS */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">Live Operations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "gitShield", desc: "Deposit USDC or WETH into your vault securely.", icon: Shield },
              { title: "gitUnshield", desc: "Withdraw your assets to any address at any time.", icon: Wallet },
              { title: "gitSwap", desc: "Atomic swap via Uniswap v3 directly inside your vault.", icon: ArrowRightLeft },
              { title: "gitSend", desc: "2-step commit-reveal vault-to-vault transfers.", icon: Zap },
              { title: "GitBounty", desc: "Manage escrow and payouts for project bounties.", icon: Coins },
            ].map((op, i) => (
              <div key={i} className="border border-emerald-500/40 bg-card rounded-xl p-5 flex flex-col items-start gap-3">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">LIVE</span>
                <op.icon size={20} className="text-primary" />
                <div>
                  <h3 className="text-[15px] font-bold text-foreground mb-1">{op.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{op.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">How vault creation works</h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-[14px] font-semibold text-foreground mb-1">1 Command Deployment</p>
                <p className="text-[13px] text-muted-foreground">Type <code>@gitbank deploy vault</code> in any GitHub Issue or PR. The bot instantly initiates deployment.</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-[14px] font-semibold text-foreground mb-1">EIP-1167 Proxy Clone</p>
                <p className="text-[13px] text-muted-foreground">The relayer deploys a minimal proxy clone pointing to the GitVault implementation, saving gas and ensuring standardization.</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-[14px] font-semibold text-foreground mb-1">Zero ETH Needed</p>
                <p className="text-[13px] text-muted-foreground">Users do not need ETH to deploy or operate their vault. All gas fees are sponsored by the protocol.</p>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-foreground mb-3">Soul-bound explanation</h2>
              <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
                GitTokens are non-transferable ERC-20s. Both transfer and approve functions revert. Your assets cannot be phished or drained via approval exploits. Your vault is locked to your GitHub user ID permanently.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">Relayer model</h2>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                The execution keypair is stored server-side and encrypted with AES-256-GCM. A relayer submits all transactions on your behalf. You pay zero gas and interact directly through GitHub.
              </p>
            </div>
          </div>
        </div>

        {/* CONTRACTS & CTA */}
        <div className="rounded-xl border border-border bg-muted/30 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-2">Base Mainnet Contracts</h2>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-muted-foreground w-28">Factory</span>
                <code className="text-[11px] font-mono text-foreground break-all">0xAA0a4ff46733EBaE8E658642A1314f18980fc77B</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-muted-foreground w-28">Implementation</span>
                <code className="text-[11px] font-mono text-foreground break-all">0x3602197A1b445AA4746c47C9D69436d9B7cF5dc9</code>
              </div>
            </div>
          </div>
          <Link href="/docs" className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition-opacity">
            Deploy your vault <ArrowRight size={16} />
          </Link>
        </div>

      </motion.div>
    </PageWrapper>
  );
}
