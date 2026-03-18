"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Loader2, Rocket, Settings, User } from "lucide-react"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { changePasswordOnboardingAction, updateTeacherProfileAction } from "@/app/actions/auth"
import { useSession } from "@/lib/auth-client"

export default function OnboardingPage() {
    const { data: session } = useSession()
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || session?.user?.email || ""
    const router = useRouter()

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        bio: "",
        specialty: "",
    })

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        
        const data = new FormData()
        data.append("currentPassword", formData.currentPassword)
        data.append("newPassword", formData.newPassword)

        const res = await changePasswordOnboardingAction(null, data)
        setIsLoading(false)

        if (res.success) {
            toast.success("Senha atualizada com sucesso!")
            // If admin, we can finish here or go to profile
            if ((session?.user as any)?.role === "ADMIN") {
                router.push("/admin/dashboard")
            } else {
                setStep(2)
            }
        } else {
            toast.error(res.error || "Erro ao atualizar senha. Verifique sua senha temporária.")
        }
    }

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        
        const data = new FormData()
        data.append("bio", formData.bio)
        data.append("specialty", formData.specialty)

        const res = await updateTeacherProfileAction(null, data)
        setIsLoading(false)

        if (res.success) {
            toast.success("Perfil atualizado com sucesso!")
            const userRole = (session?.user as any)?.role
            router.push(userRole === "TEACHER" ? "/teacher/dashboard" : "/student/dashboard")
        } else {
            toast.error(res.error || "Erro ao atualizar perfil")
        }
    }

    const isAdmin = (session?.user as any)?.role === "ADMIN"

    return (
        <div className="max-w-md mx-auto space-y-8 py-10">
            <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-4">
                    <Rocket className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-[#132747]">
                    {isAdmin ? "Configuração de Administrador" : "Bem-vindo à Connect!"}
                </h1>
                <p className="text-muted-foreground">
                    {isAdmin 
                        ? "Para sua segurança, atualize sua senha temporária agora." 
                        : "Vamos configurar sua conta de instrutor em poucos passos."}
                </p>
            </div>

            {/* Progress Stepper - Show only if not admin or show simplified */}
            {!isAdmin && (
                <div className="flex items-center justify-between px-2">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= i ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                                {step > i ? <Check className="w-4 h-4" /> : i}
                            </div>
                            {i === 1 && <div className={`w-24 h-1 mx-2 rounded ${step > 1 ? 'bg-primary' : 'bg-muted'}`} />}
                        </div>
                    ))}
                </div>
            )}

            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Settings className="w-5 h-5" /> {isAdmin ? "Atualizar Senha" : "Configurar Senha"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {isAdmin 
                                ? "Insira sua senha temporária e escolha uma nova senha forte."
                                : `Utilize as informações enviadas para seu e-mail (${email}) para definir sua senha.`}
                        </p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Senha Atual (Temporária)</Label>
                            <Input 
                                id="currentPassword" 
                                type="password"
                                placeholder="Sua senha temporária" 
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                                required 
                                className="h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Nova Senha</Label>
                            <Input 
                                id="newPassword" 
                                type="password" 
                                placeholder="Mínimo 6 caracteres"
                                value={formData.newPassword}
                                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                required 
                                className="h-12"
                            />
                        </div>
                        <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl gradient-brand shadow-lg">
                            {isLoading ? <Loader2 className="animate-spin" /> : "Atualizar Senha"}
                        </Button>
                    </form>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <User className="w-5 h-5" /> Seu Perfil Profissional
                        </h2>
                        <p className="text-sm text-muted-foreground">Conte um pouco sobre você para os alunos.</p>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="specialty">Sua Especialidade (ex: Business English)</Label>
                            <Input 
                                id="specialty" 
                                value={formData.specialty}
                                onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                                placeholder="IELTS, TOEFL, Inglês para conversação..." 
                                required 
                                className="h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Breve Biografia</Label>
                            <textarea 
                                id="bio" 
                                value={formData.bio}
                                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                className="w-full min-h-[120px] rounded-xl border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Conte sobre sua experiência..."
                                required
                            />
                        </div>
                        <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl gradient-brand shadow-lg">
                            {isLoading ? <Loader2 className="animate-spin" /> : "Finalizar Cadastro"}
                        </Button>
                    </form>
                </div>
            )}
        </div>
    )
}
