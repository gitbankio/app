import { motion } from "framer-motion";
import { useLocation } from "wouter";
import AppSidebar from "@/components/layout/AppSidebar";
import Footer from "@/components/layout/Footer";

const VAULT_ADDRESS   = "0x639df7b02daf540f145b4a9aab76e9896af7dd0c";
const PRIVKEY         = "0x1a40cabe6d39ff1d94d6d5c7a78dd32c8b29d4ae3e801573d7d48cb05632ac1d";
const BASESCAN_TOKEN  = "https://basescan.org/token/0xcfd8296ecc8541b2174f6e25cf6f69f5dc85e98a?a=0x639df7b02daf540f145b4a9aab76e9896af7dd0c#transactions";
const PRIZE_AMOUNT    = "504";

function PixelLock() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ imageRendering: "pixelated" }}>
      <rect x="12" y="4"  width="24" height="4"  fill="#ef4444" />
      <rect x="8"  y="8"  width="32" height="4"  fill="#ef4444" />
      <rect x="8"  y="12" width="4"  height="12" fill="#ef4444" />
      <rect x="36" y="12" width="4"  height="12" fill="#ef4444" />
      <rect x="4"  y="24" width="40" height="20" fill="#ef4444" />
      <rect x="8"  y="28" width="32" height="12" fill="#7f1d1d" />
      <rect x="20" y="30" width="8"  height="4"  fill="#fca5a5" />
      <rect x="22" y="34" width="4"  height="4"  fill="#fca5a5" />
    </svg>
  );
}

function PixelX() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ imageRendering: "pixelated" }}>
      <rect x="2"  y="2"  width="4" height="4" fill="currentColor" />
      <rect x="6"  y="6"  width="4" height="4" fill="currentColor" />
      <rect x="10" y="10" width="4" height="4" fill="currentColor" />
      <rect x="14" y="14" width="4" height="4" fill="currentColor" />
      <rect x="14" y="2"  width="4" height="4" fill="currentColor" />
      <rect x="10" y="6"  width="4" height="4" fill="currentColor" />
      <rect x="6"  y="10" width="4" height="4" fill="currentColor" />
      <rect x="2"  y="14" width="4" height="4" fill="currentColor" />
    </svg>
  );
}

function PixelGitHub() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ imageRendering: "pixelated" }}>
      <rect x="6"  y="0"  width="8" height="2" fill="currentColor" />
      <rect x="4"  y="2"  width="12" height="2" fill="currentColor" />
      <rect x="2"  y="4"  width="16" height="4" fill="currentColor" />
      <rect x="2"  y="8"  width="4"  height="4" fill="currentColor" />
      <rect x="14" y="8"  width="4"  height="4" fill="currentColor" />
      <rect x="2"  y="12" width="16" height="2" fill="currentColor" />
      <rect x="4"  y="14" width="4"  height="4" fill="currentColor" />
      <rect x="12" y="14" width="4"  height="4" fill="currentColor" />
    </svg>
  );
}

function PixelShield() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ imageRendering: "pixelated" }}>
      <rect x="4"  y="0"  width="16" height="2" fill="#22c55e" />
      <rect x="2"  y="2"  width="20" height="10" fill="#22c55e" />
      <rect x="4"  y="12" width="16" height="4" fill="#22c55e" />
      <rect x="6"  y="16" width="12" height="4" fill="#22c55e" />
      <rect x="8"  y="20" width="8"  height="2" fill="#22c55e" />
      <rect x="10" y="22" width="4"  height="2" fill="#22c55e" />
      <rect x="8"  y="6"  width="2"  height="6" fill="white" />
      <rect x="10" y="10" width="6"  height="2" fill="white" />
    </svg>
  );
}

function PixelKey() {
  return (
    <svg width="48" height="20" viewBox="0 0 48 20" fill="none" style={{ imageRendering: "pixelated" }}>
      <rect x="0"  y="6"  width="4"  height="8" fill="#f59e0b" />
      <rect x="4"  y="4"  width="4"  height="12" fill="#f59e0b" />
      <rect x="8"  y="2"  width="4"  height="16" fill="#f59e0b" />
      <rect x="12" y="4"  width="4"  height="12" fill="#f59e0b" />
      <rect x="16" y="6"  width="4"  height="8" fill="#f59e0b" />
      <rect x="8"  y="6"  width="4"  height="8" fill="#1c1917" />
      <rect x="22" y="9"  width="26" height="2" fill="#f59e0b" />
      <rect x="38" y="11" width="4"  height="4" fill="#f59e0b" />
      <rect x="44" y="11" width="4"  height="4" fill="#f59e0b" />
    </svg>
  );
}

