export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    name: "1 Bulan",
    amount: 37000,
    durationDays: 30,
  },

  QUARTERLY: {
    name: "3 Bulan",
    amount: 99000,
    durationDays: 90,
  },

  YEARLY: {
    name: "12 Bulan",
    amount: 360000,
    durationDays: 365,
  },
} as const

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS
