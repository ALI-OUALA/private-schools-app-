"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, DollarSign, Calendar, Receipt } from "lucide-react"

export function PaymentSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    currency: "DZD",
    autoReminders: true,
    lateFeesEnabled: true,
    lateFeeAmount: 500,
    reminderDays: 7,
    paymentMethods: {
      cash: true,
      bankTransfer: true,
      check: false,
    },
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handlePaymentMethodChange = (method: string, enabled: boolean) => {
    setSettings((prev) => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: enabled,
      },
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <CreditCard className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-heading font-bold text-foreground">Payment Settings</h2>
      </div>

      {/* Currency & Pricing */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span>Currency & Pricing</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select value={settings.currency} onValueChange={(value) => handleSettingChange("currency", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DZD">DZD - Algerian Dinar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lateFeeAmount">Late Fee Amount</Label>
              <Input
                id="lateFeeAmount"
                type="number"
                value={settings.lateFeeAmount}
                onChange={(e) => handleSettingChange("lateFeeAmount", Number.parseInt(e.target.value))}
                min="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="h-5 w-5 text-blue-600" />
            <span>Payment Methods</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Cash Payments</Label>
              <p className="text-sm text-muted-foreground">Accept cash payments</p>
            </div>
            <Switch
              checked={settings.paymentMethods.cash}
              onCheckedChange={(checked) => handlePaymentMethodChange("cash", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Bank Transfer</Label>
              <p className="text-sm text-muted-foreground">Accept bank transfers</p>
            </div>
            <Switch
              checked={settings.paymentMethods.bankTransfer}
              onCheckedChange={(checked) => handlePaymentMethodChange("bankTransfer", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Check Payments</Label>
              <p className="text-sm text-muted-foreground">Accept check payments</p>
            </div>
            <Switch
              checked={settings.paymentMethods.check}
              onCheckedChange={(checked) => handlePaymentMethodChange("check", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reminders & Late Fees */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <span>Reminders & Late Fees</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Automatic Reminders</Label>
              <p className="text-sm text-muted-foreground">Send payment reminders automatically</p>
            </div>
            <Switch
              checked={settings.autoReminders}
              onCheckedChange={(checked) => handleSettingChange("autoReminders", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Late Fees</Label>
              <p className="text-sm text-muted-foreground">Apply late fees for overdue payments</p>
            </div>
            <Switch
              checked={settings.lateFeesEnabled}
              onCheckedChange={(checked) => handleSettingChange("lateFeesEnabled", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminderDays">Reminder Days Before Due</Label>
            <Input
              id="reminderDays"
              type="number"
              value={settings.reminderDays}
              onChange={(e) => handleSettingChange("reminderDays", Number.parseInt(e.target.value))}
              min="1"
              max="30"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
