"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  MapPin,
  Filter,
  Search,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Camera,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AISuggestions } from "@/components/ai-suggestions"

interface MapIssue {
  id: string
  title: string
  type: "pothole" | "streetlight" | "water" | "waste" | "traffic" | "park" | "other"
  location: {
    name: string
    city: string
    coordinates: { lat: number; lng: number }
  }
  status: "open" | "voting" | "completed"
  priority: "low" | "medium" | "high"
  votes: number
  description: string
  submittedAt: Date
  images: number
  masterVoteStatus: "pending" | "approved" | "rejected"
  completionRate: number
}

const jharkhandCities = [
  { name: "Ranchi", coordinates: { lat: 23.3441, lng: 85.3096 } },
  { name: "Dhanbad", coordinates: { lat: 23.7957, lng: 86.4304 } },
  { name: "Jamshedpur", coordinates: { lat: 22.8046, lng: 86.2029 } },
  { name: "Bokaro", coordinates: { lat: 23.6693, lng: 86.1511 } },
]

const issueTypes = [
  { value: "all", label: "All Issues", color: "bg-gray-500" },
  { value: "pothole", label: "Potholes", color: "bg-orange-500" },
  { value: "streetlight", label: "Street Lights", color: "bg-yellow-500" },
  { value: "water", label: "Water Supply", color: "bg-blue-500" },
  { value: "waste", label: "Waste Management", color: "bg-green-500" },
  { value: "traffic", label: "Traffic", color: "bg-red-500" },
  { value: "park", label: "Parks", color: "bg-emerald-500" },
  { value: "other", label: "Other", color: "bg-purple-500" },
]

const mockIssues: MapIssue[] = [
  {
    id: "1",
    title: "Large pothole on Main Street",
    type: "pothole",
    location: { name: "Main Street", city: "Ranchi", coordinates: { lat: 23.3441, lng: 85.3096 } },
    status: "voting",
    priority: "high",
    votes: 23,
    description: "Deep pothole causing traffic issues and potential vehicle damage",
    submittedAt: new Date(2024, 0, 15),
    images: 3,
    masterVoteStatus: "approved",
    completionRate: 78,
  },
  {
    id: "2",
    title: "Broken street light",
    type: "streetlight",
    location: { name: "Park Avenue", city: "Dhanbad", coordinates: { lat: 23.7957, lng: 86.4304 } },
    status: "open",
    priority: "medium",
    votes: 15,
    description: "Street light has been out for over a week",
    submittedAt: new Date(2024, 0, 12),
    images: 1,
    masterVoteStatus: "pending",
    completionRate: 45,
  },
  {
    id: "3",
    title: "Water supply disruption",
    type: "water",
    location: { name: "Sector 5", city: "Jamshedpur", coordinates: { lat: 22.8046, lng: 86.2029 } },
    status: "completed",
    priority: "high",
    votes: 45,
    description: "No water supply for 3 days in residential area",
    submittedAt: new Date(2024, 0, 10),
    images: 2,
    masterVoteStatus: "approved",
    completionRate: 95,
  },
  {
    id: "4",
    title: "Overflowing garbage bin",
    type: "waste",
    location: { name: "Market Square", city: "Bokaro", coordinates: { lat: 23.6693, lng: 86.1511 } },
    status: "voting",
    priority: "medium",
    votes: 12,
    description: "Garbage bin overflowing for several days",
    submittedAt: new Date(2024, 0, 14),
    images: 2,
    masterVoteStatus: "pending",
    completionRate: 60,
  },
]

function MapMarker({
  issue,
  onClick,
  isSelected,
}: {
  issue: MapIssue
  onClick: () => void
  isSelected: boolean
}) {
  const getMarkerColor = () => {
    switch (issue.status) {
      case "open":
        return "bg-red-500"
      case "voting":
        return "bg-yellow-500"
      case "completed":
        return "bg-primary"
      default:
        return "bg-gray-500"
    }
  }

  const getPrioritySize = () => {
    switch (issue.priority) {
      case "high":
        return "w-6 h-6"
      case "medium":
        return "w-5 h-5"
      case "low":
        return "w-4 h-4"
      default:
        return "w-5 h-5"
    }
  }

  return (
    <div
      className={cn(
        "absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200",
        getPrioritySize(),
        isSelected && "scale-125 z-10",
      )}
      style={{
        left: `${(issue.location.coordinates.lng - 85) * 20 + 50}%`,
        top: `${50 - (issue.location.coordinates.lat - 23) * 20}%`,
      }}
      onClick={onClick}
    >
      <div
        className={cn(
          "w-full h-full rounded-full border-2 border-white shadow-lg flex items-center justify-center",
          getMarkerColor(),
          isSelected && "ring-2 ring-primary ring-offset-2",
        )}
      >
        <MapPin className="w-3 h-3 text-white" />
      </div>
      {issue.votes > 0 && (
        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {issue.votes}
        </div>
      )}
    </div>
  )
}

