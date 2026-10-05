import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import { authOptions } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"
import ProfileForm from "@/app/features/profile/components/ProfileForm"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      business: {
        select: {
          name: true,
          type: true,
        },
      },
      profile: {
        select: {
          ownerName: true,
          phone: true,
          address: true,
        },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Profile
        </h1>

        <p className="text-sm text-gray-500">
          Kelola informasi toko dan profile.
        </p>
      </div>

      <ProfileForm
        businessName={user.business?.name ?? ""}
        businessType={user.business?.type ?? ""}
        ownerName={user.profile?.ownerName ?? ""}
        phone={user.profile?.phone ?? ""}
        address={user.profile?.address ?? ""}
      />
    </main>
  )
}
