"use client";
import { useEffect, useState } from "react";
import { formatCurrency, getStageColor, isRottingDeal } from "@/lib/utils";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  lastActivityAt: string;
  contact?: { firstName: string; lastName: string } | null;
}

export function TopDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/deals?limit=5&sort=value")
      .then((r) => r.json())
      .then((data) => setDeals(data.deals || []))
      .finally(() => setLoading(false));
  }, []);

  const stageLabels: Record<string, string> = {
    lead: "Lead",
    qualified: "Qualified",
    proposal: "Proposal",
    negotiation: "Negotiation",
    "closed won": "Won",
    "closed lost": "Lost",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Top Deals</h3>
          <p className="text-xs text-slate-500 mt-0.5">Highest value opportunities</p>
        </div>
        <Link href="/deals" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
          View all
        </Link>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-3">
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-slate-200 rounded w-3/4" />
                <div className="h-2 bg-slate-100 rounded w-1/2" />
              </div>
              <div className="h-4 bg-slate-200 rounded w-20" />
            </div>
          ))}
        </div>
      ) : deals.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-6">No deals yet</p>
      ) : (
        <div className="space-y-3">
          {deals.map((deal) => {
            const rotting = isRottingDeal(deal.lastActivityAt);
            return (
              <Link
                key={deal.id}
                href={`/deals/${deal.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <div className={`h-2 w-2 rounded-full ${getStageColor(deal.stage)} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-medium text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {deal.title}
                    </p>
                    {rotting && (
                      <AlertCircle className="h-3 w-3 text-rose-500 flex-shrink-0" />
                    )}
                  </div>
                  {deal.contact && (
                    <p className="text-xs text-slate-500">
                      {deal.contact.firstName} {deal.contact.lastName}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-slate-900">{formatCurrency(deal.value)}</p>
                  <p className="text-xs text-slate-500">{deal.probability}%</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
