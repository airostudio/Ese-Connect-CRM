"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, AlertCircle, DollarSign } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatCurrency, formatDate, getStageColor, isRottingDeal } from "@/lib/utils";

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  closeDate?: string;
  lastActivityAt: string;
  healthScore: number;
  contact?: { firstName: string; lastName: string } | null;
  company?: { name: string } | null;
  owner?: { name: string } | null;
}

const stageOptions = [
  { value: "", label: "All Stages" },
  { value: "lead", label: "Lead" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
  { value: "closed won", label: "Closed Won" },
  { value: "closed lost", label: "Closed Lost" },
];

const stageFormOptions = stageOptions.filter((s) => s.value);

export default function DealsPage() {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "", value: "", stage: "lead", probability: "10", closeDate: "",
  });

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (stageFilter) params.set("stage", stageFilter);
    const res = await fetch(`/api/deals?${params}`);
    const data = await res.json();
    setDeals(data.deals || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [search, stageFilter]);

  useEffect(() => {
    const t = setTimeout(fetchDeals, 300);
    return () => clearTimeout(t);
  }, [fetchDeals]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          value: parseFloat(formData.value) || 0,
          probability: parseInt(formData.probability) || 10,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Deal created!");
      setShowForm(false);
      fetchDeals();
    } catch {
      toast.error("Failed to create deal");
    } finally {
      setSaving(false);
    }
  };

  const totalPipelineValue = deals
    .filter((d) => !["closed won", "closed lost"].includes(d.stage))
    .reduce((s, d) => s + d.value, 0);

  const forecastedValue = deals
    .filter((d) => !["closed won", "closed lost"].includes(d.stage))
    .reduce((s, d) => s + (d.value * d.probability) / 100, 0);

  const wonValue = deals
    .filter((d) => d.stage === "closed won")
    .reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">All Deals</h2>
          <p className="text-xs text-slate-500 mt-0.5">{total} total deals</p>
        </div>
        <Button onClick={() => setShowForm(true)} icon={<Plus className="h-4 w-4" />}>New Deal</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pipeline Value", value: formatCurrency(totalPipelineValue), color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Forecasted", value: formatCurrency(forecastedValue), color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Won Revenue", value: formatCurrency(wonValue), color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-4`}>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className={`h-4 w-4 ${stat.color}`} />
              <p className="text-xs font-medium text-slate-600">{stat.label}</p>
            </div>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search deals..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <Select options={stageOptions} value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="w-44" />
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-slate-100 rounded" />)}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Deal</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Contact</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Stage</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Value</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Probability</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Close Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Health</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal, i) => {
                const rotting = isRottingDeal(deal.lastActivityAt);
                return (
                  <tr
                    key={deal.id}
                    onClick={() => router.push(`/deals/${deal.id}`)}
                    className={`border-b border-slate-50 cursor-pointer transition-colors hover:bg-indigo-50/30 ${i % 2 === 0 ? "" : "bg-slate-50/50"} ${rotting ? "border-l-2 border-l-rose-400" : ""}`}
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        {rotting && <AlertCircle className="h-3.5 w-3.5 text-rose-500 flex-shrink-0" />}
                        <div>
                          <p className="text-sm font-medium text-slate-900">{deal.title}</p>
                          {deal.company && <p className="text-xs text-slate-500">{deal.company.name}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-slate-600">
                      {deal.contact ? `${deal.contact.firstName} ${deal.contact.lastName}` : "—"}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${getStageColor(deal.stage)}`} />
                        <span className="text-sm text-slate-700 capitalize">{deal.stage}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right text-sm font-semibold text-slate-900">
                      {formatCurrency(deal.value)}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-16">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${deal.probability}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600">{deal.probability}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">
                      {deal.closeDate ? formatDate(deal.closeDate) : "—"}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        deal.healthScore >= 70 ? "bg-emerald-50 text-emerald-700" :
                        deal.healthScore >= 40 ? "bg-amber-50 text-amber-700" :
                        "bg-rose-50 text-rose-700"
                      }`}>
                        {deal.healthScore}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {deals.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">
                    No deals found. Create your first deal to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Deal Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Create New Deal" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Deal Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required placeholder="Enterprise License Deal" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Deal Value ($)" type="number" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} placeholder="50000" required />
            <Input label="Probability (%)" type="number" min="0" max="100" value={formData.probability} onChange={(e) => setFormData({ ...formData, probability: e.target.value })} />
          </div>
          <Select label="Stage" value={formData.stage} onChange={(e) => setFormData({ ...formData, stage: e.target.value })} options={stageFormOptions} />
          <Input label="Expected Close Date" type="date" value={formData.closeDate} onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saving} className="flex-1">Create Deal</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
