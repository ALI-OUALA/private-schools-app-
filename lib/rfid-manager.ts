"use client"

// Check if we're in Tauri environment
let invoke: any = null
const isTauri = typeof window !== "undefined" && (window as any).__TAURI__

if (isTauri) {
  try {
    import("@tauri-apps/api/tauri")
      .then((module) => {
        invoke = module.invoke
      })
      .catch(() => {
        console.warn("Tauri invoke not available")
      })
  } catch (error) {
    console.warn("Tauri APIs not available:", error)
  }
}

export interface RFIDCard {
  id: string
  studentId?: string
  studentName?: string
  lastSeen: Date
  isActive: boolean
}

export interface RFIDScanResult {
  success: boolean
  cardId?: string
  studentInfo?: {
    id: string
    name: string
    level: string
    photo?: string
  }
  error?: string
  timestamp: Date
}

export type RFIDStatus = "idle" | "scanning" | "success" | "error"

export class RFIDManager {
  private static instance: RFIDManager
  private isScanning = false
  private mockMode = true // Enable mock mode for development
  private scanHistory: RFIDScanResult[] = []
  private listeners: ((result: RFIDScanResult) => void)[] = []
  private statusListeners: ((status: RFIDStatus) => void)[] = []
  private currentStatus: RFIDStatus = "idle"

  // Mock data for development
  private mockCards: RFIDCard[] = [
    {
      id: "CARD001",
      studentId: "STU001",
      studentName: "Ahmed Benali",
      lastSeen: new Date(),
      isActive: true,
    },
    {
      id: "CARD002",
      studentId: "STU002",
      studentName: "Fatima Khelifi",
      lastSeen: new Date(),
      isActive: true,
    },
    {
      id: "CARD003",
      studentId: "STU003",
      studentName: "Mohamed Saidi",
      lastSeen: new Date(),
      isActive: true,
    },
  ]

  private constructor() {
    this.initializeRFID()
  }

  public static getInstance(): RFIDManager {
    if (!RFIDManager.instance) {
      RFIDManager.instance = new RFIDManager()
    }
    return RFIDManager.instance
  }

  private async initializeRFID() {
    try {
      // Try to initialize real RFID hardware
      if (typeof window !== "undefined" && window.__TAURI__) {
        // Check if Tauri invoke is available
        if (invoke) {
          const result = await invoke("initialize_rfid")
          this.mockMode = !result
          console.log("RFID initialized:", result ? "Hardware" : "Mock mode")
        }
      }
    } catch (error) {
      console.log("RFID hardware not available, using mock mode")
      this.mockMode = true
    }
  }

  private setStatus(status: RFIDStatus) {
    this.currentStatus = status
    this.statusListeners.forEach((listener) => listener(status))
  }

  private notifyListeners(result: RFIDScanResult) {
    this.scanHistory.unshift(result)
    if (this.scanHistory.length > 50) {
      this.scanHistory = this.scanHistory.slice(0, 50)
    }
    this.listeners.forEach((listener) => listener(result))
  }

  public async startScanning(): Promise<void> {
    if (this.isScanning) return

    this.isScanning = true
    this.setStatus("scanning")

    try {
      if (this.mockMode) {
        // Mock scanning with realistic delay
        await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 3000))

        // Simulate success/failure
        const success = Math.random() > 0.2 // 80% success rate

        if (success) {
          const randomCard = this.mockCards[Math.floor(Math.random() * this.mockCards.length)]
          const result: RFIDScanResult = {
            success: true,
            cardId: randomCard.id,
            studentInfo: {
              id: randomCard.studentId!,
              name: randomCard.studentName!,
              level: "Niveau " + (Math.floor(Math.random() * 6) + 1),
              photo: `/placeholder.svg?height=100&width=100&text=${randomCard.studentName?.charAt(0)}`,
            },
            timestamp: new Date(),
          }
          this.setStatus("success")
          this.notifyListeners(result)
        } else {
          const result: RFIDScanResult = {
            success: false,
            error: "Carte non reconnue ou erreur de lecture",
            timestamp: new Date(),
          }
          this.setStatus("error")
          this.notifyListeners(result)
        }
      } else {
        // Real RFID scanning
        const scanResult = await invoke("scan_rfid_card")
        const result: RFIDScanResult = {
          success: !!scanResult,
          cardId: scanResult?.card_id,
          studentInfo: scanResult?.student_info,
          error: scanResult?.error,
          timestamp: new Date(),
        }

        this.setStatus(result.success ? "success" : "error")
        this.notifyListeners(result)
      }
    } catch (error) {
      const result: RFIDScanResult = {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
        timestamp: new Date(),
      }
      this.setStatus("error")
      this.notifyListeners(result)
    } finally {
      this.isScanning = false
      // Reset to idle after 3 seconds
      setTimeout(() => {
        if (this.currentStatus !== "scanning") {
          this.setStatus("idle")
        }
      }, 3000)
    }
  }

  public stopScanning(): void {
    this.isScanning = false
    this.setStatus("idle")
  }

  public onScanResult(callback: (result: RFIDScanResult) => void): () => void {
    this.listeners.push(callback)
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  public onStatusChange(callback: (status: RFIDStatus) => void): () => void {
    this.statusListeners.push(callback)
    return () => {
      const index = this.statusListeners.indexOf(callback)
      if (index > -1) {
        this.statusListeners.splice(index, 1)
      }
    }
  }

  public getStatus(): RFIDStatus {
    return this.currentStatus
  }

  public getScanHistory(): RFIDScanResult[] {
    return [...this.scanHistory]
  }

  public isInMockMode(): boolean {
    return this.mockMode
  }

  public async getConnectedReaders(): Promise<string[]> {
    try {
      if (this.mockMode) {
        return ["Mock RFID Reader v1.0"]
      }
      return await invoke("get_rfid_readers")
    } catch {
      return []
    }
  }

  public async testConnection(): Promise<boolean> {
    try {
      if (this.mockMode) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return true
      }
      return await invoke("test_rfid_connection")
    } catch {
      return false
    }
  }
}

// Export singleton instance
export const rfidManager = RFIDManager.getInstance()
