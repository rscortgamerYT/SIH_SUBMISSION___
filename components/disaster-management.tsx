"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, MapPin, Phone, Radio } from "lucide-react"

interface DisasterAlert {
  id: string
  type: "flood" | "heatwave" | "cyclone" | "earthquake" | "storm"
  title: string
  city: string
  severity: "low" | "medium" | "high" | "critical"
  instructions: string
  helpline?: string
  reportedAt: Date
  admin?: boolean
}

const demoAlerts: DisasterAlert[] = [
  {
    id: "d1",
    type: "flood",
    title: "River level rising near Sector 5",
    city: "Jamshedpur",
    severity: "high",
    instructions: "Avoid low-lying areas, move to higher ground, keep drinking water safe.",
    helpline: "+91 112",
    reportedAt: new Date(),
  },
  {
    id: "d2",
    type: "heatwave",
    title: "Heat index above 44°C",
    city: "Dhanbad",
    severity: "medium",
    instructions: "Limit outdoor work 12-4pm, drink ORS, check on elderly.",
    helpline: "+91 108",
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "d3",
    type: "storm",
    title: "Strong winds expected tonight",
    city: "Ranchi",
    severity: "low",
    instructions: "Secure loose items, avoid parking under trees.",
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
  },
]

const adminDemoAlerts: DisasterAlert[] = [
  {
    id: "a1",
    type: "cyclone",
    title: "Admin: Cyclone watch issued for coastal areas",
    city: "East Singhbhum",
    severity: "high",
    instructions: "Fishermen advised not to venture into deep waters.",
    helpline: "+91 1070",
    reportedAt: new Date(),
    admin: true,
  },
  {
    id: "a2",
    type: "earthquake",
    title: "Admin: Minor tremors felt, structural checks ongoing",
    city: "Ranchi",
    severity: "medium",
    instructions: "Avoid elevators, use stairs. Await further instructions.",
    reportedAt: new Date(Date.now() - 1000 * 60 * 45),
    admin: true,
  },
]

export function DisasterManagement() {
  const [alerts, setAlerts] = useState<DisasterAlert[]>([...adminDemoAlerts, ...demoAlerts])
  const [newTitle, setNewTitle] = useState("")
  const [newCity, setNewCity] = useState("")
  const [newInstructions, setNewInstructions] = useState("")

  // Listen for admin announcements and reflect them here
  useEffect(() => {
    // Load from localStorage so recent admin posts reflect even after navigation
    try {
      const stored = JSON.parse(localStorage.getItem("publicAlerts") || "[]") as Array<{ title: string; city: string; mode: string; at: number }>
      if (stored.length) {
        const toAlerts: DisasterAlert[] = stored.map((s) => ({
          id: String(s.at),
          type: s.mode === "disaster" ? "cyclone" : "storm",
          title: s.title,
          city: s.city,
          severity: s.mode === "disaster" ? "critical" : s.mode === "warning" ? "high" : "medium",
          instructions:
            s.mode === "disaster"
              ? "Follow emergency instructions. Stay indoors or move to shelters as advised."
              : s.mode === "warning"
              ? "Exercise caution and avoid unnecessary travel. Monitor official updates."
              : "Be alert. Monitor official channels for further information.",
          reportedAt: new Date(s.at),
        }))
        setAlerts((prev) => [...toAlerts, ...prev])
      }
    } catch {}

    const onAdminAnnouncement = (e: Event) => {
      const detail = (e as CustomEvent).detail as any
      const mode = detail?.mode as "alert" | "warning" | "disaster"
      const title = detail?.title || "Public Notice"
      const city = detail?.city || "All"
      const isDisaster = mode === "disaster"
      const type: DisasterAlert["type"] = isDisaster ? "cyclone" : "storm"
      const severity: DisasterAlert["severity"] = isDisaster ? "critical" : mode === "warning" ? "high" : "medium"
      const instructions =
        mode === "disaster"
          ? "Follow emergency instructions. Stay indoors or move to shelters as advised."
          : mode === "warning"
          ? "Exercise caution and avoid unnecessary travel. Monitor official updates."
          : "Be alert. Monitor official channels for further information."

      setAlerts((prev) => [
        {
          id: String(Date.now()),
          type,
          title,
          city,
          severity,
          instructions,
          reportedAt: new Date(),
        },
        ...prev,
      ])
    }

    if (typeof window !== "undefined") {
      window.addEventListener("disaster-demo", onAdminAnnouncement as EventListener)
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("disaster-demo", onAdminAnnouncement as EventListener)
      }
    }
  }, [])

  const addMock = () => {
    if (!newTitle || !newCity) return
    setAlerts((prev) => [
      {
        id: String(Date.now()),
        type: "storm",
        title: newTitle,
        city: newCity,
        severity: "medium",
        instructions: newInstructions || "Follow local authority guidance.",
        reportedAt: new Date(),
      },
      ...prev,
    ])
    // Trigger global overlay demo event
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("disaster-demo", {
          detail: {
            title: newTitle,
            city: newCity,
            severity: "medium",
          },
        }),
      )
    }
    setNewTitle("")
    setNewCity("")
    setNewInstructions("")
  }

  const sevColor = (s: DisasterAlert["severity"]) =>
    s === "critical" ? "bg-red-700" : s === "high" ? "bg-red-500" : s === "medium" ? "bg-yellow-500" : "bg-blue-500"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-yellow-500/10 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-yellow-400 animate-pulse" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Warnings & Alerts</h2>
          <p className="text-muted-foreground">Live warnings, municipal alerts, helplines and safety instructions</p>
        </div>
      </div>

      {/* Admin-controlled only: demo creation removed from public page */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alerts.map((a) => (
          <Card key={a.id} className={`p-4 border-border ${a.admin ? "bg-blue-500/10 animate-pulse" : "bg-card"}`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-card-foreground">{a.title}</h3>
                  <Badge className={`text-white ${sevColor(a.severity)}`}>{a.severity}</Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {a.city}
                </div>
                <p className="text-sm text-card-foreground">{a.instructions}</p>
                {a.helpline && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" /> Helpline: {a.helpline}
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

export default DisasterManagement



