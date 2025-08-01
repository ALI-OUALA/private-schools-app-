export const ACADEMIC_LEVELS = ["1ère CEM", "2ème CEM", "3ème CEM", "1ère Lycée", "2ème Lycée", "3ème Lycée"] as const

export type AcademicLevel = (typeof ACADEMIC_LEVELS)[number]

export const PAYMENT_STATUS = {
  PAID: "paid",
  UNPAID: "unpaid",
  PARTIAL: "partial",
} as const

export const SCAN_TYPES = {
  CHECK_IN: "check-in",
  NO_SESSIONS: "no-sessions",
  NOT_FOUND: "not-found",
} as const

export const MONTHS_FR = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
] as const

export const PAYMENT_METHODS = {
  CASH: "cash",
  BANK: "bank",
  CHECK: "check",
} as const
