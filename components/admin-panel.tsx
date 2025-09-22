"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminReport {
  id: string
  title: string
  type: string
  location: { name: string; city: string }
  status: "open" | "voting" | "completed" | "rejected"
  priority: "low" | "medium" | "high"
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
}

const mockAdminReports: AdminReport[] = [
  {
    id: "1",
    title: "Large pothole causing traffic jam",
    type: "pothole",
    location: { name: "Main Street", city: "Ranchi" },
    status: "voting",
    priority: "high",
    submittedBy: "Rajesh Kumar",
    submittedAt: new Date(2024, 0, 15),
    description: "Deep pothole near the market intersection causing severe traffic delays",
    votes: { up: 23, down: 2 },
    masterVoteStatus: "pending",
    completionRate: 78,
    images: 3,
    comments: 12,
  },
  {
    id: "2",
    title: "Street light flickering dangerously",
    type: "streetlight",
    location: { name: "Park Avenue", city: "Dhanbad" },
    status: "completed",
    priority: "medium",
    submittedBy: "Priya Singh",
    submittedAt: new Date(2024, 0, 12),
    description: "Street light has been flickering for days, creating safety concerns",
    votes: { up: 15, down: 1 },
    masterVoteStatus: "approved",
    masterVoteBy: "Admin",
    masterVoteAt: new Date(2024, 0, 14),
    completionRate: 95,
    images: 2,
    comments: 8,
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
  },
  {
    id: "2",
    name: "Priya Singh",
    email: "priya@example.com",
    city: "Dhanbad",
    joinedAt: new Date(2023, 11, 15),
    lastActive: new Date(Date.now() - 1000 * 60 * 30),
    reportsCount: 34,
    votesCount: 156,
    status: "active",
    tier: "Gold",
    points: 1890,
  },
]

