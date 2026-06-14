import FeaturePage from "./_template";
import { Terminal } from "lucide-react";
import { HackerCat } from "@/components/mascots";

function IssueOpsDiagram() {
  const ac = "hsl(228 82% 65%)";
  return (
    <svg width="260" height="66" viewBox="0 0 260 66" fill="none" aria-hidden style={{imageRendering:"pixelated"}}>
      <rect x="4"   y="21" width="44" height="24" rx="2" fill="hsla(228,82%,65%,0.1)" stroke={ac} strokeWidth="0.75"/>
      <text x="26"  y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">GH</text>
      <text x="26"  y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">ISSUE</text>
      <rect x="48"  y="32.25" width="4" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="52,30 52,36 56,33" fill={ac} fillOpacity="0.5"/>
      <rect x="56"  y="21" width="44" height="24" rx="2" fill="hsla(228,82%,65%,0.1)" stroke={ac} strokeWidth="0.75"/>
      <text x="78"  y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">CLAUDE</text>
      <text x="78"  y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">NLP</text>
      <rect x="100" y="32.25" width="4" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="104,30 104,36 108,33" fill={ac} fillOpacity="0.5"/>
      <rect x="108" y="21" width="44" height="24" rx="2" fill="hsla(228,82%,65%,0.1)" stroke={ac} strokeWidth="0.75"/>
      <text x="130" y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">RELAYER</text>
      <text x="130" y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">META-TX</text>
      <rect x="152" y="32.25" width="4" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="156,30 156,36 160,33" fill={ac} fillOpacity="0.5"/>
      <rect x="160" y="21" width="44" height="24" rx="2" fill="hsla(228,82%,65%,0.1)" stroke={ac} strokeWidth="0.75"/>
      <text x="182" y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">BASE</text>
      <text x="182" y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">L2</text>
      <rect x="204" y="32.25" width="4" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="208,30 208,36 212,33" fill={ac} fillOpacity="0.5"/>
      <rect x="212" y="21" width="44" height="24" rx="2" fill="hsla(228,82%,65%,0.1)" stroke={ac} strokeWidth="0.75"/>
      <text x="234" y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">RECEIPT</text>
      <text x="234" y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">BASESCAN</text>
    </svg>
  );
}

