"use client";
import { useState, useEffect } from "react";
import { Mail, Send, Inbox, FileText, Plus, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import toast from "react-hot-toast";

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
}

const mockEmails = [
  { id: "1", subject: "Follow-up on Enterprise License", to: "sarah.j@acme.com", status: "opened", sentAt: "2 hours ago" },
  { id: "2", subject: "Proposal for TechStart Inc", to: "mike.c@techstart.io", status: "sent", sentAt: "5 hours ago" },
  { id: "3", subject: "Introduction - Ese Connect CRM", to: "emma.w@globalfinance.com", status: "clicked", sentAt: "1 day ago" },
  { id: "4", subject: "Contract Review Meeting", to: "david.b@healthplus.com", status: "opened", sentAt: "2 days ago" },
  { id: "5", subject: "Q4 Partnership Opportunity", to: "lisa.d@retailmax.com", status: "sent", sentAt: "3 days ago" },
];

const statusColors: Record<string, string> = {
  sent: "bg-slate-100 text-slate-600",
  opened: "bg-blue-100 text-blue-700",
  clicked: "bg-emerald-100 text-emerald-700",
  bounced: "bg-rose-100 text-rose-700",
};

export default function EmailsPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeTab, setActiveTab] = useState("inbox");
  const [showCompose, setShowCompose] = useState(false);
  const [showTemplateDetail, setShowTemplateDetail] = useState<Template | null>(null);
  const [composeData, setComposeData] = useState({ to: "", subject: "", body: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("/api/email-templates")
      .then((r) => r.json())
      .then((data) => setTemplates(data.templates || []))
      .catch(() => {
        // Use placeholder templates if API not set up
        setTemplates([
          { id: "1", name: "Introduction Email", subject: "Introduction - Let's Connect", body: "Hi {{contact_name}},\n\nI hope this finds you well...", category: "outreach" },
          { id: "2", name: "Follow-up Template", subject: "Following up on our conversation", body: "Hi {{contact_name}},\n\nWanted to follow up...", category: "follow-up" },
          { id: "3", name: "Proposal Email", subject: "Proposal for {{contact_company}}", body: "Dear {{contact_name}},\n\nThank you for the opportunity...", category: "proposal" },
          { id: "4", name: "Thank You Email", subject: "Thank you for your business!", body: "Hi {{contact_name}},\n\nThank you for choosing us...", category: "post-sale" },
        ]);
      });
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Email sent successfully!");
    setShowCompose(false);
    setSending(false);
  };

  const categoryColors: Record<string, string> = {
    outreach: "bg-blue-100 text-blue-700",
    "follow-up": "bg-violet-100 text-violet-700",
    proposal: "bg-amber-100 text-amber-700",
    "post-sale": "bg-emerald-100 text-emerald-700",
    general: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Email</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage email outreach and templates</p>
        </div>
        <Button onClick={() => setShowCompose(true)} icon={<Send className="h-4 w-4" />}>Compose Email</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Sent Today", value: "12", icon: Send, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Open Rate", value: "68%", icon: Eye, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Templates", value: String(templates.length), icon: FileText, color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Awaiting Reply", value: "5", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`${stat.bg} rounded-xl p-4`}>
              <Icon className={`h-5 w-5 ${stat.color} mb-2`} />
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-600 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1">
        {[
          { key: "inbox", label: "Sent Emails", icon: Inbox },
          { key: "templates", label: "Templates", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Sent Emails */}
      {activeTab === "inbox" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Subject</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">To</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Sent</th>
              </tr>
            </thead>
            <tbody>
              {mockEmails.map((email, i) => (
                <tr key={email.id} className={`border-b border-slate-50 hover:bg-slate-50 ${i % 2 === 0 ? "" : "bg-slate-50/30"}`}>
                  <td className="px-6 py-3.5 text-sm font-medium text-slate-900">{email.subject}</td>
                  <td className="px-6 py-3.5 text-sm text-slate-600">{email.to}</td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[email.status] || statusColors.sent}`}>
                      {email.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-slate-500">{email.sentAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Templates */}
      {activeTab === "templates" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-indigo-200 cursor-pointer transition-all"
              onClick={() => setShowTemplateDetail(template)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-violet-600" />
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[template.category] || categoryColors.general}`}>
                  {template.category}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-900">{template.name}</h3>
              <p className="text-xs text-slate-500 mt-1 truncate">{template.subject}</p>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">{template.body}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setComposeData({ to: "", subject: template.subject, body: template.body });
                  setShowCompose(true);
                }}
                className="mt-3 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Use Template →
              </button>
            </div>
          ))}
          <div
            className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all"
            onClick={() => toast("Template creation coming soon!")}
          >
            <Plus className="h-6 w-6 text-slate-400" />
            <p className="text-sm text-slate-500 font-medium">New Template</p>
          </div>
        </div>
      )}

      {/* Compose Modal */}
      <Modal isOpen={showCompose} onClose={() => setShowCompose(false)} title="Compose Email" size="lg">
        <form onSubmit={handleSend} className="space-y-4">
          <Input label="To" type="email" value={composeData.to} onChange={(e) => setComposeData({ ...composeData, to: e.target.value })} required placeholder="recipient@company.com" />
          <Input label="Subject" value={composeData.subject} onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })} required placeholder="Email subject" />
          <Textarea label="Body" value={composeData.body} onChange={(e) => setComposeData({ ...composeData, body: e.target.value })} rows={10} placeholder="Write your email..." required />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowCompose(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={sending} icon={<Send className="h-4 w-4" />} className="flex-1">Send Email</Button>
          </div>
        </form>
      </Modal>

      {/* Template Detail Modal */}
      <Modal isOpen={!!showTemplateDetail} onClose={() => setShowTemplateDetail(null)} title={showTemplateDetail?.name || ""} size="lg">
        {showTemplateDetail && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Subject</p>
              <p className="text-sm font-medium text-slate-900 p-3 bg-slate-50 rounded-lg">{showTemplateDetail.subject}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Body</p>
              <pre className="text-sm text-slate-700 p-3 bg-slate-50 rounded-lg whitespace-pre-wrap font-sans">{showTemplateDetail.body}</pre>
            </div>
            <Button
              onClick={() => {
                setComposeData({ to: "", subject: showTemplateDetail.subject, body: showTemplateDetail.body });
                setShowTemplateDetail(null);
                setShowCompose(true);
              }}
              className="w-full"
            >
              Use This Template
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
