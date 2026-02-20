"use client"

import SplashScreen from "@/components/splash-screen"
import { VideoMetadata } from "@/components/teacher/video-editor"
import { VideoUpload } from "@/components/teacher/video-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { completeLesson, syncLessonProgress } from "@/lib/actions/student"
import { cn } from "@/lib/utils"
import {
    BookOpen,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    Clock,
    FileText,
    Maximize,
    Minimize,
    Monitor,
    Pause,
    Play,
    Plus,
    Settings,
    SkipForward,
    Trash2,
    Volume2,
    VolumeX
} from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { toast } from "sonner"

const relatedLessons = [
  {
    id: "l17",
    title: "Present Perfect Continuous",
    duration: "14:30",
    completed: true,
  },
  {
    id: "l19",
    title: "Past Perfect Continuous",
    duration: "13:45",
    completed: false,
  },
  {
    id: "l20",
    title: "Formal vs Informal Writing",
    duration: "12:00",
    completed: true,
  },
]

interface VideoLessonProps {
  currentLesson: any
  isEditable?: boolean
  initialPosition?: number
  isCompleted?: boolean
  onLessonUpdate?: (data: {
    content?: string
    vocabulary?: any
    videoUrl?: string
    duration?: number
    metadata?: VideoMetadata
  }) => Promise<void>
}

