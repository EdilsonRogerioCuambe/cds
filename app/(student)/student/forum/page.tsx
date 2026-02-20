import { ForumPage } from "@/components/forum-page"
import { getForumPosts } from "@/lib/data"

export default async function Forum() {
  const initialPosts = await getForumPosts()

  return <ForumPage initialPosts={initialPosts} />
}
