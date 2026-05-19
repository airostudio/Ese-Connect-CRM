"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Building2, Globe, Users, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatCurrency } from "@/lib/utils";

interface Company {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  size?: string;
  revenue?: number;
  description?: string;
  createdAt: string;
  _count: { contacts: number; deals: number };
}

const industryOptions = [
  { value: "Technology", label: "Technology" },
  { value: "SaaS", label: "SaaS" },
  { value: "Finance", label: "Finance" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Retail", label: "Retail" },
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "Construction", label: "Construction" },
  { value: "Education", label: "Education" },
  { value: "Energy", label: "Energy" },
  { value: "Media", label: "Media" },
  { value: "Other", label: "Other" },
];

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "", website: "", industry: "Technology", size: "", revenue: "", description: "",
  });

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    const res = await fetch(`/api/companies?${params}`);
    const data = await res.json();
    setCompanies(data.companies || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchCompanies, 300);
    return () => clearTimeout(t);
  }, [fetchCompanies]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData, revenue: formData.revenue ? parseFloat(formData.revenue) : undefined };
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Company created!");
      setShowForm(false);
      fetchCompanies();
    } catch {
      toast.error("Failed to create company");
    } finally {
      setSaving(false);
    }
  };

  const industryColors: Record<string, string> = {
    Technology: "bg-blue-100 text-blue-700",
    SaaS: "bg-violet-100 text-violet-700",
    Finance: "bg-emerald-100 text-emerald-700",
    Healthcare: "bg-rose-100 text-rose-700",
    Retail: "bg-amber-100 text-amber-700",
    Manufacturing: "bg-orange-100 text-orange-700",
    Education: "bg-teal-100 text-teal-700",
    Energy: "bg-yellow-100 text-yellow-700",
    Media: "bg-pink-100 text-pink-700",
    default: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">All Companies</h2>
          <p className="text-xs text-slate-500 mt-0.5">{total} total companies</p>
        </div>
        <Button onClick={() => setShowForm(true)} icon={<Plus className="h-4 w-4" />}>
          Add Company
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies..."
          className="w-full max-w-md pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
              <div className="h-12 w-12 rounded-xl bg-slate-200 mb-3" />
              <div className="h-4 bg-slate-200 rounded w-32 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => {
            const colorClass = industryColors[company.industry || ""] || industryColors.default;
            return (
              <div
                key={company.id}
                onClick={() => router.push(`/companies/${company.id}`)}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-indigo-200 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-indigo-600" />
                  </div>
                  {company.industry && (
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${colorClass}`}>
                      {company.industry}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900">{company.name}</h3>
                {company.website && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Globe className="h-3 w-3 text-slate-400" />
                    <p className="text-xs text-indigo-600 truncate">{company.website}</p>
                  </div>
                )}
                {company.description && (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{company.description}</p>
                )}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Users className="h-3.5 w-3.5" />
                    <span>{company._count.contacts} contacts</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>{company._count.deals} deals</span>
                  </div>
                  {company.revenue && (
                    <div className="text-xs font-medium text-emerald-600">
                      {formatCurrency(company.revenue)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {companies.length === 0 && (
            <div className="col-span-3 text-center py-12 text-slate-500 text-sm">
              No companies found.
            </div>
          )}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add New Company" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Company Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="Acme Corp" />
          <Input label="Website" type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://example.com" />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              options={industryOptions}
            />
            <Input label="Company Size" value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} placeholder="100-500" />
          </div>
          <Input label="Annual Revenue ($)" type="number" value={formData.revenue} onChange={(e) => setFormData({ ...formData, revenue: e.target.value })} placeholder="1000000" />
          <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="Brief company description..." />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saving} className="flex-1">Create Company</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
