import { Card, CardContent } from "@/components/ui/card"
import { Scan } from "lucide-react"

interface ScanReadyProps {
  onStartScan: () => void
  isConnected: boolean
}

export function ScanReady({ onStartScan, isConnected }: ScanReadyProps) {
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
          <div className={`w-2 h-2 rounded-full animate-pulse ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>Lecteur RFID {isConnected ? 'connecté' : 'déconnecté'}</span>
        </div>
      </CardContent>
    </Card>
  )
}
