import FeaturePage from "./_template";
import { Layers } from "lucide-react";
import { StockCat } from "@/components/mascots";

function RwaDiagram() {
  const ac = "#f59e0b";
  return (
    <svg width="260" height="66" viewBox="0 0 260 66" fill="none" aria-hidden style={{imageRendering:"pixelated"}}>
      <rect x="4"   y="21" width="44" height="24" rx="2" fill="#f59e0b11" stroke={ac} strokeWidth="0.75"/>
      <text x="26"  y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">USDC</text>
      <text x="26"  y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">BASE</text>
      <rect x="48"  y="32.25" width="4" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="52,30 52,36 56,33" fill={ac} fillOpacity="0.5"/>
      <rect x="56"  y="21" width="44" height="24" rx="2" fill="#f59e0b11" stroke={ac} strokeWidth="0.75"/>
      <text x="78"  y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">CCTP</text>
      <text x="78"  y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">BRIDGE</text>
      <rect x="100" y="32.25" width="4" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="104,30 104,36 108,33" fill={ac} fillOpacity="0.5"/>
      <rect x="108" y="21" width="44" height="24" rx="2" fill="#f59e0b11" stroke={ac} strokeWidth="0.75"/>
      <text x="130" y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">SOLANA</text>
      <text x="130" y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">JUPITER</text>
      <rect x="152" y="32.25" width="4" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="156,30 156,36 160,33" fill={ac} fillOpacity="0.5"/>
      <rect x="160" y="21" width="44" height="24" rx="2" fill="#f59e0b11" stroke={ac} strokeWidth="0.75"/>
      <text x="182" y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">ONDO</text>
      <text x="182" y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">STOCK</text>
      <rect x="204" y="32.25" width="4" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="208,30 208,36 212,33" fill={ac} fillOpacity="0.5"/>
      <rect x="212" y="21" width="44" height="24" rx="2" fill="#f59e0b11" stroke={ac} strokeWidth="0.75"/>
      <text x="234" y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">gitSTOCK</text>
      <text x="234" y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">SOUL-BOUND</text>
    </svg>
  );
}

