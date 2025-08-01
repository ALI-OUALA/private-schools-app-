"use client"

// Tauri API with proper fallbacks for browser environment
let invoke: any = null
let listen: any = null

// Check if we're in Tauri environment
const isTauri = typeof window !== "undefined" && (window as any).__TAURI__

if (isTauri) {
  try {
    // Dynamic import for Tauri APIs
    import("@tauri-apps/api/tauri")
      .then((module) => {
        invoke = module.invoke
      })
      .catch(() => {
        console.warn("Tauri invoke not available")
      })

    import("@tauri-apps/api/event")
      .then((module) => {
        listen = module.listen
      })
      .catch(() => {
        console.warn("Tauri event listener not available")
      })
  } catch (error) {
    console.warn("Tauri APIs not available:", error)
  }
}

export interface Student {
  id: string
  rfidUid?: string
  fullName: string
  bornPlace: string
  bornDate: string
  photoPath?: string
  parentPhone?: string
  academicLevel: string
  currentClass: string
  sessionsRemaining: number
  paymentStatus: Record<string, "paid" | "unpaid" | "partial">
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  studentId: string
  amount: number
  month: string
  year: number
  status: "paid" | "unpaid" | "partial"
  paidAmount?: number
  paymentDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface SystemStats {
  totalStudents: number
  activeStudents: number
  totalRevenue: number
  monthlyRevenue: number
  pendingPayments: number
  rfidConnected: boolean
  lastBackup?: string
  systemUptime: number
}

export interface AppSettings {
  general: {
    schoolName: string
    schoolAddress: string
    schoolPhone: string
    schoolEmail: string
    academicYear: string
    language: "fr" | "ar" | "en"
    theme: "light" | "dark" | "system"
    currency: string
    timezone: string
  }
  rfid: {
    readerType: "JT308" | "RC522" | "PN532"
    comPort: string
    baudRate: number
    autoConnect: boolean
    scanTimeout: number
    enableSound: boolean
    enableLed: boolean
  }
  payments: {
    defaultSessionPrice: Record<string, number>
    lateFeeAmount: number
    lateFeeAfterDays: number
    allowPartialPayments: boolean
    requirePaymentNotes: boolean
    autoGenerateReceipts: boolean
    receiptTemplate: string
  }
  backup: {
    autoBackup: boolean
    backupInterval: "daily" | "weekly" | "monthly"
    backupLocation: string
    keepBackups: number
    cloudSync: boolean
    cloudProvider: "google" | "dropbox" | "onedrive"
  }
  system: {
    enableLogging: boolean
    logLevel: "error" | "warn" | "info" | "debug"
    maxLogSize: number
    enableUpdates: boolean
    updateChannel: "stable" | "beta"
    enableTelemetry: boolean
  }
}

class TauriAPI {
  private eventListeners: Map<string, Function[]> = new Map()
  private mockData: {
    students: Student[]
    payments: Payment[]
    settings: AppSettings | null
  } = {
    students: [],
    payments: [],
    settings: null,
  }

  constructor() {
    this.initializeMockData()
    if (isTauri) {
      this.initializeEventListeners()
    }
  }

