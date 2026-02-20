"use client"

import React from "react"

import { AppSidebar } from "./app-sidebar"
import { MobileNav } from "./mobile-nav"

interface AppShellProps {
  children: React.ReactNode
  variant?: "student" | "teacher" | "admin"
}

export function AppShell({ children, variant = "student" }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar variant={variant} />
      <MobileNav variant={variant} />
      <main className="lg:ml-64 pt-14 lg:pt-0 min-h-screen p-4 md:p-6 lg:p-6">
        {children}
      </main>
    </div>
  )
}
