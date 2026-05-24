import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";

export default function CommunityPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Community</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Follow, contribute, and build with Gitbank</h1>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-10 max-w-[640px]">
          Gitbank is an open-source project. The contracts, bot, and DApp are all publicly available. Contributions of any kind are welcome: code, documentation, security research, and translation.
        </p>

        <h2 className="text-xl font-bold text-foreground mb-5">Official channels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {[
            {
              name: "GitHub",
              handle: "github.com/gitbankio",
              href: "https://github.com/gitbankio",
              desc: "Source code for contracts, backend, bot, and DApp. Issues, pull requests, and discussions all live here.",
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.491.5.09.682-.218.682-.484 0-.236-.009-.866-.013-1.699-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.607.069-.607 1.003.071 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.091-.645.35-1.087.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.376.202 2.394.1 2.646.64.698 1.026 1.591 1.026 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .268.18.579.688.481C19.138 20.165 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              ),
            },
            {
              name: "Twitter / X",
              handle: "x.com/gitbank_io",
              href: "https://x.com/gitbank_io",
              desc: "Protocol updates, sprint progress, team announcements, and ecosystem news. Best place for real-time updates.",
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              ),
            },
          ].map((channel) => (
            <a
              key={channel.name}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-colors cursor-pointer block"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-primary">{channel.icon}</div>
                <div>
                  <p className="text-[14px] font-semibold text-foreground">{channel.name}</p>
                  <p className="text-[12px] font-mono text-primary">{channel.handle}</p>
                </div>
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{channel.desc}</p>
            </a>
          ))}
        </div>

        <h2 className="text-xl font-bold text-foreground mb-5">Ways to contribute</h2>
        <div className="flex flex-col gap-3 mb-12">
          {[
            { title: "Smart contract development", desc: "Solidity engineering, test coverage improvement, gas optimization, and new vault features. See open issues tagged `contracts` on GitHub." },
            { title: "Backend service", desc: "Node.js / TypeScript. Bot intent improvements, DEX routing optimizations, and webhook processing reliability." },
            { title: "DApp frontend", desc: "React / TypeScript. New views, accessibility improvements, mobile responsiveness, and onboarding flow polish." },
            { title: "Security research", desc: "Threat modeling, static analysis, and responsible disclosure of vulnerabilities. Bug bounty program launches with Sprint 6." },
            { title: "Documentation and translation", desc: "Improve existing docs, write guides for new users, or translate the docs site into another language. Open a pull request directly on the docs repo." },
            { title: "Community support", desc: "Triage GitHub issues, write tutorials, or produce content about Gitbank for your audience." },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 rounded-lg border border-border bg-card px-5 py-4">
              <div className="mt-1.5 flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M2 7L5 4v2h4V4l3 3-3 3v-2H5v2L2 7z" />
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-foreground mb-0.5">{item.title}</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-foreground mb-5">Bug bounty program</h2>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
            The Gitbank bug bounty program launches at the start of Sprint 6, concurrent with the external smart contract audit. Responsible disclosure of valid vulnerabilities will be rewarded based on severity.
          </p>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-5 py-3 font-semibold text-foreground">Severity</th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground">Reward range</th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground">Examples</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Critical", "$5,000 - $20,000", "Direct fund theft, unauthorized vault access, bypass of soul-bound restrictions"],
                  ["High", "$1,000 - $5,000", "Webhook spoofing, nonce bypass, manager role escalation"],
                  ["Medium", "$200 - $1,000", "Fee calculation error, event manipulation, front-running vulnerability"],
                  ["Low", "$50 - $200", "Informational disclosures, minor logic issues, gas inefficiencies"],
                ].map(([sev, reward, ex], i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="px-5 py-3.5 font-semibold text-foreground align-top">{sev}</td>
                    <td className="px-5 py-3.5 text-primary font-medium align-top whitespace-nowrap">{reward}</td>
                    <td className="px-5 py-3.5 text-muted-foreground align-top">{ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[12px] text-muted-foreground mt-4">
            Disclose privately to{" "}
            <a href="mailto:security@gitbank.io" className="text-primary hover:underline">security@gitbank.io</a>
            {" "}before filing any public report. Do not test against production contracts or mainnet user funds.
          </p>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
