"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Users,
  FileText,
  BarChart3,
  Settings,
  CheckCircle,
  X,
  Clock,
  TrendingUp,
  MapPin,
  Calendar,
  Eye,
  Filter,
  Search,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Megaphone,
  UserCheck,
  AlertTriangle,
  Zap,
  Brain,
  Star,
  Send,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminReport {
  id: string
  title: string
  type: string
  location: { name: string; city: string }
  status: "open" | "voting" | "in-progress" | "completed" | "rejected"
  priority: "low" | "medium" | "high" | "critical"
  submittedBy: string
  submittedAt: Date
  description: string
  votes: { up: number; down: number }
  masterVoteStatus: "pending" | "approved" | "rejected"
  masterVoteBy?: string
  masterVoteAt?: Date
  completionRate: number
  images: number
  comments: number
  assignedTo?: string
  estimatedCost?: number
  aiSuggestion?: string
}

interface AdminUser {
  id: string
  name: string
  email: string
  city: string
  joinedAt: Date
  lastActive: Date
  reportsCount: number
  votesCount: number
  status: "active" | "suspended" | "banned"
  tier: string
  points: number
  avatar?: string
}

interface Announcement {
  id: string
  title: string
  message: string
  type: "alert" | "warning" | "disaster"
  targetCities: string[]
  createdAt: Date
  isActive: boolean
}

const mockAdminReports: AdminReport[] = [
  {
    id: "1",
    title: "Large pothole causing traffic jam",
    type: "pothole",
    location: { name: "Main Street", city: "Ranchi" },
    status: "voting",
    priority: "critical",
    submittedBy: "Rajesh Kumar",
    submittedAt: new Date(2024, 0, 15),
    description: "Deep pothole near the market intersection causing severe traffic delays and vehicle damage",
    votes: { up: 47, down: 3 },
    masterVoteStatus: "approved",
    completionRate: 78,
    images: 5,
    comments: 23,
    assignedTo: "PWD Team Alpha",
    estimatedCost: 25000,
    aiSuggestion:
      "High priority due to traffic impact. Recommend immediate patching with hot mix asphalt. Estimated completion: 2-3 days.",
  },
  {
    id: "2",
    title: "Multiple street lights not working in residential area",
    type: "streetlight",
    location: { name: "Sector 7 Housing Complex", city: "Dhanbad" },
    status: "in-progress",
    priority: "high",
    submittedBy: "Priya Singh",
    submittedAt: new Date(2024, 0, 12),
    description: "15+ street lights have been non-functional for over 2 weeks, creating safety concerns for residents",
    votes: { up: 89, down: 2 },
    masterVoteStatus: "approved",
    masterVoteBy: "Admin",
    masterVoteAt: new Date(2024, 0, 14),
    completionRate: 65,
    images: 8,
    comments: 34,
    assignedTo: "Electrical Maintenance Team",
    estimatedCost: 45000,
    aiSuggestion:
      "Bulk replacement recommended. LED conversion opportunity for energy efficiency. Estimated completion: 5-7 days.",
  },
  {
    id: "3",
    title: "Water supply disruption affecting 500+ families",
    type: "water",
    location: { name: "Gandhi Nagar", city: "Jamshedpur" },
    status: "completed",
    priority: "critical",
    submittedBy: "Amit Sharma",
    submittedAt: new Date(2024, 0, 8),
    description:
      "Complete water supply failure due to main pipeline burst. Emergency situation affecting large residential area",
    votes: { up: 156, down: 1 },
    masterVoteStatus: "approved",
    masterVoteBy: "Admin",
    masterVoteAt: new Date(2024, 0, 9),
    completionRate: 100,
    images: 12,
    comments: 67,
    assignedTo: "Water Works Emergency Team",
    estimatedCost: 125000,
    aiSuggestion:
      "Emergency repair completed successfully. Recommend preventive maintenance schedule for aging infrastructure.",
  },
  {
    id: "4",
    title: "Illegal waste dumping site needs immediate cleanup",
    type: "waste",
    location: { name: "Industrial Area", city: "Bokaro" },
    status: "open",
    priority: "high",
    submittedBy: "Sunita Devi",
    submittedAt: new Date(2024, 0, 16),
    description: "Large illegal dumping site with hazardous waste posing environmental and health risks",
    votes: { up: 34, down: 0 },
    masterVoteStatus: "pending",
    completionRate: 45,
    images: 6,
    comments: 18,
    estimatedCost: 75000,
    aiSuggestion:
      "Requires immediate attention due to environmental impact. Coordinate with pollution control board. Install surveillance to prevent future dumping.",
  },
  {
    id: "5",
    title: "Traffic signal malfunction at major intersection",
    type: "traffic",
    location: { name: "Station Road Junction", city: "Ranchi" },
    status: "voting",
    priority: "critical",
    submittedBy: "Vikash Gupta",
    submittedAt: new Date(2024, 0, 17),
    description:
      "Traffic signal completely non-functional during peak hours, causing major traffic chaos and safety risks",
    votes: { up: 78, down: 1 },
    masterVoteStatus: "approved",
    masterVoteBy: "Admin",
    masterVoteAt: new Date(2024, 0, 17),
    completionRate: 85,
    images: 4,
    comments: 29,
    assignedTo: "Traffic Management Team",
    estimatedCost: 35000,
    aiSuggestion:
      "Critical infrastructure failure. Deploy traffic police immediately. Replace with smart signal system for better management.",
  },
]

