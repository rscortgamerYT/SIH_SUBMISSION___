"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const names = [
  "Ravish",
  "Sanjay",
  "Aisha",
  "Priya",
  "Aman",
  "Neha",
  "Arjun",
  "Kiran",
]

const sources = [
  { label: "X", color: "bg-slate-800 text-white", icon: "/placeholder-logo.png" },
  { label: "Instagram", color: "bg-pink-600 text-white", icon: "/placeholder-logo.png" },
  { label: "WhatsApp", color: "bg-emerald-600 text-white", icon: "/placeholder-logo.png" },
  { label: "Gmail", color: "bg-amber-600 text-white", icon: "/placeholder-logo.png" },
]

const cities = [
  { name: "Ranchi", area: "Main Street" },
  { name: "Dhanbad", area: "Park Avenue" },
  { name: "Jamshedpur", area: "Sector 5" },
  { name: "Bokaro", area: "Market Square" },
]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function SocialReportNotifications({ onNewIssue, onAlertPing }: { onNewIssue?: (issue: any) => void; onAlertPing?: () => void }) {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState("")
  const [source, setSource] = useState(sources[0])

  useEffect(() => {
    const showOnce = () => {
      const n = randomItem(names)
      const s = randomItem(sources)
      const c = randomItem(cities)
      setSource(s)
      setMessage(`${n} just created a report via ${s.label} at ${c.area}, ${c.name}`)
      setVisible(true)
      onAlertPing?.()
      // Emit a lightweight issue for live feed
      onNewIssue?.({
        title: `${s.label} report by ${n}`,
        type: "other",
        location: { name: c.area, city: c.name },
        status: "open",
        priority: "medium",
        description: `New report ingested from ${s.label} at ${c.area}, ${c.name}`,
        submittedAt: new Date(),
        submittedBy: n,
      })
      setTimeout(() => setVisible(false), 5000)
    }

    const initial = setTimeout(showOnce, 8000)
    const interval = setInterval(() => {
      showOnce()
    }, Math.random() * 40000 + 40000) // 40-80s

    return () => {
      clearTimeout(initial)
      clearInterval(interval)
    }
  }, [onNewIssue])

  return (
    <>
      {visible && (
        <div className="fixed top-40 right-6 z-40 animate-in slide-in-from-right-full duration-500">
          <Card className="bg-background/90 backdrop-blur-sm border-border/60 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`inline-flex items-center gap-2 px-2 py-1 rounded ${source.color}`}>
                  <img src={source.icon} alt={source.label} className="w-4 h-4 rounded-sm" />
                  <span className="text-xs">{source.label}</span>
                </div>
                <span className="text-sm text-foreground">{message}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

export default SocialReportNotifications


