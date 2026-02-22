import { Leaderboard } from "@/components/leaderboard"
import { getCurrentUser } from "@/lib/auth"
import { getLeaderboard } from "@/lib/data"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function LeaderboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/auth/login")

  const entries = await getLeaderboard(20)

  return <Leaderboard entries={entries} currentUserId={user.id} />
}