const mockAdminUsers: AdminUser[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    city: "Ranchi",
    joinedAt: new Date(2023, 11, 1),
    lastActive: new Date(),
    reportsCount: 67,
    votesCount: 234,
    status: "active",
    tier: "Platinum",
    points: 2450,
    avatar: "/indian-man-avatar.png",
  },
  {
    id: "2",
    name: "Priya Singh",
    email: "priya@example.com",
    city: "Dhanbad",
    joinedAt: new Date(2023, 11, 15),
    lastActive: new Date(Date.now() - 1000 * 60 * 30),
    reportsCount: 89,
    votesCount: 456,
    status: "active",
    tier: "Diamond",
    points: 3890,
    avatar: "/indian-woman-avatar.png",
  },
  {
    id: "3",
    name: "Amit Sharma",
    email: "amit@example.com",
    city: "Jamshedpur",
    joinedAt: new Date(2023, 10, 20),
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
    reportsCount: 45,
    votesCount: 189,
    status: "active",
    tier: "Gold",
    points: 1650,
    avatar: "/indian-man-avatar-glasses.jpg",
  },
  {
    id: "4",
    name: "Sunita Devi",
    email: "sunita@example.com",
    city: "Bokaro",
    joinedAt: new Date(2023, 9, 10),
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24),
    reportsCount: 23,
    votesCount: 98,
    status: "active",
    tier: "Silver",
    points: 890,
  },
]

const teamMembers = [
  { id: "1", name: "PWD Team Alpha", specialization: "Road Infrastructure" },
  { id: "2", name: "Electrical Maintenance Team", specialization: "Street Lights & Electrical" },
  { id: "3", name: "Water Works Emergency Team", specialization: "Water Supply & Drainage" },
  { id: "4", name: "Waste Management Team", specialization: "Sanitation & Waste" },
  { id: "5", name: "Traffic Management Team", specialization: "Traffic & Transportation" },
]

