
import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl bg-violet-50 px-8 py-14 sm:px-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-violet-500">
              Mulai dengan Corvusion
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Tidak perlu membuat akun baru. Langsung masuk dengan akun Google.
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Masuk, pilih jenis usaha, dan mulai kelola usaha Anda dengan lebih
              sederhana.
            </p>

            <Link
              href="/login"
              className="mt-7 inline-block rounded-lg bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-600"
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
