"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ThumbsUp, Users, Lightbulb, HandHeart, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface CommunityReport {
  id: string
  title: string
  description: string
  upvotes: number
  city: string
  status: "pending" | "community" | "in_progress"
  initiator?: string
}

const seedReports: CommunityReport[] = [
  {
    id: "r1",
    title: "Fix broken sidewalks in Sector 3",
    description: "Multiple cracks causing safety issues for seniors.",
    upvotes: 44,
    city: "Ranchi",
    status: "pending",
  },
  {
    id: "r2",
    title: "De-silt drainage near Market Square",
    description: "Waterlogging after mild rain; needs immediate attention.",
    upvotes: 51,
    city: "Dhanbad",
    status: "community",
  },
  {
    id: "r3",
    title: "Add speed breakers near primary school",
    description: "Frequent speeding reported during school hours.",
    upvotes: 39,
    city: "Jamshedpur",
    status: "pending",
  },
]

export function PendingReports() {
  const [reports, setReports] = useState<CommunityReport[]>(seedReports)
  // auto-promote demo: periodically increase votes and emit events so items move to community
  if (typeof window !== "undefined") {
    // set up a slow interval promotion
    const key = "__pending_auto__"
    if (!(window as any)[key]) {
      ;(window as any)[key] = setInterval(() => {
        setReports((prev) => {
          const next = prev.map((r, idx) => {
            if (r.status !== "pending") return r
            const inc = Math.random() < 0.5 ? 1 : 0
            const newVotes = r.upvotes + inc
            const becameCommunity = r.upvotes < 50 && newVotes >= 50
            const updated = {
              ...r,
              upvotes: newVotes,
              status: newVotes >= 50 ? "community" : r.status,
            }
            if (becameCommunity && typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("community-report-reached", { detail: updated }))
            }
            return updated
          })
          return next
        })
      }, 20000) // every 20s
    }
  }

  const suggestions = useMemo(() => {
    return reports
      .filter((r) => r.status === "pending")
      .map((r) => ({ id: r.id, score: Math.min(100, Math.round((r.upvotes / 50) * 100)) }))
      .filter((s) => s.score >= 60)
  }, [reports])

  const upvote = (id: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r
        const newVotes = r.upvotes + 1
        return {
          ...r,
          upvotes: newVotes,
          status: newVotes >= 50 ? (r.status === "community" ? r.status : "community") : r.status,
        }
      }),
    )
  }

  const takeInitiative = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "in_progress", initiator: "You" } : r)),
    )
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("admin-alert"))
    }
    alert("Thanks for taking initiative! We've notified others to join in.")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Pending Reports</h2>
          <p className="text-muted-foreground">Reports approaching 50 upvotes to become Community Reports</p>
        </div>
      </div>

      {/* AI Suggestions */}
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <div className="font-semibold text-card-foreground">AI Suggestions</div>
        </div>
        {suggestions.length === 0 ? (
          <div className="text-sm text-muted-foreground">No strong candidates yet. Keep supporting important reports.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map((s) => {
              const rep = reports.find((r) => r.id === s.id)!
              return (
                <Card key={s.id} className="p-3 bg-muted/20 border-border">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-card-foreground">{rep.title}</div>
                      <div className="text-xs text-muted-foreground">{rep.city} • {rep.upvotes} upvotes</div>
                    </div>
                    <Badge variant="secondary">{s.score}% likely</Badge>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </Card>

      <div className="space-y-4">
        {reports.map((r) => {
          const pct = Math.min(100, Math.round((r.upvotes / 50) * 100))
          return (
            <Card key={r.id} className="p-4 bg-card border-border">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-card-foreground">{r.title}</div>
                  <div className="text-sm text-muted-foreground">{r.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">{r.city}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      "text-white",
                      r.status === "pending" && "bg-yellow-500",
                      r.status === "community" && "bg-primary",
                      r.status === "in_progress" && "bg-emerald-600",
                    )}
                  >
                    {r.status === "pending" && "Pending"}
                    {r.status === "community" && "Community Report"}
                    {r.status === "in_progress" && "Initiative Taken"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Button size="sm" variant="outline" onClick={() => upvote(r.id)}>
                    <ThumbsUp className="h-4 w-4 mr-1" /> Upvote
                  </Button>
                  <div>{r.upvotes} / 50</div>
                </div>
                {r.status === "community" && !r.initiator && (
                  <Button size="sm" className="gap-1" onClick={() => takeInitiative(r.id)}>
                    <HandHeart className="h-4 w-4" /> Take Initiative
                  </Button>
                )}
              </div>
              <div className="mt-2">
                <Progress value={pct} className="h-1.5" />
              </div>
              {r.status === "community" && (
                <div className="mt-2 text-xs text-emerald-500">This report is now community-backed. Seeking initiative lead.</div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default PendingReports




