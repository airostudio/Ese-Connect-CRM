"use client";
import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { formatCurrency, isRottingDeal, calculateDaysInStage } from "@/lib/utils";
import { AlertCircle, Plus, DollarSign } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  lastActivityAt: string;
  healthScore: number;
  contact?: { firstName: string; lastName: string } | null;
  company?: { name: string } | null;
}

const STAGES = [
  { key: "lead", label: "Lead", color: "bg-blue-500", light: "bg-blue-50", border: "border-blue-200" },
  { key: "qualified", label: "Qualified", color: "bg-violet-500", light: "bg-violet-50", border: "border-violet-200" },
  { key: "proposal", label: "Proposal", color: "bg-amber-500", light: "bg-amber-50", border: "border-amber-200" },
  { key: "negotiation", label: "Negotiation", color: "bg-orange-500", light: "bg-orange-50", border: "border-orange-200" },
  { key: "closed won", label: "Closed Won", color: "bg-emerald-500", light: "bg-emerald-50", border: "border-emerald-200" },
  { key: "closed lost", label: "Closed Lost", color: "bg-rose-500", light: "bg-rose-50", border: "border-rose-200" },
];

function DealCard({ deal, isDragging = false }: { deal: Deal; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: deal.id });
  const rotting = isRottingDeal(deal.lastActivityAt);
  const daysInStage = calculateDaysInStage(deal.lastActivityAt);

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white rounded-xl border p-3.5 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all select-none ${
        isDragging ? "opacity-50 rotate-2 shadow-lg" : ""
      } ${rotting ? "border-rose-300 bg-rose-50/30" : "border-slate-200 hover:border-indigo-200"}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <Link
          href={`/deals/${deal.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-sm font-semibold text-slate-900 hover:text-indigo-600 leading-snug flex-1"
        >
          {deal.title}
        </Link>
        {rotting && <AlertCircle className="h-3.5 w-3.5 text-rose-500 flex-shrink-0 mt-0.5" />}
      </div>

      {deal.contact && (
        <p className="text-xs text-slate-500 mb-2">
          {deal.contact.firstName} {deal.contact.lastName}
          {deal.company && ` · ${deal.company.name}`}
        </p>
      )}

      <div className="flex items-center justify-between mt-2">
        <span className="text-sm font-bold text-slate-900">{formatCurrency(deal.value)}</span>
        <div className="flex items-center gap-1.5">
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
            deal.healthScore >= 70 ? "bg-emerald-100 text-emerald-700" :
            deal.healthScore >= 40 ? "bg-amber-100 text-amber-700" :
            "bg-rose-100 text-rose-700"
          }`}>{deal.healthScore}</span>
          <span className="text-xs text-slate-400">{deal.probability}%</span>
        </div>
      </div>

      {rotting && (
        <div className="mt-2 pt-2 border-t border-rose-100">
          <p className="text-xs text-rose-600">{daysInStage}d idle</p>
        </div>
      )}
    </div>
  );
}

function DroppableColumn({
  stage,
  deals,
}: {
  stage: typeof STAGES[0];
  deals: Deal[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.key });
  const total = deals.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex flex-col min-w-64 w-64 flex-shrink-0">
      {/* Column Header */}
      <div className={`rounded-xl border p-3 mb-3 ${stage.light} ${stage.border}`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />
            <span className="text-xs font-semibold text-slate-700">{stage.label}</span>
          </div>
          <span className="text-xs bg-white px-1.5 py-0.5 rounded-full font-medium text-slate-600 shadow-sm border border-slate-100">
            {deals.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="h-3 w-3 text-slate-400" />
          <span className="text-xs font-medium text-slate-600">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Cards */}
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2.5 min-h-32 rounded-xl transition-colors p-1 ${isOver ? "bg-indigo-50/50" : ""}`}
      >
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
        {deals.length === 0 && (
          <div className="h-20 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center">
            <p className="text-xs text-slate-400">Drop deals here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => {
    fetch("/api/deals?limit=100")
      .then((r) => r.json())
      .then((data) => setDeals(data.deals || []))
      .finally(() => setLoading(false));
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const deal = deals.find((d) => d.id === event.active.id);
    setActiveDeal(deal || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDeal(null);

    if (!over) return;

    const dealId = active.id as string;
    const newStage = over.id as string;
    const deal = deals.find((d) => d.id === dealId);

    if (!deal || deal.stage === newStage) return;

    // Optimistic update
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d))
    );

    const probMap: Record<string, number> = {
      lead: 10, qualified: 30, proposal: 50, negotiation: 75, "closed won": 100, "closed lost": 0,
    };

    try {
      await fetch(`/api/deals/${dealId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage, probability: probMap[newStage] }),
      });
      toast.success(`Deal moved to ${newStage}`);
    } catch {
      // Revert
      setDeals((prev) =>
        prev.map((d) => (d.id === dealId ? { ...d, stage: deal.stage } : d))
      );
      toast.error("Failed to update deal");
    }
  };

  const getDealsByStage = (stageKey: string) =>
    deals.filter((d) => d.stage === stageKey);

  const totalPipelineValue = deals
    .filter((d) => !["closed won", "closed lost"].includes(d.stage))
    .reduce((s, d) => s + d.value, 0);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-slate-200 rounded w-48 animate-pulse" />
        <div className="flex gap-4 overflow-hidden">
          {STAGES.map((s) => (
            <div key={s.key} className="w-64 flex-shrink-0 h-96 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Sales Pipeline</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {deals.filter((d) => !["closed won", "closed lost"].includes(d.stage)).length} active deals · {formatCurrency(totalPipelineValue)} total
          </p>
        </div>
        <Link href="/deals">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Plus className="h-4 w-4" /> Add Deal
          </button>
        </Link>
      </div>

      {/* Kanban Board */}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
          {STAGES.map((stage) => (
            <DroppableColumn
              key={stage.key}
              stage={stage}
              deals={getDealsByStage(stage.key)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeDeal && (
            <div className="w-64 opacity-95 rotate-3 shadow-2xl">
              <div className="bg-white rounded-xl border border-indigo-300 p-3.5">
                <p className="text-sm font-semibold text-slate-900">{activeDeal.title}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {activeDeal.contact ? `${activeDeal.contact.firstName} ${activeDeal.contact.lastName}` : ""}
                </p>
                <p className="text-sm font-bold text-indigo-600 mt-2">{formatCurrency(activeDeal.value)}</p>
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
