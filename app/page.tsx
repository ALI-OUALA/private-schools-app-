"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { StatWidget } from "@/components/dashboard/stat-widget"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/hooks/use-auth"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Users, UserCheck, CreditCard, TrendingUp, Activity, Zap } from "lucide-react"

interface DashboardStats {
  totalStudents: number
  presentToday: number
  pendingPayments: number
  monthlyRevenue: number
}

export default function Dashboard() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    presentToday: 0,
    pendingPayments: 0,
    monthlyRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      try {
        // Mock data - replace with real API calls
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setStats({
          totalStudents: 245,
          presentToday: 189,
          pendingPayments: 12,
          monthlyRevenue: 45600,
        })
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

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
                    <div>
                      <h1 className="text-3xl font-heading font-bold text-foreground">{t("dashboard.title")}</h1>
                      <p className="text-muted-foreground mt-2">{t("dashboard.welcome")}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <Activity className="h-3 w-3" />
                        <span>En ligne</span>
                      </Badge>
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Zap className="h-3 w-3" />
                        <span>RFID Actif</span>
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatWidget
                    title={t("dashboard.totalStudents")}
                    value={stats.totalStudents.toString()}
                    icon={Users}
                    trend={{ value: 12, isPositive: true }}
                    loading={loading}
                    className="glass-card"
                  />
                  <StatWidget
                    title={t("dashboard.presentToday")}
                    value={stats.presentToday.toString()}
                    icon={UserCheck}
                    trend={{ value: 8, isPositive: true }}
                    loading={loading}
                    className="glass-card"
                  />
                  <StatWidget
                    title={t("dashboard.pendingPayments")}
                    value={stats.pendingPayments.toString()}
                    icon={CreditCard}
                    trend={{ value: 3, isPositive: false }}
                    loading={loading}
                    className="glass-card"
                  />
                  <StatWidget
                    title={t("dashboard.monthlyRevenue")}
                    value={`${stats.monthlyRevenue.toLocaleString()} DA`}
                    icon={TrendingUp}
                    trend={{ value: 15, isPositive: true }}
                    loading={loading}
                    className="glass-card"
                  />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Activity */}
                  <div className="lg:col-span-2">
                    <Card className="glass-card h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Activity className="h-5 w-5" />
                          <span>{t("dashboard.recentActivity")}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RecentActivity />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <Card className="glass-card h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Zap className="h-5 w-5" />
                          <span>{t("dashboard.quickActions")}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <QuickActions />
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* System Status */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>État du Système</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-200">Base de données</p>
                          <p className="text-xs text-green-600 dark:text-green-400">Connectée</p>
                        </div>
                        <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-200">Lecteur RFID</p>
                          <p className="text-xs text-green-600 dark:text-green-400">Opérationnel</p>
                        </div>
                        <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Sauvegarde</p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">Dernière: Aujourd'hui</p>
                        </div>
                        <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
