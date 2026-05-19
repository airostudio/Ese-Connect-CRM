"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, DollarSign, Calendar, Target, Activity, AlertCircle, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate, formatRelativeTime, getStageColor, isRottingDeal, calculateDaysInStage } from "@/lib/utils";
import Link from "next/link";

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  closeDate?: string;
  healthScore: number;
  lastActivityAt: string;
  pipeline: string;
  createdAt: string;
  contact?: { id: string; firstName: string; lastName: string; email?: string; title?: string } | null;
  company?: { id: string; name: string; industry?: string } | null;
  owner?: { id: string; name: string; email: string } | null;
  tasks: Array<{ id: string; title: string; priority: string; status: string; dueDate?: string }>;
  activities: Array<{ id: string; type: string; title: string; description?: string; createdAt: string }>;
  notes: Array<{ id: string; content: string; createdAt: string }>;
}

const stages = ["lead", "qualified", "proposal", "negotiation", "closed won", "closed lost"];
const stageColors: Record<string, string> = {
  lead: "bg-blue-500",
  qualified: "bg-violet-500",
  proposal: "bg-amber-500",
  negotiation: "bg-orange-500",
  "closed won": "bg-emerald-500",
  "closed lost": "bg-rose-500",
};

export default function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("activities");
  const [updatingStage, setUpdatingStage] = useState(false);

  useEffect(() => {
    fetch(`/api/deals/${id}`)
      .then((r) => r.json())
      .then((data) => setDeal(data.deal))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStageChange = async (newStage: string) => {
    if (!deal || updatingStage) return;
    setUpdatingStage(true);
    const probMap: Record<string, number> = {
      lead: 10, qualified: 30, proposal: 50, negotiation: 75, "closed won": 100, "closed lost": 0,
    };
    try {
      const res = await fetch(`/api/deals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage, probability: probMap[newStage] }),
      });
      const data = await res.json();
      setDeal((prev) => prev ? { ...prev, stage: data.deal.stage, probability: data.deal.probability } : null);
    } finally {
      setUpdatingStage(false);
    }
  };

  if (loading) return <div className="animate-pulse h-64 bg-slate-200 rounded-xl" />;
  if (!deal) return <div className="text-center py-12 text-slate-500">Deal not found</div>;

  const rotting = isRottingDeal(deal.lastActivityAt);
  const daysInStage = calculateDaysInStage(deal.lastActivityAt);

  const nextBestActions = [
    "Schedule a follow-up call within 48 hours",
    "Send updated proposal with case studies",
    "Involve decision maker in next meeting",
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to Deals
        </button>
        {rotting && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-rose-500" />
            <span className="text-xs font-medium text-rose-700">Deal idle for {daysInStage} days — needs attention</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left */}
        <div className="space-y-4">
          {/* Deal Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 leading-snug">{deal.title}</h2>
              <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold text-white ${stageColors[deal.stage] || "bg-gray-500"}`}>
                {deal.stage}
              </div>
            </div>

            {/* Stage Progress */}
            <div className="mb-5">
              <p className="text-xs text-slate-500 mb-2">Pipeline Stage</p>
              <div className="flex gap-1">
                {stages.map((s) => {
                  const stageIdx = stages.indexOf(deal.stage);
                  const sIdx = stages.indexOf(s);
                  const isPast = sIdx < stageIdx;
                  const isCurrent = s === deal.stage;
                  if (s === "closed lost") return null;
                  return (
                    <button
                      key={s}
                      onClick={() => handleStageChange(s)}
                      disabled={updatingStage}
                      className={`flex-1 h-2 rounded-full transition-colors ${
                        isCurrent ? stageColors[deal.stage] : isPast ? "bg-indigo-200" : "bg-slate-100"
                      } hover:opacity-80`}
                      title={s}
                    />
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <DollarSign className="h-4 w-4" />
                  <span>Deal Value</span>
                </div>
                <span className="text-lg font-bold text-slate-900">{formatCurrency(deal.value)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Target className="h-4 w-4" />
                  <span>Probability</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${deal.probability}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{deal.probability}%</span>
                </div>
              </div>
              {deal.closeDate && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="h-4 w-4" />
                    <span>Close Date</span>
                  </div>
                  <span className="text-sm font-medium text-slate-700">{formatDate(deal.closeDate)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Activity className="h-4 w-4" />
                  <span>Last Activity</span>
                </div>
                <span className="text-sm text-slate-600">{formatRelativeTime(deal.lastActivityAt)}</span>
              </div>
            </div>

            {/* Health Score */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-600">Deal Health Score</span>
                <span className={`text-lg font-bold ${deal.healthScore >= 70 ? "text-emerald-600" : deal.healthScore >= 40 ? "text-amber-600" : "text-rose-600"}`}>
                  {deal.healthScore}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${deal.healthScore >= 70 ? "bg-emerald-500" : deal.healthScore >= 40 ? "bg-amber-500" : "bg-rose-500"}`}
                  style={{ width: `${deal.healthScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Related */}
          {(deal.contact || deal.company) && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Related</h3>
              {deal.contact && (
                <Link href={`/contacts/${deal.contact.id}`} className="flex items-center gap-3 mb-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <Avatar name={`${deal.contact.firstName} ${deal.contact.lastName}`} size="sm" />
                  <div>
                    <p className="text-xs font-medium text-slate-900">{deal.contact.firstName} {deal.contact.lastName}</p>
                    <p className="text-xs text-slate-500">{deal.contact.title}</p>
                  </div>
                </Link>
              )}
              {deal.company && (
                <Link href={`/companies/${deal.company.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <span className="text-xs text-indigo-600 font-bold">{deal.company.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-900">{deal.company.name}</p>
                    <p className="text-xs text-slate-500">{deal.company.industry}</p>
                  </div>
                </Link>
              )}
            </div>
          )}

          {/* AI Next Best Actions */}
          <div className="bg-gradient-to-br from-indigo-950 to-violet-950 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <h3 className="text-xs font-semibold text-white">AI Next Best Actions</h3>
            </div>
            <ul className="space-y-2">
              {nextBestActions.map((action, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-indigo-300">
                  <span className="text-indigo-500 mt-0.5 font-bold">{i + 1}.</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Activity tabs */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1">
            {["activities", "notes", "tasks"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors capitalize ${
                  activeTab === tab ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "activities" && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">Activity Timeline</h3>
              {deal.activities.map((a) => (
                <div key={a.id} className="flex items-start gap-3 pb-4 border-b border-slate-50 last:border-0">
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium capitalize flex-shrink-0">
                    {a.type}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{a.title}</p>
                    {a.description && <p className="text-xs text-slate-500 mt-0.5">{a.description}</p>}
                  </div>
                  <p className="text-xs text-slate-400 flex-shrink-0">{formatRelativeTime(a.createdAt)}</p>
                </div>
              ))}
              {deal.activities.length === 0 && <p className="text-sm text-slate-500">No activities yet</p>}
            </div>
          )}

          {activeTab === "notes" && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">Notes</h3>
              {deal.notes.map((note) => (
                <div key={note.id} className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                  <p className="text-sm text-slate-800">{note.content}</p>
                  <p className="text-xs text-amber-600 mt-2">{formatDate(note.createdAt)}</p>
                </div>
              ))}
              {deal.notes.length === 0 && <p className="text-sm text-slate-500">No notes yet</p>}
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-2">
              <h3 className="text-sm font-semibold text-slate-900">Tasks</h3>
              {deal.tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100">
                  <div className={`h-2 w-2 rounded-full ${task.status === "completed" ? "bg-emerald-500" : "bg-slate-300"}`} />
                  <div className="flex-1">
                    <p className={`text-sm ${task.status === "completed" ? "line-through text-slate-400" : "text-slate-900 font-medium"}`}>{task.title}</p>
                    {task.dueDate && <p className="text-xs text-slate-500">{formatDate(task.dueDate)}</p>}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    task.priority === "urgent" ? "bg-rose-50 text-rose-700" :
                    task.priority === "high" ? "bg-amber-50 text-amber-700" :
                    "bg-slate-50 text-slate-600"
                  }`}>{task.priority}</span>
                </div>
              ))}
              {deal.tasks.length === 0 && <p className="text-sm text-slate-500">No tasks</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
