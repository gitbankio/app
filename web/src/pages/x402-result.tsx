import { useEffect, useState } from "react";
import { useParams } from "wouter";

interface X402Result {
  id: string;
  url: string;
  amountDisplay: string;
  txHash: string;
  payTo: string;
  payer: string;
  senderLogin: string;
  responseStatus: number;
  responseBody: string;
  createdAt: string;
}

// ── Summary renderer ──────────────────────────────────────────────────────────

function findRows(parsed: unknown): Record<string, unknown>[] | null {
  if (!parsed || typeof parsed !== "object") return null;

  const obj = parsed as Record<string, unknown>;

  // Known shapes first
  for (const key of ["results", "data", "items", "tokens", "rows", "records"]) {
    const val = obj[key];
    if (Array.isArray(val) && val.length > 0 && typeof val[0] === "object") {
      return val as Record<string, unknown>[];
    }
  }

  // Generic: first array value found at root
  for (const val of Object.values(obj)) {
    if (Array.isArray(val) && val.length > 0 && typeof val[0] === "object") {
      return val as Record<string, unknown>[];
    }
  }

  return null;
}

function pickColumns(rows: Record<string, unknown>[]): string[] {
  const first = rows[0] ?? {};
  const allKeys = Object.keys(first);

  // Exa: results[] with title + url
  if (allKeys.includes("title") && allKeys.includes("url")) {
    return ["title", "url", "score"].filter((k) => allKeys.includes(k));
  }

  // Nansen netflow: token_symbol + net_flow_* + chain
  if (allKeys.includes("token_symbol") || allKeys.includes("net_flow_24h_usd")) {
    const preferred = [
      "token_symbol", "chain", "net_flow_24h_usd", "net_flow_7d_usd",
      "market_cap_usd", "trader_count",
    ];
    return preferred.filter((k) => allKeys.includes(k));
  }

  // Generic: up to 5 primitive-value columns
  return allKeys
    .filter((k) => {
      const v = first[k];
      return typeof v === "string" || typeof v === "number" || typeof v === "boolean";
    })
    .slice(0, 5);
}

function formatCell(val: unknown): string {
  if (val === null || val === undefined) return "-";
  if (typeof val === "number") {
    if (Math.abs(val) > 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
    if (Math.abs(val) > 1_000) return `$${(val / 1_000).toFixed(2)}K`;
    if (Number.isInteger(val)) return String(val);
    return Number(val).toFixed(4);
  }
  if (typeof val === "string" && val.startsWith("http")) {
    const short = val.replace(/^https?:\/\//, "").slice(0, 40);
    return short + (val.length > 44 ? "..." : "");
  }
  const s = String(val);
  return s.length > 60 ? s.slice(0, 57) + "..." : s;
}

function isUrl(val: unknown): boolean {
  return typeof val === "string" && val.startsWith("http");
}

function ResponseSummary({ parsed }: { parsed: unknown }) {
  const rows = findRows(parsed);
  if (!rows || rows.length === 0) return null;

  const cols = pickColumns(rows);
  if (cols.length === 0) return null;

  const display = rows.slice(0, 20);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden mb-6">
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <span className="text-xs text-zinc-400 font-medium uppercase tracking-wide">
          Response Summary
        </span>
        <span className="text-xs text-zinc-600">{rows.length} rows</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-800">
              {cols.map((col) => (
                <th
                  key={col}
                  className="px-4 py-2 text-left text-zinc-500 font-medium uppercase tracking-wide whitespace-nowrap"
                >
                  {col.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {display.map((row, i) => (
              <tr
                key={i}
                className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 transition-colors"
              >
                {cols.map((col) => {
                  const raw = row[col];
                  const cell = formatCell(raw);
                  return (
                    <td key={col} className="px-4 py-2 text-zinc-300 whitespace-nowrap">
                      {isUrl(raw) ? (
                        <a
                          href={String(raw)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 underline underline-offset-2"
                        >
                          {cell}
                        </a>
                      ) : (
                        cell
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function X402ResultPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<X402Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<unknown>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/x402/result/${id}`, { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error("Result not found");
        return r.json() as Promise<X402Result>;
      })
      .then((data) => {
        setResult(data);
        try {
          setParsed(JSON.parse(data.responseBody));
        } catch {
          setParsed(null);
        }
        setLoading(false);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Failed to load");
        setLoading(false);
      });
  }, [id]);

  const basescanUrl = (hash: string) => `https://basescan.org/tx/${hash}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-zinc-500 text-sm">Loading...</div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-zinc-400 text-sm mb-1">Result not found</div>
          <div className="text-zinc-600 text-xs">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
              x402
            </span>
            <span className="text-xs text-zinc-500">payment receipt</span>
          </div>
          <h1 className="text-xl font-semibold text-white">API Response</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Paid by @{result.senderLogin} via Gitbank Relayer
          </p>
        </div>

        {/* 1 — Receipt */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-zinc-800">
            <span className="text-xs text-zinc-400 font-medium uppercase tracking-wide">Receipt</span>
          </div>
          <div className="px-4 py-4 space-y-2 font-mono text-sm">
            <Row label="URL" value={result.url} link={result.url} />
            <Row label="Amount" value={result.amountDisplay} />
            <Row label="Payer" value={`${result.payer} (Gitbank Relayer)`} />
            <Row label="Recipient" value={result.payTo} />
            <Row label="Network" value="Base Mainnet" />
            <Row
              label="Tx"
              value={result.txHash.slice(0, 20) + "..."}
              link={basescanUrl(result.txHash)}
            />
            <Row
              label="API Status"
              value={result.responseStatus === 200 ? "200 OK (payment accepted)" : String(result.responseStatus)}
              highlight={result.responseStatus === 200 ? "green" : "red"}
            />
            <Row
              label="Paid at"
              value={new Date(result.createdAt).toLocaleString()}
            />
          </div>
        </div>

        {/* 2 — Response Summary (table) */}
        {parsed !== null && <ResponseSummary parsed={parsed} />}

        {/* 3 — Full API Response (raw JSON) */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium uppercase tracking-wide">
              Full API Response ({result.responseStatus})
            </span>
            <span className="text-xs text-zinc-600">{result.responseBody.length.toLocaleString()} chars</span>
          </div>
          {parsed !== null ? (
            <pre className="px-4 py-4 text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap break-words leading-relaxed">
              {JSON.stringify(parsed, null, 2)}
            </pre>
          ) : (
            <pre className="px-4 py-4 text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap break-words leading-relaxed">
              {result.responseBody}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  link,
  highlight,
}: {
  label: string;
  value: string;
  link?: string;
  highlight?: "green" | "red";
}) {
  const valueClass =
    highlight === "green"
      ? "text-emerald-400"
      : highlight === "red"
      ? "text-red-400"
      : "text-zinc-200";

  return (
    <div className="flex gap-3">
      <span className="text-zinc-500 w-24 shrink-0">{label}</span>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className={`${valueClass} underline underline-offset-2 break-all`}>
          {value}
        </a>
      ) : (
        <span className={`${valueClass} break-all`}>{value}</span>
      )}
    </div>
  );
}
