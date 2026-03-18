"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { CheckCircle, Mail, MoreVertical, Search, UserPlus, Loader2 } from "lucide-react"
import { approveTeacherAction, inviteTeacherAction } from "@/app/actions/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Teacher {
    id: string
    name: string | null
    email: string
    status: string | null
    createdAt: string
}

export function TeachersClient({ initialTeachers }: { initialTeachers: Teacher[] }) {
    const [search, setSearch] = useState("")
    const [isInviting, setIsInviting] = useState(false)
    const [isPendingAction, setIsPendingAction] = useState<string | null>(null)
    const [openInvite, setOpenInvite] = useState(false)
    const router = useRouter()

    const filteredTeachers = initialTeachers.filter(t => 
        (t.name?.toLowerCase().includes(search.toLowerCase()) || 
         t.email.toLowerCase().includes(search.toLowerCase()))
    )

    const handleApprove = async (id: string) => {
        setIsPendingAction(id)
        const res = await approveTeacherAction(id)
        setIsPendingAction(null)

        if (res.success) {
            toast.success("Instrutor aprovado com sucesso!")
            router.refresh()
        } else {
            toast.error(res.error || "Erro ao aprovar instrutor")
        }
    }

    const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        const name = formData.get("name") as string

        setIsInviting(true)
        const res = await inviteTeacherAction(email, name)
        setIsInviting(false)

        if (res.success) {
            toast.success("Convite enviado com sucesso!")
            setOpenInvite(false)
            router.refresh()
        } else {
            toast.error(res.error || "Erro ao enviar convite")
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nome ou email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                
                <Dialog open={openInvite} onOpenChange={setOpenInvite}>
                    <DialogTrigger asChild>
                        <Button className="gradient-brand shadow-md">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Convidar Instrutor
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Convidar Novo Instrutor</DialogTitle>
                            <DialogDescription>
                                Envie um convite por e-mail para um novo professor. Eles receberão um link para configurar sua senha e perfil.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleInvite} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input id="name" name="name" placeholder="Ex: João Silva" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail</Label>
                                <Input id="email" name="email" type="email" placeholder="instrutor@exemplo.com" required />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isInviting} className="w-full">
                                    {isInviting ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...</>
                                    ) : "Enviar Convite"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Nome e E-mail</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Data de Cadastro</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTeachers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                                    Nenhum instrutor encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTeachers.map((teacher) => (
                                <TableRow key={teacher.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{teacher.name || "N/A"}</span>
                                            <span className="text-xs text-muted-foreground">{teacher.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className="px-3"
                                            variant={teacher.status === "ACTIVE" ? "default" : teacher.status === "PENDING" ? "secondary" : "outline"}
                                        >
                                            {teacher.status === "ACTIVE" ? "Ativo" : teacher.status === "PENDING" ? "Pendente" : "Inativo"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(teacher.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {teacher.status === "PENDING" && (
                                                <Button 
                                                    size="sm" 
                                                    onClick={() => handleApprove(teacher.id)}
                                                    disabled={isPendingAction === teacher.id}
                                                    className="bg-green-600 hover:bg-green-700 h-8"
                                                >
                                                    {isPendingAction === teacher.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <><CheckCircle className="mr-1 h-3.3 w-3.5" /> Aprovar</>
                                                    )}
                                                </Button>
                                            )}
                                            
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
                                                        Ver Detalhes
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
                                                        <Mail className="mr-2 h-4 w-4" />
                                                        Mensagem
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
