import React, { useMemo, useState } from "react";

export type TransactionRow = {
  id: string;
  type: string;
  description: string;
  tourCode: string;
  date?: string; // YYYY-MM-DD
  assignedTo?: string;
  status?: string;
  totalPrice?: number;
};

interface Props {
  open: boolean;
  rows: TransactionRow[];
  onClose: () => void;
  onSelect: (selected: TransactionRow[]) => void;
  onNew: () => void; // open line editor for new record
}

const SelectTransactionsModal: React.FC<Props> = ({ open, rows, onClose, onSelect, onNew }) => {
  const [query, setQuery] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => (r.type + " " + r.description + " " + r.tourCode + " " + (r.assignedTo || "")).toLowerCase().includes(q));
  }, [rows, query]);

  if (!open) return null;

  const toggle = (id: string) => setChecked((c) => ({ ...c, [id]: !c[id] }));

  const handleSelect = () => {
    const selected = filtered.filter((r) => checked[r.id]);
    onSelect(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[55] bg-black/40 flex items-start justify-center p-4" role="dialog" aria-modal="true">
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-lg overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-semibold">Add: Daily Transaction</h3>
          <button className="text-xl" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="px-4 py-2 border-b">
          <div className="flex items-center gap-2">
            <input
              type="search"
              placeholder="Search..."
              className="border rounded px-3 py-2 w-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="px-2 py-2 rounded border">▾</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 border-b">
              <tr className="text-left">
                <th className="p-2 w-10"></th>
                <th className="p-2">Type</th>
                <th className="p-2">Description</th>
                <th className="p-2">Tour Code</th>
                <th className="p-2">Date</th>
                <th className="p-2">Assigned to</th>
                <th className="p-2">Status</th>
                <th className="p-2">Total Price</th>
                <th className="p-2 w-12 text-right">⇄</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-500">
                    <div className="text-lg font-semibold">No record found</div>
                    <div className="text-sm">Adjust your filters or create a new record.</div>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="p-2">
                      <input type="checkbox" checked={!!checked[r.id]} onChange={() => toggle(r.id)} />
                    </td>
                    <td className="p-2">{r.type}</td>
                    <td className="p-2">{r.description}</td>
                    <td className="p-2">{r.tourCode}</td>
                    <td className="p-2">{r.date || "-"}</td>
                    <td className="p-2">{r.assignedTo || "-"}</td>
                    <td className="p-2">{r.status || "-"}</td>
                    <td className="p-2">{typeof r.totalPrice === "number" ? r.totalPrice.toLocaleString() : "-"}</td>
                    <td className="p-2 text-right text-gray-400">⇄</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t flex items-center justify-end gap-2">
          <button className="px-3 py-1 rounded border" onClick={handleSelect} disabled={filtered.every((r) => !checked[r.id])}>
            Select
          </button>
          <button className="px-3 py-1 rounded bg-indigo-600 text-white" onClick={onNew}>
            New
          </button>
          <button className="px-3 py-1 rounded border" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectTransactionsModal;