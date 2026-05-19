"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Calendar, CheckSquare, Clock, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { formatDate, getPriorityColor } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: string;
  status: string;
  assignee?: { name: string } | null;
  contact?: { firstName: string; lastName: string } | null;
  deal?: { title: string } | null;
}

const filterTabs = [
  { key: "all", label: "All Tasks", icon: CheckSquare },
  { key: "today", label: "Today", icon: Clock },
  { key: "overdue", label: "Overdue", icon: AlertCircle },
  { key: "upcoming", label: "Upcoming", icon: Calendar },
  { key: "completed", label: "Completed", icon: CheckSquare },
];

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "", description: "", dueDate: "", priority: "medium",
  });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/tasks?filter=${filter}`);
    const data = await res.json();
    setTasks(data.tasks || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Task created!");
      setShowForm(false);
      setFormData({ title: "", description: "", dueDate: "", priority: "medium" });
      fetchTasks();
    } catch {
      toast.error("Failed to create task");
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    await fetch(`/api/tasks?id=${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );
  };

  const isOverdue = (task: Task) =>
    task.dueDate && task.status !== "completed" && new Date(task.dueDate) < new Date();

  const getPriorityBadgeVariant = (priority: string): "default" | "warning" | "danger" | "success" | "info" | "purple" => {
    const map: Record<string, "default" | "warning" | "danger" | "success" | "info" | "purple"> = {
      low: "default",
      medium: "warning",
      high: "info",
      urgent: "danger",
    };
    return map[priority] || "default";
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Tasks</h2>
          <p className="text-xs text-slate-500 mt-0.5">{tasks.length} tasks</p>
        </div>
        <Button onClick={() => setShowForm(true)} icon={<Plus className="h-4 w-4" />}>New Task</Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1 overflow-x-auto">
        {filterTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === tab.key ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-64" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => {
            const overdue = isOverdue(task);
            return (
              <div
                key={task.id}
                className={`bg-white rounded-xl border p-4 flex items-start gap-4 transition-all ${
                  overdue ? "border-rose-200 bg-rose-50/20" : "border-slate-200 hover:border-indigo-200"
                } ${task.status === "completed" ? "opacity-60" : ""}`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => handleComplete(task)}
                  className={`flex-shrink-0 mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.status === "completed"
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-slate-300 hover:border-indigo-400"
                  }`}
                >
                  {task.status === "completed" && (
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${task.status === "completed" ? "line-through text-slate-400" : "text-slate-900"}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={getPriorityBadgeVariant(task.priority)}>{task.priority}</Badge>
                      {overdue && (
                        <Badge variant="danger">Overdue</Badge>
                      )}
                    </div>
                  </div>
                  {task.description && (
                    <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    {task.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <span className={`text-xs ${overdue ? "text-rose-600 font-medium" : "text-slate-500"}`}>
                          {formatDate(task.dueDate)}
                        </span>
                      </div>
                    )}
                    {task.contact && (
                      <span className="text-xs text-slate-500">
                        {task.contact.firstName} {task.contact.lastName}
                      </span>
                    )}
                    {task.deal && (
                      <span className="text-xs text-indigo-600">{task.deal.title}</span>
                    )}
                    {task.assignee && (
                      <span className="text-xs text-slate-500">→ {task.assignee.name}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {tasks.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <CheckSquare className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No tasks found</p>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Create New Task">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Task Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required placeholder="Follow up with client" />
          <Textarea label="Description (optional)" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="Additional details..." />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Due Date" type="datetime-local" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
            <Select label="Priority" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} options={priorityOptions} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saving} className="flex-1">Create Task</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
