"use client"

import Image from "next/image"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThumbsDown, ThumbsUp } from "lucide-react"

const officials = [
  {
    role: "Municipality Head",
    name: "Anil Verma",
    email: "anil.verma@jhmunicipality.gov.in",
    phone: "+91 98765 43210",
    office: "Municipal Corp HQ, Ranchi",
    photo: "/placeholder-user.jpg",
  },
  {
    role: "Electricity In-charge",
    name: "Priya Sharma",
    email: "priya.sharma@power.jh.gov.in",
    phone: "+91 99870 11223",
    office: "Electricity Board Office, Dhanbad",
    photo: "/indian-woman-avatar.png",
  },
  {
    role: "Cleanliness In-charge",
    name: "Rahul Kumar",
    email: "rahul.kumar@clean.jh.gov.in",
    phone: "+91 90909 80808",
    office: "Sanitation Dept, Jamshedpur",
    photo: "/indian-man-avatar.png",
  },
  { role: "MLA", name: "Rabindra Nath Mahto", email: "rabindra.mahto@jh.gov.in", phone: "+91 90123 45678", office: "Sindri, Dhanbad", photo: "/placeholder-user.jpg" },
  { role: "Mayor", name: "Jai Prakash Verma", email: "jp.verma@ranchi.gov.in", phone: "+91 90234 56789", office: "Ranchi Municipal Corp", photo: "/placeholder-user.jpg" },
  { role: "MP", name: "Bidyut Baran Mahato", email: "bidyut.mahato@parliament.in", phone: "+91 90345 67890", office: "Jamshedpur", photo: "/placeholder-user.jpg" },
]

export function KnowYourCommunity() {
  const [scores, setScores] = useState<Record<string, { up: number; down: number }>>({})
  const satisfaction = (name: string) => {
    const s = scores[name] || { up: 0, down: 0 }
    const total = s.up + s.down
    return total === 0 ? 50 : Math.round((s.up / total) * 100)
  }
  const vote = (name: string, delta: 1 | -1) => {
    setScores((prev) => {
      const s = prev[name] || { up: 0, down: 0 }
      return { ...prev, [name]: { up: s.up + (delta > 0 ? 1 : 0), down: s.down + (delta < 0 ? 1 : 0) } }
    })
  }
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Know Your Community</h2>
        <p className="text-sm text-muted-foreground">Key municipal officials, facilities, and community stats</p>
      </div>

      {/* Officials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {officials.map((o) => (
          <Card key={o.email} className="bg-card border-border overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-card-foreground text-lg">{o.name}</span>
                <Badge className="bg-primary text-primary-foreground text-xs">{o.role}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <div className="relative h-16 w-16 rounded-full overflow-hidden shrink-0">
                <Image src={o.photo} alt={o.name} fill sizes="64px" className="object-cover" />
              </div>
              <div className="text-sm flex-1">
                <div className="text-card-foreground">{o.office}</div>
                <div className="text-muted-foreground">{o.email}</div>
                <div className="text-muted-foreground">{o.phone}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-muted-foreground">Satisfaction: <span className="text-card-foreground font-semibold">{satisfaction(o.name)}%</span></div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="outline" onClick={() => vote(o.name, 1)}>
                      <ThumbsUp className="h-3 w-3 mr-1" /> Upvote
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => vote(o.name, -1)}>
                      <ThumbsDown className="h-3 w-3 mr-1" /> Downvote
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Facilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Hospitals", "Police Stations", "Fire Stations"].map((cat, idx) => (
          <Card key={idx} className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground">{cat}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div>Ranchi: {20 + idx * 3}</div>
              <div>Dhanbad: {16 + idx * 2}</div>
              <div>Jamshedpur: {14 + idx * 2}</div>
              <div>Bokaro: {12 + idx}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Active Volunteers", value: 482 },
          { label: "Neighborhood Groups", value: 36 },
          { label: "Monthly Cleanups", value: 14 },
          { label: "Citizen Workshops", value: 9 },
        ].map((s, i) => (
          <Card key={i} className="bg-card border-border p-4 text-center">
            <div className="text-2xl font-bold text-card-foreground">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}


