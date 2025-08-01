"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { rfidManager } from "@/lib/rfid-manager"
import { Wifi, WifiOff, Volume2, Lightbulb, Settings, TestTube, Zap } from "lucide-react"

interface RFIDSettingsState {
  readerType: "JT308" | "RC522" | "PN532"
  comPort: string
  baudRate: number
  autoConnect: boolean
  scanTimeout: number
  enableSound: boolean
  enableLed: boolean
  mockMode: boolean
}

export function RFIDSettings() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [availablePorts, setAvailablePorts] = useState(["COM1", "COM2", "COM3", "COM4"])
  const [lastCardRead, setLastCardRead] = useState<string | null>(null)
  const [settings, setSettings] = useState<RFIDSettingsState>({
    readerType: "JT308",
    comPort: "COM3",
    baudRate: 115200,
    autoConnect: true,
    scanTimeout: 3000,
    enableSound: true,
    enableLed: true,
    mockMode: true,
  })


  useEffect(() => {
    // Listen for card reads
    const handleCardRead = (cardId: string) => {
      setLastCardRead(cardId)
      if (settings.enableSound) {
        // Play sound effect
        const audio = new Audio("/sounds/beep.mp3")
        audio.play().catch(() => {}) // Ignore errors
      }
    }

    // rfidManager.on("cardRead", handleCardRead)

    return () => {
      // rfidManager.off("cardRead", handleCardRead)
    }
  }, [settings])

  const handleSettingChange = (field: keyof RFIDSettingsState, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const testConnection = async () => {
    setIsConnecting(true)
    try {
      const success = await rfidManager.testConnection()
      setIsConnected(success)

      toast({
        title: success ? "Connection Successful" : "Connection Failed",
        description: success
          ? "RFID reader is connected and working properly"
          : "Unable to connect to RFID reader. Check settings.",
        variant: success ? "default" : "destructive",
      })
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "An error occurred while testing connection",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const scanPorts = async () => {
    // Simulate port scanning
    const ports = ["COM1", "COM2", "COM3", "COM4", "COM5", "COM6"]
    setAvailablePorts(ports)
    toast({
      title: "Scan Complete",
      description: `${ports.length} ports detected`,
    })
  }

  const startTestScan = async () => {
    try {
      await rfidManager.startScanning()
      toast({
        title: "Test Scan Started",
        description: "Place an RFID card near the reader",
      })
    } catch (error) {
      toast({
        title: "Scan Error",
        description: "Unable to start scanning",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Wifi className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-heading font-bold text-foreground">{t("settings.rfid")}</h2>
      </div>

      {/* Connection Status */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>RFID Connection Status</span>
            </div>
            <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center space-x-1">
              {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              <span>{isConnected ? "Connected" : "Disconnected"}</span>
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Button onClick={testConnection} disabled={isConnecting}>
              {isConnecting ? "Testing..." : "Test Connection"}
            </Button>
            <Button variant="outline" onClick={scanPorts}>
              Scan Ports
            </Button>
            <Button variant="outline" onClick={startTestScan}>
              <TestTube className="h-4 w-4 mr-2" />
              Test Scan
            </Button>
          </div>

          {settings.mockMode && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Mock Mode Enabled</span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                Using simulated RFID reader for development and testing
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hardware Configuration */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Hardware Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="readerType">Reader Type</Label>
              <Select value={settings.readerType} onValueChange={(value) => handleSettingChange("readerType", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JT308">JT308 (Recommended)</SelectItem>
                  <SelectItem value="RC522">RC522</SelectItem>
                  <SelectItem value="PN532">PN532</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comPort">COM Port</Label>
              <Select value={settings.comPort} onValueChange={(value) => handleSettingChange("comPort", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availablePorts.map((port) => (
                    <SelectItem key={port} value={port}>
                      {port}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baudRate">Baud Rate</Label>
              <Select
                value={settings.baudRate.toString()}
                onValueChange={(value) => handleSettingChange("baudRate", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9600">9600 bps</SelectItem>
                  <SelectItem value="19200">19200 bps</SelectItem>
                  <SelectItem value="38400">38400 bps</SelectItem>
                  <SelectItem value="57600">57600 bps</SelectItem>
                  <SelectItem value="115200">115200 bps</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scanTimeout">Scan Timeout (ms)</Label>
              <Input
                id="scanTimeout"
                type="number"
                value={settings.scanTimeout}
                onChange={(e) => handleSettingChange("scanTimeout", Number.parseInt(e.target.value))}
                min="1000"
                max="10000"
                step="500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Behavior Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Behavior Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="mockMode">Mock Mode</Label>
              <p className="text-sm text-muted-foreground">Use simulated RFID reader for testing</p>
            </div>
            <Switch
              id="mockMode"
              checked={settings.mockMode}
              onCheckedChange={(checked) => handleSettingChange("mockMode", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="autoConnect">Auto Connect</Label>
              <p className="text-sm text-muted-foreground">Connect automatically on startup</p>
            </div>
            <Switch
              id="autoConnect"
              checked={settings.autoConnect}
              onCheckedChange={(checked) => handleSettingChange("autoConnect", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4" />
                <Label htmlFor="enableSound">Sound Feedback</Label>
              </div>
              <p className="text-sm text-muted-foreground">Play sound when card is read</p>
            </div>
            <Switch
              id="enableSound"
              checked={settings.enableSound}
              onCheckedChange={(checked) => handleSettingChange("enableSound", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-4 w-4" />
                <Label htmlFor="enableLed">LED Indicator</Label>
              </div>
              <p className="text-sm text-muted-foreground">Enable reader LED indicator</p>
            </div>
            <Switch
              id="enableLed"
              checked={settings.enableLed}
              onCheckedChange={(checked) => handleSettingChange("enableLed", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Test Section */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TestTube className="h-5 w-5" />
            <span>Reader Test</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Use this section to test RFID card reading</p>
          <div className="p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">Place an RFID card near the reader</p>
            <div className="text-xs text-muted-foreground">
              {lastCardRead ? (
                <>
                  Last card read: <span className="font-mono text-primary">{lastCardRead}</span>
                  <span className="ml-2 text-green-600">✓ Success</span>
                </>
              ) : (
                <span className="text-orange-600">No card detected yet</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
