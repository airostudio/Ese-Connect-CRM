import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { KPICard } from "@/components/dashboard/KPICard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { PipelineFunnel } from "@/components/dashboard/PipelineFunnel";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { TopDeals } from "@/components/dashboard/TopDeals";
import { AIInsightsPanel } from "@/components/dashboard/AIInsightsPanel";
import { DollarSign, Users, TrendingUp, Target } from "lucide-react";

async function getDashboardStats() {
  const [contactsRes, dealsCountRes, allDealsRes] = await Promise.all([
    supabase.from("contacts").select("*", { count: "exact", head: true }),
    supabase.from("deals").select("*", { count: "exact", head: true }),
    supabase.from("deals").select("value, probability, stage"),
  ]);

  const totalContacts = contactsRes.count ?? 0;
  const totalDeals = dealsCountRes.count ?? 0;

  type DealSummary = { value: number; probability: number; stage: string };
  const deals: DealSummary[] = allDealsRes.data ?? [];

  const totalRevenue = deals
    .filter((d) => d.stage === "closed won")
    .reduce((sum, d) => sum + d.value, 0);

  const forecastedRevenue = deals
    .filter((d) => !["closed won", "closed lost"].includes(d.stage))
    .reduce((sum, d) => sum + (d.value * d.probability) / 100, 0);

  const wonDeals = deals.filter((d) => d.stage === "closed won").length;
  const winRate = totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0;

  return { totalContacts, totalDeals, totalRevenue, forecastedRevenue, winRate };
}

export default async function DashboardPage() {
  const session = await auth();
  const stats = await getDashboardStats();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          {greeting()}, {session?.user?.name?.split(" ")[0]} 👋
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Here&apos;s what&apos;s happening with your sales pipeline today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={stats.totalRevenue}
          isCurrency
          change={12.5}
          changeLabel="vs last month"
          icon={<DollarSign className="h-5 w-5 text-indigo-600" />}
          iconBg="bg-indigo-50"
        />
        <KPICard
          title="Active Contacts"
          value={stats.totalContacts}
          change={8.2}
          changeLabel="vs last month"
          icon={<Users className="h-5 w-5 text-violet-600" />}
          iconBg="bg-violet-50"
        />
        <KPICard
          title="Total Deals"
          value={stats.totalDeals}
          change={-3.1}
          changeLabel="vs last month"
          icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Win Rate"
          value={stats.winRate}
          suffix="%"
          change={5.4}
          changeLabel="vs last month"
          icon={<Target className="h-5 w-5 text-amber-600" />}
          iconBg="bg-amber-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
        <PipelineFunnel />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <RecentActivities />
        <TopDeals />
        <AIInsightsPanel />
      </div>
    </div>
  );
}
