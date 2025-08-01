"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Edit, Trash2, Phone, MapPin, Calendar, CreditCard, Scan, Copy, AlertTriangle } from "lucide-react"
import { calculateAge, getInitials } from "@/lib/utils"
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

interface StudentCardProps {
  student: Student
  onEdit: () => void
  onDelete: () => void
}

export function StudentCard({ student, onEdit, onDelete }: StudentCardProps) {
  const age = calculateAge(student.bornDate)
  const unpaidMonths = Object.entries(student.paymentStatus).filter(([_, status]) => status === "unpaid").length
  const hasPaymentIssues = unpaidMonths > 0
  const hasLowSessions = student.sessionsRemaining <= 3
  const hasNoRfid = !student.rfidUid

  const copyRfidUid = () => {
    if (student.rfidUid) {
      navigator.clipboard.writeText(student.rfidUid)
    }
  }

  const getPaymentStatusColor = () => {
    if (unpaidMonths === 0) return "text-green-500"
    if (unpaidMonths <= 1) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <TooltipProvider>
      <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
        {/* Warning Indicators */}
        {(hasPaymentIssues || hasLowSessions || hasNoRfid) && (
          <div className="absolute top-2 right-2 z-10">
            <div className="flex space-x-1">
              {hasPaymentIssues && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Paiements en retard</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {hasLowSessions && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sessions bientôt épuisées</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {hasNoRfid && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Carte RFID non assignée</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        )}

        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start space-x-3 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={student.photoPath || "/placeholder.svg"} />
              <AvatarFallback className="bg-primary/10 text-primary">{getInitials(student.fullName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate">{student.fullName}</h4>
              <p className="text-xs text-muted-foreground">
                {student.academicLevel} - Classe {student.currentClass}
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2 text-xs">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">{student.bornPlace}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">
                {new Date(student.bornDate).toLocaleDateString("fr-FR")} ({age} ans)
              </span>
            </div>
            {student.parentPhone && (
              <div className="flex items-center space-x-2 text-xs">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">{student.parentPhone}</span>
              </div>
            )}
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant={student.sessionsRemaining <= 3 ? "destructive" : "default"} className="text-xs">
              {student.sessionsRemaining} sessions
            </Badge>
            <Badge
              variant={hasPaymentIssues ? "destructive" : "default"}
              className={`text-xs ${getPaymentStatusColor()}`}
            >
              <CreditCard className="h-3 w-3 mr-1" />
              {unpaidMonths === 0 ? "À jour" : `${unpaidMonths} impayés`}
            </Badge>
          </div>

          {/* RFID Card */}
          <div className="mb-4">
            {student.rfidUid ? (
              <div className="flex items-center justify-between bg-muted/50 rounded p-2">
                <div className="flex items-center space-x-2">
                  <Scan className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-mono">{student.rfidUid}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={copyRfidUid} className="h-6 w-6 p-0">
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-xs text-muted-foreground bg-muted/30 rounded p-2">
                <AlertTriangle className="h-3 w-3" />
                <span>Carte RFID non assignée</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onEdit} className="flex-1 bg-transparent">
              <Edit className="h-3 w-3 mr-1" />
              Modifier
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-destructive hover:text-destructive bg-transparent"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
