"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  MapPin,
  Users,
  Camera,
  ThumbsUp,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Eye,
  Share2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Report {
  id: string
  title: string
  description: string
  type: "pothole" | "streetlight" | "water" | "waste" | "traffic" | "park" | "other"
  location: {
    name: string
    city: string
  }
  status: "open" | "voting" | "completed"
  priority: "low" | "medium" | "high"
  submittedBy: {
    name: string
    avatar: string
  }
  submittedAt: Date
  votes: number
  comments: number
  images: number
  masterVoteStatus: "pending" | "approved" | "rejected"
  completionRate: number
  views: number
  initiator?: string
}

const mockReports: Report[] = [
  {
    id: "1",
    title: "Large pothole causing traffic disruption on Main Street",
    description:
      "A deep pothole has formed on Main Street near the market area. It's causing significant traffic delays and poses a risk to vehicles. Multiple cars have already suffered tire damage.",
    type: "pothole",
    location: { name: "Main Street", city: "Ranchi" },
    status: "voting",
    priority: "high",
    submittedBy: { name: "Priya Sharma", avatar: "/indian-woman-avatar.png" },
    submittedAt: new Date(2024, 0, 15),
    votes: 45,
    comments: 12,
    images: 4,
    masterVoteStatus: "approved",
    completionRate: 78,
    views: 234,
  },
  {
    id: "2",
    title: "Street light not working for over a week",
    description:
      "The street light on Park Avenue has been out for more than a week, making the area unsafe for pedestrians during evening hours.",
    type: "streetlight",
    location: { name: "Park Avenue", city: "Dhanbad" },
    status: "open",
    priority: "medium",
    submittedBy: { name: "Rajesh Kumar", avatar: "/indian-man-avatar.png" },
    submittedAt: new Date(2024, 0, 14),
    votes: 49,
    comments: 8,
    images: 2,
    masterVoteStatus: "pending",
    completionRate: 45,
    views: 156,
  },
  {
    id: "3",
    title: "Water supply disruption in residential area",
    description:
      "Residents of Sector 5 have been without water supply for 3 consecutive days. The issue appears to be with the main pipeline.",
    type: "water",
    location: { name: "Sector 5", city: "Jamshedpur" },
    status: "completed",
    priority: "high",
    submittedBy: { name: "Anita Devi", avatar: "/indian-woman-avatar.png" },
    submittedAt: new Date(2024, 0, 12),
    votes: 67,
    comments: 23,
    images: 3,
    masterVoteStatus: "approved",
    completionRate: 95,
    views: 445,
  },
  {
    id: "4",
    title: "Overflowing garbage bins at Market Square",
    description:
      "The garbage bins at Market Square have been overflowing for several days, creating unhygienic conditions and attracting stray animals.",
    type: "waste",
    location: { name: "Market Square", city: "Bokaro" },
    status: "voting",
    priority: "medium",
    submittedBy: { name: "Vikram Singh", avatar: "/indian-man-avatar-glasses.jpg" },
    submittedAt: new Date(2024, 0, 13),
    votes: 47,
    comments: 15,
    images: 3,
    masterVoteStatus: "pending",
    completionRate: 60,
    views: 189,
  },
  {
    id: "5",
    title: "Traffic signal malfunction causing congestion",
    description:
      "The traffic signal at the main intersection has been malfunctioning, causing severe traffic congestion during peak hours.",
    type: "traffic",
    location: { name: "Central Square", city: "Ranchi" },
    status: "open",
    priority: "high",
    submittedBy: { name: "Sunita Rai", avatar: "/indian-woman-avatar.png" },
    submittedAt: new Date(2024, 0, 16),
    votes: 52,
    comments: 18,
    images: 2,
    masterVoteStatus: "approved",
    completionRate: 35,
    views: 312,
  },
  {
    id: "6",
    title: "Playground slide broken and unsafe",
    description: "Slide in Ward 11 park has broken steps; kids at risk.",
    type: "park",
    location: { name: "Ward 11 Park", city: "Dhanbad" },
    status: "voting",
    priority: "medium",
    submittedBy: { name: "Kiran Patel", avatar: "/indian-woman-avatar.png" },
    submittedAt: new Date(2024, 0, 16),
    votes: 50,
    comments: 5,
    images: 2,
    masterVoteStatus: "approved",
    completionRate: 40,
    views: 120,
  },
  {
    id: "7",
    title: "Drain blockage near Sector 7 market",
    description: "Frequent waterlogging; needs de-silting.",
    type: "water",
    location: { name: "Sector 7", city: "Jamshedpur" },
    status: "voting",
    priority: "high",
    submittedBy: { name: "Arun Kumar", avatar: "/indian-man-avatar.png" },
    submittedAt: new Date(2024, 0, 17),
    votes: 55,
    comments: 7,
    images: 1,
    masterVoteStatus: "pending",
    completionRate: 50,
    views: 98,
  },
]

