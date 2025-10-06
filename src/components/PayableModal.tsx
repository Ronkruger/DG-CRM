import React, { useEffect, useMemo, useRef, useState } from "react";
import { type Status, STATUS_STEPS } from "./StatusTabs";
import PurchasingLineModal, { type PurchasingLine } from "./PurchasingLineModal";
import SelectTransactionsModal, { type TransactionRow } from "./SelectTransactionsModal";

export type PayableLine = PurchasingLine;

export type NewPayableForm = {
  name: string;
  dateCreated: string;
  dos: string;
  paymentDeadline: string;
  category: string;
  package: string;
  travelFrom: string;
  travelTo: string;
  totalAmount: number | "";
  amountPaid: number | "";
  status: Status;
  currency: string;
  datePayable: string;
  details: string;
  invoiceFile?: File | null;
  invoiceNumber: string;
  requestedBy: string;
  approvers: string;
  supplier: {
    paymentMode: string;
    creditCardLink: string;
    bank: string;
    bankAccountName: string;
    accountNo: string;
  };
  lines: PayableLine[];
};

// eslint-disable-next-line react-refresh/only-export-components
export const emptyPayableForm: NewPayableForm = {
  name: "",
  dateCreated: "",
  dos: "",
  paymentDeadline: "",
  category: "",
  package: "",
  travelFrom: "",
  travelTo: "",
  totalAmount: "",
  amountPaid: "",
  status: "New",
  currency: "USD",
  datePayable: "",
  details: "",
  invoiceFile: null,
  invoiceNumber: "",
  requestedBy: "",
  approvers: "",
  supplier: {
    paymentMode: "",
    creditCardLink: "",
    bank: "",
    bankAccountName: "",
    accountNo: ""
  },
  lines: []
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: NewPayableForm) => void;
  mode?: "create" | "edit";
  initial?: NewPayableForm | null;
}

type LogTab = "send" | "log" | "activities";

type LogAttachment = {
  id: string;
  name: string;
  url: string;     // object URL (local preview) or remote URL from backend
  mime?: string;
  revoke?: boolean; // revoke object URL on modal unmount
  size?: number;
};

type LogItem = {
  id: string;
  author: string;
  ts: string;
  content: string;
  type: "message" | "note" | "activity";
  attachments?: LogAttachment[];
};

