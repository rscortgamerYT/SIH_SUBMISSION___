"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge as UIBadge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Trophy,
  Medal,
  Award,
  Target,
  MapPin,
  Calendar,
  Flame,
  Crown,
  Zap,
  CheckCircle,
  MessageSquare,
  ThumbsUp,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface User {
  id: string
  name: string
  avatar?: string
  city: string
  tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond"
  points: number
  level: number
  streak: number
  badges: {
    id: string
    name: string
    description: string
    icon: string
    rarity: "common" | "rare" | "epic" | "legendary"
    unlockedAt: Date
  }[]
  stats: {
    reportsSubmitted: number
    votesGiven: number
    issuesResolved: number
    commentsPosted: number
    masterVotes: number
  }
  joinedAt: Date
  lastActive: Date
  achievements: Achievement[]
}

interface Achievement {
  id: string
  name: string
  description: string
  progress: number
  target: number
  completed: boolean
  reward: number
  category: "reporting" | "voting" | "community" | "special"
}

interface Challenge {
  id: string
  name: string
  description: string
  type: "daily" | "weekly" | "monthly"
  progress: number
  target: number
  reward: number
  expiresAt: Date
  completed: boolean
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    avatar: "/indian-man-avatar.png",
    city: "Ranchi",
    tier: "Platinum",
    points: 2450,
    level: 12,
    streak: 15,
    badges: [
      {
        id: "1",
        name: "Top Reporter",
        description: "Submitted 50+ reports",
        icon: "🏆",
        rarity: "epic",
        unlockedAt: new Date(2024, 0, 10),
      },
      {
        id: "2",
        name: "Community Hero",
        description: "Helped resolve 25+ issues",
        icon: "🦸",
        rarity: "legendary",
        unlockedAt: new Date(2024, 0, 15),
      },
    ],
    stats: {
      reportsSubmitted: 67,
      votesGiven: 234,
      issuesResolved: 28,
      commentsPosted: 145,
      masterVotes: 12,
    },
    joinedAt: new Date(2023, 11, 1),
    lastActive: new Date(),
    achievements: [
      {
        id: "1",
        name: "First Report",
        description: "Submit your first civic report",
        progress: 1,
        target: 1,
        completed: true,
        reward: 50,
        category: "reporting",
      },
    ],
  },
  {
    id: "2",
    name: "Priya Singh",
    avatar: "/indian-woman-avatar.png",
    city: "Dhanbad",
    tier: "Gold",
    points: 1890,
    level: 9,
    streak: 8,
    badges: [
      {
        id: "3",
        name: "Master Voter",
        description: "Cast 100+ votes",
        icon: "🗳️",
        rarity: "rare",
        unlockedAt: new Date(2024, 0, 8),
      },
    ],
    stats: {
      reportsSubmitted: 34,
      votesGiven: 156,
      issuesResolved: 15,
      commentsPosted: 89,
      masterVotes: 5,
    },
    joinedAt: new Date(2023, 11, 15),
    lastActive: new Date(Date.now() - 1000 * 60 * 30),
    achievements: [],
  },
  {
    id: "3",
    name: "Amit Sharma",
    avatar: "/indian-man-avatar-glasses.jpg",
    city: "Jamshedpur",
    tier: "Silver",
    points: 1245,
    level: 7,
    streak: 3,
    badges: [
      {
        id: "4",
        name: "Early Adopter",
        description: "Joined in the first month",
        icon: "🚀",
        rarity: "rare",
        unlockedAt: new Date(2023, 11, 5),
      },
    ],
    stats: {
      reportsSubmitted: 23,
      votesGiven: 98,
      issuesResolved: 8,
      commentsPosted: 56,
      masterVotes: 2,
    },
    joinedAt: new Date(2023, 11, 5),
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
    achievements: [],
  },
]

