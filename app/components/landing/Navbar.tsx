import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-slate-900"
        >
          Corvusion-POS
        </Link>

        <div className="flex items-center gap-7 text-sm">
          <Link
            href="#features"
            className="text-slate-500 transition hover:text-slate-900"
          >
            Fitur
          </Link>

          <Link
            href="/login"
            className="rounded-lg bg-violet-500 px-4 py-2.5 font-medium text-white transition hover:bg-violet-600"
          >
            Masuk
          </Link>
        </div>
      </nav>
    </header>
  );
}
