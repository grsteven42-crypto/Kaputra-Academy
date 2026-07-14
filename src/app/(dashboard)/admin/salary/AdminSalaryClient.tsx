"use client";

import { useState, useRef } from "react";
import { 
  DollarSign, 
  Plus, 
  Search, 
  FileText, 
  Trash2, 
  Edit2, 
  TrendingUp, 
  Clock, 
  Users, 
  X, 
  Eye, 
  Upload,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminCreateSalary, adminUpdateSalary, adminDeleteSalary, uploadSalaryReceipt } from "@/actions/salaryAdmin";

interface Teacher {
  id: string;
  name: string;
  email: string;
}

interface Salary {
  id: string;
  teacherId: string;
  month: string;
  baseSalary: number;
  bonus: number;
  status: string;
  receiptUrl: string | null;
  paymentDetails: string | null;
  createdAt: string | Date;
  teacher: {
    id: string;
    name: string;
    email: string;
  };
}

interface AdminSalaryClientProps {
  initialSalaries: Salary[];
  teachers: Teacher[];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function AdminSalaryClient({ initialSalaries, teachers }: AdminSalaryClientProps) {
  const [salaries, setSalaries] = useState<Salary[]>(initialSalaries);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState<Salary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Form fields
  const [teacherId, setTeacherId] = useState("");
  const [month, setMonth] = useState("");
  const [baseSalary, setBaseSalary] = useState("");
  const [bonus, setBonus] = useState("0");
  const [status, setStatus] = useState("PENDING");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptUrlPreview, setReceiptUrlPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Statistics
  const totalPaid = salaries
    .filter((s) => s.status === "PAID")
    .reduce((sum, s) => sum + s.baseSalary + s.bonus, 0);

  const totalPending = salaries
    .filter((s) => s.status === "PENDING")
    .reduce((sum, s) => sum + s.baseSalary + s.bonus, 0);

  const activeTeachers = teachers.length;

  const handleOpenCreateModal = () => {
    setEditingSalary(null);
    setTeacherId(teachers[0]?.id || "");
    
    // Default current month
    const defaultMonth = new Date().toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    setMonth(defaultMonth);
    
    setBaseSalary("");
    setBonus("0");
    setStatus("PENDING");
    setPaymentDetails("");
    setReceiptFile(null);
    setReceiptUrlPreview(null);
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (salary: Salary) => {
    setEditingSalary(salary);
    setTeacherId(salary.teacherId);
    setMonth(salary.month);
    setBaseSalary(salary.baseSalary.toString());
    setBonus(salary.bonus.toString());
    setStatus(salary.status);
    setPaymentDetails(salary.paymentDetails || "");
    setReceiptFile(null);
    setReceiptUrlPreview(salary.receiptUrl);
    setError(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId || !month || !baseSalary) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let finalReceiptUrl = receiptUrlPreview || undefined;

      // Upload file if new one is selected
      if (receiptFile) {
        const formData = new FormData();
        formData.append("receiptFile", receiptFile);
        const uploadRes = await uploadSalaryReceipt(formData);
        if (uploadRes.success && uploadRes.receiptUrl) {
          finalReceiptUrl = uploadRes.receiptUrl;
        } else {
          setError(uploadRes.error || "Failed to upload receipt file.");
          setLoading(false);
          return;
        }
      }

      const payload = {
        teacherId,
        month,
        baseSalary: parseFloat(baseSalary),
        bonus: parseFloat(bonus || "0"),
        status,
        paymentDetails,
        receiptUrl: finalReceiptUrl,
      };

      if (editingSalary) {
        const res = await adminUpdateSalary(editingSalary.id, payload);
        if (res.success && res.salary) {
          // Update client state
          setSalaries(
            salaries.map((s) =>
              s.id === editingSalary.id
                ? {
                    ...s,
                    ...payload,
                    receiptUrl: finalReceiptUrl || s.receiptUrl,
                    teacher: teachers.find((t) => t.id === teacherId) as any,
                  }
                : s
            )
          );
          setIsModalOpen(false);
        } else {
          setError(res.error || "Failed to update salary.");
        }
      } else {
        const res = await adminCreateSalary(payload);
        if (res.success && res.salary) {
          const newSalaryWithTeacher = {
            ...res.salary,
            teacher: teachers.find((t) => t.id === teacherId) as any,
          } as Salary;
          setSalaries([newSalaryWithTeacher, ...salaries]);
          setIsModalOpen(false);
        } else {
          setError(res.error || "Failed to create salary.");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this salary record?")) {
      const res = await adminDeleteSalary(id);
      if (res.success) {
        setSalaries(salaries.filter((s) => s.id !== id));
      } else {
        alert(res.error || "Failed to delete record.");
      }
    }
  };

  // Filter salaries
  const filteredSalaries = salaries.filter((s) => {
    const matchesSearch = s.teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.teacher.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-[#CA8E25]" />
            Salary CMS
          </h1>
          <p className="text-slate-400 mt-2">
            Manage teacher payrolls, upload receipts, and track paid/pending salaries.
          </p>
        </div>
        <Button
          onClick={handleOpenCreateModal}
          className="bg-[#CA8E25] hover:bg-[#D89A2B] text-black font-semibold rounded-xl px-5 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Create Payroll
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Paid (YTD)</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">
              {formatCurrency(totalPaid)}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Pending</p>
            <p className="text-2xl font-black text-amber-400 mt-1">
              {formatCurrency(totalPending)}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
            <Clock className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Active Teachers</p>
            <p className="text-2xl font-black text-white mt-1">
              {activeTeachers}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:max-w-md relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by teacher name or email..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-slate-700"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-white text-sm rounded-xl px-4 py-2 focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </div>

      {/* Salaries list */}
      {filteredSalaries.length > 0 ? (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-slate-500 font-bold uppercase text-xs">
                  <th className="px-6 py-3">Teacher</th>
                  <th className="px-6 py-3">Month</th>
                  <th className="px-6 py-3">Base Salary</th>
                  <th className="px-6 py-3">Bonus</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Receipt</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredSalaries.map((salary) => (
                  <tr key={salary.id} className="hover:bg-slate-900/40 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-white">{salary.teacher.name}</p>
                        <p className="text-xs text-slate-500 font-mono">{salary.teacher.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">{salary.month}</td>
                    <td className="px-6 py-4 font-mono">{formatCurrency(salary.baseSalary)}</td>
                    <td className="px-6 py-4 font-mono">
                      {salary.bonus > 0 ? (
                        <span className="text-emerald-400">+{formatCurrency(salary.bonus)}</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-white font-mono">
                      {formatCurrency(salary.baseSalary + salary.bonus)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                          salary.status === "PAID"
                            ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                            : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                        }`}
                      >
                        {salary.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {salary.receiptUrl ? (
                        <a
                          href={salary.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#CA8E25] hover:underline flex items-center gap-1 text-xs"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Receipt
                        </a>
                      ) : (
                        <span className="text-slate-550 text-xs italic">No receipt</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEditModal(salary)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(salary.id)}
                          className="text-red-450 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 p-12 rounded-2xl text-center space-y-3">
          <DollarSign className="h-10 w-10 text-[#CA8E25] mx-auto opacity-40" />
          <p className="font-bold text-white text-lg">No salary records found</p>
          <p className="text-sm text-slate-500">
            Create a new salary entry or adjust your search filters.
          </p>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-900 flex items-center justify-between">
              <h3 className="font-bold text-white text-lg">
                {editingSalary ? "Edit Salary Record" : "Create Salary Record"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Teacher</label>
                  <select
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    disabled={!!editingSalary}
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-slate-700"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Month</label>
                  <input
                    type="text"
                    required
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    placeholder="e.g. June 2026"
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-slate-700 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wider font-mono">Base Salary (IDR)</label>
                  <input
                    type="number"
                    required
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(e.target.value)}
                    placeholder="e.g. 5000000"
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-slate-700 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wider font-mono">Bonus (IDR)</label>
                  <input
                    type="number"
                    value={bonus}
                    onChange={(e) => setBonus(e.target.value)}
                    placeholder="e.g. 1000000"
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-slate-700"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Payment Details / Notes</label>
                <textarea
                  value={paymentDetails}
                  onChange={(e) => setPaymentDetails(e.target.value)}
                  placeholder="e.g. Bank transfer, Ref #12345, processed on the 30th."
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">
                  Payment Receipt {status === "PAID" && <span className="text-[#CA8E25]">*</span>}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white rounded-xl text-xs py-2 flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4 text-[#CA8E25]" />
                    {receiptFile ? receiptFile.name : "Select Receipt"}
                  </Button>
                  {receiptUrlPreview && !receiptFile && (
                    <span className="text-xs text-[#CA8E25] italic">Existing receipt loaded</span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2 border-t border-slate-900">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 text-slate-400 hover:text-white rounded-xl"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#CA8E25] hover:bg-[#D89A2B] text-black font-bold rounded-xl"
                >
                  {loading ? "Saving..." : "Save Record"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
