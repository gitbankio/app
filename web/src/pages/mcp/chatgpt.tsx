import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { CodeBlock, Steps, TroubleItem, OtherClients, McpBreadcrumb } from "./_shared";

export default function McpChatGptPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <McpBreadcrumb label="ChatGPT Desktop" />

        <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-4 mb-8 opacity-80 cursor-default">
          <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50">Phase 1</span>
          <p className="text-[13px] text-muted-foreground mt-2">ChatGPT Desktop MCP support is planned. This guide shows the setup once it goes live.</p>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Connect Gitbank to ChatGPT</h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[640px]">
            Support for ChatGPT Desktop (Plus/Pro) is coming. This guide shows how the configuration will work once the integration is live.
          </p>
        </div>

        <div className="border border-border/40 bg-card rounded-xl p-6 mb-10">
          <h2 className="text-lg font-bold text-foreground mb-3">Platform Details</h2>
          <ul className="list-disc pl-5 text-[13px] text-muted-foreground leading-relaxed space-y-2">
            <li><strong>Client:</strong> ChatGPT Desktop (Plus/Pro required)</li>
            <li><strong>Configuration:</strong> One config file (path subject to OpenAI updates)</li>
            <li><strong>Structure:</strong> Will mirror the Claude Desktop JSON structure.</li>
          </ul>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-4">Planned Setup</h2>
        <div className="mb-10">
          <Steps items={[
            {
              n: 1,
              title: "Locate Config File",
              desc: "Open the ChatGPT Desktop configuration file on your system. The exact path is subject to OpenAI updates.",
            },
            {
              n: 2,
              title: "Add Gitbank Server",
              desc: "Append the Gitbank MCP server configuration to the file.",
              code: `{\n  "mcpServers": {\n    "gitbank": {\n      "url": "https://gitbank.io/api/mcp",\n      "transport": "streamable-http"\n    }\n  }\n}`,
              codeTitle: "ChatGPT Config JSON"
            },
            {
              n: 3,
              title: "Restart ChatGPT",
              desc: "Restart the ChatGPT Desktop application to load the new tools.",
            }
          ]} />
        </div>

        <OtherClients current="chatgpt" />
      </motion.div>
    </PageWrapper>
  );
}
