import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle2, Users, Target } from "lucide-react"

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

interface PaymentStatsCardsProps {
  stats: PaymentStats
}

export function PaymentStatsCards({ stats }: PaymentStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Monthly Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenus du Mois</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{formatCurrency(stats.monthlyRevenue)}</div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            {stats.revenueGrowth >= 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
            )}
            <span className={stats.revenueGrowth >= 0 ? "text-green-500" : "text-red-500"}>
              {Math.abs(stats.revenueGrowth).toFixed(1)}%
            </span>
            <span>vs mois dernier</span>
          </div>
        </CardContent>
      </Card>

      {/* Outstanding Amount */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Montant Impayé</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{formatCurrency(stats.outstandingAmount)}</div>
          <p className="text-xs text-muted-foreground">
            {stats.unpaidStudents + stats.partialStudents} étudiants concernés
          </p>
        </CardContent>
      </Card>

      {/* Completion Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taux de Paiement</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">{stats.completionRate.toFixed(1)}%</div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="flex items-center space-x-1">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              <span>{stats.paidStudents} payés</span>
            </div>
            <div className="flex items-center space-x-1">
              <AlertTriangle className="h-3 w-3 text-red-500" />
              <span>{stats.unpaidStudents} impayés</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Status Breakdown */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Répartition</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="default" className="bg-green-500">
                Payés
              </Badge>
              <span className="text-sm font-medium">{stats.paidStudents}</span>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-yellow-500">
                Partiels
              </Badge>
              <span className="text-sm font-medium">{stats.partialStudents}</span>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="destructive">Impayés</Badge>
              <span className="text-sm font-medium">{stats.unpaidStudents}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
