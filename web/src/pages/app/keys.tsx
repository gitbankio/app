import { useState } from "react";
import { motion } from "framer-motion";
import DAppSidebar from "@/components/layout/DAppSidebar";
import { Copy, Check, Eye, EyeOff, AlertTriangle, Shield, Download } from "lucide-react";
import { useGetMe, useGetVaultKey } from "@workspace/api-client-react";

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div>
      <p className="text-[11px] font-bold tracking-widest text-muted-foreground mb-2">{label}</p>
      <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/30">
        <p className="flex-1 text-[12px] font-mono text-foreground break-all">{value}</p>
        <button
          onClick={copy}
          className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
        >
          {copied ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
        </button>
      </div>
    </div>
  );
}

export default function Keys() {
  const { data: me } = useGetMe();
  const [pkRevealed, setPkRevealed] = useState(false);
  const [pkCopied, setPkCopied] = useState(false);
  const [fetchKey, setFetchKey] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: keyData, isLoading: keyLoading, isError: keyError } = useGetVaultKey({
    query: { enabled: fetchKey, staleTime: 0, gcTime: 0, retry: false } as any,
  });

  const privateKey = keyData?.privateKey ?? "";

  const handleReveal = () => {
    if (!fetchKey) setFetchKey(true);
    setPkRevealed(r => !r);
  };

  const copyPk = () => {
    if (!privateKey) return;
    navigator.clipboard.writeText(privateKey);
    setPkCopied(true);
    setTimeout(() => setPkCopied(false), 2000);
  };

  const downloadPk = () => {
    if (!privateKey) return;
    const content = [
      `Gitbank Vault Signing Key`,
      `Exported: ${new Date().toISOString()}`,
      ``,
      `Owner Address: ${keyData?.ownerAddress ?? ""}`,
      `Signing Key:   ${privateKey}`,
      ``,
      `Keep this file secret. Anyone with this key can operate your vault.`,
      `Delete after saving to a password manager.`,
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gitbank-vault-key.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasVault = !!me?.vaultAddress;

  return (
    <div className="flex min-h-screen bg-background">
      <DAppSidebar />
      <main className="md:ml-[185px] mt-14 md:mt-0 flex-1 min-h-screen overflow-y-auto">
        <div className="max-w-[600px] mx-auto px-4 md:px-8 py-8 md:py-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Account</p>
            <h1 className="text-2xl font-bold text-foreground mb-1">Keys</h1>
            <p className="text-[13px] text-muted-foreground mb-8">Your vault identity and signing key.</p>

            {/* Vault identity */}
            <div className="rounded-xl border border-border bg-card p-5 mb-4 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Shield size={14} className="text-primary" />
                <p className="text-[13px] font-bold text-foreground">Vault identity</p>
              </div>
              {me?.githubId != null && (
                <CopyField label="GITHUB ID" value={String(me.githubId)} />
              )}
              {me?.vaultAddress ? (
                <CopyField label="VAULT ADDRESS (BASE L2)" value={me.vaultAddress} />
              ) : (
                <div>
                  <p className="text-[11px] font-bold tracking-widest text-muted-foreground mb-2">VAULT ADDRESS (BASE L2)</p>
                  <p className="text-[12px] text-muted-foreground italic">Not deployed yet</p>
                </div>
              )}
              {me?.ownerAddress ? (
                <CopyField label="OWNER ADDRESS" value={me.ownerAddress} />
              ) : null}
            </div>

            {/* Private key */}
            {hasVault && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[13px] font-bold text-foreground">Vault signing key</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">
                      Keep this secret. Anyone with this key can operate your vault directly on-chain.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-amber-500/20 bg-background mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground">PRIVATE KEY</p>
                    <div className="flex gap-1">
                      <button
                        onClick={handleReveal}
                        disabled={keyLoading}
                        className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      >
                        {keyLoading ? (
                          <div className="w-3 h-3 border border-muted-foreground/40 border-t-muted-foreground rounded-full animate-spin" />
                        ) : pkRevealed ? (
                          <EyeOff size={13} />
                        ) : (
                          <Eye size={13} />
                        )}
                      </button>
                      <button
                        onClick={copyPk}
                        disabled={!privateKey}
                        className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      >
                        {pkCopied ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
                      </button>
                      <button
                        onClick={downloadPk}
                        disabled={!privateKey}
                        className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      >
                        <Download size={13} />
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] font-mono text-foreground break-all leading-relaxed">
                    {pkRevealed && privateKey
                      ? privateKey
                      : keyError
                      ? "Failed to load key. Try again."
                      : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
                  </p>
                </div>

                <p className="text-[11px] text-muted-foreground">
                  Click the eye icon to reveal, copy icon to copy, or download icon to save as a file.
                  Delete the file after storing in a password manager.
                </p>
              </div>
            )}

            {!hasVault && (
              <div className="rounded-xl border border-border bg-card p-5 text-center">
                <p className="text-[13px] text-muted-foreground">Deploy your vault first to access key settings.</p>
              </div>
            )}

          </motion.div>
        </div>
      </main>
    </div>
  );
}
