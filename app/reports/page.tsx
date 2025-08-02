"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AttendanceReports } from "@/components/reports/attendance-reports"
import { FinancialReports } from "@/components/reports/financial-reports"
import { StudentReports } from "@/components/reports/student-reports"
import { ReportExport } from "@/components/reports/report-export"
import { DateRangePicker } from "@/components/reports/date-range-picker"
import { ACADEMIC_LEVELS, type AcademicLevel } from "@/lib/constants"
import { ArrowLeft, BarChart3, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"

interface ReportFilters {
  dateRange: {
    from: Date
    to: Date
  }
  academicLevel: AcademicLevel | "all"
  reportType: "attendance" | "financial" | "students" | "overview"
}

interface ReportData {
  attendance: {
    totalSessions: number
    totalCheckIns: number
    attendanceRate: number
    dailyAttendance: Array<{ date: string; checkIns: number }>
    levelBreakdown: Array<{ level: string; attendance: number; total: number }>
    lateArrivals: number
    absentStudents: Array<{ name: string; level: string; lastSeen: string }>
  }
  financial: {
    totalRevenue: number
    monthlyRevenue: Array<{ month: string; revenue: number }>
    paymentMethods: Array<{ method: string; amount: number; percentage: number }>
    outstandingAmount: number
    levelRevenue: Array<{ level: string; revenue: number }>
    paymentTrends: Array<{ date: string; amount: number }>
  }
  students: {
    totalStudents: number
    newStudents: number
    levelDistribution: Array<{ level: string; count: number; percentage: number }>
    retentionRate: number
    averageAge: number
    genderDistribution: Array<{ gender: string; count: number }>
  }
}

export default function ReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(),
    },
    academicLevel: "all",
    reportType: "overview",
  })

  const [reportData, setReportData] = useState<ReportData>({
    attendance: {
      totalSessions: 0,
      totalCheckIns: 0,
      attendanceRate: 0,
      dailyAttendance: [],
      levelBreakdown: [],
      lateArrivals: 0,
      absentStudents: [],
    },
    financial: {
      totalRevenue: 0,
      monthlyRevenue: [],
      paymentMethods: [],
      outstandingAmount: 0,
      levelRevenue: [],
      paymentTrends: [],
    },
    students: {
      totalStudents: 0,
      newStudents: 0,
      levelDistribution: [],
      retentionRate: 0,
      averageAge: 0,
      genderDistribution: [],
    },
  })

  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadReportData()
  }, [filters])

  const loadReportData = async () => {
    setLoading(true)
    try {
      // Mock data - replace with actual Tauri API calls
      const mockData: ReportData = {
        attendance: {
          totalSessions: 450,
          totalCheckIns: 387,
          attendanceRate: 86.0,
          dailyAttendance: [
            { date: "2024-03-01", checkIns: 45 },
            { date: "2024-03-02", checkIns: 52 },
            { date: "2024-03-03", checkIns: 38 },
            { date: "2024-03-04", checkIns: 41 },
            { date: "2024-03-05", checkIns: 47 },
            { date: "2024-03-06", checkIns: 35 },
            { date: "2024-03-07", checkIns: 43 },
          ],
          levelBreakdown: [
            { level: "1ère CEM", attendance: 42, total: 45 },
            { level: "2ème CEM", attendance: 48, total: 52 },
            { level: "3ème CEM", attendance: 35, total: 38 },
            { level: "1ère Lycée", attendance: 38, total: 41 },
            { level: "2ème Lycée", attendance: 32, total: 35 },
            { level: "3ème Lycée", attendance: 34, total: 36 },
          ],
          lateArrivals: 23,
          absentStudents: [
            { name: "Karim Benaissa", level: "2ème CEM", lastSeen: "2024-02-28" },
            { name: "Salma Cherif", level: "1ère Lycée", lastSeen: "2024-03-01" },
            { name: "Omar Djelloul", level: "3ème Lycée", lastSeen: "2024-02-29" },
          ],
        },
        financial: {
          totalRevenue: 156750,
          monthlyRevenue: [
            { month: "Janvier", revenue: 145000 },
            { month: "Février", revenue: 152000 },
            { month: "Mars", revenue: 156750 },
          ],
          paymentMethods: [
            { method: "Espèces", amount: 89500, percentage: 57.1 },
            { method: "Virement", amount: 45200, percentage: 28.8 },
            { method: "Chèque", amount: 22050, percentage: 14.1 },
          ],
          outstandingAmount: 23400,
          levelRevenue: [
            { level: "1ère CEM", revenue: 22500 },
            { level: "2ème CEM", revenue: 31200 },
            { level: "3ème CEM", revenue: 19000 },
            { level: "1ère Lycée", revenue: 28700 },
            { level: "2ème Lycée", revenue: 24500 },
            { level: "3ème Lycée", revenue: 30850 },
          ],
          paymentTrends: [
            { date: "2024-03-01", amount: 12500 },
            { date: "2024-03-02", amount: 8900 },
            { date: "2024-03-03", amount: 15600 },
            { date: "2024-03-04", amount: 11200 },
            { date: "2024-03-05", amount: 9800 },
            { date: "2024-03-06", amount: 13400 },
            { date: "2024-03-07", amount: 10300 },
          ],
        },
        students: {
          totalStudents: 247,
          newStudents: 18,
          levelDistribution: [
            { level: "1ère CEM", count: 45, percentage: 18.2 },
            { level: "2ème CEM", count: 52, percentage: 21.1 },
            { level: "3ème CEM", count: 38, percentage: 15.4 },
            { level: "1ère Lycée", count: 41, percentage: 16.6 },
            { level: "2ème Lycée", count: 35, percentage: 14.2 },
            { level: "3ème Lycée", count: 36, percentage: 14.6 },
          ],
          retentionRate: 94.2,
          averageAge: 15.3,
          genderDistribution: [
            { gender: "Filles", count: 128 },
            { gender: "Garçons", count: 119 },
          ],
        },
      }

      setReportData(mockData)
    } catch (error) {
      console.error("Error loading report data:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateFilters = (newFilters: Partial<ReportFilters>) => {
    setFilters({ ...filters, ...newFilters })
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
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <h1 className="text-3xl font-heading font-bold text-foreground">Rapports & Analyses</h1>
                        <p className="text-muted-foreground mt-1">
                          Période: {filters.dateRange.from.toLocaleDateString("fr-FR")} -{" "}
                          {filters.dateRange.to.toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ReportExport reportData={reportData} filters={filters} />
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-center gap-4">
                      <DateRangePicker
                        dateRange={filters.dateRange}
                        onDateRangeChange={(dateRange) => updateFilters({ dateRange })}
                      />

                      <Select value={filters.academicLevel} onValueChange={(value: any) => updateFilters({ academicLevel: value })}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Niveau académique" />
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

                      <Button
                        variant="outline"
                        onClick={() => loadReportData()}
                        disabled={loading}
                        className="flex items-center space-x-2"
                      >
                        <TrendingUp className="h-4 w-4" />
                        <span>Actualiser</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Main Content */}
                <div className="space-y-6">
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Génération des rapports...</p>
                      </div>
                    </div>
                  ) : (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview" className="flex items-center space-x-2">
                          <BarChart3 className="h-4 w-4" />
                          <span>Vue d'ensemble</span>
                        </TabsTrigger>
                        <TabsTrigger value="attendance" className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Présences</span>
                        </TabsTrigger>
                        <TabsTrigger value="financial" className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4" />
                          <span>Financier</span>
                        </TabsTrigger>
                        <TabsTrigger value="students" className="flex items-center space-x-2">
                          <BarChart3 className="h-4 w-4" />
                          <span>Étudiants</span>
                        </TabsTrigger>
                      </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taux de Présence</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">{reportData.attendance.attendanceRate}%</div>
                    <p className="text-xs text-muted-foreground">
                      {reportData.attendance.totalCheckIns} / {reportData.attendance.totalSessions} sessions
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      {reportData.financial.totalRevenue.toLocaleString("fr-FR")} DA
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {reportData.financial.outstandingAmount.toLocaleString("fr-FR")} DA en attente
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Étudiants</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-500">{reportData.students.totalStudents}</div>
                    <p className="text-xs text-muted-foreground">+{reportData.students.newStudents} ce mois</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taux de Rétention</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-500">{reportData.students.retentionRate}%</div>
                    <p className="text-xs text-muted-foreground">Âge moyen: {reportData.students.averageAge} ans</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Overview Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Présences par Niveau</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {reportData.attendance.levelBreakdown.map((level) => {
                        const percentage = (level.attendance / level.total) * 100
                        return (
                          <div key={level.level} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>{level.level}</span>
                              <span>
                                {level.attendance}/{level.total} ({percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenus par Niveau</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {reportData.financial.levelRevenue.map((level) => {
                        const percentage = (level.revenue / reportData.financial.totalRevenue) * 100
                        return (
                          <div key={level.level} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>{level.level}</span>
                              <span>
                                {level.revenue.toLocaleString("fr-FR")} DA ({percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="attendance">
              <AttendanceReports data={reportData.attendance} filters={filters} />
            </TabsContent>

            <TabsContent value="financial">
              <FinancialReports data={reportData.financial} filters={filters} />
            </TabsContent>

            <TabsContent value="students">
              <StudentReports data={reportData.students} filters={filters} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
