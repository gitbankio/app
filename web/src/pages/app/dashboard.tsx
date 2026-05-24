import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import DAppSidebar from "@/components/layout/DAppSidebar";
import { Lock, LockOpen, ArrowLeftRight, Plus, ExternalLink, ArrowDownLeft, Loader2, Inbox, Copy, Check } from "lucide-react";
import { useGetMe, useGetVaultBalance, useListTransactions, useListProjects } from "@workspace/api-client-react";
import type { TransactionRecord } from "@workspace/api-client-react";

function txIcon(type: TransactionRecord["type"]) {
  switch (type) {
    case "lock": return Lock;
    case "unlock": return LockOpen;
    case "bounty_payout": return ArrowDownLeft;
    default: return ArrowLeftRight;
  }
}

function txLabel(tx: TransactionRecord) {
  switch (tx.type) {
    case "lock": return "gitShield";
    case "unlock": return "gitUnshield";
    case "swap": return "gitSwap";
    case "transfer": return "Transfer";
    case "bounty_payout": return "Bounty received";
    case "bounty_assign": return "Bounty assigned";
    case "bounty_reclaim": return "Bounty reclaimed";
    case "project_create": return "Project created";
    default: return tx.type;
  }
}

const TOKEN_META: Record<string, { symbol: string; decimals: number }> = {
  "0x4200000000000000000000000000000000000006": { symbol: "WETH", decimals: 18 },
  "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913": { symbol: "USDC", decimals: 6 },
  "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf": { symbol: "cbBTC", decimals: 8 },
  "0x036CbD53842c5426634e7929541eC2318f3dCF7e": { symbol: "USDC", decimals: 6 },
};

function resolveToken(addr: string | null | undefined): { symbol: string; decimals: number } {
  if (!addr) return { symbol: "TOKEN", decimals: 18 };
  return TOKEN_META[addr.toLowerCase()] ?? TOKEN_META[addr] ?? { symbol: addr.slice(0, 6) + "...", decimals: 18 };
}

function formatWei(raw: string | null | undefined, decimals: number): string {
  if (!raw) return "0";
  try {
    const n = Number(BigInt(raw)) / 10 ** decimals;
    return n < 0.001 ? n.toExponential(2) : n.toLocaleString("en-US", { maximumFractionDigits: decimals === 6 ? 2 : 5 });
  } catch {
    return raw;
  }
}

