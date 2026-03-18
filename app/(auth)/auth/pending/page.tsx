"use client"

import { Button } from "@/components/ui/button"
import { Clock, LogOut, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function PendingApprovalPage() {
    const router = useRouter()

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/")
                }
            }
        })
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 max-w-md mx-auto px-4">
            <div className="relative">
                <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full" />
                <div className="relative p-6 rounded-full bg-yellow-50 border border-yellow-200 shadow-inner animate-pulse">
                    <Clock className="w-16 h-16 text-yellow-600" />
                </div>
            </div>

            <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight text-[#132747]">Aguardando Aprovação</h1>
                <p className="text-muted-foreground leading-relaxed">
                    Sua conta de instrutor foi criada com sucesso! Por segurança e qualidade, nossa equipe administrativa revisará seu perfil em até 24 horas úteis.
                </p>
                <p className="text-sm font-medium text-[#10D79E]">
                    Você receberá um e-mail assim que sua conta for ativada.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full">
                <Button asChild variant="default" className="h-12 rounded-xl bg-[#132747] hover:bg-[#0F2A4A] shadow-lg shadow-[#132747]/20">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para o Início
                    </Link>
                </Button>
                
                <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="h-12 rounded-xl border-dashed"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair da Conta
                </Button>
            </div>

            <div className="pt-8 border-t w-full">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold opacity-50">
                    Connect Digital School
                </p>
            </div>
        </div>
    )
}
