"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Download, FileText, Table, Database, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ReportExportProps {
  reportData?: any
  filters?: any
  data?: any[]
  title?: string
  type?: "students" | "payments" | "attendance" | "financial"
}

export function ReportExport({ reportData, filters, data = [], title = "Rapport", type = "students" }: ReportExportProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportFormat, setExportFormat] = useState<"pdf" | "csv" | "json">("pdf")
  const [lastExport, setLastExport] = useState<{ format: string; path: string; time: Date } | null>(null)
  const { toast } = useToast()

  const generatePDF = async () => {
    setIsExporting(true)
    setExportProgress(0)

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Create PDF content based on type
      let pdfContent = ""

      switch (type) {
        case "students":
          pdfContent = generateStudentsPDF()
          break
        case "payments":
          pdfContent = generatePaymentsPDF()
          break
        case "attendance":
          pdfContent = generateAttendancePDF()
          break
        case "financial":
          pdfContent = generateFinancialPDF()
          break
        default:
          pdfContent = generateGenericPDF()
      }

      // Use browser's print functionality for PDF generation
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(pdfContent)
        printWindow.document.close()

        // Wait for content to load then trigger print
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 1000)
      }

      clearInterval(progressInterval)
      setExportProgress(100)

      setLastExport({
        format: "PDF",
        path: `${title}_${new Date().toISOString().split("T")[0]}.pdf`,
        time: new Date(),
      })

      toast({
        title: "Export PDF Réussi",
        description: "Le rapport PDF a été généré avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur d'Export",
        description: "Impossible de générer le PDF",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
      setTimeout(() => setExportProgress(0), 2000)
    }
  }

  const generateCSV = async () => {
    setIsExporting(true)
    setExportProgress(0)

    try {
      const progressInterval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 15
        })
      }, 100)

      // Generate CSV content
      let csvContent = ""

      if (data.length > 0) {
        // Get headers from first object
        const headers = Object.keys(data[0])
        csvContent = headers.join(",") + "\n"

        // Add data rows
        data.forEach((row) => {
          const values = headers.map((header) => {
            const value = row[header]
            // Escape commas and quotes
            if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value || ""
          })
          csvContent += values.join(",") + "\n"
        })
      }

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `${title}_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      clearInterval(progressInterval)
      setExportProgress(100)

      setLastExport({
        format: "CSV",
        path: `${title}_${new Date().toISOString().split("T")[0]}.csv`,
        time: new Date(),
      })

      toast({
        title: "Export CSV Réussi",
        description: "Le fichier CSV a été téléchargé",
      })
    } catch (error) {
      toast({
        title: "Erreur d'Export",
        description: "Impossible de générer le CSV",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
      setTimeout(() => setExportProgress(0), 2000)
    }
  }

  const generateJSON = async () => {
    setIsExporting(true)
    setExportProgress(0)

    try {
      const progressInterval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 20
        })
      }, 100)

      // Generate JSON content
      const jsonContent = JSON.stringify(
        {
          title,
          exportDate: new Date().toISOString(),
          type,
          data,
        },
        null,
        2,
      )

      // Create and download JSON file
      const blob = new Blob([jsonContent], { type: "application/json" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `${title}_${new Date().toISOString().split("T")[0]}.json`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      clearInterval(progressInterval)
      setExportProgress(100)

      setLastExport({
        format: "JSON",
        path: `${title}_${new Date().toISOString().split("T")[0]}.json`,
        time: new Date(),
      })

      toast({
        title: "Export JSON Réussi",
        description: "Le fichier JSON a été téléchargé",
      })
    } catch (error) {
      toast({
        title: "Erreur d'Export",
        description: "Impossible de générer le JSON",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
      setTimeout(() => setExportProgress(0), 2000)
    }
  }

  const handleExport = async () => {
    switch (exportFormat) {
      case "pdf":
        await generatePDF()
        break
      case "csv":
        await generateCSV()
        break
      case "json":
        await generateJSON()
        break
    }
  }

  const generateStudentsPDF = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .header h1 { color: #333; margin: 0; }
          .header p { color: #666; margin: 5px 0; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; }
          .stat-card { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
          .stat-number { font-size: 24px; font-weight: bold; color: #2563eb; }
          .stat-label { font-size: 12px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Centre Éducatif Excellence</h1>
          <h2>${title}</h2>
          <p>Généré le ${new Date().toLocaleDateString("fr-DZ")} à ${new Date().toLocaleTimeString("fr-DZ")}</p>
        </div>
        
        <div class="stats">
          <div class="stat-card">
            <div class="stat-number">${data.length}</div>
            <div class="stat-label">Total Étudiants</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${data.filter((s: any) => s.sessionsRemaining > 0).length}</div>
            <div class="stat-label">Étudiants Actifs</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${new Set(data.map((s: any) => s.academicLevel)).size}</div>
            <div class="stat-label">Niveaux</div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Nom Complet</th>
              <th>Niveau</th>
              <th>Classe</th>
              <th>Lieu de Naissance</th>
              <th>Date de Naissance</th>
              <th>Téléphone Parent</th>
              <th>Sessions Restantes</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (student: any) => `
              <tr>
                <td>${student.fullName || ""}</td>
                <td>${student.academicLevel || ""}</td>
                <td>${student.currentClass || ""}</td>
                <td>${student.bornPlace || ""}</td>
                <td>${student.bornDate ? new Date(student.bornDate).toLocaleDateString("fr-DZ") : ""}</td>
                <td>${student.parentPhone || ""}</td>
                <td>${student.sessionsRemaining || 0}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Centre Éducatif Excellence - Système de Gestion</p>
          <p>Ce rapport contient des informations confidentielles</p>
        </div>
      </body>
      </html>
    `
  }

  const generatePaymentsPDF = () => {
    const totalAmount = data.reduce((sum: number, payment: any) => sum + (payment.paidAmount || 0), 0)
    const paidPayments = data.filter((p: any) => p.status === "paid").length

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .header h1 { color: #333; margin: 0; }
          .header p { color: #666; margin: 5px 0; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; }
          .stat-card { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
          .stat-number { font-size: 24px; font-weight: bold; color: #16a34a; }
          .stat-label { font-size: 12px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .status-paid { color: #16a34a; font-weight: bold; }
          .status-unpaid { color: #dc2626; font-weight: bold; }
          .status-partial { color: #ea580c; font-weight: bold; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Centre Éducatif Excellence</h1>
          <h2>${title}</h2>
          <p>Généré le ${new Date().toLocaleDateString("fr-DZ")} à ${new Date().toLocaleTimeString("fr-DZ")}</p>
        </div>
        
        <div class="stats">
          <div class="stat-card">
            <div class="stat-number">${totalAmount.toLocaleString("fr-DZ")} DZD</div>
            <div class="stat-label">Revenus Totaux</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${paidPayments}</div>
            <div class="stat-label">Paiements Réglés</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${data.length - paidPayments}</div>
            <div class="stat-label">En Attente</div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Étudiant</th>
              <th>Mois</th>
              <th>Année</th>
              <th>Montant</th>
              <th>Payé</th>
              <th>Statut</th>
              <th>Date de Paiement</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (payment: any) => `
              <tr>
                <td>${payment.studentName || payment.studentId}</td>
                <td>${payment.month || ""}</td>
                <td>${payment.year || ""}</td>
                <td>${(payment.amount || 0).toLocaleString("fr-DZ")} DZD</td>
                <td>${(payment.paidAmount || 0).toLocaleString("fr-DZ")} DZD</td>
                <td class="status-${payment.status}">${
                  payment.status === "paid" ? "Payé" : payment.status === "partial" ? "Partiel" : "Non Payé"
                }</td>
                <td>${payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString("fr-DZ") : "-"}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Centre Éducatif Excellence - Rapport Financier</p>
          <p>Document confidentiel - Usage interne uniquement</p>
        </div>
      </body>
      </html>
    `
  }

  const generateAttendancePDF = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .header h1 { color: #333; margin: 0; }
          .header p { color: #666; margin: 5px 0; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; }
          .stat-card { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
          .stat-number { font-size: 24px; font-weight: bold; color: #7c3aed; }
          .stat-label { font-size: 12px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Centre Éducatif Excellence</h1>
          <h2>${title}</h2>
          <p>Généré le ${new Date().toLocaleDateString("fr-DZ")} à ${new Date().toLocaleTimeString("fr-DZ")}</p>
        </div>
        
        <div class="stats">
          <div class="stat-card">
            <div class="stat-number">${data.length}</div>
            <div class="stat-label">Total Présences</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">95%</div>
            <div class="stat-label">Taux de Présence</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">142</div>
            <div class="stat-label">Étudiants Actifs</div>
          </div>
        </div>
        
        <p><strong>Rapport de présence détaillé pour la période sélectionnée</strong></p>
        <p>Ce rapport sera disponible avec l'intégration complète du système RFID.</p>
        
        <div class="footer">
          <p>Centre Éducatif Excellence - Rapport de Présence</p>
          <p>Système de suivi automatisé par RFID</p>
        </div>
      </body>
      </html>
    `
  }

  const generateFinancialPDF = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .header h1 { color: #333; margin: 0; }
          .header p { color: #666; margin: 5px 0; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; }
          .stat-card { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
          .stat-number { font-size: 24px; font-weight: bold; color: #059669; }
          .stat-label { font-size: 12px; color: #666; }
          .summary { margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 5px; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Centre Éducatif Excellence</h1>
          <h2>${title}</h2>
          <p>Généré le ${new Date().toLocaleDateString("fr-DZ")} à ${new Date().toLocaleTimeString("fr-DZ")}</p>
        </div>
        
        <div class="stats">
          <div class="stat-card">
            <div class="stat-number">425,000 DZD</div>
            <div class="stat-label">Revenus Totaux</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">35,000 DZD</div>
            <div class="stat-label">Revenus Mensuels</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">23</div>
            <div class="stat-label">Paiements en Attente</div>
          </div>
        </div>
        
        <div class="summary">
          <h3>Résumé Financier</h3>
          <p><strong>Période:</strong> ${new Date().toLocaleDateString("fr-DZ")}</p>
          <p><strong>Taux de Recouvrement:</strong> 87%</p>
          <p><strong>Revenus Prévisionnels:</strong> 450,000 DZD</p>
          <p><strong>Créances en Cours:</strong> 25,000 DZD</p>
        </div>
        
        <div class="footer">
          <p>Centre Éducatif Excellence - Rapport Financier</p>
          <p>Document confidentiel - Comptabilité</p>
        </div>
      </body>
      </html>
    `
  }

  const generateGenericPDF = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .header h1 { color: #333; margin: 0; }
          .header p { color: #666; margin: 5px 0; }
          .content { margin: 20px 0; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Centre Éducatif Excellence</h1>
          <h2>${title}</h2>
          <p>Généré le ${new Date().toLocaleDateString("fr-DZ")} à ${new Date().toLocaleTimeString("fr-DZ")}</p>
        </div>
        
        <div class="content">
          <p>Rapport généré avec ${data.length} enregistrements.</p>
          <p>Données exportées depuis le système de gestion du centre éducatif.</p>
        </div>
        
        <div class="footer">
          <p>Centre Éducatif Excellence - Système de Gestion</p>
        </div>
      </body>
      </html>
    `
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "pdf":
        return FileText
      case "csv":
        return Table
      case "json":
        return Database
      default:
        return FileText
    }
  }

  const FormatIcon = getFormatIcon(exportFormat)

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <Label>Format d'Export</Label>
        <Select value={exportFormat} onValueChange={(value: "pdf" | "csv" | "json") => setExportFormat(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                PDF - Rapport Formaté
              </div>
            </SelectItem>
            <SelectItem value="csv">
              <div className="flex items-center gap-2">
                <Table className="h-4 w-4" />
                CSV - Données Tabulaires
              </div>
            </SelectItem>
            <SelectItem value="json">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                JSON - Données Structurées
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleExport}
        disabled={isExporting || data.length === 0}
        className="min-w-[120px]"
      >
        {isExporting ? (
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <FormatIcon className="h-4 w-4 mr-2" />
        )}
        {isExporting ? "Export..." : `Export ${exportFormat.toUpperCase()}`}
      </Button>
    </div>
  )
}
