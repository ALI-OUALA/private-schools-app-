"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  username: string
  email: string
  role: "admin" | "teacher" | "staff"
  permissions: string[]
  lastLogin?: string
  isActive: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  loginAttempts: number
  login: (username: string, password: string, rememberMe?: boolean) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_USERS: Record<string, User> = {
  admin: {
    id: "1",
    username: "admin",
    email: "admin@centre-excellence.dz",
    role: "admin",
    permissions: ["*"],
    isActive: true,
  },
  "fatima.benali": {
    id: "2",
    username: "fatima.benali",
    email: "fatima.benali@centre-excellence.dz",
    role: "teacher",
    permissions: ["students.read", "students.write", "attendance.read", "attendance.write"],
    isActive: true,
  },
  "ahmed.salem": {
    id: "3",
    username: "ahmed.salem",
    email: "ahmed.salem@centre-excellence.dz",
    role: "staff",
    permissions: ["payments.read", "payments.write", "students.read"],
    isActive: true,
  },
}

const DEMO_PASSWORDS: Record<string, string> = {
  admin: "admin123",
  "fatima.benali": "teacher123",
  "ahmed.salem": "staff123",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loginAttempts, setLoginAttempts] = useState(0)

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem("auth-user")
        const storedToken = localStorage.getItem("auth-token")

        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        }
      } catch (error) {
        console.error("Session check failed:", error)
        localStorage.removeItem("auth-user")
        localStorage.removeItem("auth-token")
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (username: string, password: string, rememberMe = false): Promise<boolean> => {
    try {
      // Check demo credentials
      if (DEMO_USERS[username] && DEMO_PASSWORDS[username] === password) {
        const user = {
          ...DEMO_USERS[username],
          lastLogin: new Date().toISOString(),
        }

        setUser(user)
        setLoginAttempts(0)

        // Store session
        const token = btoa(`${username}:${Date.now()}`)
        localStorage.setItem("auth-user", JSON.stringify(user))
        localStorage.setItem("auth-token", token)

        if (rememberMe) {
          localStorage.setItem("auth-remember", "true")
        }

        return true
      }

      // Increment login attempts
      setLoginAttempts((prev) => prev + 1)
      return false
    } catch (error) {
      console.error("Login failed:", error)
      setLoginAttempts((prev) => prev + 1)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setLoginAttempts(0)
    localStorage.removeItem("auth-user")
    localStorage.removeItem("auth-token")
    localStorage.removeItem("auth-remember")
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    if (user.permissions.includes("all")) return true
    return user.permissions.includes(permission)
  }

  const hasRole = (role: string): boolean => {
    if (!user) return false
    return user.role === role
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    loginAttempts,
    login,
    logout,
    hasPermission,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
