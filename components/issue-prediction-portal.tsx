"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PredictedIssue {
  id: string
  title: string
  location: string
  district: string
  probability: number
  timeframe: string
  category: string
  severity: "low" | "medium" | "high"
  reasoning: string
  preventiveActions: string[]
}

const preloadedPredictions: Omit<PredictedIssue, "id">[] = [
  {
    title: "Waterlogging Risk",
    location: "Ranchi East",
    district: "Ranchi",
    probability: 85,
    timeframe: "Next 3-5 days",
    category: "Drainage",
    severity: "high",
    reasoning: "Heavy rainfall predicted + historical drainage issues in monsoon",
    preventiveActions: ["Clear drainage systems", "Deploy pumps", "Issue public advisory"],
  },
  {
    title: "Traffic Congestion Spike",
    location: "Dhanbad Railway Station",
    district: "Dhanbad",
    probability: 78,
    timeframe: "Weekend (Sat-Sun)",
    category: "Traffic",
    severity: "medium",
    reasoning: "Festival season + increased train arrivals pattern analysis",
    preventiveActions: ["Deploy traffic police", "Set up alternate routes", "Public transport alerts"],
  },
  {
    title: "Power Grid Overload",
    location: "Jamshedpur Industrial Area",
    district: "East Singhbhum",
    probability: 72,
    timeframe: "Next week",
    category: "Electricity",
    severity: "high",
    reasoning: "Summer peak demand + aging infrastructure in sector 3-5",
    preventiveActions: ["Load balancing", "Backup generator setup", "Maintenance scheduling"],
  },
  {
    title: "Waste Overflow",
    location: "Bokaro Market Complex",
    district: "Bokaro",
    probability: 68,
    timeframe: "Next 2-3 days",
    category: "Waste Management",
    severity: "medium",
    reasoning: "Festival waste accumulation + delayed collection schedule",
    preventiveActions: ["Extra collection rounds", "Temporary bins", "Vendor coordination"],
  },
  {
    title: "Water Supply Shortage",
    location: "Hazaribagh Hills",
    district: "Hazaribagh",
    probability: 82,
    timeframe: "Next 7-10 days",
    category: "Water Supply",
    severity: "high",
    reasoning: "Reservoir levels dropping + increased summer consumption",
    preventiveActions: ["Water rationing", "Tanker deployment", "Conservation campaign"],
  },
  {
    title: "Road Surface Damage",
    location: "Deoghar Temple Route",
    district: "Deoghar",
    probability: 75,
    timeframe: "Next 5-7 days",
    category: "Infrastructure",
    severity: "medium",
    reasoning: "Heavy vehicle traffic during pilgrimage season + recent rains",
    preventiveActions: ["Traffic diversion", "Road inspection", "Repair crew standby"],
  },
]

