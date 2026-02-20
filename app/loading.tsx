"use client"

import PremiumSplashScreen from "@/components/splash-screen"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Loading() {
  const pathname = usePathname()
  const [message, setMessage] = useState("Carregando...")

  useEffect(() => {
    // Determine context based on path
    if (pathname?.startsWith("/admin")) {
      if (pathname.includes("/users")) setMessage("Carregando usuários...")
      else if (pathname.includes("/courses")) setMessage("Carregando cursos...")
      else if (pathname.includes("/analytics")) setMessage("Processando dados...")
      else setMessage("Carregando painel administrativo...")
    }
    else if (pathname?.startsWith("/teacher")) {
      if (pathname.includes("/students")) setMessage("Buscando lista de alunos...")
      else if (pathname.includes("/courses")) setMessage("Carregando seus cursos...")
      else setMessage("Carregando área do professor...")
    }
    else if (pathname?.startsWith("/student")) {
      if (pathname.includes("/lesson")) setMessage("Preparando sua lição...")
      else if (pathname.includes("/quiz")) setMessage("Preparando o quiz...")
      else if (pathname.includes("/courses")) setMessage("Buscando cursos disponíveis...")
      else setMessage("Carregando seu dashboard...")
    }
    else if (pathname?.startsWith("/auth")) {
      setMessage("Autenticando...")
    }
    else {
      setMessage("Carregando...")
    }
  }, [pathname])

  return (
    <PremiumSplashScreen
      minDuration={1500}
      loadingText={message}
      brandColor="bg-background"
    />
  )
}
