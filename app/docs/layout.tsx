
import { MainFooter } from "@/components/main-footer"
import { MainNavbar } from "@/components/main-navbar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Book, Database, FileText, Layout, Settings, Shield } from "lucide-react"
import Link from "next/link"

const sidebarLinks = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs", icon: Book },
      { title: "Setup & Deployment", href: "/docs/setup-and-deployment", icon: Settings },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { title: "Business Rules", href: "/docs/business-rules", icon: FileText },
      { title: "Use Cases", href: "/docs/use-cases", icon: Layout },
    ],
  },
  {
    title: "Technical",
    items: [
      { title: "Architecture", href: "/docs/architecture", icon: Database },
      { title: "Database Schema", href: "/docs/database-schema", icon: Database },
      { title: "Security", href: "/docs/security", icon: Shield },
    ],
  },
]

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNavbar />

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 pt-20">
        <aside className="fixed top-20 z-30 -ml-2 hidden h-[calc(100vh-5rem)] w-full shrink-0 md:sticky md:block border-r border-border/40">
          <ScrollArea className="h-full py-6 pr-6 lg:py-8">
            <div className="w-full">
                {sidebarLinks.map((group, i) => (
                    <div key={i} className="pb-4">
                        <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">{group.title}</h4>
                        <div className="grid grid-flow-row auto-rows-max text-sm">
                            {group.items.map((item, j) => (
                                <Button
                                    key={j}
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start font-normal text-muted-foreground hover:text-[#10D79E] hover:bg-[#10D79E]/10"
                                    asChild
                                >
                                    <Link href={item.href}>
                                        <item.icon className="mr-2 w-4 h-4" />
                                        {item.title}
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
          </ScrollArea>
        </aside>

        <main className="relative py-6 lg:gap-10 lg:py-8">
          <div className="mx-auto w-full min-w-0 max-w-3xl">
            {children}
          </div>
        </main>
      </div>

      <MainFooter />
    </div>
  )
}
