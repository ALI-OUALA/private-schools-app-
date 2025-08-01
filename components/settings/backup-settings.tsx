"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Database, Download, Upload, Clock, Shield } from "lucide-react"

export function BackupSettings() {
  const { toast } = useToast()
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)
  const [settings, setSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    retentionDays: 30,
    includeImages: true,
    compressBackups: true,
  })

  const handleBackup = async () => {
    setIsBackingUp(true)
    setBackupProgress(0)

    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsBackingUp(false)
          toast({
            title: "Backup Complete",
            description: "Database backup created successfully",
          })
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleRestore = () => {
    toast({
      title: "Restore Feature",
      description: "Database restore functionality will be available soon",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Database className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-heading font-bold text-foreground">Backup & Restore</h2>
      </div>

      {/* Backup Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>Backup Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button onClick={handleBackup} disabled={isBackingUp} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>{isBackingUp ? "Creating Backup..." : "Create Backup"}</span>
            </Button>
            <Button variant="outline" onClick={handleRestore} className="flex items-center space-x-2 bg-transparent">
              <Upload className="h-4 w-4" />
              <span>Restore Backup</span>
            </Button>
          </div>

          {isBackingUp && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Backup Progress</span>
                <span>{backupProgress}%</span>
              </div>
              <Progress value={backupProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Automatic Backup Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>Automatic Backup</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Auto Backup</Label>
              <p className="text-sm text-muted-foreground">Automatically backup database</p>
            </div>
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoBackup: checked }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Backup Frequency</Label>
            <Select
              value={settings.backupFrequency}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, backupFrequency: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Every Hour</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Include Images</Label>
              <p className="text-sm text-muted-foreground">Include student photos in backup</p>
            </div>
            <Switch
              checked={settings.includeImages}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, includeImages: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Compress Backups</Label>
              <p className="text-sm text-muted-foreground">Compress backup files to save space</p>
            </div>
            <Switch
              checked={settings.compressBackups}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, compressBackups: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Backup History */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Recent Backups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 rounded bg-muted/50">
              <span className="text-sm">backup_2024_01_15.db</span>
              <span className="text-xs text-muted-foreground">2 days ago</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-muted/50">
              <span className="text-sm">backup_2024_01_14.db</span>
              <span className="text-xs text-muted-foreground">3 days ago</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-muted/50">
              <span className="text-sm">backup_2024_01_13.db</span>
              <span className="text-xs text-muted-foreground">4 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
