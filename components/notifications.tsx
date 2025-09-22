"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, AlertTriangle, Info, DollarSign, X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: "budget_allocation" | "status_update" | "announcement" | "ai_suggestion" | "downtime" | "app_report" | "community_report" | "concluded_report"
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  priority: "high" | "medium" | "low"
  source: string
  actionRequired?: boolean
  relatedReportId?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "budget_allocation",
    title: "Budget Allocated for Main Street Pothole Repair",
    message:
      "Municipal Corporation of Dhanbad has allocated ₹2.5 lakhs for the pothole repair on Main Street. Work is expected to begin within 7 days.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
    priority: "high",
    source: "Municipal Corporation Dhanbad",
    actionRequired: false,
    relatedReportId: "1",
  },
  {
    id: "2",
    type: "budget_allocation",
    title: "Street Light Installation Budget Approved",
    message:
      "Ranchi Municipal Corporation has approved ₹1.8 lakhs for installing new LED street lights on Park Avenue. Installation scheduled for next week.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isRead: false,
    priority: "medium",
    source: "Municipal Corporation Ranchi",
    actionRequired: false,
    relatedReportId: "2",
  },
  {
    id: "9",
    type: "downtime",
    title: "Road closure maintenance alert",
    message: "Jamshedpur: Sector 5 to Station Road blocked 6 AM – 9 AM for drainage repair.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isRead: false,
    priority: "high",
    source: "Municipal Works",
  },
]

const personalSeed = [
  { id: "p1", title: "Your report #1247 was acknowledged", message: "Team assigned. Updates will follow.", time: "1h" },
  { id: "p2", title: "Petition #P-102 nearing goal", message: "2 signatures to reach 50.", time: "3h" },
]

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<"all" | "unread" | "budget" | "updates" | "downtime" | "app" | "community" | "concluded">("all")
  const [tab, setTab] = useState<"system" | "personal">("system")

  useEffect(() => {
    const onAppReport = (e: Event) => {
      const detail = (e as CustomEvent).detail as any
      setNotifications((prev) => [
        {
          id: `app-${Date.now()}`,
          type: "app_report",
          title: "New report created via app",
          message: detail?.title ? `${detail.title} submitted` : "A new report was created",
          timestamp: new Date(),
          isRead: false,
          priority: "medium",
          source: "App",
          relatedReportId: detail?.id?.toString?.() || undefined,
        },
        ...prev,
      ])
    }
    const onCommunityReached = (e: Event) => {
      const r = (e as CustomEvent).detail as any
      setNotifications((prev) => [
        {
          id: `comm-${Date.now()}`,
          type: "community_report",
          title: "Report reached Community status",
          message: r?.title ? `${r.title} has crossed 50 upvotes` : "A report crossed 50 upvotes",
          timestamp: new Date(),
          isRead: false,
          priority: "medium",
          source: "Community",
          relatedReportId: r?.id?.toString?.() || undefined,
        },
        ...prev,
      ])
    }
    const onConcluded = (e: Event) => {
      const r = (e as CustomEvent).detail as any
      setNotifications((prev) => [
        {
          id: `done-${Date.now()}`,
          type: "concluded_report",
          title: "Report concluded",
          message: r?.title ? `${r.title} marked concluded` : "A report was concluded",
          timestamp: new Date(),
          isRead: false,
          priority: "low",
          source: "Community",
          relatedReportId: r?.id?.toString?.() || undefined,
        },
        ...prev,
      ])
    }

    if (typeof window !== "undefined") {
      window.addEventListener("app-report-created", onAppReport as EventListener)
      window.addEventListener("community-report-reached", onCommunityReached as EventListener)
      window.addEventListener("report-concluded", onConcluded as EventListener)
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("app-report-created", onAppReport as EventListener)
        window.removeEventListener("community-report-reached", onCommunityReached as EventListener)
        window.removeEventListener("report-concluded", onConcluded as EventListener)
      }
    }
  }, [])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  // Demo background effect for new events
  const BackgroundPlus = () => (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 opacity-10 animate-pulse" style={{
        backgroundImage: `radial-gradient(circle at 20% 20%, rgba(16,185,129,0.4) 2px, transparent 3px), radial-gradient(circle at 80% 70%, rgba(59,130,246,0.4) 2px, transparent 3px)`,
        backgroundSize: "24px 24px",
      }} />
    </div>
  )

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.isRead
    if (filter === "budget") return notif.type === "budget_allocation"
    if (filter === "updates") return notif.type === "status_update"
    if (filter === "downtime") return notif.type === "downtime"
    if (filter === "app") return notif.type === "app_report"
    if (filter === "community") return notif.type === "community_report"
    if (filter === "concluded") return notif.type === "concluded_report"
    return true
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "budget_allocation":
        return <DollarSign className="h-5 w-5 text-green-500" />
      case "status_update":
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case "announcement":
        return <Info className="h-5 w-5 text-purple-500" />
      case "ai_suggestion":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "downtime":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "app_report":
        return <Plus className="h-5 w-5 text-blue-500 animate-pulse" />
      case "community_report":
        return <Plus className="h-5 w-5 text-emerald-500 animate-pulse" />
      case "concluded_report":
        return <CheckCircle className="h-5 w-5 text-emerald-600 animate-pulse" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    return "Just now"
  }

  return (
    <div className="space-y-6 relative">
      <BackgroundPlus />

      {/* Notification Center (Top) */}
      <div className="sticky top-16 z-10 bg-background/80 backdrop-blur-md border border-border/50 rounded p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Notifications</h2>
          <p className="text-muted-foreground">Budget Alerts, Report Updates and Downtime Notices</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            Mark All Read
          </Button>
          <Badge variant="secondary">{notifications.filter((n) => !n.isRead).length} unread</Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <Button size="sm" variant={tab === "system" ? "default" : "outline"} onClick={() => setTab("system")}>System</Button>
        <Button size="sm" variant={tab === "personal" ? "default" : "outline"} onClick={() => setTab("personal")}>Personal</Button>
      </div>

      {tab === "system" && (
        <>
          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {(["all", "unread", "budget", "updates", "downtime", "app", "community", "concluded"] as const).map(
              (filterType) => (
                <Button
                  key={filterType as string}
                  variant={filter === (filterType as any) ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(filterType as any)}
                  className="capitalize"
                >
                  {filterType === "budget" ? "Budget Allocations" : (filterType as string)}
                </Button>
              ),
            )}
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={cn(
                  "p-4 transition-all duration-200 hover:shadow-md cursor-pointer relative overflow-hidden",
                  !notification.isRead && "border-l-4 border-l-primary bg-primary/5",
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-4 relative">
                  <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={cn("font-semibold text-sm", !notification.isRead && "text-foreground")}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{notification.source}</span>
                        <span>•</span>
                        <span>{formatTimestamp(notification.timestamp)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={cn("text-white text-xs", getPriorityColor(notification.priority))}>
                          {notification.priority}
                        </Badge>
                        {!notification.isRead && <div className="w-2 h-2 bg-primary rounded-full" />}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <Card className="p-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No notifications</h3>
              <p className="text-muted-foreground">You're all caught up!</p>
            </Card>
          )}
        </>
      )}

      {tab === "personal" && (
        <Card className="p-4 space-y-3 bg-card border-border">
          <div className="text-sm text-muted-foreground">Your recent updates</div>
          {personalSeed.map((p) => (
            <div key={p.id} className="p-3 rounded bg-muted/20 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-card-foreground">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.message}</div>
                </div>
                <Badge variant="secondary">{p.time} ago</Badge>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