const PayableModal: React.FC<Props> = ({ open, onClose, onSave, mode = "create", initial = null }) => {
  const [form, setForm] = useState<NewPayableForm>(initial ?? emptyPayableForm);

  // child modals
  const [showLineModal, setShowLineModal] = useState(false);
  const [editingLine, setEditingLine] = useState<PayableLine | null>(null);
  const [showSelectModal, setShowSelectModal] = useState(false);

  const [transactions] = useState<TransactionRow[]>([
    { id: crypto.randomUUID(), type: "Flight", description: "MNL-CDG", tourCode: "TC-001", date: "2025-10-12", assignedTo: "Alice", status: "Pending", totalPrice: 1010 },
    { id: crypto.randomUUID(), type: "Hotel", description: "Venice 3N", tourCode: "TC-044", date: "2025-10-15", assignedTo: "Bob", status: "Confirmed", totalPrice: 2210 },
    { id: crypto.randomUUID(), type: "Bus", description: "Apollo Tour", tourCode: "BUS-019", date: "2025-10-07", assignedTo: "Eve", status: "Partially Paid", totalPrice: 890 }
  ]);

  // Right log panel
  const [tab, setTab] = useState<LogTab>("send");
  const [logs, setLogs] = useState<LogItem[]>([
    { id: crypto.randomUUID(), author: "Mandy Junric Eliot", ts: "Today 6:57 PM", content: "Creating a new record…", type: "activity" }
  ]);

  // Composer state
  const [composeMsg, setComposeMsg] = useState("");
  const [composeNote, setComposeNote] = useState("");
  const [composeFiles, setComposeFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // PREVIEW object URLs for composer only (revoke when composer changes)
  const previewUrls = useMemo(() => {
    return composeFiles.map((f) => ({
      url: URL.createObjectURL(f),
      mime: f.type || "",
      name: f.name || "file",
      size: f.size
    }));
  }, [composeFiles]);

  useEffect(() => {
    // Revoke all preview URLs when composeFiles changes or on unmount
    return () => {
      previewUrls.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previewUrls]);

  // Re-initialize when opening
  useEffect(() => {
    if (open) {
      setForm(initial ?? emptyPayableForm);
      setComposeMsg("");
      setComposeNote("");
      setComposeFiles([]);
      setTab("send");
    }
  }, [open, initial]);

  // Revoke object URLs created for log attachments only when modal unmounts
  useEffect(() => {
    if (!open) return;
    return () => {
      logs.forEach((li) =>
        li.attachments?.forEach((a) => {
          if (a.revoke) URL.revokeObjectURL(a.url);
        })
      );
    };
  }, [open, logs]);

  const balance = useMemo(() => {
    const total = Number(form.totalAmount || 0);
    const paid = Number(form.amountPaid || 0);
    const b = total - paid;
    return isNaN(b) ? 0 : b;
  }, [form.totalAmount, form.amountPaid]);

  if (!open) return null;

  const creationMode = mode === "create";

  const update = <K extends keyof NewPayableForm>(k: K, v: NewPayableForm[K]) => setForm((f) => ({ ...f, [k]: v }));
  const updateSupplier = <K extends keyof NewPayableForm["supplier"]>(k: K, v: NewPayableForm["supplier"][K]) =>
    setForm((f) => ({ ...f, supplier: { ...f.supplier, [k]: v } }));

  const saveLine = (line: PayableLine) => {
    setForm((f) => {
      const i = f.lines.findIndex((l) => l.id === line.id);
      if (i >= 0) {
        const next = [...f.lines];
        next[i] = line;
        return { ...f, lines: next };
      }
      return { ...f, lines: [...f.lines, line] };
    });
  };
  const removeLine = (id: string) => setForm((f) => ({ ...f, lines: f.lines.filter((l) => l.id !== id) }));

  const handleSave = () => {
    const required = ["name", "dateCreated", "paymentDeadline", "status", "currency"] as const;
    const missing = required.filter((k) => {
      const v = form[k];
      return v === "" || v === null || v === undefined;
    });
    if (missing.length) {
      alert("Please fill required fields: " + missing.join(", "));
      return;
    }
    onSave({ ...form });
    onClose();
  };

  const addSelectedTransactions = (rows: TransactionRow[]) => {
    const mapped: PayableLine[] = rows.map((r) => ({
      id: crypto.randomUUID(),
      tourCode: r.tourCode,
      description: r.description,
      type: r.type,
      date: r.date,
      assignedTo: r.assignedTo || "",
      status: r.status || "",
      totalPrice: typeof r.totalPrice === "number" ? r.totalPrice : ""
    }));
    setForm((f) => ({ ...f, lines: [...f.lines, ...mapped] }));
  };

  const onPickFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setComposeFiles((prev) => [...prev, ...Array.from(files)]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const removeComposeFile = (idx: number) => {
    setComposeFiles((prev) => {
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });
  };

  // Create fresh object URLs for the LOG (distinct from preview URLs), revoke on modal unmount
  const addLog = (type: "message" | "note", text: string) => {
    const trimmed = text.trim();
    if (!trimmed && composeFiles.length === 0) return;

    const attachments: LogAttachment[] = composeFiles.map((f) => {
      const url = URL.createObjectURL(f);
      return {
        id: crypto.randomUUID(),
        name: f.name,
        url,
        mime: f.type || "",
        revoke: true,
        size: f.size
      };
    });

    setLogs((l) => [
      {
        id: crypto.randomUUID(),
        author: "You",
        ts: new Date().toLocaleString(),
        content: trimmed,
        type,
        attachments
      },
      ...l
    ]);

    // Clear composer (this revokes only preview URLs via effect)
    setComposeFiles([]);
    if (type === "message") setComposeMsg("");
    else setComposeNote("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="bg-white w-full max-w-[90vw] xl:max-w-7xl rounded-lg shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-xs bg-pink-100 text-pink-700 border border-pink-200">New</span>
            <h2 className="text-lg font-semibold">{creationMode ? "Create Payable" : "Edit Payable"}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded border" onClick={onClose}>Cancel</button>
            <button className="px-3 py-1 rounded bg-indigo-600 text-white" onClick={handleSave}>
              {creationMode ? "Save" : "Update"}
            </button>
          </div>
        </div>

        {/* Status pills */}
        <div className="px-4 py-2 border-b sticky top-0 bg-white z-10">
          <div className="overflow-x-auto">
            <div className="inline-flex whitespace-nowrap gap-2">
              {STATUS_STEPS.map((s) => {
                const isActive = form.status === s;
                const isDisabled = creationMode && s !== "New";
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => !isDisabled && update("status", s)}
                    className={
                      "px-3 py-1 rounded text-sm border transition " +
                      (isActive ? "bg-blue-600 text-white border-blue-600 " : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 ") +
                      (isDisabled ? "opacity-60 cursor-not-allowed " : "")
                    }
                    title={isDisabled ? "This status is disabled while creating" : s}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Split body */}
        <div className="flex-1 overflow-hidden flex">
          {/* LEFT: form */}
          <div className="flex-1 min-w-0 overflow-y-auto p-4 space-y-6">
            {/* Title */}
            <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Name..." className="w-full border rounded px-3 py-2 text-xl" />

            {/* Top grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Labeled label="Date Created" required>
                  <input type="date" className="w-full border rounded px-2 py-1" value={form.dateCreated} onChange={(e) => update("dateCreated", e.target.value)} />
                </Labeled>
                <Labeled label="DOS">
                  <input type="date" className="w-full border rounded px-2 py-1" value={form.dos} onChange={(e) => update("dos", e.target.value)} />
                </Labeled>
                <Labeled label="Payment Deadline" required>
                  <input type="date" className="w-full border rounded px-2 py-1" value={form.paymentDeadline} onChange={(e) => update("paymentDeadline", e.target.value)} />
                </Labeled>
               <Labeled label="Category">
  <input
    className="w-full border rounded px-2 py-1"
    value={form.category}
    onChange={(e) => update("category", e.target.value)}
  />
</Labeled>
                <Labeled label="Package">
                  <input className="w-full border rounded px-2 py-1" value={form.package} onChange={(e) => update("package", e.target.value)} />
                </Labeled>
                <Labeled label="Travel Date">
                  <div className="flex items-center gap-2">
                    <input type="date" className="flex-1 border rounded px-2 py-1" value={form.travelFrom} onChange={(e) => update("travelFrom", e.target.value)} />
                    <span>to</span>
                    <input type="date" className="flex-1 border rounded px-2 py-1" value={form.travelTo} onChange={(e) => update("travelTo", e.target.value)} />
                  </div>
                </Labeled>
              </div>

              <div className="space-y-3">
                <Labeled label="Total Amount">
                  <input type="number" className="w-full border rounded px-2 py-1" value={form.totalAmount} onChange={(e) => update("totalAmount", e.target.value === "" ? "" : Number(e.target.value))} />
                </Labeled>
                <Labeled label="Amount Paid">
                  <input type="number" className="w-full border rounded px-2 py-1" value={form.amountPaid} onChange={(e) => update("amountPaid", e.target.value === "" ? "" : Number(e.target.value))} />
                </Labeled>
                <Labeled label="Balance">
                  <input className="w-full border rounded px-2 py-1 bg-gray-50" value={balance} readOnly />
                </Labeled>
                <Labeled label="Status" required>
                  <select className="w-full border rounded px-2 py-1" value={form.status} onChange={(e) => update("status", e.target.value as Status)} disabled={creationMode}>
                    {STATUS_STEPS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Labeled>
                <Labeled label="Currency" required>
                  <select className="w-full border rounded px-2 py-1" value={form.currency} onChange={(e) => update("currency", e.target.value)}>
                    <option>USD</option><option>PHP</option><option>EUR</option>
                  </select>
                </Labeled>
                <Labeled label="Date Payable">
                  <input type="month" className="w-full border rounded px-2 py-1" value={form.datePayable} onChange={(e) => update("datePayable", e.target.value)} />
                </Labeled>
              </div>
            </div>

            {/* Details */}
            <Section title="Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Labeled label="Details">
                  <textarea className="w-full border rounded px-2 py-1" rows={3} value={form.details} onChange={(e) => update("details", e.target.value)} />
                </Labeled>
                <div className="grid grid-cols-2 gap-4">
                  <Labeled label="Requested By"><input className="w-full border rounded px-2 py-1" value={form.requestedBy} onChange={(e) => update("requestedBy", e.target.value)} /></Labeled>
                  <Labeled label="Approvers"><input className="w-full border rounded px-2 py-1" value={form.approvers} onChange={(e) => update("approvers", e.target.value)} /></Labeled>
                  <Labeled label="Invoice"><input type="file" className="block w-full text-sm" onChange={(e) => update("invoiceFile", e.target.files?.[0] || null)} /></Labeled>
                  <Labeled label="Invoice Number"><input className="w-full border rounded px-2 py-1" value={form.invoiceNumber} onChange={(e) => update("invoiceNumber", e.target.value)} /></Labeled>
                </div>
              </div>
            </Section>

            {/* Supplier Details */}
            <Section title="Supplier Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Labeled label="Payment Mode"><input className="w-full border rounded px-2 py-1" value={form.supplier.paymentMode} onChange={(e) => updateSupplier("paymentMode", e.target.value)} /></Labeled>
                <Labeled label="Credit Card Link"><input className="w-full border rounded px-2 py-1" value={form.supplier.creditCardLink} onChange={(e) => updateSupplier("creditCardLink", e.target.value)} /></Labeled>
                <Labeled label="Bank"><input className="w-full border rounded px-2 py-1" value={form.supplier.bank} onChange={(e) => updateSupplier("bank", e.target.value)} /></Labeled>
                <Labeled label="Bank Account Name"><input className="w-full border rounded px-2 py-1" value={form.supplier.bankAccountName} onChange={(e) => updateSupplier("bankAccountName", e.target.value)} /></Labeled>
                <Labeled label="Account No."><input className="w-full border rounded px-2 py-1" value={form.supplier.accountNo} onChange={(e) => updateSupplier("accountNo", e.target.value)} /></Labeled>
              </div>
            </Section>

            {/* Purchasing Details */}
            <Section title="Purchasing Details">
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-left">
                      <Th>Tour Code</Th><Th>Description</Th><Th>Type</Th><Th>Assigned To</Th><Th>Status</Th><Th>Total Price</Th><Th className="w-10 text-right">⇄</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.lines.length === 0 ? (
                      <tr><td colSpan={7} className="p-3 text-blue-700">
                        <button type="button" className="underline" onClick={() => setShowSelectModal(true)}>Add a line</button>
                      </td></tr>
                    ) : (
                      form.lines.map((l) => (
                        <tr key={l.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => { setEditingLine(l); setShowLineModal(true); }}>
                          <Td>{l.tourCode || "-"}</Td><Td>{l.description || "-"}</Td><Td>{l.type || "-"}</Td><Td>{l.assignedTo || "-"}</Td>
                          <Td>{l.status || "-"}</Td><Td>{l.totalPrice === "" ? "-" : Number(l.totalPrice).toLocaleString()}</Td>
                          <Td className="text-right text-gray-400">⋯</Td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {form.lines.length > 0 && (
                <button type="button" onClick={() => setShowSelectModal(true)} className="mt-3 px-3 py-1 rounded bg-blue-600 text-white">Add a line</button>
              )}
            </Section>
          </div>

          {/* RIGHT: Log panel */}
          <aside className="hidden md:flex w-[380px] max-w-[380px] shrink-0 border-l flex-col">
            {/* Tabs */}
            <div className="px-3 py-2 border-b sticky top-0 bg-white z-10 flex items-center gap-2">
              <button className={`px-3 py-1 rounded text-sm ${tab === "send" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`} onClick={() => setTab("send")} type="button">Send message</button>
              <button className={`px-3 py-1 rounded text-sm ${tab === "log" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`} onClick={() => setTab("log")} type="button">Log note</button>
              <button className={`px-3 py-1 rounded text-sm ${tab === "activities" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`} onClick={() => setTab("activities")} type="button">Activities</button>
              <div className="ml-auto text-gray-400 text-sm">1 / {Math.max(1, logs.length)}</div>
            </div>

            {/* Composer */}
            {(tab === "send" || tab === "log") && (
              <div className="p-3 border-b space-y-2">
                <form
                  className="space-y-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (tab === "send") addLog("message", composeMsg);
                    else addLog("note", composeNote);
                  }}
                >
                  <textarea
                    rows={4}
                    className="w-full border rounded p-2"
                    placeholder={tab === "send" ? "Type a message..." : "Write a log note..."}
                    value={tab === "send" ? composeMsg : composeNote}
                    onChange={(e) => (tab === "send" ? setComposeMsg(e.target.value) : setComposeNote(e.target.value))}
                  />
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-2 bg-gray-100 px-2 py-1 rounded cursor-pointer">
                      <span>Attach</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={(e) => onPickFiles(e.target.files)}
                      />
                    </label>
                    <button className="ml-auto bg-indigo-600 text-white px-3 py-1 rounded" type="submit">
                      {tab === "send" ? "Send" : "Add note"}
                    </button>
                  </div>

                  {/* Previews for selected files in composer */}
                  {composeFiles.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {previewUrls.map((p, idx) => {
                        const isImg = isImageAttachment({ mime: p.mime, url: p.url, name: p.name });
                        return (
                          <div key={p.url} className="border rounded p-2 text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <div className="truncate max-w-[9rem]" title={p.name}>{p.name}</div>
                              <button type="button" className="text-red-600" onClick={() => removeComposeFile(idx)} aria-label="Remove attachment">✕</button>
                            </div>
                            {isImg ? (
                              <img src={p.url} alt={p.name} className="w-full h-28 object-contain bg-gray-50 border rounded" loading="lazy" />
                            ) : (
                              <div className="text-gray-600">File • {(p.size / 1024).toFixed(1)} KB</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Timeline */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="border-b pb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-500 text-white text-xs font-bold">
                      {log.author?.[0] || "U"}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{log.author}</div>
                      <div className="text-xs text-gray-500">{log.ts}</div>
                    </div>
                    <span className="text-xs text-gray-500 capitalize">{log.type}</span>
                  </div>

                  {log.content && <div className="mt-1 text-sm whitespace-pre-wrap">{log.content}</div>}

                  {log.attachments?.length ? (
                    <div className="mt-2 space-y-2">
                      {log.attachments.map((a) => {
                        const src = toAbsoluteUrl(a.url);
                        const showAsImage = isImageAttachment({ mime: a.mime, url: src, name: a.name });
                        return showAsImage ? (
                          <img
                            key={a.id}
                            src={src}
                            alt={a.name || fileNameFromUrl(src)}
                            className="w-full max-h-72 object-contain bg-gray-50 border rounded"
                            loading="lazy"
                          />
                        ) : (
                          <a
                            key={a.id}
                            href={src}
                            download={a.name || fileNameFromUrl(src)}
                            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-xs text-gray-800"
                            target="_blank"
                            rel="noreferrer"
                          >
                            📎 {a.name || fileNameFromUrl(src)}
                          </a>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              ))}
              {logs.length === 0 && <div className="text-gray-400 text-sm">No activity yet.</div>}
            </div>
          </aside>
        </div>
      </div>

      {/* Nested modals */}
      <SelectTransactionsModal
        open={showSelectModal}
        rows={transactions}
        onClose={() => setShowSelectModal(false)}
        onSelect={(rows) => addSelectedTransactions(rows)}
        onNew={() => {
          setShowSelectModal(false);
          setEditingLine(null);
          setShowLineModal(true);
        }}
      />
      <PurchasingLineModal
        open={showLineModal}
        initial={editingLine}
        onClose={() => setShowLineModal(false)}
        onSave={(line) => saveLine(line)}
        onRemove={(id) => removeLine(id)}
      />
    </div>
  );
};

export default PayableModal;

/* helpers */
const Labeled: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <label className="block">
    <div className="text-sm mb-1">
      <span className="font-medium">{label}</span>
      {required && <span className="text-rose-600 ml-1">*</span>}
    </div>
    {children}
  </label>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mt-2">
    <div className="uppercase text-xs tracking-wide text-gray-500 mb-2">{title}</div>
    {children}
  </div>
);

const Th: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <th className={`p-2 font-medium text-gray-600 border-b ${className || ""}`}>{children}</th>
);
const Td: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <td className={`p-2 align-top ${className || ""}`}>{children}</td>
);

/* Attachment utilities (robust detection and URL normalization) */
function fileNameFromUrl(u: string): string {
  try {
    const clean = u.split("?")[0].split("#")[0];
    const parts = clean.split("/");
    return parts[parts.length - 1] || clean;
  } catch {
    return u;
  }
}

function toAbsoluteUrl(u: string, base?: string): string {
  if (!u) return u;
  if (/^https?:\/\//i.test(u)) return u;
  try {
    const b = base || (typeof window !== "undefined" ? window.location.origin : "");
    return new URL(u, b).toString();
  } catch {
    return u;
  }
}

function isImageAttachment(att: { mime?: string; url?: string; name?: string } | string): boolean {
  if (!att) return false;
  if (typeof att === "string") {
    const n = fileNameFromUrl(att);
    return /\.(png|jpe?g|gif|bmp|webp|svg)$/i.test(n);
  }
  const mime = att.mime || "";
  if (mime.startsWith("image/")) return true;
  const candidate = att.name || att.url || "";
  return /\.(png|jpe?g|gif|bmp|webp|svg)$/i.test(fileNameFromUrl(candidate));
}