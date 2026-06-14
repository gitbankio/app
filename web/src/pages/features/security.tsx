import FeaturePage from "./_template";
import { Shield } from "lucide-react";
import { NinjaCat } from "@/components/mascots";

function SecurityDiagram() {
  const ac = "#ef4444";
  return (
    <svg width="260" height="66" viewBox="0 0 260 66" fill="none" aria-hidden style={{imageRendering:"pixelated"}}>
      <rect x="4"   y="21" width="56" height="24" rx="2" fill="#ef444411" stroke={ac} strokeWidth="0.75"/>
      <text x="32"  y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">OWNER KEY</text>
      <text x="32"  y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">GH IDENTITY</text>
      <rect x="60"  y="32.25" width="6" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="66,30 66,36 70,33" fill={ac} fillOpacity="0.5"/>
      <rect x="70"  y="21" width="56" height="24" rx="2" fill="#ef444411" stroke={ac} strokeWidth="0.75"/>
      <text x="98"  y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">RELAYER KEY</text>
      <text x="98"  y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">AES-256-GCM</text>
      <rect x="126" y="32.25" width="6" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="132,30 132,36 136,33" fill={ac} fillOpacity="0.5"/>
      <rect x="136" y="21" width="56" height="24" rx="2" fill="#ef444411" stroke={ac} strokeWidth="0.75"/>
      <text x="164" y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">2-OF-2</text>
      <text x="164" y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">VERIFY + NONCE</text>
      <rect x="192" y="32.25" width="6" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="198,30 198,36 202,33" fill={ac} fillOpacity="0.5"/>
      <rect x="202" y="21" width="54" height="24" rx="2" fill="#ef444411" stroke={ac} strokeWidth="0.75"/>
      <text x="229" y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">EXECUTE</text>
      <text x="229" y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">VAULT OP</text>
    </svg>
  );
}

export default function SecurityFeaturePage() {
  return (
    <FeaturePage
      data={{
        status: "LIVE",
        accent: "#ef4444",
        title: "Security Layer",
        tagline: "No transfer. No approve. No single point of failure.",
        icon: <Shield size={28} />,
        mascot: <NinjaCat />,
        heroDiagram: <SecurityDiagram />,
        description:
          "Gitbank re-engineered the smart contract wallet to eliminate the attack surface responsible for billions in DeFi losses. Soul-bound tokens, dual-sig meta-transactions, permanent GitHub identity anchoring, and commit-reveal transfers combine into a security model without industry precedent.",
        features: [
          {
            title: "Soul-bound tokens",
            desc: "GitToken overrides ERC-20 transfer() and approve() to permanently revert. Tokens can never leave the vault, can never be approved to a drainer contract. Phishing and approval exploits are structurally impossible.",
          },
          {
            title: "Dual-sig meta-transactions",
            desc: "Every state-changing operation requires two ECDSA signatures: ownerSig (your execution keypair) and relayerSig (short-lived Gitbank authorization). Neither key alone can execute anything.",
          },
          {
            title: "Permanent GitHub ID anchor",
            desc: "Vaults are keyed to your GitHub integer ID assigned at account creation. Integer IDs are immutable, cannot be changed by username rename, account transfer, or GitHub support. Impossible to spoof.",
          },
          {
            title: "Commit-reveal transfers",
            desc: "2-step: initTransfer() records a hash commitment on-chain. finalizeTransfer() reveals and executes. MEV bots cannot front-run because they do not know the recipient until finalize.",
          },
          {
            title: "Monotonic nonce replay protection",
            desc: "Every GitVault has a monotonically incrementing nonce. Each signed meta-tx is valid for exactly one nonce value. Replaying an old signature always fails.",
          },
          {
            title: "5-minute signature deadlines",
            desc: "Every meta-tx carries a deadline timestamp (block.timestamp + 300s). Signatures expire in 5 minutes. Stolen signatures are useless after the window closes.",
          },
        ],
        steps: [
          {
            step: "01",
            title: "Soul-bound",
            desc: "Token overrides ERC-20 transfer/approve to revert. No matter what contract calls them, the functions always fail.",
          },
          {
            step: "02",
            title: "Dual-sig",
            desc: "The vault validates ownerSig + relayerSig on every call. A single compromised key cannot move funds.",
          },
          {
            step: "03",
            title: "GitHub ID anchor",
            desc: "The GitHub integer ID is your permanent vault key. No ENS, no seed phrase, your GitHub account IS your vault identity.",
          },
          {
            step: "04",
            title: "Commit-reveal",
            desc: "Transfers commit a hash first, reveal recipient and amount second. Front-running is structurally prevented.",
          },
        ],
        architecture: [
          {
            layer: "GitToken (ERC-20 override)",
            what: "transfer() and approve() permanently revert",
            why: "The soul-bound token overrides both functions with a revert. This is enforced at the contract level, no proxy, no upgrade path, no admin key can change this behavior after deployment.",
          },
          {
            layer: "Dual-sig validation",
            what: "keccak256(abi.encode(params, nonce, deadline)), two signers",
            why: "The owner signature proves intent. The relayer signature proves GitHub authorization. Both are validated via ECDSA.recover() inside the vault. If either fails, the tx reverts.",
          },
          {
            layer: "GitHub integer ID",
            what: "Immutable per-account integer assigned by GitHub",
            why: "GitHub integer IDs cannot be changed. Even if a username is renamed or sold, the integer ID stays constant. This means vault identity survives GitHub account name changes.",
          },
          {
            layer: "initTransfer / finalizeTransfer",
            what: "Commit hash on-chain, reveal on confirmation",
            why: "initTransfer stores keccak256(recipient, amount, salt). finalizeTransfer reveals all three. The commitment prevents MEV searchers from seeing the recipient during the 5-minute confirmation window.",
          },
          {
            layer: "Nonce",
            what: "Per-vault monotonically incrementing uint256",
            why: "Included in every signed payload. After execution, nonce increments. Any attempt to replay an old signature with an old nonce value reverts with InvalidNonce.",
          },
          {
            layer: "Deadline",
            what: "block.timestamp + 300 seconds",
            why: "The relayer sets the deadline when building the meta-tx. Signatures expire 5 minutes after creation. Even if a signature leaks (e.g. in a public GitHub comment), it expires quickly.",
          },
        ],
        faq: [
          {
            q: "What if my GitHub account is compromised?",
            a: "The attacker would need to both: (1) comment from your GitHub account to fool the relayer, AND (2) have your execution keypair. GitHub 2FA (passkey, TOTP, SMS) provides defense-in-depth. Key rotation is on the roadmap.",
          },
          {
            q: "What if Gitbank's relayer is compromised?",
            a: "A compromised relayer only has relayerSig, it still needs your ownerSig (execution keypair). Without ownerSig, no vault operation can execute. Dual-sig means Gitbank cannot drain user vaults even in a worst-case breach.",
          },
          {
            q: "Are the contracts audited?",
            a: "The contracts are open-source on GitHub (gitbank/contracts). A formal audit is planned for Q3 2026 before full public launch. Audit reports will be published on-chain and linked from the dashboard.",
          },
          {
            q: "Can Gitbank upgrade the contracts?",
            a: "No. GitVaults are immutable minimal proxy clones. The implementation contract is not upgradeable. Once deployed, the vault logic is frozen on-chain.",
          },
          {
            q: "What happens if the Gitbank relayer goes offline?",
            a: "During downtime, meta-transactions cannot be submitted. Funds remain safely in vaults, offline relayer cannot execute anything. Emergency withdrawal functions are planned for v4 to allow direct vault access.",
          },
        ],
      }}
    />
  );
}
