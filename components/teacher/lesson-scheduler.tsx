"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateLesson } from "@/lib/actions/teacher"
import {
    CalendarDays,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    Globe,
    Sparkles,
    Trash2,
    X,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface LessonSchedulerProps {
  lessonId: string
  initialScheduledAt?: Date | string | null
  lessonTitle: string
  published: boolean
}

const MONTHS_PT = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
]
const DAYS_PT = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export function LessonScheduler({ lessonId, initialScheduledAt, lessonTitle, published }: LessonSchedulerProps) {
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())

  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    if (initialScheduledAt) return new Date(initialScheduledAt)
    return null
  })

  const [hour, setHour] = useState(() => {
    if (initialScheduledAt) return new Date(initialScheduledAt).getHours()
    return 9
  })
  const [minute, setMinute] = useState(() => {
    if (initialScheduledAt) return new Date(initialScheduledAt).getMinutes()
    return 0
  })

  const [saving, setSaving] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Navigate months
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)

  const handleDayClick = (day: number) => {
    const clicked = new Date(viewYear, viewMonth, day)
    if (clicked < new Date(now.getFullYear(), now.getMonth(), now.getDate())) return // no past dates
    setSelectedDate(clicked)
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return selectedDate.getFullYear() === viewYear &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getDate() === day
  }

  const isToday = (day: number) => {
    return now.getFullYear() === viewYear && now.getMonth() === viewMonth && now.getDate() === day
  }

  const isPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day)
    return d < new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }

  const scheduledDateTime = selectedDate
    ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), hour, minute)
    : null

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateLesson(lessonId, {
        scheduledAt: scheduledDateTime ? scheduledDateTime.toISOString() : undefined,
      } as any)
      toast.success(scheduledDateTime
        ? `Aula agendada para ${scheduledDateTime.toLocaleString("pt-BR")}`
        : "Agendamento removido"
      )
    } catch {
      toast.error("Erro ao salvar agendamento")
    } finally {
      setSaving(false)
    }
  }

  const handleClear = async () => {
    setSelectedDate(null)
    setShowClearConfirm(false)
    setSaving(true)
    try {
      await updateLesson(lessonId, { scheduledAt: null } as any)
      toast.success("Agendamento removido")
    } catch {
      toast.error("Erro ao remover agendamento")
    } finally {
      setSaving(false)
    }
  }

  // Smart suggestion: next Monday 09:00
  const suggestionNextMonday = (() => {
    const d = new Date()
    d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7 || 7))
    return d
  })()

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Calendar */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/15 rounded-xl">
                  <CalendarDays className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Agendar Disponibilização</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Escolha quando a aula ficará visível para os alunos
                  </CardDescription>
                </div>
              </div>
              {selectedDate && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remover
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-base font-semibold tabular-nums">
                {MONTHS_PT[viewMonth]} {viewYear}
              </span>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS_PT.map((d) => (
                <div key={d} className="text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wide py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty filler cells */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const past = isPast(day)
                const today = isToday(day)
                const selected = isSelected(day)

                return (
                  <button
                    key={day}
                    disabled={past}
                    onClick={() => handleDayClick(day)}
                    className={[
                      "relative h-10 w-full rounded-xl text-sm font-medium transition-all duration-150",
                      past
                        ? "text-muted-foreground/30 cursor-not-allowed"
                        : "hover:bg-primary/10 cursor-pointer",
                      selected
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 hover:bg-primary"
                        : today && !selected
                        ? "ring-2 ring-primary/40 text-primary bg-primary/5"
                        : "",
                    ].join(" ")}
                  >
                    {day}
                    {today && !selected && (
                      <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Time picker */}
            <div className="mt-6 pt-6 border-t space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="w-4 h-4 text-primary" />
                Horário de disponibilização
              </div>
              <div className="flex items-center gap-4">
                {/* Hour */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setHour(h => (h + 1) % 24)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 rotate-[-90deg]" />
                  </button>
                  <div className="w-16 h-14 rounded-xl bg-muted/60 border flex items-center justify-center font-mono text-2xl font-bold">
                    {String(hour).padStart(2, "0")}
                  </div>
                  <button
                    onClick={() => setHour(h => (h - 1 + 24) % 24)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 rotate-[90deg]" />
                  </button>
                </div>

                <span className="text-3xl font-bold text-muted-foreground font-mono">:</span>

                {/* Minute */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setMinute(m => (m + 15) % 60)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 rotate-[-90deg]" />
                  </button>
                  <div className="w-16 h-14 rounded-xl bg-muted/60 border flex items-center justify-center font-mono text-2xl font-bold">
                    {String(minute).padStart(2, "0")}
                  </div>
                  <button
                    onClick={() => setMinute(m => (m - 15 + 60) % 60)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 rotate-[90deg]" />
                  </button>
                </div>

                {/* Quick times */}
                <div className="flex flex-col gap-2 ml-4">
                  {[{h:8,m:0,label:"08:00"},{h:12,m:0,label:"12:00"},{h:18,m:0,label:"18:00"},{h:20,m:0,label:"20:00"}].map(t => (
                    <button
                      key={t.label}
                      onClick={() => { setHour(t.h); setMinute(t.m) }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                        hour === t.h && minute === t.m
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "hover:bg-muted border-transparent text-muted-foreground"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timezone note */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Globe className="w-3.5 h-3.5" />
                Horário de Brasília (BRT/UTC-3)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right sidebar: Preview + suggestions */}
      <div className="space-y-6">
        {/* Live preview */}
        <Card className={`transition-all ${selectedDate ? "border-primary/30 bg-primary/5" : ""}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Pré-visualização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scheduledDateTime ? (
              <>
                <div className="text-center py-4">
                  <div className="text-4xl font-bold font-mono text-primary tabular-nums">
                    {String(hour).padStart(2, "0")}:{String(minute).padStart(2, "0")}
                  </div>
                  <div className="text-lg font-semibold mt-1">
                    {scheduledDateTime.toLocaleDateString("pt-BR", { weekday:"long", day:"numeric", month:"long" })}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {scheduledDateTime.toLocaleDateString("pt-BR", { year:"numeric" })}
                  </div>
                </div>

                <div className="bg-background rounded-lg border p-3 space-y-1">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-semibold">Aula</p>
                  <p className="text-sm font-medium truncate">{lessonTitle}</p>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  {published
                    ? "⚠️ Aula já está publicada. O agendamento controlará a visibilidade."
                    : "A aula ficará disponível automaticamente neste horário."}
                </div>

                <Button
                  className="w-full"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Check className="w-4 h-4 mr-2" />
                  {saving ? "Salvando..." : "Confirmar Agendamento"}
                </Button>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Selecione uma data no calendário</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Smart suggestions */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm">Sugestões</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              {
                label: "Próxima Segunda — 09:00",
                hint: "Início de semana, maior engajamento",
                date: suggestionNextMonday,
                h: 9, m: 0,
              },
              {
                label: "Hoje — 20:00",
                hint: "Horário nobre para estudos",
                date: now,
                h: 20, m: 0,
              },
              {
                label: "Amanhã — 08:00",
                hint: "Início de dia produtivo",
                date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
                h: 8, m: 0,
              },
            ].map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedDate(s.date)
                  setViewYear(s.date.getFullYear())
                  setViewMonth(s.date.getMonth())
                  setHour(s.h)
                  setMinute(s.m)
                }}
                className="w-full text-left p-3 rounded-lg border hover:border-primary/40 hover:bg-primary/5 transition-all group"
              >
                <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{s.label}</p>
                <p className="text-[11px] text-muted-foreground">{s.hint}</p>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Clear confirm overlay */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-sm w-full shadow-2xl border-destructive/30">
            <CardHeader>
              <CardTitle className="text-base">Remover agendamento?</CardTitle>
              <CardDescription>
                A aula deixará de ter uma data de disponibilização programada.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3 pt-0">
              <Button variant="outline" className="flex-1" onClick={() => setShowClearConfirm(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleClear} disabled={saving}>
                <Trash2 className="w-4 h-4 mr-2" />
                Remover
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
