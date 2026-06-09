import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#CA8E25]/20 bg-[#072147]/85 backdrop-blur-xl shadow-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold tracking-wide text-white">
              KAPUTRA
            </span>
            <span className="text-xs font-medium tracking-[0.3em] text-[#CA8E25] uppercase">
              Academy
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-white hover:text-[#CA8E25] transition-colors"
          >
            Home
          </Link>

          <Link
            href="/catalog"
            className="text-sm font-medium text-white hover:text-[#CA8E25] transition-colors"
          >
            Program
          </Link>

          <Link
            href="/contact"
            className="text-sm font-medium text-white hover:text-[#CA8E25] transition-colors"
          >
            Contact
          </Link>

          <Link
            href="/about"
            className="text-sm font-medium text-white hover:text-[#CA8E25] transition-colors"
          >
            About Us
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button
              variant="ghost"
              className="hidden sm:inline-flex text-white hover:text-[#CA8E25] hover:bg-white/10"
            >
              Log In
            </Button>
          </Link>

          <Link href="/register">
            <Button className="bg-[#CA8E25] hover:bg-[#D89A2B] text-black font-semibold rounded-full px-6 shadow-md hover:shadow-lg transition-all">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}