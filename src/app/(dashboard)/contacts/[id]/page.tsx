"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Mail, Building2, MapPin, Tag, Edit3, Trash2, Plus, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { formatDate, formatRelativeTime, getStatusColor, getHealthScoreColor } from "@/lib/utils";
import Link from "next/link";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  title?: string;
  company?: string;
  status: string;
  leadScore: number;
  tags: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  owner?: { name: string; email: string } | null;
  deals: Array<{ id: string; title: string; value: number; stage: string; probability: number }>;
  tasks: Array<{ id: string; title: string; priority: string; status: string; dueDate?: string }>;
  activities: Array<{ id: string; type: string; title: string; description?: string; createdAt: string }>;
  notes: Array<{ id: string; content: string; createdAt: string }>;
}

const activityTypeColors: Record<string, string> = {
  call: "bg-blue-100 text-blue-700",
  email: "bg-violet-100 text-violet-700",
  meeting: "bg-emerald-100 text-emerald-700",
  note: "bg-amber-100 text-amber-700",
  task: "bg-indigo-100 text-indigo-700",
};

export default function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("activities");
  const [showNote, setShowNote] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    fetch(`/api/contacts/${id}`)
      .then((r) => r.json())
      .then((data) => setContact(data.contact))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this contact?")) return;
    await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    toast.success("Contact deleted");
    router.push("/contacts");
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingNote(true);
    try {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: noteContent, contactId: id }),
      });
      toast.success("Note added");
      setShowNote(false);
      setNoteContent("");
      // Refresh
      const res = await fetch(`/api/contacts/${id}`);
      const data = await res.json();
      setContact(data.contact);
    } catch {
      toast.error("Failed to add note");
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-48" />
        <div className="h-48 bg-slate-200 rounded-xl" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Contact not found</p>
        <Link href="/contacts" className="text-indigo-600 text-sm mt-2 inline-block">Go back</Link>
      </div>
    );
  }

  const tags = JSON.parse(contact.tags || "[]") as string[];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" />
          Back to Contacts
        </button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Edit3 className="h-3.5 w-3.5" />}>Edit</Button>
          <Button variant="danger" size="sm" onClick={handleDelete} icon={<Trash2 className="h-3.5 w-3.5" />}>Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left: Profile Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex flex-col items-center text-center mb-5">
              <Avatar name={`${contact.firstName} ${contact.lastName}`} size="xl" className="mb-3" />
              <h2 className="text-lg font-bold text-slate-900">{contact.firstName} {contact.lastName}</h2>
              <p className="text-sm text-slate-500">{contact.title}</p>
              <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                {contact.status}
              </span>
            </div>

            {/* Lead Score */}
            <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-600">AI Lead Score</span>
                <span className={`text-lg font-bold ${getHealthScoreColor(contact.leadScore)}`}>
                  {contact.leadScore}
                </span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                  style={{ width: `${contact.leadScore}%` }}
                />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              {contact.email && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <a href={`mailto:${contact.email}`} className="text-indigo-600 hover:underline truncate">{contact.email}</a>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-700">{contact.phone}</span>
                </div>
              )}
              {contact.company && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Building2 className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-700">{contact.company}</span>
                </div>
              )}
              {contact.address && (
                <div className="flex items-start gap-2.5 text-sm">
                  <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{contact.address}</span>
                </div>
              )}
              {contact.owner && (
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="h-4 w-4 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-600 text-[8px] font-bold">O</span>
                  </div>
                  <span className="text-slate-700">{contact.owner.name}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <Tag className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs font-medium text-slate-500">Tags</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="info">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Deals */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Associated Deals</h3>
            {contact.deals.length === 0 ? (
              <p className="text-xs text-slate-500">No deals yet</p>
            ) : (
              <div className="space-y-2">
                {contact.deals.map((deal) => (
                  <Link key={deal.id} href={`/deals/${deal.id}`} className="block p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50 transition-colors">
                    <p className="text-xs font-medium text-slate-900">{deal.title}</p>
                    <p className="text-xs text-slate-500">${deal.value.toLocaleString()} · {deal.probability}%</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Tabs */}
        <div className="xl:col-span-2 space-y-4">
          {/* Tab Nav */}
          <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1">
            {["activities", "notes", "tasks"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors capitalize ${
                  activeTab === tab ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Activities */}
          {activeTab === "activities" && (
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900">Activity Timeline</h3>
              </div>
              <div className="p-5 space-y-4">
                {contact.activities.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No activities yet</p>
                ) : (
                  contact.activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${activityTypeColors[activity.type] || "bg-gray-100 text-gray-700"}`}>
                          {activity.type}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                        {activity.description && (
                          <p className="text-xs text-slate-500 mt-0.5">{activity.description}</p>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 flex-shrink-0">{formatRelativeTime(activity.createdAt)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {activeTab === "notes" && (
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Notes</h3>
                <Button size="sm" onClick={() => setShowNote(true)} icon={<Plus className="h-3.5 w-3.5" />}>Add Note</Button>
              </div>
              <div className="p-5 space-y-3">
                {contact.notes.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No notes yet</p>
                ) : (
                  contact.notes.map((note) => (
                    <div key={note.id} className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                      <p className="text-sm text-slate-800 whitespace-pre-wrap">{note.content}</p>
                      <p className="text-xs text-amber-600 mt-2">{formatDate(note.createdAt)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tasks */}
          {activeTab === "tasks" && (
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900">Tasks</h3>
              </div>
              <div className="p-5 space-y-2">
                {contact.tasks.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No tasks yet</p>
                ) : (
                  contact.tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50">
                      <div className={`h-2 w-2 rounded-full ${task.status === "completed" ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${task.status === "completed" ? "line-through text-slate-400" : "text-slate-900"}`}>
                          {task.title}
                        </p>
                        {task.dueDate && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            <p className="text-xs text-slate-500">{formatDate(task.dueDate)}</p>
                          </div>
                        )}
                      </div>
                      <Badge variant={task.priority === "urgent" ? "danger" : task.priority === "high" ? "warning" : "default"}>
                        {task.priority}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Note Modal */}
      <Modal isOpen={showNote} onClose={() => setShowNote(false)} title="Add Note">
        <form onSubmit={handleAddNote} className="space-y-4">
          <Textarea
            label="Note"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            rows={5}
            placeholder="Write your note here..."
            required
          />
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setShowNote(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={savingNote} className="flex-1">Save Note</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
