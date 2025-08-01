"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StudentCard } from "@/components/students/student-card"
import { ChevronDown, ChevronRight, Users } from "lucide-react"
import type { AcademicLevel } from "@/lib/constants"

interface Student {
  id: string
  rfidUid?: string
  fullName: string
  bornPlace: string
  bornDate: string
  photoPath?: string
  parentPhone?: string
  academicLevel: AcademicLevel
  currentClass: string
  sessionsRemaining: number
  paymentStatus: Record<string, "paid" | "unpaid" | "partial">
  createdAt: string
  updatedAt: string
}

interface AcademicLevelSectionProps {
  level: AcademicLevel
  students: Student[]
  isExpanded: boolean
  onToggle: () => void
  onEditStudent: (student: Student) => void
  onDeleteStudent: (studentId: string) => void
}

export function AcademicLevelSection({
  level,
  students,
  isExpanded,
  onToggle,
  onEditStudent,
  onDeleteStudent,
}: AcademicLevelSectionProps) {
  const [sortBy, setSortBy] = useState<"name" | "sessions" | "class">("name")

  const sortedStudents = [...students].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.fullName.localeCompare(b.fullName)
      case "sessions":
        return a.sessionsRemaining - b.sessionsRemaining
      case "class":
        return a.currentClass.localeCompare(b.currentClass)
      default:
        return 0
    }
  })

  const getLevelColor = (level: AcademicLevel) => {
    const colors = {
      "1ère CEM": "bg-blue-500",
      "2ème CEM": "bg-green-500",
      "3ème CEM": "bg-yellow-500",
      "1ère Lycée": "bg-purple-500",
      "2ème Lycée": "bg-pink-500",
      "3ème Lycée": "bg-indigo-500",
    }
    return colors[level] || "bg-gray-500"
  }

  const getStats = () => {
    const unpaidCount = students.filter((s) =>
      Object.values(s.paymentStatus).some((status) => status === "unpaid"),
    ).length
    const depletedCount = students.filter((s) => s.sessionsRemaining <= 3).length
    const noRfidCount = students.filter((s) => !s.rfidUid).length

    return { unpaidCount, depletedCount, noRfidCount }
  }

  const stats = getStats()

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onToggle}
            className="flex items-center space-x-3 p-0 h-auto hover:bg-transparent"
          >
            {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${getLevelColor(level)}`} />
              <h3 className="font-heading text-xl font-semibold">{level}</h3>
              <Badge variant="secondary" className="ml-2">
                <Users className="h-3 w-3 mr-1" />
                {students.length}
              </Badge>
            </div>
          </Button>

          <div className="flex items-center space-x-2">
            {stats.unpaidCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {stats.unpaidCount} impayés
              </Badge>
            )}
            {stats.depletedCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {stats.depletedCount} épuisés
              </Badge>
            )}
            {stats.noRfidCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {stats.noRfidCount} sans carte
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          {/* Sort Controls */}
          <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-border">
            <span className="text-sm text-muted-foreground">Trier par:</span>
            <Button variant={sortBy === "name" ? "default" : "ghost"} size="sm" onClick={() => setSortBy("name")}>
              Nom
            </Button>
            <Button variant={sortBy === "class" ? "default" : "ghost"} size="sm" onClick={() => setSortBy("class")}>
              Classe
            </Button>
            <Button
              variant={sortBy === "sessions" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortBy("sessions")}
            >
              Sessions
            </Button>
          </div>

          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onEdit={() => onEditStudent(student)}
                onDelete={() => onDeleteStudent(student.id)}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
