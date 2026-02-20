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

  console.log({ admin })
  console.log("✅ Seed concluído. Cursos devem ser criados pelo painel do professor.")
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
