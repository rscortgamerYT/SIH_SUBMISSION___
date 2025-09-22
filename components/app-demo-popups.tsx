"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Plus, Users } from "lucide-react"

type Popup = {
  id: string
  type: "app" | "community" | "concluded"
  title: string
  message: string
}

export function AppDemoPopups() {
  const [queue, setQueue] = useState<Popup[]>([])
  const timerRefs = useRef<Record<string, any>>({})

  useEffect(() => {
    const pushPopup = (p: Popup) => {
      setQueue((prev) => [p, ...prev].slice(0, 3))
      // auto-dismiss after 5s
      if (timerRefs.current[p.id]) clearTimeout(timerRefs.current[p.id])
      timerRefs.current[p.id] = setTimeout(() => {
        setQueue((prev) => prev.filter((x) => x.id !== p.id))
      }, 5000)
    }

    const onApp = (e: Event) => {
      const detail = (e as CustomEvent).detail as any
      pushPopup({
        id: `app-${Date.now()}`,
        type: "app",
        title: "New App Report",
        message: detail?.title ? `${detail.title}` : "A new report was created via app",
      })
    }

    const onCommunity = (e: Event) => {
      const r = (e as CustomEvent).detail as any
      pushPopup({
        id: `comm-${Date.now()}`,
        type: "community",
        title: "Reached Community Status",
        message: r?.title ? `${r.title} crossed 50 upvotes` : "A report crossed 50 upvotes",
      })
    }

    const onConcluded = (e: Event) => {
      const r = (e as CustomEvent).detail as any
      pushPopup({
        id: `done-${Date.now()}`,
        type: "concluded",
        title: "Report Concluded",
        message: r?.title ? `${r.title} marked concluded` : "A report was concluded",
      })
    }

    if (typeof window !== "undefined") {
      window.addEventListener("app-report-created", onApp as EventListener)
      window.addEventListener("community-report-reached", onCommunity as EventListener)
      window.addEventListener("report-concluded", onConcluded as EventListener)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("app-report-created", onApp as EventListener)
        window.removeEventListener("community-report-reached", onCommunity as EventListener)
        window.removeEventListener("report-concluded", onConcluded as EventListener)
      }
      Object.values(timerRefs.current).forEach(clearTimeout)
    }
  }, [])

  const iconFor = (type: Popup["type"]) => {
    if (type === "app") return <Plus className="h-4 w-4 text-blue-500" />
    if (type === "community") return <Users className="h-4 w-4 text-emerald-500" />
    return <CheckCircle className="h-4 w-4 text-emerald-600" />
  }

  const bgFor = (type: Popup["type"]) => {
    if (type === "app") return "border-blue-400/40"
    if (type === "community") return "border-emerald-400/40"
    return "border-emerald-600/40"
  }

  return (
    <div className="fixed top-24 right-6 z-40 space-y-2">
      {queue.map((p) => (
        <div key={p.id} className="animate-in slide-in-from-right-full duration-500">
          <Card className={`bg-background/90 backdrop-blur-sm border ${bgFor(p.type)} shadow-lg`}>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                {iconFor(p.type)}
                <div>
                  <div className="text-xs font-semibold text-foreground">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.message}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}

export default AppDemoPopups


