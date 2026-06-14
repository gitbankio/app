import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useSearch } from "wouter";
import { Copy, Check, Loader2, CheckCircle2, Clock, ExternalLink, Twitter } from "lucide-react";

interface VaultStatus {
  vaultAddress: string;
  network: string;
  explorerTx: string;
  pending: {
    token: string;
    amount: string | null;
    expiresAt: string;
    tweetId: string | null;
  } | null;
  completed: {
    txHash: string;
    amount: string | null;
    status: string;
  } | null;
}

interface LogEntry {
  ts: string;
  msg: string;
  kind: "info" | "ok" | "warn";
}

function timestamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
      title="Copy address"
    >
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
    </button>
  );
}

function AddressDisplay({ address }: { address: string }) {
  const short = `${address.slice(0, 10)}...${address.slice(-8)}`;
  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-sm text-zinc-300 break-all hidden sm:block">{address}</span>
      <span className="font-mono text-sm text-zinc-300 sm:hidden">{short}</span>
      <CopyButton text={address} />
    </div>
  );
}

function ActivityLog({ entries }: { entries: LogEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <div
      ref={ref}
      className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 max-h-36 overflow-y-auto text-left"
    >
      {entries.map((e, i) => (
        <div key={i} className="flex gap-2 text-xs leading-5">
          <span className="text-zinc-600 shrink-0 font-mono">{e.ts}</span>
          <span
            className={
              e.kind === "ok"
                ? "text-green-400"
                : e.kind === "warn"
                ? "text-yellow-400"
                : "text-zinc-400"
            }
          >
            {e.msg}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function DepositTracker() {
  const { xUserId } = useParams<{ xUserId: string }>();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const tweetId = params.get("tweet");

  const [status, setStatus] = useState<VaultStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [wasShielded, setWasShielded] = useState(false);
  const [shieldedTxHash, setShieldedTxHash] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const pollCountRef = useRef(0);

  const addLog = useCallback((msg: string, kind: LogEntry["kind"] = "info") => {
    setLogs((prev) => {
      const next = [...prev, { ts: timestamp(), msg, kind }];
      return next.length > 20 ? next.slice(-20) : next;
    });
  }, []);

  const poll = useCallback(async () => {
    pollCountRef.current += 1;
    const n = pollCountRef.current;
    if (n > 1) addLog("Checking vault status...");
    try {
      const res = await fetch(`/api/v/${xUserId}`);
      setLastChecked(timestamp());
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        setError(data.error ?? "Vault not found.");
        setLoading(false);
        addLog("Error: " + (data.error ?? "Vault not found"), "warn");
        return;
      }
      const data = await res.json() as VaultStatus;
      setStatus(data);
      setLoading(false);

      if (data.completed && !wasShielded) {
        setWasShielded(true);
        setShieldedTxHash(data.completed.txHash);
        addLog(`Shield confirmed! Tx: ...${data.completed.txHash.slice(-8)}`, "ok");
      } else if (data.pending && n > 1) {
        addLog(`Waiting. No balance detected yet.`);
      } else if (!data.pending && !data.completed && n > 1) {
        addLog("No active deposit session found", "warn");
      }
    } catch {
      setLastChecked(timestamp());
      setLoading(false);
      addLog("Could not reach Gitbank server", "warn");
      setError("Could not reach Gitbank server.");
    }
  }, [xUserId, wasShielded, addLog]);

  useEffect(() => {
    addLog("Deposit tracker started");
    poll();
    const interval = setInterval(poll, 5_000);
    return () => clearInterval(interval);
  }, [poll, addLog]);

  const tweetUrl = tweetId ? `https://x.com/i/web/status/${tweetId}` : null;
  const isShielded = wasShielded || (status?.completed != null && status.pending == null);
  const txHash = shieldedTxHash ?? status?.completed?.txHash ?? null;
  const explorerTx = status?.explorerTx ?? "https://basescan.org/tx";

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" aria-hidden>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest">Gitbank</p>
            <h1 className="text-lg font-semibold leading-tight">Deposit Tracker</h1>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">

          {loading && (
            <div className="p-10 flex flex-col items-center gap-3 text-zinc-400">
              <Loader2 size={28} className="animate-spin" />
              <p className="text-sm">Loading vault info...</p>
            </div>
          )}

          {!loading && error && (
            <div className="p-10 text-center">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && status && (
            <>
              {/* Vault address row */}
              <div className="px-6 py-4 border-b border-zinc-800">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Your Vault on Base</p>
                <AddressDisplay address={status.vaultAddress} />
              </div>

              {/* Network */}
              <div className="px-6 py-3 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-500">Network</span>
                <span className="text-xs font-mono text-zinc-300">{status.network}</span>
              </div>

              {/* Status section */}
              {isShielded ? (
                /* SUCCESS */
                <div className="px-6 py-8 flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-green-400">Deposit Confirmed</p>
                    <p className="text-sm text-zinc-400 mt-1">
                      Your tokens are now shielded in your vault.
                    </p>
                  </div>

                  {txHash && (
                    <a
                      href={`${explorerTx}/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-mono"
                    >
                      <ExternalLink size={12} />
                      {txHash.slice(0, 12)}...{txHash.slice(-8)}
                    </a>
                  )}

                  <ActivityLog entries={logs} />

                  <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                    {tweetUrl && (
                      <a
                        href={tweetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-medium transition-colors"
                      >
                        <Twitter size={15} />
                        Back to X
                      </a>
                    )}
                    <a
                      href="https://gitbank.io"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition-colors"
                    >
                      Go to Gitbank
                    </a>
                  </div>
                </div>
              ) : status.pending ? (
                /* PENDING */
                <div className="px-6 py-8 flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-indigo-500/10 flex items-center justify-center">
                    <Clock size={28} className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">Waiting for your deposit</p>
                    {status.pending.amount ? (
                      <p className="text-2xl font-bold text-indigo-400 mt-1">
                        {status.pending.amount} {status.pending.token}
                      </p>
                    ) : (
                      <p className="text-sm text-zinc-400 mt-1">
                        Send any amount of {status.pending.token}
                      </p>
                    )}
                  </div>

                  <div className="w-full rounded-xl bg-zinc-800 p-4 text-left">
                    <p className="text-xs text-zinc-500 mb-1">Send to your vault address above</p>
                    <p className="text-xs text-zinc-400">
                      Once received, Gitbank auto-shields within 30 seconds.
                      No action needed on your end.
                    </p>
                  </div>

                  {/* Activity Log */}
                  <ActivityLog entries={logs} />

                  {/* Live poll indicator */}
                  <div className="flex items-center justify-between w-full text-xs text-zinc-500">
                    <div className="flex items-center gap-1.5">
                      <Loader2 size={11} className="animate-spin" />
                      <span>Checking every 5s</span>
                    </div>
                    {lastChecked && (
                      <span className="font-mono">Last: {lastChecked}</span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-600">
                    Expires {new Date(status.pending.expiresAt).toLocaleString()}
                  </p>
                </div>
              ) : (
                /* NO PENDING */
                <div className="px-6 py-8 text-center">
                  <p className="text-sm text-zinc-400">
                    No active deposit session found.
                  </p>
                  <p className="text-xs text-zinc-600 mt-2">
                    Tweet <span className="font-mono text-zinc-400">@gitbankbot deposit 10 USDC</span> to start one.
                  </p>
                  <ActivityLog entries={logs} />
                </div>
              )}
            </>
          )}
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          Gitbank &mdash; Soul-bound vaults on Base L2
        </p>
      </div>
    </div>
  );
}
