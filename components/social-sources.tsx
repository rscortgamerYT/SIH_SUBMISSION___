"use client"
import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Instagram, Mail, MessageCircle, AtSign } from "lucide-react"

const demoSocial = {
  twitter: 28,
  facebook: 16,
  instagram: 12,
  reddit: 9,
  youtube: 7,
}

export function SocialSources() {
  const total = useMemo(() => Object.values(demoSocial).reduce((a, b) => a + b, 0), [])
  const segments = useMemo(() => {
    let acc = 0
    return Object.entries(demoSocial).map(([name, value]) => {
      const start = acc / total
      const len = value / total
      acc += value
      const color =
        name === "twitter" ? "#1DA1F2" : name === "facebook" ? "#1877F2" : name === "instagram" ? "#E1306C" : "#FF4500"
      return { name, value, start, len, color }
    })
  }, [total])

  // Simple local voting state for demo polls
  const [pollVotes, setPollVotes] = useState<Record<string, number>>({
    "Ward budget tracker": 42,
    "Offline SMS reporting": 31,
    "Anonymous whistleblower mode": 26,
    "Open API for civic data": 18,
  })

  const handleVote = (key: string, delta: number) => {
    setPollVotes((prev) => ({ ...prev, [key]: Math.max(0, (prev[key] ?? 0) + delta) }))
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Social Sources</h2>
        <p className="text-sm text-muted-foreground">Platform-wise civic issue alerts detected</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Per-platform Alerts (Last 24h)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(demoSocial).map(([platform, count]) => (
              <div key={platform} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <span className="capitalize text-card-foreground">{platform}</span>
                <Badge className="bg-primary text-primary-foreground">{count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Alert Share</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 42 42" className="h-48 w-48 -rotate-90">
                <circle cx="21" cy="21" r="15.915" fill="none" stroke="#2d2d2d" strokeWidth="5" />
                {segments.map((s, i) => (
                  <circle
                    key={s.name}
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="none"
                    stroke={s.color}
                    strokeWidth="5"
                    strokeDasharray={`${(s.len * 100).toFixed(2)} ${100 - s.len * 100}`}
                    strokeDashoffset={`${(100 - s.start * 100).toFixed(2)}`}
                  />
                ))}
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {segments.map((s) => (
                <div key={s.name} className="flex items-center gap-2 text-sm">
                  <span className="inline-block h-3 w-3 rounded-sm" style={{ background: s.color }}></span>
                  <span className="capitalize text-card-foreground">
                    {s.name} - {demoSocial[s.name as keyof typeof demoSocial]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social Help Box */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">How to Report via Social Platforms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-card-foreground">
          <div className="flex items-center gap-2">
            <Instagram className="h-4 w-4" />
            <div><strong>Instagram:</strong> Follow our page and DM — @TownShipJharkhand</div>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <div><strong>WhatsApp:</strong> Send a message with images — +91 90000 12345</div>
          </div>
          <div className="flex items-center gap-2">
            <AtSign className="h-4 w-4" />
            <div><strong>X (Twitter):</strong> Tag us in your post — @TownShip_JHK</div>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <div><strong>Email:</strong> Send detailed reports — reports@township.gov.in</div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Requests + Polls */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">New Feature Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.keys(pollVotes).map((key) => (
            <div key={key} className="p-3 rounded bg-muted/20 border border-border">
              <div className="text-sm font-medium text-card-foreground">{key}</div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-muted-foreground">Votes: {pollVotes[key]}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleVote(key, 1)} className="px-2 py-1 text-xs rounded bg-primary text-white">Upvote</button>
                  <button onClick={() => handleVote(key, -1)} className="px-2 py-1 text-xs rounded border border-border">Downvote</button>
                </div>
              </div>
            </div>
          ))}
          <div className="text-xs text-muted-foreground">These are demo polls for gathering interest on upcoming features.</div>
        </CardContent>
      </Card>
    </div>
  )
}


