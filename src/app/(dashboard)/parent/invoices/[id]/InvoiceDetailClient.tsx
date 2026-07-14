"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadReceipt } from "@/actions/invoice";
import { useRouter } from "next/navigation";

export default function InvoiceDetailClient({ invoice, studentName }: { invoice: any; studentName?: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("invoiceId", invoice.id);
      formData.append("receiptFile", file);

      const res = await uploadReceipt(formData);
      if (res.success) {
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 rounded-2xl p-8 shadow-sm border border-slate-800">
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <p className="text-sm text-slate-400">Invoice Number</p>
          <p className="font-bold text-white">{invoice.invoiceNumber}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Status</p>
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${invoice.status === 'PAID' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
            invoice.status === 'WAITING_VERIFICATION' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              invoice.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
            {invoice.status}
          </span>
        </div>
        <div>
          <p className="text-sm text-slate-400">Item</p>
          <p className="font-bold text-white">{invoice.itemId}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Amount Due</p>
          <p className="font-bold text-[#CA8E25]">Rp {invoice.amount.toLocaleString('id-ID')}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Virtual Account Number</p>
          <p className="font-mono font-bold text-lg text-white">{invoice.virtualAccountNumber}</p>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-8">
        <h3 className="text-lg font-bold text-white mb-4">Payment Receipt</h3>

        {invoice.status === 'PAID' ? (
          <div className="p-4 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20">
            Payment has been verified. You now have access to this program!
          </div>
        ) : (
          <div className="space-y-4">
            {invoice.status === 'REJECTED' && (
              <div className="p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20 mb-4">
                Your previous payment was rejected. Please upload a new receipt.
              </div>
            )}

            {invoice.receiptUrl && invoice.status === 'WAITING_VERIFICATION' ? (
              <div className="p-4 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20 mb-4">
                Receipt uploaded. Waiting for admin verification.
                <div className="mt-4">
                  <p className="text-sm font-semibold mb-2">Replace Receipt:</p>
                  <div className="flex gap-4">
                    <Input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="bg-slate-900 border-slate-800 text-white"
                    />
                    <Button onClick={handleUpload} disabled={!file || loading} className="bg-blue-600 hover:bg-blue-500 text-white">
                      {loading ? 'Uploading...' : 'Update'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Upload Receipt (JPG, PNG, PDF max 5MB)
                  </label>
                  <Input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="bg-slate-900 border-slate-800 text-white"
                  />
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className="bg-blue-600 hover:bg-blue-500 text-white"
                >
                  {loading ? 'Uploading...' : 'Submit Payment'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
