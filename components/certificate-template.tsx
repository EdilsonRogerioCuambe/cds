"use client"

import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer"

// Branding Colors
const COLORS = {
  NAVY: "#132747",
  TURQUOISE: "#10D79E",
  WHITE: "#ffffff",
  GRAY: "#6b7280",
  LIGHT_GRAY: "#f3f4f6",
  PRIMARY: "#15b376", // Keeping the primary green for some accents if needed
}

const styles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: COLORS.WHITE,
    fontFamily: "Helvetica",
  },
  container: {
    margin: 30,
    padding: 40,
    borderWidth: 8,
    borderColor: COLORS.NAVY,
    borderStyle: "solid",
    height: "calc(100% - 60px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  innerBorder: {
    position: "absolute",
    top: 5,
    bottom: 5,
    left: 5,
    right: 5,
    borderWidth: 1,
    borderColor: COLORS.TURQUOISE,
    borderStyle: "solid",
  },
  logoSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },
  logoMain: {
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: -1,
  },
  logoSub: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 4,
    color: COLORS.NAVY,
    marginTop: 2,
  },
  header: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: COLORS.NAVY,
    marginBottom: 5,
    letterSpacing: 4,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.TURQUOISE,
    marginBottom: 30,
    fontWeight: "bold",
  },
  certifyText: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginBottom: 10,
  },
  studentName: {
    fontSize: 38,
    fontWeight: "bold",
    color: COLORS.NAVY,
    marginBottom: 15,
  },
  moduleInfo: {
    fontSize: 14,
    color: COLORS.NAVY,
    textAlign: "center",
    lineHeight: 1.6,
    maxWidth: 550,
    marginBottom: 20,
  },
  learningsBox: {
    backgroundColor: COLORS.LIGHT_GRAY,
    padding: 15,
    borderRadius: 8,
    width: "80%",
    marginBottom: 20,
  },
  learningsTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.TURQUOISE,
    textTransform: "uppercase",
    marginBottom: 5,
    textAlign: "center",
  },
  learningsText: {
    fontSize: 11,
    color: COLORS.NAVY,
    lineHeight: 1.4,
    textAlign: "center",
  },
  footer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 40,
    marginBottom: 10,
  },
  signatureBox: {
    width: 200,
    borderTopWidth: 1,
    borderTopColor: COLORS.NAVY,
    paddingTop: 8,
    textAlign: "center",
  },
  signatureName: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.NAVY,
  },
  signatureTitle: {
    fontSize: 10,
    color: COLORS.GRAY,
  },
  verificationBox: {
    width: 200,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  verificationCode: {
    fontSize: 9,
    color: COLORS.GRAY,
    marginTop: 5,
  },
  qrCode: {
    width: 55,
    height: 55,
  },
  date: {
    fontSize: 11,
    color: COLORS.GRAY,
    marginBottom: 5,
  },
  watermark: {
    position: "absolute",
    fontSize: 140,
    color: COLORS.TURQUOISE,
    opacity: 0.05,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-45deg)",
    zIndex: -1,
  }
})

interface CertificateProps {
  studentName: string
  title: string      // Module or Course title
  courseTitle?: string // Parent course title if it's a module certificate
  description?: string // Module/Course learnings
  issueDate: string
  verificationCode: string
  qrDataUrl?: string
  type: "MODULE" | "COURSE"
}

export function CertificateTemplate({
  studentName,
  title,
  courseTitle,
  description,
  issueDate,
  verificationCode,
  qrDataUrl,
  type
}: CertificateProps) {
  const isModule = type === "MODULE"

  return (
    <Document title={`Certificado - ${title}`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.innerBorder} />

          <Text style={styles.watermark}>CDS</Text>

          {/* Logo Section */}
          <View style={styles.logoSection}>
             <Text style={styles.logoMain}>
                <Text style={{ color: COLORS.NAVY }}>C</Text>
                <Text style={{ color: COLORS.TURQUOISE }}>o</Text>
                <Text style={{ color: COLORS.NAVY }}>nnect</Text>
             </Text>
             <Text style={styles.logoSub}>Digital School</Text>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Certificado</Text>
            <Text style={styles.subtitle}>
              {isModule ? "Conclusão de Módulo" : "Conclusão de Curso"}
            </Text>
          </View>

          <View style={{ alignItems: "center", width: "100%" }}>
            <Text style={styles.certifyText}>Certificamos que</Text>
            <Text style={styles.studentName}>{studentName}</Text>

            <Text style={styles.moduleInfo}>
              {isModule ? (
                `concluiu com êxito o módulo "${title}" do curso "${courseTitle}" na Connect Digital School.`
              ) : (
                `concluiu com êxito e excelência o curso completo de "${title}" na Connect Digital School.`
              )}
            </Text>

            {description && (
              <View style={styles.learningsBox}>
                <Text style={styles.learningsTitle}>O que foi aprendido</Text>
                <Text style={styles.learningsText}>{description}</Text>
              </View>
            )}

            <Text style={styles.date}>Emitido em: {issueDate}</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.verificationBox}>
              {qrDataUrl && <Image src={qrDataUrl} style={styles.qrCode} />}
              <Text style={styles.verificationCode}>{verificationCode}</Text>
              <Text style={[styles.verificationCode, { fontSize: 7, marginTop: 2 }]}>
                Verifique em: cds.school/verify/{verificationCode}
              </Text>
            </View>

            <View style={styles.signatureBox}>
              <Text style={styles.signatureName}>Connect Digital School</Text>
              <Text style={styles.signatureTitle}>Coordenação Acadêmica</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
