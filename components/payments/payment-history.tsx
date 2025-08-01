import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, CreditCard, Banknote, FileText } from "lucide-react"
import { formatCurrency, getInitials } from "@/lib/utils"

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

interface PaymentHistoryProps {
  payments: PaymentRecord[]
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  const sortedPayments = [...payments].sort(
    (a, b) => new Date(b.paymentDate || "").getTime() - new Date(a.paymentDate || "").getTime(),
  )

  const getPaymentMethodIcon = (method?: string) => {
    switch (method) {
      case "cash":
        return <Banknote className="h-4 w-4 text-green-500" />
      case "bank":
        return <CreditCard className="h-4 w-4 text-blue-500" />
      case "check":
        return <FileText className="h-4 w-4 text-purple-500" />
      default:
        return <CreditCard className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getPaymentMethodText = (method?: string) => {
    switch (method) {
      case "cash":
        return "Espèces"
      case "bank":
        return "Virement"
      case "check":
        return "Chèque"
      default:
        return "Non spécifié"
    }
  }

  const totalPaid = payments.reduce((sum, p) => sum + (p.paidAmount || 0), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Historique des Paiements</span>
          </div>
          <Badge variant="default" className="bg-green-500">
            {formatCurrency(totalPaid)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedPayments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun paiement enregistré ce mois-ci</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedPayments.map((payment) => (
              <div key={payment.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(payment.studentName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium truncate">{payment.studentName}</h4>
                    <span className="font-semibold text-green-500">{formatCurrency(payment.paidAmount || 0)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{payment.academicLevel}</span>
                    <div className="flex items-center space-x-2">
                      {getPaymentMethodIcon(payment.paymentMethod)}
                      <span>{getPaymentMethodText(payment.paymentMethod)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                    <span>{payment.paymentDate && new Date(payment.paymentDate).toLocaleDateString("fr-FR")}</span>
                    {payment.notes && (
                      <span className="truncate max-w-32" title={payment.notes}>
                        "{payment.notes}"
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
