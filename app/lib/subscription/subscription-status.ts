import { prisma } from "@/app/lib/prisma"

export type AccessStatus =
  | "TRIAL_ACTIVE"
  | "SUBSCRIPTION_ACTIVE"
  | "TRIAL_EXPIRED"
  | "SUBSCRIPTION_EXPIRED"
  | "NO_ACCESS"

export async function getBusinessAccessStatus(
  businessId: string
): Promise<AccessStatus> {
  const business = await prisma.business.findUnique({
    where: {
      id: businessId,
    },
    select: {
      trialEndsAt: true,
      subscription: {
        select: {
          status: true,
          endDate: true,
        },
      },
    },
  })

  if (!business) {
    return "NO_ACCESS"
  }

  const now = new Date()

  // Paid subscription aktif
  if (
    business.subscription?.status === "ACTIVE" &&
    business.subscription.endDate > now
  ) {
    return "SUBSCRIPTION_ACTIVE"
  }

  // Trial aktif
  if (
    business.trialEndsAt &&
    business.trialEndsAt > now
  ) {
    return "TRIAL_ACTIVE"
  }

  // Subscription sudah expired
  if (
    business.subscription &&
    business.subscription.endDate <= now
  ) {
    return "SUBSCRIPTION_EXPIRED"
  }

  // Trial sudah expired
  if (
    business.trialEndsAt &&
    business.trialEndsAt <= now
  ) {
    return "TRIAL_EXPIRED"
  }

  return "NO_ACCESS"
}
