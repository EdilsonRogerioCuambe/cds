import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
  MessageSquare,
  Search,
  Trash2,
  Users,
  MessageCircle,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from "lucide-react"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function AdminForumPage() {
  const [posts, stats] = await Promise.all([
    prisma.forumPost.findMany({
      include: {
        author: true,
        _count: {
          select: { replies: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 50
    }),
    prisma.$transaction([
      prisma.forumPost.count(),
      prisma.forumReply.count(),
      prisma.user.count({ 
        where: { 
          OR: [
            { forumPosts: { some: {} } },
            { forumReplies: { some: {} } }
          ]
        }
      })
    ])
  ])

  const [totalPosts, totalReplies, activeContributors] = stats

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black font-display tracking-tight text-foreground flex items-center gap-3">
            <MessageSquare className="w-10 h-10 text-primary" />
            Moderação do Fórum
          </h1>
          <p className="text-muted-foreground mt-2 font-medium italic">
            Gerencie discussões, modere usuários e monitore o engajamento comunitário.
          </p>
        </div>
      </div>

      {/* Stats - Premium Vibrant Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-3xl border p-6 hover:shadow-xl transition-all border-l-4 border-l-primary">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total de Posts</p>
          <div className="flex items-end justify-between mt-1">
            <h3 className="text-3xl font-black">{totalPosts}</h3>
            <MessageSquare className="w-5 h-5 text-primary/40" />
          </div>
        </div>
        <div className="bg-card rounded-3xl border p-6 hover:shadow-xl transition-all border-l-4 border-l-blue-500">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Respostas</p>
          <div className="flex items-end justify-between mt-1">
            <h3 className="text-3xl font-black text-blue-600">{totalReplies}</h3>
            <MessageCircle className="w-5 h-5 text-blue-500/40" />
          </div>
        </div>
        <div className="bg-card rounded-3xl border p-6 hover:shadow-xl transition-all border-l-4 border-l-emerald-500">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Contribuidores</p>
          <div className="flex items-end justify-between mt-1">
            <h3 className="text-3xl font-black text-emerald-600">{activeContributors}</h3>
            <Users className="w-5 h-5 text-emerald-500/40" />
          </div>
        </div>
        <div className="bg-card rounded-3xl border p-6 hover:shadow-xl transition-all border-l-4 border-l-orange-500">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Atividade (7d)</p>
          <div className="flex items-end justify-between mt-1">
            <h3 className="text-3xl font-black text-orange-600">Alta</h3>
            <TrendingUp className="w-5 h-5 text-orange-500/40" />
          </div>
        </div>
      </div>

      {/* Forum Posts Table */}
      <div className="rounded-3xl border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold pl-6 py-4">Tópico / Autor</TableHead>
              <TableHead className="font-bold">Categoria</TableHead>
              <TableHead className="font-bold text-center">Respostas</TableHead>
              <TableHead className="font-bold text-center">Votos</TableHead>
              <TableHead className="font-bold pr-6">Data</TableHead>
              <TableHead className="text-right pr-6 font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length > 0 ? posts.map((post) => (
               <TableRow key={post.id} className="group hover:bg-accent/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                       <Avatar className="h-9 w-9 border-2 border-background group-hover:scale-110 transition-transform">
                         <AvatarImage src={post.author.image || ""} />
                         <AvatarFallback className="font-black bg-primary/10 text-primary">{post.author.name?.charAt(0) || "U"}</AvatarFallback>
                       </Avatar>
                       <div className="min-w-0">
                          <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{post.title}</p>
                          <p className="text-[10px] text-muted-foreground truncate italic">por <span className="text-foreground font-semibold">{post.author.name}</span></p>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-black text-[10px] uppercase tracking-wider px-2 py-0.5 border-primary/20 bg-primary/5 text-primary-foreground/70">
                      {post.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-bold">{post._count.replies}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                      <span className="text-sm font-bold">{post.upvotes}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-bold text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-2">
                       <Button asChild variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/10 hover:text-primary rounded-xl transition-all" title="Ver no Fórum">
                         <Link href={`/student/forum/${post.id}`}>
                           <ExternalLink className="h-4 w-4" />
                         </Link>
                       </Button>
                       <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:bg-red-50 rounded-xl transition-all" title="Eliminar Post">
                         <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                  </TableCell>
               </TableRow>
            )) : (
              <TableRow>
                 <TableCell colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                       <AlertCircle className="w-8 h-8 opacity-20" />
                       <p className="font-bold text-sm">Nenhum post encontrado no fórum.</p>
                    </div>
                 </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
