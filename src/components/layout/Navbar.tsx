import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold tracking-wide text-white">
              KAPUTRA
            </span>
            <span className="text-xs font-medium tracking-[0.3em] text-[#F4B218] uppercase">
              Academy
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-white hover:text-[#F4B218] transition-colors"
          >
            Home
          </Link>

          <Link
            href="/catalog"
            className="text-sm font-medium text-white hover:text-[#F4B218] transition-colors"
          >
            Program
          </Link>

          <Link
            href="/contact"
            className="text-sm font-medium text-white hover:text-[#F4B218] transition-colors"
          >
            Contact
          </Link>

          <Link
            href="/about"
            className="text-sm font-medium text-white hover:text-[#F4B218] transition-colors"
          >
            About Us
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button
              variant="ghost"
              className="hidden sm:inline-flex text-white hover:text-[#F4B218] hover:bg-slate-800"
            >
              Sign In
            </Button>
          </Link>

          <Link href="/register">
            <Button className="bg-[#F4B218] hover:bg-[#E0A20A] text-slate-950 font-semibold rounded-full px-6 shadow-md hover:shadow-lg transition-all">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

