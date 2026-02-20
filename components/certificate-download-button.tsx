"use client"

import { Button } from "@/components/ui/button"
import {
    getCourseCompletionStatus,
    getModuleCompletionStatus,
    issueCourseCertificate,
    issueModuleCertificate
} from "@/lib/actions/student"
import { useSession } from "@/lib/auth-client"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { Award, Download, Loader2 } from "lucide-react"
import QRCode from "qrcode"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { CertificateTemplate } from "./certificate-template"

interface CertificateDownloadButtonProps {
  type: "MODULE" | "COURSE"
  id: string // moduleId or courseId
  title: string // module title or course title
  courseTitle?: string // required for module type
}

export function CertificateDownloadButton({
  type,
  id,
  title,
  courseTitle
}: CertificateDownloadButtonProps) {
  const { data: session } = useSession()
  const [status, setStatus] = useState<{
    isComplete: boolean
    hasCertificate: boolean
    certificateCode?: string
    description?: string | null
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [qrUrl, setQrUrl] = useState<string>("")

  const fetchStatus = async () => {
    try {
      const res = type === "MODULE"
        ? await getModuleCompletionStatus(id)
        : await getCourseCompletionStatus(id)

      setStatus({
        isComplete: res.isComplete,
        hasCertificate: res.hasCertificate || false,
        certificateCode: res.certificateCode,
        description: res.description
      })
      if (res.certificateCode) {
        generateQR(res.certificateCode)
      }
    } catch (error) {
      console.error("Error fetching status:", error)
    }
  }

  const generateQR = async (code: string) => {
    try {
      const url = await QRCode.toDataURL(`https://cds.school/verify/${code}`)
      setQrUrl(url)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [id, type])

  const handleGenerate = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setLoading(true)
    try {
      if (type === "MODULE") {
        await issueModuleCertificate(id)
      } else {
        await issueCourseCertificate(id)
      }
      toast.success("Certificado gerado com sucesso!")
      await fetchStatus()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!status || !status.isComplete) return null

  const buttonLabel = type === "MODULE" ? "Certificado do Módulo" : "Certificado Final do Curso"

  if (!status.hasCertificate) {
    return (
      <Button
        onClick={handleGenerate}
        disabled={loading}
        size={type === "COURSE" ? "default" : "sm"}
        className={`${type === "COURSE" ? "w-full py-6 text-lg" : "scale-90 sm:scale-100"} bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 gap-2 font-bold`}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
        {loading ? "Gerando..." : `Gerar ${buttonLabel}`}
      </Button>
    )
  }

  return (
    <PDFDownloadLink
      document={
        <CertificateTemplate
          studentName={session?.user.name || "Aluno"}
          title={title}
          courseTitle={courseTitle}
          description={status.description || undefined}
          issueDate={new Date().toLocaleDateString('pt-BR')}
          verificationCode={status.certificateCode || ""}
          qrDataUrl={qrUrl}
          type={type}
        />
      }
      fileName={`Certificado-${title.replace(/\s+/g, '-')}.pdf`}
    >
      {({ loading: pdfLoading }) => (
        <Button
          variant="outline"
          size={type === "COURSE" ? "default" : "sm"}
          className={`${type === "COURSE" ? "w-full py-6 text-lg" : "scale-90 sm:scale-100"} gap-2 border-primary/50 text-primary hover:bg-primary/5 font-bold shadow-sm`}
          disabled={pdfLoading}
          onClick={(e) => e.stopPropagation()}
        >
          {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {pdfLoading ? "Preparando..." : `Baixar ${buttonLabel}`}
        </Button>
      )}
    </PDFDownloadLink>
  )
}