export default function IssueOpsPage() {
  return (
    <FeaturePage
      data={{
        status: "LIVE",
        accent: "hsl(228 82% 65%)",
        title: "IssueOps Banking",
        tagline: "GitHub comments that move money",
        icon: <Terminal size={28} />,
        mascot: <HackerCat />,
        heroDiagram: <IssueOpsDiagram />,
        description:
          "Every @gitbankbot command posted in a GitHub Issue or PR triggers a real on-chain operation on Base Mainnet. Claude parses the intent, the relayer builds and signs the meta-transaction, and a receipt comment is posted back to the thread, all within seconds.",
        features: [
          {
            title: "gitShield (Deposit)",
            desc: "Lock USDC or WETH into your soul-bound GitVault. Funds are held in your contract, not a Gitbank wallet.",
          },
          {
            title: "gitUnshield (Withdraw)",
            desc: "Withdraw any amount to any address at any time. You own the keys, you control the vault.",
          },
          {
            title: "gitSend (Transfer)",
            desc: "2-step commit-reveal vault-to-vault transfer. Initiate from your GitHub comment, recipient finalizes, prevents front-running.",
          },
          {
            title: "gitBounty (Assign)",
            desc: "Assign a USDC or WETH bounty to any GitHub issue. Funds are locked in escrow until the PR merges.",
          },
          {
            title: "Auto-payout on PR merge",
            desc: "When the linked PR merges, the GitHub App webhook fires and releases escrow to the contributor automatically.",
          },
          {
            title: "gitReclaim",
            desc: "Reclaim unearned bounties back to your vault if a task is abandoned or the PR is closed without merging.",
          },
        ],
        steps: [
          {
            step: "01",
            title: "Install bot",
            desc: "One-click GitHub App install on any repo. The relayer auto-deploys your GitVault on Base Mainnet.",
          },
          {
            step: "02",
            title: "Fund vault",
            desc: "Send USDC or WETH to your vault address, then lock it with @gitbankbot deposit.",
          },
          {
            step: "03",
            title: "Comment command",
            desc: "Post @gitbankbot assign 100 USDC bounty #42 in any Issue or PR on your repo.",
          },
          {
            step: "04",
            title: "Settlement",
            desc: "PR merges, webhook fires, escrow releases on-chain. Contributor receives funds automatically.",
          },
        ],
        commands: [
          {
            cmd: "@gitbankbot deposit 100 USDC",
            desc: "Lock 100 USDC into your GitVault (gitShield). Vault must already hold the tokens.",
            output: "Deposited 100 USDC. Vault balance: 100.00 USDC. Tx: 0x...",
          },
          {
            cmd: "@gitbankbot withdraw 50 USDC to 0x1234...",
            desc: "Withdraw 50 USDC from your vault to any address (gitUnshield).",
          },
          {
            cmd: "@gitbankbot send 10 USDC to @contributor",
            desc: "Initiate a 2-step vault-to-vault transfer. Recipient must confirm via their own GitHub comment.",
          },
          {
            cmd: "@gitbankbot assign 500 USDC bounty #42",
            desc: "Lock 500 USDC in escrow for issue #42. Auto-releases to the PR author on merge.",
          },
          {
            cmd: "@gitbankbot reclaim bounty #42",
            desc: "Reclaim the bounty for issue #42 back to your vault. Only works if no PR has merged.",
          },
          {
            cmd: "@gitbankbot balance",
            desc: "Check your current vault balances for USDC and WETH.",
            output: "Vault: 0x7Bf... | USDC: 250.00 | WETH: 0.1243",
          },
        ],
        architecture: [
          {
            layer: "GitHub",
            what: "Webhook receives issue_comment events",
            why: "Every comment on an Issue or PR in a repo where the Gitbank App is installed triggers a POST to /api/webhook with the comment text, sender login, and repo context.",
          },
          {
            layer: "NLP",
            what: "Claude parses intent and extracts amounts",
            why: 'The raw comment text is passed to Claude with a structured prompt. It returns JSON: { intent, token, amount, target_user, confidence }. Commands in any language are supported.',
          },
          {
            layer: "Rate limiter",
            what: "10 commands per hour per GitHub ID",
            why: "In-memory counter keyed by GitHub integer ID prevents bot spam and replay attacks without adding database latency to the hot path.",
          },
          {
            layer: "Relayer",
            what: "Builds, signs, and submits meta-transactions to Base",
            why: "The relayer holds the execution keypair (AES-256-GCM encrypted in DB). It builds the calldata, signs with ownerSig + relayerSig, and submits via the deployer wallet. Users never pay gas.",
          },
          {
            layer: "GitVault",
            what: "On-chain contract processes the operation",
            why: "GitVault validates both signatures, checks the nonce, and executes gitShield / gitUnshield / gitTransfer / gitBountyAssign. Nonce increments atomically.",
          },
          {
            layer: "GitHub Bot",
            what: "Posts an English receipt comment",
            why: "After the tx confirms on Base, the bot comments back in the same thread with the operation summary and Basescan link.",
          },
        ],
        faq: [
          {
            q: "Which tokens are supported?",
            a: "USDC and WETH on Base Mainnet. USDC is the Circle-issued stablecoin (0x833589...2913). WETH is the canonical wrapped Ether on Base (0x420000...0006).",
          },
          {
            q: "Do I need ETH for gas?",
            a: "No. The Gitbank relayer pays all gas using the deployer wallet. You only need to have USDC or WETH inside your vault.",
          },
          {
            q: "Is the bot available in any GitHub repo?",
            a: "Yes, install the Gitbank GitHub App on any repo you own. The bot will respond to @gitbankbot commands in all Issues and PRs on that repo.",
          },
          {
            q: "What if I mistype an amount?",
            a: "The command is parsed by Claude which checks for plausible amounts. If the confidence score is below threshold, the bot asks for clarification instead of executing.",
          },
          {
            q: "Can anyone spend my vault funds?",
            a: "No. Every operation requires your execution keypair signature (owner) AND the relayer signature. The relayer only signs after verifying the comment came from your GitHub account.",
          },
        ],
      }}
    />
  );
}
