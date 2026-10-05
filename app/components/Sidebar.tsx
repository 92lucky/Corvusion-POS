
"use client"

import Link from "next/link"
import { useState } from "react"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Truck,
  BarChart3,
  UserCircle,
  LogOut,
  Menu,
  X,
  ShoppingCartIcon,
} from "lucide-react"

const menus = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Kasir",
    href: "/kasir",
    icon: ShoppingCart,
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    label: "Customer",
    href: "/customer",
    icon: Users,
  },
  {
    label: "Pembelian",
    href: "/pembelian",
    icon: ShoppingCartIcon,
  },
  {
    label: "Supplier",
    href: "/supplier",
    icon: Truck,
  },
  {
    label: "Laporan",
    href: "/laporan",
    icon: BarChart3,
  },
]

export default function Sidebar({
  businessName,
}: {
  businessName: string
}) {
  const [open, setOpen] = useState(false)

  function closeMenu() {
    setOpen(false)
  }

  async function handleLogout() {
    closeMenu()

    await signOut({
      callbackUrl: "/login",
    })
  }

  const initial = businessName
    ? businessName.charAt(0).toUpperCase()
    : "C"

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center border-b border-slate-200 bg-white px-4 md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Buka menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="ml-3 flex min-w-0 items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500 text-xs font-bold text-white">
            {initial}
          </div>

          <span className="truncate text-sm font-bold text-slate-900">
            {businessName}
          </span>
        </div>
      </header>

      {open && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-60 flex-col
          border-r border-slate-200 bg-white px-3 py-4
          transition-transform duration-200
          md:sticky md:top-0 md:h-screen md:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="mb-7 flex items-center justify-between px-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500 text-sm font-bold text-white">
              {initial}
            </div>

            <div className="min-w-0 leading-none">
              <p className="truncate text-sm font-bold text-slate-900">
                {businessName}
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                Business Management
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeMenu}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 md:hidden"
            aria-label="Tutup menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Menu
        </div>

        <nav className="space-y-0.5">
          {menus.map((menu) => {
            const Icon = menu.icon

            return (
              <Link
                key={menu.href}
                href={menu.href}
                onClick={closeMenu}
                className="group flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium text-slate-600 transition hover:bg-violet-50 hover:text-violet-600"
              >
                <Icon
                  className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-violet-500"
                  strokeWidth={1.8}
                />

                <span>{menu.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto border-t border-slate-100 pt-3">
          <Link
            href="/profile"
            onClick={closeMenu}
            className="group flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <UserCircle
              className="h-4 w-4 text-slate-400"
              strokeWidth={1.8}
            />

            Profile
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="group mt-0.5 flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium text-red-500 transition hover:bg-red-50"
          >
            <LogOut
              className="h-4 w-4"
              strokeWidth={1.8}
            />

            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
