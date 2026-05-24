import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import DAppSidebar from "@/components/layout/DAppSidebar";
import { ChevronLeft, Plus, ExternalLink, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import { useGetProject, getGetProjectQueryKey } from "@workspace/api-client-react";

const STATUS_BADGE: Record<string, { label: string; style: string; icon: typeof CheckCircle }> = {
  completed: { label: "Completed",   style: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle },
  assigned:  { label: "In progress", style: "bg-blue-500/10 text-blue-500",       icon: Clock       },
  cancelled: { label: "Cancelled",   style: "bg-red-500/10 text-red-500",         icon: XCircle     },
};

const PROJECT_STATUS_STYLE: Record<string, string> = {
  active:    "bg-emerald-500/10 text-emerald-600",
  completed: "bg-muted text-muted-foreground",
  paused:    "bg-amber-500/10 text-amber-500",
  cancelled: "bg-red-500/10 text-red-500",
};

const TABS = ["Tasks", "Budget", "Team"] as const;
type Tab = typeof TABS[number];

export default function ProjectDetail({ params }: { params?: { id?: string } }) {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<Tab>("Tasks");

  const projectId = parseInt(params?.id ?? "0", 10);
  const { data, isLoading, isError } = useGetProject(projectId, {
    query: { queryKey: getGetProjectQueryKey(projectId), enabled: projectId > 0 },
  });

  const p = data?.project;
  const tasks = data?.tasks ?? [];

  const budget   = p ? parseFloat(p.totalBudget) : 0;
  const spent    = p ? parseFloat(p.spentBudget)  : 0;
  const remaining = budget - spent;
  const pct      = budget > 0 ? Math.round((spent / budget) * 100) : 0;

  const completedTasks = tasks.filter(t => t.status === "completed");
  const assignedTasks  = tasks.filter(t => t.status === "assigned");
  const openTasks      = tasks.filter(t => t.status !== "completed" && t.status !== "cancelled");

  const inEscrow    = assignedTasks.reduce((s, t) => s + parseFloat(t.bountyAmount), 0);
  const available   = remaining - inEscrow;

  const team = tasks.filter(t => t.contributorLogin).reduce<Record<string, { login: string; earned: number; tasks: number }>>((acc, t) => {
    const login = t.contributorLogin!;
    if (!acc[login]) acc[login] = { login, earned: 0, tasks: 0 };
    if (t.status === "completed") acc[login].earned += parseFloat(t.bountyAmount);
    acc[login].tasks += 1;
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen bg-background">
      <DAppSidebar />
      <main className="md:ml-[185px] mt-14 md:mt-0 flex-1 min-h-screen overflow-y-auto">
        <div className="max-w-[900px] mx-auto px-4 md:px-8 py-8 md:py-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

            <button onClick={() => navigate("/app/projects")} className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ChevronLeft size={13} /> Projects
            </button>

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-24 text-muted-foreground gap-2">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-[13px]">Loading project...</span>
              </div>
            )}

            {/* Error / not found */}
            {(isError || (!isLoading && !p)) && (
              <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-500/5 p-8 text-center">
                <p className="text-[13px] text-red-600">Project not found or failed to load.</p>
              </div>
            )}

            {/* Content */}
            {!isLoading && p && (
              <>
                {/* Header */}
                <div className="flex items-start justify-between mb-6 gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{p.name}</h1>
                    <p className="text-[12px] font-mono text-muted-foreground mt-0.5">
                      {p.repo} · Created {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-[11px] font-semibold px-3 py-1 rounded-full capitalize flex-shrink-0 ${PROJECT_STATUS_STYLE[p.status] ?? PROJECT_STATUS_STYLE.active}`}>
                    {p.status}
                  </span>
                </div>

                {/* Budget overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                  {[
                    ["Total budget", `${budget} ${p.token}`],
                    ["Spent",        `${spent} ${p.token}`],
                    ["Remaining",    `${remaining.toFixed(2)} ${p.token}`],
                    ["Tasks",        `${completedTasks.length}/${tasks.length} done`],
                  ].map(([l, v]) => (
                    <div key={l} className="rounded-xl border border-border bg-card px-4 py-3">
                      <p className="text-[10px] font-bold tracking-widest text-muted-foreground mb-1">{l}</p>
                      <p className="text-[15px] font-bold text-foreground">{v}</p>
                    </div>
                  ))}
                </div>

                {/* Budget bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between text-[12px] text-muted-foreground mb-2">
                    <span>Budget consumed</span>
                    <span className="text-foreground font-semibold">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-primary"}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-border mb-6">
                  {TABS.map(t => (
                    <button key={t} onClick={() => setTab(t)}
                      className={`px-4 py-2.5 text-[13px] font-semibold transition-colors border-b-2 -mb-px ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                      {t}
                    </button>
                  ))}
                </div>

                {/* Tasks tab */}
                {tab === "Tasks" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[13px] text-muted-foreground">
                        {tasks.length} tasks · {openTasks.length} open
                      </p>
                    </div>
                    {tasks.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-border p-10 text-center">
                        <p className="text-[13px] text-muted-foreground">No tasks yet.</p>
                        <p className="text-[12px] text-muted-foreground/60 mt-1 font-mono">@gitbankbot assign this task to @alice with 50 USDC bounty</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {tasks.map(task => {
                          const badge = STATUS_BADGE[task.status] ?? STATUS_BADGE.open;
                          const { label, style, icon: Icon } = badge;
                          const issueUrl = `https://github.com/${task.repo}/issues/${task.issueNumber}`;
                          const prUrl = task.prNumber ? `https://github.com/${task.repo}/pull/${task.prNumber}` : null;
                          return (
                            <div key={task.id} className="rounded-xl border border-border bg-card px-5 py-4 flex items-center gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <a href={issueUrl} target="_blank" rel="noopener noreferrer"
                                    className="text-[13px] font-semibold text-foreground hover:underline truncate flex items-center gap-1">
                                    #{task.issueNumber}
                                    <ExternalLink size={10} className="flex-shrink-0 text-muted-foreground" />
                                  </a>
                                  {prUrl && (
                                    <a href={prUrl} target="_blank" rel="noopener noreferrer"
                                      className="flex items-center gap-0.5 text-[10px] text-primary hover:underline flex-shrink-0">
                                      PR #{task.prNumber} <ExternalLink size={9} />
                                    </a>
                                  )}
                                </div>
                                {task.contributorLogin ? (
                                  <p className="text-[11px] text-muted-foreground">@{task.contributorLogin}</p>
                                ) : (
                                  <p className="text-[11px] text-muted-foreground/50">Unassigned</p>
                                )}
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${style}`}>
                                  <Icon size={9} /> {label}
                                </span>
                                <p className="text-[13px] font-bold text-foreground font-mono">{parseFloat(task.bountyAmount)} {task.token}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Budget tab */}
                {tab === "Budget" && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="text-[13px] font-bold text-foreground mb-4">Allocation breakdown</h3>
                      {[
                        { label: "Completed payouts",          amount: spent,     pct: budget > 0 ? Math.round(spent / budget * 100) : 0 },
                        { label: "In escrow (assigned tasks)", amount: inEscrow,  pct: budget > 0 ? Math.round(inEscrow / budget * 100) : 0 },
                        { label: "Available for assignment",   amount: available, pct: budget > 0 ? Math.round(available / budget * 100) : 0 },
                      ].map(row => (
                        <div key={row.label} className="mb-3">
                          <div className="flex justify-between text-[12px] mb-1">
                            <span className="text-muted-foreground">{row.label}</span>
                            <span className="text-foreground font-semibold">{row.amount.toFixed(2)} {p.token} ({row.pct}%)</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(0, row.pct)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Team tab */}
                {tab === "Team" && (
                  <div>
                    <p className="text-[13px] text-muted-foreground mb-4">{Object.keys(team).length} contributors</p>
                    {Object.keys(team).length === 0 ? (
                      <div className="rounded-xl border border-dashed border-border p-10 text-center">
                        <p className="text-[13px] text-muted-foreground">No contributors yet.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {Object.values(team).sort((a, b) => b.earned - a.earned).map((member, i) => (
                          <div key={member.login} className="rounded-xl border border-border bg-card px-5 py-4 flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[12px] font-bold text-primary flex-shrink-0">
                              {i + 1}
                            </div>
                            <div className="flex-1">
                              <a href={`https://github.com/${member.login}`} target="_blank" rel="noopener noreferrer"
                                className="text-[13px] font-semibold text-foreground hover:underline">
                                @{member.login}
                              </a>
                              <p className="text-[11px] text-muted-foreground">{member.tasks} task{member.tasks !== 1 ? "s" : ""} assigned</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[13px] font-bold text-primary">{member.earned.toFixed(2)} {p.token}</p>
                              <p className="text-[10px] text-muted-foreground">earned</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

          </motion.div>
        </div>
      </main>
    </div>
  );
}