  private initializeMockData() {
    // Initialize with mock data
    this.mockData.students = [
      {
        id: "1",
        rfidUid: "1234567890",
        fullName: "Ahmed Benali",
        bornPlace: "Alger",
        bornDate: "2008-03-15",
        parentPhone: "0555123456",
        academicLevel: "1ère CEM",
        currentClass: "A",
        sessionsRemaining: 8,
        paymentStatus: {
          Janvier: "paid",
          Février: "paid",
          Mars: "unpaid",
          Avril: "unpaid",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        rfidUid: "0987654321",
        fullName: "Fatima Khelil",
        bornPlace: "Oran",
        bornDate: "2007-07-22",
        parentPhone: "0666789012",
        academicLevel: "2ème CEM",
        currentClass: "B",
        sessionsRemaining: 12,
        paymentStatus: {
          Janvier: "paid",
          Février: "partial",
          Mars: "unpaid",
          Avril: "unpaid",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        fullName: "Youcef Mammeri",
        bornPlace: "Constantine",
        bornDate: "2009-01-10",
        parentPhone: "0777456789",
        academicLevel: "3ème CEM",
        currentClass: "A",
        sessionsRemaining: 15,
        paymentStatus: {
          Janvier: "paid",
          Février: "paid",
          Mars: "paid",
          Avril: "unpaid",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    this.mockData.payments = [
      {
        id: "1",
        studentId: "1",
        amount: 2500,
        month: "Janvier",
        year: 2024,
        status: "paid",
        paidAmount: 2500,
        paymentDate: "2024-01-15",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        studentId: "2",
        amount: 3000,
        month: "Février",
        year: 2024,
        status: "partial",
        paidAmount: 1500,
        paymentDate: "2024-02-10",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  private async initializeEventListeners() {
    try {
      if (listen) {
        // Listen for RFID scan events
        await listen("rfid-scan", (event: any) => {
          this.emit("rfid-scan", event.payload)
        })

        // Listen for system events
        await listen("system-event", (event: any) => {
          this.emit("system-event", event.payload)
        })

        // Listen for settings changes
        await listen("settings-changed", (event: any) => {
          this.emit("settings-changed", event.payload)
        })
      }
    } catch (error) {
      console.warn("Tauri event listeners not available:", error)
    }
  }

  // Event system
  on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)!.push(callback)
  }

  off(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach((callback) => callback(data))
    }
  }

  // Database operations
  async getStudents(): Promise<Student[]> {
    if (invoke) {
      try {
        return await invoke("get_students")
      } catch (error) {
        console.error("Failed to get students:", error)
      }
    }

    // Fallback to mock data
    await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate API delay
    return [...this.mockData.students]
  }

  async addStudent(student: Partial<Student>): Promise<Student> {
    if (invoke) {
      try {
        return await invoke("add_student", { student })
      } catch (error) {
        console.error("Failed to add student:", error)
      }
    }

    // Fallback to mock implementation
    await new Promise((resolve) => setTimeout(resolve, 300))
    const newStudent: Student = {
      id: Date.now().toString(),
      rfidUid: student.rfidUid || "",
      fullName: student.fullName || "",
      bornPlace: student.bornPlace || "",
      bornDate: student.bornDate || "",
      photoPath: student.photoPath,
      parentPhone: student.parentPhone,
      academicLevel: student.academicLevel || "1ère CEM",
      currentClass: student.currentClass || "A",
      sessionsRemaining: student.sessionsRemaining || 10,
      paymentStatus: student.paymentStatus || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.mockData.students.push(newStudent)
    return newStudent
  }

  async updateStudent(id: string, student: Partial<Student>): Promise<Student> {
    if (invoke) {
      try {
        return await invoke("update_student", { id, student })
      } catch (error) {
        console.error("Failed to update student:", error)
      }
    }

    // Fallback to mock implementation
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = this.mockData.students.findIndex((s) => s.id === id)
    if (index !== -1) {
      this.mockData.students[index] = {
        ...this.mockData.students[index],
        ...student,
        updatedAt: new Date().toISOString(),
      }
      return this.mockData.students[index]
    }
    return { ...student, id } as Student
  }

  async deleteStudent(id: string): Promise<boolean> {
    if (invoke) {
      try {
        return await invoke("delete_student", { id })
      } catch (error) {
        console.error("Failed to delete student:", error)
      }
    }

    // Fallback to mock implementation
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = this.mockData.students.findIndex((s) => s.id === id)
    if (index !== -1) {
      this.mockData.students.splice(index, 1)
    }
    return true
  }

  async getPayments(): Promise<Payment[]> {
    if (invoke) {
      try {
        return await invoke("get_payments")
      } catch (error) {
        console.error("Failed to get payments:", error)
      }
    }

    // Fallback to mock data
    await new Promise((resolve) => setTimeout(resolve, 300))
    return [...this.mockData.payments]
  }

  async addPayment(payment: Partial<Payment>): Promise<Payment> {
    if (invoke) {
      try {
        return await invoke("add_payment", { payment })
      } catch (error) {
        console.error("Failed to add payment:", error)
      }
    }

    // Fallback to mock implementation
    await new Promise((resolve) => setTimeout(resolve, 300))
    const newPayment: Payment = {
      id: Date.now().toString(),
      studentId: payment.studentId || "",
      amount: payment.amount || 0,
      month: payment.month || "",
      year: payment.year || new Date().getFullYear(),
      status: payment.status || "unpaid",
      paidAmount: payment.paidAmount,
      paymentDate: payment.paymentDate,
      notes: payment.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.mockData.payments.push(newPayment)
    return newPayment
  }

  async updatePayment(id: string, payment: Partial<Payment>): Promise<Payment> {
    if (invoke) {
      try {
        return await invoke("update_payment", { id, payment })
      } catch (error) {
        console.error("Failed to update payment:", error)
      }
    }

    // Fallback to mock implementation
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = this.mockData.payments.findIndex((p) => p.id === id)
    if (index !== -1) {
      this.mockData.payments[index] = {
        ...this.mockData.payments[index],
        ...payment,
        updatedAt: new Date().toISOString(),
      }
      return this.mockData.payments[index]
    }
    return { ...payment, id } as Payment
  }

  // Settings operations
  async loadSettings(): Promise<AppSettings | null> {
    if (invoke) {
      try {
        const settings = await invoke("load_settings")
        return settings as AppSettings
      } catch (error) {
        console.error("Failed to load settings:", error)
      }
    }

    // Fallback to localStorage
    const stored = localStorage.getItem("app-settings")
    if (stored) {
      return JSON.parse(stored)
    }

    // Return default settings
    return {
      general: {
        schoolName: "Centre Éducatif Excellence",
        schoolAddress: "123 Rue de l'Éducation, Alger",
        schoolPhone: "021-123-456",
        schoolEmail: "contact@centre-excellence.dz",
        academicYear: "2023-2024",
        language: "fr",
        theme: "system",
        currency: "DZD",
        timezone: "Africa/Algiers",
      },
      rfid: {
        readerType: "JT308",
        comPort: "COM3",
        baudRate: 9600,
        autoConnect: true,
        scanTimeout: 5000,
        enableSound: true,
        enableLed: true,
      },
      payments: {
        defaultSessionPrice: {
          "1ère CEM": 2500,
          "2ème CEM": 3000,
          "3ème CEM": 3500,
          "1ère AS": 4000,
          "2ème AS": 4500,
          "3ème AS": 5000,
        },
        lateFeeAmount: 500,
        lateFeeAfterDays: 7,
        allowPartialPayments: true,
        requirePaymentNotes: false,
        autoGenerateReceipts: true,
        receiptTemplate: "default",
      },
      backup: {
        autoBackup: true,
        backupInterval: "daily",
        backupLocation: "./backups",
        keepBackups: 30,
        cloudSync: false,
        cloudProvider: "google",
      },
      system: {
        enableLogging: true,
        logLevel: "info",
        maxLogSize: 10,
        enableUpdates: true,
        updateChannel: "stable",
        enableTelemetry: false,
      },
    }
  }

  async saveSettings(settings: AppSettings): Promise<boolean> {
    if (invoke) {
      try {
        await invoke("save_settings", { settings })
      } catch (error) {
        console.error("Failed to save settings:", error)
      }
    }

    // Always save to localStorage as backup
    localStorage.setItem("app-settings", JSON.stringify(settings))
    this.applyTheme(settings.general.theme)
    return true
  }

  private applyTheme(theme: "light" | "dark" | "system") {
    const root = document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }

  // RFID operations
  async connectRfidReader(port: string, baudRate: number): Promise<boolean> {
    if (invoke) {
      try {
        return await invoke("connect_rfid_reader", { port, baudRate })
      } catch (error) {
        console.error("Failed to connect RFID reader:", error)
      }
    }

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return Math.random() > 0.3 // 70% success rate
  }

  async disconnectRfidReader(): Promise<boolean> {
    if (invoke) {
      try {
        return await invoke("disconnect_rfid_reader")
      } catch (error) {
        console.error("Failed to disconnect RFID reader:", error)
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
    return true
  }

  async getRfidStatus(): Promise<{ connected: boolean; port?: string }> {
    if (invoke) {
      try {
        return await invoke("get_rfid_status")
      } catch (error) {
        console.error("Failed to get RFID status:", error)
      }
    }

    return { connected: Math.random() > 0.5, port: "COM3" }
  }

  async scanAvailablePorts(): Promise<string[]> {
    if (invoke) {
      try {
        return await invoke("scan_available_ports")
      } catch (error) {
        console.error("Failed to scan ports:", error)
      }
    }

    return ["COM1", "COM2", "COM3", "COM4", "COM5", "COM6"]
  }

  // System operations
  async getSystemStats(): Promise<SystemStats> {
    if (invoke) {
      try {
        return await invoke("get_system_stats")
      } catch (error) {
        console.error("Failed to get system stats:", error)
      }
    }

    // Mock stats based on current data
    const students = this.mockData.students
    const payments = this.mockData.payments

    return {
      totalStudents: students.length,
      activeStudents: students.filter((s) => s.sessionsRemaining > 0).length,
      totalRevenue: payments.reduce((sum, p) => sum + (p.paidAmount || 0), 0),
      monthlyRevenue: payments
        .filter((p) => new Date(p.createdAt).getMonth() === new Date().getMonth())
        .reduce((sum, p) => sum + (p.paidAmount || 0), 0),
      pendingPayments: payments.filter((p) => p.status !== "paid").length,
      rfidConnected: Math.random() > 0.5,
      lastBackup: new Date(Date.now() - 86400000).toISOString(),
      systemUptime: 86400,
    }
  }

  async createBackup(): Promise<{ success: boolean; path?: string; error?: string }> {
    if (invoke) {
      try {
        return await invoke("create_backup")
      } catch (error) {
        console.error("Failed to create backup:", error)
      }
    }

    // Mock backup
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return {
      success: Math.random() > 0.1,
      path: `./backups/backup_${new Date().toISOString().split("T")[0]}.db`,
    }
  }

  async restoreBackup(path: string): Promise<{ success: boolean; error?: string }> {
    if (invoke) {
      try {
        return await invoke("restore_backup", { path })
      } catch (error) {
        console.error("Failed to restore backup:", error)
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 3000))
    return { success: Math.random() > 0.2 }
  }

  async exportData(format: "csv" | "json" | "pdf"): Promise<{ success: boolean; path?: string; error?: string }> {
    if (invoke) {
      try {
        return await invoke("export_data", { format })
      } catch (error) {
        console.error("Failed to export data:", error)
      }
    }

    // Mock export with delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return {
      success: true,
      path: `./exports/data_export_${Date.now()}.${format}`,
    }
  }
}

export const tauriApi = new TauriAPI()
