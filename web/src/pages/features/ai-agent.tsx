import FeaturePage from "./_template";
import { Cpu } from "lucide-react";
import { RobotCat } from "@/components/mascots";

function AiAgentDiagram() {
  const ac = "#8b5cf6";
  return (
    <svg width="260" height="66" viewBox="0 0 260 66" fill="none" aria-hidden style={{imageRendering:"pixelated"}}>
      <rect x="4"   y="21" width="56" height="24" rx="2" fill="#8b5cf611" stroke={ac} strokeWidth="0.75"/>
      <text x="32"  y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">AI CLIENT</text>
      <text x="32"  y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">CLAUDE/GPT</text>
      <rect x="60"  y="32.25" width="6" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="66,30 66,36 70,33" fill={ac} fillOpacity="0.5"/>
      <rect x="70"  y="21" width="56" height="24" rx="2" fill="#8b5cf611" stroke={ac} strokeWidth="0.75"/>
      <text x="98"  y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">MCP SERVER</text>
      <text x="98"  y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">/api/mcp</text>
      <rect x="126" y="32.25" width="6" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="132,30 132,36 136,33" fill={ac} fillOpacity="0.5"/>
      <rect x="136" y="21" width="56" height="24" rx="2" fill="#8b5cf611" stroke={ac} strokeWidth="0.75"/>
      <text x="164" y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">CONFIRM</text>
      <text x="164" y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">PENDING CODE</text>
      <rect x="192" y="32.25" width="6" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="198,30 198,36 202,33" fill={ac} fillOpacity="0.5"/>
      <rect x="202" y="21" width="54" height="24" rx="2" fill="#8b5cf611" stroke={ac} strokeWidth="0.75"/>
      <text x="229" y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">VAULT TX</text>
      <text x="229" y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">BASE L2</text>
    </svg>
  );
}

