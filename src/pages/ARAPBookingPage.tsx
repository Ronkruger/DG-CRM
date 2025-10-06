import React, { useMemo, useState } from "react";
import StatusTabs, { type Status } from "../components/StatusTabs";
import KanbanBoard, { type PayableItem } from "../components/KanbanBoard";
import PayableModal, { type NewPayableForm, emptyPayableForm } from "../components/PayableModal";

const STRIP_MIN = "min-w-[640px] md:min-w-[960px] lg:min-w-[1200px]";

const ARAPBookingPage: React.FC = () => {
  const [statusTab, setStatusTab] = useState<Status>("New");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterText, setFilterText] = useState("");

  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [initialForm, setInitialForm] = useState<NewPayableForm | null>(null);

  const [items, setItems] = useState<PayableItem[]>([
    {
      id: crypto.randomUUID(),
      name: "★ MDELJ - ADVANCE PAYMENT FOR SOHAN - JUNE 20, 2025",
      status: "New",
      note: "New",
      createdAt: "07/09/2025 15:22:40",
      paymentDeadline: "07/09/2025 23:55:00",
      total: 198_579,
      paid: 0,
      balance: 198_579,
      currency: "PHP"
    },
    {
      id: crypto.randomUUID(),
      name: "☆ ODELO - APOLLO TOUR BUS FOR OCT 7-14 FOR 19 PAX",
      status: "Submitted",
      note: "Partially Paid",
      createdAt: "10/07/2025 17:00:00",
      total: 0,
      paid: 0,
      balance: 0,
      currency: "PHP"
    },
    {
      id: crypto.randomUUID(),
      name: "★ KDELS - FLIGHT TICKET FOR 3 PAX - SEPT 7-19",
      status: "Budget Approved",
      note: "Done",
      createdAt: "09/07/2025 14:00:14",
      paymentDeadline: "07/29/2025 14:00:14",
      total: 0,
      paid: 0,
      balance: 0,
      currency: "PHP"
    },
    {
      id: crypto.randomUUID(),
      name: "★ (PAID - 10/04) ODELO - TUSCANY HOTEL FOR 20 PAX - OCT 8 - 10",
      status: "Parameters Approved",
      note: "Done",
      createdAt: "10/08/2025 03:00:00",
      total: 262_187.64,
      paid: 262_187.64,
      balance: 0,
      currency: "PHP"
    },
    {
      id: crypto.randomUUID(),
      name: "★ BN2/HDELS - ADVANCE PAYMENT FOR TOUR MANAGER SOHAN RAJAWAT",
      status: "Auditing Approved",
      note: "New",
      createdAt: "09/20/2025 21:30:17",
      total: 217_896.25,
      paid: 0,
      balance: 217_896.25,
      currency: "PHP"
    },
    {
      id: crypto.randomUUID(),
      name: "★ RKDELS - REIMBURSEMENT REQUEST OF TM SZEBASITAN KONDOR",
      status: "Releasing Approved",
      note: "New",
      createdAt: "09/26/2025 16:00:00",
      total: 2_548.54,
      paid: 0,
      balance: 2_548.54,
      currency: "PHP"
    },
    {
      id: crypto.randomUUID(),
      name: "★ UPREMMY - Clement - For 3 pax",
      status: "On hold",
      note: "New",
      createdAt: "06/01/2025 21:53:03",
      total: 19_543.87,
      paid: 0,
      balance: 19_543.87,
      currency: "PHP"
    }
  ]);

  const handleMove = (id: string, toStatus: Status) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: toStatus } : it)));
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedId(null);
    setInitialForm(emptyPayableForm);
    setIsModalOpen(true);
  };

  const openEditModal = (id: string) => {
    const it = items.find((x) => x.id === id);
    if (!it) return;
    setModalMode("edit");
    setSelectedId(id);
    setInitialForm(mapItemToForm(it));
    setIsModalOpen(true);
  };

  const handleSave = (data: NewPayableForm) => {
    if (modalMode === "edit" && selectedId) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === selectedId
            ? {
                ...it,
                name: data.name || it.name,
                status: data.status,
                note: data.status === "Paid" ? "Done" : data.status,
                paymentDeadline: data.paymentDeadline,
                category: data.category,
                supplier: data.supplier.bank || it.supplier,
                total: Number(data.totalAmount || 0),
                paid: Number(data.amountPaid || 0),
                balance: Math.max(0, Number(data.totalAmount || 0) - Number(data.amountPaid || 0)),
                currency: data.currency || it.currency,
                travelDate:
                  (data.travelFrom ? new Date(data.travelFrom).toLocaleDateString() : "") +
                  (data.travelTo ? ` - ${new Date(data.travelTo).toLocaleDateString()}` : "")
              }
            : it
        )
      );
    } else {
      const total = Number(data.totalAmount || 0);
      const paid = Number(data.amountPaid || 0);
      const currency = data.currency || "USD";
      const newItem: PayableItem = {
        id: crypto.randomUUID(),
        name: data.name || "Untitled",
        status: "New",
        note: data.status === "Paid" ? "Done" : data.status || "New",
        createdAt: new Date().toLocaleString(),
        paymentDeadline: data.paymentDeadline,
        category: data.category,
        supplier: data.supplier.bank,
        total,
        paid,
        balance: Math.max(0, total - paid),
        currency,
        travelDate:
          (data.travelFrom ? new Date(data.travelFrom).toLocaleDateString() : "") +
          (data.travelTo ? ` - ${new Date(data.travelTo).toLocaleDateString()}` : "")
      };
      setItems((prev) => [newItem, ...prev]);
    }
  };

  const counts = useMemo(() => {
    return items.reduce<Record<Status, number>>((acc, it) => {
      acc[it.status] = (acc[it.status] || 0) + 1;
      return acc;
    }, {} as Record<Status, number>);
  }, [items]);

  return (
    <div className="p-3 md:p-6 space-y-4">
      {/* Title strip */}
      <div className="overflow-x-auto">
        <div className={`${STRIP_MIN}`}>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-xs bg-pink-100 text-pink-700 border border-pink-200">New</span>
            <span className="text-sm text-gray-600">Payable</span>
            <span className="text-xs text-gray-500">Board</span>

            <div className="ml-auto flex items-center gap-2">
              <button className="p-2 rounded hover:bg-gray-100" title="Settings">⚙️</button>
              <button className="p-2 rounded hover:bg-gray-100" title="Refresh">⟳</button>
              <button className="p-2 rounded hover:bg-gray-100" title="Help">❔</button>
              <button className="ml-2 bg-indigo-600 text-white px-3 py-1 rounded" onClick={openCreateModal}>
                New
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + counts (hide on small) */}
      <div className="overflow-x-auto hidden xl:block">
        <div className={`${STRIP_MIN}`}>
          <StatusTabs value={statusTab} onChange={setStatusTab} />
          <div className="text-xs text-gray-500 mt-1">
            {Object.entries(counts).map(([k, v]) => (
              <span key={k} className="mr-3">
                {k}: {v}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="overflow-x-auto">
        <div className={`${STRIP_MIN}`}>
          <input
            type="search"
            placeholder="Search..."
            className="w-full border rounded px-3 py-2"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>

      {/* Board */}
      <KanbanBoard
        items={items}
        filterText={filterText}
        onMove={handleMove}
        onAdd={() => openCreateModal()}
        onOpen={(id) => openEditModal(id)}
      />

      {/* Modal */}
      <PayableModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        mode={modalMode}
        initial={initialForm}
      />
    </div>
  );
};

export default ARAPBookingPage;

// Map item to form
function mapItemToForm(it: PayableItem): NewPayableForm {
  let travelFrom = "";
  let travelTo = "";
  if (it.travelDate && it.travelDate.includes(" - ")) {
    const [a, b] = it.travelDate.split(" - ");
    travelFrom = toISODateFromLocale(a);
    travelTo = toISODateFromLocale(b);
  }
  return {
    name: it.name || "",
    dateCreated: toISODateFromLocale(it.createdAt) || "",
    dos: "",
    paymentDeadline: toISODateFromLocale(it.paymentDeadline || "") || "",
    category: it.category || "",
    package: "",
    travelFrom,
    travelTo,
    totalAmount: typeof it.total === "number" ? it.total : "",
    amountPaid: typeof it.paid === "number" ? it.paid : "",
    status: it.status,
    currency: it.currency || "USD",
    datePayable: "",
    details: "",
    invoiceFile: null,
    invoiceNumber: "",
    requestedBy: "",
    approvers: "",
    supplier: {
      paymentMode: "",
      creditCardLink: "",
      bank: it.supplier || "",
      bankAccountName: "",
      accountNo: ""
    },
    lines: []
  };
}

function toISODateFromLocale(input: string): string {
  if (!input) return "";
  const m = input.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!m) return "";
  const mm = m[1].padStart(2, "0");
  const dd = m[2].padStart(2, "0");
  const yyyy = m[3];
  return `${yyyy}-${mm}-${dd}`;
}