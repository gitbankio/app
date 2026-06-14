import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Docs from "@/pages/docs";
import VaultPage from "@/pages/vault";
import GitLockPage from "@/pages/gitlock";
import GitSwapPage from "@/pages/gitswap";
import SecurityPage from "@/pages/security";
import FeesPage from "@/pages/fees";
import RoadmapPage from "@/pages/roadmap";
import CommunityPage from "@/pages/community";
import EcosystemPage from "@/pages/ecosystem";
import PrivacyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";
import Onboarding from "@/pages/app/onboarding";
import Dashboard from "@/pages/app/dashboard";
import VaultLock from "@/pages/app/vault-lock";
import VaultUnlock from "@/pages/app/vault-unlock";
import VaultTransfer from "@/pages/app/vault-transfer";
import SwapPage from "@/pages/app/swap";
import Projects from "@/pages/app/projects";
import ProjectsNew from "@/pages/app/projects-new";
import ProjectDetail from "@/pages/app/project-detail";
import Repos from "@/pages/app/repos";
import Keys from "@/pages/app/keys";
import Portfolio from "@/pages/app/portfolio";
import BlogPage from "@/pages/blog";
import HackathonPage from "@/pages/hackathon";
import OpenHackPage from "@/pages/openhack";
import GitHubAppPage from "@/pages/github-app";
import GitbankXPage from "@/pages/gitbank-x";
import X402Page from "@/pages/x402";
import McpPage from "@/pages/mcp";
import McpClaudePage from "@/pages/mcp/claude";
import McpCursorPage from "@/pages/mcp/cursor";
import McpGeminiPage from "@/pages/mcp/gemini";
import McpWatsonxPage from "@/pages/mcp/watsonx";
import McpKimiPage from "@/pages/mcp/kimi";
import McpVsCodePage from "@/pages/mcp/vscode";
import McpChatGptPage from "@/pages/mcp/chatgpt";
import McpGitHubCopilotPage from "@/pages/mcp/github-copilot";
import McpGrokPage from "@/pages/mcp/grok";
import McpBasePage from "@/pages/mcp/base";
import McpHermesPage from "@/pages/mcp/hermes";
import LaunchpadPage from "@/pages/launchpad/index";
import LaunchpadClaudePage from "@/pages/launchpad/claude";
import GrokPage from "@/pages/grok";
import RevenuePage from "@/pages/revenue";
import GitHubCopilotPage from "@/pages/github-copilot";
import GroupPage from "@/pages/group";
import X402ResultPage from "@/pages/x402-result";
import DepositTracker from "@/pages/deposit-tracker";
import UpdateNowPage from "@/pages/updatenow";
import RwaDevPage from "@/pages/rwadev";
import IssueOpsFeaturePage from "@/pages/features/issueops";
import DefiFeaturePage from "@/pages/features/defi";
import RwaFeaturePage from "@/pages/features/rwa";
import AiAgentFeaturePage from "@/pages/features/ai-agent";
import SecurityFeaturePage from "@/pages/features/security";
import PrivacyFeaturePage from "@/pages/features/privacy";
import AutogitFeaturePage from "@/pages/features/autogit";
import CommerceFeaturePage from "@/pages/features/commerce";
import { useGetMe } from "@workspace/api-client-react";
import { createContext, useContext, useEffect, useState } from "react";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.querySelectorAll("main, [data-scroll-container]").forEach((el) => {
      el.scrollTop = 0;
    });
  }, [location]);
  return null;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const status = (error as { status?: number })?.status;
        if (status !== undefined && status >= 400 && status < 500) return false;
        return failureCount < 2;
      },
      staleTime: 30_000,
    },
  },
});

