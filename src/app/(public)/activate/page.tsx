import prisma from "@/lib/db";
import { activateAccounts } from "@/actions/activate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ShieldAlert, KeyRound, CheckCircle, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Account Activation | Kaputra Academy",
};

export default async function ActivatePage({ searchParams }: { searchParams: Promise<{ studentId?: string }> }) {
  const { studentId } = await searchParams;

  if (!studentId) {
    return (
      <main className="min-h-screen bg-[#072147] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-white space-y-4">
          <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-black">Missing Student ID</h2>
          <p className="text-slate-400">
            Please use the link sent to your welcome email or complete your placement test first.
          </p>
        </div>
      </main>
    );
  }

  // Fetch placement test status
  const test = await prisma.placementTest.findUnique({
    where: { studentIdStr: studentId },
    include: {
      registration: true,
    },
  });

  if (!test) {
    return (
      <main className="min-h-screen bg-[#072147] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-white space-y-4">
          <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-black">Invalid Student ID</h2>
          <p className="text-slate-400">
            The Student ID <span className="font-mono text-[#CA8E25]">{studentId}</span> does not exist in our enrollment system.
          </p>
        </div>
      </main>
    );
  }

  // Check if student accounts are already created
  const existingStudent = await prisma.user.findUnique({
    where: { studentIdStr: studentId },
  });

  if (existingStudent) {
    return (
      <main className="min-h-screen bg-[#072147] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-white space-y-6">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
          <h2 className="text-2xl font-black">Already Activated</h2>
          <p className="text-slate-400">
            Your Student and Parent accounts have already been activated. You can proceed to log in.
          </p>
          <Link href="/login">
            <Button className="w-full bg-[#CA8E25] hover:bg-[#D89A2B] text-black font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2">
              Go to Login <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  // Ensure they have completed the test
  if (test.status !== "SUBMITTED" && test.status !== "REVIEWED") {
    return (
      <main className="min-h-screen bg-[#072147] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-white space-y-6">
          <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto" />
          <h2 className="text-2xl font-black">Test Not Completed</h2>
          <p className="text-slate-400">
            You must complete your placement test before activating your Student and Parent accounts.
          </p>
          <Link href={`/placement-test?studentId=${studentId}&code=${test.testCode}`}>
            <Button className="w-full bg-[#CA8E25] hover:bg-[#D89A2B] text-black font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2">
              Take Placement Test <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const defaultStudentEmail = `${studentId.toLowerCase()}@kaputra.academy`;

  return (
    <main className="min-h-screen bg-[#072147] py-12 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white space-y-8">
        <div className="text-center">
          <div className="inline-flex p-3 bg-[#CA8E25]/10 rounded-full mb-3">
            <KeyRound className="h-10 w-10 text-[#CA8E25]" />
          </div>
          <h2 className="text-3xl font-black tracking-tight">Activate Accounts</h2>
          <p className="mt-2 text-sm text-slate-400">
            Configure passwords for your Student and Parent dashboards.
          </p>
        </div>

        <form action={activateAccounts} className="space-y-6">
          <input type="hidden" name="studentId" value={studentId} />

          {/* Student Account Setup */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-[#CA8E25]">Student Account</h3>
            
            <div className="space-y-1.5">
              <Label>Student ID</Label>
              <Input
                value={studentId}
                disabled
                className="bg-slate-900 border-slate-800 text-slate-400 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="studentEmail">Student Login Email</Label>
              <Input
                id="studentEmail"
                name="studentEmail"
                defaultValue={defaultStudentEmail}
                required
                className="bg-slate-900 border-slate-800 text-white rounded-xl focus-visible:ring-[#CA8E25]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="studentPassword">Student Password</Label>
              <Input
                id="studentPassword"
                name="studentPassword"
                type="password"
                required
                placeholder="••••••••"
                className="bg-slate-900 border-slate-800 text-white rounded-xl focus-visible:ring-[#CA8E25]"
              />
            </div>
          </div>

          {/* Parent Account Setup */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-[#CA8E25]">Parent Account</h3>

            <div className="space-y-1.5">
              <Label>Parent Login Email</Label>
              <Input
                value={test.registration.parentEmail}
                disabled
                className="bg-slate-900 border-slate-800 text-slate-400 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="parentPassword">Parent Password</Label>
              <Input
                id="parentPassword"
                name="parentPassword"
                type="password"
                required
                placeholder="••••••••"
                className="bg-slate-900 border-slate-800 text-white rounded-xl focus-visible:ring-[#CA8E25]"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#CA8E25] hover:bg-[#D89A2B] text-black font-black py-4 rounded-xl text-lg shadow-lg"
          >
            Activate My Accounts
          </Button>
        </form>
      </div>
    </main>
  );
}
