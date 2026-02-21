import { AdminProfileForm } from "@/components/admin/admin-profile-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { getCurrentUser } from "@/lib/auth"
import { Bell, CreditCard, Globe, Mail, Shield, Zap } from "lucide-react"
import { redirect } from "next/navigation"

export default async function AdminSettingsPage() {
  const user = await getCurrentUser()
  if (!user) return redirect("/auth/login")

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Configurações da Plataforma</h1>
        <p className="text-muted-foreground">Gerencie as configurações gerais do Connect Digital School</p>
      </div>

      <div className="space-y-6">
        {/* Personal Settings (NEW) */}
        <AdminProfileForm user={user} />

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Configurações Gerais
            </CardTitle>
            <CardDescription>
              Informações básicas da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform-name">Nome da Plataforma</Label>
              <Input id="platform-name" defaultValue="Connect Digital School" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform-description">Descrição</Label>
              <Input
                id="platform-description"
                defaultValue="Plataforma gamificada de ensino de inglês"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Email de Suporte</Label>
              <Input
                id="support-email"
                type="email"
                defaultValue="support@connect-school.com"
              />
            </div>
            <Button>Salvar Alterações</Button>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Configurações de Email
            </CardTitle>
            <CardDescription>
              Configure o servidor SMTP e templates de email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input id="smtp-host" placeholder="smtp.example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input id="smtp-port" type="number" placeholder="587" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-user">SMTP Usuario</Label>
              <Input id="smtp-user" type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-pass">SMTP Senha</Label>
              <Input id="smtp-pass" type="password" />
            </div>
            <Button variant="outline">Testar Conexão</Button>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Configurações de Pagamento
            </CardTitle>
            <CardDescription>
              Integração com gateway de pagamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-gateway">Gateway de Pagamento</Label>
              <Select defaultValue="mercadopago">
                <SelectTrigger id="payment-gateway">
                  <SelectValue placeholder="Gateway" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input id="api-key" type="password" placeholder="••••••••••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-secret">API Secret</Label>
              <Input id="api-secret" type="password" placeholder="••••••••••••••••" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Modo de Teste</Label>
                <p className="text-sm text-muted-foreground">
                  Ativar modo sandbox para testes
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure notificações automáticas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email de Boas-vindas</Label>
                <p className="text-sm text-muted-foreground">
                  Enviar email ao cadastrar novo usuário
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Lembrete de Curso</Label>
                <p className="text-sm text-muted-foreground">
                  Lembrar alunos sobre cursos pendentes
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Relatórios Semanais</Label>
                <p className="text-sm text-muted-foreground">
                  Enviar relatórios para administradores
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança
            </CardTitle>
            <CardDescription>
              Configurações de segurança da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Autenticação de Dois Fatores</Label>
                <p className="text-sm text-muted-foreground">
                  Exigir 2FA para administradores
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Força de Senha</Label>
                <p className="text-sm text-muted-foreground">
                  Exigir senhas fortes
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Timeout de Sessão (minutos)</Label>
              <Input id="session-timeout" type="number" defaultValue="60" />
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance
            </CardTitle>
            <CardDescription>
              Otimizações e cache
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cache de Conteúdo</Label>
                <p className="text-sm text-muted-foreground">
                  Ativar cache para melhor performance
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="cache-duration">Duração do Cache (horas)</Label>
              <Input id="cache-duration" type="number" defaultValue="24" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
