import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Scan } from "lucide-react"

interface ScanReadyProps {
  onStartScan: () => void
  isConnected: boolean
}

export function ScanReady({ onStartScan, isConnected }: ScanReadyProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative mb-8">
        <div className="rounded-full p-8 bg-primary/10 animate-pulse">
          <Scan className="h-16 w-16 text-primary" />
        </div>
      </div>

      <h2 className="font-heading text-2xl font-bold mb-4">Prêt à scanner</h2>

      <p className="text-muted-foreground text-lg mb-6">Cliquez pour commencer le scan RFID</p>

      <Button onClick={onStartScan} className="mb-6">
        <Scan className="h-4 w-4 mr-2" />
        Commencer le Scan
      </Button>

      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <div className={`w-2 h-2 rounded-full animate-pulse ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span>Lecteur RFID {isConnected ? 'connecté' : 'déconnecté'}</span>
      </div>
    </div>
  )
}
