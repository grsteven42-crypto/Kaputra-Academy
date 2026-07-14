"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadReceipt } from "@/actions/invoice";
import { useRouter } from "next/navigation";
import {
  CreditCard, CheckCircle2, AlertCircle, XCircle, Clock, Printer,
  Upload, FileText, Building2, User, Calendar, Package
} from "lucide-react";
import { motion } from "framer-motion";

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
}

interface Student {
  name: string;
  studentIdStr: string | null;
}

interface Verification {
  status: string;
  rejectionReason: string | null;
  verifiedAt: string | null;
}

interface Props {
  invoice: Invoice;
  student: Student;
  lastVerification: Verification | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  PENDING:               { label: "Pending Payment",       color: "text-slate-300",    bg: "bg-slate-800",          border: "border-slate-700",     icon: Clock },
  WAITING_VERIFICATION:  { label: "Waiting Verification",  color: "text-amber-400",   bg: "bg-amber-500/10",       border: "border-amber-500/20",  icon: AlertCircle },
  PAID:                  { label: "Payment Verified",      color: "text-emerald-400", bg: "bg-emerald-500/10",     border: "border-emerald-500/20", icon: CheckCircle2 },
  REJECTED:              { label: "Payment Rejected",      color: "text-red-400",     bg: "bg-red-500/10",         border: "border-red-500/20",    icon: XCircle },
};

export default function StudentInvoiceDetailClient({ invoice, student, lastVerification }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  const cfg = STATUS_CONFIG[invoice.status] || STATUS_CONFIG.PENDING;
  const StatusIcon = cfg.icon;
  const isPaid = invoice.status === "PAID";
  const isWaiting = invoice.status === "WAITING_VERIFICATION";
  const isRejected = invoice.status === "REJECTED";

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("invoiceId", invoice.id);
      formData.append("receiptFile", file);
      const res = await uploadReceipt(formData);
      if (res.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError("Upload failed. Please try again.");
      }
    } catch (e) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Print-only header */}
      <div className="hidden print:block mb-6 text-center border-b pb-4">
        <h1 className="text-2xl font-black">KAPUTRA ACADEMY</h1>
        <p className="text-sm text-gray-600">Official Payment Receipt</p>
      </div>

      {/* Invoice Card */}
      <div ref={printRef} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
        {/* Invoice Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#CA8E25]/10 border border-[#CA8E25]/20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-[#CA8E25]" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Invoice Number</p>
              <p className="font-mono font-bold text-white">{invoice.invoiceNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
              <StatusIcon className="h-3.5 w-3.5" />
              {cfg.label}
            </span>
            {isPaid && (
              <Button
                onClick={handlePrint}
                size="sm"
                className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-1.5 print:hidden"
              >
                <Printer className="h-3.5 w-3.5" />
                Print Receipt
              </Button>
            )}
          </div>
        </div>

        {/* Invoice Details Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Student</p>
                <p className="text-sm font-bold text-white">{student.name}</p>
                <p className="text-xs text-slate-500 font-mono">{student.studentIdStr || "—"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Package className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Item</p>
                <p className="text-sm font-bold text-white">{invoice.itemId}</p>
                <p className="text-xs text-slate-500">{invoice.itemType}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CreditCard className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Amount Due</p>
                <p className="text-xl font-black text-[#CA8E25]">Rp {invoice.amount.toLocaleString("id-ID")}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Due Date</p>
                <p className="text-sm font-bold text-white">
                  {new Date(invoice.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Virtual Account Box */}
        {!isPaid && (
          <div className="mx-6 mb-6 p-5 bg-[#CA8E25]/5 border border-[#CA8E25]/20 rounded-xl">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-[#CA8E25] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#CA8E25] uppercase tracking-wide mb-1">Virtual Account Payment</p>
                <p className="text-xs text-slate-400 mb-2">Transfer the exact amount to this virtual account number:</p>
                <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 inline-block">
                  <p className="font-mono text-lg font-black text-white tracking-widest">{invoice.virtualAccountNumber}</p>
                </div>
                <p className="text-[10px] text-slate-500 mt-2">Then upload your payment receipt below for verification.</p>
              </div>
            </div>
          </div>
        )}

        {/* Paid confirmation */}
        {isPaid && invoice.paidAt && (
          <div className="mx-6 mb-6 p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-400">Payment Confirmed</p>
                <p className="text-xs text-slate-400">
                  Verified on {new Date(invoice.paidAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Receipt Section */}
      {!isPaid && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 print:hidden">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Upload className="h-4 w-4 text-[#CA8E25]" />
            Upload Payment Receipt
          </h3>
          <p className="text-xs text-slate-500 mb-5">After making a transfer, upload your bank receipt here for verification. Accepted: JPG, PNG, PDF (max 5MB).</p>

          {isRejected && lastVerification?.rejectionReason && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
            >
              <p className="text-sm font-bold text-red-400 flex items-center gap-2"><XCircle className="h-4 w-4" /> Payment Rejected</p>
              <p className="text-xs text-red-300 mt-1">Reason: {lastVerification.rejectionReason}</p>
              <p className="text-xs text-slate-400 mt-1">Please upload a new valid receipt to re-submit your payment.</p>
            </motion.div>
          )}

          {isWaiting && (
            <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Awaiting Verification
              </p>
              <p className="text-xs text-slate-400 mt-1">Your receipt has been submitted. An admin will verify it shortly. You can replace it if needed.</p>
            </div>
          )}

          {success ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <p className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Receipt submitted successfully!
              </p>
              <p className="text-xs text-slate-400 mt-1">Your payment is now under admin review.</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select File</label>
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="bg-slate-900 border-slate-800 text-white file:bg-slate-800 file:text-slate-300 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-xs cursor-pointer"
                />
                {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
              </div>
              <Button
                onClick={handleUpload}
                disabled={!file || loading}
                className="bg-[#CA8E25] hover:bg-[#D89A2B] text-black font-bold rounded-xl px-6 shrink-0"
              >
                {loading ? "Uploading..." : isWaiting ? "Replace Receipt" : "Submit Payment"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