export function ExistingReports() {
  const [reports, setReports] = useState<Report[]>(mockReports)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCity, setSelectedCity] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  const issueTypes = [
    { value: "all", label: "All Types" },
    { value: "pothole", label: "Potholes" },
    { value: "streetlight", label: "Street Lights" },
    { value: "water", label: "Water Supply" },
    { value: "waste", label: "Waste Management" },
    { value: "traffic", label: "Traffic" },
    { value: "park", label: "Parks" },
    { value: "other", label: "Other" },
  ]

  const cities = ["all", "Ranchi", "Dhanbad", "Jamshedpur", "Bokaro"]

  const filteredReports = reports
    .filter((report) => {
      if (
        searchQuery &&
        !report.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !report.location.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }
      if (selectedType !== "all" && report.type !== selectedType) return false
      if (selectedStatus !== "all" && report.status !== selectedStatus) return false
      if (selectedCity !== "all" && report.location.city !== selectedCity) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === "recent") return b.submittedAt.getTime() - a.submittedAt.getTime()
      if (sortBy === "votes") return b.votes - a.votes
      if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return 0
    })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "voting":
        return <Users className="h-4 w-4 text-yellow-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-primary" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const threshold = 50
  const pending = filteredReports.filter((r) => r.votes < threshold)
  const community = filteredReports.filter((r) => r.votes >= threshold)

  const handleVote = (report: Report) => {
    const updated = reports.map((r) => (r.id === report.id ? { ...r, votes: r.votes + 1 } : r))
    setReports(updated)
    const wasBelow = report.votes < threshold && report.votes + 1 >= threshold
    if (wasBelow && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("community-report-reached", { detail: report }))
    }
  }

  const markConcluded = (report: Report) => {
    setReports((prev) => prev.map((r) => (r.id === report.id ? { ...r, status: "completed" } : r)))
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("report-concluded", { detail: report }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Community Reports</h2>
          <p className="text-muted-foreground">Browse and engage with civic issues reported by the community</p>
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => {
            if (typeof window !== "undefined") {
              // send the user to submit section via custom event
              window.dispatchEvent(new CustomEvent("navigate", { detail: { section: "submit-report" } }))
            }
          }}
        >
          Submit New Report
        </Button>
      </div>

      {/* Pending snapshot */}
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4 text-yellow-500" />
          <div className="font-semibold text-card-foreground">Pending Reports (nearing 50 upvotes)</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pending.slice(0, 4).map((report) => (
            <Card key={report.id} className="p-3 bg-muted/20 border-border">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-medium text-card-foreground">{report.title}</div>
                  <div className="text-xs text-muted-foreground">{report.location.city} • {report.votes}/50</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleVote(report)}>
                  <ThumbsUp className="h-4 w-4 mr-1" /> Upvote
                </Button>
              </div>
            </Card>
          ))}
          {pending.length === 0 && <div className="text-sm text-muted-foreground">No pending reports</div>}
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4 bg-card border-border">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-input border-border"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {issueTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="voting">Voting</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city === "all" ? "All Cities" : city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="votes">Most Voted</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Reports List */}
      <div className="space-y-6">
        {/* Community Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-semibold text-card-foreground">Community Reports (50+ upvotes)</div>
          </div>
          <div className="space-y-4">
            {community.map((report) => (
              <Card key={report.id} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={report.submittedBy.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {report.submittedBy.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-card-foreground">{report.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{report.submittedBy.name}</span>
                          <span>•</span>
                          <span>{report.submittedAt.toLocaleDateString()}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {report.location.name}, {report.location.city}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-white", getStatusColor(report.status))}>
                        {getStatusIcon(report.status)}
                        <span className="ml-1 capitalize">{report.status}</span>
                      </Badge>
                      <Badge className={cn("text-white", getPriorityColor(report.priority))}>
                        {report.priority} priority
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-card-foreground">{report.description}</p>

                  {/* Stats and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{report.votes} votes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{report.comments} comments</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Camera className="h-4 w-4" />
                        <span>{report.images} photos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{report.views} views</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => markConcluded(report)}>
                        <CheckCircle className="h-4 w-4 mr-2" /> Mark Concluded
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* All Reports (including pending) */}
        <div>
          <div className="text-lg font-semibold text-card-foreground mb-2">All Reports</div>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={report.submittedBy.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {report.submittedBy.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-card-foreground">{report.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{report.submittedBy.name}</span>
                          <span>•</span>
                          <span>{report.submittedAt.toLocaleDateString()}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {report.location.name}, {report.location.city}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-white", getStatusColor(report.status))}>
                        {getStatusIcon(report.status)}
                        <span className="ml-1 capitalize">{report.status}</span>
                      </Badge>
                      <Badge className={cn("text-white", getPriorityColor(report.priority))}>
                        {report.priority} priority
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-card-foreground">{report.description}</p>

                  {/* Stats and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{report.votes} votes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{report.comments} comments</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Camera className="h-4 w-4" />
                        <span>{report.images} photos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{report.views} views</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          const updatedReports = reports.map((r) => (r.id === report.id ? { ...r, votes: r.votes + 1 } : r))
                          setReports(updatedReports)
                          if (report.votes < threshold && report.votes + 1 >= threshold && typeof window !== "undefined") {
                            window.dispatchEvent(new CustomEvent("community-report-reached", { detail: report }))
                          }
                          console.log("[v0] Vote button clicked for report:", report.id)
                        }}
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Vote
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log("[v0] Comment button clicked for report:", report.id)
                        }}
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Comment
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          markConcluded(report)
                        }}
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Concluded
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigator.clipboard.writeText(`${window.location.origin}/report/${report.id}`)
                        }}
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {filteredReports.length === 0 && (
        <Card className="p-12 bg-card border-border text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-card-foreground mb-2">No reports found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
        </Card>
      )}
    </div>
  )
}