export function VideoLesson({ currentLesson, isEditable = false, initialPosition = 0, isCompleted = false, onLessonUpdate }: VideoLessonProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastSyncTimeRef = useRef<number>(Date.now())
  const lastPositionRef = useRef<number>(initialPosition)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [completed, setCompleted] = useState(isCompleted)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [showSubtitles, setShowSubtitles] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const [isTheaterMode, setIsTheaterMode] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [notesExpanded, setNotesExpanded] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Editable State
  const [editableContent, setEditableContent] = useState(currentLesson.notes || "")
  const [editableVocab, setEditableVocab] = useState(currentLesson.vocabulary || [])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setEditableContent(currentLesson.notes || "")
    setEditableVocab(currentLesson.vocabulary || [])
  }, [currentLesson.notes, currentLesson.vocabulary])

  const markdownComponents = {
    h1: ({ ...props }) => <h1 className="text-2xl font-bold text-foreground mt-8 mb-4 border-l-4 border-primary pl-4 font-display" {...props} />,
    h2: ({ ...props }) => <h2 className="text-xl font-bold text-foreground mt-6 mb-3 border-l-2 border-primary/50 pl-3 font-display" {...props} />,
    h3: ({ ...props }) => <h3 className="text-lg font-semibold text-primary mt-6 mb-2" {...props} />,
    p: ({ ...props }) => <p className="text-foreground/70 leading-relaxed mb-4 text-[15px]" {...props} />,
    ul: ({ ...props }) => <ul className="list-none space-y-2 mb-6" {...props} />,
    li: ({ ...props }) => (
      <li className="flex items-start gap-3 text-foreground/70 text-[14px]">
        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 shadow-[0_0_8px_rgba(19,146,80,0.5)]" />
        <span {...props} />
      </li>
    ),
    strong: ({ ...props }) => <strong className="text-foreground font-bold border-b border-primary/30" {...props} />,
    blockquote: ({ ...props }) => (
      <blockquote className="border-l-4 border-muted bg-muted/20 px-6 py-4 rounded-r-xl italic my-6 text-foreground/60" {...props} />
    ),
    code: ({ ...props }) => <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono text-xs" {...props} />,
    table: ({ ...props }) => (
      <div className="my-8 overflow-x-auto rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm shadow-xl">
        <table className="w-full border-collapse text-left" {...props} />
      </div>
    ),
    thead: ({ ...props }) => <thead className="bg-primary/5 uppercase tracking-wider font-mono text-[10px] text-primary" {...props} />,
    th: ({ ...props }) => <th className="px-6 py-4 font-bold border-b border-white/10" {...props} />,
    td: ({ ...props }) => <td className="px-6 py-4 text-foreground/70 border-b border-white/5 text-[13px]" {...props} />,
    tr: ({ ...props }) => <tr className="hover:bg-white/5 transition-colors duration-200" {...props} />,
  }

  // Sync Heartbeat
  useEffect(() => {
    if (isEditable || !isPlaying) return

    const interval = setInterval(async () => {
      if (!videoRef.current) return

      const currentPos = Math.floor(videoRef.current.currentTime)
      const now = Date.now()
      const watchTimeSeconds = Math.round((now - lastSyncTimeRef.current) / 1000)

      if (watchTimeSeconds >= 5) { // Sync every 5+ seconds of actual watch time
        try {
          await syncLessonProgress(currentLesson.id, currentPos, watchTimeSeconds)
          lastSyncTimeRef.current = now
          lastPositionRef.current = currentPos
        } catch (error) {
          console.error("Failed to sync progress:", error)
        }
      }
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [isPlaying, isEditable, currentLesson.id])

  // Controls Visibility Logic
  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeout) clearTimeout(controlsTimeout)
    const timeout = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
    setControlsTimeout(timeout)
  }

  // Initial Position Sync - Only run once on mount or when video element is ready
  useEffect(() => {
    if (videoRef.current && !isInitialized && currentLesson.videoUrl) {
      const trimStart = currentLesson.metadata?.trimStart || 0
      const actualInitialPos = initialPosition > trimStart ? initialPosition : trimStart
      videoRef.current.currentTime = actualInitialPos
      setIsInitialized(true)
    }
  }, [initialPosition, currentLesson.metadata?.trimStart, currentLesson.videoUrl, isInitialized])

  // Handle Trim End
  useEffect(() => {
    const video = videoRef.current
    if (!video || !currentLesson.metadata?.trimEnd || currentLesson.metadata.trimEnd <= 0) return

    const handleTimeUpdate = () => {
      // Small buffer to avoid getting stuck at exactly trimEnd
      if (video.currentTime >= currentLesson.metadata.trimEnd - 0.1) {
        video.pause()
        setIsPlaying(false)
        video.currentTime = currentLesson.metadata.trimEnd
      }
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    return () => video.removeEventListener("timeupdate", handleTimeUpdate)
  }, [currentLesson.metadata?.trimEnd])

  // Fullscreen Listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const togglePlay = async () => {
    if (videoRef.current) {
      try {
        if (videoRef.current.paused) {
          const playPromise = videoRef.current.play()
          if (playPromise !== undefined) {
            await playPromise
          }
        } else {
          videoRef.current.pause()
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Playback interrupted by a pause() call")
        } else {
          console.error("Playback error:", error)
        }
      }
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        toast.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  const handleComplete = async () => {
    try {
      await completeLesson(currentLesson.id)
      setCompleted(true)
      toast.success("Aula concluída! +25 XP")
    } catch (error) {
      toast.error("Erro ao marcar como concluída.")
    }
  }

  const speeds = [0.75, 1, 1.25, 1.5, 2]

  const handleSave = async (data: any) => {
    if (!onLessonUpdate) return
    setIsSaving(true)
    try {
      await onLessonUpdate(data)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateVocab = (index: number, field: string, value: string) => {
    const newVocab = [...editableVocab]
    newVocab[index] = { ...newVocab[index], [field]: value }
    setEditableVocab(newVocab)
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      const targetDuration = currentLesson.metadata?.trimEnd || duration || videoRef.current.duration || 1
      videoRef.current.currentTime = (value[0] / 100) * targetDuration
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVol = value[0] / 100
    setVolume(newVol)
    if (videoRef.current) {
      videoRef.current.volume = newVol
    }
    if (newVol > 0) setIsMuted(false)
  }

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed)
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
    }
  }

  const toggleTheaterMode = () => {
    setIsTheaterMode(!isTheaterMode)
    toast.info(isTheaterMode ? "Modo normal ativado" : "Modo Cinema ativado", {
      position: "bottom-center"
    })
  }

  const formatTimeSeconds = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const addVocabItem = () => {
    setEditableVocab([...editableVocab, { word: "", definition: "", example: "" }])
  }

  const removeVocabItem = (index: number) => {
    setEditableVocab(editableVocab.filter((_: any, i: number) => i !== index))
  }

  if (isLoading) {
    return <SplashScreen onComplete={() => setIsLoading(false)} minDuration={1500} />
  }

  return (
    <div className="max-w-screen-2xl mx-auto p-4 sm:p-4 lg:p-8">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground mb-4 px-4 sm:px-0">
        {isEditable ? (
          <span className="text-muted-foreground">Edição de Aula</span>
        ) : (
          <Link href="/courses" className="hover:text-foreground transition-colors">
            Courses
          </Link>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span>{currentLesson.level}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span>{currentLesson.module}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium">
          {currentLesson.title}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* Main Content (Player & Info) */}
        <div className="flex-1 min-w-0 space-y-6 max-w-3xl lg:max-w-none mx-auto w-full lg:w-auto">
          {/* Video Player or Upload */}
          <Card className="overflow-hidden">
            {isEditable ? (
              <div className="p-1">
                <VideoUpload
                  initialUrl={currentLesson.videoUrl}
                  onUploadComplete={(url, duration, metadata) => handleSave({ videoUrl: url, duration, metadata })}
                />
              </div>
            ) : (
              <div
                ref={containerRef}
                className={cn(
                  "relative bg-neutral-950 aspect-video flex items-center justify-center transition-all duration-500 overflow-hidden group",
                  isTheaterMode && !isFullscreen ? "fixed inset-0 z-[100] bg-black/95" : "",
                  isFullscreen ? "w-full h-full" : ""
                )}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => isPlaying && setShowControls(false)}
              >
                {!currentLesson.videoUrl && !isEditable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 text-white/50 flex-col gap-2">
                    <VolumeX className="w-12 h-12 opacity-20" />
                    <p className="text-sm font-mono tracking-widest uppercase">Video Source Pending</p>
                  </div>
                )}
                {/* Video base layer */}
                <video
                  key={currentLesson.id + (currentLesson.videoUrl || "empty")}
                  ref={videoRef}
                  src={currentLesson.videoUrl || undefined}
                  className="w-full h-full object-contain"
                  preload="metadata"
                  style={{
                    filter: currentLesson.metadata ? `brightness(${currentLesson.metadata.brightness}%) contrast(${currentLesson.metadata.contrast}%) saturate(${currentLesson.metadata.saturation}%) ${currentLesson.metadata.preset === 'futuristic' ? 'hue-rotate(180deg) saturate(1.5)' : ''}` : undefined
                  }}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onDurationChange={(e) => setDuration(e.currentTarget.duration)}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onClick={togglePlay}
                  onContextMenu={(e) => e.preventDefault()}
                  controlsList="nodownload"
                />

                {/* HUD Overlay - Top Left */}
                <div className={cn(
                  "absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-col gap-1 transition-all duration-500",
                  showControls ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
                )}>
                  <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse" />
                    <span className="font-mono text-[8px] sm:text-[10px] text-primary uppercase tracking-[0.2em]">Live Session</span>
                  </div>
                  <h3 className="text-white font-display font-bold text-sm sm:text-lg drop-shadow-lg truncate max-w-[150px] sm:max-w-none">{currentLesson.title}</h3>
                </div>

                {/* HUD Overlay - Top Right */}
                <div className={cn(
                  "absolute top-6 right-6 transition-all duration-500 hidden sm:block",
                  showControls ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
                )}>
                   <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-3 py-2 rounded-xl flex items-center gap-4 text-white/80 font-mono text-xs">
                     <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{formatTimeSeconds(currentTime)}</span>
                     <span className="opacity-40">|</span>
                     <span>XP +25</span>
                   </div>
                </div>

                {/* Center Play/Pause Ripple */}
                {!isPlaying && (
                   <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    className="absolute inset-0 z-40 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors pointer-events-auto"
                   >
                     <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-[0_0_50px_rgba(19,146,80,0.5)] scale-110 animate-in zoom-in-50 duration-200">
                        <Play className="w-6 h-6 sm:w-10 sm:h-10 ml-1 sm:ml-1.5 fill-current" />
                     </div>
                   </button>
                )}

                {/* Subtitles (Simulation) */}
                {showSubtitles && isPlaying && (
                  <div className="absolute bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-white text-sm max-w-md text-center animate-in slide-in-from-bottom-2 duration-300">
                    {"Nossas IAs estão processando a fala em tempo real..."}
                  </div>
                )}

                {/* Custom Control Bar */}
                <div className={cn(
                  "absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-20 pb-4 sm:pb-6 px-3 sm:px-6 transition-all duration-500 ease-out flex flex-col gap-2 sm:gap-4",
                  showControls ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                )}>
                  {/* Progress Area */}
                  <div className="group/progress relative h-2 sm:h-1 flex items-center mb-1 sm:mb-2 px-2 sm:px-0">
                    <Slider
                      value={[((currentTime || 0) / (currentLesson.metadata?.trimEnd || duration || videoRef.current?.duration || 1)) * 100]}
                      max={100}
                      step={0.1}
                      onValueChange={handleSeek}
                      className="cursor-pointer"
                    />
                    {/* Progress Glow Emitter */}
                    <div className="absolute inset-y-0 left-0 bg-primary/40 blur-md pointer-events-none" style={{ width: `${((currentTime || 0) / (duration || 1)) * 100}%` }} />
                  </div>

                  {/* Main Buttons */}
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 sm:gap-4">
                       <button onClick={togglePlay} className="text-white hover:text-primary transition-colors transform active:scale-90 p-1">
                         {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />}
                       </button>

                       <button onClick={toggleMute} className="flex sm:hidden text-white hover:text-primary transition-colors p-1">
                          {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                       </button>

                       <div className="hidden sm:flex items-center gap-2 group/volume relative">
                          <button onClick={toggleMute} className="text-white hover:text-primary transition-colors">
                            {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                          </button>
                          <div className="w-0 group-hover/volume:w-20 transition-all duration-300 overflow-hidden flex items-center pr-2">
                             <Slider
                              value={[isMuted ? 0 : volume * 100]}
                              max={100}
                              onValueChange={handleVolumeChange}
                              className="w-20 cursor-pointer"
                             />
                          </div>
                       </div>

                       <div className="text-white/80 font-mono text-[10px] sm:text-xs flex items-center gap-1 sm:gap-2">
                          <span className="text-primary font-bold">{formatTimeSeconds(currentTime)}</span>
                          <span className="opacity-30">/</span>
                          <span className="hidden xs:inline">{formatTimeSeconds(duration)}</span>
                          <span className="xs:hidden opacity-50">{formatTimeSeconds(duration).split(':')[0]}m</span>
                       </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                       {/* Speed Selector */}
                       <DropdownMenu modal={false}>
                         <DropdownMenuTrigger asChild>
                           <button className="text-white/80 hover:text-white flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase py-1 px-2.5 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                             <Settings className="w-3.5 h-3.5 shrink-0" />
                             {playbackRate}x
                           </button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent className="bg-black/90 backdrop-blur-xl border-white/10 text-white min-w-[80px]">
                           {[0.75, 1, 1.25, 1.5, 2].map((speed) => (
                             <DropdownMenuItem
                              key={speed}
                              onClick={() => handleSpeedChange(speed)}
                              className={cn(
                                "flex justify-center items-center text-xs font-mono py-2 focus:bg-primary focus:text-primary-foreground",
                                playbackRate === speed && "text-primary font-bold"
                              )}
                             >
                               {speed}x
                             </DropdownMenuItem>
                           ))}
                         </DropdownMenuContent>
                       </DropdownMenu>

                       <button
                        onClick={toggleTheaterMode}
                        className={cn(
                          "hidden md:flex text-white/80 hover:text-white p-1.5 transition-colors rounded-lg",
                          isTheaterMode && "text-primary bg-primary/10"
                        )}
                       >
                         {isTheaterMode ? <Minimize className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                       </button>

                        <button
                         onClick={toggleFullscreen}
                         className="text-white/80 hover:text-white p-1 transition-colors transform active:scale-95"
                        >
                          {isFullscreen ? <Minimize className="w-5 h-5 text-primary" /> : <Maximize className="w-5 h-5" />}
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Lesson Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-display text-foreground leading-tight">
                {currentLesson.title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2">
                <span className="truncate">{currentLesson.module}</span>
                <span className="opacity-30">&middot;</span>
                <span>Level {currentLesson.level}</span>
                <span className="opacity-30">&middot;</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {currentLesson.duration}
                </span>
              </p>
            </div>
            {!isEditable && (
              <Button size="sm" className="gap-1.5 w-fit mt-2 sm:mt-0 h-9 px-4 text-xs sm:text-sm font-medium" variant="default" asChild>
                <Link href="/student/dashboard">
                  <SkipForward className="w-3.5 h-3.5" />
                  Próxima Aula
                </Link>
              </Button>
            )}
          </div>

          {/* Lesson Notes/Content */}
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between w-full">
                <CardTitle className="text-base font-semibold font-display flex items-center gap-2 text-foreground">
                  <FileText className="w-4 h-4 text-primary" />
                  Notas da Aula
                </CardTitle>
                {isEditable ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSave({ content: editableContent })}
                    disabled={isSaving}
                  >
                    {isSaving ? "Salvando..." : "Salvar Notas"}
                  </Button>
                ) : (
                  <button onClick={() => setNotesExpanded(!notesExpanded)}>
                    {notesExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {isEditable ? (
                <Textarea
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                  placeholder="Conteúdo da aula em Markdown..."
                  rows={10}
                  className="font-mono text-sm"
                />
              ) : (
                notesExpanded && (
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown
                      components={markdownComponents as any}
                      remarkPlugins={[remarkGfm]}
                    >
                      {editableContent}
                    </ReactMarkdown>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 w-full lg:w-80 shrink-0">
          {/* Vocabulary */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-semibold font-display flex items-center gap-2 text-foreground">
                <BookOpen className="w-4 h-4 text-primary" />
                Vocabulário
              </CardTitle>
              {isEditable && (
                <div className="flex gap-2">
                   <Button size="icon" variant="ghost" className="h-7 w-7" onClick={addVocabItem}>
                     <Plus className="w-4 h-4" />
                   </Button>
                   <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-[10px]"
                    onClick={() => handleSave({ vocabulary: editableVocab })}
                    disabled={isSaving}
                   >
                     {isSaving ? "..." : "Salvar"}
                   </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {isEditable ? (
                <div className="space-y-4">
                  {editableVocab.map((v: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg space-y-2 relative group">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-1 right-1 h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeVocabItem(index)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                      <Input
                        placeholder="Palavra"
                        value={v.word}
                        onChange={(e) => handleUpdateVocab(index, "word", e.target.value)}
                        className="h-7 text-xs"
                      />
                      <Textarea
                        placeholder="Definição"
                        value={v.definition}
                        onChange={(e) => handleUpdateVocab(index, "definition", e.target.value)}
                        className="h-12 text-[10px] resize-none"
                      />
                      <Input
                        placeholder="Exemplo"
                        value={v.example}
                        onChange={(e) => handleUpdateVocab(index, "example", e.target.value)}
                        className="h-7 text-[10px] italic"
                      />
                    </div>
                  ))}
                  {editableVocab.length === 0 && (
                    <p className="text-center text-xs text-muted-foreground py-4 italic">Nenhum termo</p>
                  )}
                </div>
              ) : (
                <Tabs defaultValue={editableVocab.length > 0 ? (editableVocab[0].word || "vocab-0") : undefined}>
                  <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted p-1">
                    {editableVocab.map((v: any) => (
                      <TabsTrigger key={v.word} value={v.word} className="text-xs px-2 py-1.5">
                        {v.word}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {editableVocab.map((v: any) => (
                    <TabsContent key={v.word} value={v.word} className="mt-3">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">{v.word}</h4>
                        <p className="text-sm text-muted-foreground">{v.definition}</p>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-sm italic text-foreground">{`"${v.example}"`}</p>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </CardContent>
          </Card>

          {/* Up Next (Hidden in Edit) */}
          {!isEditable && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold font-display text-foreground">A Seguir</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {relatedLessons.map((lesson) => (
                  <Link key={lesson.id} href={`/student/lesson/${lesson.id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={cn("flex items-center justify-center w-8 h-8 rounded-lg shrink-0", lesson.completed ? "bg-success/10 text-success" : "bg-primary/10 text-primary")}>
                      {lesson.completed ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Completion Banner (Hidden in Edit) */}
          {!isEditable && (
            <Card className="border-primary/20 bg-primary/[0.03]">
              <CardContent className="p-5 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  {completed ? "Aula Concluída" : "Marcar como Concluída"}
                </p>
                <p className="text-xs text-muted-foreground mb-3">Ganhe 25 XP ao finalizar esta aula</p>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={handleComplete}
                  disabled={completed}
                  variant={completed ? "secondary" : "default"}
                >
                  {completed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Concluída
                    </>
                  ) : "Concluir Aula"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
