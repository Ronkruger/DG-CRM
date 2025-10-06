import React, { useMemo, useState } from "react";
import { STATUS_STEPS, type Status } from "./StatusTabs";

export interface PayableItem {
  id: string;
  name: string;
  status: Status;
  createdAt: string;        // date/time string
  paymentDeadline?: string; // date/time string
  category?: string;
  supplier?: string;
  total?: number;
  paid?: number;
  balance?: number;
  currency?: string;        // e.g., "USD", "PHP"
  travelDate?: string;      // "MM/DD/YYYY - MM/DD/YYYY"
  note?: string;            // e.g., "New", "Done", "Partially Paid"
}

interface KanbanBoardProps {
  items: PayableItem[];
  filterText?: string;
  onMove: (id: string, toStatus: Status) => void;
  onAdd?: (status: Status) => void;
  onOpen?: (id: string) => void; // open modal for given id
}

const colWidth = "w-[22rem]";

const KanbanBoard: React.FC<KanbanBoardProps> = ({ items, filterText = "", onMove, onAdd, onOpen }) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const f = filterText.trim().toLowerCase();
    const filtered = f
      ? items.filter((it) => (it.name + " " + (it.category || "") + " " + (it.supplier || "")).toLowerCase().includes(f))
      : items;

    const map = new Map<Status, PayableItem[]>();
    STATUS_STEPS.forEach((s) => map.set(s, []));
    filtered.forEach((it) => {
      if (!map.has(it.status)) map.set(it.status, []);
      map.get(it.status)!.push(it);
    });
    return map;
  }, [items, filterText]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    const id = (e.dataTransfer.getData("text/plain") || draggingId) as string;
    if (id) onMove(id, status);
    setDraggingId(null);
  };

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-flow-col auto-cols-max gap-3 pb-6">
        {STATUS_STEPS.map((status) => {
          const list = grouped.get(status) || [];
          const colTotal = list.reduce((sum, x) => sum + (x.total || 0), 0);

          return (
            <section
              key={status}
              className={`${colWidth} bg-white rounded shadow border border-gray-200 flex flex-col`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              <div className="px-3 py-2 border-b flex items-center gap-2">
                <div className="font-semibold text-gray-800">{status}</div>
                <div className="ml-auto flex items-center gap-2">
                  <div className="hidden sm:block w-24 h-2 rounded bg-gray-200 overflow-hidden">
                    <div className="h-2 bg-green-500" style={{ width: `${Math.min(100, (list.length / 10) * 100)}%` }} />
                  </div>
                  <button
                    className="text-gray-500 hover:text-gray-800"
                    title="Add new in this column"
                    onClick={() => onAdd?.(status)}
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="px-3 pt-2 text-xs text-gray-500">
                Total: {colTotal.toLocaleString(undefined, { style: "currency", currency: (list[0]?.currency || "USD") })}
              </div>

              <div className="p-2 space-y-2 overflow-y-auto max-h-[70vh]">
                {list.map((card) => (
                  <article
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card.id)}
                    onClick={() => onOpen?.(card.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && onOpen?.(card.id)}
                    className="border rounded bg-white hover:bg-gray-50 cursor-pointer active:cursor-grabbing p-3 text-sm select-none"
                    aria-label={`Open ${card.name}`}
                  >
                    <div className="flex items-start gap-2">
                      <span title="star" className="text-yellow-500">★</span>
                      <div className="font-medium leading-snug">{card.name}</div>
                    </div>

                    {card.note && <div className="italic text-gray-700 mt-1">{card.note}</div>}

                    <div className="mt-2 text-[12px] space-y-1">
                      {card.createdAt && <div className="text-gray-600">{card.createdAt}</div>}
                      <div className="space-x-2">
                        <span className="text-blue-600">0.00</span>
                        <span className="text-red-600">0.00</span>
                      </div>
                      {card.paymentDeadline && (
                        <div className="text-red-600">Due: {card.paymentDeadline}</div>
                      )}
                    </div>

                    <div className="mt-2 text-[12px] space-y-1">
                      {typeof card.total === "number" && (
                        <div className="text-gray-800">
                          {formatMoney(card.total, card.currency)} <span className="text-gray-500">Total</span>
                        </div>
                      )}
                      {typeof card.paid === "number" && (
                        <div className="text-blue-700">
                          {formatMoney(card.paid, card.currency)} <span className="text-gray-500">Paid</span>
                        </div>
                      )}
                      {typeof card.balance === "number" && (
                        <div className="text-red-600">
                          {formatMoney(card.balance, card.currency)} <span className="text-gray-500">Balance</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-end gap-3 text-gray-400">
                      <span title="attachment">📎</span>
                      <span title="note">📝</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;

function formatMoney(v?: number, currency = "USD") {
  return (v ?? 0).toLocaleString(undefined, { style: "currency", currency });
}