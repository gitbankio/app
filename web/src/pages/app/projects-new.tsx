import { useState } from "react";
import { motion } from "framer-motion";
import DAppSidebar from "@/components/layout/DAppSidebar";
import { useGetVaultBalance, useListTransactions } from "@workspace/api-client-react";
import { Copy, Check, ExternalLink, Clock, CheckCircle, XCircle } from "lucide-react";

const EXPLORER = "https://basescan.org/tx";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
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

export default function ProjectsNew() {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [token, setToken] = useState("USDC");

  const { data: vaultBalance, isLoading: balLoading } = useGetVaultBalance();
  const { data: txData, isLoading: txLoading } = useListTransactions({ limit: 10 });

  const projectTxs = (txData ?? []).filter(tx => tx.type === "project_create");

  const availableTokens = vaultBalance?.balances ?? [];
  const selectedBalance = availableTokens.find(b => b.symbol === token);

  const num = parseFloat(budget) || 0;
  const available = parseFloat(selectedBalance?.balance ?? "0");
  const overBudget = num > 0 && num > available;
  const valid = name.trim().length > 0 && num > 0 && !overBudget;

  const command = valid
    ? `@gitbankbot create project "${name.trim()}" with ${num} ${token} budget`
    : `@gitbankbot create project "Project Name" with 100 USDC budget`;

  return (
    <div className="flex min-h-screen bg-background">
      <DAppSidebar />
      <main className="md:ml-[185px] mt-14 md:mt-0 flex-1 min-h-screen overflow-y-auto">
        <div className="max-w-[560px] mx-auto px-4 md:px-8 py-8 md:py-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-5">

            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Workspace</p>
              <h1 className="text-2xl font-bold text-foreground mb-1">New project</h1>
              <p className="text-[13px] text-muted-foreground">Fill in the details below to generate your bot command. Paste it into any connected GitHub issue to create the project on-chain.</p>
            </div>

            {/* Builder */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border/60">
                <p className="text-[11px] font-bold tracking-widest text-muted-foreground">PROJECT NAME</p>
              </div>
              <div className="p-4">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Mobile App v2"
                  className="w-full bg-transparent text-[15px] font-semibold text-foreground outline-none placeholder:text-muted-foreground/30"
                />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border/60 flex items-center justify-between">
                <p className="text-[11px] font-bold tracking-widest text-muted-foreground">BUDGET</p>
                {balLoading ? (
                  <span className="text-[11px] text-muted-foreground">Loading...</span>
                ) : selectedBalance ? (
                  <span className="text-[11px] text-muted-foreground">
                    Available: {parseFloat(selectedBalance.balance).toLocaleString(undefined, { maximumFractionDigits: 6 })} git{token}
                  </span>
                ) : null}
              </div>
              <div className="p-4 flex items-center gap-3">
                <input
                  type="number"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 bg-transparent text-2xl font-bold text-foreground outline-none placeholder:text-muted-foreground/30 min-w-0"
                />
                <div className="flex gap-1">
                  {(availableTokens.length > 0 ? availableTokens.map(b => b.symbol) : ["USDC", "WETH"]).map(t => (
                    <button
                      key={t}
                      onClick={() => { setToken(t); setBudget(""); }}
                      className={`px-3 py-1.5 rounded-lg border text-[12px] font-semibold transition-colors ${token === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted/50"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              {overBudget && (
                <p className="px-5 pb-3 text-[11px] text-red-500">
                  Budget exceeds available git{token} balance. Lock more tokens first.
                </p>
              )}
            </div>

            {/* Generated command */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border/60">
                <p className="text-[11px] font-bold tracking-widest text-muted-foreground">BOT COMMAND</p>
              </div>
              <div className="p-4">
                <div className={`flex items-start justify-between gap-2 px-3 py-3 rounded-lg border transition-colors ${valid ? "bg-primary/5 border-primary/30" : "bg-muted/50 border-border"}`}>
                  <code className={`text-[13px] font-mono leading-relaxed break-all ${valid ? "text-foreground" : "text-muted-foreground"}`}>
                    {command}
                  </code>
                  <CopyButton text={command} />
                </div>
                <p className="text-[12px] text-muted-foreground mt-3 leading-relaxed">
                  {valid
                    ? "Copy this command and paste it as a comment in any connected GitHub issue or PR."
                    : "Fill in a project name and budget above to generate your command."}
                </p>
              </div>
            </div>

            {/* Fee preview */}
            {valid && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-muted/30 p-4 font-mono text-[12px] space-y-2">
                {[
                  ["Budget to lock", `${num} git${token}`],
                  ["Task assignment fee", "Free"],
                  ["Bounty payout fee", "0.20% on each PR merge"],
                  ["Gas", "Free (Gitbank)"],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between gap-4">
                    <span className="text-muted-foreground">{l}</span>
                    <span className="text-foreground text-right">{v}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* How it works */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border/60">
                <p className="text-[11px] font-bold tracking-widest text-muted-foreground">HOW IT WORKS</p>
              </div>
              <div className="divide-y divide-border/60">
                {[
                  { n: "1", t: "Paste the command in GitHub", d: "Comment on any connected issue or PR with the command above." },
                  { n: "2", t: "Bot creates the workspace", d: "Gitbank locks the budget in a smart contract escrow on Base L2 and opens the project." },
                  { n: "3", t: "Assign bounties from GitHub", d: `Use @gitbankbot assign this task to @username with ${num || 50} ${token} bounty on any issue.` },
                  { n: "4", t: "Auto-payout on PR merge", d: "When the linked PR merges, the bounty is released automatically to the contributor." },
                ].map(item => (
                  <div key={item.n} className="flex gap-4 px-5 py-3.5">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{item.n}</div>
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">{item.t}</p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent project creations */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border/60">
                <p className="text-[11px] font-bold tracking-widest text-muted-foreground">RECENT PROJECT CREATIONS</p>
              </div>
              {txLoading ? (
                <div className="p-6 text-center text-[13px] text-muted-foreground">Loading...</div>
              ) : !projectTxs.length ? (
                <div className="p-6 text-center text-[13px] text-muted-foreground">No projects created yet.</div>
              ) : (
                <div className="divide-y divide-border">
                  {projectTxs.map(tx => (
                    <div key={tx.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <StatusIcon status={tx.status} />
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-foreground">
                            {tx.amountIn
                              ? `${parseFloat(tx.amountIn).toLocaleString(undefined, { maximumFractionDigits: 6 })} ${tx.tokenIn ?? ""} locked`
                              : "Project created"}
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

          </motion.div>
        </div>
      </main>
    </div>
  );
}
