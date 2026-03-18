import prisma from "@/lib/prisma"
import { TeachersClient } from "./teachers-client"
import { Badge } from "@/components/ui/badge"
import { Award, UserPlus } from "lucide-react"

export default async function AdminTeachersPage() {
    const teachers = await prisma.user.findMany({
        where: {
            role: "TEACHER"
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const activeTeachers = teachers.filter(t => t.status === "ACTIVE").length
    const pendingTeachers = teachers.filter(t => t.status === "PENDING").length

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Gerenciar Professores</h1>
                    <p className="text-muted-foreground">Visualize e gerencie todos os professores da plataforma</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="bg-card rounded-lg border p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Award className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{activeTeachers}</p>
                            <p className="text-sm text-muted-foreground">Professores Ativos</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-lg border p-4 shadow-sm border-yellow-200 bg-yellow-50/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                            <UserPlus className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-yellow-700">{pendingTeachers}</p>
                            <p className="text-sm text-muted-foreground">Aguardando Aprovação</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-lg border p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <UserPlus className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{teachers.length}</p>
                            <p className="text-sm text-muted-foreground">Total de Professores</p>
                        </div>
                    </div>
                </div>
            </div>

            <TeachersClient initialTeachers={JSON.parse(JSON.stringify(teachers))} />
        </div>
    )
}
