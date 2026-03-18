import { AdminProfileForm } from "@/components/admin/admin-profile-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { getCurrentUser } from "@/lib/auth"
import { Bell, CreditCard, Globe, Mail, Shield, Zap, Settings as SettingsIcon, Save } from "lucide-react"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default async function AdminSettingsPage() {
  const user = await getCurrentUser()
  if (!user) return redirect("/auth/login")

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black font-display tracking-tight text-foreground flex items-center gap-3">
            <SettingsIcon className="w-10 h-10 text-primary" />
            Configurações
          </h1>
          <p className="text-muted-foreground mt-2 font-medium italic">
            Gerencie as preferências da plataforma Connect Digital School.
          </p>
        </div>
        <Button className="rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
          <Save className="w-4 h-4 mr-2" />
          Salvar Tudo
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Navigation / Sidebar (Optional, for now just a simple column) */}
        <div className="lg:col-span-4 space-y-4">
           <div className="sticky top-10 space-y-4">
              <div className="p-1.5 bg-muted/50 rounded-2xl border flex flex-col gap-1">
                 {[
                   { icon: Globe, label: "Geral", active: true },
                   { icon: Mail, label: "E-mail" },
                   { icon: CreditCard, label: "Pagamentos" },
                   { icon: Bell, label: "Notificações" },
                   { icon: Shield, label: "Segurança" },
                   { icon: Zap, label: "Performance" },
                 ].map((item, i) => (
                   <button key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${item.active ? "bg-background shadow-md text-primary" : "text-muted-foreground hover:bg-background/50"}`}>
                      <item.icon className="w-4 h-4" />
                      {item.label}
                   </button>
                 ))}
              </div>
              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                 <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">Dica Pro</p>
                 <p className="text-xs text-primary/70 font-medium">As alterações feitas aqui afetam todos os utilizadores do sistema em tempo real.</p>
              </div>
           </div>
        </div>

        {/* Form Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Personal Settings */}
          <div className="group">
             <AdminProfileForm user={user} />
          </div>

          {/* General Settings */}
          <Card className="rounded-3xl shadow-sm border-none bg-card/50 backdrop-blur-sm ring-1 ring-border group hover:ring-primary/20 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-black text-xl">
                <Globe className="h-5 w-5 text-blue-500" />
                Geral
              </CardTitle>
              <CardDescription className="font-medium text-xs">Informações base da plataforma Connect</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Nome da Plataforma</Label>
                  <Input defaultValue="Connect Digital School" className="rounded-xl border-none ring-1 ring-border focus-visible:ring-primary/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Descrição</Label>
                  <Input defaultValue="Plataforma gamificada de ensino de inglês" className="rounded-xl border-none ring-1 ring-border focus-visible:ring-primary/50" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card className="rounded-3xl shadow-sm border-none bg-card/50 backdrop-blur-sm ring-1 ring-border group hover:ring-primary/20 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-black text-xl">
                <Mail className="h-5 w-5 text-primary" />
                Configurações de Email
              </CardTitle>
              <CardDescription className="font-medium text-xs">Configure o servidor de envio (SMTP)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">SMTP Host</Label>
                  <Input placeholder="smtp.resend.com" className="rounded-xl border-none ring-1 ring-border" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">SMTP Port</Label>
                  <Input type="number" defaultValue="587" className="rounded-xl border-none ring-1 ring-border" />
                </div>
              </div>
              <Button variant="outline" className="rounded-xl font-bold w-full bg-background border-dashed border-2 hover:border-primary hover:text-primary transition-all">Testar Ligação SMTP</Button>
            </CardContent>
          </Card>

          {/* Payment Gateway */}
          <Card className="rounded-3xl shadow-sm border-none bg-card/50 backdrop-blur-sm ring-1 ring-border group hover:ring-primary/20 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-black text-xl">
                <CreditCard className="h-5 w-5 text-emerald-500" />
                Pagamentos
              </CardTitle>
              <CardDescription className="font-medium text-xs">Integração com gateway para recebimento (MZN)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-dashed border-emerald-500/30">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center font-black text-emerald-600">MP</div>
                    <div>
                      <p className="font-black">Mercado Pago</p>
                      <p className="text-xs text-muted-foreground italic">Ligado via Webhook</p>
                    </div>
                 </div>
                 <Badge className="bg-emerald-500/20 text-emerald-600 border-none font-black text-[10px]">ATIVO</Badge>
              </div>
              <div className="flex items-center justify-between px-2">
                <div className="space-y-0.5">
                  <Label className="font-black">Modo de Produção</Label>
                  <p className="text-xs text-muted-foreground">Desative para usar o ambiente de testes (Sandbox)</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="rounded-3xl shadow-sm border-none bg-card/50 backdrop-blur-sm ring-1 ring-border group hover:ring-primary/20 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-black text-xl">
                <Shield className="h-5 w-5 text-red-500" />
                Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {[
                 { label: "Autenticação 2FA", desc: "Exigir código extra para administradores" },
                 { label: "Forçar Senha Forte", desc: "Mínimo 8 caracteres, números e símbolos", checked: true },
                 { label: "Logs de Auditoria", desc: "Registar todas as trocas feitas por admins", checked: true }
               ].map((sec, i) => (
                 <div key={i} className="flex items-center justify-between px-2 py-2">
                    <div className="space-y-0.5">
                      <Label className="font-black text-sm">{sec.label}</Label>
                      <p className="text-xs text-muted-foreground">{sec.desc}</p>
                    </div>
                    <Switch defaultChecked={sec.checked} />
                 </div>
               ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
