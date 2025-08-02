import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, User, GraduationCap, Clock, Scan } from "lucide-react"
import type { RFIDScanResult } from "@/lib/rfid-manager"

interface ScanSuccessProps {
  result: RFIDScanResult
  onNewScan: () => void
}

export function ScanSuccess({ result, onNewScan }: ScanSuccessProps) {
  if (!result.studentInfo) {
    return null
  }

  const student = result.studentInfo

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="mb-6">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4 animate-bounce" />
        <h2 className="font-heading text-2xl font-bold text-green-500 mb-2">Présence Enregistrée !</h2>
      </div>

      {/* Student Info */}
      <div className="flex flex-col items-center space-y-4 mb-6">
        <Avatar className="h-24 w-24 border-4 border-green-500">
          <AvatarImage src={student.photo || "/placeholder.svg"} />
          <AvatarFallback className="bg-green-500/10 text-green-500 text-xl">
            {getInitials(student.name)}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2">
          <h3 className="font-heading text-xl font-bold">{student.name}</h3>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <GraduationCap className="h-4 w-4" />
              <span>{student.level}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions Remaining */}
      <div className="flex items-center space-x-2 mb-6">
        <Clock className="h-5 w-5 text-primary" />
        <span className="text-lg font-semibold">Sessions restantes:</span>
        <Badge variant="default" className="text-lg px-3 py-1">
          10
        </Badge>
      </div>

      <Button onClick={onNewScan} className="mb-4">
        <Scan className="h-4 w-4 mr-2" />
        Nouveau Scan
      </Button>

      <p className="text-sm text-muted-foreground">Ou attendez le retour automatique...</p>
    </div>
  )
}
