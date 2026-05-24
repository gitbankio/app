import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Zap, Shield, CheckCircle, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { useGetMe, useDeployVault } from "@workspace/api-client-react";

const STEPS = [
  { id: 1, icon: Github, label: "Connect GitHub" },
  { id: 2, icon: Zap,    label: "Deploy vault" },
  { id: 3, icon: Shield, label: "Ready" },
];

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);

  const { data: me, isLoading: meLoading } = useGetMe();

  const deployVault = useDeployVault({
    mutation: {
      onSuccess: () => setStep(2),
      onError: () => {},
    },
  });

  useEffect(() => {
    if (meLoading) return;
    if (!me) return;
    if (me.vaultAddress) {
      navigate("/app/dashboard");
      return;
    }
    if (step === 0) setStep(1);
  }, [me, meLoading]);

  if (meLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={22} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[480px]">
        <div className="flex items-center gap-2.5 mb-10 justify-center">
          <img src="/logo.png" alt="Gitbank" className="w-8 h-8 rounded-lg object-cover" />
          <span className="text-[18px] font-bold text-foreground">Gitbank</span>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                i < step ? "bg-primary text-primary-foreground"
                : i === step ? "bg-primary/20 text-primary border border-primary/40"
                : "bg-muted text-muted-foreground"
              }`}>
                {i < step ? <CheckCircle size={13} /> : s.id}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-6 h-px ${i < step ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            {step === 0 && (
              <div className="p-8 flex flex-col items-center text-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Github size={28} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">Connect your GitHub account</h2>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Gitbank identifies you by your permanent GitHub User ID. This anchors your vault forever, even if you rename your account.
                  </p>
                </div>
                <div className="w-full p-4 rounded-xl bg-muted/50 border border-border text-left">
                  <p className="text-[11px] font-bold text-muted-foreground tracking-widest mb-2">PERMISSIONS REQUESTED</p>
                  {["Read your GitHub User ID (immutable)", "Read public repository metadata", "Post comments as @gitbankbot"].map(p => (
                    <div key={p} className="flex items-center gap-2 py-1">
                      <CheckCircle size={12} className="text-primary flex-shrink-0" />
                      <span className="text-[12px] text-foreground">{p}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="/api/auth/github"
                  className="w-full py-3 rounded-xl bg-foreground text-background text-[14px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Github size={16} /> Continue with GitHub
                </a>
              </div>
            )}

            {step === 1 && (
              <div className="p-8 flex flex-col items-center text-center gap-6">
                <div className={`w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center ${deployVault.isPending ? "animate-pulse" : ""}`}>
                  <Zap size={28} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    {deployVault.isPending ? "Deploying vault on Base..." : "Deploy your GitVault"}
                  </h2>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    A GitVault contract is deployed on Base L2 and permanently anchored to your GitHub ID #{me?.githubId}. No wallet or gas needed.
                  </p>
                </div>

                <div className="w-full p-4 rounded-xl bg-muted/50 border border-border font-mono text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[11px] text-muted-foreground">GitHub login</span>
                    <span className="text-[11px] text-foreground">@{me?.githubLogin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[11px] text-muted-foreground">GitHub ID</span>
                    <span className="text-[11px] text-foreground">#{me?.githubId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[11px] text-muted-foreground">Network</span>
                    <span className="text-[11px] text-primary">Base L2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[11px] text-muted-foreground">Gas paid by</span>
                    <span className="text-[11px] text-foreground">Gitbank</span>
                  </div>
                </div>

                {deployVault.isError && (
                  <div className="w-full flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                    <p className="text-[12px] text-red-600">
                      {(deployVault.error as { data?: { error?: string } })?.data?.error ?? "Deploy failed. Please try again."}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => deployVault.mutate()}
                  disabled={deployVault.isPending}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-[14px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {deployVault.isPending ? (
                    <><Loader2 size={15} className="animate-spin" /> Deploying on Base L2...</>
                  ) : (
                    <>Deploy vault <ChevronRight size={15} /></>
                  )}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="p-8 flex flex-col items-center text-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle size={28} className="text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">Vault deployed</h2>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Your GitVault is live on Base L2. All IssueOps commands now run through your GitHub repo by mentioning <span className="font-mono text-foreground">@gitbankbot</span>.
                  </p>
                </div>

                <div className="w-full p-4 rounded-xl bg-muted/50 border border-border font-mono text-left space-y-2">
                  {deployVault.data?.ownerAddress && (
                    <div className="flex justify-between gap-4">
                      <span className="text-[11px] text-muted-foreground flex-shrink-0">Owner key</span>
                      <span className="text-[11px] text-foreground truncate">{deployVault.data.ownerAddress.slice(0, 20)}...</span>
                    </div>
                  )}
                  {deployVault.data?.txHash && (
                    <div className="flex justify-between gap-4">
                      <span className="text-[11px] text-muted-foreground flex-shrink-0">Tx hash</span>
                      <a
                        href={`https://basescan.org/tx/${deployVault.data.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-primary truncate hover:underline"
                      >
                        {deployVault.data.txHash.slice(0, 20)}...
                      </a>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[11px] text-muted-foreground">Status</span>
                    <span className="text-[11px] text-amber-500">Confirming on chain...</span>
                  </div>
                </div>

                <div className="w-full p-3 rounded-xl bg-primary/5 border border-primary/20 text-left">
                  <p className="text-[12px] text-muted-foreground leading-relaxed">
                    All commands run through GitHub. Mention <span className="font-mono text-foreground">@gitbankbot</span> in any connected issue or PR to lock, unlock, swap, or transfer assets. Gas is always covered.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/app/dashboard")}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-[14px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <CheckCircle size={15} /> Enter Gitbank
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-[12px] text-muted-foreground mt-6">
          By continuing you agree to the{" "}
          <a href="/terms" className="underline hover:text-foreground">Terms of Service</a>
        </p>
      </div>
    </div>
  );
}
