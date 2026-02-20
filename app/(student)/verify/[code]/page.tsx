import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import { BookOpen, Calendar, CheckCircle2, GraduationCap, XCircle } from "lucide-react"
import Link from "next/link"

export default async function VerifyPage({ params }: { params: { code: string } }) {
  const { code } = params

  const certificate = await prisma.certificate.findUnique({
    where: { verificationCode: code },
    include: {
      user: { select: { name: true, image: true } },
      module: { select: { title: true, description: true } },
      course: { select: { title: true, level: true, description: true } }
    }
  })

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <Card className="max-w-md w-full border-destructive/20 shadow-2xl">
          <CardHeader className="text-center">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-2" />
            <CardTitle className="text-destructive text-2xl font-display">Certificado Inválido</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              O código de verificação <strong className="font-mono">{code}</strong> não corresponde a nenhum certificado emitido oficialmente pela nossa plataforma.
            </p>
            <Link href="/" className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all">
              Voltar para o Início
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isModule = certificate.type === "MODULE"
  const title = isModule ? certificate.module?.title : certificate.course.title
  const description = isModule ? certificate.module?.description : certificate.course.description

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#132747]/5 via-background to-[#10D79E]/5 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Verification Status Banner */}
        <div className="bg-success/5 border border-success/20 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 text-center md:text-left shadow-sm">
          <div className="bg-success/20 p-3 rounded-full">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-success">Certificado Autêntico</h1>
            <p className="text-success/80 text-sm">Este documento foi emitido e verificado oficialmente pela Connect Digital School.</p>
          </div>
        </div>

        {/* Certificate Details Card */}
        <Card className="border-border/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden relative bg-white">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <GraduationCap className="w-64 h-64 text-[#132747]" />
          </div>

          <CardHeader className="border-b border-border/50 bg-[#132747]/5 pt-12 pb-8 text-center bg-[radial-gradient(circle_at_top,_rgba(16,215,158,0.05),_transparent)]">
            <div className="flex justify-center mb-6">
               <div className="flex flex-col items-center">
                  <span className="font-display text-2xl font-black tracking-tight text-[#132747]">
                    C<span className="text-[#10D79E]">o</span>nnect
                  </span>
                  <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-[#132747]/60 mt-0.5">
                    Digital School
                  </span>
               </div>
            </div>

            <div className="space-y-2">
              <Badge variant="outline" className="uppercase tracking-widest text-[10px] font-extrabold text-[#10D79E] border-[#10D79E]/30 bg-[#10D79E]/5">
                {isModule ? "Conclusão de Módulo" : "Conclusão de Curso"}
              </Badge>
              <CardTitle className="text-3xl font-display text-[#132747] leading-tight px-4">{title}</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-10 p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8">
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Estudante Certificado</p>
                <p className="text-xl font-bold text-[#132747]">{certificate.user.name}</p>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Data de Emissão</p>
                <div className="flex items-center gap-2 text-[#132747]">
                  <Calendar className="w-4 h-4 text-[#10D79E]" />
                  <p className="text-lg font-semibold">
                    {certificate.issuedAt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Curso Relacionado</p>
                <div className="flex items-center gap-2 text-[#132747]">
                  <BookOpen className="w-4 h-4 text-[#10D79E]" />
                  <p className="text-lg font-semibold">{certificate.course.title}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">ID de Verificação</p>
                <p className="text-lg font-mono text-[#132747] font-black tracking-tighter bg-muted px-2 py-0.5 rounded inline-block">{certificate.verificationCode}</p>
              </div>
            </div>

            {description && (
              <div className="p-6 bg-[#132747]/[0.02] border border-[#132747]/5 rounded-xl space-y-3">
                <p className="text-[10px] uppercase text-[#10D79E] font-bold tracking-widest text-center">Competências Adquiridas</p>
                <p className="text-sm text-[#132747]/80 text-center leading-relaxed italic">
                  "{description}"
                </p>
              </div>
            )}

            <div className="pt-10 border-t border-dashed border-border flex flex-col items-center justify-center text-center space-y-6">
              <div className="flex flex-col items-center">
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  Emitido por Connect Digital School &reg;
                </p>
                <div className="h-0.5 w-12 bg-[#10D79E] rounded-full" />
              </div>
              <Link href="/" className="inline-flex items-center gap-2 px-8 py-3 bg-[#132747] text-white rounded-full font-bold hover:bg-[#132747]/90 transition-all text-sm shadow-lg shadow-[#132747]/20">
                Ver outros cursos
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer info */}
        <p className="text-center text-xs text-muted-foreground font-medium">
          A autenticidade deste documento pode ser validada permanentemente através deste link oficial.
        </p>
      </div>
    </div>
  )
}
