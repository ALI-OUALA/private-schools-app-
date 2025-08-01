"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/layout/sidebar"
import { GeneralSettings } from "@/components/settings/general-settings"
import { RFIDSettings } from "@/components/settings/rfid-settings"
import { PaymentSettings } from "@/components/settings/payment-settings"
import { BackupSettings } from "@/components/settings/backup-settings"
import { UserManagement } from "@/components/settings/user-management"
import { SystemInfo } from "@/components/settings/system-info"
import { useLanguage } from "@/contexts/language-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Settings, Wifi, CreditCard, Database, Users, Info } from "lucide-react"

export default function SettingsPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("general")

  const tabs = [
    { id: "general", label: t("settings.general"), icon: Settings, component: GeneralSettings },
    { id: "rfid", label: t("settings.rfid"), icon: Wifi, component: RFIDSettings },
    { id: "payments", label: t("settings.payments"), icon: CreditCard, component: PaymentSettings },
    { id: "backup", label: t("settings.backup"), icon: Database, component: BackupSettings },
    { id: "users", label: t("settings.users"), icon: Users, component: UserManagement },
    { id: "system", label: t("settings.systemInfo"), icon: Info, component: SystemInfo },
  ]

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
                  <div className="flex items-center space-x-3">
                    <Settings className="h-8 w-8 text-primary" />
                    <div>
                      <h1 className="text-3xl font-heading font-bold text-foreground">{t("settings.title")}</h1>
                      <p className="text-muted-foreground mt-1">Configurez votre système de gestion éducative</p>
                    </div>
                  </div>
                </div>

                {/* Settings Content */}
                <Card className="glass-card">
                  <CardContent className="p-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <div className="border-b border-border/50">
                        <TabsList className="grid w-full grid-cols-6 bg-transparent h-auto p-0">
                          {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                              <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className="flex flex-col items-center space-y-2 p-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                              >
                                <Icon className="h-5 w-5" />
                                <span className="text-xs font-medium">{tab.label}</span>
                              </TabsTrigger>
                            )
                          })}
                        </TabsList>
                      </div>

                      <div className="p-6">
                        {tabs.map((tab) => {
                          const Component = tab.component
                          return (
                            <TabsContent key={tab.id} value={tab.id} className="mt-0">
                              <Component />
                            </TabsContent>
                          )
                        })}
                      </div>
                    </Tabs>
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
