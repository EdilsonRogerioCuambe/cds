"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Loader2, Rocket, Settings, User } from "lucide-react"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { resetPasswordAction } from "@/app/actions/auth"

export default function OnboardingPage() {
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || ""
    const router = useRouter()

    const [formData, setFormData] = useState({
        password: "",
        otp: "",
        bio: "",
        specialty: "",
    })

    const handleNext = () => setStep(step + 1)

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        
        // Use the existing resetPasswordAction logic
        const data = new FormData()
        data.append("email", email)
        data.append("password", formData.password)
        data.append("token", formData.otp) // Using 'token' as expected by resetPasswordAction

        const res = await resetPasswordAction(null, data)
        setIsLoading(false)

        if (res.success) {
            toast.success("Senha configurada com sucesso!")
            setStep(2)
        } else {
            toast.error(res.error || "Erro ao configurar senha. Verifique o código.")
        }
    }

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        
        // Here we could have an action to update user profile
        // For now, let's simulate and redirect to pending
        setTimeout(() => {
            setIsLoading(false)
            toast.success("Perfil atualizado! Aguarde a aprovação final.")
            router.push("/auth/pending")
        }, 1500)
    }

    return (
        <div className="max-w-md mx-auto space-y-8 py-10">
            <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-4">
                    <Rocket className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-[#132747]">Bem-vindo à Connect!</h1>
                <p className="text-muted-foreground">Vamos configurar sua conta de instrutor em poucos passos.</p>
            </div>

            {/* Progress Stepper */}
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

            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Settings className="w-5 h-5" /> Configurar Senha
                        </h2>
                        <p className="text-sm text-muted-foreground">Utilize o código enviado para seu e-mail ({email}) para definir sua senha de acesso.</p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="otp">Código de Verificação (OTP)</Label>
                            <Input 
                                id="otp" 
                                placeholder="000000" 
                                value={formData.otp}
                                onChange={(e) => setFormData({...formData, otp: e.target.value})}
                                required 
                                className="h-12 text-center text-xl tracking-widest font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Nova Senha</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required 
                                className="h-12"
                            />
                        </div>
                        <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl gradient-brand shadow-lg">
                            {isLoading ? <Loader2 className="animate-spin" /> : "Confirmar Senha"}
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
