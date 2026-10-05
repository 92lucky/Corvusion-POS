"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          {/* Logo */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500 text-lg font-bold text-white">
              C
            </div>

            <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
              Masuk ke Corvusion
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Kelola bisnis, inventory, dan transaksi
              Anda dalam satu aplikasi.
            </p>
          </div>

          {/* Login */}
          <button
            onClick={() =>
              signIn("google", {
                callbackUrl: "/profile",
              })
            }
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M21.35 12.23c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.26Z"
              />
              <path
                fill="#34A853"
                d="M12 21.6c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.6Z"
              />
              <path
                fill="#FBBC05"
                d="M6.54 13.69a5.85 5.85 0 0 1 0-3.38V7.78H3.3a9.76 9.76 0 0 0 0 8.44l3.24-2.53Z"
              />
              <path
                fill="#EA4335"
                d="M12 6.28c1.43 0 2.72.49 3.73 1.46l2.8-2.8C16.83 3.4 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.28l3.24 2.53C7.31 8 9.46 6.28 12 6.28Z"
              />
            </svg>

            Lanjutkan dengan Google
          </button>

          <p className="mt-6 text-center text-xs leading-5 text-slate-400">
            Dengan melanjutkan, Anda menyetujui ketentuan
            penggunaan dan kebijakan privasi Corvusion.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © 2026 Corvusion
        </p>
      </div>
    </main>
  );
}
