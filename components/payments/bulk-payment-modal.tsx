"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, CheckCircle2 } from "lucide-react"
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
}

interface BulkPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (studentIds: string[], paymentData: any) => void
  unpaidPayments: PaymentRecord[]
}

export function BulkPaymentModal({ isOpen, onClose, onSave, unpaidPayments }: BulkPaymentModalProps) {
  const [selectedPayments, setSelectedPayments] = useState<Set<string>>(new Set())
  const [paymentData, setPaymentData] = useState({
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "cash" as "cash" | "bank" | "check",
    notes: "",
  })

  const handlePaymentToggle = (paymentId: string) => {
    const newSelected = new Set(selectedPayments)
    if (newSelected.has(paymentId)) {
      newSelected.delete(paymentId)
    } else {
      newSelected.add(paymentId)
    }
    setSelectedPayments(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedPayments.size === unpaidPayments.length) {
      setSelectedPayments(new Set())
    } else {
      setSelectedPayments(new Set(unpaidPayments.map((p) => p.id)))
    }
  }

  const selectedPaymentRecords = unpaidPayments.filter((p) => selectedPayments.has(p.id))
  const totalAmount = selectedPaymentRecords.reduce((sum, p) => {
    if (p.status === "unpaid") return sum + p.amount
    if (p.status === "partial") return sum + (p.amount - (p.paidAmount || 0))
    return sum
  }, 0)

  const handleSubmit = () => {
    if (selectedPayments.size === 0) return

    const studentIds = selectedPaymentRecords.map((p) => p.studentId)
    onSave(studentIds, paymentData)

    // Reset form
    setSelectedPayments(new Set())
    setPaymentData({
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "cash",
      notes: "",
    })
  }

  const groupByLevel = () => {
    const grouped: Record<string, PaymentRecord[]> = {}
    unpaidPayments.forEach((payment) => {
      if (!grouped[payment.academicLevel]) {
        grouped[payment.academicLevel] = []
      }
      grouped[payment.academicLevel].push(payment)
    })
    return grouped
  }

  const groupedPayments = groupByLevel()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Paiement Groupé</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Selection */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Sélectionner les Étudiants</h3>
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedPayments.size === unpaidPayments.length ? "Désélectionner tout" : "Sélectionner tout"}
              </Button>
            </div>

            {Object.entries(groupedPayments).map(([level, payments]) => (
              <Card key={level}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{level}</span>
                    <Badge variant="secondary">{payments.length} étudiants</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {payments.map((payment) => {
                      const remainingAmount =
                        payment.status === "unpaid" ? payment.amount : payment.amount - (payment.paidAmount || 0)

                      return (
                        <div
                          key={payment.id}
                          className="flex items-center space-x-3 p-2 border rounded hover:bg-muted/50"
                        >
                          <Checkbox
                            checked={selectedPayments.has(payment.id)}
                            onCheckedChange={() => handlePaymentToggle(payment.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{payment.studentName}</span>
                              <span className="font-semibold text-red-500">{formatCurrency(remainingAmount)}</span>
                            </div>
                            {payment.status === "partial" && (
                              <div className="text-xs text-yellow-600">
                                Payé: {formatCurrency(payment.paidAmount || 0)} / {formatCurrency(payment.amount)}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Résumé</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Étudiants sélectionnés:</span>
                  <Badge variant="default">{selectedPayments.size}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Montant total:</span>
                  <span className="font-semibold text-primary">{formatCurrency(totalAmount)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Détails du Paiement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="paymentDate">Date de Paiement</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={paymentData.paymentDate}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        paymentDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="paymentMethod">Méthode de Paiement</Label>
                  <Select
                    value={paymentData.paymentMethod}
                    onValueChange={(value: any) =>
                      setPaymentData({
                        ...paymentData,
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
                    value={paymentData.notes}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Notes sur ce paiement groupé..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={selectedPayments.size === 0} className="flex-1">
                Enregistrer ({selectedPayments.size})
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
