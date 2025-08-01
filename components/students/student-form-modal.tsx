"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ACADEMIC_LEVELS, MONTHS_FR, type AcademicLevel } from "@/lib/constants"
import { Upload, X, CreditCard } from "lucide-react"
import { getInitials } from "@/lib/utils"

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

interface StudentFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (student: Partial<Student>) => void
  student?: Student | null
}

export function StudentFormModal({ isOpen, onClose, onSave, student }: StudentFormModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    bornPlace: "",
    bornDate: "",
    parentPhone: "",
    academicLevel: "" as AcademicLevel,
    currentClass: "A",
    sessionsRemaining: 10,
    rfidUid: "",
    photoPath: "",
    paymentStatus: {} as Record<string, "paid" | "unpaid" | "partial">,
  })

  const [photoPreview, setPhotoPreview] = useState<string>("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.fullName,
        bornPlace: student.bornPlace,
        bornDate: student.bornDate,
        parentPhone: student.parentPhone || "",
        academicLevel: student.academicLevel,
        currentClass: student.currentClass,
        sessionsRemaining: student.sessionsRemaining,
        rfidUid: student.rfidUid || "",
        photoPath: student.photoPath || "",
        paymentStatus: student.paymentStatus,
      })
      setPhotoPreview(student.photoPath || "")
    } else {
      // Reset form for new student
      const defaultPaymentStatus: Record<string, "paid" | "unpaid" | "partial"> = {}
      MONTHS_FR.forEach((month) => {
        defaultPaymentStatus[month] = "unpaid"
      })

      setFormData({
        fullName: "",
        bornPlace: "",
        bornDate: "",
        parentPhone: "",
        academicLevel: "1ère CEM",
        currentClass: "A",
        sessionsRemaining: 10,
        rfidUid: "",
        photoPath: "",
        paymentStatus: defaultPaymentStatus,
      })
      setPhotoPreview("")
    }
    setErrors({})
  }, [student, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Le nom complet est requis"
    }
    if (!formData.bornPlace.trim()) {
      newErrors.bornPlace = "Le lieu de naissance est requis"
    }
    if (!formData.bornDate) {
      newErrors.bornDate = "La date de naissance est requise"
    }
    if (!formData.academicLevel) {
      newErrors.academicLevel = "Le niveau académique est requis"
    }
    if (formData.sessionsRemaining < 0) {
      newErrors.sessionsRemaining = "Le nombre de sessions ne peut pas être négatif"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPhotoPreview(result)
        setFormData({ ...formData, photoPath: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setPhotoPreview("")
    setFormData({ ...formData, photoPath: "" })
  }

  const updatePaymentStatus = (month: string, status: "paid" | "unpaid" | "partial") => {
    setFormData({
      ...formData,
      paymentStatus: {
        ...formData.paymentStatus,
        [month]: status,
      },
    })
  }

  const getPaymentStatusColor = (status: "paid" | "unpaid" | "partial") => {
    switch (status) {
      case "paid":
        return "bg-green-500 hover:bg-green-600"
      case "partial":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "unpaid":
        return "bg-red-500 hover:bg-red-600"
    }
  }

  const getPaymentStatusText = (status: "paid" | "unpaid" | "partial") => {
    switch (status) {
      case "paid":
        return "Payé"
      case "partial":
        return "Partiel"
      case "unpaid":
        return "Impayé"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pattern dark:bg-pattern-dark opacity-30 rounded-lg" />

        <div className="relative z-10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {student ? "Modifier l'Étudiant" : "Ajouter un Nouvel Étudiant"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Photo Section */}
              <div className="space-y-4">
                <Label>Photo de l'Étudiant</Label>
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32 border-4 border-white/20 shadow-lg">
                    <AvatarImage src={photoPreview || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                      {formData.fullName ? getInitials(formData.fullName) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex space-x-2">
                    <Label htmlFor="photo-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm" asChild className="glass bg-transparent">
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Choisir
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    {photoPreview && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removePhoto}
                        className="glass bg-transparent"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Nom Complet *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`glass ${errors.fullName ? "border-red-500" : ""}`}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="bornPlace">Lieu de Naissance *</Label>
                    <Input
                      id="bornPlace"
                      value={formData.bornPlace}
                      onChange={(e) => setFormData({ ...formData, bornPlace: e.target.value })}
                      className={`glass ${errors.bornPlace ? "border-red-500" : ""}`}
                    />
                    {errors.bornPlace && <p className="text-red-500 text-sm mt-1">{errors.bornPlace}</p>}
                  </div>

                  <div>
                    <Label htmlFor="bornDate">Date de Naissance *</Label>
                    <Input
                      id="bornDate"
                      type="date"
                      value={formData.bornDate}
                      onChange={(e) => setFormData({ ...formData, bornDate: e.target.value })}
                      className={`glass ${errors.bornDate ? "border-red-500" : ""}`}
                    />
                    {errors.bornDate && <p className="text-red-500 text-sm mt-1">{errors.bornDate}</p>}
                  </div>

                  <div>
                    <Label htmlFor="parentPhone">Téléphone Parent</Label>
                    <Input
                      id="parentPhone"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      placeholder="0555123456"
                      className="glass"
                    />
                  </div>

                  <div>
                    <Label htmlFor="academicLevel">Niveau Académique *</Label>
                    <Select
                      value={formData.academicLevel}
                      onValueChange={(value: AcademicLevel) => setFormData({ ...formData, academicLevel: value })}
                    >
                      <SelectTrigger className={`glass ${errors.academicLevel ? "border-red-500" : ""}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACADEMIC_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.academicLevel && <p className="text-red-500 text-sm mt-1">{errors.academicLevel}</p>}
                  </div>

                  <div>
                    <Label htmlFor="currentClass">Classe</Label>
                    <Select
                      value={formData.currentClass}
                      onValueChange={(value) => setFormData({ ...formData, currentClass: value })}
                    >
                      <SelectTrigger className="glass">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["A", "B", "C", "D", "E"].map((cls) => (
                          <SelectItem key={cls} value={cls}>
                            Classe {cls}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sessionsRemaining">Sessions Initiales</Label>
                    <Input
                      id="sessionsRemaining"
                      type="number"
                      min="0"
                      value={formData.sessionsRemaining}
                      onChange={(e) =>
                        setFormData({ ...formData, sessionsRemaining: Number.parseInt(e.target.value) || 0 })
                      }
                      className={`glass ${errors.sessionsRemaining ? "border-red-500" : ""}`}
                    />
                    {errors.sessionsRemaining && (
                      <p className="text-red-500 text-sm mt-1">{errors.sessionsRemaining}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="rfidUid">Carte RFID (UID)</Label>
                    <Input
                      id="rfidUid"
                      value={formData.rfidUid}
                      onChange={(e) => setFormData({ ...formData, rfidUid: e.target.value })}
                      placeholder="1234567890"
                      className="glass"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Statut des Paiements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {MONTHS_FR.map((month) => (
                    <div key={month} className="space-y-2">
                      <Label className="text-sm">{month}</Label>
                      <div className="flex space-x-1">
                        {(["paid", "partial", "unpaid"] as const).map((status) => (
                          <Button
                            key={status}
                            type="button"
                            size="sm"
                            variant={formData.paymentStatus[month] === status ? "default" : "outline"}
                            className={
                              formData.paymentStatus[month] === status
                                ? `${getPaymentStatusColor(status)} text-white`
                                : "glass"
                            }
                            onClick={() => updatePaymentStatus(month, status)}
                          >
                            {getPaymentStatusText(status)[0]}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-white/20">
              <Button type="button" variant="outline" onClick={onClose} className="glass bg-transparent">
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                {student ? "Mettre à Jour" : "Ajouter Étudiant"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
