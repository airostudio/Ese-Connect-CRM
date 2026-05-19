"use client";
import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Target, DollarSign, Users } from "lucide-react";

interface Analytics {
  pipelineData: Array<{ stage: string; count: number; value: number }>;
  monthlyRevenue: Array<{ month: string; revenue: number; pipeline: number }>;
  activityBreakdown: Array<{ type: string; count: number }>;
  scoreRanges: Array<{ range: string; count: number }>;
  winRate: number;
  totalRevenue: number;
  forecastedRevenue: number;
  taskCompletion: { completed: number; pending: number };
}

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#f59e0b", "#10b981", "#f43f5e"];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3">
        <p className="text-xs font-semibold text-slate-700 mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-600 capitalize">{entry.name}:</span>
            <span className="font-semibold text-slate-900">
              {typeof entry.value === "number" && entry.value > 1000 ? formatCurrency(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ReportsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("6M");

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setAnalytics)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-48" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-slate-200 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => <div key={i} className="h-72 bg-slate-200 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Reports & Analytics</h2>
          <p className="text-xs text-slate-500 mt-0.5">Sales performance insights</p>
        </div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {["1M", "3M", "6M", "1Y"].map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                dateRange === r ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(analytics.totalRevenue), icon: DollarSign, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Forecasted", value: formatCurrency(analytics.forecastedRevenue), icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Win Rate", value: `${analytics.winRate}%`, icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
          {
            label: "Task Completion",
            value: `${analytics.taskCompletion.completed + analytics.taskCompletion.pending > 0 ?
              Math.round((analytics.taskCompletion.completed / (analytics.taskCompletion.completed + analytics.taskCompletion.pending)) * 100) : 0}%`,
            icon: Users,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`${stat.bg} rounded-xl p-5`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <p className="text-xs font-medium text-slate-600">{stat.label}</p>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Monthly Revenue */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={analytics.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pipeline" name="Pipeline" fill="#c7d2fe" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pipeline by Stage */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Pipeline by Stage</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={analytics.pipelineData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <YAxis type="category" dataKey="stage" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Value" radius={[0, 4, 4, 0]}>
                {analytics.pipelineData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Activity Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Activity Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={analytics.activityBreakdown.filter((a) => a.count > 0)}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="count"
                nameKey="type"
                label={(props: { name?: string; percent?: number }) => `${props.name || ""} ${(((props.percent) || 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {analytics.activityBreakdown.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Score Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Lead Score Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.scoreRanges}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="range" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="count" name="Contacts" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Win/Loss Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Win/Loss Analysis</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-600">Win Rate</span>
                <span className="text-sm font-bold text-emerald-600">{analytics.winRate}%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${analytics.winRate}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-600">Loss Rate</span>
                <span className="text-sm font-bold text-rose-600">{100 - analytics.winRate}%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${100 - analytics.winRate}%` }} />
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Task Completion</span>
                <span className="font-semibold text-slate-900">{analytics.taskCompletion.completed} done</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Pending Tasks</span>
                <span className="font-semibold text-amber-600">{analytics.taskCompletion.pending} pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard (mock) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Top Performers</h3>
        <div className="space-y-3">
          {[
            { name: "Alex Admin", deals: 12, revenue: 285000, winRate: 75 },
            { name: "Maria Manager", deals: 9, revenue: 198000, winRate: 68 },
            { name: "Sam Agent", deals: 7, revenue: 142000, winRate: 62 },
          ].map((performer, i) => (
            <div key={performer.name} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                i === 0 ? "bg-amber-500" : i === 1 ? "bg-slate-400" : "bg-orange-700"
              }`}>
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{performer.name}</p>
                <p className="text-xs text-slate-500">{performer.deals} deals closed</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{formatCurrency(performer.revenue)}</p>
                <p className="text-xs text-emerald-600">{performer.winRate}% win rate</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
