import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

function generateRegistrationNumber(): string {
    const letters = "CDS";
    const numbers = Math.floor(100000 + Math.random() * 900000); // 6 digits
    return `${letters}${numbers}`;
}

async function main() {
    const users = await prisma.user.findMany({
        where: {
            registrationNumber: null
        }
    })

    console.log(`Encontrados ${users.length} usuários sem matrícula.`)

    for (const user of users) {
        let unique = false
        let regNum = ""
        
        while (!unique) {
            regNum = generateRegistrationNumber()
            const existing = await prisma.user.findUnique({
                where: { registrationNumber: regNum }
            })
            if (!existing) unique = true
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { registrationNumber: regNum }
        })
        console.log(`Usuário ${user.email} atualizado com matrícula: ${regNum}`)
    }

    console.log("Processo de backfill concluído.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
