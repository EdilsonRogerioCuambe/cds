import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://connectdigitalschool.com.br'

  // Fetch courses to include in sitemap
  const courses = await prisma.course.findMany({
    where: { published: true },
    select: { id: true, updatedAt: true }
  })

  const courseUrls = courses.map((course) => ({
    url: `${baseUrl}/courses/${course.id}`, // Assuming a public course page exists or will exist
    lastModified: course.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...courseUrls,
  ]
}
