import React, { useEffect, useState } from "react";

export type PurchasingLine = {
  id: string;
  tourCode: string;
  description: string;
  type: string;
  date?: string; // YYYY-MM-DD
  assignedTo: string;
  status: string;
  totalPrice: number | "";
};

interface Props {
  open: boolean;
  initial?: PurchasingLine | null;
  onSave: (line: PurchasingLine) => void;
  onRemove?: (id: string) => void;
  onClose: () => void;
}

const emptyLine: PurchasingLine = {
  id: "",
  tourCode: "",
  description: "",
  type: "",
  date: "",
  assignedTo: "",
  status: "",
  totalPrice: ""
};

const PurchasingLineModal: React.FC<Props> = ({ open, initial, onSave, onRemove, onClose }) => {
  const [draft, setDraft] = useState<PurchasingLine>(emptyLine);

  useEffect(() => {
    if (open) {
      setDraft(
        initial
          ? { ...initial }
          : {
              ...emptyLine,
              id: crypto.randomUUID()
            }
      );
    }
  }, [open, initial]);

  if (!open) return null;

  const update = <K extends keyof PurchasingLine>(k: K, v: PurchasingLine[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
  };

  const handleSave = () => {
    onSave({ ...draft });
    onClose();
  };

  const handleRemove = () => {
    if (draft.id && onRemove) onRemove(draft.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-start justify-center p-4" role="dialog" aria-modal="true">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-semibold">{initial ? "Edit Line" : "New Line"}</h3>
          <div className="flex items-center gap-2">
            {initial && onRemove && (
              <button className="px-3 py-1 rounded border text-red-600" onClick={handleRemove}>
                Remove
              </button>
            )}
            <button className="px-3 py-1 rounded border" onClick={onClose}>
              Cancel
            </button>
            <button className="px-3 py-1 rounded bg-indigo-600 text-white" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Labeled label="Tour Code">
              <input className="w-full border rounded px-2 py-1" value={draft.tourCode} onChange={(e) => update("tourCode", e.target.value)} />
            </Labeled>
            <Labeled label="Type">
              <input className="w-full border rounded px-2 py-1" value={draft.type} onChange={(e) => update("type", e.target.value)} />
            </Labeled>
            <Labeled label="Description">
              <input className="w-full border rounded px-2 py-1" value={draft.description} onChange={(e) => update("description", e.target.value)} />
            </Labeled>
            <Labeled label="Date">
              <input type="date" className="w-full border rounded px-2 py-1" value={draft.date || ""} onChange={(e) => update("date", e.target.value)} />
            </Labeled>
            <Labeled label="Assigned To">
              <input className="w-full border rounded px-2 py-1" value={draft.assignedTo} onChange={(e) => update("assignedTo", e.target.value)} />
            </Labeled>
            <Labeled label="Status">
              <input className="w-full border rounded px-2 py-1" value={draft.status} onChange={(e) => update("status", e.target.value)} />
            </Labeled>
            <Labeled label="Total Price">
              <input
                type="number"
                className="w-full border rounded px-2 py-1"
                value={draft.totalPrice}
                onChange={(e) => update("totalPrice", e.target.value === "" ? "" : Number(e.target.value))}
              />
            </Labeled>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasingLineModal;

const Labeled: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="block">
    <div className="text-sm mb-1 font-medium">{label}</div>
    {children}
  </label>
);