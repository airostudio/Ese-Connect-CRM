"use client";
import { useEffect, useState } from "react";
import { Phone, Mail, Users, FileText, CheckSquare, Clock } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import Link from "next/link";

interface Activity {
  id: string;
  type: string;
  title: string;
  description?: string;
  createdAt: string;
  contact?: { firstName: string; lastName: string } | null;
  deal?: { title: string } | null;
}

const typeIcons: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  call: { icon: Phone, color: "text-blue-600", bg: "bg-blue-100" },
  email: { icon: Mail, color: "text-violet-600", bg: "bg-violet-100" },
  meeting: { icon: Users, color: "text-emerald-600", bg: "bg-emerald-100" },
  note: { icon: FileText, color: "text-amber-600", bg: "bg-amber-100" },
  task: { icon: CheckSquare, color: "text-indigo-600", bg: "bg-indigo-100" },
};

export function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activities?limit=8")
      .then((r) => r.json())
      .then((data) => setActivities(data.activities || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Recent Activities</h3>
          <p className="text-xs text-slate-500 mt-0.5">Latest team actions</p>
        </div>
        <Link href="/activities" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
          View all
        </Link>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="h-8 w-8 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-slate-200 rounded w-3/4" />
                <div className="h-2.5 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-6">No activities yet</p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => {
            const typeInfo = typeIcons[activity.type] || typeIcons.note;
            const Icon = typeInfo.icon;
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`p-1.5 rounded-lg ${typeInfo.bg} flex-shrink-0`}>
                  <Icon className={`h-3.5 w-3.5 ${typeInfo.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-900 truncate">{activity.title}</p>
                  {activity.contact && (
                    <p className="text-xs text-slate-500">
                      {activity.contact.firstName} {activity.contact.lastName}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-slate-400 flex-shrink-0">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs">{formatRelativeTime(activity.createdAt)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