export default function AiAgentPage() {
  return (
    <FeaturePage
      data={{
        status: "LIVE",
        accent: "#8b5cf6",
        title: "AI Agent Economy",
        tagline: "Any GitHub ID is a bank account",
        icon: <Cpu size={28} />,
        mascot: <RobotCat />,
        heroDiagram: <AiAgentDiagram />,
        description:
          "Gitbank's MCP server gives Claude Desktop, Cursor, Grok, and any MCP-compatible AI client a set of financial tools. Agents can query balances, request transactions, and pay for services via the x402 HTTP payment protocol, all anchored to GitHub identity.",
        features: [
          {
            title: "MCP server",
            desc: "StreamableHTTP endpoint at /api/mcp. Add one URL to Claude Desktop, Cursor, or Grok settings and instantly get 10 Gitbank tools. No API key required.",
          },
          {
            title: "Read-only tools",
            desc: "get_vault_balance, get_transactions, get_project_status, list_repos, list_stocks, get_stock_price, get_rwa_portfolio, all return live on-chain data.",
          },
          {
            title: "Write tools with confirm-code",
            desc: "request_deposit, request_withdraw, request_swap, request_transfer, request_buy_stock, request_sell_stock, all return a confirm_code the user must post on GitHub to authorize.",
          },
          {
            title: "GitHub identity bridge",
            desc: "Write tools are authorized only after a valid GitHub comment with the confirm_code from the user's own account. AI cannot bypass this step.",
          },
          {
            title: "x402 HTTP payment protocol",
            desc: "Agents can pay for API access via HTTP 402 responses. L402-compatible: the agent receives a payment invoice, signs a vault transaction, and retries the request.",
          },
          {
            title: "Human + bot + agent: same vault",
            desc: "GitHub issues/PRs, MCP tool calls, and x402 API requests all flow through the same GitVault. One account works across every interface.",
          },
        ],
        steps: [
          {
            step: "01",
            title: "Add MCP URL",
            desc: "Add https://gitbank.io/api/mcp to Claude Desktop, Cursor, or Grok MCP settings. No key needed.",
          },
          {
            step: "02",
            title: "Query vault",
            desc: "Ask your AI: 'Check my Gitbank balance for @yourhandle'. It calls get_vault_balance and returns live data.",
          },
          {
            step: "03",
            title: "Request transaction",
            desc: "Ask your AI: 'Swap 50 USDC to WETH in my Gitbank vault'. It returns a confirm_code.",
          },
          {
            step: "04",
            title: "Confirm on GitHub",
            desc: "Post @gitbankbot confirm <code> in any GitHub Issue or PR on your installed repo. The swap executes.",
          },
        ],
        commands: [
          {
            cmd: "get_vault_balance({ github_username: 'yourhandle' })",
            desc: "Returns USDC and WETH locked balance plus vault address on Base Mainnet.",
            output: '{ vault: "0x7Bf...", balances: { USDC: "250.00", WETH: "0.1243" } }',
          },
          {
            cmd: "get_transactions({ github_username: 'yourhandle', limit: 10 })",
            desc: "Returns last N on-chain transactions: deposits, withdrawals, swaps, bounty payouts.",
          },
          {
            cmd: "request_deposit({ github_username, amount: 100, token: 'USDC' })",
            desc: "Queues a deposit intent. Returns confirm_code. User must post it on GitHub to execute.",
            output: '{ confirm_code: "mcp4a2f1b3c", expires_in: "10 minutes" }',
          },
          {
            cmd: "request_swap({ github_username, amount: 50, from_token: 'USDC', to_token: 'WETH' })",
            desc: "Queues a swap intent. Returns confirm_code.",
          },
          {
            cmd: "list_stocks()",
            desc: "Lists all available gitStock tickers with their contract addresses and availability.",
          },
          {
            cmd: "get_stock_price({ ticker: 'NVDA' })",
            desc: "Returns live USD price for a ticker from the Pyth oracle on Base.",
            output: '{ ticker: "NVDA", priceUsd: 274.25, priceDisplay: "$274.25 USD" }',
          },
        ],
        architecture: [
          {
            layer: "MCP StreamableHTTP transport",
            what: "/api/mcp, accepts tool calls from any MCP client",
            why: "The server implements ModelContextProtocol SDK v1.x with StreamableHTTP transport. Clients POST JSON tool call requests; the server streams or returns results.",
          },
          {
            layer: "Read-only tools",
            what: "Direct DB + on-chain queries, no auth required",
            why: "Balance, transaction, and project data are public on-chain. Read tools query the DB and viem calls to Base without requiring any authentication.",
          },
          {
            layer: "Write tool + confirm-code",
            what: "Queued intent stored in mcp_pending table",
            why: "When a write tool is called, a pending row is inserted with a random 10-char code and 10-minute expiry. The code is returned to the AI client.",
          },
          {
            layer: "GitHub confirmation",
            what: "@gitbankbot confirm <code> in any issue/PR",
            why: "The bot verifies the comment came from the correct GitHub account. If it matches the pending row, the operation executes. This means GitHub account security (YubiKey, passkey) protects all writes.",
          },
          {
            layer: "x402 HTTP payment",
            what: "HTTP 402 response with Lightning/USDC invoice",
            why: "Agent-to-agent payment flow. The server returns a 402 with a WWW-Authenticate header containing payment details. The agent calls request_swap or pays directly from its vault.",
          },
        ],
        faq: [
          {
            q: "Can an AI drain my vault without me knowing?",
            a: "No. All write tools return a confirm_code that must be posted from your GitHub account in a GitHub Issue or PR. The AI cannot confirm on your behalf, it does not have access to your GitHub account.",
          },
          {
            q: "How do I add Gitbank to Claude Desktop?",
            a: 'Add this to your claude_desktop_config.json: { "mcpServers": { "gitbank": { "url": "https://gitbank.io/api/mcp" } } }. Restart Claude and the tools appear automatically.',
          },
          {
            q: "Does it work with Cursor?",
            a: "Yes. Add the MCP server URL in Cursor Settings > Features > MCP Servers. All 10 Gitbank tools become available in Cursor Composer.",
          },
          {
            q: "What is x402?",
            a: "x402 is an HTTP micropayment protocol. When an agent requests a resource that requires payment, the server returns HTTP 402 with payment instructions. The agent constructs a vault payment and retries. No API keys, just cryptographic vault signatures.",
          },
          {
            q: "Is there a rate limit on MCP calls?",
            a: "Read-only tools have generous rate limits (100 req/min). Write tools create pending records which expire in 10 minutes. Execution is rate-limited at 10 per hour per GitHub ID (shared with the bot).",
          },
        ],
      }}
    />
  );
}
