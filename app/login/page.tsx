"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { Eye, EyeOff, Lock, User, AlertCircle, School, Shield, Users, CreditCard } from "lucide-react"

const DEMO_ACCOUNTS = [
  {
    username: "admin",
    password: "admin123",
    role: "admin",
    label: "Administrateur",
    description: "Accès complet au système",
    icon: Shield,
    color: "bg-red-500",
  },
  {
    username: "fatima.benali",
    password: "teacher123",
    role: "teacher",
    label: "Enseignant",
    description: "Gestion des étudiants et présences",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    username: "ahmed.salem",
    password: "staff123",
    role: "staff",
    label: "Personnel",
    description: "Gestion des paiements",
    icon: CreditCard,
    color: "bg-green-500",
  },
]

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [lockoutTime, setLockoutTime] = useState(0)

  const { login, isAuthenticated, loginAttempts } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (lockoutTime > 0) {
      interval = setInterval(() => {
        setLockoutTime((prev) => {
          if (prev <= 1) {
            setError("")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [lockoutTime])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (lockoutTime > 0) {
      return
    }

    if (!username.trim() || !password.trim()) {
      setError("Veuillez saisir votre nom d'utilisateur et mot de passe")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const success = await login(username, password, rememberMe)

      if (!success) {
        if (loginAttempts >= 4) {
          setLockoutTime(300) // 5 minutes lockout
          setError("Trop de tentatives échouées. Compte verrouillé pendant 5 minutes.")
        } else {
          setError(`Identifiants incorrects. ${5 - loginAttempts - 1} tentative(s) restante(s).`)
        }
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la connexion")
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoAccount = (account: (typeof DEMO_ACCOUNTS)[0]) => {
    setUsername(account.username)
    setPassword(account.password)
    setError("")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen overflow-auto page-background relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern dark:bg-pattern-dark opacity-50" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8">
          {/* Left Side - Branding */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 p-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <School className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Centre Éducatif Excellence
                  </h1>
                  <p className="text-muted-foreground">Système de Gestion Professionnel</p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Bienvenue dans votre espace de gestion</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Gérez efficacement vos étudiants, paiements et présences avec notre système intégré RFID.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center space-x-3 p-4 glass-card rounded-xl">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Gestion des Étudiants</h3>
                    <p className="text-sm text-muted-foreground">Suivi complet des inscriptions</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 glass-card rounded-xl">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Suivi des Paiements</h3>
                    <p className="text-sm text-muted-foreground">Gestion financière complète</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 glass-card rounded-xl">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Système RFID</h3>
                    <p className="text-sm text-muted-foreground">Contrôle d'accès automatisé</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex flex-col justify-center space-y-6 max-h-screen overflow-y-auto py-8">
            <Card className="glass-card shadow-2xl">
              <CardHeader className="space-y-4 text-center">
                <div className="mx-auto p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl w-fit shadow-lg">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
                  <CardDescription className="text-base">Accédez à votre espace de gestion</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Demo Accounts */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Comptes de démonstration :</Label>
                  <div className="grid gap-2 max-h-48 overflow-y-auto">
                    {DEMO_ACCOUNTS.map((account) => {
                      const IconComponent = account.icon
                      return (
                        <Button
                          key={account.username}
                          variant="outline"
                          className="justify-start h-auto p-3 hover:bg-muted/50 transition-all duration-200 glass bg-transparent"
                          onClick={() => fillDemoAccount(account)}
                          disabled={isLoading || lockoutTime > 0}
                        >
                          <div className="flex items-center space-x-3 w-full">
                            <div className={`p-2 ${account.color} rounded-lg`}>
                              <IconComponent className="h-4 w-4 text-white" />
                            </div>
                            <div className="text-left flex-1">
                              <div className="font-medium">{account.label}</div>
                              <div className="text-xs text-muted-foreground">{account.description}</div>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {account.username}
                            </Badge>
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Nom d'utilisateur</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Entrez votre nom d'utilisateur"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10 h-12 glass"
                        disabled={isLoading || lockoutTime > 0}
                        autoComplete="username"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Entrez votre mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 glass"
                        disabled={isLoading || lockoutTime > 0}
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading || lockoutTime > 0}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      disabled={isLoading || lockoutTime > 0}
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Se souvenir de moi
                    </Label>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="animate-slide-in glass">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {lockoutTime > 0 ? (
                          <span>Compte verrouillé. Réessayez dans {formatTime(lockoutTime)}</span>
                        ) : (
                          error
                        )}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg"
                    disabled={isLoading || lockoutTime > 0}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        <span>Connexion...</span>
                      </div>
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                </form>

                {/* Login Attempts Indicator */}
                {loginAttempts > 0 && lockoutTime === 0 && (
                  <div className="text-center">
                    <div className="flex justify-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 w-2 rounded-full ${i < loginAttempts ? "bg-red-500" : "bg-muted"}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Tentatives de connexion : {loginAttempts}/5</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground">
              <p>© 2024 Centre Éducatif Excellence. Tous droits réservés.</p>
              <p className="mt-1">Version 2.0.0 - Système de gestion intégré</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
