import prisma from "@/lib/prisma"
import { StudentsClient } from "./students-client"

export default async function AdminStudentsPage() {
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      registrationNumber: true,
      currentLevel: true,
      status: true,
      createdAt: true,
      image: true
    }
  })

  return <StudentsClient students={students as any} />
}
