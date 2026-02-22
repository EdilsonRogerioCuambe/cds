
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer"

// Premium Branding Palette
const COLORS = {
  NAVY: "#0D1F3C",
  NAVY_LIGHT: "#1a3158",
  TURQUOISE: "#10D79E",
  TURQUOISE_DARK: "#0aad7e",
  GOLD: "#C9A84C",
  WHITE: "#FFFFFF",
  OFF_WHITE: "#F8F9FA",
  GRAY: "#8A9AB0",
  GRAY_LIGHT: "#EEF1F5",
  BLACK: "#060E1C",
}

const styles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: COLORS.NAVY,
    fontFamily: "Helvetica",
  },

  // Outer frame
  outerFrame: {
    margin: 20,
    padding: 2,
    backgroundColor: COLORS.NAVY,
    borderWidth: 1,
    borderColor: COLORS.TURQUOISE,
    borderStyle: "solid",
    height: "calc(100% - 40px)",
    position: "relative",
  },

  // Inner content
  innerContainer: {
    margin: 6,
    backgroundColor: COLORS.OFF_WHITE,
    height: "calc(100% - 12px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
  },

  // Decorative corner — top left
  cornerTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 80,
    height: 80,
    backgroundColor: COLORS.NAVY,
  },
  cornerTR: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 80,
    height: 80,
    backgroundColor: COLORS.NAVY,
  },
  cornerBL: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 80,
    height: 80,
    backgroundColor: COLORS.NAVY,
  },
  cornerBR: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 80,
    height: 80,
    backgroundColor: COLORS.NAVY,
  },

  // Corner accent lines
  cornerAccentTL: {
    position: "absolute",
    top: 18,
    left: 18,
    width: 50,
    height: 50,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: COLORS.TURQUOISE,
    borderLeftColor: COLORS.TURQUOISE,
    borderStyle: "solid",
  },
  cornerAccentTR: {
    position: "absolute",
    top: 18,
    right: 18,
    width: 50,
    height: 50,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopColor: COLORS.TURQUOISE,
    borderRightColor: COLORS.TURQUOISE,
    borderStyle: "solid",
  },
  cornerAccentBL: {
    position: "absolute",
    bottom: 18,
    left: 18,
    width: 50,
    height: 50,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomColor: COLORS.TURQUOISE,
    borderLeftColor: COLORS.TURQUOISE,
    borderStyle: "solid",
  },
  cornerAccentBR: {
    position: "absolute",
    bottom: 18,
    right: 18,
    width: 50,
    height: 50,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomColor: COLORS.TURQUOISE,
    borderRightColor: COLORS.TURQUOISE,
    borderStyle: "solid",
  },

  // Navy header band
  headerBand: {
    width: "100%",
    backgroundColor: COLORS.NAVY,
    paddingTop: 28,
    paddingBottom: 22,
    paddingHorizontal: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },

  logoWordmark: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    color: COLORS.WHITE,
  },

  logoAccent: {
    color: COLORS.TURQUOISE,
  },

  logoTagline: {
    fontSize: 7,
    color: COLORS.TURQUOISE,
    letterSpacing: 4,
    textTransform: "uppercase",
    marginTop: 3,
    fontFamily: "Helvetica",
  },

  headerDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.NAVY_LIGHT,
    marginHorizontal: 20,
  },

  certificateTypeLabel: {
    fontSize: 8,
    fontFamily: "Helvetica",
    color: COLORS.TURQUOISE,
    letterSpacing: 5,
    textTransform: "uppercase",
    textAlign: "right",
  },

  // Main content area
  mainContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 60,
    paddingTop: 10,
    paddingBottom: 5,
    flexGrow: 1,
    width: "100%",
  },

  // Decorative rule with diamond
  ornamentRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
    marginBottom: 16,
    marginTop: 16,
  },
  ornamentLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.TURQUOISE,
  },
  ornamentDiamond: {
    width: 6,
    height: 6,
    backgroundColor: COLORS.TURQUOISE,
    marginHorizontal: 8,
    transform: "rotate(45deg)",
  },

  bigTitle: {
    fontSize: 52,
    fontFamily: "Helvetica-Bold",
    color: COLORS.NAVY,
    letterSpacing: 10,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 2,
  },

  subtitle: {
    fontSize: 11,
    fontFamily: "Helvetica",
    color: COLORS.GRAY,
    letterSpacing: 6,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 4,
  },

  certifyText: {
    fontSize: 12,
    fontFamily: "Helvetica",
    color: COLORS.GRAY,
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 1,
  },

  studentName: {
    fontSize: 36,
    fontFamily: "Helvetica-BoldOblique",
    color: COLORS.NAVY,
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 1,
  },

  // Turquoise accent underline below name
  nameUnderline: {
    width: 180,
    height: 2,
    backgroundColor: COLORS.TURQUOISE,
    marginBottom: 12,
  },

  moduleInfo: {
    fontSize: 12,
    fontFamily: "Helvetica",
    color: COLORS.NAVY,
    textAlign: "center",
    lineHeight: 1.7,
    maxWidth: 520,
    marginBottom: 12,
  },

  moduleInfoBold: {
    fontFamily: "Helvetica-Bold",
    color: COLORS.NAVY,
  },

  // Learnings pill box
  learningsBox: {
    backgroundColor: COLORS.NAVY,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 4,
    width: "75%",
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.TURQUOISE,
    borderLeftStyle: "solid",
  },

  learningsTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: COLORS.TURQUOISE,
    textTransform: "uppercase",
    letterSpacing: 4,
    marginBottom: 4,
  },

  learningsText: {
    fontSize: 10,
    fontFamily: "Helvetica",
    color: COLORS.GRAY_LIGHT,
    lineHeight: 1.5,
    textAlign: "left",
  },

  // Footer band
  footerBand: {
    width: "100%",
    backgroundColor: COLORS.NAVY,
    paddingHorizontal: 50,
    paddingVertical: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  verificationBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  qrCode: {
    width: 48,
    height: 48,
    marginRight: 10,
  },

  verificationText: {
    display: "flex",
    flexDirection: "column",
  },

  verificationLabel: {
    fontSize: 7,
    color: COLORS.TURQUOISE,
    letterSpacing: 3,
    textTransform: "uppercase",
    fontFamily: "Helvetica",
    marginBottom: 2,
  },

  verificationCode: {
    fontSize: 9,
    color: COLORS.WHITE,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
  },

  verificationUrl: {
    fontSize: 7,
    color: COLORS.GRAY,
    fontFamily: "Helvetica",
    marginTop: 2,
  },

  issueDate: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  issueDateLabel: {
    fontSize: 7,
    color: COLORS.TURQUOISE,
    letterSpacing: 3,
    textTransform: "uppercase",
    fontFamily: "Helvetica",
    marginBottom: 2,
  },

  issueDateValue: {
    fontSize: 10,
    color: COLORS.WHITE,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },

  signatureBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  signatureLine: {
    width: 130,
    height: 1,
    backgroundColor: COLORS.GRAY,
    marginBottom: 6,
  },

  signatureName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.WHITE,
    textAlign: "center",
  },

  signatureTitle: {
    fontSize: 8,
    fontFamily: "Helvetica",
    color: COLORS.GRAY,
    textAlign: "center",
    marginTop: 1,
    letterSpacing: 1,
  },
})

