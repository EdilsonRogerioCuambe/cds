
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Crown, GraduationCap, Shield, Users } from "lucide-react"

export default function BusinessRulesPage() {
  return (
    <div className="space-y-10 pb-10">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-[#132747] font-display">Business Rules</h1>
        <p className="text-lg text-muted-foreground">
          Core logic and operational rules governing the Connect Digital School platform.
        </p>
      </div>

      <Separator />

      {/* 1. User Roles */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-[#132747]/10 rounded-lg">
                <Users className="w-6 h-6 text-[#132747]" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">1. User Roles</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-red-500" />
                        Admin/Owner
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>• Full platform control.</p>
                    <p>• Configure payment models.</p>
                    <p>• Manage content & users.</p>
                    <p>• View analytics.</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-[#10D79E]" />
                        Teacher
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>• Create lessons & quizzes.</p>
                    <p>• Grade student work.</p>
                    <p>• Moderate forums.</p>
                    <p>• View student progress.</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        Student
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>• Access content.</p>
                    <p>• Take quizzes & exams.</p>
                    <p>• Earn points & badges.</p>
                    <p>• Receive certificates.</p>
                </CardContent>
            </Card>
        </div>
      </section>

      {/* 2. Payment Models */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">2. Payment Models</h2>
        <Card className="bg-[#132747] text-white border-none">
            <CardContent className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                    "Per Module (One-time)",
                    "Monthly Subscription",
                    "Annual Subscription (Discount)",
                    "Weekly Subscription",
                    "Lifetime Access"
                ].map((model, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#10D79E]" />
                        <span className="font-medium">{model}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
      </section>

      {/* 3. Level Assessment */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">3. Level Assessment System</h2>
        <div className="grid gap-4 md:grid-cols-2">
            <div className="p-6 border rounded-xl bg-muted/20 space-y-4">
                <h3 className="font-bold text-lg">Placement & Progress</h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                    <li><strong>Placement Test:</strong> 20-question test for initial level.</li>
                    <li><strong>Classification:</strong> A1, A2, B1, B2, C1, C2 (CEFR).</li>
                    <li><strong>Progress Exams:</strong> Final exam required at end of each level.</li>
                </ul>
            </div>
            <div className="p-6 border rounded-xl bg-muted/20 space-y-4">
                 <h3 className="font-bold text-lg">Rules</h3>
                 <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                    <li><strong>Minimum Score:</strong> 70% to advance.</li>
                    <li><strong>Retake Policy:</strong> 3 attempts per exam.</li>
                    <li><strong>Cooldown:</strong> 24h between attempts.</li>
                </ul>
            </div>
        </div>
      </section>

      {/* 4. Gamification */}
      <section className="space-y-6">
         <h2 className="text-2xl font-semibold tracking-tight">4. Gamification System</h2>
         <div className="flex flex-wrap gap-2">
            {[
                { label: "Points", desc: "For lessons & quizzes" },
                { label: "Badges", desc: "30+ Achievements" },
                { label: "Levels", desc: "Bronze to Diamond" },
                { label: "Streaks", desc: "Daily login tracking" },
                { label: "Leaderboards", desc: "Global rankings" }
            ].map((item, i) => (
                <Badge key={i} variant="secondary" className="px-4 py-2 text-sm">
                    <Crown className="w-3 h-3 mr-2 text-yellow-500" />
                    {item.label}: <span className="font-normal text-muted-foreground ml-1">{item.desc}</span>
                </Badge>
            ))}
         </div>
      </section>

      {/* 5. Certificates */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">5. Certificate Generation</h2>
        <div className="p-6 rounded-xl border border-[#10D79E]/20 bg-[#10D79E]/5">
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="p-3 bg-[#10D79E]/10 rounded-lg">
                    <Crown className="w-8 h-8 text-[#10D79E]" />
                </div>
                <div className="space-y-2">
                    <h3 className="font-bold text-lg">Criteria & Delivery</h3>
                     <p className="text-sm text-muted-foreground">
                        Students must complete <strong>100% of the module</strong> and score <strong>≥ 80%</strong> on the final exam.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Every certificate allows public verification via <strong>QR Code</strong> and Unique ID.
                        Sent automatically via email (Resend) and stored in user profile.
                    </p>
                </div>
            </div>
        </div>
      </section>
    </div>
  )
}
