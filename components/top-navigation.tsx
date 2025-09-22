"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, HelpCircle, Headphones, Bell, AlertTriangle, LogIn } from "lucide-react"

interface TopNavigationProps {
  onAdminLogin?: () => void
  onOpenNotifications?: () => void
  onOpenDisaster?: () => void
  onOpenUserPanel?: () => void
}

export function TopNavigation({ onAdminLogin, onOpenNotifications, onOpenDisaster, onOpenUserPanel }: TopNavigationProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isUserLoginOpen, setIsUserLoginOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isRinging, setIsRinging] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null)
  const walkthroughText = useMemo(
    () =>
      "Welcome to TownShip. From the Home screen, you can view highlights and start reporting issues. The Live Reports section shows recent community submissions. Use Submit Report to file a new issue with photos and a description. Community Reports aggregates popular reports gaining traction. The Map helps visualize issues by location. Discussions enable conversation around civic topics. Analytics shows trends and outcomes. Notifications keep you updated about budgets, status changes, and downtime. The Admin Panel allows city officials to review, vote, and manage reports. Explore AI Insights for smart suggestions and Neighborhood Pulse for hyperlocal activity.",
    [],
  )

  useEffect(() => {
    if (!isRinging) return
    const timer = setTimeout(() => setIsRinging(false), 10000)
    return () => clearTimeout(timer)
  }, [isRinging])

  useEffect(() => {
    const onAdminAlert = () => setIsRinging(true)
    if (typeof window !== "undefined") {
      window.addEventListener("admin-alert", onAdminAlert as EventListener)
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("admin-alert", onAdminAlert as EventListener)
      }
    }
  }, [])

  const handleLogin = () => {
    setIsChecking(true)
    setTimeout(() => {
      setIsChecking(false)
      alert("Checking credentials...\nAccess granted.")
      setIsLoginOpen(false)
      onAdminLogin?.()
    }, 900)
  }

  const handleUserLogin = () => {
    setIsChecking(true)
    setTimeout(() => {
      setIsChecking(false)
      alert("Checking credentials...\nAccess granted.")
      setIsUserLoginOpen(false)
      onOpenUserPanel?.()
    }, 900)
  }

  const playWalkthrough = () => {
    try {
      if (typeof window === "undefined") return
      const synth = window.speechSynthesis
      if (!synth) {
        alert("Speech not supported on this browser.")
        return
      }
      if (synth.speaking) {
        synth.cancel()
        setIsSpeaking(false)
        utterRef.current = null
        return
      }
      const utterance = new SpeechSynthesisUtterance(walkthroughText)
      utterance.rate = 1
      utterance.pitch = 1
      utterance.lang = "en-IN"
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => {
        setIsSpeaking(false)
        utterRef.current = null
      }
      utterRef.current = utterance
      synth.speak(utterance)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    return () => {
      try {
        if (typeof window !== "undefined" && window.speechSynthesis?.speaking) {
          window.speechSynthesis.cancel()
        }
      } catch {}
    }
  }, [])

  return (
    <header className="fixed top-0 right-0 left-0 z-30 h-16 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500/40 via-cyan-500/30 to-blue-500/30 blur-md rounded-full"></div>
            <div className="relative p-1 rounded-full bg-gradient-to-br from-emerald-600 to-cyan-600">
              <div className="rounded-full bg-background p-1">
                <Image src="/township-logo.png" alt="TownShip Logo" width={40} height={40} className="object-contain rounded-full" />
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">TownShip</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Beta</span>
            </div>
            <div className="relative">
              <p className="text-xs text-muted-foreground">Empowering Jharkhand Communities</p>
              <div className="absolute left-0 -bottom-1 h-px w-24 bg-gradient-to-r from-emerald-500 via-cyan-500 to-transparent animate-pulse" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Blinking Disaster Alert (always visible) */}
          <Button
            variant="destructive"
            className="gap-2 animate-pulse"
            onClick={() => onOpenDisaster?.()}
            title="Open Alerts & Warnings"
          >
            <AlertTriangle className="h-4 w-4" />
            Alerts & Warnings
          </Button>

          {/* Audio Walkthrough */}
          <Button
            variant="outline"
            className="gap-2"
            onClick={playWalkthrough}
            title="Audio walkthrough"
          >
            <Headphones className="h-4 w-4" />
            {isSpeaking ? "Stop Walkthrough" : "Audio Walkthrough"}
          </Button>


          {/* Help Dialog */}
          <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2" title="Help and guidance">
                <HelpCircle className="h-4 w-4" />
                Help
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">How to use TownShip</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm text-card-foreground">
                <div>
                  <strong>Live Reports:</strong> See incoming issues from your community in real time.
                </div>
                <div>
                  <strong>Submit Report:</strong> File a new issue with photos, location and description.
                </div>
                <div>
                  <strong>Community Reports:</strong> Popular reports that gather support and updates.
                </div>
                <div>
                  <strong>Map:</strong> Visualize issues across neighborhoods.
                </div>
                <div>
                  <strong>Notifications:</strong> Budget, status and maintenance alerts.
                </div>
                <div>
                  <strong>Petitions:</strong> Start and sign petitions for civic change.
                </div>
                <div>
                  <strong>Admin Panel:</strong> For officials to review, vote and manage.
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Notification Bell */}
          <Button
            variant="ghost"
            className="relative"
            onClick={() => onOpenNotifications?.()}
            title="Open notifications"
          >
            <Bell
              className={
                "h-5 w-5 " + (isRinging ? "text-red-500 animate-bounce" : "text-foreground")
              }
            />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </Button>


          {/* User Login (opens in-app user panel view) */}
          <Dialog open={isUserLoginOpen} onOpenChange={setIsUserLoginOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2" title="User Login">
                <LogIn className="h-4 w-4" />
                User Login
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">User Login</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="text-sm text-muted-foreground">Demo only — any input will proceed.</div>
                <Input placeholder="Email" className="bg-input border-border" />
                <Input placeholder="Password" type="password" className="bg-input border-border" />
                <Button className="w-full" onClick={handleUserLogin} disabled={isChecking}>
                  {isChecking ? "Checking..." : "Login"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Admin Login */}
          <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 hover:scale-105 transition-all duration-200">
                <User className="h-4 w-4" />
                Admin Login
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">TownShip Admin Login</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-card-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@township.gov"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-card-foreground">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div className="text-xs text-muted-foreground p-2 bg-muted/20 rounded">
                  Demo credentials: admin@township.gov / admin123
                </div>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleLogin}>
                  Access Admin Panel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  )
}
