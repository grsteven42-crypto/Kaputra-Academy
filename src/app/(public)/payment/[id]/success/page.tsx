import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Payment Success | Kaputra Academy",
};

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center border border-gray-100">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-20 h-20 text-green-500" />
        </div>
        
        <h2 className="text-3xl font-extrabold text-[#072147] mb-4">
          Payment Submitted!
        </h2>
        
        <p className="text-gray-600 mb-8">
          Thank you. Your payment receipt has been successfully uploaded. 
          Our administration team will verify your payment shortly. 
          You will receive an email once your enrollment is approved.
        </p>

        <Link href="/">
          <Button className="w-full bg-[#072147] hover:bg-[#0A2E61] text-white font-semibold py-3 rounded-xl shadow-md transition-all">
            Return to Home
          </Button>
        </Link>
      </div>
    </main>
  );
}
