"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { ScanReady } from "@/components/scan/scan-ready"
import { ScanSuccess } from "@/components/scan/scan-success"
import { ScanError } from "@/components/scan/scan-error"
import { useLanguage } from "@/contexts/language-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { rfidManager, type RFIDScanResult, type RFIDStatus } from "@/lib/rfid-manager"
import { Wifi, WifiOff, Scan, History, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ScanPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [status, setStatus] = useState<RFIDStatus>("idle")
  const [lastResult, setLastResult] = useState<RFIDScanResult | null>(null)
  const [scanHistory, setScanHistory] = useState<RFIDScanResult[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Subscribe to RFID status changes
    const unsubscribeStatus = rfidManager.onStatusChange(setStatus)
    const unsubscribeResults = rfidManager.onScanResult((result) => {
      setLastResult(result)
      setScanHistory((prev) => [result, ...prev.slice(0, 9)]) // Keep last 10 results
    })

    // Check connection status
    const checkConnection = async () => {
      const connected = await rfidManager.testConnection()
      setIsConnected(connected)
    }

    checkConnection()
    const connectionInterval = setInterval(checkConnection, 30000) // Check every 30 seconds

    // Load initial scan history
    setScanHistory(rfidManager.getScanHistory().slice(0, 10))

    return () => {
      unsubscribeStatus()
      unsubscribeResults()
      clearInterval(connectionInterval)
    }
  }, [])

  const handleStartScan = async () => {
    try {
      await rfidManager.startScanning()
    } catch (error) {
      console.error("Error starting scan:", error)
    }
  }

  const handleStopScan = () => {
    rfidManager.stopScanning()
  }

  const renderScanContent = () => {
    switch (status) {
      case "scanning":
        return (
          <div className="text-center space-y-4">
            <div className="animate-pulse">
              <Scan className="h-16 w-16 mx-auto text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold">{t("rfid.scanning")}</h3>
            <p className="text-muted-foreground">{t("rfid.placeCard")}</p>
            <Button onClick={handleStopScan} variant="outline">
              Arrêter
            </Button>
          </div>
        )
      case "success":
        return lastResult ? <ScanSuccess result={lastResult} onNewScan={handleStartScan} /> : null
      case "error":
        return lastResult ? <ScanError result={lastResult} onRetry={handleStartScan} /> : null
      default:
        return <ScanReady onStartScan={handleStartScan} isConnected={isConnected} />
    }
  }

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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Scan className="h-8 w-8 text-primary" />
                      <div>
                        <h1 className="text-3xl font-heading font-bold text-foreground">{t("rfid.title")}</h1>
                        <p className="text-muted-foreground mt-1">Scanner les cartes RFID des étudiants</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center space-x-1">
                        {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                        <span>{isConnected ? "Connecté" : "Déconnecté"}</span>
                      </Badge>
                      {rfidManager.isInMockMode() && <Badge variant="secondary">Mode Démo</Badge>}
                      <Button variant="outline" size="sm" onClick={() => router.push("/settings")}>
                        <Settings className="h-4 w-4 mr-2" />
                        Paramètres
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Scan Area */}
                  <div className="lg:col-span-2">
                    <Card className="glass-card h-full min-h-[500px]">
                      <CardContent className="p-8 flex items-center justify-center">{renderScanContent()}</CardContent>
                    </Card>
                  </div>

                  {/* Scan History */}
                  <div>
                    <Card className="glass-card h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <History className="h-5 w-5" />
                          <span>Historique des Scans</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {scanHistory.length === 0 ? (
                          <p className="text-muted-foreground text-center py-8">Aucun scan récent</p>
                        ) : (
                          scanHistory.map((result, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg border ${
                                result.success
                                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  {result.success && result.studentInfo ? (
                                    <div>
                                      <p className="font-medium text-sm">{result.studentInfo.name}</p>
                                      <p className="text-xs text-muted-foreground">{result.cardId}</p>
                                    </div>
                                  ) : (
                                    <div>
                                      <p className="font-medium text-sm text-red-600 dark:text-red-400">
                                        Échec du scan
                                      </p>
                                      <p className="text-xs text-muted-foreground">{result.error}</p>
                                    </div>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {result.timestamp.toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Status Information */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Informations du Système RFID</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Mode de fonctionnement</p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            {rfidManager.isInMockMode() ? "Démonstration" : "Production"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-200">Scans aujourd'hui</p>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            {scanHistory.filter((r) => r.success).length} réussis
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Statut actuel</p>
                          <p className="text-xs text-purple-600 dark:text-purple-400">
                            {status === "idle" && "En attente"}
                            {status === "scanning" && "Scan en cours"}
                            {status === "success" && "Succès"}
                            {status === "error" && "Erreur"}
                          </p>
                        </div>
                      </div>
                    </div>
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
