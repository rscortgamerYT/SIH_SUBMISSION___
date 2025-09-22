"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  MapPin,
  Clock,
  Users,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Filter,
  Search,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Camera,
  Video,
  Shield,
  Zap,
  Map,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface LiveIssue {
  id: string
  title: string
  type: "pothole" | "streetlight" | "water" | "waste" | "traffic" | "park" | "other"
  location: {
    name: string
    city: string
  }
  status: "open" | "voting" | "completed"
  priority: "low" | "medium" | "high"
  votes: {
    up: number
    down: number
    userVote?: "up" | "down" | null
  }
  description: string
  submittedAt: Date
  submittedBy: string
  images: number
  video: boolean
  masterVoteStatus: "pending" | "approved" | "rejected"
  completionRate: number
  comments: number
  trending: boolean
  recentActivity: string
}

const mockLiveIssues: LiveIssue[] = [
  {
    id: "1",
    title: "Large pothole causing traffic jam",
    type: "pothole",
    location: { name: "Main Street", city: "Ranchi" },
    status: "voting",
    priority: "high",
    votes: { up: 23, down: 2, userVote: null },
    description: "Deep pothole near the market intersection causing severe traffic delays",
    submittedAt: new Date(Date.now() - 1000 * 60 * 15),
    submittedBy: "Rajesh Kumar",
    images: 3,
    video: true,
    masterVoteStatus: "approved",
    completionRate: 78,
    comments: 12,
    trending: true,
    recentActivity: "Master Vote approved 5 minutes ago",
  },
  {
    id: "2",
    title: "Street light flickering dangerously",
    type: "streetlight",
    location: { name: "Park Avenue", city: "Dhanbad" },
    status: "open",
    priority: "medium",
    votes: { up: 15, down: 1, userVote: "up" },
    description: "Street light has been flickering for days, creating safety concerns",
    submittedAt: new Date(Date.now() - 1000 * 60 * 45),
    submittedBy: "Priya Singh",
    images: 2,
    video: false,
    masterVoteStatus: "pending",
    completionRate: 45,
    comments: 8,
    trending: false,
    recentActivity: "3 new votes in last hour",
  },
  {
    id: "3",
    title: "Water supply completely cut off",
    type: "water",
    location: { name: "Sector 5", city: "Jamshedpur" },
    status: "completed",
    priority: "high",
    votes: { up: 45, down: 0, userVote: "up" },
    description: "No water supply for 3 days in entire residential complex",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    submittedBy: "Amit Sharma",
    images: 2,
    video: false,
    masterVoteStatus: "approved",
    completionRate: 95,
    comments: 24,
    trending: false,
    recentActivity: "Issue marked as resolved",
  },
  {
    id: "4",
    title: "Garbage overflowing on main road",
    type: "waste",
    location: { name: "Market Square", city: "Bokaro" },
    status: "voting",
    priority: "medium",
    votes: { up: 18, down: 3, userVote: null },
    description: "Multiple garbage bins overflowing, creating health hazards",
    submittedAt: new Date(Date.now() - 1000 * 60 * 30),
    submittedBy: "Sunita Devi",
    images: 4,
    video: false,
    masterVoteStatus: "pending",
    completionRate: 60,
    comments: 6,
    trending: true,
    recentActivity: "Gaining community support",
  },
  {
    id: "5",
    title: "Traffic signal not working properly",
    type: "traffic",
    location: { name: "Central Square", city: "Ranchi" },
    status: "open",
    priority: "high",
    votes: { up: 32, down: 1, userVote: null },
    description: "Traffic signal stuck on red, causing massive congestion during peak hours",
    submittedAt: new Date(Date.now() - 1000 * 60 * 20),
    submittedBy: "Vikram Singh",
    images: 2,
    video: true,
    masterVoteStatus: "approved",
    completionRate: 85,
    comments: 15,
    trending: true,
    recentActivity: "Emergency response team notified",
  },
  {
    id: "6",
    title: "Park benches broken and unsafe",
    type: "park",
    location: { name: "Gandhi Park", city: "Dhanbad" },
    status: "voting",
    priority: "low",
    votes: { up: 12, down: 0, userVote: null },
    description: "Several park benches are broken with sharp edges, unsafe for children",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60),
    submittedBy: "Anita Devi",
    images: 3,
    video: false,
    masterVoteStatus: "pending",
    completionRate: 35,
    comments: 4,
    trending: false,
    recentActivity: "Community discussion ongoing",
  },
  {
    id: "7",
    title: "Drainage system completely blocked",
    type: "water",
    location: { name: "Station Road", city: "Jamshedpur" },
    status: "voting",
    priority: "high",
    votes: { up: 28, down: 2, userVote: null },
    description: "Blocked drainage causing waterlogging during monsoon season",
    submittedAt: new Date(Date.now() - 1000 * 60 * 90),
    submittedBy: "Ravi Kumar",
    images: 4,
    video: true,
    masterVoteStatus: "approved",
    completionRate: 72,
    comments: 18,
    trending: true,
    recentActivity: "Municipal team assigned",
  },
  {
    id: "8",
    title: "Illegal dumping in residential area",
    type: "waste",
    location: { name: "Sector 12", city: "Bokaro" },
    status: "open",
    priority: "medium",
    votes: { up: 16, down: 1, userVote: null },
    description: "Construction waste being dumped illegally near residential buildings",
    submittedAt: new Date(Date.now() - 1000 * 60 * 120),
    submittedBy: "Meera Sharma",
    images: 5,
    video: false,
    masterVoteStatus: "pending",
    completionRate: 48,
    comments: 9,
    trending: false,
    recentActivity: "Investigation requested",
  },
]

