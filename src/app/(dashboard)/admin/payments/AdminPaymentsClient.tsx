"use client";

import { useState } from "react";
import {
  CreditCard, CheckCircle2, AlertCircle, XCircle, Clock, Download,
  Search, Eye, X, ExternalLink, DollarSign, Users, TrendingUp, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { approvePayment, rejectPayment } from "@/actions/paymentVerification";

interface Invoice {
  id: string;
  invoiceNumber: string;
  itemId: string;
  itemType: string;
  amount: number;
  virtualAccountNumber: string;
  status: string;
  receiptUrl: string | null;
  dueDate: string;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    name: string;
    studentIdStr: string | null;
    parent: { name: string; email: string } | null;
  };
  lastVerification: {
    status: string;
    rejectionReason: string | null;
    verifiedAt: string | null;
  } | null;
}

interface Props {
  allInvoices: Invoice[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  PENDING:               { label: "Pending",              color: "text-slate-300",    bg: "bg-slate-800",          border: "border-slate-700",     icon: Clock },
  WAITING_VERIFICATION:  { label: "Waiting Verification", color: "text-amber-400",   bg: "bg-amber-500/10",       border: "border-amber-500/20",  icon: AlertCircle },
  PAID:                  { label: "Paid",                 color: "text-emerald-400", bg: "bg-emerald-500/10",     border: "border-emerald-500/20", icon: CheckCircle2 },
  REJECTED:              { label: "Rejected",             color: "text-red-400",     bg: "bg-red-500/10",         border: "border-red-500/20",    icon: XCircle },
};

export default function AdminPaymentsClient({ allInvoices }: Props) {
  const [invoices, setInvoices] = useState<Invoice[]>(allInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectModal, setRejectModal] = useState<Invoice | null>(null);

  const showStatus = (t: "success" | "error", text: string) => {
    setMessage({ type: t, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleApprove = async (invoice: Invoice) => {
    if (!confirm(`Approve payment for invoice ${invoice.invoiceNumber}?`)) return;
    setLoading(invoice.id);
    try {
      await approvePayment(invoice.id);
      setInvoices((prev) =>
        prev.map((i) => i.id === invoice.id ? { ...i, status: "PAID", paidAt: new Date().toISOString() } : i)
      );
      showStatus("success", `Payment for ${invoice.student.name} approved successfully.`);
      setSelectedInvoice(null);
    } catch (e: any) {
      showStatus("error", e.message || "Failed to approve payment.");
    }
    setLoading(null);
  };

  const handleReject = async () => {
    if (!rejectModal || !rejectReason.trim()) return;
    setLoading(rejectModal.id);
    try {
      await rejectPayment(rejectModal.id, rejectReason.trim());
      setInvoices((prev) =>
        prev.map((i) => i.id === rejectModal.id ? { ...i, status: "REJECTED" } : i)
      );
      showStatus("success", `Payment for ${rejectModal.student.name} rejected.`);
      setRejectModal(null);
      setRejectReason("");
      setSelectedInvoice(null);
    } catch (e: any) {
      showStatus("error", e.message || "Failed to reject payment.");
    }
    setLoading(null);
  };

  const handleExportCSV = () => {
    const headers = [
      "Invoice Number", "Student Name", "Student ID", "Parent Name", "Parent Email",
      "Item", "Type", "Amount", "Status", "Due Date", "Paid At", "VA Number"
    ];
    const rows = filteredInvoices.map((inv) => [
      inv.invoiceNumber,
      inv.student.name,
      inv.student.studentIdStr ?? "",
      inv.student.parent?.name ?? "",
      inv.student.parent?.email ?? "",
      inv.itemId,
      inv.itemType,
      inv.amount,
      inv.status,
      new Date(inv.dueDate).toLocaleDateString("id-ID"),
      inv.paidAt ? new Date(inv.paidAt).toLocaleDateString("id-ID") : "",
      inv.virtualAccountNumber,
    ]);

    const csv = "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", `payments_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats
  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === "PAID").length,
    pending: invoices.filter((i) => i.status === "WAITING_VERIFICATION").length,
    totalRevenue: invoices.filter((i) => i.status === "PAID").reduce((s, i) => s + i.amount, 0),
  };

  // Filtering
  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.student.name.toLowerCase().includes(search.toLowerCase()) ||
      (inv.student.studentIdStr || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const waitingCount = invoices.filter((i) => i.status === "WAITING_VERIFICATION").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-[#CA8E25]" />
            Payment Management
          </h1>
          <p className="text-slate-400 mt-2">Verify and reject payments, view history, and export financial summaries.</p>
        </div>
        <Button
          onClick={handleExportCSV}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-5 flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`flex items-center gap-2 p-4 rounded-xl border ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="text-sm font-medium">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Waiting Alert */}
      {waitingCount > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
          <p className="text-sm font-medium text-amber-400">
            {waitingCount} payment{waitingCount > 1 ? "s" : ""} are awaiting your verification.
          </p>
          <button
            onClick={() => setStatusFilter("WAITING_VERIFICATION")}
            className="ml-auto text-xs font-bold text-amber-400 hover:underline"
          >
            View all →
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Invoices",   value: stats.total,                                              icon: CreditCard,  color: "text-white"        },
          { label: "Paid",             value: stats.paid,                                               icon: CheckCircle2, color: "text-emerald-400"  },
          { label: "Awaiting Review",  value: stats.pending,                                            icon: AlertCircle, color: "text-amber-400"    },
          { label: "Total Revenue",    value: `Rp ${stats.totalRevenue.toLocaleString("id-ID")}`,      icon: DollarSign,  color: "text-[#CA8E25]"    },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4 w-4 ${s.color}`} />
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{s.label}</p>
              </div>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by invoice, student name, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#CA8E25]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#CA8E25]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="WAITING_VERIFICATION">Waiting Verification</option>
            <option value="PAID">Paid</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[10px] uppercase bg-slate-900 text-slate-500 font-bold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Invoice</th>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Item</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Receipt</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {filteredInvoices.length > 0 ? filteredInvoices.map((inv) => {
                const cfg = STATUS_CONFIG[inv.status] || STATUS_CONFIG.PENDING;
                const StatusIcon = cfg.icon;
                const canApprove = inv.status === "WAITING_VERIFICATION";
                const canReject  = inv.status === "WAITING_VERIFICATION" || inv.status === "PENDING";

                return (
                  <tr key={inv.id} className="hover:bg-slate-900/20 transition">
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs text-slate-300">{inv.invoiceNumber}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">
                        {new Date(inv.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-white text-xs">{inv.student.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{inv.student.studentIdStr ?? "—"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-slate-300">{inv.itemId}</p>
                      <p className="text-[10px] text-slate-600">{inv.itemType}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-[#CA8E25] text-sm">Rp {inv.amount.toLocaleString("id-ID")}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                        <StatusIcon className="h-2.5 w-2.5" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {inv.receiptUrl ? (
                        <a
                          href={inv.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1"
                        >
                          View <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-slate-600 text-xs">No receipt</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-800 rounded-lg transition"
                          title="View details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        {canApprove && (
                          <button
                            onClick={() => handleApprove(inv)}
                            disabled={loading === inv.id}
                            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition disabled:opacity-50"
                          >
                            {loading === inv.id ? "..." : "Approve"}
                          </button>
                        )}
                        {canReject && (
                          <button
                            onClick={() => setRejectModal(inv)}
                            disabled={loading === inv.id}
                            className="text-xs font-bold text-red-400 hover:text-red-300 px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition disabled:opacity-50"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500 text-sm">
                    No invoices matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-950 border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white">Invoice Detail</h3>
              <button onClick={() => setSelectedInvoice(null)} className="text-slate-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Invoice #",     value: selectedInvoice.invoiceNumber, mono: true },
                  { label: "Status",        value: selectedInvoice.status },
                  { label: "Student",       value: selectedInvoice.student.name },
                  { label: "Student ID",    value: selectedInvoice.student.studentIdStr ?? "—", mono: true },
                  { label: "Parent",        value: selectedInvoice.student.parent?.name ?? "—" },
                  { label: "Parent Email",  value: selectedInvoice.student.parent?.email ?? "—" },
                  { label: "Item",          value: selectedInvoice.itemId },
                  { label: "Type",          value: selectedInvoice.itemType },
                  { label: "Amount",        value: `Rp ${selectedInvoice.amount.toLocaleString("id-ID")}` },
                  { label: "VA Number",     value: selectedInvoice.virtualAccountNumber, mono: true },
                  { label: "Due Date",      value: new Date(selectedInvoice.dueDate).toLocaleDateString("id-ID") },
                  { label: "Paid At",       value: selectedInvoice.paidAt ? new Date(selectedInvoice.paidAt).toLocaleDateString("id-ID") : "—" },
                ].map(({ label, value, mono }) => (
                  <div key={label}>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">{label}</p>
                    <p className={`text-white font-medium mt-0.5 ${mono ? "font-mono" : ""}`}>{value}</p>
                  </div>
                ))}
              </div>

              {selectedInvoice.receiptUrl && (
                <div className="pt-4 border-t border-slate-900">
                  <a
                    href={selectedInvoice.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    <ExternalLink className="h-4 w-4" /> View Payment Receipt
                  </a>
                </div>
              )}

              {selectedInvoice.status === "WAITING_VERIFICATION" && (
                <div className="pt-4 border-t border-slate-900 flex gap-3">
                  <Button
                    onClick={() => handleApprove(selectedInvoice)}
                    disabled={loading === selectedInvoice.id}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
                  >
                    {loading === selectedInvoice.id ? "Processing..." : "Approve Payment"}
                  </Button>
                  <Button
                    onClick={() => { setRejectModal(selectedInvoice); setSelectedInvoice(null); }}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl"
                  >
                    Reject Payment
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-950 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white">Reject Payment</h3>
              <button onClick={() => setRejectModal(null)} className="text-slate-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-400">
                You are rejecting payment for <span className="text-white font-bold">{rejectModal.student.name}</span> — invoice <span className="font-mono text-amber-400">{rejectModal.invoiceNumber}</span>.
              </p>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Rejection Reason</label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Invalid receipt, amount mismatch, unreadable image..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 resize-none"
                />
              </div>
              <Button
                onClick={handleReject}
                disabled={!rejectReason.trim() || loading === rejectModal.id}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl"
              >
                {loading === rejectModal.id ? "Rejecting..." : "Confirm Rejection"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
