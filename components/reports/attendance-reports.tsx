"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Users, Clock, AlertTriangle, TrendingUp, UserCheck } from "lucide-react"

interface AttendanceData {
  totalSessions: number
  totalCheckIns: number
  attendanceRate: number
  dailyAttendance: Array<{ date: string; checkIns: number }>
  levelBreakdown: Array<{ level: string; attendance: number; total: number }>
  lateArrivals: number
  absentStudents: Array<{ name: string; level: string; lastSeen: string }>
}

interface AttendanceReportsProps {
  data: AttendanceData
  filters: any
}

export function AttendanceReports({ data }: AttendanceReportsProps) {
  const averageDailyAttendance = data.dailyAttendance.length
    ? data.dailyAttendance.reduce((sum, day) => sum + day.checkIns, 0) / data.dailyAttendance.length
    : 0

  const bestAttendanceDay = data.dailyAttendance.reduce(
    (best, day) => (day.checkIns > best.checkIns ? day : best),
    data.dailyAttendance[0] || { date: "", checkIns: 0 },
  )

  const worstAttendanceDay = data.dailyAttendance.reduce(
    (worst, day) => (day.checkIns < worst.checkIns ? day : worst),
    data.dailyAttendance[0] || { date: "", checkIns: 0 },
  )

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions Totales</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalSessions}</div>
            <p className="text-xs text-muted-foreground">Sessions programmées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Présences</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{data.totalCheckIns}</div>
            <p className="text-xs text-muted-foreground">Check-ins enregistrés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Présence</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.attendanceRate.toFixed(1)}%</div>
            <Progress value={data.attendanceRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retards</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{data.lateArrivals}</div>
            <p className="text-xs text-muted-foreground">Arrivées tardives</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Attendance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Présences Quotidiennes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{averageDailyAttendance.toFixed(0)}</div>
                <div className="text-sm text-muted-foreground">Moyenne quotidienne</div>
              </div>
              <div className="text-center p-4 bg-green-500/10 rounded-lg">
                <div className="text-2xl font-bold text-green-500">{bestAttendanceDay.checkIns}</div>
                <div className="text-sm text-muted-foreground">
                  Meilleur jour ({new Date(bestAttendanceDay.date).toLocaleDateString("fr-FR")})
                </div>
              </div>
              <div className="text-center p-4 bg-red-500/10 rounded-lg">
                <div className="text-2xl font-bold text-red-500">{worstAttendanceDay.checkIns}</div>
                <div className="text-sm text-muted-foreground">
                  Plus faible ({new Date(worstAttendanceDay.date).toLocaleDateString("fr-FR")})
                </div>
              </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="space-y-3">
              {data.dailyAttendance.map((day, index) => {
                const percentage = (day.checkIns / Math.max(...data.dailyAttendance.map((d) => d.checkIns))) * 100
                return (
                  <div key={day.date} className="flex items-center space-x-4">
                    <div className="w-20 text-sm text-muted-foreground">
                      {new Date(day.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" })}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="w-full bg-muted rounded-full h-6 relative">
                          <div
                            className="bg-primary h-6 rounded-full transition-all flex items-center justify-end pr-2"
                            style={{ width: `${percentage}%` }}
                          >
                            <span className="text-xs font-medium text-primary-foreground">{day.checkIns}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Présences par Niveau</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.levelBreakdown.map((level) => {
                const percentage = (level.attendance / level.total) * 100
                const status = percentage >= 90 ? "excellent" : percentage >= 75 ? "good" : "needs-attention"

                return (
                  <div key={level.level} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{level.level}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          {level.attendance}/{level.total}
                        </span>
                        <Badge
                          variant={status === "excellent" ? "default" : status === "good" ? "secondary" : "destructive"}
                          className={
                            status === "excellent" ? "bg-green-500" : status === "good" ? "bg-yellow-500" : "bg-red-500"
                          }
                        >
                          {percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Absent Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Étudiants Absents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.absentStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Tous les étudiants sont présents !</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.absentStudents.map((student, index) => {
                  const daysSinceLastSeen = Math.floor(
                    (new Date().getTime() - new Date(student.lastSeen).getTime()) / (1000 * 60 * 60 * 24),
                  )

                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.level}</div>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive" className="mb-1">
                          {daysSinceLastSeen} jours
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          Dernière présence: {new Date(student.lastSeen).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
