"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Plus, Scan, CreditCard, FileText, Settings, Users } from "lucide-react"

export function QuickActions() {
  const { hasPermission } = useAuth()

  const actions = [
    {
      label: "Nouvel Étudiant",
      icon: Plus,
      href: "/students",
      permission: "students.write",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      label: "Liste Étudiants",
      icon: Users,
      href: "/students",
      permission: "students.read",
      color: "bg-teal-500 hover:bg-teal-600",
    },
    {
      label: "Scanner RFID",
      icon: Scan,
      href: "/scan",
      permission: "scan.access",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      label: "Paiements",
      icon: CreditCard,
      href: "/payments",
      permission: "payments.read",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      label: "Rapports",
      icon: FileText,
      href: "/reports",
      permission: "reports.read",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      label: "Paramètres",
      icon: Settings,
      href: "/settings",
      permission: "settings.read",
      color: "bg-gray-500 hover:bg-gray-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3">
      {actions.map((action) => {
        if (!hasPermission(action.permission)) return null

        const IconComponent = action.icon
        return (
          <Button
            key={action.label}
            variant="outline"
            className="justify-start h-12 glass bg-transparent hover:bg-white/20 dark:hover:bg-slate-800/20 transition-transform duration-200 hover:scale-105 animate-fadeIn"
            onClick={() => (window.location.href = action.href)}
          >
            <div className={`p-2 rounded-lg ${action.color} mr-3`}>
              <IconComponent className="h-4 w-4 text-white" />
            </div>
            <span>{action.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
