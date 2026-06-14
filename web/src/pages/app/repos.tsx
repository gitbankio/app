import { motion } from "framer-motion";
import { useLocation } from "wouter";
import DAppSidebar from "@/components/layout/DAppSidebar";
import { GitBranch, Plus, Trash2, Lock, Globe, Loader2, ExternalLink } from "lucide-react";
import { useListRepos, useRemoveRepo, useGetMe } from "@workspace/api-client-react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const APP_SLUG = import.meta.env.VITE_GITHUB_APP_SLUG ?? "gitbankbot";

export default function ReposPage() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const { data: me, isLoading: meLoading } = useGetMe();
  const { data: repos, isLoading } = useListRepos();
  const { mutate: removeRepo, isPending: removing } = useRemoveRepo({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["listRepos"] });
      },
    },
  });

  useEffect(() => {
    if (!meLoading && !me) navigate("/app/onboarding");
  }, [me, meLoading]);

  const installUrl = `https://github.com/apps/${APP_SLUG}/installations/new`;

  return (
    <div className="flex min-h-screen bg-background">
      <DAppSidebar />
      <main className="md:ml-[185px] mt-14 md:mt-0 flex-1 min-h-screen overflow-y-auto">
        <div className="max-w-[720px] mx-auto px-4 md:px-8 py-8 md:py-10">

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-8"
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[13px] text-muted-foreground mb-1">GitHub Repositories</p>
                <h1 className="text-2xl font-bold text-foreground">Connected Repos</h1>
              </div>
              <a
                href={installUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[13px] font-semibold text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 px-3 py-2 rounded-lg transition-colors"
              >
                <Plus size={14} />
                Add Repos
              </a>
            </div>
            <p className="text-[12px] text-muted-foreground mt-2">
              Install the Gitbank bot on your repos to enable
              <span className="font-mono text-foreground"> @gitbankbot</span> commands in issues and PRs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.35 }}
          >
            {isLoading ? (
              <div className="rounded-xl border border-border bg-card p-10 flex justify-center">
                <Loader2 size={18} className="animate-spin text-muted-foreground" />
              </div>
            ) : !repos || repos.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
                <GitBranch size={24} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-[14px] font-semibold text-foreground mb-1">No repos connected</p>
                <p className="text-[12px] text-muted-foreground mb-4">
                  Install the Gitbank GitHub App on a repo to start using IssueOps.
                </p>
                <a
                  href={installUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline"
                >
                  <Plus size={13} /> Install on GitHub
                </a>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                {repos.map((repo, i) => (
                  <div
                    key={`${repo.installationId}-${repo.repoId}`}
                    className={`flex items-center gap-4 px-5 py-4 ${i < repos.length - 1 ? "border-b border-border/60" : ""}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <GitBranch size={14} className="text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-semibold text-foreground truncate">
                          {repo.fullName}
                        </p>
                        {repo.private ? (
                          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full flex-shrink-0">
                            <Lock size={9} /> Private
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-full flex-shrink-0">
                            <Globe size={9} /> Public
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Installation #{repo.installationId} via @{repo.accountLogin}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                      >
                        <ExternalLink size={13} />
                      </a>
                      <button
                        onClick={() => removeRepo({ installationId: repo.installationId })}
                        disabled={removing}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.35 }}
            className="mt-6 rounded-xl border border-border bg-card p-5"
          >
            <p className="text-[13px] font-semibold text-foreground mb-2">How it works</p>
            <ol className="space-y-2 text-[12px] text-muted-foreground list-decimal list-inside">
              <li>Click <span className="font-semibold text-foreground">Add Repos</span> to install the Gitbank bot on your GitHub repos</li>
              <li>Open any issue or PR in a connected repo</li>
              <li>Mention <span className="font-mono text-foreground">@gitbankbot deposit 100 USDC</span> to run commands</li>
              <li>Gitbank executes on-chain and posts a receipt with the tx hash</li>
            </ol>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
