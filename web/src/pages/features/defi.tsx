import FeaturePage from "./_template";
import { Coins } from "lucide-react";
import { BankerCat } from "@/components/mascots";

function DefiDiagram() {
  const ac = "#3b82f6";
  return (
    <svg width="260" height="66" viewBox="0 0 260 66" fill="none" aria-hidden style={{imageRendering:"pixelated"}}>
      <rect x="4"   y="21" width="56" height="24" rx="2" fill="#3b82f611" stroke={ac} strokeWidth="0.75"/>
      <text x="32"  y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">FUND</text>
      <text x="32"  y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">VAULT</text>
      <rect x="60"  y="32.25" width="6" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="66,30 66,36 70,33" fill={ac} fillOpacity="0.5"/>
      <rect x="70"  y="21" width="56" height="24" rx="2" fill="#3b82f611" stroke={ac} strokeWidth="0.75"/>
      <text x="98"  y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">GITVAULT</text>
      <text x="98"  y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">ON-CHAIN</text>
      <rect x="126" y="32.25" width="6" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="132,30 132,36 136,33" fill={ac} fillOpacity="0.5"/>
      <rect x="136" y="21" width="56" height="24" rx="2" fill="#3b82f611" stroke={ac} strokeWidth="0.75"/>
      <text x="164" y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">OPERATE</text>
      <text x="164" y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">SWAP/SEND</text>
      <rect x="192" y="32.25" width="6" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="198,30 198,36 202,33" fill={ac} fillOpacity="0.5"/>
      <rect x="202" y="21" width="54" height="24" rx="2" fill="#3b82f611" stroke={ac} strokeWidth="0.75"/>
      <text x="229" y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">SETTLE</text>
      <text x="229" y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">NONCE++</text>
    </svg>
  );
}

