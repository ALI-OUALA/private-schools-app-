import { Card, CardContent } from "@/components/ui/card"
import { Scan } from "lucide-react"

export function ScanReady() {
  return (
    <Card className="border-2 border-dashed border-primary/50">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="relative mb-8">
          <div className="pulse-gold rounded-full p-8 bg-primary/10">
            <Scan className="h-16 w-16 text-primary" />
          </div>
        </div>

        <h2 className="font-heading text-2xl font-bold mb-4">En attente de la carte...</h2>

        <p className="text-muted-foreground text-lg mb-6">Approchez la carte RFID du lecteur</p>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Lecteur RFID connecté</span>
        </div>
      </CardContent>
    </Card>
  )
}
