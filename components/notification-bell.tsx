"use client"

import { useEffect, useState } from "react"
import { Bell, Check, Loader2, MessageSquare } from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuHeader,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  getNotifications, 
  getUnreadCount, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  type NotificationType 
} from "@/lib/actions/notifications"
import { cn } from "@/lib/utils"
import Link from "next/link"

const typeIcons: Record<string, any> = {
  INFO: MessageSquare,
  SUCCESS: Check,
  ENROLLMENT: Bell,
  // Add more as needed
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const fetchNotifications = async () => {
    setIsLoading(true)
    const [data, count] = await Promise.all([
      getNotifications(10),
      getUnreadCount()
    ])
    setNotifications(data)
    setUnreadCount(count)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchNotifications()
    // Poll for new notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead()
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  return (
    <DropdownMenu onOpenChange={(open) => {
      setIsOpen(open)
      if (open) fetchNotifications()
    }}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group hover:bg-primary/10">
          <Bell className={cn(
            "h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors",
            isOpen && "text-primary"
          )} />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-primary text-[10px] animate-in zoom-in"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 shadow-2xl border-white/10 glass">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <h3 className="font-bold text-sm">Notificações</h3>
          {unreadCount > 0 && (
            <Button 
                variant="ghost" 
                size="sm" 
                className="text-[10px] h-6 px-2 hover:text-primary"
                onClick={handleMarkAllAsRead}
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <ScrollArea className="h-80">
          {isLoading && notifications.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary/50" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <Bell className="h-10 w-10 text-muted-foreground/20 mb-3" />
              <p className="text-xs text-muted-foreground font-medium">Você não tem notificações no momento.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => {
                const Icon = typeIcons[notification.type] || Bell
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex gap-3 px-4 py-3 hover:bg-muted/30 transition-colors border-b border-white/5 last:border-0 relative",
                      !notification.read && "bg-primary/[0.02]"
                    )}
                  >
                    <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                        notification.read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className={cn(
                            "text-xs font-bold truncate",
                            !notification.read ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary mt-1 shrink-0 animate-pulse" />
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                      {notification.link ? (
                        <Link 
                            href={notification.link}
                            className="text-[10px] font-bold text-primary hover:underline mt-2 inline-block"
                            onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Ver detalhes
                        </Link>
                      ) : !notification.read && (
                        <button 
                            className="text-[10px] font-bold text-muted-foreground hover:text-primary mt-2"
                            onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Marcar como lida
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t border-white/5 bg-muted/20">
            <Button variant="ghost" size="sm" className="w-full text-[10px] h-8 font-bold text-muted-foreground" asChild>
                <Link href="/student/dashboard">Ver todas no Dashboard</Link>
            </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