function IssueDetailsModal({
  issue,
  isOpen,
  onClose,
}: {
  issue: MapIssue | null
  isOpen: boolean
  onClose: () => void
}) {
  if (!issue) return null

  const getStatusIcon = () => {
    switch (issue.status) {
      case "open":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "voting":
        return <Users className="h-4 w-4 text-yellow-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-primary" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-card-foreground flex items-center gap-2">
            {getStatusIcon()}
            {issue.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-card-foreground">
              {issue.location.name}, {issue.location.city}
            </span>
          </div>

          <p className="text-sm text-card-foreground">{issue.description}</p>

          <div className="flex items-center gap-4 text-sm">
            <Badge
              className={cn(
                "text-white",
                issue.priority === "high"
                  ? "bg-red-500"
                  : issue.priority === "medium"
                    ? "bg-yellow-500"
                    : "bg-blue-500",
              )}
            >
              {issue.priority} priority
            </Badge>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              {issue.votes} votes
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Camera className="h-4 w-4" />
              {issue.images} photos
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Community Support</span>
              <span className="text-card-foreground">{issue.completionRate}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${issue.completionRate}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {issue.submittedAt.toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">Master Vote: {issue.masterVoteStatus}</div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              <Users className="h-4 w-4 mr-2" />
              Vote
            </Button>
            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
              <MessageSquare className="h-4 w-4 mr-2" />
              Discuss
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function InteractiveMap() {
  const [selectedIssue, setSelectedIssue] = useState<MapIssue | null>(null)
  const [filteredIssues, setFilteredIssues] = useState<MapIssue[]>(mockIssues)
  const [selectedType, setSelectedType] = useState("all")
  const [selectedCity, setSelectedCity] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  useEffect(() => {
    let filtered = mockIssues

    if (selectedType !== "all") {
      filtered = filtered.filter((issue) => issue.type === selectedType)
    }

    if (selectedCity !== "all") {
      filtered = filtered.filter((issue) => issue.location.city === selectedCity)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          issue.location.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredIssues(filtered)
  }, [selectedType, selectedCity, searchQuery])

  const getIssueStats = () => {
    const total = filteredIssues.length
    const open = filteredIssues.filter((i) => i.status === "open").length
    const voting = filteredIssues.filter((i) => i.status === "voting").length
    const completed = filteredIssues.filter((i) => i.status === "completed").length

    return { total, open, voting, completed }
  }

  const stats = getIssueStats()

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <Card className="p-4 bg-card border-border">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search issues or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40 bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {issueTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", type.color)} />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-32 bg-input border-border">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {jharkhandCities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-3 bg-card border-border text-center">
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
          <div className="text-xs text-muted-foreground">Total Issues</div>
        </Card>
        <Card className="p-3 bg-card border-border text-center">
          <div className="text-2xl font-bold text-red-500">{stats.open}</div>
          <div className="text-xs text-muted-foreground">Open</div>
        </Card>
        <Card className="p-3 bg-card border-border text-center">
          <div className="text-2xl font-bold text-yellow-500">{stats.voting}</div>
          <div className="text-xs text-muted-foreground">Voting</div>
        </Card>
        <Card className="p-3 bg-card border-border text-center">
          <div className="text-2xl font-bold text-primary">{stats.completed}</div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </Card>
      </div>

      {/* Map and AI Suggestions Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">Jharkhand Issues Map</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowHeatmap(!showHeatmap)
                    console.log("[v0] Heatmap toggle clicked:", !showHeatmap)
                  }}
                  className={cn(showHeatmap && "bg-primary text-primary-foreground")}
                >
                  <Layers className="h-4 w-4 mr-2" />
                  Heatmap
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setZoomLevel(Math.min(zoomLevel + 0.2, 2))
                    console.log("[v0] Zoom in clicked")
                  }}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setZoomLevel(Math.max(zoomLevel - 0.2, 0.5))
                    console.log("[v0] Zoom out clicked")
                  }}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setZoomLevel(1)
                    console.log("[v0] Reset zoom clicked")
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Map Area with background image */}
            <div
              className="relative w-full h-96 bg-gradient-to-br from-muted/30 to-muted/50 rounded-lg overflow-hidden border border-border"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center" }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-60"
                style={{ backgroundImage: "url('/jharkhand-map-bg.jpg')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-blue-900/10 to-yellow-900/20">
                {/* State outline */}
                <div className="absolute inset-4 border-2 border-muted-foreground/30 rounded-lg" />

                {/* Rivers and roads */}
                <div className="absolute top-1/4 left-1/4 w-1/2 h-0.5 bg-blue-500/30 rounded-full transform rotate-12" />
                <div className="absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-muted-foreground/20 rounded-full transform -rotate-45" />

                {/* City Labels */}
                {jharkhandCities.map((city) => (
                  <div
                    key={city.name}
                    className="absolute text-xs text-foreground font-medium bg-background/80 px-2 py-1 rounded border border-border/50"
                    style={{
                      left: `${(city.coordinates.lng - 85) * 20 + 50}%`,
                      top: `${50 - (city.coordinates.lat - 23) * 20 + 3}%`,
                    }}
                  >
                    {city.name}
                  </div>
                ))}
              </div>

              {/* Heatmap Overlay */}
              {showHeatmap && (
                <div className="absolute inset-0">
                  {filteredIssues.map((issue) => (
                    <div
                      key={`heatmap-${issue.id}`}
                      className="absolute rounded-full bg-red-500/20 animate-pulse"
                      style={{
                        left: `${(issue.location.coordinates.lng - 85) * 20 + 45}%`,
                        top: `${45 - (issue.location.coordinates.lat - 23) * 20}%`,
                        width: `${issue.votes * 2 + 20}px`,
                        height: `${issue.votes * 2 + 20}px`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Issue Markers */}
              {filteredIssues.map((issue) => (
                <MapMarker
                  key={issue.id}
                  issue={issue}
                  isSelected={selectedIssue?.id === issue.id}
                  onClick={() => {
                    setSelectedIssue(issue)
                    console.log("[v0] Map marker clicked:", issue.id)
                  }}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-muted-foreground">Open Issues</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="text-muted-foreground">Under Voting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span className="text-muted-foreground">Completed</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <AISuggestions compact={false} />
        </div>
      </div>

      {/* Issue Details Modal */}
      <IssueDetailsModal issue={selectedIssue} isOpen={!!selectedIssue} onClose={() => setSelectedIssue(null)} />
    </div>
  )
}
