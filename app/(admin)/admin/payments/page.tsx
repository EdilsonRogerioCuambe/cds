import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import prisma from "@/lib/prisma"
import { CreditCard, DollarSign, Repeat, TrendingUp, User } from "lucide-react"

export default async function AdminPaymentsPage() {
  const [payments, subscriptions] = await Promise.all([
    prisma.payment.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 50
    }),
    prisma.subscription.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 50
    })
  ])

  const totalRevenue = payments
    .filter(p => p.status === "APPROVED")
    .reduce((sum, p) => sum + p.amount, 0)

  const activeSubscriptions = subscriptions.filter(s => s.status === "authorized").length

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Financeiro & Assinaturas</h1>
        <p className="text-muted-foreground">Monitore transações, faturamento e assinaturas ativas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-background border-green-100 dark:border-green-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">Total aprovado na plataforma</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-background border-blue-100 dark:border-blue-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <Repeat className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">Cobranças recorrentes mensais</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-background border-purple-100 dark:border-purple-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Novos Pagamentos</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">{payments.length}</div>
            <p className="text-xs text-muted-foreground">Total de transações (incluindo falhas)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Transações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.user?.name || "Sem Nome"}</TableCell>
                    <TableCell>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === "APPROVED" ? "default" : p.status === "REJECTED" ? "destructive" : "secondary"}>
                        {p.status === "APPROVED" ? "Aprovado" : p.status === "REJECTED" ? "Recusado" : "Pendente"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {payments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      Nenhum pagamento encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Active Subscriptions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Repeat className="h-5 w-5" />
              Assinaturas Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assinante</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Próxima Cobrança</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.user?.name || "Sem Nome"}</TableCell>
                    <TableCell>
                      <Badge variant={s.status === "authorized" ? "outline" : "secondary"}>
                        {s.status === "authorized" ? "Ativa" : "Pausada/Canc"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {s.nextBillingDate ? new Date(s.nextBillingDate).toLocaleDateString() : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
                {subscriptions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                      Nenhuma assinatura encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
