import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-white px-6 pb-24 pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-violet-500">
            Manajemen usaha
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl">
            Aplikasi Kasir Dan Pengelolaan Usaha Hanya Rp37 ribu/Bulan.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-500">
            Corvusion-POS membantu Anda mengelola barang, inventory, penjualan, rekap,
            dan berbagai kebutuhan aktivitas usaha .
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-lg bg-violet-500 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-600"
            >
              Mulai Sekarang
            </Link>

            <a
              href="#features"
              className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Lihat Fitur
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
