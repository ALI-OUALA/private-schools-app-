"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingUp, CreditCard, AlertTriangle, PieChart, BarChart3 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface FinancialData {
  totalRevenue: number
  monthlyRevenue: Array<{ month: string; revenue: number }>
  paymentMethods: Array<{ method: string; amount: number; percentage: number }>
  outstandingAmount: number
  levelRevenue: Array<{ level: string; revenue: number }>
  paymentTrends: Array<{ date: string; amount: number }>
}

interface FinancialReportsProps {
  data: FinancialData
  filters: any
}

export function FinancialReports({ data }: FinancialReportsProps) {
  const averageDailyRevenue = data.paymentTrends.length
    ? data.paymentTrends.reduce((sum, day) => sum + day.amount, 0) / data.paymentTrends.length
    : 0

  const bestRevenueDay = data.paymentTrends.reduce(
    (best, day) => (day.amount > best.amount ? day : best),
    data.paymentTrends[0] || { date: "", amount: 0 },
  )

  const collectionRate = ((data.totalRevenue / (data.totalRevenue + data.outstandingAmount)) * 100).toFixed(1)

  const monthlyGrowth =
    data.monthlyRevenue.length >= 2
      ? ((data.monthlyRevenue[data.monthlyRevenue.length - 1].revenue -
          data.monthlyRevenue[data.monthlyRevenue.length - 2].revenue) /
          data.monthlyRevenue[data.monthlyRevenue.length - 2].revenue) *
        100
      : 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(data.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Période sélectionnée</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Croissance Mensuelle</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${monthlyGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
              {monthlyGrowth >= 0 ? "+" : ""}
              {monthlyGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">vs mois précédent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Recouvrement</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{collectionRate}%</div>
            <Progress value={Number(collectionRate)} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impayés</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatCurrency(data.outstandingAmount)}</div>
            <p className="text-xs text-muted-foreground">À recouvrer</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Évolution des Revenus Mensuels</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{formatCurrency(averageDailyRevenue)}</div>
                <div className="text-sm text-muted-foreground">Moyenne quotidienne</div>
              </div>
              <div className="text-center p-4 bg-green-500/10 rounded-lg">
                <div className="text-2xl font-bold text-green-500">{formatCurrency(bestRevenueDay.amount)}</div>
                <div className="text-sm text-muted-foreground">
                  Meilleur jour ({new Date(bestRevenueDay.date).toLocaleDateString("fr-FR")})
                </div>
              </div>
              <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                <div className="text-2xl font-bold text-blue-500">
                  {data.monthlyRevenue.length > 0
                    ? formatCurrency(data.monthlyRevenue[data.monthlyRevenue.length - 1].revenue)
                    : formatCurrency(0)}
                </div>
                <div className="text-sm text-muted-foreground">Mois actuel</div>
              </div>
            </div>

            {/* Monthly Revenue Chart */}
            <div className="space-y-3">
              {data.monthlyRevenue.map((month) => {
                const maxRevenue = Math.max(...data.monthlyRevenue.map((m) => m.revenue))
                const percentage = (month.revenue / maxRevenue) * 100

                return (
                  <div key={month.month} className="flex items-center space-x-4">
                    <div className="w-20 text-sm text-muted-foreground">{month.month}</div>
                    <div className="flex-1">
                      <div className="w-full bg-muted rounded-full h-8 relative">
                        <div
                          className="bg-primary h-8 rounded-full transition-all flex items-center justify-end pr-3"
                          style={{ width: `${percentage}%` }}
                        >
                          <span className="text-sm font-medium text-primary-foreground">
                            {formatCurrency(month.revenue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods & Level Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Méthodes de Paiement</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.paymentMethods.map((method) => (
                <div key={method.method} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{method.method}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{formatCurrency(method.amount)}</span>
                      <Badge variant="secondary">{method.percentage.toFixed(1)}%</Badge>
                    </div>
                  </div>
                  <Progress value={method.percentage} className="h-2" />
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{formatCurrency(data.totalRevenue)}</div>
                <div className="text-sm text-muted-foreground">Total collecté</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Revenus par Niveau</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.levelRevenue.map((level) => {
                const percentage = (level.revenue / data.totalRevenue) * 100
                const maxRevenue = Math.max(...data.levelRevenue.map((l) => l.revenue))
                const barPercentage = (level.revenue / maxRevenue) * 100

                return (
                  <div key={level.level} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{level.level}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{formatCurrency(level.revenue)}</span>
                        <Badge variant="outline">{percentage.toFixed(1)}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all"
                        style={{ width: `${barPercentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Payment Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Tendances Quotidiennes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.paymentTrends.map((day) => {
              const maxAmount = Math.max(...data.paymentTrends.map((d) => d.amount))
              const percentage = (day.amount / maxAmount) * 100

              return (
                <div key={day.date} className="flex items-center space-x-4">
                  <div className="w-20 text-sm text-muted-foreground">
                    {new Date(day.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" })}
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-muted rounded-full h-6 relative">
                      <div
                        className="bg-green-500 h-6 rounded-full transition-all flex items-center justify-end pr-2"
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="text-xs font-medium text-white">{formatCurrency(day.amount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
