"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, CreditCard } from "lucide-react"
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

interface OutstandingPaymentsProps {
  payments: PaymentRecord[]
  onPaymentUpdate: (paymentId: string, updateData: Partial<PaymentRecord>) => void
}

export function OutstandingPayments({ payments, onPaymentUpdate }: OutstandingPaymentsProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [paymentForm, setPaymentForm] = useState({
    paidAmount: 0,
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "cash" as "cash" | "bank" | "check",
    notes: "",
  })

  const totalOutstanding = payments.reduce((sum, p) => {
    if (p.status === "unpaid") return sum + p.amount
    if (p.status === "partial") return sum + (p.amount - (p.paidAmount || 0))
    return sum
  }, 0)

  const handlePaymentClick = (payment: PaymentRecord) => {
    setSelectedPayment(payment)
    setPaymentForm({
      paidAmount: payment.status === "partial" ? payment.amount - (payment.paidAmount || 0) : payment.amount,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "cash",
      notes: "",
    })
    setIsModalOpen(true)
  }

  const handlePaymentSubmit = () => {
    if (!selectedPayment) return

    const newPaidAmount = (selectedPayment.paidAmount || 0) + paymentForm.paidAmount
    const newStatus = newPaidAmount >= selectedPayment.amount ? "paid" : "partial"

    onPaymentUpdate(selectedPayment.id, {
      status: newStatus,
      paidAmount: newPaidAmount,
      paymentDate: paymentForm.paymentDate,
      paymentMethod: paymentForm.paymentMethod,
      notes: paymentForm.notes,
    })

    setIsModalOpen(false)
    setSelectedPayment(null)
  }

  const getStatusBadge = (payment: PaymentRecord) => {
    if (payment.status === "unpaid") {
      return <Badge variant="destructive">Impayé</Badge>
    }
    if (payment.status === "partial") {
      return (
        <Badge variant="secondary" className="bg-yellow-500">
          Partiel
        </Badge>
      )
    }
    return <Badge variant="default">Payé</Badge>
  }

  const getRemainingAmount = (payment: PaymentRecord) => {
    if (payment.status === "unpaid") return payment.amount
    if (payment.status === "partial") return payment.amount - (payment.paidAmount || 0)
    return 0
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Paiements en Attente</span>
            </div>
            <Badge variant="destructive" className="text-sm">
              {formatCurrency(totalOutstanding)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Tous les paiements sont à jour !</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => handlePaymentClick(payment)}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{payment.studentName}</h4>
                      {getStatusBadge(payment)}
                    </div>
                    <div className="text-sm text-muted-foreground">{payment.academicLevel}</div>
                    {payment.status === "partial" && (
                      <div className="text-xs text-yellow-600 mt-1">
                        Payé: {formatCurrency(payment.paidAmount || 0)} / {formatCurrency(payment.amount)}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-red-500">{formatCurrency(getRemainingAmount(payment))}</div>
                    <div className="text-xs text-muted-foreground">restant</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer un Paiement</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold">{selectedPayment.studentName}</h3>
                <p className="text-sm text-muted-foreground">{selectedPayment.academicLevel}</p>
                <div className="mt-2">
                  <span className="text-sm">Montant total: {formatCurrency(selectedPayment.amount)}</span>
                  {selectedPayment.status === "partial" && (
                    <div className="text-sm text-yellow-600">
                      Déjà payé: {formatCurrency(selectedPayment.paidAmount || 0)}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paidAmount">Montant à Payer</Label>
                  <Input
                    id="paidAmount"
                    type="number"
                    value={paymentForm.paidAmount}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        paidAmount: Number(e.target.value),
                      })
                    }
                    min="0"
                    max={getRemainingAmount(selectedPayment)}
                  />
                </div>

                <div>
                  <Label htmlFor="paymentDate">Date de Paiement</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={paymentForm.paymentDate}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        paymentDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="paymentMethod">Méthode de Paiement</Label>
                <Select
                  value={paymentForm.paymentMethod}
                  onValueChange={(value: any) =>
                    setPaymentForm({
                      ...paymentForm,
                      paymentMethod: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Espèces</SelectItem>
                    <SelectItem value="bank">Virement Bancaire</SelectItem>
                    <SelectItem value="check">Chèque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea
                  id="notes"
                  value={paymentForm.notes}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Notes sur le paiement..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handlePaymentSubmit}>Enregistrer Paiement</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
