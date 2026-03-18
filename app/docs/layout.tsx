import { MainFooter } from "@/components/main-footer"
import { MainNavbar } from "@/components/main-navbar"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNavbar />

      <div className="flex-1 pt-20">
        <main className="relative py-6 lg:py-10">
          <div className="mx-auto w-full px-4 lg:px-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      <MainFooter />
    </div>
  )
}
