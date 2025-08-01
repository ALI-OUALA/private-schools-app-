import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClientLayout } from "./clientLayout"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Centre Éducatif Excellence - Gestion RFID",
  description: "Système de gestion pour centre éducatif avec technologie RFID",
  keywords: ["éducation", "RFID", "gestion", "étudiants", "Algérie"],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-body antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
