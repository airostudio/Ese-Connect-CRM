"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Globe, Building2, Users, TrendingUp, DollarSign } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

interface Company {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  size?: string;
  revenue?: number;
  description?: string;
  address?: string;
  createdAt: string;
  contacts: Array<{ id: string; firstName: string; lastName: string; email?: string; title?: string }>;
  deals: Array<{ id: string; title: string; value: number; stage: string; probability: number }>;
  activities: Array<{ id: string; type: string; title: string; createdAt: string }>;
}

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/companies/${id}`)
      .then((r) => r.json())
      .then((data) => setCompany(data.company))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="animate-pulse h-64 bg-slate-200 rounded-xl" />;
  if (!company) return <div className="text-center py-12 text-slate-500">Company not found</div>;

  const totalDealValue = company.deals.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" /> Back to Companies
      </button>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Profile */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{company.name}</h2>
                {company.industry && <p className="text-sm text-slate-500">{company.industry}</p>}
              </div>
            </div>

            {company.description && (
              <p className="text-sm text-slate-600 mb-4 pb-4 border-b border-slate-100">{company.description}</p>
            )}

            <div className="space-y-3">
              {company.website && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Globe className="h-4 w-4 text-slate-400" />
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{company.website}</a>
                </div>
              )}
              {company.size && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-700">{company.size} employees</span>
                </div>
              )}
              {company.revenue && (
                <div className="flex items-center gap-2.5 text-sm">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-700">{formatCurrency(company.revenue)} revenue</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 text-center">
                <p className="text-xl font-bold text-slate-900">{company.contacts.length}</p>
                <p className="text-xs text-slate-500">Contacts</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 text-center">
                <p className="text-xl font-bold text-slate-900">{company.deals.length}</p>
                <p className="text-xs text-slate-500">Deals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="xl:col-span-2 space-y-4">
          {/* Contacts */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Contacts ({company.contacts.length})</h3>
            <div className="space-y-2">
              {company.contacts.map((contact) => (
                <Link key={contact.id} href={`/contacts/${contact.id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <Avatar name={`${contact.firstName} ${contact.lastName}`} size="sm" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{contact.firstName} {contact.lastName}</p>
                    <p className="text-xs text-slate-500">{contact.title} · {contact.email}</p>
                  </div>
                </Link>
              ))}
              {company.contacts.length === 0 && <p className="text-sm text-slate-500">No contacts</p>}
            </div>
          </div>

          {/* Deals */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Deals ({company.deals.length})</h3>
              {totalDealValue > 0 && (
                <span className="text-sm font-bold text-emerald-600">{formatCurrency(totalDealValue)} total</span>
              )}
            </div>
            <div className="space-y-2">
              {company.deals.map((deal) => (
                <Link key={deal.id} href={`/deals/${deal.id}`} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 hover:border-indigo-100 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{deal.title}</p>
                    <p className="text-xs text-slate-500 capitalize">{deal.stage} · {deal.probability}% probability</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(deal.value)}</p>
                </Link>
              ))}
              {company.deals.length === 0 && <p className="text-sm text-slate-500">No deals</p>}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Activities</h3>
            <div className="space-y-3">
              {company.activities.slice(0, 10).map((a) => (
                <div key={a.id} className="flex items-center gap-3">
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-medium capitalize">{a.type}</span>
                  <p className="text-sm text-slate-700 flex-1">{a.title}</p>
                  <p className="text-xs text-slate-400">{formatDate(a.createdAt)}</p>
                </div>
              ))}
              {company.activities.length === 0 && <p className="text-sm text-slate-500">No activities</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
