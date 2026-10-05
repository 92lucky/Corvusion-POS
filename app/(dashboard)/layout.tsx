import { redirect } from "next/navigation"
import Sidebar from "../components/Sidebar"
import { getCurrentUser } from "@/app/lib/auth/current-user"
//import { getBusinessAccessStatus } from "@/app/lib/subscription/subscription-status"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    redirect("/profile")
  }

  // const status = await getBusinessAccessStatus(user.businessId)

  // if (
  //   status === "TRIAL_EXPIRED" ||
  //   status === "SUBSCRIPTION_EXPIRED" ||
  //   status === "NO_ACCESS"
  // ) {
  //   redirect("/choose-plan")
  // }

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <Sidebar
        businessName={user.business?.name ?? "Corvusion"}
      />

      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
