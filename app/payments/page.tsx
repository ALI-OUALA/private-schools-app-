"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PaymentCalendar } from "@/components/payments/payment-calendar"
import { PaymentHistory } from "@/components/payments/payment-history"
import { OutstandingPayments } from "@/components/payments/outstanding-payments"
import { BulkPaymentModal } from "@/components/payments/bulk-payment-modal"
import { PaymentStatsCards } from "@/components/payments/payment-stats-cards"
import { MONTHS_FR, ACADEMIC_LEVELS, type AcademicLevel } from "@/lib/constants"
import { ArrowLeft, Search, Filter, Download, CreditCard } from "lucide-react"
import Link from "next/link"

interface PaymentRecord {
  id: string
  studentId: string
  studentName: string
  academicLevel: AcademicLevel
  month: string
  year: number
  amount: number
  status: "paid" | "unpaid" | "partial"
  paidAmount?: number
  paymentDate?: string
  paymentMethod?: "cash" | "bank" | "check"
  notes?: string
}

interface PaymentStats {
  totalRevenue: number
  monthlyRevenue: number
  outstandingAmount: number
  paidStudents: number
  unpaidStudents: number
  partialStudents: number
  completionRate: number
  revenueGrowth: number
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [stats, setStats] = useState<PaymentStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    outstandingAmount: 0,
    paidStudents: 0,
    unpaidStudents: 0,
    partialStudents: 0,
    completionRate: 0,
    revenueGrowth: 0,
  })

  const [selectedMonth, setSelectedMonth] = useState(MONTHS_FR[new Date().getMonth()])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedLevel, setSelectedLevel] = useState<AcademicLevel | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPayments()
    calculateStats()
  }, [selectedMonth, selectedYear, selectedLevel])

  const loadPayments = async () => {
    setLoading(true)
    try {
      // Mock data - replace with actual Tauri API call
      const mockPayments: PaymentRecord[] = [
        {
          id: "1",
          studentId: "1",
          studentName: "Ahmed Benali",
          academicLevel: "2ème CEM",
          month: "Mars",
          year: 2024,
          amount: 3000,
          status: "paid",
          paidAmount: 3000,
          paymentDate: "2024-03-05",
          paymentMethod: "cash",
        },
        {
          id: "2",
          studentId: "2",
          studentName: "Fatima Khelil",
          academicLevel: "1ère Lycée",
          month: "Mars",
          year: 2024,
          amount: 3500,
          status: "unpaid",
        },
        {
          id: "3",
          studentId: "3",
          studentName: "Mohamed Saidi",
          academicLevel: "1ère CEM",
          month: "Mars",
          year: 2024,
          amount: 2500,
          status: "partial",
          paidAmount: 1500,
          paymentDate: "2024-03-10",
          paymentMethod: "bank",
        },
        {
          id: "4",
          studentId: "4",
          studentName: "Amina Boudiaf",
          academicLevel: "3ème Lycée",
          month: "Mars",
          year: 2024,
          amount: 4000,
          status: "paid",
          paidAmount: 4000,
          paymentDate: "2024-03-01",
          paymentMethod: "check",
        },
        {
          id: "5",
          studentId: "5",
          studentName: "Yacine Meziani",
          academicLevel: "2ème Lycée",
          month: "Mars",
          year: 2024,
          amount: 3500,
          status: "unpaid",
        },
        {
          id: "6",
          studentId: "1",
          studentName: "Ahmed Benali",
          academicLevel: "2ème CEM",
          month: "Février",
          year: 2024,
          amount: 3000,
          status: "paid",
          paidAmount: 3000,
          paymentDate: "2024-02-05",
          paymentMethod: "cash",
        },
      ]

      setPayments(mockPayments)
    } catch (error) {
      console.error("Error loading payments:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    const currentMonthPayments = payments.filter((p) => p.month === selectedMonth && p.year === selectedYear)

    const totalRevenue = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + (p.paidAmount || 0), 0)

    const monthlyRevenue = currentMonthPayments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + (p.paidAmount || 0), 0)

    const outstandingAmount =
      currentMonthPayments.filter((p) => p.status === "unpaid").reduce((sum, p) => sum + p.amount, 0) +
      currentMonthPayments
        .filter((p) => p.status === "partial")
        .reduce((sum, p) => sum + (p.amount - (p.paidAmount || 0)), 0)

    const paidStudents = currentMonthPayments.filter((p) => p.status === "paid").length
    const unpaidStudents = currentMonthPayments.filter((p) => p.status === "unpaid").length
    const partialStudents = currentMonthPayments.filter((p) => p.status === "partial").length

    const completionRate =
      currentMonthPayments.length > 0 ? ((paidStudents + partialStudents) / currentMonthPayments.length) * 100 : 0

    // Calculate previous month for growth comparison
    const prevMonthIndex = MONTHS_FR.indexOf(selectedMonth) - 1
    const prevMonth = prevMonthIndex >= 0 ? MONTHS_FR[prevMonthIndex] : MONTHS_FR[11]
    const prevYear = prevMonthIndex >= 0 ? selectedYear : selectedYear - 1

    const prevMonthRevenue = payments
      .filter((p) => p.month === prevMonth && p.year === prevYear && p.status === "paid")
      .reduce((sum, p) => sum + (p.paidAmount || 0), 0)

    const revenueGrowth = prevMonthRevenue > 0 ? ((monthlyRevenue - prevMonthRevenue) / prevMonthRevenue) * 100 : 0

    setStats({
      totalRevenue,
      monthlyRevenue,
      outstandingAmount,
      paidStudents,
      unpaidStudents,
      partialStudents,
      completionRate,
      revenueGrowth,
    })
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesMonth = payment.month === selectedMonth && payment.year === selectedYear
    const matchesLevel = selectedLevel === "all" || payment.academicLevel === selectedLevel
    const matchesSearch = searchQuery === "" || payment.studentName.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesMonth && matchesLevel && matchesSearch
  })

  const handleBulkPayment = (studentIds: string[], paymentData: any) => {
    // Update payments for selected students
    const updatedPayments = payments.map((payment) => {
      if (studentIds.includes(payment.studentId) && payment.month === selectedMonth && payment.year === selectedYear) {
        return {
          ...payment,
          status: "paid" as const,
          paidAmount: payment.amount,
          paymentDate: paymentData.paymentDate,
          paymentMethod: paymentData.paymentMethod,
          notes: paymentData.notes,
        }
      }
      return payment
    })

    setPayments(updatedPayments)
    setIsBulkModalOpen(false)
  }

  const exportPayments = () => {
    const csvContent = [
      [
        "Étudiant",
        "Niveau",
        "Mois",
        "Année",
        "Montant",
        "Montant Payé",
        "Statut",
        "Date de Paiement",
        "Méthode",
        "Notes",
      ].join(","),
      ...filteredPayments.map((payment) =>
        [
          payment.studentName,
          payment.academicLevel,
          payment.month,
          payment.year,
          payment.amount,
          payment.paidAmount || 0,
          payment.status,
          payment.paymentDate || "",
          payment.paymentMethod || "",
          payment.notes || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `paiements_${selectedMonth}_${selectedYear}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <div className="page-background relative">
            <div className="relative z-10 h-full overflow-auto">
              <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-8 w-8 text-primary" />
                      <div>
                        <h1 className="text-3xl font-heading font-bold text-foreground">Gestion des Paiements</h1>
                        <p className="text-muted-foreground mt-1">
                          {selectedMonth} {selectedYear} - {filteredPayments.length} paiements
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" onClick={exportPayments}>
                        <Download className="h-4 w-4 mr-2" />
                        Exporter
                      </Button>
                      <Button onClick={() => setIsBulkModalOpen(true)} className="bg-primary hover:bg-primary/90">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Paiement Groupé
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Month/Year Selection */}
                      <div className="flex items-center space-x-2">
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {MONTHS_FR.map((month) => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number.parseInt(value))}>
                          <SelectTrigger className="w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[2024, 2023, 2022].map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Level Filter */}
                      <Select value={selectedLevel} onValueChange={(value: any) => setSelectedLevel(value)}>
                        <SelectTrigger className="w-[180px]">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les niveaux</SelectItem>
                          {ACADEMIC_LEVELS.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Search */}
                      <div className="relative flex-1 min-w-[250px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Rechercher un étudiant..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Main Content */}
                <div className="space-y-6">
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Chargement des paiements...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Stats Cards */}
                      <PaymentStatsCards stats={stats} />

                      {/* Payment Calendar Overview */}
                      <PaymentCalendar payments={filteredPayments} selectedMonth={selectedMonth} selectedYear={selectedYear} />

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Outstanding Payments */}
                        <OutstandingPayments
                          payments={filteredPayments.filter((p) => p.status !== "paid")}
                          onPaymentUpdate={(paymentId, updateData) => {
                            setPayments(payments.map((p) => (p.id === paymentId ? { ...p, ...updateData } : p)))
                          }}
                        />

                        {/* Payment History */}
                        <PaymentHistory payments={filteredPayments.filter((p) => p.status === "paid")} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Bulk Payment Modal */}
                <BulkPaymentModal
                  isOpen={isBulkModalOpen}
                  onClose={() => setIsBulkModalOpen(false)}
                  onSave={handleBulkPayment}
                  unpaidPayments={filteredPayments.filter((p) => p.status !== "paid")}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
