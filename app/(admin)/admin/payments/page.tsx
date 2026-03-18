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
import {
  CreditCard,
  DollarSign,
  Repeat,
  TrendingUp,
  User,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Calendar
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 0
    }).format(amount).replace("MZN", "MT")
  }

  const totalRevenue = payments
    .filter(p => p.status === "APPROVED")
    .reduce((sum, p) => sum + p.amount, 0)

  const activeSubscriptions = subscriptions.filter(s => s.status === "authorized").length
  const pendingPayments = payments.filter(p => p.status === "PENDING").length

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black font-display tracking-tight text-foreground flex items-center gap-3">
            <Wallet className="w-10 h-10 text-primary" />
            Financeiro
          </h1>
          <p className="text-muted-foreground mt-1 font-medium italic">
            Gestão de transações, faturamento e subscrições recorrentes.
          </p>
        </div>
      </div>

      {/* Stats Cards - Premium Gradients */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="group relative overflow-hidden rounded-3xl border bg-gradient-to-br from-emerald-500/10 to-transparent p-6 transition-all hover:shadow-2xl hover:shadow-emerald-500/10 duration-500">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <div className="p-3 bg-emerald-500/20 rounded-2xl w-fit">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-emerald-600/70">Receita Total</p>
                <h3 className="text-3xl font-black mt-1 text-foreground">{formatCurrency(totalRevenue)}</h3>
              </div>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-full">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border bg-gradient-to-br from-blue-500/10 to-transparent p-6 transition-all hover:shadow-2xl hover:shadow-blue-500/10 duration-500">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <div className="p-3 bg-blue-500/20 rounded-2xl w-fit">
                <Repeat className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-blue-600/70">Assinaturas Ativas</p>
                <h3 className="text-3xl font-black mt-1 text-foreground">{activeSubscriptions}</h3>
              </div>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border bg-gradient-to-br from-amber-500/10 to-transparent p-6 transition-all hover:shadow-2xl hover:shadow-amber-500/10 duration-500">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <div className="p-3 bg-amber-500/20 rounded-2xl w-fit">
                <CreditCard className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-amber-600/70">Pendentes</p>
                <h3 className="text-3xl font-black mt-1 text-foreground">{pendingPayments}</h3>
              </div>
            </div>
            <div className="p-2 bg-amber-500/10 rounded-full">
               <Calendar className="w-4 h-4 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Recent Transactions - 3/5 width */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between px-2">
             <h2 className="text-2xl font-black font-display text-foreground flex items-center gap-2">
               <TrendingUp className="w-6 h-6 text-primary" />
               Transações Recentes
             </h2>
          </div>
          <div className="rounded-3xl border bg-card overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="font-bold pl-6 py-4">Utilizador</TableHead>
                  <TableHead className="font-bold">Valor</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold pr-6">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id} className="group hover:bg-accent/50 transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                         <Avatar className="h-9 w-9 border-2 border-background group-hover:scale-110 transition-transform">
                           <AvatarImage src={p.user?.image || ""} />
                           <AvatarFallback className="font-black bg-primary/10 text-primary">{p.user?.name?.charAt(0) || "U"}</AvatarFallback>
                         </Avatar>
                         <div className="min-w-0">
                           <p className="text-sm font-bold truncate">{p.user?.name || "Sem Nome"}</p>
                           <p className="text-[10px] text-muted-foreground truncate">{p.user?.email}</p>
                         </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-black text-foreground">
                      {formatCurrency(p.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={p.status === "APPROVED" ? "default" : p.status === "REJECTED" ? "destructive" : "secondary"}
                        className="font-black text-[10px] uppercase tracking-wider px-2"
                      >
                        {p.status === "APPROVED" ? "Aprovado" : p.status === "REJECTED" ? "Recusado" : "Pendente"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-muted-foreground pr-6">
                      {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                  </TableRow>
                ))}
                {payments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-20 text-muted-foreground italic">
                      Nenhuma transação encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Active Subscriptions - 2/5 width */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
             <h2 className="text-2xl font-black font-display text-foreground flex items-center gap-2">
               <Repeat className="w-6 h-6 text-blue-500" />
               Subscrições
             </h2>
          </div>
          <div className="rounded-3xl border bg-card overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="font-bold pl-6 py-4">Assinante</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold pr-6">Renovação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((s) => (
                  <TableRow key={s.id} className="group hover:bg-accent/50 transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center font-black text-blue-600 text-xs">
                           {s.user?.name?.charAt(0) || "U"}
                         </div>
                         <p className="text-sm font-bold truncate">{s.user?.name || "Sem Nome"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${s.status === "authorized" ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">
                          {s.status === "authorized" ? "Ativa" : "Inativa"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-muted-foreground pr-6">
                      {s.nextBillingDate ? new Date(s.nextBillingDate).toLocaleDateString() : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
                {subscriptions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-20 text-muted-foreground italic">
                      Nenhuma assinatura.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
