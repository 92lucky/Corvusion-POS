import { getBusinessAccessStatus } from "./subscription-status"

const businessId = "ISI_ID_BUSINESS_KAMU"

const status = await getBusinessAccessStatus(businessId)

console.log("ACCESS STATUS:", status)