interface ThemeContextValue {
  dark: boolean;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({ dark: false, toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

function AppRedirect() {
  const [, navigate] = useLocation();
  const { data, isLoading } = useGetMe();

  useEffect(() => {
    if (isLoading) return;
    if (data?.vaultAddress) {
      navigate("/app/dashboard", { replace: true });
    } else {
      navigate("/app/onboarding", { replace: true });
    }
  }, [data, isLoading, navigate]);

  return null;
}

function Router() {
  return (
    <Switch>
      {/* Marketing */}
      <Route path="/" component={Home} />
      <Route path="/docs" component={Docs} />
      <Route path="/docs/:section" component={Docs} />
      <Route path="/vault" component={VaultPage} />
      <Route path="/gitlock" component={GitLockPage} />
      <Route path="/gitswap" component={GitSwapPage} />
      <Route path="/security" component={SecurityPage} />
      <Route path="/fees" component={FeesPage} />
      <Route path="/roadmap" component={RoadmapPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/roadmap" component={BlogPage} />
      <Route path="/blog/recap1" component={BlogPage} />
      <Route path="/community" component={CommunityPage} />
      <Route path="/ecosystem" component={EcosystemPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/hackathon" component={HackathonPage} />
      <Route path="/openhack" component={OpenHackPage} />
      <Route path="/github-app" component={GitHubAppPage} />
      <Route path="/gitbank-x" component={GitbankXPage} />
      <Route path="/x402" component={X402Page} />
      <Route path="/mcp" component={McpPage} />
      <Route path="/mcp/claude" component={McpClaudePage} />
      <Route path="/mcp/cursor" component={McpCursorPage} />
      <Route path="/mcp/gemini" component={McpGeminiPage} />
      <Route path="/mcp/watsonx" component={McpWatsonxPage} />
      <Route path="/mcp/kimi" component={McpKimiPage} />
      <Route path="/mcp/vscode" component={McpVsCodePage} />
      <Route path="/mcp/chatgpt" component={McpChatGptPage} />
      <Route path="/mcp/github-copilot" component={McpGitHubCopilotPage} />
      <Route path="/mcp/grok" component={McpGrokPage} />
      <Route path="/mcp/base" component={McpBasePage} />
      <Route path="/mcp/hermes" component={McpHermesPage} />
      <Route path="/launchpad" component={LaunchpadPage} />
      <Route path="/launchpad/claude" component={LaunchpadClaudePage} />
      <Route path="/grok" component={GrokPage} />
      <Route path="/revenue" component={RevenuePage} />
      <Route path="/github-copilot" component={GitHubCopilotPage} />
      <Route path="/group" component={GroupPage} />
      <Route path="/x402/result/:id" component={X402ResultPage} />
      {/* X Bot deposit tracker — no auth required */}
      <Route path="/v/:xUserId" component={DepositTracker} />
      <Route path="/updatenow" component={UpdateNowPage} />
        <Route path="/rwadev" component={RwaDevPage} />
      {/* DApp */}
      <Route path="/app" component={AppRedirect} />
      <Route path="/app/onboarding" component={Onboarding} />
      <Route path="/app/dashboard" component={Dashboard} />
      <Route path="/app/vault/lock" component={VaultLock} />
      <Route path="/app/vault/unlock" component={VaultUnlock} />
      <Route path="/app/vault/transfer" component={VaultTransfer} />
      <Route path="/app/swap" component={SwapPage} />
      <Route path="/app/projects/new" component={ProjectsNew} />
      <Route path="/app/projects/:id" component={ProjectDetail} />
      <Route path="/app/projects" component={Projects} />
      <Route path="/app/repos" component={Repos} />
      <Route path="/app/keys" component={Keys} />
      <Route path="/app/portfolio" component={Portfolio} />
      {/* Feature detail pages */}
      <Route path="/features/issueops" component={IssueOpsFeaturePage} />
      <Route path="/features/defi" component={DefiFeaturePage} />
      <Route path="/features/rwa" component={RwaFeaturePage} />
      <Route path="/features/ai-agent" component={AiAgentFeaturePage} />
      <Route path="/features/security" component={SecurityFeaturePage} />
      <Route path="/features/privacy" component={PrivacyFeaturePage} />
      <Route path="/features/autogit" component={AutogitFeaturePage} />
      <Route path="/features/commerce" component={CommerceFeaturePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function getTimeBasedDark(): boolean {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
}

function App() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return getTimeBasedDark();
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [dark]);

  useEffect(() => {
    const syncTheme = () => {
      setDark(getTimeBasedDark());
    };
    const now = new Date();
    const msToNextHour = (60 - now.getMinutes()) * 60_000 - now.getSeconds() * 1000;
    const timeout = setTimeout(() => {
      syncTheme();
      const interval = setInterval(syncTheme, 3_600_000);
      return () => clearInterval(interval);
    }, msToNextHour);
    return () => clearTimeout(timeout);
  }, []);

  const toggle = () => setDark((d) => !d);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <ScrollToTop />
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeContext.Provider>
  );
}

export default App;
