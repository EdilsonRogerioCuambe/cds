import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import React from "react"

import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "Connect Digital School - Transform seu Inglês",
  description: "Aprenda inglês com uma metodologia gamificada e tecnologia de ponta. Connect your future to the world.",
  metadataBase: new URL("https://connect-school.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Connect Digital School",
    description: "Connect your future to the world. Metodologia gamificada para adultos.",
    url: "https://connect-school.com",
    siteName: "Connect Digital School",
    images: [
      {
        url: "/og-image.jpg", // Assuming an image will be provided or generated later
        width: 1200,
        height: 630,
        alt: "Connect Digital School",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Connect Digital School",
    description: "Transforme seu futuro com o melhor do inglês digital.",
    images: ["/og-image.jpg"],
  },
}

export const viewport: Viewport = {
  themeColor: "#1a9a9a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
