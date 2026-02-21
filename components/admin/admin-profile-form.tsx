"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile } from "@/lib/actions/student"
import { Loader2, Save, User } from "lucide-react"
import { useRef, useTransition } from "react"
import { toast } from "sonner"

export function AdminProfileForm({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition()
  const nameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)

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

    if (!name) {
      toast.error("O nome não pode estar vazio.")
      return
    }

    startTransition(async () => {
      try {
        await updateProfile({ name, phone })
        toast.success("Perfil atualizado com sucesso!")
      } catch {
        toast.error("Erro ao atualizar perfil.")
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Seu Perfil (Administrador)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="admin-name">Seu Nome</Label>
          <Input id="admin-name" ref={nameRef} defaultValue={user.name ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-phone">Seu Telefone (WhatsApp)</Label>
          <Input
            id="admin-phone"
            ref={phoneRef}
            defaultValue={user.phone ?? ""}
            placeholder="+258 84 123 4567 ou +55..."
            onChange={handlePhoneInput}
          />
        </div>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Salvar Meu Perfil
        </Button>
      </CardContent>
    </Card>
  )
}
