"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"

interface StatWidgetProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
  loading?: boolean
}

export function StatWidget({ title, value, icon: Icon, trend, className, loading }: StatWidgetProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-24" />
              <div className="h-8 bg-muted rounded animate-pulse w-16" />
            </div>
            <div className="p-3 bg-muted rounded-xl animate-pulse">
              <div className="h-6 w-6 bg-muted-foreground/20 rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {trend && (
              <div className="flex items-center space-x-1">
                {trend.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${trend.isPositive ? "text-green-500" : "text-red-500"}`}>
                  {trend.isPositive ? "+" : ""}
                  {trend.value}% ce mois
                </span>
              </div>
            )}
          </div>
          <div className="p-3 bg-primary/10 rounded-xl">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