export default function DefiPage() {
  return (
    <FeaturePage
      data={{
        status: "LIVE",
        accent: "#3b82f6",
        title: "DeFi Infrastructure",
        tagline: "Vault, swap, yield, all gasless",
        icon: <Coins size={28} />,
        mascot: <BankerCat />,
        heroDiagram: <DefiDiagram />,
        description:
          "GitVault is a soul-bound ERC-20 vault on Base Mainnet. One vault per GitHub user, deployed as a cheap EIP-1167 minimal proxy clone. Dual-sig meta-transactions mean the deployer pays all gas, you just sign intent and post on GitHub.",
        features: [
          {
            title: "GitVault",
            desc: "Soul-bound ERC-20 vault contract on Base L2, anchored to your permanent GitHub integer ID. One vault per user, non-custodial.",
          },
          {
            title: "gitShield (Deposit)",
            desc: "Lock USDC or WETH into your vault. The vault detects available balance (actual balance minus locked amount) and records the locked position.",
          },
          {
            title: "gitUnshield (Withdraw)",
            desc: "Withdraw any locked amount to any address. Only requires your owner keypair signature + relayer authorization.",
          },
          {
            title: "gitSwap",
            desc: "Swap USDC to WETH or WETH to USDC inside your vault via Uniswap v3 SwapRouter02 on Base. 0.05% fee pool (500 bps tier).",
          },
          {
            title: "gitSend (Vault transfer)",
            desc: "2-step commit-reveal transfer between two GitVaults. Prevents MEV front-running by committing a hash before revealing the recipient.",
          },
          {
            title: "Gasless relayer",
            desc: "The deployer EOA pays all gas on every meta-transaction. Users never need ETH. The relayer submits txs via viem on behalf of the vault owner.",
          },
        ],
        steps: [
          {
            step: "01",
            title: "Deploy vault",
            desc: "Install the Gitbank GitHub App. The relayer auto-deploys your GitVault as an EIP-1167 clone from the factory.",
          },
          {
            step: "02",
            title: "Deposit",
            desc: "Send USDC/WETH to your vault address, then post @gitbankbot deposit 100 USDC to lock it.",
          },
          {
            step: "03",
            title: "Swap",
            desc: "@gitbankbot swap 50 USDC to WETH executes a Uniswap v3 swap inside your vault. No approval needed.",
          },
          {
            step: "04",
            title: "Withdraw",
            desc: "@gitbankbot withdraw 0.01 WETH to 0x... sends tokens from your vault to any address.",
          },
        ],
        commands: [
          {
            cmd: "@gitbankbot deposit 100 USDC",
            desc: "Lock 100 USDC into your vault (gitShield). The vault must hold the tokens before locking.",
            output: "Deposited 100.00 USDC. Vault: 0x7Bf... Tx: 0x...",
          },
          {
            cmd: "@gitbankbot swap 50 USDC to WETH",
            desc: "Swap 50 USDC to WETH inside your vault via Uniswap v3. Net amount after 0.3% protocol fee is sent to the router.",
            output: "Swapped 50 USDC → 0.02241 WETH (Uniswap v3, 0.05% pool). Tx: 0x...",
          },
          {
            cmd: "@gitbankbot swap 0.01 WETH to USDC",
            desc: "Swap WETH back to USDC. Same Uniswap v3 route, reversed.",
          },
          {
            cmd: "@gitbankbot withdraw 0.01 WETH to 0xYourAddress",
            desc: "Withdraw WETH from your vault to any external address (gitUnshield).",
          },
          {
            cmd: "@gitbankbot send 10 USDC to @colleague",
            desc: "Initiate a vault-to-vault transfer. 2-step: commit now, @colleague confirms to finalize.",
          },
          {
            cmd: "@gitbankbot balance",
            desc: "View your current USDC and WETH locked balance plus vault address.",
          },
        ],
        architecture: [
          {
            layer: "GitVaultFactory",
            what: "EIP-1167 minimal proxy factory",
            why: "Each user vault is deployed as a cheap clone pointing to the implementation contract. Factory tracks GitHub ID → vault address mapping.",
          },
          {
            layer: "GitVault",
            what: "Meta-transaction vault with dual-sig security",
            why: "Every state-changing function requires ownerSig (execution keypair) + relayerSig (short-lived Gitbank authorization). Neither key alone can move funds. Nonce increments monotonically.",
          },
          {
            layer: "Execution keypair",
            what: "Per-user keypair generated server-side",
            why: "The relayer generates an EOA keypair for each user, encrypts it with AES-256-GCM (ENCRYPTION_MASTER_KEY), and stores the ciphertext in the DB. The keypair signs meta-tx intents.",
          },
          {
            layer: "Uniswap v3 SwapRouter02",
            what: "DEX swap execution inside vault",
            why: "gitSwap calls SwapRouter02.exactInputSingle with the net swap amount (after Gitbank protocol fee). The vault approves the router for the exact net amount only, no standing approvals.",
          },
          {
            layer: "Relayer EOA",
            what: "Deployer wallet pays all gas",
            why: "The relayer signs both the owner meta-tx (as proxy for the user) and the relayerSig. It submits via viem to Base Mainnet RPC. The deployer EOA holds the gas budget.",
          },
          {
            layer: "Base L2",
            what: "Ethereum L2 for low-cost settlement",
            why: "Base provides Ethereum-level security with sub-cent gas fees, USDC/WETH native support, and 2-second block times. All GitVault operations settle on Base.",
          },
        ],
        faq: [
          {
            q: "Who owns my vault?",
            a: "You do. The vault is anchored to your GitHub permanent integer ID. The execution keypair is generated on your behalf and encrypted in our DB, Gitbank cannot move funds without your GitHub comment authorization.",
          },
          {
            q: "Can my tokens be stolen?",
            a: "Soul-bound tokens cannot be transferred or approved by anyone. Dual-sig means the relayer can only sign after a valid GitHub comment from your account. Combining both protections means there is no single point of compromise.",
          },
          {
            q: "What is the swap fee?",
            a: "Gitbank charges 30 basis points (0.3%) on swaps. Uniswap charges 5 basis points on the USDC/WETH 0.05% pool. Total cost: ~0.35% of the swap amount.",
          },
          {
            q: "What is the withdrawal fee?",
            a: "Gitbank charges no fee on withdrawals. Only the gas cost is incurred (paid by the relayer on your behalf).",
          },
          {
            q: "What happens if I lose access to my GitHub account?",
            a: "Vault access is tied to your GitHub integer ID. If your account is compromised, contact Gitbank support immediately. Key rotation is on the roadmap.",
          },
        ],
      }}
    />
  );
}
