"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type Language = "fr" | "ar" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const translations = {
  fr: {
    // Common
    "common.loading": "Chargement...",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.add": "Ajouter",
    "common.search": "Rechercher",
    "common.filter": "Filtrer",
    "common.export": "Exporter",
    "common.import": "Importer",
    "common.success": "Succès",
    "common.error": "Erreur",
    "common.warning": "Attention",
    "common.info": "Information",

    // Navigation
    "nav.dashboard": "Tableau de bord",
    "nav.students": "Étudiants",
    "nav.attendance": "Présence",
    "nav.payments": "Paiements",
    "nav.reports": "Rapports",
    "nav.settings": "Paramètres",
    "nav.scan": "Scanner RFID",

    // Dashboard
    "dashboard.title": "Tableau de bord",
    "dashboard.welcome": "Bienvenue",
    "dashboard.totalStudents": "Total Étudiants",
    "dashboard.presentToday": "Présents Aujourd'hui",
    "dashboard.pendingPayments": "Paiements en Attente",
    "dashboard.monthlyRevenue": "Revenus Mensuels",
    "dashboard.recentActivity": "Activité Récente",
    "dashboard.quickActions": "Actions Rapides",

    // Students
    "students.title": "Gestion des Étudiants",
    "students.addStudent": "Ajouter un Étudiant",
    "students.studentList": "Liste des Étudiants",
    "students.name": "Nom",
    "students.email": "Email",
    "students.phone": "Téléphone",
    "students.level": "Niveau",
    "students.status": "Statut",

    // Settings
    "settings.title": "Paramètres",
    "settings.general": "Général",
    "settings.rfid": "RFID",
    "settings.payments": "Paiements",
    "settings.backup": "Sauvegarde",
    "settings.users": "Utilisateurs",
    "settings.systemInfo": "Informations Système",
    "settings.language": "Langue",
    "settings.theme": "Thème",
    "settings.light": "Clair",
    "settings.dark": "Sombre",
    "settings.system": "Système",
    "settings.save": "Enregistrer",
    "settings.cancel": "Annuler",

    // RFID
    "rfid.scanning": "Scan en cours...",
    "rfid.placeCard": "Placez votre carte RFID",
    "rfid.cardDetected": "Carte détectée",
    "rfid.studentFound": "Étudiant trouvé",
    "rfid.studentNotFound": "Étudiant non trouvé",
    "rfid.attendanceMarked": "Présence marquée",
  },
  ar: {
    // Common
    "common.loading": "جاري التحميل...",
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.delete": "حذف",
    "common.edit": "تعديل",
    "common.add": "إضافة",
    "common.search": "بحث",
    "common.filter": "تصفية",
    "common.export": "تصدير",
    "common.import": "استيراد",
    "common.success": "نجح",
    "common.error": "خطأ",
    "common.warning": "تحذير",
    "common.info": "معلومات",

    // Navigation
    "nav.dashboard": "لوحة التحكم",
    "nav.students": "الطلاب",
    "nav.attendance": "الحضور",
    "nav.payments": "المدفوعات",
    "nav.reports": "التقارير",
    "nav.settings": "الإعدادات",
    "nav.scan": "مسح RFID",

    // Dashboard
    "dashboard.title": "لوحة التحكم",
    "dashboard.welcome": "مرحباً",
    "dashboard.totalStudents": "إجمالي الطلاب",
    "dashboard.presentToday": "الحاضرون اليوم",
    "dashboard.pendingPayments": "المدفوعات المعلقة",
    "dashboard.monthlyRevenue": "الإيرادات الشهرية",
    "dashboard.recentActivity": "النشاط الأخير",
    "dashboard.quickActions": "إجراءات سريعة",

    // Students
    "students.title": "إدارة الطلاب",
    "students.addStudent": "إضافة طالب",
    "students.studentList": "قائمة الطلاب",
    "students.name": "الاسم",
    "students.email": "البريد الإلكتروني",
    "students.phone": "الهاتف",
    "students.level": "المستوى",
    "students.status": "الحالة",

    // Settings
    "settings.title": "الإعدادات",
    "settings.general": "عام",
    "settings.rfid": "RFID",
    "settings.payments": "المدفوعات",
    "settings.backup": "النسخ الاحتياطي",
    "settings.users": "المستخدمون",
    "settings.systemInfo": "معلومات النظام",
    "settings.language": "اللغة",
    "settings.theme": "المظهر",
    "settings.light": "فاتح",
    "settings.dark": "داكن",
    "settings.system": "النظام",
    "settings.save": "حفظ",
    "settings.cancel": "إلغاء",

    // RFID
    "rfid.scanning": "جاري المسح...",
    "rfid.placeCard": "ضع بطاقة RFID الخاصة بك",
    "rfid.cardDetected": "تم اكتشاف البطاقة",
    "rfid.studentFound": "تم العثور على الطالب",
    "rfid.studentNotFound": "لم يتم العثور على الطالب",
    "rfid.attendanceMarked": "تم تسجيل الحضور",
  },
  en: {
    // Common
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.add": "Add",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.export": "Export",
    "common.import": "Import",
    "common.success": "Success",
    "common.error": "Error",
    "common.warning": "Warning",
    "common.info": "Information",

    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.students": "Students",
    "nav.attendance": "Attendance",
    "nav.payments": "Payments",
    "nav.reports": "Reports",
    "nav.settings": "Settings",
    "nav.scan": "RFID Scan",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.welcome": "Welcome",
    "dashboard.totalStudents": "Total Students",
    "dashboard.presentToday": "Present Today",
    "dashboard.pendingPayments": "Pending Payments",
    "dashboard.monthlyRevenue": "Monthly Revenue",
    "dashboard.recentActivity": "Recent Activity",
    "dashboard.quickActions": "Quick Actions",

    // Students
    "students.title": "Student Management",
    "students.addStudent": "Add Student",
    "students.studentList": "Student List",
    "students.name": "Name",
    "students.email": "Email",
    "students.phone": "Phone",
    "students.level": "Level",
    "students.status": "Status",

    // Settings
    "settings.title": "Settings",
    "settings.general": "General",
    "settings.rfid": "RFID",
    "settings.payments": "Payments",
    "settings.backup": "Backup",
    "settings.users": "Users",
    "settings.systemInfo": "System Info",
    "settings.language": "Language",
    "settings.theme": "Theme",
    "settings.light": "Light",
    "settings.dark": "Dark",
    "settings.system": "System",
    "settings.save": "Save",
    "settings.cancel": "Cancel",

    // RFID
    "rfid.scanning": "Scanning...",
    "rfid.placeCard": "Place your RFID card",
    "rfid.cardDetected": "Card detected",
    "rfid.studentFound": "Student found",
    "rfid.studentNotFound": "Student not found",
    "rfid.attendanceMarked": "Attendance marked",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr")

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["fr", "ar", "en"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    // Save language to localStorage
    localStorage.setItem("language", language)

    // Update document direction and font class
    const html = document.documentElement
    if (language === "ar") {
      html.dir = "rtl"
      html.classList.add("font-arabic")
      html.classList.remove("font-heading")
    } else {
      html.dir = "ltr"
      html.classList.remove("font-arabic")
      html.classList.add("font-heading")
    }
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  const isRTL = language === "ar"

  return <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