interface CertificateProps {
  studentName: string
  title: string
  courseTitle?: string
  description?: string
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
  type,
}: CertificateProps) {
  const isModule = type === "MODULE"

  return (
    <Document title={`Certificado - ${title}`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Outer decorative frame */}
        <View style={styles.outerFrame}>
          <View style={styles.innerContainer}>

            {/* Corner decorations */}
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
            <View style={styles.cornerAccentTL} />
            <View style={styles.cornerAccentTR} />
            <View style={styles.cornerAccentBL} />
            <View style={styles.cornerAccentBR} />

            {/* Header Band */}
            <View style={styles.headerBand}>
              <View style={styles.logoSection}>
                <Text style={styles.logoWordmark}>
                  <Text style={styles.logoAccent}>C</Text>
                  <Text>onnect</Text>
                  <Text style={{ color: COLORS.OFF_WHITE }}> Digital School</Text>
                </Text>
                <Text style={styles.logoTagline}>Educação · Inovação · Futuro</Text>
              </View>

              <Text style={styles.certificateTypeLabel}>
                {isModule ? "Certificado de\nMódulo" : "Certificado de\nConclusão"}
              </Text>
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>

              {/* Ornament */}
              <View style={styles.ornamentRow}>
                <View style={styles.ornamentLine} />
                <View style={styles.ornamentDiamond} />
                <View style={styles.ornamentLine} />
              </View>

              <Text style={styles.bigTitle}>Certificado</Text>

              <Text style={styles.subtitle}>
                {isModule ? "Conclusão de Módulo" : "Conclusão de Curso"}
              </Text>

              {/* Ornament */}
              <View style={styles.ornamentRow}>
                <View style={styles.ornamentLine} />
                <View style={styles.ornamentDiamond} />
                <View style={styles.ornamentLine} />
              </View>

              <Text style={styles.certifyText}>Certificamos com honra que</Text>

              <Text style={styles.studentName}>{studentName}</Text>
              <View style={styles.nameUnderline} />

              <Text style={styles.moduleInfo}>
                {isModule
                  ? `concluiu com êxito o módulo "${title}" do curso "${courseTitle}" na Connect Digital School.`
                  : `concluiu com êxito e excelência o curso completo de "${title}" na Connect Digital School.`}
              </Text>

              {description && (
                <View style={styles.learningsBox}>
                  <Text style={styles.learningsTitle}>● Competências adquiridas</Text>
                  <Text style={styles.learningsText}>{description}</Text>
                </View>
              )}
            </View>

            {/* Footer Band */}
            <View style={styles.footerBand}>
              {/* QR + Verification */}
              <View style={styles.verificationBox}>
                {qrDataUrl && <Image src={qrDataUrl} style={styles.qrCode} />}
                <View style={styles.verificationText}>
                  <Text style={styles.verificationLabel}>Verificação</Text>
                  <Text style={styles.verificationCode}>{verificationCode}</Text>
                  <Text style={styles.verificationUrl}>
                    {process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '')}/verify/{verificationCode}
                  </Text>
                </View>
              </View>

              {/* Issue Date */}
              <View style={styles.issueDate}>
                <Text style={styles.issueDateLabel}>Data de emissão</Text>
                <Text style={styles.issueDateValue}>{issueDate}</Text>
              </View>

              {/* Signature */}
              <View style={styles.signatureBox}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureName}>Connect Digital School</Text>
                <Text style={styles.signatureTitle}>Coordenação Académica</Text>
              </View>
            </View>

          </View>
        </View>
      </Page>
    </Document>
  )
}
