import { motion } from "framer-motion";
import { useLocation } from "wouter";
import DAppSidebar from "@/components/layout/DAppSidebar";
import { Plus, FolderKanban, Loader2 } from "lucide-react";
import { useListProjects } from "@workspace/api-client-react";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600",
  completed: "bg-muted text-muted-foreground",
  paused: "bg-amber-500/10 text-amber-500",
  cancelled: "bg-red-500/10 text-red-500",
};

export default function Projects() {
  const [, navigate] = useLocation();
  const { data: projects, isLoading, isError } = useListProjects();

  const activeCount = projects?.filter(p => p.status === "active").length ?? 0;

  return (
    <div className="flex min-h-screen bg-background">
      <DAppSidebar />
      <main className="md:ml-[185px] mt-14 md:mt-0 flex-1 min-h-screen overflow-y-auto">
        <div className="max-w-[900px] mx-auto px-4 md:px-8 py-8 md:py-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Workspace</p>
                <h1 className="text-2xl font-bold text-foreground">Projects</h1>
                {!isLoading && projects && (
                  <p className="text-[13px] text-muted-foreground mt-1">{activeCount} active · {projects.length} total</p>
                )}
              </div>
              <button
                onClick={() => navigate("/app/projects/new")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition-opacity"
              >
                <Plus size={14} /> New project
              </button>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-24 text-muted-foreground gap-2">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-[13px]">Loading projects...</span>
              </div>
            )}

            {/* Error */}
            {isError && (
              <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-500/5 p-6 text-center">
                <p className="text-[13px] text-red-600">Failed to load projects. Please refresh.</p>
              </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && projects?.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-16 flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                  <FolderKanban size={22} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-foreground mb-1">No projects yet</p>
                  <p className="text-[13px] text-muted-foreground">Create a project via bot to start assigning bounties and tracking tasks.</p>
                  <p className="text-[12px] text-muted-foreground/60 mt-2 font-mono">@gitbankbot create project 'Sprint 1' with 500 USDC budget</p>
                </div>
                <button onClick={() => navigate("/app/projects/new")} className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90">
                  Create first project
                </button>
              </div>
            )}

            {/* Project list */}
            {!isLoading && !isError && projects && projects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((p, i) => {
                  const budget = parseFloat(p.totalBudget);
                  const spent = parseFloat(p.spentBudget);
                  const pct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.35 }}
                      onClick={() => navigate(`/app/projects/${p.id}`)}
                      className="rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:bg-accent/10 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-bold text-foreground mb-0.5">{p.name}</p>
                          <p className="text-[11px] text-muted-foreground font-mono truncate">{p.repo}</p>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ml-2 ${STATUS_STYLES[p.status] ?? STATUS_STYLES.active}`}>
                          {p.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {[["Budget", `${budget} ${p.token}`], ["Spent", `${spent} ${p.token}`], ["Remaining", `${budget - spent} ${p.token}`]].map(([l, v]) => (
                          <div key={l} className="rounded-lg bg-muted/40 px-3 py-2">
                            <p className="text-[9px] font-bold tracking-widest text-muted-foreground mb-0.5">{l}</p>
                            <p className="text-[12px] font-bold text-foreground">{v}</p>
                          </div>
                        ))}
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
                          <span>Budget consumed</span>
                          <span className={pct >= 100 ? "text-red-500" : pct >= 80 ? "text-amber-500" : "text-foreground"}>{pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-amber-500" : "bg-primary"}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

          </motion.div>
        </div>
      </main>
    </div>
  );
}
