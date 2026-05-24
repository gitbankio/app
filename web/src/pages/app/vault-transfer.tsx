import { useState } from "react";
import { motion } from "framer-motion";
import DAppSidebar from "@/components/layout/DAppSidebar";
import { useGetVaultBalance, useListTransactions } from "@workspace/api-client-react";
import { Copy, Check, ExternalLink, Clock, CheckCircle, XCircle } from "lucide-react";

const EXPLORER = "https://basescan.org/tx";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={copy} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
      {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
    </button>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === "confirmed") return <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" />;
  if (status === "failed") return <XCircle size={13} className="text-red-500 flex-shrink-0" />;
  return <Clock size={13} className="text-amber-500 flex-shrink-0 animate-pulse" />;
}

export default function VaultTransfer() {
  const { data: vaultBalance, isLoading: balLoading } = useGetVaultBalance();
  const { data: txData, isLoading: txLoading } = useListTransactions({ limit: 20 });

  const transferTxs = (txData ?? []).filter(tx => tx.type === "transfer");

  return (
    <div className="flex min-h-screen bg-background">
      <DAppSidebar />
      <main className="md:ml-[185px] mt-14 md:mt-0 flex-1 min-h-screen overflow-y-auto">
        <div className="w-full px-4 md:px-6 py-8 md:py-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

            <div className="mb-6">
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Vault</p>
              <h1 className="text-2xl font-bold text-foreground mb-1">Transfer</h1>
              <p className="text-[13px] text-muted-foreground">Send gitTokens to another Gitbank vault. Uses a 2-step commit/reveal to prevent front-running.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

              {/* Col 1: Balance */}
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="px-5 py-3 border-b border-border/60">
                    <p className="text-[11px] font-bold tracking-widest text-muted-foreground">AVAILABLE TO TRANSFER</p>
                  </div>
                  {balLoading ? (
                    <div className="p-6 text-center text-[13px] text-muted-foreground">Loading...</div>
                  ) : !vaultBalance?.balances?.length ? (
                    <div className="p-6 text-center text-[13px] text-muted-foreground">No assets locked. Deposit first via the bot.</div>
                  ) : (
                    <div className="divide-y divide-border">
                      {vaultBalance.balances.map(b => (
                        <div key={b.symbol} className="px-5 py-3.5 flex items-center justify-between">
                          <div>
                            <p className="text-[13px] font-semibold text-foreground">git{b.symbol}</p>
                            <p className="text-[11px] text-muted-foreground">{b.symbol} on Base L2</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[13px] font-semibold text-foreground font-mono">{parseFloat(b.balance).toLocaleString(undefined, { maximumFractionDigits: 6 })}</p>
                            <p className="text-[11px] text-muted-foreground">${parseFloat(b.usdValue || "0").toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-border bg-muted/30 p-4 text-[12px] text-muted-foreground leading-relaxed">
                  Transfers use a 2-step commit/reveal scheme. The bot commits a hash first, waits one block, then finalizes. This prevents front-running and replay attacks. The recipient must have a Gitbank vault.
                </div>
              </div>

              {/* Col 2: How */}
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="px-5 py-3 border-b border-border/60">
                    <p className="text-[11px] font-bold tracking-widest text-muted-foreground">HOW TO TRANSFER</p>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-[13px] text-muted-foreground">Post a comment in any connected GitHub issue or PR:</p>
                    {[
                      "@gitbankbot send 20 USDC to @alice",
                      "@gitbankbot send 0.005 WETH to @bob",
                    ].map(cmd => (
                      <div key={cmd} className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-muted/50 border border-border">
                        <code className="text-[12px] text-foreground font-mono">{cmd}</code>
                        <CopyButton text={cmd} />
                      </div>
                    ))}
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                      The recipient must have a Gitbank vault. The bot handles both steps (init + finalize) automatically. Gas is covered by Gitbank.
                    </p>
                    <div className="rounded-lg bg-muted/40 border border-border/60 px-3 py-2.5 space-y-1">
                      {[
                        ["Transfer fee", "None"],
                        ["Settlement", "2 on-chain steps (~15s)"],
                        ["Gas", "Free"],
                        ["Recipient", "Must have Gitbank vault"],
                      ].map(([l, v]) => (
                        <div key={l} className="flex justify-between text-[11px]">
                          <span className="text-muted-foreground">{l}</span>
                          <span className="text-foreground font-medium">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Col 3: History */}
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="px-5 py-3 border-b border-border/60">
                    <p className="text-[11px] font-bold tracking-widest text-muted-foreground">RECENT TRANSFERS</p>
                  </div>
                  {txLoading ? (
                    <div className="p-6 text-center text-[13px] text-muted-foreground">Loading...</div>
                  ) : !transferTxs.length ? (
                    <div className="p-6 text-center text-[13px] text-muted-foreground">No transfers yet.</div>
                  ) : (
                    <div className="divide-y divide-border">
                      {transferTxs.map(tx => (
                        <div key={tx.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <StatusIcon status={tx.status} />
                            <div className="min-w-0">
                              <p className="text-[13px] font-medium text-foreground">
                                {tx.amountIn ? `${parseFloat(tx.amountIn).toLocaleString(undefined, { maximumFractionDigits: 6 })} ${tx.tokenIn ?? ""}` : "Transfer"}
                              </p>
                              <p className="text-[11px] text-muted-foreground">{new Date(tx.createdAt).toLocaleString()}</p>
                            </div>
                          </div>
                          {tx.txHash && (
                            <a href={`${EXPLORER}/${tx.txHash}`} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[11px] text-primary hover:underline flex-shrink-0">
                              <span className="font-mono">{tx.txHash.slice(0, 8)}...</span>
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
