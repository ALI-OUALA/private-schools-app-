"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, RotateCcw } from "lucide-react"

interface ScanErrorProps {
  message: string
  onReset: () => void
}

export function ScanError({ message, onReset }: ScanErrorProps) {
  return (
    <Card className="border-2 border-red-500 flash-error">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold text-red-500 mb-2">Erreur de Scan</h2>
        </div>

        <div className="mb-8">
          <p className="text-lg font-semibold mb-2">{message}</p>
          <p className="text-sm text-muted-foreground">Veuillez réessayer ou contacter l'administrateur</p>
        </div>

        <Button onClick={onReset} className="flex items-center space-x-2">
          <RotateCcw className="h-4 w-4" />
          <span>Réessayer</span>
        </Button>
      </CardContent>
    </Card>
  )
}