const mockChallenges: Challenge[] = [
  {
    id: "1",
    name: "Daily Reporter",
    description: "Submit 3 reports today",
    type: "daily",
    progress: 1,
    target: 3,
    reward: 100,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12),
    completed: false,
  },
  {
    id: "2",
    name: "Community Voter",
    description: "Cast 20 votes this week",
    type: "weekly",
    progress: 12,
    target: 20,
    reward: 300,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
    completed: false,
  },
  {
    id: "3",
    name: "Resolution Master",
    description: "Help resolve 5 issues this month",
    type: "monthly",
    progress: 3,
    target: 5,
    reward: 1000,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
    completed: false,
  },
]

function UserCard({ user, rank, isCurrentUser = false }: { user: User; rank: number; isCurrentUser?: boolean }) {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Bronze":
        return "text-orange-600"
      case "Silver":
        return "text-gray-500"
      case "Gold":
        return "text-yellow-500"
      case "Platinum":
        return "text-blue-500"
      case "Diamond":
        return "text-purple-500"
      default:
        return "text-gray-500"
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "Bronze":
        return <Medal className="h-4 w-4 text-orange-600" />
      case "Silver":
        return <Medal className="h-4 w-4 text-gray-500" />
      case "Gold":
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case "Platinum":
        return <Crown className="h-4 w-4 text-blue-500" />
      case "Diamond":
        return <Crown className="h-4 w-4 text-purple-500" />
      default:
        return <Medal className="h-4 w-4" />
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-600" />
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
  }

  return (
    <Card
      className={cn(
        "p-4 bg-card border-border transition-all duration-200 hover:border-primary/50",
        isCurrentUser && "ring-2 ring-primary/50 bg-primary/5",
        rank <= 3 && "border-primary/30",
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8">{getRankIcon(rank)}</div>
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-card-foreground truncate">{user.name}</h3>
            {isCurrentUser && <UIBadge className="bg-primary/10 text-primary text-xs">You</UIBadge>}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{user.city}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              {getTierIcon(user.tier)}
              <span className={getTierColor(user.tier)}>{user.tier}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-lg font-bold text-primary">{user.points.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Level {user.level}</div>
        </div>

        <div className="flex items-center gap-1">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-medium text-orange-500">{user.streak}</span>
        </div>
      </div>

      {/* User Stats */}
      <div className="mt-4 grid grid-cols-5 gap-2 text-center">
        <div className="space-y-1">
          <div className="text-sm font-semibold text-card-foreground">{user.stats.reportsSubmitted}</div>
          <div className="text-xs text-muted-foreground">Reports</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm font-semibold text-card-foreground">{user.stats.votesGiven}</div>
          <div className="text-xs text-muted-foreground">Votes</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm font-semibold text-card-foreground">{user.stats.issuesResolved}</div>
          <div className="text-xs text-muted-foreground">Resolved</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm font-semibold text-card-foreground">{user.stats.commentsPosted}</div>
          <div className="text-xs text-muted-foreground">Comments</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm font-semibold text-card-foreground">{user.stats.masterVotes}</div>
          <div className="text-xs text-muted-foreground">Master</div>
        </div>
      </div>

      {/* Badges */}
      {user.badges.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {user.badges.slice(0, 3).map((badge) => (
            <UIBadge
              key={badge.id}
              variant="outline"
              className={cn(
                "text-xs",
                badge.rarity === "legendary" && "border-purple-500 text-purple-500",
                badge.rarity === "epic" && "border-blue-500 text-blue-500",
                badge.rarity === "rare" && "border-green-500 text-green-500",
              )}
            >
              {badge.icon} {badge.name}
            </UIBadge>
          ))}
          {user.badges.length > 3 && (
            <UIBadge variant="outline" className="text-xs">
              +{user.badges.length - 3} more
            </UIBadge>
          )}
        </div>
      )}
    </Card>
  )
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "daily":
        return "bg-green-500"
      case "weekly":
        return "bg-blue-500"
      case "monthly":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date()
    const diff = expiresAt.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 24) {
      return `${Math.floor(hours / 24)}d ${hours % 24}h`
    }
    return `${hours}h ${minutes}m`
  }

  return (
    <Card className="p-4 bg-card border-border">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UIBadge className={cn("text-white text-xs", getTypeColor(challenge.type))}>{challenge.type}</UIBadge>
            <h3 className="font-semibold text-card-foreground">{challenge.name}</h3>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">{challenge.reward}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{challenge.description}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-card-foreground">
              {challenge.progress}/{challenge.target}
            </span>
          </div>
          <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Expires in {getTimeRemaining(challenge.expiresAt)}</span>
          </div>
          {challenge.completed && (
            <div className="flex items-center gap-1 text-primary">
              <CheckCircle className="h-3 w-3" />
              <span>Completed</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

function UserProfile({ user }: { user: User }) {
  const nextLevelPoints = user.level * 200
  const currentLevelProgress = user.points % 200
  const progressPercentage = (currentLevelProgress / 200) * 100

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-6">
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
          <div className="flex-1">
            <h2 className="text-xl font-bold text-card-foreground">{user.name}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{user.city}</span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <UIBadge className="bg-primary/10 text-primary">Level {user.level}</UIBadge>
              <UIBadge variant="outline">{user.tier} Tier</UIBadge>
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-orange-500">{user.streak} day streak</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{user.points.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Level Progress</span>
            <span className="text-card-foreground">
              {currentLevelProgress}/200 to Level {user.level + 1}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <FileText className="h-6 w-6 text-primary mx-auto mb-1" />
            <div className="text-lg font-bold text-card-foreground">{user.stats.reportsSubmitted}</div>
            <div className="text-xs text-muted-foreground">Reports</div>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <ThumbsUp className="h-6 w-6 text-primary mx-auto mb-1" />
            <div className="text-lg font-bold text-card-foreground">{user.stats.votesGiven}</div>
            <div className="text-xs text-muted-foreground">Votes</div>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <CheckCircle className="h-6 w-6 text-primary mx-auto mb-1" />
            <div className="text-lg font-bold text-card-foreground">{user.stats.issuesResolved}</div>
            <div className="text-xs text-muted-foreground">Resolved</div>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <MessageSquare className="h-6 w-6 text-primary mx-auto mb-1" />
            <div className="text-lg font-bold text-card-foreground">{user.stats.commentsPosted}</div>
            <div className="text-xs text-muted-foreground">Comments</div>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <Award className="h-6 w-6 text-primary mx-auto mb-1" />
            <div className="text-lg font-bold text-card-foreground">{user.stats.masterVotes}</div>
            <div className="text-xs text-muted-foreground">Master Votes</div>
          </div>
        </div>

        {/* Badges */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-card-foreground">Badges & Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {user.badges.map((badge) => (
              <div
                key={badge.id}
                className={cn(
                  "p-3 rounded-lg border",
                  badge.rarity === "legendary" && "border-purple-500 bg-purple-500/5",
                  badge.rarity === "epic" && "border-blue-500 bg-blue-500/5",
                  badge.rarity === "rare" && "border-green-500 bg-green-500/5",
                  badge.rarity === "common" && "border-border bg-muted/20",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{badge.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-card-foreground">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Unlocked {badge.unlockedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

export function LeaderboardGamification() {
  const [activeTab, setActiveTab] = useState("global")
  const [selectedCity, setSelectedCity] = useState("all")
  const currentUser = mockUsers[0] // Simulate current user

  const cities = ["Ranchi", "Dhanbad", "Jamshedpur", "Bokaro"]
  const filteredUsers = selectedCity === "all" ? mockUsers : mockUsers.filter((user) => user.city === selectedCity)

  return (
    <div className="space-y-6">
      {/* User Profile Section */}
      <UserProfile user={currentUser} />

      {/* Challenges Section */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Active Challenges</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </Card>

      {/* Leaderboard Section */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">Community Leaderboard</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={selectedCity === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCity("all")}
            >
              All Cities
            </Button>
            {cities.map((city) => (
              <Button
                key={city}
                variant={selectedCity === city ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCity(city)}
              >
                {city}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredUsers.map((user, index) => (
            <UserCard key={user.id} user={user} rank={index + 1} isCurrentUser={user.id === currentUser.id} />
          ))}
        </div>
      </Card>
    </div>
  )
}
