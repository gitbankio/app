import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";

export default function PrivacyPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-[760px]">
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Legal</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Privacy Policy</h1>
        <p className="text-[13px] text-muted-foreground mb-10">Effective date: May 2026. Last updated: May 2026.</p>

        <div className="flex flex-col gap-10">

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">1. Who we are</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed">Gitbank is a non-custodial crypto vault protocol deployed on Base L2. When we refer to "Gitbank", "we", "us", or "our" in this policy, we mean the Gitbank protocol team operating the bot service and associated infrastructure. The smart contracts themselves are deployed on a public blockchain and are not operated by any party.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">2. What data we collect</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">We collect only the minimum data necessary to operate the Gitbank service.</p>
            <div className="flex flex-col gap-3">
              {[
                { label: "GitHub Permanent User ID", desc: "An immutable integer provided by GitHub in every webhook event. This is our primary identifier for your vault. We do not collect your email address, full name, or any other GitHub profile information." },
                { label: "GitHub username", desc: "Collected from webhook payloads for display purposes in receipts and logs. Not used as an authentication identifier. We are aware that usernames can change." },
                { label: "Vault address", desc: "The on-chain address of your GitVault contract. This is public information on Base L2 and is also stored in our database for operational purposes." },
                { label: "Transaction history", desc: "Records of operations you perform through the bot: deposits, withdrawals, swaps, transfers, and bounty payouts. Transaction hashes are public on Base L2." },
                { label: "Issue comment content", desc: "The text of comments you post containing @gitbankbot mentions. This data is processed to extract intent and is not stored long-term beyond what is needed for audit trails." },
                { label: "Vault signing credentials", desc: "Cryptographic credentials used to authorize on-chain operations on your behalf. These are stored securely in our database and never exposed in plaintext." },
              ].map((row) => (
                <div key={row.label} className="rounded-lg border border-border bg-card px-5 py-4">
                  <p className="text-[13px] font-semibold text-foreground mb-1">{row.label}</p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{row.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">3. How we use your data</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-3">We use the data we collect exclusively to operate the Gitbank protocol service. Specifically:</p>
            <ul className="flex flex-col gap-2">
              {[
                "To authenticate you via your GitHub Permanent User ID when webhook events arrive.",
                "To look up your vault, sign your transactions, and broadcast them to Base L2.",
                "To post transaction receipts and bot replies to your GitHub issues.",
                "To maintain audit logs of vault operations for your own review.",
                "To detect and prevent abuse, unauthorized access, and replay attacks.",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-[13px] text-muted-foreground"><span className="text-primary mt-1 flex-shrink-0"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="2" fill="currentColor"/></svg></span>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">4. Data we never collect</h2>
            <ul className="flex flex-col gap-2">
              {[
                "Email address, phone number, or any contact information.",
                "Real name, physical address, or government ID.",
                "Payment card information of any kind.",
                "Browsing history or cookies beyond what is strictly necessary to operate the DApp.",
                "Any data not explicitly listed in Section 2.",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-[13px] text-muted-foreground"><span className="text-red-400 mt-1 flex-shrink-0"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></span>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">5. Third parties and public data</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-3">Your vault address, transaction hashes, token balances, and all on-chain activity are publicly visible on Base L2 by nature of how blockchains work. This data is accessible to anyone using a block explorer. We do not control what third parties do with this public data.</p>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-3">We use the following third-party services to operate the protocol:</p>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-[13px]">
                <thead><tr className="border-b border-border bg-muted/40"><th className="text-left px-4 py-2.5 font-semibold text-foreground">Service</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Purpose</th><th className="text-left px-4 py-2.5 font-semibold text-foreground">Data shared</th></tr></thead>
                <tbody>
                  {[
                    ["GitHub (via Webhooks)", "Receive issue comment events", "Webhook payload content"],
                    ["Anthropic Claude", "Natural language intent extraction", "Comment text only"],
                    ["Base L2 RPC node", "Transaction broadcasting", "Signed transaction data"],
                    ["Flashbots Protect RPC", "MEV-protected swap broadcasting", "Signed swap transactions"],
                  ].map(([s,p,d],i)=>(
                    <tr key={i} className="border-b border-border/50 last:border-0"><td className="px-4 py-2.5 text-foreground">{s}</td><td className="px-4 py-2.5 text-muted-foreground">{p}</td><td className="px-4 py-2.5 text-muted-foreground">{d}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">6. Data retention</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed">We retain vault records and transaction logs for as long as your vault exists. If your vault is unused for more than 180 days and all funds have been withdrawn, we may archive or delete associated records. On-chain data is permanently public and beyond our control to delete.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">7. Your rights</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-3">You can request deletion of your off-chain data at any time by contacting us. Note that on-chain data (transaction history, vault addresses, balances) is public and immutable and cannot be deleted. Deleting off-chain records does not affect your on-chain assets.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">8. Security</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed">We apply industry-standard encryption to all sensitive credentials at rest. Plaintext signing material is never written to disk. We follow established best practices for infrastructure security. No system is perfectly secure and we cannot guarantee absolute protection against all attacks.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">9. Changes to this policy</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed">We may update this privacy policy as the protocol evolves. Material changes will be announced in the Gitbank community channels. Continued use of the service after the effective date of an updated policy constitutes acceptance of the new terms.</p>
          </section>

          <section className="border-t border-border pt-8">
            <h2 className="text-lg font-bold text-foreground mb-3">10. Contact</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed">For privacy-related questions or data deletion requests, open an issue on the Gitbank public GitHub repository tagged with the label "privacy". We will respond within 10 business days.</p>
          </section>

        </div>
      </motion.div>
    </PageWrapper>
  );
}
