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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
      <div className="fixed bottom-0 left-64 w-[400px] h-[400px] bg-[#10D79E]/5 rounded-full blur-[80px] -ml-40 -mb-40 pointer-events-none" />

      <AppSidebar variant={variant} />
      <MobileNav variant={variant} />
      <main className="lg:ml-64 pt-14 lg:pt-0 min-h-screen p-4 md:p-6 lg:p-8 relative z-10">
        {children}
      </main>
    </div>
  )
}
