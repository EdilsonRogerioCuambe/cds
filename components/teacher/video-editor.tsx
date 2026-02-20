"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
    Check,
    Clapperboard,
    Clock,
    Contrast,
    Maximize,
    Minimize,
    Pause,
    Play,
    RotateCcw,
    Scissors,
    Settings2,
    Sparkles,
    Sun,
    Volume2
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface VideoEditorProps {
  url: string
  onSave: (metadata: VideoMetadata) => void
  onCancel: () => void
}

export interface VideoMetadata {
  trimStart: number
  trimEnd: number
  brightness: number
  contrast: number
  saturation: number
  preset: string
}

export function VideoEditor({ url, onSave, onCancel }: VideoEditorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  // Metadata States
  const [trim, setTrim] = useState<[number, number]>([0, 100]) // Percentage based
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
  })
  const [activePreset, setActivePreset] = useState("none")

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setTrim([0, 100])
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("timeupdate", handleTimeUpdate)

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("timeupdate", handleTimeUpdate)
    }
  }, [])

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
      } catch (error) {
        console.error("Playback error:", error)
      }
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  const handleTrimChange = (values: number[]) => {
    setTrim([values[0], values[1]])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const presets = [
    { id: "none", name: "Original", class: "" },
    { id: "futuristic", name: "Cyberpunk", filter: "hue-rotate(180deg) saturate(1.5)" },
    { id: "studio", name: "Pro Studio", filter: "contrast(1.2) brightness(1.1)" },
    { id: "warm", name: "Warm Glow", filter: "sepia(0.3) saturate(1.2)" },
    { id: "noir", name: "Dramatic Noir", filter: "grayscale(1) contrast(1.5)" },
  ]

  const appliedFilterStyle = {
    filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) ${presets.find(p => p.id === activePreset)?.filter || ""}`
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-4 lg:p-8 animate-in fade-in zoom-in duration-300">
      <div className="bg-card border-2 border-primary/20 rounded-3xl w-full max-w-6xl h-full max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_80px_rgba(19,146,80,0.15)]">

        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/20 rounded-xl">
              <Clapperboard className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display tracking-tight uppercase">Media Production Studio</h2>
              <p className="text-xs text-muted-foreground font-mono">ENHANCING DIGITAL CONTENT &middot; v1.0</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onCancel} className="hover:bg-destructive/10 hover:text-destructive">
              Descartar
            </Button>
            <Button
              onClick={() => onSave({
                trimStart: (trim[0] / 100) * duration,
                trimEnd: (trim[1] / 100) * duration,
                ...filters,
                preset: activePreset
              })}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(19,146,80,0.4)]"
            >
              <Check className="w-4 h-4 mr-2" />
              Finalizar Produção
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Main Production Area */}
          <div className="flex-1 bg-black/40 p-6 flex flex-col items-center justify-center gap-6 overflow-hidden">
            <div
              ref={containerRef}
              className={cn(
                "relative w-full aspect-video max-h-[60vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group bg-neutral-900 transition-all duration-500",
                isFullscreen ? "max-h-screen rounded-none border-none" : ""
              )}
            >
              <video
                ref={videoRef}
                src={url}
                className="w-full h-full object-contain transition-all duration-300"
                style={appliedFilterStyle}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onContextMenu={(e) => e.preventDefault()}
                controlsList="nodownload"
              />

              {/* Overlay HUD */}
              <div className="absolute top-4 left-4 pointer-events-none">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg font-mono text-[10px] text-primary flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  LIVE PREVIEW &middot; {formatTime(currentTime)}
                </div>
              </div>

              {/* Controls */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="relative z-50 w-20 h-20 rounded-full bg-primary text-primary-foreground shadow-[0_0_30px_rgba(19,146,80,0.5)] flex items-center justify-center translate-y-2 group-hover:translate-y-0 transition-transform duration-300 pointer-events-auto"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </button>
              </div>
            </div>

            {/* Futuristic Timeline */}
            <div className="w-full space-y-4 max-w-4xl">
              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-1">
                <div className="flex items-center gap-2">
                  <Scissors className="w-3 h-3 text-primary" />
                  Sequence Trimming
                </div>
                <div>{formatTime((trim[0]/100)*duration)} - {formatTime((trim[1]/100)*duration)}</div>
              </div>

              <div className="relative py-2 pb-6 group">
                {/* Timeline base */}
                <div className="absolute inset-0 top-1/2 -translate-y-1/2 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="absolute inset-y-0 bg-primary/20 blur-sm" style={{ left: `${trim[0]}%`, width: `${trim[1] - trim[0]}%` }} />
                </div>

                <Slider
                  min={0}
                  max={100}
                  step={0.1}
                  value={[trim[0], trim[1]]}
                  onValueChange={handleTrimChange}
                  className="relative cursor-pointer"
                />

                {/* Visual Indicators */}
                <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none flex w-full justify-between items-center px-0.5">
                   <div className="h-6 w-0.5 bg-primary/30 blur-[1px]" />
                   <div className="h-4 w-0.5 bg-muted-foreground/20" />
                   <div className="h-4 w-0.5 bg-muted-foreground/20" />
                   <div className="h-4 w-0.5 bg-muted-foreground/20" />
                   <div className="h-6 w-0.5 bg-primary/30 blur-[1px]" />
                </div>
              </div>

              <div className="flex items-center justify-center gap-6">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors">
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-muted/40 rounded-full border border-white/5 font-mono text-xs">
                  <Clock className="w-3 h-3 text-primary" />
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("text-muted-foreground hover:text-primary transition-colors", isFullscreen && "text-primary")}
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Control Sidebar */}
          <div className="w-full lg:w-80 border-l bg-muted/10 p-6 space-y-8 overflow-y-auto custom-scrollbar">
            <Tabs defaultValue="visuals">
              <TabsList className="w-full bg-black/20 border border-white/5 rounded-xl p-1 h-12">
                <TabsTrigger value="visuals" className="flex-1 rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Settings2 className="w-3.5 h-3.5" />
                  Visuals
                </TabsTrigger>
                <TabsTrigger value="presets" className="flex-1 rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Sparkles className="w-3.5 h-3.5" />
                  Styles
                </TabsTrigger>
              </TabsList>

              <TabsContent value="visuals" className="space-y-8 pt-6">
                {/* Sliders Area */}
                <div className="space-y-6">
                  <ControlItem
                    icon={<Sun className="w-4 h-4" />}
                    label="Brightness"
                    value={filters.brightness}
                    onChange={(v) => setFilters(f => ({ ...f, brightness: v }))}
                  />
                  <ControlItem
                    icon={<Contrast className="w-4 h-4" />}
                    label="Contrast"
                    value={filters.contrast}
                    onChange={(v) => setFilters(f => ({ ...f, contrast: v }))}
                  />
                  <ControlItem
                    icon={<Volume2 className="w-4 h-4" />}
                    label="Saturation"
                    value={filters.saturation}
                    onChange={(v) => setFilters(f => ({ ...f, saturation: v }))}
                  />
                </div>

                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Optimization
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Nossa IA detectou que este vídeo pode se beneficiar de um leve aumento no contraste para melhorar a legibilidade em dispositivos móveis.
                  </p>
                  <Button size="sm" variant="outline" className="w-full text-[10px] h-7 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20">
                    Aplicar Recomendação
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="presets" className="pt-6">
                <div className="grid grid-cols-2 gap-3">
                  {presets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setActivePreset(preset.id)}
                      className={cn(
                        "group relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all p-1",
                        activePreset === preset.id ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(19,146,80,0.3)]" : "border-white/10 hover:border-white/30"
                      )}
                    >
                      <div className="absolute inset-0 bg-neutral-800" />
                      <div className="relative h-full w-full rounded-lg bg-neutral-900 flex items-center justify-center overflow-hidden">
                        <Play className="w-4 h-4 text-white/20 group-hover:text-primary/50 transition-colors" />
                        <div
                          className="absolute inset-0 opacity-40"
                          style={{ filter: preset.filter }}
                        />
                      </div>
                      <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white drop-shadow-md">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

function ControlItem({ icon, label, value, onChange }: {
  icon: React.ReactNode,
  label: string,
  value: number,
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {icon}
          {label}
        </div>
        <span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">
          {value}%
        </span>
      </div>
      <Slider
        min={0}
        max={200}
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        className="cursor-pointer"
      />
    </div>
  )
}
