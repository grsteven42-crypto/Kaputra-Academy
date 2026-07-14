import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { CreditCard, FileText, Calendar, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Payment History | PARENT Portal",
};

export default async function PARENTPaymentsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "PARENT") {
    redirect("/login");
  }

  const PARENT = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      invoices: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!PARENT) {
    redirect("/login");
  }

  const invoices = PARENT.invoices;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Payment History</h1>
        <p className="text-slate-400">Manage invoices, check transaction status, and upload transfer receipts.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-slate-400 font-medium">Pending Payments</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {invoices.filter((i) => i.status === "PENDING" || i.status === "REJECTED").length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 border border-amber-500/20">
            <CreditCard className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-slate-400 font-medium">Verified Paid</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {invoices.filter((i) => i.status === "PAID").length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/20">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-slate-400 font-medium">Total Invoices</p>
            <h3 className="text-3xl font-bold text-white mt-1">{invoices.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 border border-blue-500/20">
            <Calendar className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Invoice list */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800">
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Invoice Number</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Item ID</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Created Date</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-slate-800 last:border-0 hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="p-4 font-mono text-sm text-white">{invoice.invoiceNumber}</td>
                    <td className="p-4 text-sm font-semibold text-slate-350">{invoice.itemId}</td>
                    <td className="p-4 text-sm font-bold text-[#CA8E25]">Rp {invoice.amount.toLocaleString("id-ID")}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${invoice.status === "PAID"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : invoice.status === "WAITING_VERIFICATION"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : invoice.status === "REJECTED"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-slate-800 text-slate-300 border border-slate-700"
                          }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-400">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <Link href={`/parent/invoices/${invoice.id}`}>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs py-1"
                        >
                          View Details
                          <ArrowUpRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <CreditCard className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <p>You do not have any registered transactions or invoice history.</p>
          </div>
        )}
      </div>
    </div>
  );
}
