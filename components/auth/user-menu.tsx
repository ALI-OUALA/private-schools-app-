"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { User, Settings, LogOut, Shield, Clock, Mail } from "lucide-react"

export function UserMenu() {
  const { user, logout } = useAuth()
  const [showProfile, setShowProfile] = useState(false)

  if (!user) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500 text-white"
      case "teacher":
        return "bg-blue-500 text-white"
      case "staff":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrateur"
      case "teacher":
        return "Enseignant"
      case "staff":
        return "Personnel"
      default:
        return role
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start p-2 h-auto">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                <AvatarFallback className="text-xs">{getInitials(user.username)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium truncate">{user.username}</p>
                <p className="text-xs text-muted-foreground">{getRoleLabel(user.role)}</p>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.username}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowProfile(true)}>
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Déconnexion</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Profil Utilisateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`/placeholder.svg?height=64&width=64`} />
                <AvatarFallback className="text-lg">{getInitials(user.username)}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{user.username}</h3>
                <Badge className={getRoleBadgeColor(user.role)}>{getRoleLabel(user.role)}</Badge>
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Dernière connexion: {user.lastLogin ? new Date(user.lastLogin).toLocaleString("fr-FR") : "Jamais"}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">ID: {user.id}</span>
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Permissions</h4>
              <div className="flex flex-wrap gap-2">
                {user.permissions.map((permission) => (
                  <Badge key={permission} variant="outline" className="text-xs">
                    {permission === "all" ? "Toutes les permissions" : permission}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
