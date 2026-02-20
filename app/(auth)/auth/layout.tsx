
import { faker } from "@faker-js/faker"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Column - Brand & Visuals */}
      <div className="hidden lg:flex flex-col justify-between bg-[#132747] p-10 text-white relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#10D79E]/10 rounded-full blur-[120px] -mr-[300px] -mt-[300px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#10D79E]/5 rounded-full blur-[120px] -ml-[300px] -mb-[300px]" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
            <div className="flex flex-col">
              <span className="font-display text-white text-3xl font-extrabold tracking-tight leading-none">
                C<span className="text-[#10D79E]">o</span>nnect
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/60 mt-1">
                Digital School
              </span>
            </div>
        </div>

        {/* Testimonial / Brand Message */}
        <div className="relative z-10 max-w-md">
          <blockquote className="text-xl font-medium leading-relaxed">
            "Connect Digital School transformou completamente minha carreira. A metodologia é viciante e os resultados são reais."
          </blockquote>
          <div className="mt-8 flex items-center gap-4">
            <img
                src={faker.image.avatarGitHub()}
                alt="Sofia M."
                className="w-10 h-10 rounded-full border-2 border-white/20"
            />
            <div>
              <p className="font-bold">Sofia M.</p>
              <p className="text-sm text-white/60">Aluna C1 &middot; Maputo</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-white/40">
          &copy; 2026 Connect Digital School
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex flex-col items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <a href="/" className="flex flex-col items-center group">
              <span className="font-display text-[#132747] text-4xl font-extrabold tracking-tight leading-none group-hover:scale-105 transition-transform">
                C<span className="text-[#10D79E]">o</span>nnect
              </span>
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground mt-1">
                Digital School
              </span>
            </a>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
