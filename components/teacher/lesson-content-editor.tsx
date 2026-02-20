"use client"

import { VideoUpload } from "@/components/teacher/video-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { updateLesson } from "@/lib/actions/teacher"
import {
    BookOpen,
    CalendarDays,
    Clock,
    ExternalLink,
    FileText,
    Globe,
    Loader2,
    Play,
    Zap,
} from "lucide-react"
import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { toast } from "sonner"

interface LessonContentEditorProps {
  lessonId: string
  lessonType: string
  initialVideoUrl?: string
  initialContent?: string
  initialVocabulary?: any[]
  initialScheduledAt?: string | null
  initialMeetingUrl?: string | null
  initialMeetingPlatform?: string | null
  initialChallengeConfig?: any
  title: string
  module: string
  level: string
  initialMetadata?: any
}

// ── Utility: reading time from plain text ──────────────────────────────────────
function calcReadingTime(markdown: string) {
  const plainText = markdown.replace(/[#*_`\[\]()>!\-]/g, " ").trim()
  const words = plainText.split(/\s+/).filter(Boolean).length
  const minutes = Math.ceil(words / 200) // avg 200 wpm
  return { words, minutes }
}

// ── VIDEO editor ──────────────────────────────────────────────────────────────
function VideoEditor({ lessonId, initialVideoUrl, initialContent, initialMetadata }: {
  lessonId: string
  initialVideoUrl?: string
  initialContent?: string
  initialMetadata?: any
}) {
  const [notes, setNotes] = useState(initialContent || "")
  const [saving, setSaving] = useState(false)

  const save = async (data: any) => {
    setSaving(true)
    try {
      await updateLesson(lessonId, data)
      toast.success("Aula atualizada")
    } catch {
      toast.error("Erro ao salvar")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-primary" />
            <CardTitle>Vídeo da Aula</CardTitle>
          </div>
          <CardDescription>Faça upload do vídeo principal desta aula.</CardDescription>
        </CardHeader>
        <CardContent>
          <VideoUpload
            initialUrl={initialVideoUrl}
            onUploadComplete={(url, dur, meta) => save({ videoUrl: url, duration: dur, metadata: meta })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <CardTitle>Notas de Apoio (opcional)</CardTitle>
            </div>
            <Button size="sm" variant="outline" onClick={() => save({ content: notes })} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar Notas"}
            </Button>
          </div>
          <CardDescription>Material complementar ao vídeo, em Markdown.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder={"# Resumo\n\nCole aqui o sumário ou transcrição da aula..."}
            rows={10}
            className="font-mono text-sm"
          />
        </CardContent>
      </Card>
    </div>
  )
}

// ── NOTES editor ──────────────────────────────────────────────────────────────
function NotesEditor({ lessonId, initialContent }: {
  lessonId: string
  initialContent?: string
}) {
  const [content, setContent] = useState(initialContent || "")
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)

  const { words, minutes } = calcReadingTime(content)

  const save = async () => {
    setSaving(true)
    try {
      // Store reading time (minutes) as duration in seconds
      await updateLesson(lessonId, { content, duration: minutes * 60 } as any)
      toast.success(`Notas salvas · Tempo de leitura: ${minutes} min`)
    } catch {
      toast.error("Erro ao salvar notas")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <CardTitle>Conteúdo da Nota</CardTitle>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Reading time indicator */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-mono tabular-nums">{words} palavras</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span className="font-medium text-blue-500">{minutes} min de leitura</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPreview(p => !p)}
                className="h-8 text-xs"
              >
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                {preview ? "Editar" : "Pré-visualizar"}
              </Button>
              <Button size="sm" onClick={save} disabled={saving} className="h-8 text-xs">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                Salvar
              </Button>
            </div>
          </div>
          <CardDescription>
            Escreva o conteúdo em Markdown. O tempo de leitura é calculado automaticamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {preview ? (
            <div className="prose prose-invert max-w-none min-h-[300px] p-4 bg-muted/20 rounded-lg border">
              {content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              ) : (
                <p className="text-muted-foreground italic text-sm">Nenhum conteúdo ainda.</p>
              )}
            </div>
          ) : (
            <Textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={"# Título da Nota\n\n## Introdução\n\nConteúdo da aula em Markdown...\n\n## Tópicos\n\n- Item 1\n- Item 2"}
              rows={20}
              className="font-mono text-sm leading-relaxed"
            />
          )}
        </CardContent>
      </Card>

      {/* Reading time summary */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Tempo de Leitura Estimado</p>
            <p className="text-xs text-muted-foreground">
              Baseado em <span className="font-mono text-foreground">{words}</span> palavras a 200 wpm →{" "}
              <span className="text-blue-500 font-bold">{minutes === 0 ? "menos de 1" : minutes} minuto{minutes !== 1 ? "s" : ""}</span>.
              Salvo como duração da aula automaticamente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ── LIVE editor ───────────────────────────────────────────────────────────────
function LiveEditor({ lessonId, initialScheduledAt, initialMeetingUrl, initialMeetingPlatform }: {
  lessonId: string
  initialScheduledAt?: string | null
  initialMeetingUrl?: string | null
  initialMeetingPlatform?: string | null
}) {
  const [platform, setPlatform] = useState(initialMeetingPlatform || "")
  const [meetingUrl, setMeetingUrl] = useState(initialMeetingUrl || "")
  const [scheduledAt, setScheduledAt] = useState(() => {
    if (!initialScheduledAt) return ""
    // Format for datetime-local input
    const d = new Date(initialScheduledAt)
    return d.toISOString().slice(0, 16)
  })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      await updateLesson(lessonId, {
        meetingPlatform: platform,
        meetingUrl,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      } as any)
      toast.success("Aula ao Vivo atualizada")
    } catch {
      toast.error("Erro ao salvar")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-red-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <CardTitle>Configuração da Aula Ao Vivo</CardTitle>
          </div>
          <CardDescription>Configure os detalhes da sessão síncrona.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Platform */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              Plataforma *
            </Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zoom">🔵 Zoom</SelectItem>
                <SelectItem value="meet">🟢 Google Meet</SelectItem>
                <SelectItem value="teams">🟣 Microsoft Teams</SelectItem>
                <SelectItem value="jitsi">🔴 Jitsi (gratuito)</SelectItem>
                <SelectItem value="other">🔘 Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Meeting URL */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
              Link da Reunião *
            </Label>
            <Input
              value={meetingUrl}
              onChange={e => setMeetingUrl(e.target.value)}
              placeholder="https://zoom.us/j/..."
              type="url"
            />
          </div>

          {/* Scheduled At */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              Data e Hora *
            </Label>
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
            <p className="text-xs text-muted-foreground">Horário de Brasília (BRT/UTC-3)</p>
          </div>

          <Button
            className="w-full"
            onClick={save}
            disabled={saving || !platform || !meetingUrl}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>

      {/* Preview */}
      {meetingUrl && platform && scheduledAt && (
        <Card className="border-muted bg-muted/5">
          <CardContent className="p-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">O aluno verá:</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                <span className="text-lg">{platform === "zoom" ? "🔵" : platform === "meet" ? "🟢" : platform === "teams" ? "🟣" : "📹"}</span>
              </div>
              <div>
                <p className="text-sm font-medium">Aula ao Vivo via {platform}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(scheduledAt).toLocaleString("pt-BR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ── CHALLENGE editor ──────────────────────────────────────────────────────────
function ChallengeEditor({ lessonId, initialChallengeConfig }: {
  lessonId: string
  initialChallengeConfig?: any
}) {
  const [config, setConfig] = useState({
    timeLimit: initialChallengeConfig?.timeLimit || 15,
    passingScore: initialChallengeConfig?.passingScore || 70,
    xpReward: initialChallengeConfig?.xpReward || 100,
  })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      await updateLesson(lessonId, { challengeConfig: config } as any)
      toast.success("Configuração do Desafio salva")
    } catch {
      toast.error("Erro ao salvar")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <CardTitle>Configuração do Desafio</CardTitle>
          </div>
          <CardDescription>
            Defina as regras do desafio. Os exercícios (questões) são gerenciados na aba{" "}
            <strong>Desafios / Quiz</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Time Limit */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Tempo Limite (min)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={120}
                  value={config.timeLimit}
                  onChange={e => setConfig(c => ({ ...c, timeLimit: Number(e.target.value) }))}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">0 = sem limite</p>
            </div>

            {/* Passing Score */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-muted-foreground" />
                Nota Mínima (%)
              </Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={config.passingScore}
                onChange={e => setConfig(c => ({ ...c, passingScore: Number(e.target.value) }))}
              />
              <p className="text-[11px] text-muted-foreground">Para aprovação</p>
            </div>

            {/* XP Reward */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Recompensa XP
              </Label>
              <Input
                type="number"
                min={0}
                step={25}
                value={config.xpReward}
                onChange={e => setConfig(c => ({ ...c, xpReward: Number(e.target.value) }))}
              />
              <p className="text-[11px] text-muted-foreground">XP ao completar</p>
            </div>
          </div>

          {/* Preview bar */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-background/50 rounded-xl border border-amber-500/20 text-center">
            <div>
              <p className="text-xl font-bold font-mono text-foreground">{config.timeLimit}m</p>
              <p className="text-xs text-muted-foreground">Tempo</p>
            </div>
            <div>
              <p className="text-xl font-bold font-mono text-foreground">{config.passingScore}%</p>
              <p className="text-xs text-muted-foreground">Mínimo</p>
            </div>
            <div>
              <p className="text-xl font-bold font-mono text-amber-500">+{config.xpReward}</p>
              <p className="text-xs text-muted-foreground">XP</p>
            </div>
          </div>

          <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white" onClick={save} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
            Salvar Configuração
          </Button>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardContent className="p-5 text-center text-muted-foreground">
          <Zap className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm font-medium">Adicione as questões na aba <strong>Desafios / Quiz</strong></p>
          <p className="text-xs mt-1 opacity-70">As questões do quiz aparecem como o conteúdo do desafio para o aluno.</p>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Router ────────────────────────────────────────────────────────────────────
export function LessonContentEditor({
  lessonId,
  lessonType,
  initialVideoUrl,
  initialContent,
  initialVocabulary,
  initialScheduledAt,
  initialMeetingUrl,
  initialMeetingPlatform,
  initialChallengeConfig,
  title,
  module,
  level,
  initialMetadata,
}: LessonContentEditorProps) {
  switch (lessonType) {
    case "NOTES":
      return <NotesEditor lessonId={lessonId} initialContent={initialContent} />

    case "LIVE":
      return (
        <LiveEditor
          lessonId={lessonId}
          initialScheduledAt={initialScheduledAt}
          initialMeetingUrl={initialMeetingUrl}
          initialMeetingPlatform={initialMeetingPlatform}
        />
      )

    case "CHALLENGE":
      return <ChallengeEditor lessonId={lessonId} initialChallengeConfig={initialChallengeConfig} />

    default: // VIDEO
      return (
        <VideoEditor
          lessonId={lessonId}
          initialVideoUrl={initialVideoUrl}
          initialContent={initialContent}
          initialMetadata={initialMetadata}
        />
      )
  }
}
