import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";

export default function TermsPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-[760px]">
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Legal</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Terms of Service</h1>
        <p className="text-[13px] text-muted-foreground mb-10">Effective date: May 2026. Last updated: May 2026.</p>

        <div className="rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 px-5 py-4 mb-10">
          <p className="text-[13px] font-semibold text-amber-700 dark:text-amber-400 mb-1">Beta software notice</p>
          <p className="text-[13px] text-amber-700/80 dark:text-amber-400/80 leading-relaxed">Gitbank is in mainnet beta on Base L2. Smart contracts have not yet undergone a formal external security audit. Use with caution and only deposit amounts you are comfortable risking during this early period.</p>
        </div>

        <div className="flex flex-col gap-10">

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">1. Acceptance of terms</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed">By installing the Gitbank GitHub App, deploying a GitVault, or interacting with the Gitbank bot in any way, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the service. These terms constitute a legally binding agreement between you and the Gitbank protocol team.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">2. Description of service</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-3">Gitbank provides a non-custodial crypto vault protocol on Base L2, accessible through GitHub issue comments. The service consists of:</p>
            <ul className="flex flex-col gap-2 mb-4">
              {[
                "The GitVault and GitToken smart contracts deployed on Base L2.",
                "The Gitbank GitHub App and webhook-based bot service.",
                "The Relayer backend that signs and broadcasts transactions.",
                "The Claude-powered natural language intent extraction layer.",
                "The web application (DApp) for vault management.",
              ].map((item)=>(
                <li key={item} className="flex gap-3 text-[13px] text-muted-foreground"><span className="text-primary mt-1 flex-shrink-0"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="2" fill="currentColor"/></svg></span>{item}</li>
              ))}
            </ul>
            <p className="text-[14px] text-muted-foreground leading-relaxed">The service is non-custodial. Gitbank does not hold your assets. Your assets are held in your GitVault smart contract on Base L2, which you control through your GitHub account and recovery address.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">3. Eligibility</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed">You must be of legal age in your jurisdiction to enter into contracts and use financial services. By using Gitbank you represent that you meet this requirement. You must not be located in or a resident of any jurisdiction where the use of blockchain-based financial protocols is prohibited by law.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">4. Assumption of risk</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-3">Using blockchain-based financial protocols carries significant risks. By using Gitbank you acknowledge and accept the following risks:</p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Smart contract risk", desc: "Smart contracts may contain bugs or vulnerabilities that result in loss of funds. Gitbank's contracts have not yet been formally audited at the time of this writing." },
                { label: "Network risk", desc: "Base L2 may experience downtime, forks, or other technical issues that could affect your ability to access funds temporarily or permanently." },
                { label: "Key management risk", desc: "If your recovery address private key is lost and your execution keypair is compromised, access to your vault may be permanently lost." },
                { label: "Market risk", desc: "The value of crypto assets can fluctuate substantially. Gitbank does not provide investment advice and is not responsible for market losses." },
                { label: "Regulatory risk", desc: "The legal status of crypto assets and DeFi protocols varies by jurisdiction and may change. You are responsible for complying with the laws of your jurisdiction." },
                { label: "AI intent risk", desc: "The Claude-powered intent extraction layer may misinterpret your commands. Always verify receipts before confirming that an operation executed as intended." },
              ].map((row)=>(
                <div key={row.label} className="rounded-lg border border-border bg-card px-5 py-4">
                  <p className="text-[13px] font-semibold text-foreground mb-1">{row.label}</p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{row.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">5. User obligations</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-3">By using Gitbank you agree to:</p>
            <ul className="flex flex-col gap-2">
              {[
                "Use the service only for lawful purposes and in compliance with all applicable laws.",
                "Not attempt to exploit, attack, or disrupt the smart contracts, bot service, or Relayer infrastructure.",
                "Not use the service to launder money, fund terrorism, or engage in any other prohibited financial activity.",
                "Not attempt to impersonate another user or bypass GitHub identity verification.",
                "Review transaction receipts and verify that operations executed as intended before treating them as confirmed.",
                "Maintain the security of your GitHub account, recovery address private key, and any wallet you use with Gitbank.",
              ].map((item)=>(
                <li key={item} className="flex gap-3 text-[13px] text-muted-foreground"><span className="text-primary mt-1 flex-shrink-0"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="2" fill="currentColor"/></svg></span>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">6. No custodial relationship</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed">Gitbank is a non-custodial protocol. We do not hold, control, or have access to your assets at any time. Your funds are held exclusively in the smart contract vault you deploy on Base L2. We do not act as a financial institution, money transmitter, custodian, or broker. We provide software and infrastructure that allows you to interact with your own smart contract.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">7. Fees</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-3">The current protocol fee schedule is published at <span className="font-mono text-primary">/fees</span> and in the documentation. Fees are deducted automatically by the smart contract at the time of each operation. We reserve the right to modify the fee schedule. Changes to fees will be announced at least 30 days in advance through community channels.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">8. Limitation of liability</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-3">To the maximum extent permitted by applicable law, Gitbank and its contributors, operators, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:</p>
            <ul className="flex flex-col gap-1.5 mb-4">
              {["Loss of funds due to smart contract bugs or vulnerabilities.","Loss of funds due to network outages or blockchain-level failures.","Loss of funds due to user error including incorrect commands or lost private keys.","Loss of funds due to market price changes.","Unauthorized access to a vault resulting from a compromised GitHub account."].map((item)=>(
                <li key={item} className="flex gap-3 text-[13px] text-muted-foreground"><span className="text-muted-foreground mt-1 flex-shrink-0">–</span>{item}</li>
              ))}
            </ul>
            <p className="text-[14px] text-muted-foreground leading-relaxed">Our total liability for any claim arising from or related to the service shall not exceed the total fees you paid to the protocol in the 90 days preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">9. No warranties</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed">The service is provided "as is" and "as available" without any warranty, express or implied. We do not warrant that the service will be uninterrupted, error-free, or free from security vulnerabilities. We do not warrant that the AI intent extraction will correctly interpret every command.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">10. Modifications to the service</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed">We reserve the right to modify, suspend, or discontinue any part of the service at any time with or without notice. Smart contracts deployed on Base L2 are immutable and remain functional regardless of whether the off-chain services (bot, Relayer, DApp) continue to operate. Your recovery address provides permanent access to your on-chain assets.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">11. Governing law</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed">These terms are governed by and construed in accordance with applicable law. Any dispute arising under these terms shall first be attempted to be resolved through good-faith negotiation. If unresolved, disputes shall be submitted to binding arbitration under internationally recognized arbitration rules.</p>
          </section>

          <section className="border-t border-border pt-8">
            <h2 className="text-lg font-bold text-foreground mb-3">12. Contact</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed">For questions about these terms, open an issue on the Gitbank public GitHub repository tagged with "legal". We will respond within 10 business days.</p>
          </section>

        </div>
      </motion.div>
    </PageWrapper>
  );
}
