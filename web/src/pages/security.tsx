import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import DotGrid, { type PatternFn } from "@/components/DotGrid";

// Hero: shield with checkmark
const shieldPattern: PatternFn = (c, r, cols, rows) => {
  const cx = (cols - 1) / 2;
  const nc = (c - cx) / (cols / 2);
  const nr = r / rows;
  let maxW: number;
  if (nr < 0.58) {
    maxW = 0.82 - nr * 0.05;
  } else {
    maxW = 0.82 * (1 - ((nr - 0.58) / 0.42));
  }
  if (Math.abs(nc) > maxW) return 0;
  const edge = maxW - Math.abs(nc);
  if (edge < 0.07 || nr < 0.04) return 2;
  const onLeft = nc > -0.48 && nc < -0.02 && Math.abs(nr - (0.54 + (nc + 0.48) * 0.76)) < 0.055;
  const onRight = nc >= -0.02 && nc < 0.62 && Math.abs(nr - (0.76 - (nc + 0.02) * 1.0)) < 0.055;
  if (onLeft || onRight) return 3;
  return 1;
};

// Section: binary grid (soul-bound token concept)
const binaryPattern: PatternFn = (c, r, cols, rows) => {
  const v = Math.sin(c * 1.2) * Math.cos(r * 0.9) + Math.sin((c + r) * 0.7);
  if (v > 1.2) return 3;
  if (v > 0.5) return 2;
  if (v > -0.2) return 1;
  return 0;
};

// Section: lock grid (threat model)
const lockPattern: PatternFn = (c, r, cols, rows) => {
  const cells = Math.floor(c / 5) + Math.floor(r / 4);
  const cx = (c % 5), cy = (r % 4);
  if (cx === 0 || cy === 0) return 1;
  if (cx === 2 && cy === 2) return 3;
  if (cells % 3 === 0) return 2;
  return 1;
};

// Section: key rotation (circular arrows)
const rotatePattern: PatternFn = (c, r, cols, rows) => {
  const cx = (cols - 1) / 2, cy = (rows - 1) / 2;
  const d = Math.sqrt((c - cx) ** 2 + (r - cy) ** 2);
  const angle = Math.atan2(r - cy, c - cx);
  const rings = [cols * 0.15, cols * 0.28, cols * 0.4];
  for (const ring of rings) {
    if (Math.abs(d - ring) < 1.2) {
      // Only 3/4 of each ring (open circle for "rotation" effect)
      const normalizedAngle = (angle + Math.PI) / (2 * Math.PI);
      if (normalizedAngle < 0.78) return rings.indexOf(ring) === 1 ? 3 : 2;
    }
  }
  // Arrow head dots at the open end
  const arrowD = Math.sqrt((c - (cx + rings[1])) ** 2 + (r - cy) ** 2);
  if (arrowD < 2) return 3;
  return 0;
};

