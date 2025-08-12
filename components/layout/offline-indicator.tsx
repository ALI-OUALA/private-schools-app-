"use client"

import { useOffline } from "@/hooks/use-offline"

export function OfflineIndicator() {
  const isOffline = useOffline()
  if (!isOffline) return null
  return (
    <div className="bg-destructive text-destructive-foreground text-center py-2 text-sm">
      Vous êtes hors ligne. Certaines fonctionnalités peuvent être indisponibles.
    </div>
  )
}