function AnnouncementManager() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "1",
      title: "Scheduled Maintenance - Water Supply",
      message:
        "Water supply will be temporarily disrupted in Sector 5-8 on January 25th from 10 AM to 4 PM for pipeline maintenance.",
      type: "alert",
      targetCities: ["Ranchi"],
      createdAt: new Date(2024, 0, 20),
      isActive: true,
    },
    {
      id: "2",
      title: "Heatwave Warning - Stay Hydrated",
      message:
        "Temperature expected above 44°C between 12 PM - 4 PM. Avoid direct sunlight and check on elderly.",
      type: "warning",
      targetCities: ["Dhanbad"],
      createdAt: new Date(2024, 0, 18),
      isActive: true,
    },
  ])

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
    type: "alert" as const,
    targetCities: [] as string[],
  })

  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const handleCreateAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.message) return

    const announcement: Announcement = {
      id: Date.now().toString(),
      ...newAnnouncement,
      createdAt: new Date(),
      isActive: true,
    }

    setAnnouncements([announcement, ...announcements])
    // Trigger global overlay with unique background effects per type
    if (typeof window !== "undefined") {
      const detail = {
        title: announcement.title,
        city: announcement.targetCities[0] || "All",
        mode: announcement.type as "alert" | "warning" | "disaster",
        at: Date.now(),
      }
      window.dispatchEvent(new CustomEvent("disaster-demo", { detail }))
      try {
        const existing = JSON.parse(localStorage.getItem("publicAlerts") || "[]")
        existing.unshift(detail)
        localStorage.setItem("publicAlerts", JSON.stringify(existing))
      } catch {}
    }
    setNewAnnouncement({ title: "", message: "", type: "alert", targetCities: [] })
    setShowCreateDialog(false)
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground">Public Announcements</h3>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Megaphone className="h-4 w-4 mr-2" />
          Create Announcement
        </Button>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="p-4 bg-card border-border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-card-foreground">{announcement.title}</h4>
                  <Badge
                    className={cn(
                      "text-white text-xs capitalize",
                      announcement.type === "alert" && "bg-blue-600",
                      announcement.type === "warning" && "bg-yellow-500",
                      announcement.type === "disaster" && "bg-red-600",
                    )}
                  >
                    {announcement.type === "disaster" ? "Disaster SOS" : announcement.type}
                  </Badge>
                  {announcement.isActive && (
                    <Badge className="bg-primary text-primary-foreground text-xs">Active</Badge>
                  )}
                </div>
                <p className="text-sm text-card-foreground mb-2">{announcement.message}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Target: {announcement.targetCities.join(", ")}</span>
                  <span>Created: {announcement.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant={announcement.isActive ? "destructive" : "default"}
                  onClick={() =>
                    setAnnouncements(
                      announcements.map((a) => (a.id === announcement.id ? { ...a, isActive: !a.isActive } : a)),
                    )
                  }
                >
                  {announcement.isActive ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">Create New Announcement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-card-foreground">Title</label>
              <Input
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                className="bg-input border-border text-foreground"
                placeholder="Announcement title..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground">Message</label>
              <Textarea
                value={newAnnouncement.message}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                className="bg-input border-border text-foreground"
                placeholder="Announcement message..."
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground">Type</label>
              <Select
                value={newAnnouncement.type}
                onValueChange={(value: any) => setNewAnnouncement({ ...newAnnouncement, type: value })}
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alert">Alert</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="disaster">Disastor SOS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground">Target Cities</label>
              <Select
                value={newAnnouncement.targetCities[0] || "All"}
                onValueChange={(value) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    targetCities: value === "All" ? ["All"] : [value],
                  })
                }
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Cities</SelectItem>
                  <SelectItem value="Ranchi">Ranchi</SelectItem>
                  <SelectItem value="Dhanbad">Dhanbad</SelectItem>
                  <SelectItem value="Jamshedpur">Jamshedpur</SelectItem>
                  <SelectItem value="Bokaro">Bokaro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreateAnnouncement}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-4 w-4 mr-2" />
                Create & Publish
              </Button>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EnhancedReportManagement() {
  const [reports, setReports] = useState<AdminReport[]>(mockAdminReports)
  const [pendingCommunity, setPendingCommunity] = useState(
    [
      {
        id: "p1",
        title: "Cluster of pothole reports near Market Road",
        area: "Ranchi - Market Road",
        related: ["1"],
        upvotes: 12,
        required: 20,
        createdBy: "Auto (AI)",
      },
      {
        id: "p2",
        title: "Street light outage across Sector 7 blocks B-D",
        area: "Dhanbad - Sector 7",
        related: ["2"],
        upvotes: 8,
        required: 15,
        createdBy: "Citizen Initiative",
      },
    ] as Array<{ id: string; title: string; area: string; related: string[]; upvotes: number; required: number; createdBy: string }>,
  )
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const handleStatusUpdate = (reportId: string, newStatus: AdminReport["status"]) => {
    setReports((prev) => prev.map((report) => (report.id === reportId ? { ...report, status: newStatus } : report)))
  }

  const handlePriorityUpdate = (reportId: string, newPriority: AdminReport["priority"]) => {
    setReports((prev) => prev.map((report) => (report.id === reportId ? { ...report, priority: newPriority } : report)))
  }

  const handleAssignReport = (reportId: string, assignedTo: string) => {
    setReports((prev) => prev.map((report) => (report.id === reportId ? { ...report, assignedTo } : report)))
  }

  const handleMasterVote = (reportId: string, decision: "approved" | "rejected") => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? {
              ...report,
              masterVoteStatus: decision,
              masterVoteBy: "Admin",
              masterVoteAt: new Date(),
              status: decision === "approved" ? "voting" : "rejected",
            }
          : report,
      ),
    )
  }

  const filteredReports = reports.filter((report) => {
    if (filterStatus !== "all" && report.status !== filterStatus) return false
    if (filterPriority !== "all" && report.priority !== filterPriority) return false
    if (searchQuery && !report.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const proposeCommunityReport = (report: AdminReport) => {
    // If already present, just nudge upvotes
    const existing = pendingCommunity.find((p) => p.related.includes(report.id))
    if (existing) {
      setPendingCommunity((prev) => prev.map((p) => (p.id === existing.id ? { ...p, upvotes: p.upvotes + 1 } : p)))
      return
    }
    const area = `${report.location.city} - ${report.location.name}`
    setPendingCommunity((prev) => [
      {
        id: `p-${Date.now()}`,
        title: report.title,
        area,
        related: [report.id],
        upvotes: 1,
        required: 15,
        createdBy: "Citizen Initiative",
      },
      ...prev,
    ])
  }

  const approveCommunityReport = (pid: string) => {
    setPendingCommunity((prev) => prev.filter((p) => p.id !== pid))
  }

  const declineCommunityReport = (pid: string) => {
    setPendingCommunity((prev) => prev.filter((p) => p.id !== pid))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 border-red-600 bg-red-50"
      case "high":
        return "text-orange-600 border-orange-600 bg-orange-50"
      case "medium":
        return "text-yellow-600 border-yellow-600 bg-yellow-50"
      case "low":
        return "text-blue-600 border-blue-600 bg-blue-50"
      default:
        return "text-gray-600 border-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Filters */}
      <Card className="p-4 bg-card border-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports by title, location, or submitter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-input border-border text-foreground"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36 bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="voting">Voting</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-32 bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Enhanced Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-card-foreground text-lg">{report.title}</h3>
                    {report.aiSuggestion && (
                      <div className="flex items-center gap-1 text-xs text-blue-500">
                        <Brain className="h-3 w-3" />
                        AI Insight
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {report.location.name}, {report.location.city}
                    </span>
                    <span>•</span>
                    <span>by {report.submittedBy}</span>
                    <span>•</span>
                    <Calendar className="h-3 w-3" />
                    <span>{report.submittedAt.toLocaleDateString()}</span>
                    {report.estimatedCost && (
                      <>
                        <span>•</span>
                        <span>₹{report.estimatedCost.toLocaleString()}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      "text-white",
                      report.status === "open" && "bg-red-500",
                      report.status === "voting" && "bg-yellow-500",
                      report.status === "in-progress" && "bg-blue-500",
                      report.status === "completed" && "bg-primary",
                      report.status === "rejected" && "bg-gray-500",
                    )}
                  >
                    {report.status}
                  </Badge>
                  <Badge variant="outline" className={getPriorityColor(report.priority)}>
                    {report.priority}
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-card-foreground leading-relaxed">{report.description}</p>

              {report.aiSuggestion && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">AI Recommendation</span>
                  </div>
                  <p className="text-sm text-blue-800">{report.aiSuggestion}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4 text-green-500" />
                    {report.votes.up}
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsDown className="h-4 w-4 text-red-500" />
                    {report.votes.down}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {report.comments}
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    Master Vote: {report.masterVoteStatus}
                  </div>
                  {report.assignedTo && (
                    <div className="flex items-center gap-1">
                      <UserCheck className="h-4 w-4 text-blue-500" />
                      {report.assignedTo}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Select value={report.status} onValueChange={(value: any) => handleStatusUpdate(report.id, value)}>
                    <SelectTrigger className="w-32 h-8 text-xs bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="voting">Voting</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={report.priority}
                    onValueChange={(value: any) => handlePriorityUpdate(report.id, value)}
                  >
                    <SelectTrigger className="w-24 h-8 text-xs bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={report.assignedTo || "unassigned"}
                    onValueChange={(value) => handleAssignReport(report.id, value === "unassigned" ? "" : value)}
                  >
                    <SelectTrigger className="w-40 h-8 text-xs bg-input border-border">
                      <SelectValue placeholder="Assign to..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.name}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {report.masterVoteStatus === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="h-8 bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => handleMasterVote(report.id, "approved")}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8"
                        onClick={() => handleMasterVote(report.id, "rejected")}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    className="h-8 bg-green-600 hover:bg-green-700"
                    onClick={() => proposeCommunityReport(report)}
                  >
                    Push to Community Report
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 bg-transparent"
                    onClick={() => setSelectedReport(report)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Details
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Community Support Progress</span>
                  <span className="text-card-foreground font-medium">{report.completionRate}%</span>
                </div>
                <Progress value={report.completionRate} className="h-2" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pending Community Reports */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <h3 className="text-lg font-semibold text-card-foreground">Pending Community Reports</h3>
          </div>
          <Badge className="bg-primary text-primary-foreground text-xs">{pendingCommunity.length}</Badge>
        </div>
        <div className="space-y-3">
          {pendingCommunity.map((p) => (
            <div key={p.id} className="p-4 rounded-lg bg-muted/20 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-card-foreground">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.area} • Related: {p.related.join(", ")}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-500 text-white text-xs">{p.upvotes}/{p.required} upvotes</Badge>
                  <Button size="sm" variant="outline" onClick={() => approveCommunityReport(p.id)}>Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => declineCommunityReport(p.id)}>Decline</Button>
                </div>
              </div>
            </div>
          ))}
          {pendingCommunity.length === 0 && (
            <div className="text-sm text-muted-foreground">No pending community reports.</div>
          )}
        </div>
      </Card>
    </div>
  )
}

function LiveAnalytics() {
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 1247,
    reportsToday: 23,
    votesToday: 156,
    avgResponseTime: "1.8 hours",
    criticalIssues: 3,
    completionRate: 73.2,
  })

  const aiInsights = [
    {
      type: "trend",
      message:
        "Pothole reports increased by 45% this week due to recent rainfall. Consider proactive road maintenance.",
      priority: "high",
    },
    {
      type: "efficiency",
      message: "Ranchi team has 20% faster resolution time. Best practices can be shared with other cities.",
      priority: "medium",
    },
    {
      type: "prediction",
      message: "Street light issues likely to spike next week based on weather forecast and historical data.",
      priority: "medium",
    },
    {
      type: "alert",
      message: "Water supply reports in Jamshedpur show clustering pattern. Possible infrastructure issue.",
      priority: "critical",
    },
  ]

  const dataSources = [
    { name: "Twitter Stream", status: "active", itemsMin: 4 },
    { name: "Facebook Graph", status: "active", itemsMin: 2 },
    { name: "Instagram Hashtags", status: "active", itemsMin: 1 },
    { name: "Reddit r/Jharkhand", status: "active", itemsMin: 1 },
  ]

  return (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{realTimeData.activeUsers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
              <div className="text-xs text-primary flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +8% today
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{realTimeData.reportsToday}</div>
              <div className="text-sm text-muted-foreground">Reports Today</div>
              <div className="text-xs text-blue-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last: 5 min ago
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <ThumbsUp className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{realTimeData.votesToday}</div>
              <div className="text-sm text-muted-foreground">Votes Today</div>
              <div className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% vs yesterday
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{realTimeData.avgResponseTime}</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
              <div className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                15% faster
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{realTimeData.criticalIssues}</div>
              <div className="text-sm text-muted-foreground">Critical Issues</div>
              <div className="text-xs text-red-500 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Needs attention
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{realTimeData.completionRate}%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
              <div className="text-xs text-primary flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +2.1% this week
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Brain className="h-5 w-5 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-card-foreground">AI Insights & Recommendations</h3>
        </div>
        <div className="space-y-3">
          {aiInsights.map((insight, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-lg border-l-4",
                insight.priority === "critical" && "bg-red-50 border-red-500",
                insight.priority === "high" && "bg-orange-50 border-orange-500",
                insight.priority === "medium" && "bg-blue-50 border-blue-500",
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2">
                  {insight.type === "trend" && <TrendingUp className="h-4 w-4 text-orange-500" />}
                  {insight.type === "efficiency" && <Zap className="h-4 w-4 text-blue-500" />}
                  {insight.type === "prediction" && <Brain className="h-4 w-4 text-purple-500" />}
                  {insight.type === "alert" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  <Badge
                    className={cn(
                      "text-xs",
                      insight.priority === "critical" && "bg-red-500 text-white",
                      insight.priority === "high" && "bg-orange-500 text-white",
                      insight.priority === "medium" && "bg-blue-500 text-white",
                    )}
                  >
                    {insight.priority}
                  </Badge>
                </div>
                <p className="text-sm text-card-foreground flex-1">{insight.message}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Data Sources */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Live Data Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {dataSources.map((s) => (
            <div key={s.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div className="text-sm text-card-foreground">{s.name}</div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500 text-white text-xs capitalize">{s.status}</Badge>
                <span className="text-xs text-muted-foreground">~{s.itemsMin}/min</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* City Performance Comparison */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Real-time City Performance</h3>
        <div className="space-y-4">
          {[
            { city: "Ranchi", reports: 45, resolved: 38, rate: 84.4, trend: "+5%" },
            { city: "Dhanbad", reports: 32, resolved: 23, rate: 71.9, trend: "+2%" },
            { city: "Jamshedpur", reports: 28, resolved: 19, rate: 67.9, trend: "-1%" },
            { city: "Bokaro", reports: 21, resolved: 16, rate: 76.2, trend: "+3%" },
          ].map((city) => (
            <div key={city.city} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-card-foreground font-medium w-20">{city.city}</span>
                  <span className="text-muted-foreground">
                    {city.resolved}/{city.reports} resolved
                  </span>
                  <Badge
                    className={cn(
                      "text-xs",
                      city.trend.startsWith("+") ? "bg-green-500 text-white" : "bg-red-500 text-white",
                    )}
                  >
                    {city.trend}
                  </Badge>
                </div>
                <span className="text-card-foreground font-medium">{city.rate}%</span>
              </div>
              <Progress value={city.rate} className="h-2" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export function EnhancedAdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">TownShip Admin Panel</h1>
          <p className="text-muted-foreground">Comprehensive civic management dashboard for Jharkhand</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 bg-muted">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Live Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Community Reports
          </TabsTrigger>
          <TabsTrigger value="announcements" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            System Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <LiveAnalytics />
        </TabsContent>

        <TabsContent value="reports">
          <EnhancedReportManagement />
        </TabsContent>

        <TabsContent value="announcements">
          <AnnouncementManager />
        </TabsContent>

        <TabsContent value="users">
          <div className="space-y-6">
            {/* AI Suggestions: Potential Spam Profiles */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-card-foreground">AI Suggestions: Potential Spam Profiles</h3>
                </div>
                <Badge className="bg-blue-500 text-white">Beta</Badge>
              </div>
              <div className="space-y-3">
                {[
                  { id: "s1", name: "Ravi Random", reason: "Reports contain repeated lorem text", score: 0.82, email: "ravi.rand@example.com" },
                  { id: "s2", name: "Spammy User", reason: "10 reports in 2 mins from same IP", score: 0.91, email: "spam.user@example.com" },
                  { id: "s3", name: "Bot-1234", reason: "Username pattern matches known bot list", score: 0.76, email: "bot1234@example.com" },
                ].map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-card-foreground">{s.name} <span className="text-muted-foreground">• {s.email}</span></div>
                      <div className="text-xs text-muted-foreground">Reason: {s.reason}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-xs", s.score > 0.9 ? "bg-red-500" : s.score > 0.8 ? "bg-orange-500" : "bg-yellow-500")}>Risk {Math.round(s.score*100)}%</Badge>
                      <Button size="sm" variant="outline">Review</Button>
                      <Button size="sm" className="bg-red-500 hover:bg-red-600">Flag</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-card border-border">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name, email, or city..."
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32 bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              {mockAdminUsers.map((user) => (
                <Card key={user.id} className="p-6 bg-card border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="text-lg">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-card-foreground text-lg">{user.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <span>{user.email}</span>
                          <span>•</span>
                          <MapPin className="h-3 w-3" />
                          <span>{user.city}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <Badge
                            className={cn(
                              "text-white",
                              user.tier === "Diamond" && "bg-purple-500",
                              user.tier === "Platinum" && "bg-gray-400",
                              user.tier === "Gold" && "bg-yellow-500",
                              user.tier === "Silver" && "bg-gray-300 text-gray-800",
                            )}
                          >
                            <Star className="h-3 w-3 mr-1" />
                            {user.tier}
                          </Badge>
                          <span className="text-muted-foreground">{user.points.toLocaleString()} points</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right text-sm">
                        <div className="text-card-foreground font-medium">
                          {user.reportsCount} reports • {user.votesCount} votes
                        </div>
                        <div className="text-muted-foreground">Joined {user.joinedAt.toLocaleDateString()}</div>
                        <div className="text-xs text-muted-foreground">
                          Last active: {user.lastActive.toLocaleString()}
                        </div>
                      </div>

                      <Badge
                        className={cn(
                          "text-white",
                          user.status === "active" && "bg-primary",
                          user.status === "suspended" && "bg-yellow-500",
                          user.status === "banned" && "bg-red-500",
                        )}
                      >
                        {user.status}
                      </Badge>

                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          View Profile
                        </Button>
                        {user.status === "active" && (
                          <Button size="sm" variant="outline">
                            Suspend
                          </Button>
                        )}
                        {user.status === "suspended" && (
                          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Activate
                          </Button>
                        )}
                        {user.status !== "banned" && (
                          <Button size="sm" variant="destructive">
                            Ban
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">System Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-card-foreground">Master Vote Threshold</label>
                    <Input type="number" defaultValue="25" className="bg-input border-border text-foreground" />
                    <p className="text-xs text-muted-foreground">Minimum community votes required before Master Vote</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-card-foreground">Auto-resolve Threshold (%)</label>
                    <Input type="number" defaultValue="90" className="bg-input border-border text-foreground" />
                    <p className="text-xs text-muted-foreground">Completion rate percentage for auto-resolution</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-card-foreground">
                      Critical Priority Auto-escalation (hours)
                    </label>
                    <Input type="number" defaultValue="2" className="bg-input border-border text-foreground" />
                    <p className="text-xs text-muted-foreground">Hours before critical issues are auto-escalated</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-card-foreground">AI Insights Frequency</label>
                    <Select defaultValue="hourly">
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-card-foreground">Notification Preferences</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-card-foreground">Critical issues</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-card-foreground">Master vote requests</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm text-card-foreground">Daily summaries</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Configuration</Button>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Team Management</h3>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                    <div>
                      <div className="font-medium text-card-foreground">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.specialization}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary text-primary-foreground">Active</Badge>
                      <Button size="sm" variant="outline">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
