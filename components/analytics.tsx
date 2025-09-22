"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Target,
  Zap,
  Brain,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AnalyticsData {
  totalReports: number
  resolvedIssues: number
  activeUsers: number
  avgResolutionTime: number
  completionRate: number
  trendingIssues: { type: string; count: number; trend: "up" | "down" }[]
  cityStats: { city: string; reports: number; resolved: number }[]
  weeklyTrends: { week: string; reports: number; resolved: number }[]
  hotspots: { location: string; issues: number; severity: "high" | "medium" | "low" }[]
}

const mockAnalytics: AnalyticsData = {
  totalReports: 1247,
  resolvedIssues: 892,
  activeUsers: 3456,
  avgResolutionTime: 12.5,
  completionRate: 71.5,
  trendingIssues: [
    { type: "Potholes", count: 234, trend: "up" },
    { type: "Street Lights", count: 189, trend: "down" },
    { type: "Water Supply", count: 156, trend: "up" },
    { type: "Waste Management", count: 143, trend: "up" },
    { type: "Traffic", count: 98, trend: "down" },
  ],
  cityStats: [
    { city: "Ranchi", reports: 456, resolved: 324 },
    { city: "Dhanbad", reports: 298, resolved: 201 },
    { city: "Jamshedpur", reports: 267, resolved: 198 },
    { city: "Bokaro", reports: 226, resolved: 169 },
  ],
  weeklyTrends: [
    { week: "Week 1", reports: 89, resolved: 67 },
    { week: "Week 2", reports: 102, resolved: 78 },
    { week: "Week 3", reports: 95, resolved: 71 },
    { week: "Week 4", reports: 118, resolved: 89 },
  ],
  hotspots: [
    { location: "Main Street, Ranchi", issues: 23, severity: "high" },
    { location: "Market Square, Dhanbad", issues: 18, severity: "medium" },
    { location: "Park Avenue, Jamshedpur", issues: 15, severity: "high" },
    { location: "Sector 5, Bokaro", issues: 12, severity: "medium" },
  ],
}

const aiInsights = [
  {
    title: "Peak Reporting Hours",
    insight: "Most reports are submitted between 8-10 AM and 6-8 PM, suggesting commute-related issues.",
    action: "Deploy rapid response teams during these hours for faster resolution.",
  },
  {
    title: "Seasonal Patterns",
    insight: "Pothole reports increase by 340% during monsoon season (June-September).",
    action: "Pre-monsoon road maintenance could reduce emergency repairs by 60%.",
  },
  {
    title: "Community Engagement",
    insight: "Issues with 5+ community votes are resolved 2.3x faster than others.",
    action: "Implement gamified voting system to increase community participation.",
  },
  {
    title: "Resolution Efficiency",
    insight: "Master Vote approval reduces average resolution time from 18 to 8 days.",
    action: "Expand Master Vote program to cover more issue categories.",
  },
]

export function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedCity, setSelectedCity] = useState("all")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Insights and trends for civic engagement</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              <SelectItem value="ranchi">Ranchi</SelectItem>
              <SelectItem value="dhanbad">Dhanbad</SelectItem>
              <SelectItem value="jamshedpur">Jamshedpur</SelectItem>
              <SelectItem value="bokaro">Bokaro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Reports</p>
              <p className="text-3xl font-bold text-primary">{mockAnalytics.totalReports.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-sm text-green-500">
                <TrendingUp className="h-4 w-4" />
                <span>+12% from last month</span>
              </div>
            </div>
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Resolved Issues</p>
              <p className="text-3xl font-bold text-primary">{mockAnalytics.resolvedIssues.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-sm text-green-500">
                <TrendingUp className="h-4 w-4" />
                <span>+8% from last month</span>
              </div>
            </div>
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-3xl font-bold text-primary">{mockAnalytics.activeUsers.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-sm text-green-500">
                <TrendingUp className="h-4 w-4" />
                <span>+15% from last month</span>
              </div>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-3xl font-bold text-primary">{mockAnalytics.completionRate}%</p>
              <div className="flex items-center gap-1 text-sm text-green-500">
                <TrendingUp className="h-4 w-4" />
                <span>+3% from last month</span>
              </div>
            </div>
            <Target className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Trending Issues */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-xl font-semibold text-card-foreground mb-4">Trending Issue Types</h3>
        <div className="space-y-4">
          {mockAnalytics.trendingIssues.map((issue, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
                <div>
                  <p className="font-medium text-card-foreground">{issue.type}</p>
                  <p className="text-sm text-muted-foreground">{issue.count} reports</p>
                </div>
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 text-sm",
                  issue.trend === "up" ? "text-red-500" : "text-green-500",
                )}
              >
                {issue.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{issue.trend === "up" ? "Rising" : "Declining"}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* City Performance */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-xl font-semibold text-card-foreground mb-4">City Performance</h3>
        <div className="space-y-4">
          {mockAnalytics.cityStats.map((city, index) => {
            const resolutionRate = (city.resolved / city.reports) * 100
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-card-foreground">{city.city}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {city.resolved}/{city.reports} resolved ({resolutionRate.toFixed(1)}%)
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${resolutionRate}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* AI Insights */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold text-card-foreground">AI-Powered Insights</h3>
          <Badge className="bg-primary text-primary-foreground">
            <Zap className="h-3 w-3 mr-1" />
            Auto-Generated
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiInsights.map((insight, index) => (
            <div key={index} className="p-4 bg-muted/20 rounded-lg space-y-2">
              <h4 className="font-medium text-card-foreground">{insight.title}</h4>
              <p className="text-sm text-muted-foreground">{insight.insight}</p>
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-primary mt-0.5" />
                <p className="text-sm text-primary font-medium">{insight.action}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Hotspots */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-xl font-semibold text-card-foreground mb-4">Issue Hotspots</h3>
        <div className="space-y-3">
          {mockAnalytics.hotspots.map((hotspot, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle
                  className={cn(
                    "h-5 w-5",
                    hotspot.severity === "high"
                      ? "text-red-500"
                      : hotspot.severity === "medium"
                        ? "text-yellow-500"
                        : "text-blue-500",
                  )}
                />
                <div>
                  <p className="font-medium text-card-foreground">{hotspot.location}</p>
                  <p className="text-sm text-muted-foreground">{hotspot.issues} active issues</p>
                </div>
              </div>
              <Badge
                className={cn(
                  "text-white",
                  hotspot.severity === "high"
                    ? "bg-red-500"
                    : hotspot.severity === "medium"
                      ? "bg-yellow-500"
                      : "bg-blue-500",
                )}
              >
                {hotspot.severity} priority
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
