"use client";
import { useState } from "react";
import { Sparkles, TrendingUp, AlertTriangle, Target, ChevronRight, RefreshCw } from "lucide-react";
import Link from "next/link";

const insights = [
  {
    id: 1,
    type: "opportunity",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    title: "High-value deal ready to close",
    description: "Acme Corp deal ($85K) has been in negotiation for 12 days. This is the optimal window to close.",
    action: "View Deal",
    href: "/deals",
  },
  {
    id: 2,
    type: "alert",
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    title: "5 deals at risk",
    description: "These deals have had no activity in over 14 days. Immediate follow-up recommended.",
    action: "Review Deals",
    href: "/pipeline",
  },
  {
    id: 3,
    type: "insight",
    icon: Target,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    title: "Lead score spike detected",
    description: "3 leads scored above 80 this week. Sarah Johnson (92) is your hottest lead.",
    action: "View Contacts",
    href: "/contacts",
  },
];

export function AIInsightsPanel() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-950 to-violet-950 rounded-xl shadow-sm border border-indigo-900 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-800">
            <Sparkles className="h-4 w-4 text-indigo-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI Insights</h3>
            <p className="text-xs text-indigo-400">Powered by Claude</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="p-1.5 rounded-lg text-indigo-400 hover:text-indigo-300 hover:bg-indigo-800 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>
      <div className="space-y-3">
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <div
              key={insight.id}
              className="bg-white/10 backdrop-blur rounded-lg p-3.5 border border-white/10"
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-white/10 flex-shrink-0">
                  <Icon className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white">{insight.title}</p>
                  <p className="text-xs text-indigo-300 mt-0.5 leading-relaxed">{insight.description}</p>
                  <Link
                    href={insight.href}
                    className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-300 hover:text-white font-medium transition-colors"
                  >
                    {insight.action}
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Link
        href="/ai-assistant"
        className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Open AI Assistant
      </Link>
    </div>
  );
}
