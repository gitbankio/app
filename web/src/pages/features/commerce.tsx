import FeaturePage from "./_template";
import { CreditCard } from "lucide-react";
import { MerchantCat } from "@/components/mascots";

function GitNeoDiagram() {
  const ac = "#10b981";
  return (
    <svg width="260" height="66" viewBox="0 0 260 66" fill="none" aria-hidden style={{imageRendering:"pixelated"}}>
      <rect x="4"   y="21" width="56" height="24" rx="2" fill="#10b98111" stroke={ac} strokeWidth="0.75"/>
      <text x="32"  y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">GITVAULT</text>
      <text x="32"  y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">USDC BALANCE</text>
      <rect x="60"  y="32.25" width="6" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="66,30 66,36 70,33" fill={ac} fillOpacity="0.5"/>
      <rect x="70"  y="21" width="56" height="24" rx="2" fill="#10b98111" stroke={ac} strokeWidth="0.75"/>
      <text x="98"  y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">GITNEO</text>
      <text x="98"  y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">VIRTUAL CARD</text>
      <rect x="126" y="32.25" width="6" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="132,30 132,36 136,33" fill={ac} fillOpacity="0.5"/>
      <rect x="136" y="21" width="56" height="24" rx="2" fill="#10b98111" stroke={ac} strokeWidth="0.75"/>
      <text x="164" y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">MASTERCARD</text>
      <text x="164" y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">NETWORK</text>
      <rect x="192" y="32.25" width="6" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="198,30 198,36 202,33" fill={ac} fillOpacity="0.5"/>
      <rect x="202" y="21" width="54" height="24" rx="2" fill="#10b98111" stroke={ac} strokeWidth="0.75"/>
      <text x="229" y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">ANY</text>
      <text x="229" y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">MERCHANT</text>
    </svg>
  );
}

export default function GitNeoFeaturePage() {
  return (
    <FeaturePage
      data={{
        status: "BUILDING",
        accent: "#10b981",
        title: "gitNeo",
        tagline: "Spend crypto anywhere Mastercard is accepted",
        icon: <CreditCard size={28} />,
        mascot: <MerchantCat />,
        heroDiagram: <GitNeoDiagram />,
        description:
          "gitNeo is Gitbank's neobank layer. Issue a virtual Mastercard loaded directly from your GitVault USDC balance. Pay for Claude credits, AWS, gift cards, Figma, any SaaS subscription, or any service that accepts Mastercard. No bank account required. No KYC friction. Request your card via @gitbankbot in any GitHub Issue.",
        features: [
          {
            title: "Virtual Mastercard from your vault",
            live: false,
            desc: "@gitbankbot issue-card 200 USDC instantly provisions a virtual Mastercard loaded from your GitVault balance. Use it anywhere Mastercard is accepted online.",
          },
          {
            title: "Pay any service with crypto",
            live: false,
            desc: "Top up Claude API credits, buy AWS credits, pay for Figma, purchase gift cards, or pay any subscription. Your USDC converts to fiat at the point of payment, invisible to the merchant.",
          },
          {
            title: "Auto-reload from vault",
            live: false,
            desc: "Set a minimum balance threshold. When your card balance drops below it, gitNeo automatically pulls from your GitVault to reload. No manual top-ups needed.",
          },
          {
            title: "Team cards for contributors",
            live: false,
            desc: "Issue virtual cards to contributors directly from your vault. Set per-card spending limits and expiry. Cards are revocable instantly via @gitbankbot revoke-card.",
          },
          {
            title: "GitHub-native expense tracking",
            live: false,
            desc: "Every transaction posts a receipt comment to the originating GitHub Issue. Full audit trail on-chain and in your GitHub thread.",
          },
          {
            title: "No bank, no KYC",
            live: false,
            desc: "gitNeo is anchored to your GitHub ID and GitVault. No bank account, no SSN, no credit check. Your vault balance is your credit limit.",
          },
        ],
        steps: [
          { step: "01", title: "Request card", desc: "@gitbankbot issue-card 200 USDC in any GitHub Issue" },
          { step: "02", title: "Card provisioned", desc: "Virtual Mastercard details delivered to your GitHub thread" },
          { step: "03", title: "Pay anywhere", desc: "Use the card at Claude, AWS, gift card platforms, any merchant" },
          { step: "04", title: "Receipt posted", desc: "Transaction receipt posted back to GitHub Issue automatically" },
        ],
        commands: [
          {
            cmd: "@gitbankbot issue-card 200 USDC",
            desc: "Provision a virtual Mastercard loaded with 200 USDC from your vault.",
            output: "gitNeo card provisioned. Loaded: 200 USDC. Auto-reload at 20 USDC threshold. Card details sent.",
          },
          {
            cmd: "@gitbankbot issue-card 50 USDC to @contributor",
            desc: "Issue a virtual card to a specific contributor from your vault. Sets 50 USDC limit.",
          },
          {
            cmd: "@gitbankbot reload-card 100 USDC",
            desc: "Manually top up your gitNeo card with 100 USDC from your vault.",
          },
          {
            cmd: "@gitbankbot revoke-card",
            desc: "Instantly deactivate a virtual card. Any unspent balance returns to your vault.",
          },
          {
            cmd: "@gitbankbot card-balance",
            desc: "Check your current gitNeo card balance and recent transactions.",
          },
        ],
        architecture: [
          {
            layer: "Card issuance",
            what: "Virtual Mastercard via card issuing API",
            why: "On issue-card command, gitNeo calls a card-issuing partner (e.g. Lithic, Marqeta) to provision a virtual card. Card number, expiry, and CVV are encrypted and returned to the user via GitHub thread.",
          },
          {
            layer: "Vault funding",
            what: "USDC deducted from GitVault on-chain",
            why: "When a card is issued or reloaded, the relayer builds a gitUnshield meta-tx to move the specified USDC from the vault to the gitNeo funding wallet. All movements are on-chain and auditable.",
          },
          {
            layer: "Auto-reload",
            what: "Threshold watcher triggers vault pull",
            why: "A background job monitors card balances. When the balance drops below the user-set threshold, it automatically fires a reload transaction from the vault. No user action required.",
          },
          {
            layer: "Expense receipts",
            what: "Card transaction webhook posts to GitHub",
            why: "The card issuer webhooks each transaction to the gitNeo service. gitNeo posts a formatted receipt comment to the originating GitHub Issue, creating a native expense trail.",
          },
        ],
        faq: [
          {
            q: "Can I pay for Claude credits with USDC from my vault?",
            a: "Yes. gitNeo provisions a virtual Mastercard loaded from your USDC vault balance. Anthropic, OpenAI, AWS, and any other service that accepts Mastercard will work.",
          },
          {
            q: "Do I need a bank account or KYC?",
            a: "gitNeo is anchored to your GitHub ID and GitVault. For standard card limits there is no bank account or SSN required. Your vault balance is your spending limit.",
          },
          {
            q: "What happens to unspent card balance?",
            a: "Any unspent balance on a revoked card returns to your GitVault on-chain. You never lose USDC.",
          },
          {
            q: "Can I give cards to contributors?",
            a: "Yes. @gitbankbot issue-card 50 USDC to @contributor issues a card funded from your vault with a 50 USDC cap. Useful for tooling stipends or one-time purchases.",
          },
          {
            q: "When will gitNeo be live?",
            a: "gitNeo is in active development. Card issuance and vault funding are the core primitives being built now. Expected in Phase 3.",
          },
        ],
      }}
    />
  );
}
