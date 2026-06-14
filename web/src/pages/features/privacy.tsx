import FeaturePage from "./_template";
import { Lock } from "lucide-react";
import { ShadowCat } from "@/components/mascots";

function PrivacyDiagram() {
  const ac = "#6366f1";
  return (
    <svg width="260" height="66" viewBox="0 0 260 66" fill="none" aria-hidden style={{imageRendering:"pixelated"}}>
      <rect x="4"   y="21" width="56" height="24" rx="2" fill="#6366f111" stroke={ac} strokeWidth="0.75"/>
      <text x="32"  y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">EXEC KEYPAIR</text>
      <text x="32"  y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">GEN ON DEPLOY</text>
      <rect x="60"  y="32.25" width="6" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="66,30 66,36 70,33" fill={ac} fillOpacity="0.5"/>
      <rect x="70"  y="21" width="56" height="24" rx="2" fill="#6366f111" stroke={ac} strokeWidth="0.75"/>
      <text x="98"  y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">AES-256-GCM</text>
      <text x="98"  y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">MASTER KEY</text>
      <rect x="126" y="32.25" width="6" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="132,30 132,36 136,33" fill={ac} fillOpacity="0.5"/>
      <rect x="136" y="21" width="56" height="24" rx="2" fill="#6366f111" stroke={ac} strokeWidth="0.75"/>
      <text x="164" y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">CIPHER BLOB</text>
      <text x="164" y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">IV + TAG</text>
      <rect x="192" y="32.25" width="6" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="198,30 198,36 202,33" fill={ac} fillOpacity="0.5"/>
      <rect x="202" y="21" width="54" height="24" rx="2" fill="#6366f111" stroke={ac} strokeWidth="0.75"/>
      <text x="229" y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">POSTGRES</text>
      <text x="229" y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">ENCRYPTED</text>
    </svg>
  );
}

export default function PrivacyFeaturePage() {
  return (
    <FeaturePage
      data={{
        status: "PLANNED",
        statusLabel: "PHASE 6",
        accent: "#6366f1",
        title: "Privacy Infra",
        tagline: "Zero-knowledge transfers for GitHub orgs",
        icon: <Lock size={28} />,
        mascot: <ShadowCat />,
        heroDiagram: <PrivacyDiagram />,
        description:
          "Phase 6 brings zero-knowledge private transfers, GitHub Organization N-of-M multi-sig vaults, payroll streaming with clawback protection, and private bug bounty escrow. Every transfer amount and recipient stays off the public mempool.",
        features: [
          {
            title: "ZK private transfers",
            live: false,
            desc: "Transfer amounts and recipients are hidden on-chain using zero-knowledge proofs. The sender proves they have the funds without revealing the amount or destination.",
          },
          {
            title: "GitHub Org multi-sig",
            live: false,
            desc: "N-of-M GitHub maintainer approval for large transactions. Org admins set quorum (e.g. 3-of-5). Any payment above threshold requires multiple maintainer approvals via GitHub comments.",
          },
          {
            title: "Payroll streaming",
            live: false,
            desc: "Continuous salary stream to a contributor address. Payments release per-second based on a vesting schedule. Clawback-protected, team can recover unearned future tranches.",
          },
          {
            title: "Bug bounty escrow",
            live: false,
            desc: "Private disclosure escrow vault. Researcher proves fix validity with a ZK proof. Payment unlocks automatically on valid proof without revealing the vulnerability publicly.",
          },
          {
            title: "Private project treasury",
            live: false,
            desc: "Organization vault with private balance. Org members can see allocations, outsiders see only that a transaction occurred, not the amount.",
          },
          {
            title: "Threshold signatures",
            live: false,
            desc: "Optional TSS (Threshold Signature Scheme) replaces individual keypairs for org vaults. N-of-M signers required to produce the owner signature.",
          },
        ],
        steps: [
          {
            step: "01",
            title: "Create Org vault",
            desc: "@gitbankbot org-vault create with 3-of-5 quorum for your GitHub Org.",
          },
          {
            step: "02",
            title: "Set quorum",
            desc: "Org admins define which GitHub accounts are signers and the minimum approval threshold.",
          },
          {
            step: "03",
            title: "Private transfer",
            desc: "Any signer initiates. Others approve via GitHub comment. ZK proof hides amounts.",
          },
          {
            step: "04",
            title: "Audit trail",
            desc: "On-chain commitments are visible; amounts and recipients are private. Org can share selective disclosure proofs for accounting.",
          },
        ],
        architecture: [
          {
            layer: "ZK circuit",
            what: "Semaphore-based membership + range proofs",
            why: "The ZK circuit proves: sender is a valid vault member, balance is sufficient, and the transfer is authorized, without revealing any of those values on-chain.",
          },
          {
            layer: "Org GitVault",
            what: "Multi-sig variant with quorum threshold",
            why: "GitVaultFactory deploys an OrgGitVault clone. The quorum is stored on-chain: N-of-M GitHub integer IDs must sign before any operation executes.",
          },
          {
            layer: "Payroll contract",
            what: "Time-locked vesting stream",
            why: "Defines start timestamp, end timestamp, cliffDuration, and totalAmount. Beneficiary can withdraw accrued amount at any time. Clawback returns unvested remainder to sender.",
          },
          {
            layer: "Bug bounty escrow",
            what: "ZK proof-gated vault release",
            why: "Funds are locked in an escrow vault. The researcher submits a ZK proof (commitment to the fix hash). The verifier contract checks the proof and releases funds on success.",
          },
        ],
        faq: [
          {
            q: "When is Phase 6?",
            a: "Phase 6 is planned after the RWA Layer (Phase 4) and AutoGit Builder (Phase 5) ship. Target is Q4 2026. Follow @gitbankbot on the roadmap for updates.",
          },
          {
            q: "Which ZK proof system will be used?",
            a: "We are evaluating Semaphore (Groth16 on-chain verifier) for membership proofs and Plonky2 for range proofs. Final choice depends on on-chain verification gas costs on Base.",
          },
          {
            q: "Will org multi-sig require all members to run nodes?",
            a: "No. Gitbank's relayer orchestrates the multi-sig flow via GitHub comments. Members approve by posting on GitHub, not by running signing infrastructure.",
          },
          {
            q: "Can I use the payroll stream for contractor payments?",
            a: "Yes. The stream can be set up by any vault owner for any recipient address. Contractors do not need a GitHub account to receive funds, just a Base wallet address.",
          },
        ],
      }}
    />
  );
}
