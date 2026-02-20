import { PrismaClient, Role, UserStatus } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // 1. Create ADMIN
  const admin = await prisma.user.upsert({
    where: { email: "edicuambe@gmail.com" },
    update: {},
    create: {
      email: "edicuambe@gmail.com",
      name: "Edilson Rogério Cuambe",
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  })

  // 2. Create Courses
  const courseA1 = await prisma.course.upsert({
    where: { id: "64f1a2b3c4d5e6f7a8b9c0d1" }, // Using a valid MongoDB ObjectId format
    update: {},
    create: {
      id: "64f1a2b3c4d5e6f7a8b9c0d1",
      title: "Beginner",
      description: "Start your English journey with basic greetings, simple sentences, and everyday vocabulary.",
      level: "A1",
      published: true,
      price: 99.9,
    },
  })

  console.log({ admin, courseA1 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
