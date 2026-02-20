"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    createForumPost,
    upvoteForumPost,
} from "@/lib/actions/student"
import { type ForumPost } from "@/lib/data"
import { cn } from "@/lib/utils"
import {
    ArrowUpDown,
    Filter,
    GraduationCap,
    Loader2,
    MessageCircle,
    Plus,
    Search,
    ThumbsUp,
    X,
} from "lucide-react"
import { useRef, useState, useTransition } from "react"
import { toast } from "sonner"

const categories = [
  "All",
  "General",
  "Grammar Help",
  "Study Groups",
  "Resources",
]

function PostCard({
  post,
  onUpvote,
  upvoting,
}: {
  post: ForumPost
  onUpvote: (id: string) => void
  upvoting: boolean
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="hover:border-primary/20 transition-colors">
      <CardContent className="p-5">
        <div className="flex gap-4">
          {/* Upvote */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <button
              onClick={() => onUpvote(post.id)}
              disabled={upvoting}
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/[0.03] transition-colors text-muted-foreground hover:text-primary disabled:opacity-50"
              aria-label="Upvote"
            >
              {upvoting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ThumbsUp className="w-4 h-4" />
              )}
            </button>
            <span className="text-sm font-bold text-foreground">
              {post.upvotes}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-left w-full"
                >
                  <h3 className="text-base font-semibold text-foreground hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                </button>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <Badge variant="outline" className="text-xs">
                    {post.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {post.createdAt}
                  </span>
                </div>
              </div>
            </div>

            {expanded && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                {post.content}
              </p>
            )}

            <div className="flex items-center gap-4">
              {/* Author */}
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold",
                    post.author.isTeacher
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {post.author.avatar}
                </div>
                <span className="text-sm text-foreground font-medium">
                  {post.author.name}
                </span>
                {post.author.isTeacher && (
                  <Badge className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                    <GraduationCap className="w-3 h-3 mr-1" />
                    Teacher
                  </Badge>
                )}
              </div>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MessageCircle className="w-3.5 h-3.5" />
                {post.replies} replies
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ForumPage({ initialPosts }: { initialPosts: ForumPost[] }) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [posts, setPosts] = useState(initialPosts)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [upvotingId, setUpvotingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const titleRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const [selectedCategory, setSelectedCategory] = useState("General")

  const filteredPosts = posts
    .filter(
      (p) => activeCategory === "All" || p.category === activeCategory
    )
    .filter(
      (p) =>
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "popular") return b.upvotes - a.upvotes
      if (sortBy === "replies") return b.replies - a.replies
      return 0
    })

  const handleUpvote = (id: string) => {
    setUpvotingId(id)
    startTransition(async () => {
      try {
        await upvoteForumPost(id)
        setPosts((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p
          )
        )
      } catch {
        toast.error("Erro ao votar. Tente novamente.")
      } finally {
        setUpvotingId(null)
      }
    })
  }

  const handleCreatePost = () => {
    const title = titleRef.current?.value.trim() ?? ""
    const content = contentRef.current?.value.trim() ?? ""

    if (!title || !content) {
      toast.error("Preencha o título e o conteúdo.")
      return
    }

    startTransition(async () => {
      try {
        const post = await createForumPost({ title, content, category: selectedCategory })
        toast.success("Post publicado com sucesso!")
        setDialogOpen(false)
        // Optimistically add post to list with a placeholder author
        setPosts((prev) => [
          {
            id: post.id,
            title,
            content,
            category: selectedCategory,
            upvotes: 0,
            replies: 0,
            createdAt: "agora mesmo",
            author: { name: "Você", avatar: "VC", isTeacher: false },
            name: "Você",
            avatar: "VC",
            isTeacher: false,
          },
          ...prev,
        ])
        if (titleRef.current) titleRef.current.value = ""
        if (contentRef.current) contentRef.current.value = ""
      } catch {
        toast.error("Erro ao publicar. Tente novamente.")
      }
    })
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black font-display text-foreground">
            Fórum da Comunidade
          </h1>
          <p className="text-muted-foreground mt-1">
            Tire dúvidas, compartilhe dicas e conecte-se com outros alunos
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Postagem
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">
                Criar Nova Postagem
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <label
                  htmlFor="post-title"
                  className="text-sm font-medium text-foreground mb-1.5 block"
                >
                  Título
                </label>
                <Input
                  id="post-title"
                  ref={titleRef}
                  placeholder="Qual é a sua dúvida ou assunto?"
                />
              </div>
              <div>
                <label
                  htmlFor="post-category"
                  className="text-sm font-medium text-foreground mb-1.5 block"
                >
                  Categoria
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger id="post-category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((c) => c !== "All")
                      .map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="post-content"
                  className="text-sm font-medium text-foreground mb-1.5 block"
                >
                  Conteúdo
                </label>
                <Textarea
                  id="post-content"
                  ref={contentRef}
                  placeholder="Escreva sua postagem aqui..."
                  rows={5}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
                <Button onClick={handleCreatePost} disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Publicar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar discussões..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Limpar pesquisa"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-44">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Mais Recentes</SelectItem>
            <SelectItem value="popular">Mais Populares</SelectItem>
            <SelectItem value="replies">Mais Respostas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Filter className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">
                Nenhuma postagem encontrada
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Seja o primeiro a postar nessa categoria!
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onUpvote={handleUpvote}
              upvoting={upvotingId === post.id}
            />
          ))
        )}
      </div>

      {/* Stats Bar */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span>
              <strong className="text-foreground">{posts.length}</strong> postagens
            </span>
            <span>
              <strong className="text-foreground">
                {posts.reduce((a, p) => a + p.replies, 0)}
              </strong>{" "}
              respostas
            </span>
            <span>
              <strong className="text-foreground">
                {posts.filter((p) => p.author.isTeacher).length}
              </strong>{" "}
              posts de professores
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
