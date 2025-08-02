"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserMenu } from "@/components/auth/user-menu"
import { useLanguage } from "@/contexts/language-context"
import {
  LayoutDashboard,
  Users,
  Scan,
  CreditCard,
  FileText,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { t, isRTL } = useLanguage()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navigation = [
    {
      name: t("nav.dashboard"),
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: t("nav.students"),
      href: "/students",
      icon: Users,
    },
    {
      name: t("nav.scan"),
      href: "/scan",
      icon: Scan,
    },
    {
      name: t("nav.payments"),
      href: "/payments",
      icon: CreditCard,
    },
    {
      name: t("nav.reports"),
      href: "/reports",
      icon: FileText,
    },
    {
      name: t("nav.settings"),
      href: "/settings",
      icon: Settings,
    },
  ]

  const toggleCollapsed = () => setCollapsed(!collapsed)
  const toggleMobile = () => setMobileOpen(!mobileOpen)

  return (
    <>
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 md:hidden" onClick={toggleMobile}>
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={toggleMobile} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-full bg-sidebar border-r transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isRTL && "right-0 left-auto border-l border-r-0",
          className,
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">EE</span>
                </div>
                <span className="font-heading font-semibold text-sidebar-foreground">Centre Excellence</span>
              </div>
            )}

            {/* Collapse button - desktop only */}
            <Button variant="ghost" size="icon" onClick={toggleCollapsed} className="hidden md:flex">
              {collapsed ? (
                isRTL ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )
              ) : isRTL ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href} onClick={() => setMobileOpen(false)}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-11",
                        collapsed && "justify-center px-2",
                        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                        isRTL && "flex-row-reverse",
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t p-3">
            {!collapsed && <UserMenu />}
            {!collapsed && (
              <div className="text-xs text-sidebar-foreground/60 text-center mt-3">
                <p>Centre Éducatif Excellence</p>
                <p>Version 2.0.0</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content spacer */}
      <div
        className={cn(
          "hidden md:block transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          isRTL && "ml-auto mr-0",
        )}
      />
    </>
  )
}
