"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { updateProfile } from "@/lib/actions/student"
import { BookOpen, GraduationCap, Loader2, Mail, Save, User } from "lucide-react"
import { useRef, useState, useTransition } from "react"
import { toast } from "sonner"

type UserData = {
  id: string
  name?: string | null
  email: string
  bio?: string | null
  expertise?: string[]
  image?: string | null
}

export function TeacherSettingsForm({ user }: { user: UserData }) {
  const [isPending, startTransition] = useTransition()
  const nameRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(user.name ?? "")

  const initials = (user.name ?? user.email)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleSaveProfile = () => {
    const newName = nameRef.current?.value.trim()
    if (!newName) {
      toast.error("O nome não pode estar vazio.")
      return
    }
    startTransition(async () => {
      try {
        await updateProfile({ name: newName })
        setName(newName)
        toast.success("Perfil atualizado com sucesso!")
      } catch {
        toast.error("Erro ao atualizar perfil.")
      }
    })
  }

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black font-display">Configurações</h1>
        <p className="text-muted-foreground mt-1">Gerencie seu perfil e preferências</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="font-black flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações do Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-3xl font-black text-primary">
              {initials}
            </div>
            <div>
              <p className="font-black text-lg">{name}</p>
              <p className="text-muted-foreground text-sm">{user.email}</p>
              <div className="flex items-center gap-1 text-xs text-primary font-bold mt-1">
                <GraduationCap className="w-3 h-3" />
                Professor
              </div>
            </div>
          </div>

          <Separator />

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="font-bold">
              Nome completo
            </Label>
            <Input
              id="name"
              ref={nameRef}
              defaultValue={user.name ?? ""}
              placeholder="Seu nome completo"
            />
          </div>

          {/* Email (readonly) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="font-bold flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-muted cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              O email não pode ser alterado aqui.
            </p>
          </div>

          <Button
            onClick={handleSaveProfile}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>

      {/* Bio Card */}
      <Card>
        <CardHeader>
          <CardTitle className="font-black flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Sobre Mim
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio" className="font-bold">
              Biografia
            </Label>
            <Textarea
              id="bio"
              defaultValue={user.bio ?? ""}
              placeholder="Escreva um pouco sobre você, sua experiência e o que você ensina..."
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expertise" className="font-bold">
              Áreas de Especialidade
            </Label>
            <Input
              id="expertise"
              defaultValue={(user.expertise ?? []).join(", ")}
              placeholder="Ex: Grammar, Speaking, Business English"
            />
            <p className="text-xs text-muted-foreground">
              Separe com vírgulas.
            </p>
          </div>

          <Button variant="outline" className="w-full sm:w-auto">
            <Save className="w-4 h-4 mr-2" />
            Salvar Bio
          </Button>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card>
        <CardHeader>
          <CardTitle className="font-black">Segurança</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-pass" className="font-bold">Senha atual</Label>
            <Input id="current-pass" type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-pass" className="font-bold">Nova senha</Label>
            <Input id="new-pass" type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-pass" className="font-bold">Confirmar senha</Label>
            <Input id="confirm-pass" type="password" placeholder="••••••••" />
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            Alterar Senha
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
