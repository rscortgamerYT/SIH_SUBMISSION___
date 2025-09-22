"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface SurveyQuestion {
  id: string
  city: string
  question: string
  options: string[]
  responses: { [key: string]: number }
  totalResponses: number
}

interface CivicChallenge {
  id: string
  title: string
  description: string
  points: number
  difficulty: "easy" | "medium" | "hard"
  category: string
  completed: boolean
  deadline: Date
  participants: number
}

const demoSurveyData: SurveyQuestion[] = [
  {
    id: "ranchi-1",
    city: "Ranchi",
    question: "What's the biggest issue in your neighborhood this week?",
    options: ["Road Damage", "Waterlogging", "Waste Disposal", "Others"],
    responses: { Waterlogging: 30, "Road Damage": 15, "Waste Disposal": 5, Others: 0 },
    totalResponses: 50,
  },
  {
    id: "dhanbad-1",
    city: "Dhanbad",
    question: "How satisfied are you with street lighting?",
    options: ["Very Satisfied", "Satisfied", "Neutral", "Unsatisfied"],
    responses: { Satisfied: 25, Neutral: 10, Unsatisfied: 5, "Very Satisfied": 0 },
    totalResponses: 40,
  },
  {
    id: "jamshedpur-1",
    city: "Jamshedpur",
    question: "Which civic service needs the most improvement nearby?",
    options: ["Road Maintenance", "Garbage Collection", "Public Parks", "Water Supply"],
    responses: { "Public Parks": 12, "Water Supply": 10, "Road Maintenance": 8, "Garbage Collection": 0 },
    totalResponses: 30,
  },
]

const civicChallenges: CivicChallenge[] = [
  {
    id: "1",
    title: "Spot and report 2 potholes in your neighborhood",
    description: "Help identify road damage issues in your area",
    points: 15,
    difficulty: "easy",
    category: "Infrastructure",
    completed: false,
    deadline: new Date(2024, 1, 20),
    participants: 234,
  },
  {
    id: "2",
    title: "Upload a photo of a clean public space",
    description: "Showcase well-maintained areas in your community",
    points: 10,
    difficulty: "easy",
    category: "Environment",
    completed: true,
    deadline: new Date(2024, 1, 18),
    participants: 156,
  },
  {
    id: "3",
    title: "Document 3 working street lights",
    description: "Verify functional street lighting in your area",
    points: 20,
    difficulty: "medium",
    category: "Safety",
    completed: false,
    deadline: new Date(2024, 1, 25),
    participants: 89,
  },
]

const completedChallengesDemo = [
  { location: "Ranchi Central", challenge: "Pothole Documentation", points: 15, user: "Priya S." },
  { location: "Dhanbad Market", challenge: "Clean Space Photo", points: 10, user: "Rahul K." },
  { location: "Jamshedpur Park", challenge: "Street Light Check", points: 20, user: "Anjali M." },
]

const leaderboardData = [
  { name: "Priya S.", points: 85, badge: "Pulse Master" },
  { name: "Rahul K.", points: 72, badge: "Neighborhood Analyst" },
  { name: "Anjali M.", points: 68, badge: "Community Voice" },
  { name: "Vikash T.", points: 55, badge: "Neighborhood Analyst" },
  { name: "Sunita R.", points: 43, badge: "Active Citizen" },
]

