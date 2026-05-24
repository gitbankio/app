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
      <Route path="/community" component={CommunityPage} />
      <Route path="/ecosystem" component={EcosystemPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("gitbank-theme") === "dark";
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
    localStorage.setItem("gitbank-theme", dark ? "dark" : "light");
  }, [dark]);

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
