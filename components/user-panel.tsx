"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Megaphone, Bell, BarChart3, Rocket } from "lucide-react"

interface MyReport {
  id: string
  title: string
  status: "open" | "in_progress" | "resolved"
  upvotes: number
  progress: number
}

const demoReports: MyReport[] = [
  { id: "m1", title: "Overflowing garbage bin near Sector 4 market", status: "in_progress", upvotes: 37, progress: 55 },
  { id: "m2", title: "Streetlight not working outside Block B", status: "open", upvotes: 18, progress: 25 },
  { id: "m3", title: "Potholes on main road near bus stand", status: "resolved", upvotes: 72, progress: 100 },
]

export function UserPanel() {
  const [reports, setReports] = useState<MyReport[]>(demoReports)
  const [notifications] = useState([{ id: "n1", text: "2 signatures pending for your petition #P-102" }])

  const rank = useMemo(() => ({ position: 12, score: 1840 }), [])

  const moveToPetition = (id: string) => {
    const rep = reports.find((r) => r.id === id)
    if (!rep) return
    alert("Notification sent to all upvoters to sign the petition.")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Rocket className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">User Panel</h2>
          <p className="text-muted-foreground">Your reports, notifications, analytics and AI suggestions</p>
        </div>
      </div>

      <Tabs defaultValue="reports">
        <TabsList className="bg-muted">
          <TabsTrigger value="reports" className="flex items-center gap-2"><FileText className="h-4 w-4" /> My Reports</TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Analytics</TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2"><Megaphone className="h-4 w-4" /> AI For You</TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <div className="space-y-4">
            {reports.map((r) => (
              <Card key={r.id} className="p-4 bg-card border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-card-foreground">{r.title}</div>
                    <div className="text-xs text-muted-foreground">{r.upvotes} upvotes</div>
                  </div>
                  <Badge className={
                    r.status === "resolved" ? "bg-primary text-white" : r.status === "in_progress" ? "bg-yellow-500 text-white" : "bg-gray-500 text-white"
                  }>
                    {r.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-card-foreground">{r.progress}%</span>
                  </div>
                  <Progress value={r.progress} className="h-1.5" />
                </div>
                {r.status !== "resolved" && (
                  <div className="mt-3">
                    <Button size="sm" variant="outline" onClick={() => moveToPetition(r.id)}>
                      Move to Petition & Notify Upvoters
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-4 bg-card border-border">
            <div className="space-y-2 text-sm">
              {notifications.map((n) => (
                <div key={n.id} className="p-3 rounded bg-muted/20 border border-border">{n.text}</div>
              ))}
              <div className="p-3 rounded bg-muted/20 border border-border">Demo: Petition #P-102 is awaiting 2 more signatures.</div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-card border-border">
              <div className="text-sm text-muted-foreground">Leaderboard Position</div>
              <div className="text-2xl font-bold text-card-foreground">#{rank.position}</div>
            </Card>
            <Card className="p-4 bg-card border-border">
              <div className="text-sm text-muted-foreground">Total Score</div>
              <div className="text-2xl font-bold text-card-foreground">{rank.score}</div>
            </Card>
            <Card className="p-4 bg-card border-border">
              <div className="text-sm text-muted-foreground">Reports Filed</div>
              <div className="text-2xl font-bold text-card-foreground">{reports.length}</div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai">
          <div className="space-y-3">
            {["Drainage near Sector 7", "Playground maintenance in Ward 11", "Pedestrian crossing at Civil Lines"].map((s, i) => (
              <Card key={i} className="p-3 bg-muted/20 border border-border text-sm">
                Reports like "{s}" may interest you based on your past activity.
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default UserPanel



