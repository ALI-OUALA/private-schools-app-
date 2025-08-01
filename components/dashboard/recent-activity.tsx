"use client"
import { UserCheck, CreditCard, UserPlus, AlertCircle } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "attendance",
    user: "Ahmed Benali",
    action: "Présence enregistrée",
    time: "Il y a 5 minutes",
    icon: UserCheck,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    id: 2,
    type: "payment",
    user: "Fatima Khelil",
    action: "Paiement reçu - 3000 DA",
    time: "Il y a 12 minutes",
    icon: CreditCard,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    id: 3,
    type: "registration",
    user: "Omar Mansouri",
    action: "Nouvel étudiant inscrit",
    time: "Il y a 1 heure",
    icon: UserPlus,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    id: 4,
    type: "alert",
    user: "Système",
    action: "Paiement en retard détecté",
    time: "Il y a 2 heures",
    icon: AlertCircle,
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const IconComponent = activity.icon
        return (
          <div
            key={activity.id}
            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className={`p-2 rounded-lg ${activity.bgColor}`}>
              <IconComponent className={`h-4 w-4 ${activity.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{activity.user}</p>
              <p className="text-sm text-muted-foreground truncate">{activity.action}</p>
            </div>
            <div className="text-xs text-muted-foreground">{activity.time}</div>
          </div>
        )
      })}
    </div>
  )
}
