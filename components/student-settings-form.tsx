"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { updateProfile } from "@/lib/actions/student"
import { Loader2, Mail, Phone, Save, Shield, User } from "lucide-react"
import { useRef, useState, useTransition } from "react"
import { toast } from "sonner"

type UserData = {
  id: string
  name?: string | null
  email: string
  phone?: string | null
  bio?: string | null
  image?: string | null
}

// Display phone in a friendly format
function displayPhone(phone: string | null | undefined): string {
  if (!phone) return ""
  return phone
}

export function StudentSettingsForm({ user }: { user: UserData }) {
  const [isPending, startTransition] = useTransition()
  const nameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const bioRef = useRef<HTMLInputElement>(null)
  const [displayName, setDisplayName] = useState(user.name ?? "")

  const initials = (user.name ?? user.email)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  // Format phone as user types
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value
    if (val && !val.startsWith("+")) {
      val = "+" + val.replace(/\D/g, "")
    }
    e.target.value = val
  }

  const handleSave = () => {
    const name = nameRef.current?.value.trim() ?? ""
    const phone = phoneRef.current?.value.trim() ?? ""
    const bio = bioRef.current?.value.trim() ?? ""

    if (!name) {
      toast.error("O nome não pode estar vazio.")
      return
    }

    startTransition(async () => {
      try {
        await updateProfile({ name, phone, bio })
        setDisplayName(name)
        toast.success("Perfil atualizado com sucesso!")
      } catch {
        toast.error("Erro ao atualizar perfil. Tente novamente.")
      }
    })
  }

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black font-display">Configurações</h1>
        <p className="text-muted-foreground mt-1">Gerencie seu perfil e informações de contato</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="font-black flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-3xl font-black text-primary">
              {initials}
            </div>
            <div>
              <p className="font-black text-lg">{displayName}</p>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </div>

          <Separator />

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="font-bold">Nome completo</Label>
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

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="font-bold flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Número de Celular
              <span className="text-xs font-normal text-muted-foreground ml-1">
                (WhatsApp / notificações)
              </span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="phone"
                ref={phoneRef}
                type="tel"
                defaultValue={user.phone ?? ""}
                placeholder="+258 84 123 4567"
                onChange={handlePhoneInput}
                className="font-mono tracking-wider"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Será usado para notificações via WhatsApp. Use o formato internacional (ex: +55 para Brasil).
            </p>
          </div>

          <Button
            onClick={handleSave}
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

      {/* Security Card */}
      <Card>
        <CardHeader>
          <CardTitle className="font-black flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Segurança
          </CardTitle>
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
            <Label htmlFor="confirm-pass" className="font-bold">Confirmar nova senha</Label>
            <Input id="confirm-pass" type="password" placeholder="••••••••" />
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            Alterar Senha
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="font-black text-destructive text-base">Zona de Risco</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Estas ações são permanentes e não podem ser desfeitas.
          </p>
          <Button variant="destructive" size="sm">
            Excluir Conta
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
