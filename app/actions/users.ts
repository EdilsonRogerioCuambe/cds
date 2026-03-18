"use server"

import prisma from "@/lib/prisma"
import { Role } from "@prisma/client"
import { getCurrentUser } from "@/lib/auth"

export async function getTeachers() {
  const user = await getCurrentUser()
  if (!user || user.role !== Role.ADMIN) {
    throw new Error("Unauthorized")
  }

  const teachers = await prisma.user.findMany({
    where: {
      role: Role.TEACHER,
      status: "ACTIVE"
    },
    select: {
      id: true,
      name: true,
      email: true
    },
    orderBy: {
      name: "asc"
    }
  })

  return teachers
}
