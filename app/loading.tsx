"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

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
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
      <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-[#10D79E] animate-spin stroke-[1.5px]" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-[#132747]/5 rounded-full" />
        </div>
        <div className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-black text-[#132747] tracking-tight">Connect</h2>
            <p className="text-sm font-medium text-[#132747]/60 animate-pulse uppercase tracking-[0.2em]">
                {message}
            </p>
        </div>
      </div>
    </div>
  )
}
