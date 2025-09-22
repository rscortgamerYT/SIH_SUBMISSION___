"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Bell, ThumbsUp } from "lucide-react"

interface PNotif {
  id: string
  type: "report_update" | "pending_signature"
  title: string
  message: string
  isRead: boolean
  time: string
}

const seed: PNotif[] = [
  { id: "p1", type: "report_update", title: "Report #1247 updated", message: "Pothole repair scheduled for tomorrow 6 AM.", isRead: false, time: "2h" },
  { id: "p2", type: "pending_signature", title: "Petition #P-102", message: "2 signatures pending to reach 50.", isRead: false, time: "4h" },
  { id: "p3", type: "report_update", title: "Streetlight issue resolved", message: "Block B streetlight fixed.", isRead: true, time: "1d" },
  { id: "p4", type: "pending_signature", title: "Petition #P-098", message: "5 signatures pending.", isRead: true, time: "2d" },
]

export function PersonalNotifications() {
  const [items, setItems] = useState<PNotif[]>(seed)

  const markAll = () => setItems((prev) => prev.map((i) => ({ ...i, isRead: true })))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Personal Notifications</h2>
          <p className="text-muted-foreground">Report updates and pending petition signatures</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={markAll}>Mark all read</Button>
          <Badge variant="secondary">{items.filter((i) => !i.isRead).length} unread</Badge>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((n) => (
          <Card key={n.id} className={`p-4 border-border ${!n.isRead ? "bg-primary/5 border-l-4 border-l-primary" : "bg-card"}`}>
            <div className="flex items-start gap-3">
              {n.type === "report_update" ? (
                <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              ) : (
                <Bell className="h-5 w-5 text-yellow-500 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-card-foreground text-sm">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.time} ago</div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{n.message}</div>
                {n.type === "pending_signature" && !n.isRead && (
                  <div className="mt-2">
                    <Button size="sm" onClick={() => alert("Reminder sent to supporters")}>Send Reminder</Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default PersonalNotifications



