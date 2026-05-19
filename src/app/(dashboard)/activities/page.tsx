"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Phone, Mail, Users, FileText, CheckSquare } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatRelativeTime, formatDate } from "@/lib/utils";

interface Activity {
  id: string;
  type: string;
  title: string;
  description?: string;
  createdAt: string;
  user?: { name: string } | null;
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

const typeOptions = [
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
  { value: "note", label: "Note" },
  { value: "task", label: "Task" },
];

const filterOptions = [
  { value: "", label: "All Activities" },
  { value: "call", label: "Calls" },
  { value: "email", label: "Emails" },
  { value: "meeting", label: "Meetings" },
  { value: "note", label: "Notes" },
];

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    type: "call", title: "", description: "",
  });

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "50" });
    if (typeFilter) params.set("type", typeFilter);
    const res = await fetch(`/api/activities?${params}`);
    const data = await res.json();
    setActivities(data.activities || []);
    setLoading(false);
  }, [typeFilter]);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      toast.success("Activity logged!");
      setShowForm(false);
      setFormData({ type: "call", title: "", description: "" });
      fetchActivities();
    } catch {
      toast.error("Failed to log activity");
    } finally {
      setSaving(false);
    }
  };

  // Group by date
  const grouped = activities.reduce<Record<string, Activity[]>>((acc, activity) => {
    const date = new Date(activity.createdAt).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(activity);
    return acc;
  }, {});

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Activities</h2>
          <p className="text-xs text-slate-500 mt-0.5">{activities.length} recent activities</p>
        </div>
        <Button onClick={() => setShowForm(true)} icon={<Plus className="h-4 w-4" />}>Log Activity</Button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setTypeFilter(opt.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              typeFilter === opt.value ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-slate-200 rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                {new Date(date).toDateString() === new Date().toDateString() ? "Today" :
                 new Date(date).toDateString() === new Date(Date.now() - 86400000).toDateString() ? "Yesterday" :
                 formatDate(date)}
              </p>
              <div className="relative pl-8">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200" />
                <div className="space-y-4">
                  {items.map((activity) => {
                    const typeInfo = typeIcons[activity.type] || typeIcons.note;
                    const Icon = typeInfo.icon;
                    return (
                      <div key={activity.id} className="relative flex items-start gap-4">
                        <div className={`absolute -left-5 p-2 rounded-full ${typeInfo.bg} border-2 border-white shadow-sm`}>
                          <Icon className={`h-3.5 w-3.5 ${typeInfo.color}`} />
                        </div>
                        <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4 hover:border-indigo-200 transition-colors">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                              {activity.description && (
                                <p className="text-xs text-slate-500 mt-1">{activity.description}</p>
                              )}
                              <div className="flex items-center gap-3 mt-2">
                                {activity.contact && (
                                  <span className="text-xs text-indigo-600">
                                    {activity.contact.firstName} {activity.contact.lastName}
                                  </span>
                                )}
                                {activity.deal && (
                                  <span className="text-xs text-violet-600">{activity.deal.title}</span>
                                )}
                                {activity.user && (
                                  <span className="text-xs text-slate-400">by {activity.user.name}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${typeInfo.bg} ${typeInfo.color}`}>
                                {activity.type}
                              </span>
                              <span className="text-xs text-slate-400">{formatRelativeTime(activity.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <p className="text-sm text-slate-500">No activities logged yet</p>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Log Activity">
        <form onSubmit={handleCreate} className="space-y-4">
          <Select label="Activity Type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} options={typeOptions} />
          <Input label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required placeholder="Discovery call with CEO" />
          <Textarea label="Description (optional)" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="What was discussed..." />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saving} className="flex-1">Log Activity</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