export default function SecurityPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        {/* HERO: centered shield + text below */}
        <div className="rounded-xl border border-border bg-muted/30 p-8 flex flex-col items-center mb-14">
          <DotGrid cols={72} rows={26} dotRadius={2.5} gap={2} patternFn={shieldPattern} />
          <div className="mt-7 text-center max-w-[640px]">
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Security</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Built to be cryptographically un-phishable</h1>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              Soul-bound tokens, permanent identity anchoring, and strict role enforcement work together to ensure that a compromised key, a renamed account, or a phishing site cannot move a single token.
            </p>
          </div>
        </div>

        {/* SOUL-BOUND: binary pattern on right, text on left */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-14">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Soul-bound GitTokens</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
              Every asset position in Gitbank is represented as a soul-bound GitToken. These tokens are ERC-20 in structure but have their transfer, transferFrom, and approve functions permanently disabled at the contract level. They revert unconditionally when called.
            </p>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
              This means that even if a user signs a malicious transaction on a phishing website, the website cannot drain the vault because the token has no mechanism to move funds.
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: "transfer()", status: "Permanently disabled", color: "text-red-500" },
                { label: "transferFrom()", status: "Permanently disabled", color: "text-red-500" },
                { label: "approve()", status: "Permanently disabled", color: "text-red-500" },
                { label: "gitShield / gitUnshield", status: "Authorized ops only", color: "text-primary" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between rounded-lg bg-muted/50 border border-border px-4 py-2.5">
                  <code className="text-[12px] font-mono text-foreground">{row.label}</code>
                  <span className={`text-[11px] font-medium ${row.color}`}>{row.status}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-6 flex items-center justify-center">
            <DotGrid cols={36} rows={22} dotRadius={2.5} gap={2} patternFn={binaryPattern} />
          </div>
        </div>

        {/* THREAT MODEL: lock pattern centered above table */}
        <div className="flex flex-col items-center mb-5">
          <div className="rounded-xl border border-border bg-muted/30 px-8 py-5 inline-flex">
            <DotGrid cols={52} rows={12} dotRadius={2} gap={2} patternFn={lockPattern} />
          </div>
          <div className="mt-5 text-center mb-4">
            <h2 className="text-xl font-bold text-foreground">Threat model</h2>
            <p className="text-[13px] text-muted-foreground mt-1">Every identified attack surface and the defense in place.</p>
          </div>
        </div>
        <div className="rounded-xl border border-border overflow-x-auto mb-14">
          <table className="w-full text-[13px] min-w-[420px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-3 font-semibold text-foreground">Threat</th>
                <th className="text-left px-5 py-3 font-semibold text-foreground">Defense</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Private key theft", "AES-256-GCM encryption at rest. Decrypted in memory under 200ms only during broadcast, then immediately discarded."],
                ["Username hijacking", "Permanent User ID anchoring. Username is never used for authentication or vault lookup."],
                ["Token phishing", "Soul-bound GitTokens have no transfer or approve function. Nothing to drain."],
                ["Replay attacks", "Monotonic nonce incremented on every state-changing vault operation."],
                ["Sandwich / MEV on swaps", "All swap transactions broadcast via Flashbots Protect RPC."],
                ["Swap slippage abuse", "minAmountOut and deadline parameters enforced at the contract level."],
                ["Reentrancy", "nonReentrant modifier and Checks-Effects-Interactions pattern on all fund-moving calls."],
                ["Webhook spoofing", "HMAC-SHA256 signature verification on every incoming GitHub event."],
                ["Keypair compromise", "Dual-signature scheme: every operation requires both the execution keypair AND a short-lived relayer signature issued after GitHub verification."],
                ["Prolonged inactivity", "emergencyWithdraw() available after a 6-month timestamp-based delay."],
                ["Unauthorized project ops", "Manager role verified on-chain before any project mutation executes."],
                ["Budget overspend", "Contract enforces that task escrow cannot exceed available project budget."],
              ].map(([threat, defense], i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-5 py-3.5 font-medium text-foreground align-top w-52">{threat}</td>
                  <td className="px-5 py-3.5 text-muted-foreground align-top">{defense}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* KEY ROTATION: rotation pattern on right, steps on left */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Dual-signature protection</h2>
            <div className="flex flex-col gap-3">
              {[
                { step: "1", title: "GitHub command verified first", desc: "The Gitbank server receives a webhook from GitHub and verifies the HMAC-SHA256 signature. Only then does it issue a relayer authorization signature." },
                { step: "2", title: "Short-lived relayer signature generated", desc: "The relayer signing key creates a 5-minute ECDSA signature over (vaultAddress, githubUserId, deadline). This signature is never stored." },
                { step: "3", title: "Both signatures required on-chain", desc: "The vault contract enforces that every state-changing call includes both the execution keypair (tx sender) and the valid relayer signature. Neither alone is sufficient." },
                { step: "4", title: "Emergency exit always available", desc: "emergencyWithdraw() requires only the execution keypair and is available after 6 months of inactivity, ensuring funds are never permanently locked." },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 rounded-lg border border-border bg-card px-5 py-4">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{item.step}</div>
                  <div>
                    <p className="text-[14px] font-semibold text-foreground mb-0.5">{item.title}</p>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-6 flex items-center justify-center">
            <DotGrid cols={36} rows={24} dotRadius={2.5} gap={2} patternFn={rotatePattern} />
          </div>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