function IssueCard({
  issue,
  onVote,
  onViewDetails,
}: {
  issue: LiveIssue
  onVote: (issueId: string, voteType: "up" | "down") => void
  onViewDetails: (issue: LiveIssue) => void
}) {
  const getStatusColor = () => {
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

  const getPriorityColor = () => {
    switch (issue.priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-blue-500"
      default:
        return "text-gray-500"
    }
  }

  const getTypeIcon = () => {
    switch (issue.type) {
      case "pothole":
        return "🕳️"
      case "streetlight":
        return "💡"
      case "water":
        return "💧"
      case "waste":
        return "🗑️"
      case "traffic":
        return "🚦"
      case "park":
        return "🌳"
      default:
        return "📋"
    }
  }

  const timeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <Card className="p-4 bg-card border-border hover:border-primary/50 transition-all duration-200 cursor-pointer">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="text-lg">{getTypeIcon()}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-card-foreground truncate">{issue.title}</h3>
                {issue.trending && (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>
                  {issue.location.name}, {issue.location.city}
                </span>
                <span>•</span>
                <Clock className="h-3 w-3" />
                <span>{timeAgo(issue.submittedAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={cn("text-white text-xs", getStatusColor())}>{issue.status}</Badge>
            <Badge variant="outline" className={cn("text-xs", getPriorityColor())}>
              {issue.priority}
            </Badge>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-card-foreground line-clamp-2">{issue.description}</p>

        {/* Media indicators */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {issue.images > 0 && (
            <div className="flex items-center gap-1">
              <Camera className="h-3 w-3" />
              {issue.images} photos
            </div>
          )}
          {issue.video && (
            <div className="flex items-center gap-1">
              <Video className="h-3 w-3" />
              Video
            </div>
          )}
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {issue.comments} comments
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Community Support</span>
            <span className="text-card-foreground">{issue.completionRate}%</span>
          </div>
          <Progress value={issue.completionRate} className="h-1.5" />
        </div>

        {/* Master Vote Status */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Shield className="h-3 w-3" />
            Master Vote:
            {issue.masterVoteStatus === "approved" && <CheckCircle className="h-3 w-3 text-green-500 ml-1" />}
            {issue.masterVoteStatus === "rejected" && <AlertTriangle className="h-3 w-3 text-red-500 ml-1" />}
            {issue.masterVoteStatus === "pending" && <Clock className="h-3 w-3 text-yellow-500 ml-1" />}
            <span className="ml-1">{issue.masterVoteStatus}</span>
          </div>
          <span className="text-muted-foreground">by {issue.submittedBy}</span>
        </div>

        {/* Recent Activity */}
        {issue.recentActivity && (
          <div className="flex items-center gap-1 text-xs text-primary bg-primary/5 px-2 py-1 rounded">
            <Zap className="h-3 w-3" />
            {issue.recentActivity}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={issue.votes.userVote === "up" ? "default" : "outline"}
              className="h-8 px-3"
              onClick={(e) => {
                e.stopPropagation()
                onVote(issue.id, "up")
              }}
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              {issue.votes.up}
            </Button>
            <Button
              size="sm"
              variant={issue.votes.userVote === "down" ? "destructive" : "outline"}
              className="h-8 px-3"
              onClick={(e) => {
                e.stopPropagation()
                onVote(issue.id, "down")
              }}
            >
              <ThumbsDown className="h-3 w-3 mr-1" />
              {issue.votes.down}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="h-8 px-3">
              <MessageSquare className="h-3 w-3 mr-1" />
              Comment
            </Button>
            <Button size="sm" variant="ghost" className="h-8 px-3">
              <Share2 className="h-3 w-3 mr-1" />
              Share
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3 bg-transparent"
              onClick={() => onViewDetails(issue)}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function IssueDetailsModal({
  issue,
  isOpen,
  onClose,
}: {
  issue: LiveIssue | null
  isOpen: boolean
  onClose: () => void
}) {
  if (!issue) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">{issue.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {issue.location.name}, {issue.location.city}
            <span>•</span>
            <Clock className="h-4 w-4" />
            {issue.submittedAt.toLocaleString()}
          </div>

          <p className="text-card-foreground">{issue.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Status:</span>
              <Badge
                className={cn(
                  "ml-2 text-white",
                  issue.status === "open" ? "bg-red-500" : issue.status === "voting" ? "bg-yellow-500" : "bg-primary",
                )}
              >
                {issue.status}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Priority:</span>
              <Badge
                variant="outline"
                className={cn(
                  "ml-2",
                  issue.priority === "high"
                    ? "text-red-500 border-red-500"
                    : issue.priority === "medium"
                      ? "text-yellow-500 border-yellow-500"
                      : "text-blue-500 border-blue-500",
                )}
              >
                {issue.priority}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Community Support</span>
              <span className="text-card-foreground">{issue.completionRate}%</span>
            </div>
            <Progress value={issue.completionRate} className="h-2" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                {issue.votes.up + issue.votes.down} votes
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                {issue.comments} comments
              </div>
            </div>
            <div className="text-muted-foreground">Submitted by {issue.submittedBy}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function LiveIssuesFeed({ onViewMap, externalIssues }: { onViewMap?: () => void; externalIssues?: Partial<LiveIssue>[] }) {
  const [issues, setIssues] = useState<LiveIssue[]>(mockLiveIssues)
  const [filteredIssues, setFilteredIssues] = useState<LiveIssue[]>(mockLiveIssues)
  const [selectedIssue, setSelectedIssue] = useState<LiveIssue | null>(null)
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCity, setFilterCity] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")

  useEffect(() => {
    if (externalIssues && externalIssues.length) {
      const normalized = externalIssues.map((e) => ({
        id: e.id || `ext-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: e.title || "New community report",
        type: e.type || "other",
        location: e.location || { name: "Unknown", city: "Ranchi" },
        status: e.status || "open",
        priority: e.priority || "medium",
        votes: e.votes || { up: 0, down: 0, userVote: null },
        description: e.description || "Incoming alert from social source",
        submittedAt: e.submittedAt || new Date(),
        submittedBy: e.submittedBy || "Community",
        images: e.images ?? 0,
        video: e.video ?? false,
        masterVoteStatus: e.masterVoteStatus || "pending",
        completionRate: e.completionRate ?? 0,
        comments: e.comments ?? 0,
        trending: e.trending ?? true,
        recentActivity: e.recentActivity || "New report received",
      })) as LiveIssue[]
      setIssues((prev) => [...normalized, ...prev])
    }
  }, [externalIssues])

  useEffect(() => {
    let filtered = [...issues]

    // Apply filters
    if (filterType !== "all") {
      filtered = filtered.filter((issue) => issue.type === filterType)
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter((issue) => issue.status === filterStatus)
    }
    if (filterCity !== "all") {
      filtered = filtered.filter((issue) => issue.location.city === filterCity)
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          issue.location.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "recent":
        filtered.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
        break
      case "votes":
        filtered.sort((a, b) => b.votes.up + b.votes.down - (a.votes.up + a.votes.down))
        break
      case "completion":
        filtered.sort((a, b) => b.completionRate - a.completionRate)
        break
      case "trending":
        filtered.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0))
        break
    }

    setFilteredIssues(filtered)
  }, [issues, filterType, filterStatus, filterCity, searchQuery, sortBy])

  const handleVote = (issueId: string, voteType: "up" | "down") => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          const currentVote = issue.votes.userVote
          const newVotes = { ...issue.votes }

          if (currentVote === voteType) {
            // Remove vote
            newVotes.userVote = null
            newVotes[voteType] -= 1
          } else {
            // Add or change vote
            if (currentVote) {
              newVotes[currentVote] -= 1
            }
            newVotes[voteType] += 1
            newVotes.userVote = voteType
          }

          return { ...issue, votes: newVotes }
        }
        return issue
      }),
    )
  }

  const cities = ["Ranchi", "Dhanbad", "Jamshedpur", "Bokaro"]
  const issueTypes = [
    { value: "pothole", label: "Potholes" },
    { value: "streetlight", label: "Street Lights" },
    { value: "water", label: "Water Supply" },
    { value: "waste", label: "Waste Management" },
    { value: "traffic", label: "Traffic" },
    { value: "park", label: "Parks" },
    { value: "other", label: "Other" },
  ]

  return (
    <div className="space-y-6">
      {/* Header with View Map button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Live Reports</h2>
          <p className="text-muted-foreground">Real-time civic reports from your community</p>
        </div>
        {/* View Map button */}
        {onViewMap && (
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={onViewMap}>
            <Map className="h-4 w-4 mr-2" />
            View on Map
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <Card className="p-4 bg-card border-border">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-input border-border text-foreground"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40 bg-input border-border">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {issueTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32 bg-input border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="voting">Voting</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCity} onValueChange={setFilterCity}>
              <SelectTrigger className="w-32 bg-input border-border">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 bg-input border-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="votes">Most Voted</SelectItem>
                <SelectItem value="completion">Completion</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-3 bg-card border-border text-center">
          <div className="text-2xl font-bold text-primary">{filteredIssues.length}</div>
          <div className="text-xs text-muted-foreground">Total Issues</div>
        </Card>
        <Card className="p-3 bg-card border-border text-center">
          <div className="text-2xl font-bold text-red-500">
            {filteredIssues.filter((i) => i.status === "open").length}
          </div>
          <div className="text-xs text-muted-foreground">Open</div>
        </Card>
        <Card className="p-3 bg-card border-border text-center">
          <div className="text-2xl font-bold text-yellow-500">
            {filteredIssues.filter((i) => i.status === "voting").length}
          </div>
          <div className="text-xs text-muted-foreground">Voting</div>
        </Card>
        <Card className="p-3 bg-card border-border text-center">
          <div className="text-2xl font-bold text-primary">{filteredIssues.filter((i) => i.trending).length}</div>
          <div className="text-xs text-muted-foreground">Trending</div>
        </Card>
      </div>

      {/* Issues Feed (Grouped by City) */}
      <div className="space-y-6">
        {filteredIssues.length === 0 ? (
          <Card className="p-8 bg-card border-border text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">No Issues Found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
          </Card>
        ) : (
          Object.entries(
            filteredIssues.reduce((acc: Record<string, LiveIssue[]>, issue) => {
              const key = issue.location.city
              acc[key] = acc[key] || []
              acc[key].push(issue)
              return acc
            }, {}),
          ).map(([city, issues]) => (
            <div key={city} className="space-y-3">
              <div className="sticky top-16 z-10">
                <Card className="px-4 py-2 bg-muted/40 border-border">
                  <div className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                    <MapPin className="h-3 w-3" /> {city}
                    <Badge variant="outline" className="ml-2">{issues.length}</Badge>
                  </div>
                </Card>
              </div>
              {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} onVote={handleVote} onViewDetails={setSelectedIssue} />
              ))}
            </div>
          ))
        )}
      </div>

      {/* Issue Details Modal */}
      <IssueDetailsModal issue={selectedIssue} isOpen={!!selectedIssue} onClose={() => setSelectedIssue(null)} />
    </div>
  )
}