function txAmount(tx: TransactionRecord) {
  if (tx.amountIn && tx.tokenIn) {
    const meta = resolveToken(tx.tokenIn);
    return `${formatWei(tx.amountIn, meta.decimals)} git${meta.symbol}`;
  }
  if (tx.amountOut && tx.tokenOut) {
    const meta = resolveToken(tx.tokenOut);
    return `${formatWei(tx.amountOut, meta.decimals)} git${meta.symbol}`;
  }
  return "";
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function CopyAddress({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-background border border-border">
      <div className="min-w-0">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground mb-0.5">{label}</p>
        <p className="text-[12px] font-mono text-foreground truncate">{value}</p>
      </div>
      <button onClick={copy} className="flex-shrink-0 p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
        {copied ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
      </button>
    </div>
  );
}

export default function Dashboard() {
  const [, navigate] = useLocation();

  const { data: me, isLoading: meLoading } = useGetMe();
  const { data: vaultData, isLoading: vaultLoading } = useGetVaultBalance();
  const { data: txData, isLoading: txLoading } = useListTransactions();
  const { data: projectsData, isLoading: projectsLoading } = useListProjects();

  useEffect(() => {
    if (!meLoading && !me) navigate("/app/onboarding");
  }, [me, meLoading]);

  if (meLoading) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <Loader2 size={22} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  const balances = vaultData?.balances ?? [];
  const totalUsd = parseFloat(vaultData?.totalUsdValue ?? "0");
  const transactions = txData?.slice(0, 10) ?? [];
  const projects = projectsData ?? [];

  return (
    <div className="flex min-h-screen bg-background">
      <DAppSidebar />
      <main className="md:ml-[185px] mt-14 md:mt-0 flex-1 min-h-screen overflow-y-auto">
        <div className="max-w-[900px] mx-auto px-4 md:px-8 py-8 md:py-10">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mb-8">
            <p className="text-[13px] text-muted-foreground mb-1">Welcome back</p>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">@{me?.githubLogin ?? "..."}</h1>
                <p className="text-[12px] font-mono text-muted-foreground mt-0.5">
                  GitHub ID #{me?.githubId}
                  {me?.vaultAddress ? ` · Vault ${me.vaultAddress.slice(0, 10)}...` : " · No vault yet"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-muted-foreground mb-0.5">Total portfolio</p>
                {vaultLoading ? (
                  <div className="h-8 w-24 bg-muted animate-pulse rounded" />
                ) : (
                  <p className="text-2xl font-bold text-primary">${totalUsd.toFixed(2)}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Balance cards */}
          {me?.vaultAddress && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {vaultLoading ? (
                [0, 1].map(i => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <div className="rounded-xl border border-border bg-card p-5 h-[100px] animate-pulse" />
                  </motion.div>
                ))
              ) : balances.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="sm:col-span-2">
                  <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                    <div>
                      <p className="text-[13px] font-semibold text-foreground mb-1">Fund your vault</p>
                      <p className="text-[12px] text-muted-foreground leading-relaxed">
                        Send WETH or USDC to your owner address from any wallet. Then use the bot to lock them into your vault.
                      </p>
                    </div>
                    {me?.ownerAddress && (
                      <CopyAddress label="OWNER ADDRESS (BASE L2)" value={me.ownerAddress} />
                    )}
                    <ol className="space-y-2">
                      {[
                        { n: "1", text: "Send WETH or USDC to the address above from MetaMask or any wallet" },
                        { n: "2", text: "Go to any GitHub issue in your connected repo" },
                        { n: "3", text: <>Comment <span className="font-mono text-foreground bg-muted px-1 rounded">@gitbankbot deposit 50 USDC</span></> },
                      ].map(({ n, text }) => (
                        <li key={n} className="flex items-start gap-2.5 text-[12px] text-muted-foreground">
                          <span className="w-4 h-4 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{n}</span>
                          <span className="leading-relaxed">{text}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </motion.div>
              ) : (
                (() => {
                  const nonZero = balances.filter(b => parseFloat(b.balance) > 0);
                  const display = nonZero.length > 0 ? nonZero : balances.slice(0, 1);
                  return display.map((b, i) => (
                    <motion.div key={b.symbol} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }}>
                      <div className="rounded-xl border border-border bg-card p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-[11px] font-bold tracking-widest text-muted-foreground mb-1">git{b.symbol}</p>
                            <p className="text-2xl font-bold text-foreground font-mono">
                              {parseFloat(b.balance).toFixed(b.symbol.includes("ETH") || b.symbol.includes("BTC") ? 5 : 2)}
                            </p>
                          </div>
                        </div>
                        <p className="text-[13px] text-muted-foreground">
                          approx <span className="text-foreground font-semibold">${parseFloat(b.usdValue || "0").toFixed(2)}</span> USD
                        </p>
                      </div>
                    </motion.div>
                  ));
                })()
              )}
            </div>
          )}

          {/* Vault not deployed notice */}
          {!me?.vaultAddress && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lock size={14} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">Vault not deployed yet</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">Your GitVault is still being confirmed on-chain. This usually takes under 30 seconds.</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Activity feed */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.35 }} className="lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-bold text-foreground">Recent activity</h2>
              </div>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                {txLoading ? (
                  <div className="p-6 flex items-center justify-center">
                    <Loader2 size={16} className="animate-spin text-muted-foreground" />
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="p-8 flex flex-col items-center gap-2 text-center">
                    <Inbox size={20} className="text-muted-foreground" />
                    <p className="text-[13px] text-muted-foreground">No activity yet</p>
                    <p className="text-[11px] text-muted-foreground">Transactions from GitHub IssueOps will appear here</p>
                  </div>
                ) : (
                  transactions.map((tx, i) => {
                    const Icon = txIcon(tx.type);
                    const isIncoming = tx.type === "lock" || tx.type === "bounty_payout";
                    const amount = txAmount(tx);
                    const basescanBase = "https://basescan.org/tx";
                    return (
                      <div key={tx.id ?? i} className={`flex items-center gap-3 px-4 py-3.5 ${i < transactions.length - 1 ? "border-b border-border/60" : ""}`}>
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon size={13} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <p className="text-[13px] font-semibold text-foreground whitespace-nowrap">{txLabel(tx)}</p>
                            {amount && (
                              <p className={`text-[13px] font-semibold ${isIncoming ? "text-emerald-600" : "text-foreground/70"}`}>
                                {isIncoming ? "+" : "-"}{amount}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-[11px] text-muted-foreground">{tx.createdAt ? timeAgo(tx.createdAt) : ""}</p>
                            {tx.txHash && (
                              <>
                                <span className="text-[11px] text-muted-foreground/40">·</span>
                                <a
                                  href={`${basescanBase}/${tx.txHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-0.5 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                                >
                                  {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}
                                  <ExternalLink size={9} />
                                </a>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>

            {/* Projects */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26, duration: 0.35 }} className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-bold text-foreground">Projects</h2>
                <button onClick={() => navigate("/app/projects/new")} className="flex items-center gap-1 text-[12px] text-primary hover:underline">
                  <Plus size={12} /> New
                </button>
              </div>
              {projectsLoading ? (
                <div className="rounded-xl border border-border bg-card p-6 flex justify-center">
                  <Loader2 size={16} className="animate-spin text-muted-foreground" />
                </div>
              ) : projects.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-8 text-center">
                  <p className="text-[13px] text-muted-foreground">No active projects</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Use <span className="font-mono text-foreground">@gitbankbot create project</span> in a GitHub issue</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {projects.map(p => {
                    const budget = parseFloat(p.totalBudget ?? "0");
                    const spent = parseFloat(p.spentBudget ?? "0");
                    const pct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
                    return (
                      <div
                        key={p.id}
                        className="rounded-xl border border-border bg-card p-4 hover:border-primary/40 cursor-pointer transition-colors"
                        onClick={() => navigate(`/app/projects/${p.id}`)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-[13px] font-semibold text-foreground">{p.name}</p>
                            <p className="text-[11px] text-muted-foreground">{p.token ?? "ETH"}</p>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            p.status === "active" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                          }`}>{p.status ?? "active"}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                          <span>Budget used</span>
                          <span className="text-foreground font-semibold">{spent} / {budget} {p.token ?? "ETH"}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">{pct}% spent</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
