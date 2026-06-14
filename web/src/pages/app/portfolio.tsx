import { motion } from "framer-motion";
import { useLocation } from "wouter";
import DAppSidebar from "@/components/layout/DAppSidebar";
import { useGetMe } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { TrendingUp, TrendingDown, ExternalLink, Loader2, AlertCircle } from "lucide-react";

interface RwaPosition {
  ticker: string;
  gitStockContract: string | null;
  amount: string;
  amountFormatted: string;
  priceUsd: number;
  valueUsd: number;
  costBasisUsd: number;
  pnlUsd: number;
  pnlPct: number;
  solanaWalletPubkey: string;
  buyTxSolana: string | null;
  buyTxBase: string | null;
  createdAt: string | null;
}

interface PortfolioResponse {
  positions: RwaPosition[];
  totalUsd: number;
}

function useRwaPortfolio() {
  return useQuery<PortfolioResponse>({
    queryKey: ["rwaPortfolio"],
    queryFn: async () => {
      const res = await fetch("/api/rwa/portfolio", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load portfolio");
      return res.json() as Promise<PortfolioResponse>;
    },
    refetchInterval: 30_000,
  });
}

function pnlColor(pnl: number) {
  if (pnl > 0) return "text-green-500";
  if (pnl < 0) return "text-red-500";
  return "text-muted-foreground";
}

function formatUsd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function SolscanLink({ sig }: { sig: string }) {
  return (
    <a
      href={`https://solscan.io/tx/${sig}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-0.5 text-primary hover:underline text-[11px]"
    >
      {sig.slice(0, 8)}...
      <ExternalLink size={10} />
    </a>
  );
}

function BasescanLink({ hash }: { hash: string }) {
  return (
    <a
      href={`https://basescan.org/tx/${hash}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-0.5 text-primary hover:underline text-[11px]"
    >
      {hash.slice(0, 10)}...
      <ExternalLink size={10} />
    </a>
  );
}

export default function PortfolioPage() {
  const [, navigate] = useLocation();
  const { data: me, isLoading: meLoading } = useGetMe();
  const { data, isLoading, error } = useRwaPortfolio();

  useEffect(() => {
    if (!meLoading && !me) navigate("/app/onboarding");
  }, [me, meLoading]);

  return (
    <div className="flex min-h-screen bg-background">
      <DAppSidebar />
      <main className="md:ml-[185px] mt-14 md:mt-0 flex-1 min-h-screen overflow-y-auto">
        <div className="max-w-[900px] mx-auto px-4 md:px-8 py-8 md:py-10">

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-8"
          >
            <p className="text-[13px] text-muted-foreground mb-1">RWA Holdings</p>
            <h1 className="text-2xl font-bold text-foreground">Stock Portfolio</h1>
            <p className="text-[12px] text-muted-foreground mt-1.5">
              Soul-bound gitStock tokens backed 1:1 by Ondo RWA on Solana.
              Buy via <span className="font-mono text-foreground">@gitbankbot buy NVDA 100 USDC</span>
            </p>
          </motion.div>

          {/* Total value card */}
          {data && data.positions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="mb-6 rounded-xl border border-border bg-card p-5"
            >
              <p className="text-[11px] font-semibold tracking-widest text-muted-foreground/60 mb-1">TOTAL PORTFOLIO VALUE</p>
              <p className="text-3xl font-bold text-foreground">{formatUsd(data.totalUsd)}</p>
              <p className="text-[12px] text-muted-foreground mt-1">{data.positions.length} position{data.positions.length !== 1 ? "s" : ""}</p>
            </motion.div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={20} className="text-muted-foreground animate-spin" />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-destructive text-[13px] py-8">
              <AlertCircle size={15} />
              Failed to load portfolio. Make sure you are logged in.
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && data?.positions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16"
            >
              <TrendingUp size={32} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-[14px] font-medium text-foreground mb-1">No positions yet</p>
              <p className="text-[12px] text-muted-foreground">
                Use <span className="font-mono">@gitbankbot buy NVDA 100 USDC</span> in any GitHub issue to buy your first stock.
              </p>
            </motion.div>
          )}

          {/* Positions list */}
          {!isLoading && data && data.positions.length > 0 && (
            <div className="space-y-3">
              {data.positions.map((pos, i) => (
                <motion.div
                  key={pos.ticker}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.08 + i * 0.04 }}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[11px] font-bold text-primary">{pos.ticker.slice(0, 4)}</span>
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-foreground">git{pos.ticker}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{pos.amountFormatted} tokens</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[16px] font-bold text-foreground">{formatUsd(pos.valueUsd)}</p>
                      <p className={`text-[12px] font-medium flex items-center gap-0.5 justify-end ${pnlColor(pos.pnlUsd)}`}>
                        {pos.pnlUsd >= 0
                          ? <TrendingUp size={11} />
                          : <TrendingDown size={11} />
                        }
                        {pos.pnlUsd >= 0 ? "+" : ""}{formatUsd(pos.pnlUsd)} ({pos.pnlPct >= 0 ? "+" : ""}{pos.pnlPct.toFixed(2)}%)
                      </p>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div>
                      <p className="text-[10px] text-muted-foreground/70 font-semibold tracking-wide mb-0.5">PRICE</p>
                      <p className="text-[13px] font-semibold text-foreground">{formatUsd(pos.priceUsd)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground/70 font-semibold tracking-wide mb-0.5">COST BASIS</p>
                      <p className="text-[13px] font-semibold text-foreground">{formatUsd(pos.costBasisUsd)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground/70 font-semibold tracking-wide mb-0.5">VALUE</p>
                      <p className="text-[13px] font-semibold text-foreground">{formatUsd(pos.valueUsd)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground/70 font-semibold tracking-wide mb-0.5">P&L</p>
                      <p className={`text-[13px] font-semibold ${pnlColor(pos.pnlUsd)}`}>
                        {pos.pnlUsd >= 0 ? "+" : ""}{formatUsd(pos.pnlUsd)}
                      </p>
                    </div>
                  </div>

                  {/* Tx links */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-3 border-t border-border/60">
                    {pos.buyTxSolana && (
                      <span className="text-[10px] text-muted-foreground/60">
                        Solana buy: <SolscanLink sig={pos.buyTxSolana} />
                      </span>
                    )}
                    {pos.buyTxBase && (
                      <span className="text-[10px] text-muted-foreground/60">
                        Base bridge: <BasescanLink hash={pos.buyTxBase} />
                      </span>
                    )}
                    {pos.gitStockContract && (
                      <span className="text-[10px] text-muted-foreground/60">
                        Contract:{" "}
                        <a
                          href={`https://basescan.org/token/${pos.gitStockContract}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-primary hover:underline"
                        >
                          {pos.gitStockContract.slice(0, 10)}...
                          <ExternalLink size={9} />
                        </a>
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
