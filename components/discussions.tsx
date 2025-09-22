"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, ThumbsUp, ThumbsDown, Reply, TrendingUp, Clock, Vote } from "lucide-react"

interface Discussion {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
    reputation: number
  }
  votes: { up: number; down: number }
  replies: number
  createdAt: Date
  tags: string[]
  isPoll?: boolean
  pollOptions?: { option: string; votes: number }[]
  isHot?: boolean
}

const mockDiscussions: Discussion[] = [
  {
    id: "1",
    title: "Should we prioritize pothole repairs over street lighting?",
    content:
      "Given the limited municipal budget, what should be our priority for Q2 2024? The main road potholes are causing traffic issues, but the lack of street lighting is a safety concern.",
    author: {
      name: "Priya Sharma",
      avatar: "/indian-woman-avatar.png",
      reputation: 1250,
    },
    votes: { up: 45, down: 8 },
    replies: 23,
    createdAt: new Date(2024, 0, 15),
    tags: ["infrastructure", "budget", "priority"],
    isPoll: true,
    pollOptions: [
      { option: "Pothole repairs first", votes: 67 },
      { option: "Street lighting first", votes: 43 },
      { option: "Split budget equally", votes: 28 },
    ],
    isHot: true,
  },
  {
    id: "2",
    title: "Water supply disruption in Sector 5 - Community Response",
    content:
      "The water supply has been disrupted for 3 days now. Local residents are organizing to provide temporary solutions. How can we make this more systematic?",
    author: {
      name: "Rajesh Kumar",
      avatar: "/indian-man-avatar.png",
      reputation: 890,
    },
    votes: { up: 32, down: 2 },
    replies: 18,
    createdAt: new Date(2024, 0, 14),
    tags: ["water", "emergency", "community"],
    isHot: true,
  },
  {
    id: "3",
    title: "Waste management improvement suggestions",
    content:
      "After the recent garbage overflow incidents, what are some practical solutions we can implement? I've seen some interesting approaches in other cities.",
    author: {
      name: "Anita Devi",
      avatar: "/indian-woman-avatar.png",
      reputation: 650,
    },
    votes: { up: 28, down: 5 },
    replies: 15,
    createdAt: new Date(2024, 0, 13),
    tags: ["waste", "solutions", "environment"],
  },
  {
    id: "4",
    title: "Traffic signal timing optimization at Market Square",
    content:
      "The current traffic light timing is causing unnecessary delays during peak hours. Has anyone analyzed the traffic patterns?",
    author: {
      name: "Vikram Singh",
      avatar: "/indian-man-avatar-glasses.jpg",
      reputation: 1100,
    },
    votes: { up: 22, down: 3 },
    replies: 12,
    createdAt: new Date(2024, 0, 12),
    tags: ["traffic", "optimization", "analysis"],
  },
]

export function Discussions() {
  const [discussions] = useState<Discussion[]>(mockDiscussions)
  const [newDiscussion, setNewDiscussion] = useState({ title: "", content: "" })
  const [selectedTag, setSelectedTag] = useState("all")
  const [sortBy, setSortBy] = useState("hot")

  const allTags = Array.from(new Set(discussions.flatMap((d) => d.tags)))

  const filteredDiscussions = discussions
    .filter((d) => selectedTag === "all" || d.tags.includes(selectedTag))
    .sort((a, b) => {
      if (sortBy === "hot") return (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0)
      if (sortBy === "votes") return b.votes.up - b.votes.down - (a.votes.up - a.votes.down)
      if (sortBy === "recent") return b.createdAt.getTime() - a.createdAt.getTime()
      return 0
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Community Discussions</h2>
          <p className="text-muted-foreground">Engage with your community on civic issues</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <MessageSquare className="h-4 w-4 mr-2" />
          Start Discussion
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground">Filter by:</span>
        <Button variant={selectedTag === "all" ? "default" : "outline"} size="sm" onClick={() => setSelectedTag("all")}>
          All
        </Button>
        {allTags.map((tag) => (
          <Button
            key={tag}
            variant={selectedTag === tag ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </Button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex gap-2 items-center">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <Button variant={sortBy === "hot" ? "default" : "outline"} size="sm" onClick={() => setSortBy("hot")}>
          <TrendingUp className="h-4 w-4 mr-1" />
          Hot
        </Button>
        <Button variant={sortBy === "votes" ? "default" : "outline"} size="sm" onClick={() => setSortBy("votes")}>
          <ThumbsUp className="h-4 w-4 mr-1" />
          Top Voted
        </Button>
        <Button variant={sortBy === "recent" ? "default" : "outline"} size="sm" onClick={() => setSortBy("recent")}>
          <Clock className="h-4 w-4 mr-1" />
          Recent
        </Button>
      </div>

      {/* Discussions List */}
      <div className="space-y-4">
        {filteredDiscussions.map((discussion) => (
          <Card key={discussion.id} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={discussion.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {discussion.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-card-foreground">{discussion.title}</h3>
                      {discussion.isHot && (
                        <Badge className="bg-red-500 text-white">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Hot
                        </Badge>
                      )}
                      {discussion.isPoll && (
                        <Badge className="bg-blue-500 text-white">
                          <Vote className="h-3 w-3 mr-1" />
                          Poll
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{discussion.author.name}</span>
                      <span>•</span>
                      <span>{discussion.author.reputation} reputation</span>
                      <span>•</span>
                      <span>{discussion.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <p className="text-card-foreground">{discussion.content}</p>

              {/* Poll Options */}
              {discussion.isPoll && discussion.pollOptions && (
                <div className="space-y-2 bg-muted/20 p-4 rounded-lg">
                  <h4 className="font-medium text-card-foreground">Poll Results:</h4>
                  {discussion.pollOptions.map((option, index) => {
                    const total = discussion.pollOptions!.reduce((sum, opt) => sum + opt.votes, 0)
                    const percentage = total > 0 ? (option.votes / total) * 100 : 0
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-card-foreground">{option.option}</span>
                          <span className="text-muted-foreground">
                            {option.votes} votes ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {discussion.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {discussion.votes.up}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      {discussion.votes.down}
                    </Button>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Reply className="h-4 w-4" />
                    <span className="text-sm">{discussion.replies} replies</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Join Discussion
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