export function IssuePredictionPortal() {
  const [predictions, setPredictions] = useState<PredictedIssue[]>([])
  const [selectedPrediction, setSelectedPrediction] = useState<PredictedIssue | null>(null)
  const [mapView, setMapView] = useState(false)
  const [activeSection, setActiveSection] = useState<"predictions" | "routes" | "satisfaction">("predictions")

  useEffect(() => {
    // Load initial predictions
    const initialPredictions = preloadedPredictions.map((pred, index) => ({
      ...pred,
      id: `pred-${Date.now()}-${index}`,
    }))
    setPredictions(initialPredictions)

    // Update predictions every 30 seconds with slight probability changes
    const interval = setInterval(() => {
      setPredictions((prev) =>
        prev.map((pred) => ({
          ...pred,
          probability: Math.max(50, Math.min(95, pred.probability + (Math.random() - 0.5) * 5)),
        })),
      )
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const routesToAvoid = [
    {
      route: "Main Street - Market Square",
      reason: "Pothole repairs in progress",
      duration: "2-3 days",
      severity: "high" as const,
    },
    {
      route: "Railway Station Road",
      reason: "Traffic signal maintenance",
      duration: "Today 2-6 PM",
      severity: "medium" as const,
    },
    {
      route: "Industrial Area Gate 3",
      reason: "Waterlogging expected",
      duration: "Next 48 hours",
      severity: "high" as const,
    },
    { route: "University Campus Road", reason: "Construction work", duration: "This week", severity: "low" as const },
  ]

  const recurringIssues = [
    {
      issue: "Waterlogging",
      locations: ["Ranchi East", "Dhanbad Sector 5"],
      frequency: "Every monsoon",
      trend: "increasing" as const,
    },
    {
      issue: "Power Outages",
      locations: ["Jamshedpur Industrial", "Bokaro Steel City"],
      frequency: "Summer peaks",
      trend: "stable" as const,
    },
    {
      issue: "Traffic Congestion",
      locations: ["Railway Stations", "Market Areas"],
      frequency: "Weekends & Festivals",
      trend: "increasing" as const,
    },
    {
      issue: "Waste Overflow",
      locations: ["Market Complexes", "Residential Areas"],
      frequency: "Festival seasons",
      trend: "decreasing" as const,
    },
  ]

  const areaSatisfaction = [
    { area: "Jamshedpur Jubilee Park", district: "East Singhbhum", satisfaction: 92, category: "Parks & Recreation" },
    { area: "Ranchi Smart City Center", district: "Ranchi", satisfaction: 88, category: "Infrastructure" },
    { area: "Dhanbad Railway Station", district: "Dhanbad", satisfaction: 85, category: "Transportation" },
    { area: "Bokaro Steel Plant Area", district: "Bokaro", satisfaction: 82, category: "Industrial" },
    { area: "Hazaribagh Lake Area", district: "Hazaribagh", satisfaction: 90, category: "Environment" },
  ]

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

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return "text-red-400"
    if (probability >= 65) return "text-yellow-400"
    return "text-green-400"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            🔮 Issue Prediction Portal
          </h1>
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-cyan-400/20 blur-lg rounded-lg"></div>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          AI-powered predictive analytics for proactive civic governance. Anticipate problems before they occur.
        </p>

        <div className="flex justify-center gap-2 flex-wrap">
          <Button
            variant={activeSection === "predictions" ? "default" : "outline"}
            onClick={() => setActiveSection("predictions")}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            🔮 Predictions
          </Button>
          <Button
            variant={activeSection === "routes" ? "default" : "outline"}
            onClick={() => setActiveSection("routes")}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
          >
            🚧 Routes & Issues
          </Button>
          <Button
            variant={activeSection === "satisfaction" ? "default" : "outline"}
            onClick={() => setActiveSection("satisfaction")}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            😊 Satisfaction
          </Button>
        </div>
      </div>

      {activeSection === "predictions" && (
        <>
          <div className="flex justify-center gap-4">
            <Button
              variant={mapView ? "outline" : "default"}
              onClick={() => setMapView(false)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              📊 List View
            </Button>
            <Button
              variant={mapView ? "default" : "outline"}
              onClick={() => setMapView(true)}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
            >
              🗺️ Map View
            </Button>
          </div>

          {mapView ? (
            <Card className="border-cyan-400/20 bg-gradient-to-br from-slate-900/50 to-blue-900/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400">🗺️ Predictive Risk Map - Jharkhand</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-96 bg-slate-800/50 rounded-lg overflow-hidden">
                  {/* Simulated map background */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-slate-900"></div>
                    {/* Grid overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `
                        linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                      `,
                        backgroundSize: "20px 20px",
                      }}
                    ></div>
                  </div>

                  {/* Glowing prediction markers */}
                  {predictions.map((pred, index) => (
                    <div
                      key={pred.id}
                      className={cn(
                        "absolute w-4 h-4 rounded-full cursor-pointer transition-all duration-300 hover:scale-150",
                        pred.severity === "high"
                          ? "bg-red-400 shadow-lg shadow-red-400/50 animate-pulse"
                          : pred.severity === "medium"
                            ? "bg-yellow-400 shadow-lg shadow-yellow-400/50 animate-pulse"
                            : "bg-green-400 shadow-lg shadow-green-400/50 animate-pulse",
                      )}
                      style={{
                        left: `${20 + ((index * 15) % 60)}%`,
                        top: `${20 + ((index * 12) % 60)}%`,
                      }}
                      onClick={() => setSelectedPrediction(pred)}
                    >
                      <div
                        className={cn(
                          "absolute inset-0 rounded-full animate-ping",
                          pred.severity === "high"
                            ? "bg-red-400"
                            : pred.severity === "medium"
                              ? "bg-yellow-400"
                              : "bg-green-400",
                        )}
                      ></div>
                    </div>
                  ))}

                  {/* District labels */}
                  <div className="absolute top-4 left-4 text-xs text-cyan-400 font-medium">Ranchi</div>
                  <div className="absolute top-12 right-8 text-xs text-cyan-400 font-medium">Dhanbad</div>
                  <div className="absolute bottom-16 left-8 text-xs text-cyan-400 font-medium">Jamshedpur</div>
                  <div className="absolute bottom-8 right-12 text-xs text-cyan-400 font-medium">Bokaro</div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-cyan-400 font-medium">
                    Hazaribagh
                  </div>
                </div>

                {selectedPrediction && (
                  <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-cyan-400/20">
                    <h4 className="font-semibold text-cyan-400 mb-2">{selectedPrediction.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {selectedPrediction.location}, {selectedPrediction.district}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={getSeverityColor(selectedPrediction.severity)}>
                        {selectedPrediction.severity.toUpperCase()}
                      </Badge>
                      <span className={cn("font-bold", getProbabilityColor(selectedPrediction.probability))}>
                        {selectedPrediction.probability}% probability
                      </span>
                    </div>
                    <p className="text-sm mb-2">{selectedPrediction.reasoning}</p>
                    <div className="text-xs text-muted-foreground">Expected: {selectedPrediction.timeframe}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {predictions.map((prediction) => (
                <Card
                  key={prediction.id}
                  className="border-purple-400/20 bg-gradient-to-br from-slate-900/50 to-purple-900/30 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300 hover:scale-105"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-purple-400">{prediction.title}</CardTitle>
                      <div className={cn("text-2xl font-bold", getProbabilityColor(prediction.probability))}>
                        {Math.round(prediction.probability)}%
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getSeverityColor(prediction.severity)}>
                        {prediction.severity.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{prediction.category}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium text-sm">{prediction.location}</p>
                      <p className="text-xs text-muted-foreground">{prediction.district} District</p>
                    </div>

                    <div className="bg-slate-800/50 p-3 rounded-lg">
                      <p className="text-sm text-cyan-400 mb-1">🧠 AI Analysis:</p>
                      <p className="text-xs text-muted-foreground">{prediction.reasoning}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-yellow-400 mb-1">⏰ Timeline: {prediction.timeframe}</p>
                    </div>

                    <div className="bg-green-900/20 p-3 rounded-lg border border-green-400/20">
                      <p className="text-sm text-green-400 mb-2">🛡️ Preventive Actions:</p>
                      <ul className="text-xs space-y-1">
                        {prediction.preventiveActions.map((action, index) => (
                          <li key={index} className="text-muted-foreground">
                            • {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {activeSection === "routes" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Routes to Avoid */}
            <Card className="border-red-400/20 bg-gradient-to-br from-red-900/30 to-orange-900/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-red-400">🚧 Routes to Avoid</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {routesToAvoid.map((route, index) => (
                  <div key={index} className="p-3 bg-red-900/20 rounded-lg border border-red-400/20">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{route.route}</h4>
                      <Badge variant="outline" className={getSeverityColor(route.severity)}>
                        {route.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{route.reason}</p>
                    <p className="text-xs text-yellow-400">Duration: {route.duration}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recurring Issues */}
            <Card className="border-orange-400/20 bg-gradient-to-br from-orange-900/30 to-yellow-900/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-orange-400">🔄 Recurring Issues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recurringIssues.map((issue, index) => (
                  <div key={index} className="p-3 bg-orange-900/20 rounded-lg border border-orange-400/20">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{issue.issue}</h4>
                      <Badge
                        variant="outline"
                        className={cn(
                          issue.trend === "increasing"
                            ? "border-red-400 text-red-400 bg-red-400/10"
                            : issue.trend === "decreasing"
                              ? "border-green-400 text-green-400 bg-green-400/10"
                              : "border-yellow-400 text-yellow-400 bg-yellow-400/10",
                        )}
                      >
                        {issue.trend}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Locations: {issue.locations.join(", ")}</p>
                    <p className="text-xs text-cyan-400">Pattern: {issue.frequency}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeSection === "satisfaction" && (
        <div className="space-y-6">
          <Card className="border-green-400/20 bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-400">😊 Most Satisfactory Areas in Jharkhand</CardTitle>
              <p className="text-sm text-muted-foreground">Areas with highest citizen satisfaction ratings</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {areaSatisfaction.map((area, index) => (
                  <div key={index} className="p-4 bg-green-900/20 rounded-lg border border-green-400/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-3xl font-bold text-green-400">{area.satisfaction}%</div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{area.area}</div>
                        <div className="text-xs text-muted-foreground">{area.district}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-green-400/50 text-green-400 bg-green-400/10 text-xs">
                      {area.category}
                    </Badge>
                    <div className="mt-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${area.satisfaction}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats Footer */}
      <Card className="border-emerald-400/20 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-400">{predictions.length}</div>
              <div className="text-sm text-muted-foreground">Active Predictions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {predictions.filter((p) => p.probability >= 75).length}
              </div>
              <div className="text-sm text-muted-foreground">High Risk</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">6</div>
              <div className="text-sm text-muted-foreground">Districts Covered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">94%</div>
              <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
