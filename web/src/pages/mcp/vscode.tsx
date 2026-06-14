import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { CodeBlock, Steps, TroubleItem, OtherClients, McpBreadcrumb } from "./_shared";

export default function McpVsCodePage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <McpBreadcrumb label="VS Code Copilot" />

        <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-4 mb-8 opacity-80 cursor-default">
          <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50">Phase 1</span>
          <p className="text-[13px] text-muted-foreground mt-2">VS Code Copilot MCP support is planned. This guide shows the setup once it goes live.</p>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Connect Gitbank to VS Code</h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[640px]">
            Support for VS Code via the GitHub Copilot extension is coming. This guide shows how the configuration will work once the integration is live.
          </p>
        </div>

        <div className="border border-border/40 bg-card rounded-xl p-6 mb-10">
          <h2 className="text-lg font-bold text-foreground mb-3">Platform Details</h2>
          <ul className="list-disc pl-5 text-[13px] text-muted-foreground leading-relaxed space-y-2">
            <li><strong>Client:</strong> VS Code + GitHub Copilot extension</li>
            <li><strong>Configuration:</strong> Repo-level <code className="text-primary font-mono text-[11px]">.vscode/mcp.json</code> config</li>
            <li><strong>Structure:</strong> Will use the same JSON structure as Cursor.</li>
          </ul>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-4">Planned Setup</h2>
        <div className="mb-10">
          <Steps items={[
            {
              n: 1,
              title: "Create Config File",
              desc: "In your project root, create a file at .vscode/mcp.json.",
            },
            {
              n: 2,
              title: "Add Server Details",
              desc: "Define the Gitbank server in the JSON file.",
              code: `{
  "mcpServers": {
    "gitbank": {
      "url": "https://gitbank.io/api/mcp"
    }
  }
}`,
              codeTitle: ".vscode/mcp.json"
            },
            {
              n: 3,
              title: "Reload Window",
              desc: "Reload your VS Code window to apply the new MCP configuration.",
            }
          ]} />
        </div>

        <OtherClients current="vscode" />
      </motion.div>
    </PageWrapper>
  );
}
