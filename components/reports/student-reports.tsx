"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, UserPlus, TrendingUp, PieChart, BarChart3, Target } from "lucide-react"

interface StudentData {
  totalStudents: number
  newStudents: number
  levelDistribution: Array<{ level: string; count: number; percentage: number }>
  retentionRate: number
  averageAge: number
  genderDistribution: Array<{ gender: string; count: number }>
}

interface StudentReportsProps {
  data: StudentData
  filters: any
}

export function StudentReports({ data }: StudentReportsProps) {
  const genderPercentages = data.genderDistribution.map((gender) => ({
    ...gender,
    percentage: (gender.count / data.totalStudents) * 100,
  }))

  const mostPopularLevel = data.levelDistribution.reduce(
    (max, level) => (level.count > max.count ? level : max),
    data.levelDistribution[0] || { level: "", count: 0, percentage: 0 },
  )

  const leastPopularLevel = data.levelDistribution.reduce(
    (min, level) => (level.count < min.count ? level : min),
    data.levelDistribution[0] || { level: "", count: 0, percentage: 0 },
  )

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Étudiants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Étudiants inscrits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux Étudiants</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+{data.newStudents}</div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Rétention</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{data.retentionRate}%</div>
            <Progress value={data.retentionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Âge Moyen</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{data.averageAge} ans</div>
            <p className="text-xs text-muted-foreground">Moyenne d'âge</p>
          </CardContent>
        </Card>
      </div>

      {/* Level Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Répartition par Niveau Académique</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-green-500/10 rounded-lg">
                <div className="text-2xl font-bold text-green-500">{mostPopularLevel.count}</div>
                <div className="text-sm text-muted-foreground">Plus populaire: {mostPopularLevel.level}</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {(data.totalStudents / data.levelDistribution.length).toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">Moyenne par niveau</div>
              </div>
              <div className="text-center p-4 bg-red-500/10 rounded-lg">
                <div className="text-2xl font-bold text-red-500">{leastPopularLevel.count}</div>
                <div className="text-sm text-muted-foreground">Moins populaire: {leastPopularLevel.level}</div>
              </div>
            </div>

            <div className="space-y-4">
              {data.levelDistribution.map((level) => {
                const maxCount = Math.max(...data.levelDistribution.map((l) => l.count))
                const barPercentage = (level.count / maxCount) * 100

                return (
                  <div key={level.level} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{level.level}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{level.count} étudiants</span>
                        <Badge variant="outline">{level.percentage.toFixed(1)}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-4">
                      <div
                        className="bg-primary h-4 rounded-full transition-all flex items-center justify-center"
                        style={{ width: `${barPercentage}%` }}
                      >
                        {barPercentage > 20 && (
                          <span className="text-xs font-medium text-primary-foreground">{level.count}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Répartition par Genre</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {genderPercentages.map((gender, index) => (
                <div key={gender.gender} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{gender.gender}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{gender.count} étudiants</span>
                      <Badge variant={index === 0 ? "default" : "secondary"}>{gender.percentage.toFixed(1)}%</Badge>
                    </div>
                  </div>
                  <Progress value={gender.percentage} className="h-3" />
                </div>
              ))}

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{data.totalStudents}</div>
                  <div className="text-sm text-muted-foreground">Total des étudiants</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Statistiques Avancées</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">{data.averageAge}</div>
                  <div className="text-sm text-muted-foreground">Âge moyen</div>
                </div>
                <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-purple-500">{data.retentionRate}%</div>
                  <div className="text-sm text-muted-foreground">Rétention</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Croissance mensuelle</span>
                  <Badge variant="default" className="bg-green-500">
                    +{data.newStudents} étudiants
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Niveau le plus demandé</span>
                  <Badge variant="outline">{mostPopularLevel.level}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Capacité d'accueil</span>
                  <Badge variant="secondary">{((data.totalStudents / 300) * 100).toFixed(0)}% utilisée</Badge>
                </div>
              </div>

              <div className="p-4 bg-green-500/10 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-500">Excellent</div>
                  <div className="text-sm text-muted-foreground">Taux de rétention élevé</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
