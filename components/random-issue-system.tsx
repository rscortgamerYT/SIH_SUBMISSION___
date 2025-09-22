"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface RandomIssue {
  id: string
  title: string
  location: string
  severity: "low" | "medium" | "high"
  category: string
  timestamp: Date
}

const preloadedIssues: Omit<RandomIssue, "id" | "timestamp">[] = [
  { title: "Pothole on Main Street", location: "Ranchi Central", severity: "high", category: "Roads" },
  { title: "Street Light Not Working", location: "Dhanbad Sector 5", severity: "medium", category: "Lighting" },
  { title: "Garbage Overflow", location: "Jamshedpur Market", severity: "high", category: "Waste" },
  { title: "Water Leakage", location: "Bokaro Steel City", severity: "medium", category: "Water" },
  { title: "Broken Footpath", location: "Ranchi University Area", severity: "low", category: "Infrastructure" },
  { title: "Traffic Signal Malfunction", location: "Dhanbad Railway Station", severity: "high", category: "Traffic" },
  { title: "Park Maintenance Needed", location: "Jamshedpur Jubilee Park", severity: "low", category: "Parks" },
  { title: "Drainage Blockage", location: "Hazaribagh Main Road", severity: "medium", category: "Drainage" },
  { title: "Illegal Parking", location: "Deoghar Temple Area", severity: "medium", category: "Traffic" },
  { title: "Power Outage", location: "Giridih Industrial Area", severity: "high", category: "Electricity" },
]

interface RandomIssueSystemProps {
  onIssuePopup?: (issue: RandomIssue) => void
}

export function RandomIssueSystem({ onIssuePopup }: RandomIssueSystemProps) {
  const [showNotification, setShowNotification] = useState(false)
  const [currentIssue, setCurrentIssue] = useState<RandomIssue | null>(null)

  useEffect(() => {
    const generateRandomIssue = () => {
      const randomTemplate = preloadedIssues[Math.floor(Math.random() * preloadedIssues.length)]
      const newIssue: RandomIssue = {
        ...randomTemplate,
        id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
      }

      setCurrentIssue(newIssue)
      setShowNotification(true)

      // Trigger red spot animation
      onIssuePopup?.(newIssue)

      console.log("[v0] New issue generated:", newIssue)

      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false)
      }, 5000)
    }

    const initialTimeout = setTimeout(generateRandomIssue, 10000)

    const interval = setInterval(
      () => {
        generateRandomIssue()
      },
      Math.random() * 45000 + 45000, // 45-90 seconds
    )

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [onIssuePopup])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-400 bg-red-400/10 text-red-400"
      case "medium":
        return "border-yellow-400 bg-yellow-400/10 text-yellow-400"
      case "low":
        return "border-green-400 bg-green-400/10 text-green-400"
      default:
        return "border-gray-400 bg-gray-400/10 text-gray-400"
    }
  }

  return (
    <>
      {/* Floating notification for new issues */}
      {showNotification && currentIssue && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right-full duration-500">
          <Card className="border-red-400/50 bg-red-950/90 backdrop-blur-sm shadow-lg shadow-red-400/25 max-w-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse mt-1"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={getSeverityColor(currentIssue.severity)}>
                      {currentIssue.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{currentIssue.category}</span>
                  </div>
                  <h4 className="font-medium text-sm text-red-400 mb-1">🚨 New Issue Reported</h4>
                  <p className="text-sm text-foreground mb-1">{currentIssue.title}</p>
                  <p className="text-xs text-muted-foreground">{currentIssue.location}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-3 border-red-400/50 text-red-400 hover:bg-red-400/10 bg-transparent"
                onClick={() => setShowNotification(false)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
