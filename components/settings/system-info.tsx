"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Info, Monitor, HardDrive, Cpu, MemoryStick, Wifi } from "lucide-react"

interface SystemStats {
  version: string
  platform: string
  uptime: string
  memoryUsage: number
  diskUsage: number
  cpuUsage: number
  networkStatus: "connected" | "disconnected"
}

export function SystemInfo() {
  const [stats, setStats] = useState<SystemStats>({
    version: "1.0.0",
    platform: "Tauri/Web",
    uptime: "2h 34m",
    memoryUsage: 45,
    diskUsage: 23,
    cpuUsage: 12,
    networkStatus: "connected",
  })

  useEffect(() => {
    // Simulate real-time stats updates
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        memoryUsage: Math.max(20, Math.min(80, prev.memoryUsage + (Math.random() - 0.5) * 10)),
        cpuUsage: Math.max(5, Math.min(50, prev.cpuUsage + (Math.random() - 0.5) * 15)),
        diskUsage: prev.diskUsage + Math.random() * 0.1,
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Info className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-heading font-bold text-foreground">System Information</h2>
      </div>

      {/* Application Info */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="h-5 w-5 text-blue-600" />
            <span>Application Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <Badge variant="outline">{stats.version}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform</span>
                <span className="font-medium">{stats.platform}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Uptime</span>
                <span className="font-medium">{stats.uptime}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Database</span>
                <span className="font-medium">SQLite 3.42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Framework</span>
                <span className="font-medium">Next.js 14</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Network</span>
                <div className="flex items-center space-x-2">
                  <Wifi
                    className={`h-4 w-4 ${stats.networkStatus === "connected" ? "text-green-600" : "text-red-600"}`}
                  />
                  <Badge variant={stats.networkStatus === "connected" ? "default" : "destructive"}>
                    {stats.networkStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Performance */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-green-600" />
            <span>System Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">CPU Usage</span>
              </div>
              <span className="text-sm text-muted-foreground">{stats.cpuUsage.toFixed(1)}%</span>
            </div>
            <Progress value={stats.cpuUsage} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <MemoryStick className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Memory Usage</span>
              </div>
              <span className="text-sm text-muted-foreground">{stats.memoryUsage.toFixed(1)}%</span>
            </div>
            <Progress value={stats.memoryUsage} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Disk Usage</span>
              </div>
              <span className="text-sm text-muted-foreground">{stats.diskUsage.toFixed(1)}%</span>
            </div>
            <Progress value={stats.diskUsage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Database Statistics */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Database Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-muted-foreground">Students</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-muted-foreground">Teachers</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-purple-600">1,234</div>
              <div className="text-sm text-muted-foreground">Attendance Records</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-orange-600">89</div>
              <div className="text-sm text-muted-foreground">Payments</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
