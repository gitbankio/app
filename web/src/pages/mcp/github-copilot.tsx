import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { CodeBlock, Steps, TroubleItem, OtherClients, McpBreadcrumb } from "./_shared";

export default function McpGithubCopilotPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <McpBreadcrumb label="GitHub Copilot" />

        <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-4 mb-8 opacity-80 cursor-default">
          <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50">Phase 1</span>
          <p className="text-[13px] text-muted-foreground mt-2">GitHub Copilot MCP support is planned. This guide shows the setup once it goes live.</p>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Connect Gitbank to GitHub Copilot</h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[640px]">
            Support for GitHub Copilot directly on github.com is coming. This guide shows how the configuration will work once the integration is live.
          </p>
        </div>

        <div className="border border-border/40 bg-card rounded-xl p-6 mb-10">
          <h2 className="text-lg font-bold text-foreground mb-3">Platform Details</h2>
          <ul className="list-disc pl-5 text-[13px] text-muted-foreground leading-relaxed space-y-2">
            <li><strong>Client:</strong> GitHub Copilot (github.com Repo Settings)</li>
            <li><strong>Configuration:</strong> GUI setup via Repository Settings</li>
          </ul>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-4">Planned Setup</h2>
        <div className="mb-10">
          <Steps items={[
            {
              n: 1,
              title: "Navigate to Repository Settings",
              desc: "Go to your repository on github.com and click the Settings tab.",
            },
            {
              n: 2,
              title: "Access Copilot Settings",
              desc: "In the sidebar, locate the Copilot section and select MCP Servers.",
            },
            {
              n: 3,
              title: "Add Gitbank Server",
              desc: "Add a new MCP server and provide the Gitbank endpoint: https://gitbank.io/api/mcp",
            }
          ]} />
        </div>

        <OtherClients current="github-copilot" />
      </motion.div>
    </PageWrapper>
  );
}
