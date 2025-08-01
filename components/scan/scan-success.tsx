import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, User, GraduationCap, Clock } from "lucide-react"

interface Student {
  id: string
  fullName: string
  academicLevel: string
  currentClass: string
  sessionsRemaining: number
  photoPath?: string
}

interface ScanSuccessProps {
  student: Student
  onReset: () => void
}

export function ScanSuccess({ student }: ScanSuccessProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card className="border-2 border-green-500 flash-success">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold text-green-500 mb-2">Présence Enregistrée !</h2>
        </div>

        {/* Student Info */}
        <div className="flex flex-col items-center space-y-4 mb-6">
          <Avatar className="h-24 w-24 border-4 border-green-500">
            <AvatarImage src={student.photoPath || "/placeholder.svg"} />
            <AvatarFallback className="bg-green-500/10 text-green-500 text-xl">
              {getInitials(student.fullName)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <h3 className="font-heading text-xl font-bold">{student.fullName}</h3>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <GraduationCap className="h-4 w-4" />
                <span>{student.academicLevel}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Classe {student.currentClass}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions Remaining */}
        <div className="flex items-center space-x-2 mb-6">
          <Clock className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold">Sessions restantes:</span>
          <Badge variant={student.sessionsRemaining <= 3 ? "destructive" : "default"} className="text-lg px-3 py-1">
            {student.sessionsRemaining}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">Retour automatique dans 3 secondes...</p>
      </CardContent>
    </Card>
  )
}