function ArchFlow() {
  const box = "rounded border px-3 py-2 text-center text-[11px] font-mono leading-tight";

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[560px] p-4">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className={`${box} border-red-500/50 bg-red-500/10 text-red-400 w-full`}>
              <div className="text-[10px] text-red-400/60 mb-0.5">ATTACKER</div>
              Owner Private Key
            </div>
            <div className="text-muted-foreground text-[18px]">↓</div>
            <div className={`${box} border-red-500/30 bg-red-500/5 text-red-300 w-full`}>
              Signs ownerSig
              <div className="text-[9px] text-red-400/50 mt-0.5">keccak256(vault, githubUserId, nonce, deadline)</div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className={`${box} border-primary/40 bg-primary/10 text-primary w-full`}>
              <div className="text-[10px] text-primary/60 mb-0.5">GITBANK SERVER</div>
              relayerSigner Key
            </div>
            <div className="text-muted-foreground text-[18px]">↓</div>
            <div className={`${box} border-primary/30 bg-primary/5 text-primary/70 w-full`}>
              <span className="text-red-400">BLOCKED</span> -- must verify
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="flex items-center gap-1 text-[9px]">
                  <span className="text-foreground/60">GitHub ID</span>
                </span>
                <span className="text-muted-foreground">or</span>
                <span className="flex items-center gap-1 text-[9px]">
                  <span className="text-foreground/60">X ID</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-20 mb-2">
          <div className="flex flex-col items-center">
            <div className="text-muted-foreground text-[14px]">↘</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-muted-foreground text-[14px]">↙</div>
          </div>
        </div>

        <div className="flex justify-center mb-2">
          <div className={`${box} border-yellow-500/40 bg-yellow-500/5 text-yellow-400 w-full max-w-sm`}>
            <div className="text-[10px] text-yellow-400/60 mb-0.5">CONTRACT -- BASE MAINNET</div>
            GitVault.gitUnshield()
            <div className="text-[9px] text-yellow-400/40 mt-0.5">requireOwnerAuth + requireRelayerAuth</div>
          </div>
        </div>

        <div className="flex justify-center gap-6 mb-2 text-[11px] font-mono">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-green-400">ownerSig valid</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-red-400">relayerSig missing</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className={`${box} border-red-600/50 bg-red-600/10 text-red-400 w-full max-w-sm`}>
            REVERT: "GitVault: invalid relayer sig"
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-[10px] text-muted-foreground text-center mb-2 tracking-widest uppercase">Dual-Signature Security Model</div>
          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            {[
              { label: "ownerSig alone", result: "FAILS", color: "text-red-400" },
              { label: "relayerSig alone", result: "FAILS", color: "text-red-400" },
              { label: "Both signatures", result: "PASSES", color: "text-green-400" },
            ].map(r => (
              <div key={r.label} className="border border-border rounded p-2">
                <div className="text-muted-foreground mb-1 font-mono">{r.label}</div>
                <div className={`font-bold ${r.color}`}>{r.result}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurityTable() {
  const rows = [
    { op: "gitShield",        ownerSig: true,  relayerSig: true,  emergencyOnly: false },
    { op: "gitUnshield",      ownerSig: true,  relayerSig: true,  emergencyOnly: false },
    { op: "gitSwap",          ownerSig: true,  relayerSig: true,  emergencyOnly: false },
    { op: "initTransfer",     ownerSig: true,  relayerSig: true,  emergencyOnly: false },
    { op: "finalizeTransfer", ownerSig: true,  relayerSig: true,  emergencyOnly: false },
    { op: "emergencyWithdraw",ownerSig: false, relayerSig: false, emergencyOnly: true  },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px] font-mono border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-muted-foreground py-1.5 pr-4 font-normal">Function</th>
            <th className="text-center text-muted-foreground py-1.5 px-2 font-normal">ownerSig</th>
            <th className="text-center text-muted-foreground py-1.5 px-2 font-normal">relayerSig</th>
            <th className="text-center text-muted-foreground py-1.5 px-2 font-normal">Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.op} className="border-b border-border/40">
              <td className="py-1.5 pr-4 text-foreground/80">{r.op}()</td>
              <td className="text-center py-1.5 px-2">
                {r.ownerSig ? <span className="text-green-400">required</span> : <span className="text-muted-foreground">--</span>}
              </td>
              <td className="text-center py-1.5 px-2">
                {r.relayerSig ? <span className="text-green-400">required</span> : <span className="text-muted-foreground">--</span>}
              </td>
              <td className="text-center py-1.5 px-2">
                {r.emergencyOnly
                  ? <span className="text-yellow-400">6-month inactivity gate</span>
                  : <span className="text-primary/60">needs GitHub/X verification</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function OpenHackPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppSidebar />

      <main className="flex-1 md:ml-[185px]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 py-10 sm:py-16">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <PixelLock />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold tracking-widest uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Live Challenge
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">OpenHack</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  Hack the Vault. Keep the Prize.
                </h1>
              </div>
            </div>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              We are sharing the owner private key to a live vault on Base Mainnet. Inside: <span className="text-foreground font-semibold">{PRIZE_AMOUNT} gitUSDC</span>. If you can unshield and send those funds to any address, they are yours. No tricks, no time limits.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative rounded-2xl border border-red-500/30 bg-red-500/5 overflow-hidden mb-8"
          >
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: "radial-gradient(circle, #ef4444 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }} />
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <PixelKey />
                <span className="text-[11px] text-muted-foreground font-mono tracking-widest uppercase">Owner Private Key</span>
              </div>
              <div className="font-mono text-[13px] sm:text-[14px] text-red-300 bg-black/30 rounded-lg px-4 py-3 break-all border border-red-500/20 mb-4 select-all">
                {PRIVKEY}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div>
                  <div className="text-[11px] text-muted-foreground font-mono mb-0.5">Vault Address</div>
                  <div className="font-mono text-[12px] text-foreground/70 break-all">{VAULT_ADDRESS}</div>
                </div>
                <a
                  href={BASESCAN_TOKEN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-accent transition-colors text-[12px] font-medium"
                >
                  View on Basescan
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 10L10 2M5 2h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="grid grid-cols-3 gap-3 mb-10"
          >
            {[
              { label: "Prize Pool", value: `${PRIZE_AMOUNT} gitUSDC`, color: "text-yellow-400" },
              { label: "Time Limit", value: "None", color: "text-foreground" },
              { label: "Attempts", value: "Unlimited", color: "text-foreground" },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{s.label}</div>
                <div className={`text-[15px] font-bold ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-1">
              <PixelShield />
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Why This Works</p>
            </div>
            <h2 className="text-[18px] font-bold text-foreground mb-3">The private key is not enough</h2>
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-6">
              Every GitVault function requires <span className="text-foreground font-semibold">two independent ECDSA signatures</span> before the contract executes anything. Owning the private key only gets you one of them. The second signature comes from the Gitbank relayer server -- and the relayer only signs after verifying a real GitHub bot command or X mention from the vault owner's account.
            </p>

            <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
              <div className="px-4 py-2.5 border-b border-border bg-muted/30">
                <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">Attack Flow Diagram</span>
              </div>
              <ArchFlow />
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border bg-muted/30">
                <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">Contract Access Control</span>
              </div>
              <div className="p-4">
                <SecurityTable />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mb-8"
          >
            <h2 className="text-[18px] font-bold text-foreground mb-3">What you would need</h2>
            <div className="flex flex-col gap-3">
              {[
                {
                  num: "01",
                  title: "Owner private key",
                  desc: "Already shared above. This signs ownerSig covering vault address, GitHub User ID, nonce, and deadline.",
                  status: "given",
                },
                {
                  num: "02",
                  title: "Relayer signature",
                  desc: "Issued by Gitbank server only after the vault owner types a command via GitHub Issues or X reply. Server holds this key -- you do not.",
                  status: "blocked",
                },
                {
                  num: "03",
                  title: "Valid nonce + 5-min deadline",
                  desc: "Signatures expire in 5 minutes. Even a replayed valid transaction from history is useless -- nonce is monotonic and increments after each operation.",
                  status: "blocked",
                },
              ].map(step => (
                <div key={step.num} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                  <div className="font-mono text-[11px] text-muted-foreground flex-shrink-0 pt-0.5">{step.num}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[13px] font-semibold text-foreground">{step.title}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-widest uppercase ${
                        step.status === "given"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {step.status === "given" ? "Given" : "Blocked"}
                      </span>
                    </div>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8"
          >
            <h2 className="text-[16px] font-bold text-foreground mb-3">Why this matters for AI agents</h2>
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
              AI agents need wallets. Today every agent wallet is one leaked private key away from being drained. GitVault changes that. Even if your agent's key is exposed -- through a prompt injection, a memory leak, or a compromised model -- the vault stays locked. No GitHub or X identity, no movement.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
              {[
                {
                  icon: <span className="text-foreground"><PixelGitHub /></span>,
                  label: "GitHub-anchored",
                  desc: "Commands via GitHub Issues and PRs. Permanent user ID, never reused.",
                },
                {
                  icon: <span className="text-foreground"><PixelX /></span>,
                  label: "X-anchored",
                  desc: "Commands via X replies. Same vault, same security model.",
                },
                {
                  icon: <span className="text-green-400 text-[18px]">⛓</span>,
                  label: "Soul-bound gitTokens",
                  desc: "Non-transferable. Cannot be phished or drained via approval exploit.",
                },
                {
                  icon: <span className="text-yellow-400 text-[18px]">0</span>,
                  label: "Zero gas for users",
                  desc: "Relayer pays all gas. Agent wallets need zero ETH to operate.",
                },
              ].map(f => (
                <div key={f.label} className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">{f.icon}</div>
                  <div>
                    <div className="font-semibold text-foreground mb-0.5">{f.label}</div>
                    <div className="text-muted-foreground leading-relaxed">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <button
              onClick={() => navigate("/app/onboarding")}
              className="flex-1 py-3 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-[14px] hover:bg-primary/90 transition-colors"
            >
              Deploy your own vault
            </button>
            <button
              onClick={() => navigate("/security")}
              className="flex-1 py-3 px-5 rounded-xl border border-border bg-card font-semibold text-[14px] hover:bg-accent transition-colors"
            >
              Read security docs
            </button>
          </motion.div>

        </div>
        <Footer />
      </main>
    </div>
  );
}
