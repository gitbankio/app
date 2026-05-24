import { useLocation } from "wouter";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Vault", href: "/vault" },
  { label: "gitShield", href: "/gitlock" },
  { label: "gitSwap", href: "/gitswap" },
  { label: "Security", href: "/security" },
  { label: "Fees", href: "/fees" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Community", href: "/community" },
  { label: "Docs", href: "/docs" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

const contactLinks = [
  {
    label: "github.com/gitbankio",
    href: "https://github.com/gitbankio",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.491.5.09.682-.218.682-.484 0-.236-.009-.866-.013-1.699-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.607.069-.607 1.003.071 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.091-.645.35-1.087.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.376.202 2.394.1 2.646.64.698 1.026 1.591 1.026 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .268.18.579.688.481C19.138 20.165 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
  },
  {
    label: "x.com/gitbank_io",
    href: "https://x.com/gitbank_io",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "security@gitbank.io",
    href: "mailto:security@gitbank.io",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [, navigate] = useLocation();

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="Gitbank" className="w-7 h-7 rounded-lg object-cover flex-shrink-0" />
              <span className="text-[15px] font-semibold text-foreground tracking-tight">Gitbank</span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              AI-powered IssueOps workspace for Web3 teams. All commands run via GitHub bot mentions. Vaults live on Base L2.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Quick Links</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="text-[13px] text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Contact Us</p>
            <ul className="flex flex-col gap-2.5">
              {contactLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="text-primary flex-shrink-0">{item.icon}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-border bg-muted/30">
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-[12px] text-muted-foreground">
            &copy; 2026 Gitbank. All rights reserved.
          </p>
          <p className="text-[12px] text-muted-foreground">
            Built on{" "}
            <a href="https://base.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Base
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