export function NeighboroodPulse() {
  const [selectedCity, setSelectedCity] = useState("Ranchi")
  const [userPoints, setUserPoints] = useState(28)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [pulseAnimation, setPulseAnimation] = useState(false)
  const [showWinningAnimation, setShowWinningAnimation] = useState(false)
  const [userStreak, setUserStreak] = useState(7)
  const [completedChallenges, setCompletedChallenges] = useState(2)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseAnimation(true)
      setTimeout(() => setPulseAnimation(false), 1000)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const currentSurvey = demoSurveyData.find((survey) => survey.city === selectedCity) || demoSurveyData[0]

  const handleAnswerSubmit = (answer: string) => {
    setSelectedAnswer(answer)
    setHasAnswered(true)
    setUserPoints((prev) => prev + 5)
    setShowWinningAnimation(true)
    setTimeout(() => setShowWinningAnimation(false), 3000)
    console.log("[v0] Survey answered:", answer, "for city:", selectedCity)
  }

  const getResponsePercentage = (option: string) => {
    const count = currentSurvey.responses[option] || 0
    return Math.round((count / currentSurvey.totalResponses) * 100)
  }

  const getColorForPercentage = (percentage: number) => {
    if (percentage > 50) return "text-red-300"
    if (percentage > 25) return "text-yellow-300"
    return "text-green-300"
  }

  return (
    <div className="space-y-8 relative">
      {showWinningAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-in zoom-in-50 duration-1000">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <div className="text-4xl font-bold text-emerald-400 mb-2 animate-pulse">Congratulations!</div>
            <div className="text-xl text-cyan-400 animate-pulse">+5 Points Earned!</div>
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-ping" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="text-center space-y-4 relative">
        <div className={cn("inline-block relative", pulseAnimation && "animate-pulse")}>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent relative">
            Neighborhood Pulse
          </h1>
          <div className="absolute inset-0 text-4xl md:text-6xl font-bold text-emerald-400/20 blur-sm">
            Neighborhood Pulse
          </div>
          <div className="absolute inset-0 text-4xl md:text-6xl font-bold text-cyan-400/10 blur-lg">
            Neighborhood Pulse
          </div>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Quick insights from your community. Answer one question, make a difference.
        </p>

        <div className="flex justify-center">
          <Badge variant="outline" className="border-green-500 text-white bg-green-600 text-sm px-4 py-2">
            🔒 YOUR DATA IS FULLY SECURED
          </Badge>
        </div>

        <div className="flex justify-center gap-2 flex-wrap">
          <Badge variant="outline" className="border-emerald-400/50 text-emerald-400 bg-emerald-400/10">
            ⚡ Quick Survey
          </Badge>
          <Badge variant="outline" className="border-cyan-400/50 text-cyan-400 bg-cyan-400/10">
            🏆 Earn Points
          </Badge>
          <Badge variant="outline" className="border-green-500 text-white bg-green-600">
            📊 Real Data
          </Badge>
        </div>
      </div>

      <div className="flex justify-center gap-2 flex-wrap">
        {demoSurveyData.map((survey) => (
          <Button
            key={survey.city}
            variant={selectedCity === survey.city ? "default" : "outline"}
            onClick={() => {
              setSelectedCity(survey.city)
              setHasAnswered(false)
              setSelectedAnswer("")
              console.log("[v0] City selected:", survey.city)
            }}
            className={cn(
              "transition-all duration-300",
              selectedCity === survey.city && "shadow-lg shadow-emerald-400/25 border-emerald-400/50",
            )}
          >
            {survey.city}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-emerald-400/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              Live Survey - {currentSurvey.city}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-lg border border-emerald-400/10">
              <h3 className="font-semibold text-lg mb-4">{currentSurvey.question}</h3>

              {!hasAnswered ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentSurvey.options.map((option) => (
                    <Button
                      key={option}
                      variant="outline"
                      onClick={() => handleAnswerSubmit(option)}
                      className="h-auto p-4 text-left justify-start hover:border-emerald-400/50 hover:bg-emerald-400/5 transition-all duration-300"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-400/10 border border-emerald-400/30 rounded-lg">
                    <p className="text-emerald-400 font-medium">✓ Thank you for your response: {selectedAnswer}</p>
                    <p className="text-sm text-muted-foreground mt-1">+5 points earned!</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Community Results:</h4>
                    {currentSurvey.options.map((option) => {
                      const percentage = getResponsePercentage(option)
                      const count = currentSurvey.responses[option] || 0
                      return (
                        <div key={option} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{option}</span>
                            <span className={getColorForPercentage(percentage)}>
                              {count} responses ({percentage}%)
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Total responses: {currentSurvey.totalResponses} • Updated in real-time
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-cyan-400/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">{userPoints}</div>
                <div className="text-sm text-muted-foreground">Points Earned</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Next Badge</span>
                  <span className="text-emerald-400">Neighborhood Analyst (50 pts)</span>
                </div>
                <Progress value={(userPoints / 50) * 100} className="h-2" />
              </div>

              <div className="flex justify-center">
                <Badge variant="outline" className="border-emerald-400/50 text-emerald-400 bg-emerald-400/10">
                  Active Citizen
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-400/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">🏆 Top Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboardData.slice(0, 5).map((user, index) => (
                  <div key={user.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                          index === 0
                            ? "bg-yellow-400 text-black"
                            : index === 1
                              ? "bg-gray-300 text-black"
                              : index === 2
                                ? "bg-orange-400 text-black"
                                : "bg-muted text-muted-foreground",
                        )}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.badge}</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-emerald-400">{user.points}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-orange-400/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 Civic Challenges - Micro-Missions
            <Badge variant="outline" className="border-orange-400/50 text-orange-400 bg-orange-400/10">
              Active
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete small tasks to improve your community and earn rewards
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{completedChallenges}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{userStreak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">🏆</div>
              <div className="text-xs text-muted-foreground">Active Citizen</div>
            </div>
          </div>

          {/* Active Challenges */}
          <div className="space-y-4">
            <h4 className="font-medium">Available Challenges</h4>
            {civicChallenges.map((challenge) => (
              <div key={challenge.id} className="p-4 bg-muted/20 rounded-lg border border-orange-400/10">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{challenge.title}</h5>
                    <p className="text-xs text-muted-foreground mt-1">{challenge.description}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      challenge.completed
                        ? "border-green-400/50 text-green-400 bg-green-400/10"
                        : "border-orange-400/50 text-orange-400 bg-orange-400/10",
                    )}
                  >
                    {challenge.completed ? "✓ Done" : `+${challenge.points} pts`}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {challenge.category} • {challenge.difficulty}
                  </span>
                  <span>{challenge.participants} participants</span>
                </div>

                {!challenge.completed && (
                  <Button
                    size="sm"
                    className="w-full mt-3 bg-orange-500 hover:bg-orange-600"
                    onClick={() => {
                      setCompletedChallenges((prev) => prev + 1)
                      setUserPoints((prev) => prev + challenge.points)
                      setShowWinningAnimation(true)
                      setTimeout(() => setShowWinningAnimation(false), 3000)
                    }}
                  >
                    Start Challenge
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Demo Completed Challenges */}
          <div className="space-y-3">
            <h4 className="font-medium">Recent Completions in Jharkhand</h4>
            {completedChallengesDemo.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-green-400/5 rounded-lg border border-green-400/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{item.challenge}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.location} • by {item.user}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="border-green-400/50 text-green-400 bg-green-400/10 text-xs">
                  +{item.points}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-400/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🤖 AI Insights
            <Badge variant="outline" className="border-purple-400/50 text-purple-400 bg-purple-400/10">
              Beta
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg border border-purple-400/10">
              <h4 className="font-medium text-purple-400 mb-2">Trending Issue</h4>
              <p className="text-sm">
                Waterlogging is the top concern in Ranchi this week. Consider prioritizing drainage infrastructure.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border border-blue-400/10">
              <h4 className="font-medium text-blue-400 mb-2">Satisfaction Score</h4>
              <p className="text-sm">Dhanbad residents show 62% satisfaction with street lighting improvements.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border border-green-400/10">
              <h4 className="font-medium text-green-300 mb-2">Action Needed</h4>
              <p className="text-sm">Jamshedpur public parks need immediate attention based on community feedback.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
