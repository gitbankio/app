import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { CodeBlock, Steps, TroubleItem, OtherClients, McpBreadcrumb } from "./_shared";

export default function McpKimiPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <McpBreadcrumb label="Kimi.ai" />

        <div className="border border-dashed border-border/60 bg-muted/20 rounded-xl p-4 mb-8 opacity-80 cursor-default">
          <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border/50">Phase 1</span>
          <p className="text-[13px] text-muted-foreground mt-2">Kimi.ai MCP support is planned. This guide shows the setup once it goes live.</p>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Connect Gitbank to Kimi</h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[640px]">
            Support for Kimi.ai is coming. This guide shows how the configuration will work once the integration is published to the Kimi Plugin Store.
          </p>
        </div>

        <div className="border border-border/40 bg-card rounded-xl p-6 mb-10">
          <h2 className="text-lg font-bold text-foreground mb-3">Platform Details</h2>
          <ul className="list-disc pl-5 text-[13px] text-muted-foreground leading-relaxed space-y-2">
            <li><strong>Client:</strong> Kimi.ai</li>
            <li><strong>Configuration:</strong> Via Kimi Plugin Store</li>
          </ul>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-4">Planned Setup</h2>
        <div className="mb-10">
          <Steps items={[
            {
              n: 1,
              title: "Open Kimi Plugin Store",
              desc: "Navigate to the Plugin Store within the Kimi.ai interface.",
            },
            {
              n: 2,
              title: "Search for Gitbank",
              desc: "Search for the Gitbank MCP plugin.",
            },
            {
              n: 3,
              title: "Install and Authorize",
              desc: "Click install to add the Gitbank capabilities to your Kimi agent.",
            }
          ]} />
        </div>

        <OtherClients current="kimi" />
      </motion.div>
    </PageWrapper>
  );
}
