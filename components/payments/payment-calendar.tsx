"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, TrendingUp } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface PaymentRecord {
  id: string
  studentId: string
  studentName: string
  academicLevel: string
  month: string
  year: number
  amount: number
  status: "paid" | "unpaid" | "partial"
  paidAmount?: number
  paymentDate?: string
  paymentMethod?: "cash" | "bank" | "check"
  notes?: string
}

interface PaymentCalendarProps {
  payments: PaymentRecord[]
  selectedMonth: string
  selectedYear: number
}

export function PaymentCalendar({ payments, selectedMonth, selectedYear }: PaymentCalendarProps) {
  // Group payments by day for calendar view
  const paymentsByDay = payments
    .filter((p) => p.paymentDate)
    .reduce(
      (acc, payment) => {
        const day = new Date(payment.paymentDate!).getDate()
        if (!acc[day]) {
          acc[day] = []
        }
        acc[day].push(payment)
        return acc
      },
      {} as Record<number, PaymentRecord[]>,
    )

  // Get days in month
  const daysInMonth = new Date(
    selectedYear,
    new Date(`${selectedMonth} 1, ${selectedYear}`).getMonth() + 1,
    0,
  ).getDate()
  const firstDayOfMonth = new Date(selectedYear, new Date(`${selectedMonth} 1, ${selectedYear}`).getMonth(), 1).getDay()

  const getDayStatus = (day: number) => {
    const dayPayments = paymentsByDay[day] || []
    if (dayPayments.length === 0) return "empty"

    const totalAmount = dayPayments.reduce((sum, p) => sum + (p.paidAmount || 0), 0)
    if (totalAmount > 10000) return "high"
    if (totalAmount > 5000) return "medium"
    return "low"
  }

  const getDayStatusColor = (status: string) => {
    switch (status) {
      case "high":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-muted"
    }
  }

  const totalDailyRevenue = Object.values(paymentsByDay)
    .flat()
    .reduce((sum, p) => sum + (p.paidAmount || 0), 0)

  const averageDailyRevenue =
    Object.keys(paymentsByDay).length > 0 ? totalDailyRevenue / Object.keys(paymentsByDay).length : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>
              Calendrier des Paiements - {selectedMonth} {selectedYear}
            </span>
          </CardTitle>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Moyenne/jour: {formatCurrency(averageDailyRevenue)}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {/* Day Headers */}
          {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="p-2" />
          ))}

          {/* Days of month */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            const dayPayments = paymentsByDay[day] || []
            const dayRevenue = dayPayments.reduce((sum, p) => sum + (p.paidAmount || 0), 0)
            const status = getDayStatus(day)

            return (
              <div
                key={day}
                className={`
                  relative p-2 rounded-lg border text-center cursor-pointer
                  hover:bg-muted/50 transition-colors
                  ${status !== "empty" ? getDayStatusColor(status) + " text-white" : ""}
                `}
              >
                <div className="text-sm font-medium">{day}</div>
                {dayPayments.length > 0 && (
                  <div className="text-xs mt-1">
                    <div>{dayPayments.length} paiements</div>
                    <div className="font-medium">{formatCurrency(dayRevenue)}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span>Élevé (&gt; 10,000 DA)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-yellow-500" />
            <span>Moyen (5,000-10,000 DA)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span>Faible (&lt; 5,000 DA)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-muted border" />
            <span>Aucun paiement</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
