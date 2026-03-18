"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "../auth"
import prisma from "@/lib/prisma"

export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "ENROLLMENT"

export async function createNotification(data: {
  userId: string
  title: string
  message: string
  type?: NotificationType
  link?: string
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || "INFO",
        link: data.link,
      },
    })

    revalidatePath("/student/dashboard")
    return notification
  } catch (error) {
    console.error("[Notification Action] Error creating notification:", error)
    return null
  }
}

export async function getNotifications(limit = 10) {
  try {
    const user = await getCurrentUser()
    if (!user) return []

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    return notifications
  } catch (error) {
    console.error("[Notification Action] Error fetching notifications:", error)
    return []
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    await prisma.notification.update({
      where: { id: notificationId, userId: user.id },
      data: { read: true },
    })

    revalidatePath("/student/dashboard")
    return { success: true }
  } catch (error) {
    console.error("[Notification Action] Error marking notification as read:", error)
    return { success: false }
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    await prisma.notification.updateMany({
      where: { userId: user.id, read: false },
      data: { read: true },
    })

    revalidatePath("/student/dashboard")
    return { success: true }
  } catch (error) {
    console.error("[Notification Action] Error marking all notifications as read:", error)
    return { success: false }
  }
}

export async function getUnreadCount() {
  try {
    const user = await getCurrentUser()
    if (!user) return 0

    const count = await prisma.notification.count({
      where: { userId: user.id, read: false },
    })

    return count
  } catch (error) {
    console.error("[Notification Action] Error getting unread count:", error)
    return 0
  }
}
