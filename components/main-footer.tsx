import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react"
import Link from "next/link"

export function MainFooter() {
  return (
    <footer className="bg-muted/30 border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Col */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="flex flex-col">
                <span className="font-display text-[#132747] text-2xl font-extrabold tracking-tight text-foreground leading-none">
                  C<span className="text-[#10D79E]">o</span>nnect
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground mt-0.5">
                  Digital School
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Providing high-quality English education through modern, gamified technology.
              Connecting you with the world, one lesson at a time.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="/" className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="/" className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="font-bold mb-6">Learning</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/courses" className="hover:text-primary transition-colors">All Courses</Link></li>
              <li><Link href="#levels" className="hover:text-primary transition-colors">Proficiency Levels</Link></li>
              <li><Link href="/student/dashboard" className="hover:text-primary transition-colors">Student Success</Link></li>
              <li><Link href="#methods" className="hover:text-primary transition-colors">Teaching Methods</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/docs/business-rules" className="hover:text-primary transition-colors">Business Rules</Link></li>
              <li><Link href="/docs/architecture" className="hover:text-primary transition-colors">Platform Architecture</Link></li>
              <li><Link href="/docs/business-rules" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/docs/business-rules" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <span>hello@connect-school.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span>+258 84 000 0000</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Maputo, Mozambique</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2026 Connect Digital School. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-foreground">Support</Link>
            <Link href="/" className="hover:text-foreground">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
