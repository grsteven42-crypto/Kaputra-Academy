"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";

export default function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchParams.get("activated") === "true") {
            setSuccess("Account activated successfully! Please log in.");
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const res = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Invalid credentials. Please try again.");
            setLoading(false);
        } else {
            const sessionRes = await fetch("/api/auth/session");
            const session = await sessionRes.json();
            setLoading(false);

            if (session?.user?.role) {
                const role = session.user.role;

                if (role === "ADMIN") {
                    router.push("/admin");
                } else if (role === "STUDENT") {
                    router.push("/student");
                } else if (role === "PARENT") {
                    router.push("/parent");
                } else if (role === "TEACHER") {
                    router.push("/teacher");
                } else {
                    router.push("/");
                }
            } else {
                router.push("/");
            }
        }
    };

    return (
        <main className="min-h-screen bg-[#072147] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl p-8 text-white space-y-6">
                <div className="text-center">
                    <Link href="/" className="inline-block mb-3">
                        <span className="text-2xl font-black tracking-wide text-white block">
                            KAPUTRA
                        </span>
                        <span className="text-xs font-semibold tracking-[0.2em] text-[#CA8E25] uppercase">
                            Academy
                        </span>
                    </Link>

                    <h2 className="text-xl font-bold mt-2">
                        Sign in to your account
                    </h2>
                </div>

                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                        <span>{success}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="username">
                            Username, Email, or Student ID
                        </Label>

                        <Input
                            id="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="e.g. KPA-2026-0001 or parent@example.com"
                            className="bg-slate-950 border-slate-800 text-white rounded-xl placeholder:text-slate-700 focus-visible:ring-[#CA8E25]"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                        </div>

                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-slate-950 border-slate-800 text-white rounded-xl placeholder:text-slate-700 focus-visible:ring-[#CA8E25]"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#CA8E25] hover:bg-[#D89A2B] text-black font-bold py-3.5 rounded-xl shadow-lg transition-all text-base flex items-center justify-center gap-2"
                    >
                        <Lock className="h-4 w-4" />

                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
            </div>
        </main>
    );
}