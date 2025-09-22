"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, MapPin } from "lucide-react"

interface AppReportAlertProps {
  report?: {
    title: string
    location?: { name: string; city: string }
  } | null
}

export function AppReportAlerts({ report }: AppReportAlertProps) {
  const [visible, setVisible] = useState(false)
  const [inject, setInject] = useState<{ title: string; location?: { name: string; city: string } } | null>(null)

  useEffect(() => {
    if (report) {
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 5000)
      return () => clearTimeout(t)
    }
  }, [report])

  // Demo pop alerts: completion and community status
  useEffect(() => {
    const handler = (e: any) => {
      const payload = e?.detail as { title: string; location?: { name: string; city: string } }
      setInject(payload)
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 5000)
      return () => clearTimeout(t)
    }
    if (typeof window !== "undefined") {
      window.addEventListener("demo-popup", handler as EventListener)
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("demo-popup", handler as EventListener)
      }
    }
  }, [])

  const active = report || inject
  if (!visible || !active) return null

  return (
    <div className="fixed top-32 right-6 z-50 animate-in slide-in-from-right-full duration-500">
      <Card className="border-red-500 ring-2 ring-red-500/60 bg-red-950/90 backdrop-blur-sm shadow-lg shadow-red-500/30 animate-pulse">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="border-red-400 text-red-400">New Report</Badge>
                {active.location && (
                  <span className="text-xs text-red-300 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {active.location.name}, {active.location.city}
                  </span>
                )}
              </div>
              <div className="text-sm text-white">{report ? "You just created a report" : "System update"}</div>
              <div className="text-sm text-red-200">{active.title}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AppReportAlerts







