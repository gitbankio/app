import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { CodeBlock, Steps, TroubleItem, OtherClients, McpBreadcrumb } from "./_shared";

export default function McpGeminiPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <McpBreadcrumb label="Gemini CLI" />

        <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-4 mb-8 opacity-80 cursor-default">
          <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50">Phase 1</span>
          <p className="text-[13px] text-muted-foreground mt-2">Gemini CLI MCP support is planned. This guide shows the setup once it goes live.</p>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Connect Gitbank to Gemini</h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[640px]">
            Support for the Gemini CLI is coming. This guide shows how the configuration will work once the integration is live.
          </p>
        </div>

        <div className="border border-border/40 bg-card rounded-xl p-6 mb-10">
          <h2 className="text-lg font-bold text-foreground mb-3">Platform Details</h2>
          <ul className="list-disc pl-5 text-[13px] text-muted-foreground leading-relaxed space-y-2">
            <li><strong>Client:</strong> Gemini CLI (Terminal)</li>
            <li><strong>Configuration:</strong> <code className="font-mono text-[12px] text-primary">~/.gemini/settings.json</code></li>
            <li><strong>Expected Usage:</strong> Add the Gitbank MCP server to the <code className="font-mono text-[12px] text-primary">mcpServers</code> block in your Gemini settings file.</li>
          </ul>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-4">Planned Setup</h2>
        <div className="mb-10">
          <Steps items={[
            {
              n: 1,
              title: "Open Gemini CLI settings",
              desc: "Edit your Gemini CLI configuration file.",
              code: `~/.gemini/settings.json`,
              codeTitle: "Config location"
            },
            {
              n: 2,
              title: "Add Gitbank MCP server",
              desc: "Add the mcpServers block with the Gitbank endpoint.",
              code: `{\n  "mcpServers": {\n    "gitbank": {\n      "url": "https://gitbank.io/api/mcp",\n      "transport": "streamable-http"\n    }\n  }\n}`,
              codeTitle: "~/.gemini/settings.json"
            },
            {
              n: 3,
              title: "Restart Gemini CLI",
              desc: "Relaunch the Gemini CLI session to apply the new configuration.",
            }
          ]} />
        </div>

        <OtherClients current="gemini" />
      </motion.div>
    </PageWrapper>
  );
}
