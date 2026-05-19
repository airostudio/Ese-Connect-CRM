"use client";
import { FunnelChart, Funnel, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { formatCurrency } from "@/lib/utils";

const data = [
  { value: 2450000, name: "Lead", fill: "#6366f1", count: 45 },
  { value: 1820000, name: "Qualified", fill: "#8b5cf6", count: 32 },
  { value: 1240000, name: "Proposal", fill: "#a78bfa", count: 21 },
  { value: 860000, name: "Negotiation", fill: "#f59e0b", count: 14 },
  { value: 520000, name: "Closed Won", fill: "#10b981", count: 9 },
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; count: number } }> }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3">
        <p className="text-xs font-semibold text-slate-900">{d.name}</p>
        <p className="text-xs text-slate-600">Value: {formatCurrency(d.value)}</p>
        <p className="text-xs text-slate-600">Deals: {d.count}</p>
      </div>
    );
  }
  return null;
};

export function PipelineFunnel() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-900">Pipeline Funnel</h3>
        <p className="text-xs text-slate-500 mt-0.5">Deal flow by stage</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <FunnelChart>
          <Tooltip content={<CustomTooltip />} />
          <Funnel dataKey="value" data={data} isAnimationActive>
            <LabelList
              position="right"
              fill="#64748b"
              stroke="none"
              dataKey="name"
              style={{ fontSize: "11px", fontWeight: 500 }}
            />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2">
        {data.map((item, i) => {
          const convRate = i === 0 ? 100 : Math.round((item.count / data[0].count) * 100);
          return (
            <div key={item.name} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
              <span className="text-xs text-slate-600 w-24">{item.name}</span>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${convRate}%`, backgroundColor: item.fill }}
                />
              </div>
              <span className="text-xs font-medium text-slate-700 w-8 text-right">{item.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
