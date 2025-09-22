"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Lightbulb, TrendingUp, AlertTriangle, CheckCircle, X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface AISuggestion {
  id: string
  type: "optimization" | "prediction" | "recommendation" | "alert"
  title: string
  description: string
  confidence: number
  priority: "high" | "medium" | "low"
  category: string
  actionable: boolean
  estimatedImpact: string
}

const mockSuggestions: AISuggestion[] = [
  {
    id: "1",
    type: "prediction",
    title: "Pothole Formation Risk Alert",
    description:
      "Based on weather patterns and traffic data, there's a 78% chance of new potholes forming on Ring Road within the next 2 weeks.",
    confidence: 78,
    priority: "high",
    category: "Infrastructure",
    actionable: true,
    estimatedImpact: "Prevent 3-5 new reports",
  },
  {
    id: "2",
    type: "optimization",
    title: "Resource Allocation Optimization",
    description: "Reallocating 2 maintenance teams to Sector 7 could reduce average issue resolution time by 23%.",
    confidence: 85,
    priority: "medium",
    category: "Operations",
    actionable: true,
    estimatedImpact: "23% faster resolution",
  },
  {
    id: "3",
    type: "recommendation",
    title: "Community Engagement Strategy",
    description:
      "Implementing evening town halls in Dhanbad could increase citizen participation by 40% based on similar initiatives.",
    confidence: 72,
    priority: "medium",
    category: "Engagement",
    actionable: true,
    estimatedImpact: "40% more participation",
  },
  {
    id: "4",
    type: "alert",
    title: "Budget Utilization Warning",
    description:
      "Current spending rate suggests 15% budget surplus in Q4. Consider accelerating infrastructure projects.",
    confidence: 91,
    priority: "low",
    category: "Finance",
    actionable: true,
    estimatedImpact: "Optimize ₹2.3L budget",
  },
]

export function AISuggestions({ compact = false }: { compact?: boolean }) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>(mockSuggestions)
  const [dismissed, setDismissed] = useState<string[]>([])

  const dismissSuggestion = (id: string) => {
    setDismissed((prev) => [...prev, id])
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "prediction":
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      case "optimization":
        return <Sparkles className="h-4 w-4 text-purple-500" />
      case "recommendation":
        return <Lightbulb className="h-4 w-4 text-yellow-500" />
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Brain className="h-4 w-4 text-gray-500" />
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

  const visibleSuggestions = suggestions.filter((s) => !dismissed.includes(s.id))

  if (compact) {
    return (
      <Card className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="h-5 w-5 text-purple-500" />
          <h3 className="font-semibold text-foreground">AI Insights</h3>
        </div>
        <div className="space-y-2">
          {visibleSuggestions.slice(0, 2).map((suggestion) => (
            <div key={suggestion.id} className="flex items-start gap-2 text-sm">
              {getTypeIcon(suggestion.type)}
              <div className="flex-1">
                <p className="text-foreground font-medium">{suggestion.title}</p>
                <p className="text-muted-foreground text-xs">{suggestion.estimatedImpact}</p>
              </div>
              <Badge className={cn("text-white text-xs", getPriorityColor(suggestion.priority))}>
                {suggestion.confidence}%
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Brain className="h-6 w-6 text-purple-500" />
        <h3 className="text-xl font-bold text-foreground">AI Suggestions</h3>
        <Badge variant="secondary" className="bg-purple-500/20 text-purple-700">
          {visibleSuggestions.length} active
        </Badge>
      </div>

      <div className="grid gap-4">
        {visibleSuggestions.map((suggestion) => (
          <Card key={suggestion.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                {getTypeIcon(suggestion.type)}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{suggestion.title}</h4>
                    <Badge className={cn("text-white text-xs", getPriorityColor(suggestion.priority))}>
                      {suggestion.priority}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{suggestion.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Confidence: {suggestion.confidence}%</span>
                    <span>•</span>
                    <span>Impact: {suggestion.estimatedImpact}</span>
                    <span>•</span>
                    <span>{suggestion.category}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {suggestion.actionable && (
                  <Button size="sm" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Act
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => dismissSuggestion(suggestion.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
