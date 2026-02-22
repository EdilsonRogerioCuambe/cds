import { ForumPage } from "@/components/forum-page"
import { getForumPosts } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function Forum() {
  const initialPosts = await getForumPosts()

  return <ForumPage initialPosts={initialPosts} />
}
