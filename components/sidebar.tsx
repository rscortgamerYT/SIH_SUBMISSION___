"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Home,
  Trophy,
  AlertCircle,
  FileText,
  Map,
  MessageSquare,
  BarChart3,
  Bell,
  Settings,
  Menu,
  X,
  Shield,
  Brain,
  Zap,
  Users,
  Glasses,
  CopySlash as Crystal,
} from "lucide-react"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  isAdminMode?: boolean
}

const sidebarItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "live-issues", label: "Live Reports", icon: AlertCircle },
  { id: "reports", label: "Community Reports", icon: FileText },
  { id: "map", label: "Map", icon: Map },
  { id: "ar-vr-reporting", label: "AR/VR Reporting", icon: Glasses },
  { id: "disaster", label: "Disaster Mgmt", icon: AlertCircle },
  { id: "petitions", label: "Petitions", icon: Trophy },
  { id: "social-sources", label: "Social Sources", icon: Bell },
  { id: "know-community", label: "Know Community", icon: Users },
  { id: "neighborhood-pulse", label: "Neighborhood Pulse", icon: Zap },
  { id: "issue-prediction", label: "Issue Prediction", icon: Crystal },
  { id: "discussions", label: "Discussions", icon: MessageSquare },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "personal-notifications", label: "Personal Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
]

const adminItems = [
  { id: "admin", label: "Admin Panel", icon: Shield },
  { id: "ai-suggestions", label: "AI Insights", icon: Brain },
]

export function Sidebar({ activeSection, onSectionChange, isAdminMode = false }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const items = [...sidebarItems, ...adminItems]

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90 border border-border/50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-background/80 backdrop-blur-sm border-r border-border/50 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-border/50">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <img src="/township-logo.png" alt="TownShip" className="w-8 h-8" />
                <div>
                  <h2 className="text-lg font-bold text-foreground">TownShip</h2>
                  <p className="text-xs text-primary font-medium">Empowering Communities</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-foreground hover:bg-background/50"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              const isPulse = item.id === "neighborhood-pulse"
              const isPrediction = item.id === "issue-prediction"
              const isDisaster = item.id === "disaster"
              const isARVR = item.id === "ar-vr-reporting"

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-12 transition-all duration-200 hover:scale-105",
                    isActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                      : "text-foreground hover:bg-primary/10 hover:text-primary",
                    isCollapsed && "justify-center px-0",
                    isPulse &&
                      !isActive &&
                      "hover:shadow-emerald-400/25 hover:border-emerald-400/30 border border-transparent",
                    isPulse && isActive && "shadow-emerald-400/50",
                    isPrediction &&
                      !isActive &&
                      "hover:shadow-purple-400/25 hover:border-purple-400/30 border border-transparent",
                    isPrediction && isActive && "shadow-purple-400/50",
                  )}
                  onClick={() => {
                    onSectionChange(item.id)
                    setIsMobileOpen(false)
                    console.log("[v0] Sidebar navigation clicked:", item.id)
                  }}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isCollapsed ? "mx-auto" : "",
                      isPulse && "animate-pulse",
                      isPrediction && "animate-pulse",
                      !isActive && isDisaster && "animate-pulse text-red-500",
                      !isActive && isARVR && "animate-pulse text-cyan-400",
                    )}
                  />
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                  {!isCollapsed && isPulse && (
                    <span className="ml-auto text-xs bg-emerald-500 text-white px-2 py-1 rounded-full font-medium">
                      NEW
                    </span>
                  )}
                  {!isCollapsed && isPrediction && (
                    <span className="ml-auto text-xs bg-purple-500 text-white px-2 py-1 rounded-full font-medium">
                      AI
                    </span>
                  )}
                </Button>
              )
            })}
          </nav>

          {!isCollapsed && (
            <div className="p-4 border-t border-border/50">
              <div className="text-center space-y-1">
                <p className="text-xs text-primary font-semibold">Empowering Voices</p>
                <p className="text-xs text-muted-foreground">Building Better Communities</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
