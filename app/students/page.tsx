"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Search,
  Plus,
  Download,
  Edit,
  Trash2,
  User,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Users,
  GraduationCap,
} from "lucide-react"
import { tauriApi, type Student } from "@/lib/tauri-api"
import { useToast } from "@/hooks/use-toast"

const ACADEMIC_LEVELS = ["1ère CEM", "2ème CEM", "3ème CEM", "1ère AS", "2ème AS", "3ème AS"]

const CLASSES = ["A", "B", "C", "D"]

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    bornPlace: "",
    bornDate: "",
    parentPhone: "",
    academicLevel: "",
    currentClass: "",
    rfidUid: "",
    sessionsRemaining: 10,
  })
  const { toast } = useToast()

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      setLoading(true)
      const data = await tauriApi.getStudents()
      setStudents(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les étudiants",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddStudent = async () => {
    try {
      const newStudent = await tauriApi.addStudent(formData)
      setStudents([...students, newStudent])
      setIsAddModalOpen(false)
      resetForm()
      toast({
        title: "Succès",
        description: "Étudiant ajouté avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'étudiant",
        variant: "destructive",
      })
    }
  }

  const handleEditStudent = async () => {
    if (!editingStudent) return

    try {
      const updatedStudent = await tauriApi.updateStudent(editingStudent.id, formData)
      setStudents(students.map((s) => (s.id === editingStudent.id ? updatedStudent : s)))
      setEditingStudent(null)
      resetForm()
      toast({
        title: "Succès",
        description: "Étudiant modifié avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'étudiant",
        variant: "destructive",
      })
    }
  }

  const handleDeleteStudent = async (id: string) => {
    try {
      await tauriApi.deleteStudent(id)
      setStudents(students.filter((s) => s.id !== id))
      toast({
        title: "Succès",
        description: "Étudiant supprimé avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'étudiant",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: "",
      bornPlace: "",
      bornDate: "",
      parentPhone: "",
      academicLevel: "",
      currentClass: "",
      rfidUid: "",
      sessionsRemaining: 10,
    })
  }

  const openEditModal = (student: Student) => {
    setEditingStudent(student)
    setFormData({
      fullName: student.fullName,
      bornPlace: student.bornPlace,
      bornDate: student.bornDate,
      parentPhone: student.parentPhone || "",
      academicLevel: student.academicLevel,
      currentClass: student.currentClass,
      rfidUid: student.rfidUid || "",
      sessionsRemaining: student.sessionsRemaining,
    })
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentPhone?.includes(searchTerm) ||
      student.rfidUid?.includes(searchTerm)
    const matchesLevel = selectedLevel === "all" || student.academicLevel === selectedLevel
    const matchesClass = selectedClass === "all" || student.currentClass === selectedClass

    return matchesSearch && matchesLevel && matchesClass
  })

  const groupedStudents = ACADEMIC_LEVELS.reduce(
    (acc, level) => {
      acc[level] = filteredStudents.filter((student) => student.academicLevel === level)
      return acc
    },
    {} as Record<string, Student[]>,
  )

  const getPaymentStatus = (student: Student) => {
    const statuses = Object.values(student.paymentStatus || {})
    const paid = statuses.filter((s) => s === "paid").length
    const total = statuses.length

    if (paid === total) return { status: "À jour", color: "bg-green-500" }
    if (paid === 0) return { status: "En retard", color: "bg-red-500" }
    return { status: "Partiel", color: "bg-orange-500" }
  }

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="space-y-2">
          <div className="h-8 bg-white/20 dark:bg-gray-800/20 rounded animate-pulse" />
          <div className="h-4 bg-white/10 dark:bg-gray-800/10 rounded animate-pulse w-1/3" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="glass-card animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-white/20 dark:bg-gray-800/20 rounded" />
                <div className="h-8 bg-white/20 dark:bg-gray-800/20 rounded" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">Gestion des Étudiants</h1>
          <p className="text-white/80 text-lg">{students.length} étudiants inscrits</p>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter Étudiant
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Ajouter un Nouvel Étudiant</DialogTitle>
              <DialogDescription className="text-white/70">Remplissez les informations de l'étudiant</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white">
                    Nom Complet
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bornPlace" className="text-white">
                    Lieu de Naissance
                  </Label>
                  <Input
                    id="bornPlace"
                    value={formData.bornPlace}
                    onChange={(e) => setFormData({ ...formData, bornPlace: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bornDate" className="text-white">
                    Date de Naissance
                  </Label>
                  <Input
                    id="bornDate"
                    type="date"
                    value={formData.bornDate}
                    onChange={(e) => setFormData({ ...formData, bornDate: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentPhone" className="text-white">
                    Téléphone Parent
                  </Label>
                  <Input
                    id="parentPhone"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="academicLevel" className="text-white">
                    Niveau
                  </Label>
                  <Select
                    value={formData.academicLevel}
                    onValueChange={(value) => setFormData({ ...formData, academicLevel: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACADEMIC_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentClass" className="text-white">
                    Classe
                  </Label>
                  <Select
                    value={formData.currentClass}
                    onValueChange={(value) => setFormData({ ...formData, currentClass: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASSES.map((cls) => (
                        <SelectItem key={cls} value={cls}>
                          {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionsRemaining" className="text-white">
                    Sessions Restantes
                  </Label>
                  <Input
                    id="sessionsRemaining"
                    type="number"
                    value={formData.sessionsRemaining}
                    onChange={(e) =>
                      setFormData({ ...formData, sessionsRemaining: Number.parseInt(e.target.value) || 0 })
                    }
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rfidUid" className="text-white">
                  UID RFID (Optionnel)
                </Label>
                <Input
                  id="rfidUid"
                  value={formData.rfidUid}
                  onChange={(e) => setFormData({ ...formData, rfidUid: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Scannez la carte ou saisissez manuellement"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Annuler
              </Button>
              <Button onClick={handleAddStudent} className="bg-blue-500 hover:bg-blue-600">
                Ajouter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom, téléphone ou UID RFID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
            </div>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                {ACADEMIC_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[120px] bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Classe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {CLASSES.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students by Academic Level */}
      <div className="space-y-8">
        {ACADEMIC_LEVELS.map((level) => {
          const levelStudents = groupedStudents[level]
          if (levelStudents.length === 0) return null

          return (
            <div key={level} className="space-y-4">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">{level}</h2>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  {levelStudents.length} étudiants
                </Badge>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {levelStudents.map((student) => {
                  const paymentStatus = getPaymentStatus(student)

                  return (
                    <Card key={student.id} className="glass-card hover:scale-105 transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-white text-lg">{student.fullName}</CardTitle>
                              <CardDescription className="text-white/70">Classe {student.currentClass}</CardDescription>
                            </div>
                          </div>
                          <Badge className={`${paymentStatus.color} text-white`}>{paymentStatus.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-white/80">
                            <MapPin className="h-4 w-4" />
                            <span>{student.bornPlace}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/80">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(student.bornDate).toLocaleDateString("fr-DZ")}</span>
                          </div>
                          {student.parentPhone && (
                            <div className="flex items-center gap-2 text-white/80">
                              <Phone className="h-4 w-4" />
                              <span>{student.parentPhone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-white/80">
                            <CreditCard className="h-4 w-4" />
                            <span>{student.sessionsRemaining} sessions restantes</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditModal(student)}
                            className="flex-1 border-white/20 text-white hover:bg-white/10"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteStudent(student.id)}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Edit Modal */}
      <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
        <DialogContent className="glass-card border-white/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Modifier l'Étudiant</DialogTitle>
            <DialogDescription className="text-white/70">Modifiez les informations de l'étudiant</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-fullName" className="text-white">
                  Nom Complet
                </Label>
                <Input
                  id="edit-fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-bornPlace" className="text-white">
                  Lieu de Naissance
                </Label>
                <Input
                  id="edit-bornPlace"
                  value={formData.bornPlace}
                  onChange={(e) => setFormData({ ...formData, bornPlace: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-bornDate" className="text-white">
                  Date de Naissance
                </Label>
                <Input
                  id="edit-bornDate"
                  type="date"
                  value={formData.bornDate}
                  onChange={(e) => setFormData({ ...formData, bornDate: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-parentPhone" className="text-white">
                  Téléphone Parent
                </Label>
                <Input
                  id="edit-parentPhone"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-academicLevel" className="text-white">
                  Niveau
                </Label>
                <Select
                  value={formData.academicLevel}
                  onValueChange={(value) => setFormData({ ...formData, academicLevel: value })}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACADEMIC_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-currentClass" className="text-white">
                  Classe
                </Label>
                <Select
                  value={formData.currentClass}
                  onValueChange={(value) => setFormData({ ...formData, currentClass: value })}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASSES.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sessionsRemaining" className="text-white">
                  Sessions Restantes
                </Label>
                <Input
                  id="edit-sessionsRemaining"
                  type="number"
                  value={formData.sessionsRemaining}
                  onChange={(e) =>
                    setFormData({ ...formData, sessionsRemaining: Number.parseInt(e.target.value) || 0 })
                  }
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-rfidUid" className="text-white">
                UID RFID (Optionnel)
              </Label>
              <Input
                id="edit-rfidUid"
                value={formData.rfidUid}
                onChange={(e) => setFormData({ ...formData, rfidUid: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Scannez la carte ou saisissez manuellement"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setEditingStudent(null)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Annuler
            </Button>
            <Button onClick={handleEditStudent} className="bg-blue-500 hover:bg-blue-600">
              Sauvegarder
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {filteredStudents.length === 0 && !loading && (
        <Card className="glass-card">
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Aucun étudiant trouvé</h3>
            <p className="text-white/70 mb-4">
              {searchTerm || selectedLevel !== "all" || selectedClass !== "all"
                ? "Essayez de modifier vos critères de recherche"
                : "Commencez par ajouter votre premier étudiant"}
            </p>
            {!searchTerm && selectedLevel === "all" && selectedClass === "all" && (
              <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-500 hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter le Premier Étudiant
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
