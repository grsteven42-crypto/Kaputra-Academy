"use client";

import { DollarSign, TrendingUp, Clock, Wallet, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Salary {
  id: string;
  teacherId: string;
  month: string;
  baseSalary: number;
  bonus: number;
  status: string;
  receiptUrl: string | null;
  paymentDetails: string | null;
  createdAt: string;
}

interface SalaryClientProps {
  salaries: Salary[];
  totalEarned: number;
  pendingAmount: number;
  currentMonthSalary: Salary | null;
  teacherName: string;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function SalaryClient({
  salaries,
  totalEarned,
  pendingAmount,
  currentMonthSalary,
  teacherName,
}: SalaryClientProps) {
  const handleExportCSV = () => {
    const headers = ["Month", "Base Salary", "Bonus", "Total", "Status", "Details"];
    const rows = salaries.map((s) => [
      s.month,
      s.baseSalary.toString(),
      s.bonus.toString(),
      (s.baseSalary + s.bonus).toString(),
      s.status,
      s.paymentDetails || "",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `salary_${teacherName.replace(/\s/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-[#CA8E25]" />
            Salary Details
          </h1>
          <p className="text-slate-400 mt-2">
            View your monthly salary breakdown, bonuses, and payment history.
          </p>
        </div>
        {salaries.length > 0 && (
          <Button
            onClick={handleExportCSV}
            className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-5 flex items-center gap-2"
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Earned (YTD)</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">
              {formatCurrency(totalEarned)}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Pending Payments</p>
            <p className="text-2xl font-black text-amber-400 mt-1">
              {formatCurrency(pendingAmount)}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
            <Clock className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">This Month</p>
            <p className="text-2xl font-black text-white mt-1">
              {currentMonthSalary
                ? formatCurrency(
                    currentMonthSalary.baseSalary + currentMonthSalary.bonus
                  )
                : "—"}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      {/* Salary Table */}
      {salaries.length > 0 ? (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white">Payment History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Base Salary
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Bonus
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {salaries.map((salary) => (
                  <tr
                    key={salary.id}
                    className="hover:bg-slate-900/40 transition"
                  >
                    <td className="px-6 py-4 font-semibold text-white">
                      {salary.month}
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-mono">
                      {formatCurrency(salary.baseSalary)}
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-mono">
                      {salary.bonus > 0 ? (
                        <span className="text-emerald-400">
                          +{formatCurrency(salary.bonus)}
                        </span>
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
                    <td className="px-6 py-4 text-slate-400 max-w-xs truncate">
                      {salary.paymentDetails || "—"}
                    </td>
                    <td className="px-6 py-4">
                      {salary.receiptUrl ? (
                        <a
                          href={salary.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#CA8E25] hover:underline flex items-center gap-1 text-xs"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </a>
                      ) : (
                        "—"
                      )}
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
          <p className="font-bold text-white text-lg">No salary records yet</p>
          <p className="text-sm text-slate-500">
            Your salary information will appear here once the admin processes
            payroll.
          </p>
        </div>
      )}
    </div>
  );
}