export default function RwaPage() {
  return (
    <FeaturePage
      data={{
        status: "BUILDING",
        accent: "#f59e0b",
        title: "RWA Layer",
        tagline: "Tokenized real-world assets on Base",
        icon: <Layers size={28} />,
        mascot: <StockCat />,
        heroDiagram: <RwaDiagram />,
        description:
          "gitStock lets you buy and hold tokenized equity positions via GitHub comments. USDC leaves your GitVault on Base, crosses to Solana via CCTP, buys Ondo Finance SPL tokens via Jupiter DEX, and a soul-bound GitStockToken is minted to your Base address as a proof-of-custody receipt.",
        features: [
          {
            title: "GitStockToken",
            live: true,
            desc: "Soul-bound ERC-20 receipt token on Base. One contract per ticker (gitNVDA, gitAAPL...) shared across all users. Non-transferable, non-approvable, a position receipt, not a traded asset.",
          },
          {
            title: "GitStockFactory",
            live: true,
            desc: "Factory contract on Base Mainnet. Deploys one GitStockToken per ticker. Only the Gitbank deployer can register new stocks. Minting rights belong to the relayer.",
          },
          {
            title: "CCTP Cross-chain Bridge",
            live: false,
            desc: "Circle's Cross-Chain Transfer Protocol bridges USDC from Base to Solana. Native USDC on both chains, no wrapped tokens, no slippage risk on bridging.",
          },
          {
            title: "Jupiter DEX on Solana",
            live: false,
            desc: "Jupiter aggregator swaps USDC to the target Ondo SPL token on Solana. Best available route across all Solana liquidity pools.",
          },
          {
            title: "Ondo Finance integration",
            live: false,
            desc: "Ondo Finance tokenizes real-world equities on Solana (OUSG, ONYX, and specific tickers). The relayer custodies Ondo tokens in a per-user Solana wallet.",
          },
          {
            title: "gitStock portfolio view",
            live: false,
            desc: "Query all your gitStock holdings, current prices from Pyth oracle, P&L, and cost basis. Available via @gitbankbot rwa portfolio and the MCP get_rwa_portfolio tool.",
          },
        ],
        steps: [
          {
            step: "01",
            title: "Browse stocks",
            desc: "@gitbankbot list stocks returns all available tickers with names and contract addresses.",
          },
          {
            step: "02",
            title: "Buy shares",
            desc: "@gitbankbot buy 100 USDC of NVDA. USDC bridges to Solana via CCTP and buys Ondo NVDA tokens via Jupiter.",
          },
          {
            step: "03",
            title: "Hold position",
            desc: "A GitStockToken (gitNVDA) is minted to your GitVault on Base as a soul-bound receipt of your Ondo position.",
          },
          {
            step: "04",
            title: "Sell",
            desc: "@gitbankbot sell 1 NVDA burns your gitNVDA receipt, Ondo tokens sell on Jupiter, USDC bridges back to Base.",
          },
        ],
        commands: [
          {
            cmd: "@gitbankbot list stocks",
            desc: "List all available tokenized equities with their gitStock symbol and deployment status.",
            output: "Available: NVDA (gitNVDA), AAPL (gitAAPL), TSLA (gitTSLA), MSFT (gitMSFT)...",
          },
          {
            cmd: "@gitbankbot price NVDA",
            desc: "Get the current USD price for NVDA from the Pyth oracle.",
            output: "NVDA: $274.25 USD (Pyth oracle, Base Mainnet)",
          },
          {
            cmd: "@gitbankbot buy 100 USDC of NVDA",
            desc: "Buy NVDA with 100 USDC from your vault. Bridges via CCTP and swaps via Jupiter.",
          },
          {
            cmd: "@gitbankbot sell 1 NVDA",
            desc: "Sell 1 NVDA position back to USDC. Burns gitNVDA receipt and bridges USDC back to Base.",
          },
          {
            cmd: "@gitbankbot rwa portfolio",
            desc: "View all your gitStock holdings, current prices, P&L, and cost basis.",
          },
        ],
        architecture: [
          {
            layer: "GitStockFactory (Base Mainnet)",
            what: "Deployed at 0xAA0a..., tracks ticker → contract address",
            why: "The factory is already deployed on Base Mainnet. Each new stock ticker deploys a GitStockToken clone. Only the Gitbank deployer EOA can register new tickers.",
          },
          {
            layer: "GitStockToken (Base Mainnet)",
            what: "Soul-bound ERC-20 receipt, 6 decimals, per-ticker",
            why: "Minted by the relayer after confirming the Ondo position on Solana. Burns on sell. Non-transferable, non-approvable, same security model as GitToken.",
          },
          {
            layer: "CCTP (Circle Bridge)",
            what: "Native USDC bridging from Base to Solana",
            why: "Circle's Cross-Chain Transfer Protocol burns USDC on Base and mints native USDC on Solana atomically. No wrapped tokens. Settlement time: ~15 seconds.",
          },
          {
            layer: "Jupiter DEX (Solana)",
            what: "Best-route USDC → Ondo SPL token swap",
            why: "Jupiter aggregates all Solana DEX liquidity to find the best route. The relayer submits a VersionedTransaction to Solana mainnet-beta RPC.",
          },
          {
            layer: "Ondo Finance (Solana)",
            what: "Tokenized real-world equity SPL tokens",
            why: "Ondo Finance provides regulated tokenized equity products on Solana. The relayer custodies these tokens in a per-user Solana wallet generated and encrypted in the DB.",
          },
          {
            layer: "Pyth Oracle (Base)",
            what: "Live USD price feeds for all tickers",
            why: "Pyth provides low-latency price feeds on Base for all supported tickers. Used for P&L calculations, portfolio valuation, and price display.",
          },
        ],
        faq: [
          {
            q: "When will RWA be live?",
            a: "The smart contracts (GitStockToken, GitStockFactory) are already deployed on Base Mainnet. The CCTP bridge and Jupiter swap integration are in active development.",
          },
          {
            q: "How many tickers will be supported at launch?",
            a: "Launch targets the top 10 US equities by developer interest: NVDA, AAPL, TSLA, MSFT, GOOGL, AMZN, META, NFLX, AMD, COIN.",
          },
          {
            q: "Is there a minimum purchase?",
            a: "Minimum is determined by Ondo token decimals (6) and the Uniswap route. Practical minimum is around $5 USDC to cover swap and bridge fees.",
          },
          {
            q: "Who custodies the Ondo tokens?",
            a: "The Gitbank relayer custodies Ondo SPL tokens in a per-user Solana wallet. The keypair is generated and AES-256-GCM encrypted in the DB, same model as GitVault execution keypairs.",
          },
        ],
      }}
    />
  );
}