function ReportManagement() {
  const [reports, setReports] = useState<AdminReport[]>(mockAdminReports)
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

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

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4 bg-card border-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-input border-border text-foreground"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32 bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="voting">Voting</SelectItem>
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
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="p-4 bg-card border-border">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground">{report.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {report.location.name}, {report.location.city}
                    </span>
                    <span>•</span>
                    <span>by {report.submittedBy}</span>
                    <span>•</span>
                    <Calendar className="h-3 w-3" />
                    <span>{report.submittedAt.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      "text-white",
                      report.status === "open" && "bg-red-500",
                      report.status === "voting" && "bg-yellow-500",
                      report.status === "completed" && "bg-primary",
                      report.status === "rejected" && "bg-gray-500",
                    )}
                  >
                    {report.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      report.priority === "high" && "text-red-500 border-red-500",
                      report.priority === "medium" && "text-yellow-500 border-yellow-500",
                      report.priority === "low" && "text-blue-500 border-blue-500",
                    )}
                  >
                    {report.priority}
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-card-foreground">{report.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    {report.votes.up}
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsDown className="h-4 w-4" />
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
                </div>

                <div className="flex items-center gap-2">
                  {report.masterVoteStatus === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => handleMasterVote(report.id, "approved")}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleMasterVote(report.id, "rejected")}>
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline" onClick={() => setSelectedReport(report)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Community Support</span>
                  <span className="text-card-foreground">{report.completionRate}%</span>
                </div>
                <Progress value={report.completionRate} className="h-1.5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="bg-card border-border max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">{selectedReport.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <span className="ml-2 text-card-foreground">
                    {selectedReport.location.name}, {selectedReport.location.city}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Submitted by:</span>
                  <span className="ml-2 text-card-foreground">{selectedReport.submittedBy}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <span className="ml-2 text-card-foreground">{selectedReport.submittedAt.toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <span className="ml-2 text-card-foreground">{selectedReport.type}</span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Description:</span>
                <p className="mt-1 text-card-foreground">{selectedReport.description}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Votes:</span>
                    <span className="ml-2 text-green-500">{selectedReport.votes.up} up</span>
                    <span className="ml-2 text-red-500">{selectedReport.votes.down} down</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Images:</span>
                    <span className="ml-2 text-card-foreground">{selectedReport.images}</span>
                  </div>
                </div>
                {selectedReport.masterVoteStatus === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => {
                        handleMasterVote(selectedReport.id, "approved")
                        setSelectedReport(null)
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        handleMasterVote(selectedReport.id, "rejected")
                        setSelectedReport(null)
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredUsers = users.filter((user) => {
    if (filterStatus !== "all" && user.status !== filterStatus) return false
    if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleUserAction = (userId: string, action: "suspend" | "activate" | "ban") => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: action === "activate" ? "active" : action === "suspend" ? "suspended" : "banned",
            }
          : user,
      ),
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4 bg-card border-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-input border-border text-foreground"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
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

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg" alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-card-foreground">{user.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{user.email}</span>
                    <span>•</span>
                    <MapPin className="h-3 w-3" />
                    <span>{user.city}</span>
                    <span>•</span>
                    <span>{user.tier} Tier</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right text-sm">
                  <div className="text-card-foreground font-medium">{user.points.toLocaleString()} points</div>
                  <div className="text-muted-foreground">
                    {user.reportsCount} reports • {user.votesCount} votes
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
                  {user.status === "active" && (
                    <Button size="sm" variant="outline" onClick={() => handleUserAction(user.id, "suspend")}>
                      Suspend
                    </Button>
                  )}
                  {user.status === "suspended" && (
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => handleUserAction(user.id, "activate")}
                    >
                      Activate
                    </Button>
                  )}
                  {user.status !== "banned" && (
                    <Button size="sm" variant="destructive" onClick={() => handleUserAction(user.id, "ban")}>
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
  )
}

function AnalyticsDashboard() {
  const stats = {
    totalReports: 1247,
    resolvedIssues: 892,
    activeUsers: 3456,
    pendingMasterVotes: 23,
    completionRate: 71.5,
    avgResponseTime: "2.3 days",
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{stats.totalReports.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Reports</div>
              <div className="text-xs text-primary">+12% this month</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{stats.resolvedIssues.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Resolved Issues</div>
              <div className="text-xs text-primary">+8% this month</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{stats.activeUsers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
              <div className="text-xs text-primary">+15% this month</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{stats.pendingMasterVotes}</div>
              <div className="text-sm text-muted-foreground">Pending Master Votes</div>
              <div className="text-xs text-yellow-500">Requires attention</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{stats.completionRate}%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
              <div className="text-xs text-primary">+3% this month</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{stats.avgResponseTime}</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
              <div className="text-xs text-primary">-0.5 days</div>
            </div>
          </div>
        </Card>
      </div>

      {/* City Performance */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">City Performance</h3>
        <div className="space-y-4">
          {["Ranchi", "Dhanbad", "Jamshedpur", "Bokaro"].map((city, index) => {
            const performance = [85, 72, 68, 79][index]
            return (
              <div key={city} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-card-foreground font-medium">{city}</span>
                  <span className="text-muted-foreground">{performance}% completion rate</span>
                </div>
                <Progress value={performance} className="h-2" />
              </div>
            )
          })}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Recent Admin Activity</h3>
        <div className="space-y-3">
          {[
            { action: "Master Vote approved", item: "Pothole report #1247", time: "5 minutes ago" },
            { action: "User suspended", item: "spam_user@example.com", time: "1 hour ago" },
            { action: "Master Vote rejected", item: "Invalid report #1246", time: "2 hours ago" },
            { action: "Report resolved", item: "Street light issue #1245", time: "4 hours ago" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div>
                <div className="text-sm font-medium text-card-foreground">{activity.action}</div>
                <div className="text-xs text-muted-foreground">{activity.item}</div>
              </div>
              <div className="text-xs text-muted-foreground">{activity.time}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground">Manage reports, users, and system analytics</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-muted">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="reports">
          <ReportManagement />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">System Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Master Vote Threshold</label>
                <Input type="number" defaultValue="25" className="bg-input border-border text-foreground w-32" />
                <p className="text-xs text-muted-foreground">Minimum community votes required before Master Vote</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Auto-resolve Threshold</label>
                <Input type="number" defaultValue="90" className="bg-input border-border text-foreground w-32" />
                <p className="text-xs text-muted-foreground">Completion rate percentage for auto-resolution</p>
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Settings</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
