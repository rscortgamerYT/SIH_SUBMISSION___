"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, CheckCircle, TrendingUp, Award, Clock, Brain } from "lucide-react"
import { AISuggestions } from "@/components/ai-suggestions"

interface StatCardProps {
  icon: React.ReactNode
  value: number
  label: string
  trend?: string
}

function StatCard({ icon, value, label, trend }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0
      const increment = value / 50
      const counter = setInterval(() => {
        current += increment
        if (current >= value) {
          setDisplayValue(value)
          clearInterval(counter)
        } else {
          setDisplayValue(Math.floor(current))
        }
      }, 30)
      return () => clearInterval(counter)
    }, 500)

    return () => clearTimeout(timer)
  }, [value])

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-2xl font-bold text-primary">{displayValue.toLocaleString()}</div>
          <div className="text-sm text-card-foreground">{label}</div>
          {trend && (
            <Badge variant="secondary" className="mt-1 text-xs">
              {trend}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  )
}

interface RecentActivityProps {
  activities: Array<{
    id: string
    type: "report" | "resolved" | "vote"
    location: string
    time: string
    description: string
  }>
}

function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
      <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        Live Activity Feed
      </h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors duration-200"
          >
            <div
              className={`w-2 h-2 rounded-full mt-2 ${
                activity.type === "report"
                  ? "bg-yellow-500"
                  : activity.type === "resolved"
                    ? "bg-primary"
                    : "bg-blue-500"
              }`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-card-foreground">{activity.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{activity.location}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function HeroSection({ onStartReporting, onViewMap }: { onStartReporting: () => void; onViewMap: () => void }) {
  const [currentSlogan, setCurrentSlogan] = useState(0)
  const slogans = [
    "Empowering Voices, Building Better Jharkhand",
    "Your Voice, Your City, Your TownShip",
    "Together We Transform Communities",
  ]

  const recentActivities = [
    {
      id: "1",
      type: "report" as const,
      location: "Main Street, Ranchi",
      time: "2 min ago",
      description: "New pothole reported causing traffic delays",
    },
    {
      id: "2",
      type: "resolved" as const,
      location: "Park Avenue, Dhanbad",
      time: "5 min ago",
      description: "Street light repair completed successfully",
    },
    {
      id: "3",
      type: "vote" as const,
      location: "Sector 5, Jamshedpur",
      time: "8 min ago",
      description: "Community voted on water supply priority",
    },
    {
      id: "4",
      type: "report" as const,
      location: "Market Square, Bokaro",
      time: "12 min ago",
      description: "Garbage overflow reported by residents",
    },
    {
      id: "5",
      type: "resolved" as const,
      location: "Civil Lines, Ranchi",
      time: "15 min ago",
      description: "Traffic signal timing optimized",
    },
    {
      id: "6",
      type: "vote" as const,
      location: "Station Road, Dhanbad",
      time: "18 min ago",
      description: "Master Vote approved for road repair",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [slogans.length])

  return (
    <div className="space-y-12">
      {/* Hero Content */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
            <span className="block text-foreground">Welcome to</span>
            <span className="block text-primary">TownShip</span>
          </h1>
          <div className="h-16 flex items-center justify-center">
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty transition-all duration-500">
              {slogans[currentSlogan]}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={() => {
              onStartReporting()
              console.log("[v0] Start reporting button clicked")
            }}
          >
            Start Reporting Now
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-border/50 text-foreground hover:bg-muted/50 px-8 py-4 text-lg bg-transparent backdrop-blur-sm hover:scale-105 transition-all duration-200"
            onClick={() => {
              onViewMap()
              console.log("[v0] View live map button clicked")
            }}
          >
            View Live Map
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<MapPin className="h-6 w-6 text-primary" />}
          value={2847}
          label="Total Reports"
          trend="+18% this week"
        />
        <StatCard
          icon={<CheckCircle className="h-6 w-6 text-primary" />}
          value={2156}
          label="Issues Resolved"
          trend="76% success rate"
        />
        <StatCard
          icon={<Users className="h-6 w-6 text-primary" />}
          value={8934}
          label="Active Citizens"
          trend="+12% this month"
        />
        <StatCard
          icon={<Award className="h-6 w-6 text-primary" />}
          value={342}
          label="Top Contributors"
          trend="Community leaders"
        />
      </div>

      {/* Live Activity and AI Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivity activities={recentActivities} />

        <AISuggestions compact={true} />
      </div>

      {/* Quick Actions */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 bg-transparent backdrop-blur-sm hover:scale-105 transition-all duration-200"
            onClick={() => {
              onStartReporting()
              console.log("[v0] Quick action: Report Issue clicked")
            }}
          >
            <MapPin className="h-6 w-6" />
            <span className="text-sm">Report Issue</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 bg-transparent backdrop-blur-sm hover:scale-105 transition-all duration-200"
            onClick={() => {
              onViewMap()
              console.log("[v0] Quick action: View Map clicked")
            }}
          >
            <CheckCircle className="h-6 w-6" />
            <span className="text-sm">View Map</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 bg-transparent backdrop-blur-sm hover:scale-105 transition-all duration-200"
            onClick={() => {
              console.log("[v0] Quick action: Leaderboard clicked")
            }}
          >
            <Award className="h-6 w-6" />
            <span className="text-sm">Leaderboard</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 bg-transparent backdrop-blur-sm hover:scale-105 transition-all duration-200"
            onClick={() => {
              console.log("[v0] Quick action: Analytics clicked")
            }}
          >
            <Brain className="h-6 w-6" />
            <span className="text-sm text-foreground">AI Insights</span>
          </Button>
        </div>
      </Card>

      {/* Featured Cities in Jharkhand */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Featured Cities in Jharkhand</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Ranchi", reports: 847 },
            { name: "Dhanbad", reports: 623 },
            { name: "Jamshedpur", reports: 756 },
            { name: "Bokaro", reports: 521 },
          ].map((city) => (
            <div
              key={city.name}
              className="p-4 bg-muted/20 rounded-lg text-center hover:bg-primary/10 transition-all duration-200 cursor-pointer hover:scale-105 backdrop-blur-sm"
              onClick={() => {
                onViewMap()
                console.log("[v0] Featured city clicked:", city.name)
              }}
            >
              <div className="text-lg font-semibold text-card-foreground">{city.name}</div>
              <div className="text-sm text-muted-foreground">{city.reports} active reports</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
