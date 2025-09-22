"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { HeroSection } from "@/components/hero-section"
import { ReportSubmission } from "@/components/report-submission"
import { InteractiveMap } from "@/components/interactive-map"
import { LiveIssuesFeed } from "@/components/live-issues-feed"
import { LeaderboardGamification } from "@/components/leaderboard-gamification"
import { EnhancedAdminPanel } from "@/components/enhanced-admin-panel"
import { Discussions } from "@/components/discussions"
import { Analytics } from "@/components/analytics"
import { ExistingReports } from "@/components/existing-reports"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"
import { AISuggestions } from "@/components/ai-suggestions"
import { Notifications } from "@/components/notifications"
import { NeighboroodPulse } from "@/components/neighborhood-pulse"
import { RandomIssueSystem } from "@/components/random-issue-system"
import { IssuePredictionPortal } from "@/components/issue-prediction-portal"
import { ARVRReporting } from "@/components/ar-vr-reporting"
import { SocialReportNotifications } from "@/components/social-report-notifications"
import { AudioDigest } from "@/components/audio-digest"
import { AppReportAlerts } from "@/components/app-report-alerts"
import { DisasterManagement } from "@/components/disaster-management"
import { Petitions } from "@/components/petitions"
import { SocialSources } from "@/components/social-sources"
import { PendingReports } from "@/components/pending-reports"
import { PersonalNotifications } from "@/components/personal-notifications"
import { UserPanel } from "@/components/user-panel"
import { KnowYourCommunity } from "@/components/know-your-community"
import { AppDemoPopups } from "@/components/app-demo-popups"

export default function CivicReportApp() {
  const [activeSection, setActiveSection] = useState("home")
  const [redSpots, setRedSpots] = useState<Array<{ id: string; x: number; y: number; timestamp: number }>>([])
  const [incomingIssues, setIncomingIssues] = useState<any[]>([])
  const [blueSpots, setBlueSpots] = useState<Array<{ id: string; x: number; y: number; timestamp: number }>>([])
  const [lastAppReport, setLastAppReport] = useState<any | null>(null)
  const [disasterOverlay, setDisasterOverlay] = useState<{ active: boolean; mode: "alert" | "warning" | "disaster" }>(() => ({ active: false, mode: "alert" }))

  const handleIssuePopup = (issue: any) => {
    const newSpot = {
      id: issue.id,
      x: Math.random() * (window.innerWidth - 100) + 50,
      y: Math.random() * (window.innerHeight - 100) + 50,
      timestamp: Date.now(),
    }

    setRedSpots((prev) => [...prev, newSpot])

    // Remove red spot after 10 seconds
    setTimeout(() => {
      setRedSpots((prev) => prev.filter((spot) => spot.id !== newSpot.id))
    }, 10000)
  }

  const handleStartReporting = () => {
    setActiveSection("submit-report")
  }

  const handleAdminLogin = () => {
    setActiveSection("admin")
  }

  const handleOpenNotifications = () => {
    setActiveSection("notifications")
  }

  const handleOpenDisaster = () => {
    setActiveSection("disaster")
  }

  const handleOpenUserPanel = () => {
    setActiveSection("user-panel")
  }

  const handleViewMap = () => {
    setActiveSection("map")
  }

  // Listen to navigation intents from inner components (e.g., Submit New Report button)
  if (typeof window !== "undefined") {
    window.onnavigate = null
  }
  if (typeof window !== "undefined") {
    window.addEventListener("navigate", ((e: any) => {
      const section = e?.detail?.section
      if (section) setActiveSection(section)
    }) as EventListener)
    window.addEventListener("disaster-demo", ((e: any) => {
      const mode = (e?.detail?.mode || "warning") as "alert" | "warning" | "disaster"
      setDisasterOverlay({ active: true, mode })
      setTimeout(() => setDisasterOverlay({ active: false, mode }), 8000)
    }) as EventListener)
  }

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <HeroSection onStartReporting={handleStartReporting} onViewMap={handleViewMap} />
      case "leaderboard":
        return <LeaderboardGamification />
      case "live-issues":
        return <LiveIssuesFeed onViewMap={handleViewMap} />
      case "reports":
        return <ExistingReports />
      case "pending-reports":
        return <PendingReports />
      case "submit-report":
        return (
          <ReportSubmission
            onReportCreated={(issue) => {
              setIncomingIssues((prev) => [issue, ...prev])
              setLastAppReport(issue)
              const newSpot = {
                id: `app-${Date.now()}`,
                x: Math.random() * (window.innerWidth - 100) + 50,
                y: Math.random() * (window.innerHeight - 100) + 50,
                timestamp: Date.now(),
              }
              setBlueSpots((prev) => [...prev, newSpot])
              setTimeout(() => {
                setBlueSpots((prev) => prev.filter((s) => s.id !== newSpot.id))
              }, 6000)
              // Dispatch demo event for Notifications and popups
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("app-report-created", { detail: issue }))
              }
            }}
          />
        )
      case "map":
        return <InteractiveMap />
      case "discussions":
        return <Discussions />
      case "analytics":
        return <Analytics />
      case "notifications":
        return <Notifications />
      case "admin":
        return <EnhancedAdminPanel />
      case "ai-suggestions":
        return <AISuggestions />
      case "neighborhood-pulse":
        return <NeighboroodPulse />
      case "issue-prediction":
        return <IssuePredictionPortal />
      case "ar-vr-reporting":
        return <ARVRReporting />
      case "disaster":
        return <DisasterManagement />
      case "personal-notifications":
        return <PersonalNotifications />
      case "user-panel":
        return <UserPanel />
      case "petitions":
        return <Petitions />
      case "social-sources":
        return <SocialSources />
      case "know-community":
        return <KnowYourCommunity />
      case "settings":
        return (
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground">Settings</h2>
            <p className="text-muted-foreground">Customize your civic reporting experience</p>
            <AISuggestions compact={true} />
          </div>
        )
      default:
        return <HeroSection onStartReporting={handleStartReporting} onViewMap={handleViewMap} />
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('/city-street-map.webp')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Overlay to maintain readability */}
        <div className="absolute inset-0 bg-black/60" />

        {disasterOverlay.active && (
          <div className="absolute inset-0 z-40 pointer-events-none">
            {disasterOverlay.mode === "alert" && (
              <div className="absolute inset-0 animate-pulse" style={{ background: "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.35), rgba(0,0,0,0.6))" }} />
            )}
            {disasterOverlay.mode === "warning" && (
              <div className="absolute inset-0 animate-pulse" style={{ background: "radial-gradient(circle at 50% 50%, rgba(234,179,8,0.4), rgba(0,0,0,0.6))" }} />
            )}
            {disasterOverlay.mode === "disaster" && (
              <div className="absolute inset-0 animate-pulse" style={{ background: "radial-gradient(circle at 50% 50%, rgba(239,68,68,0.55), rgba(0,0,0,0.7))" }} />
            )}
          </div>
        )}

        {redSpots.map((spot) => (
          <div
            key={spot.id}
            className="absolute w-4 h-4 bg-red-500 rounded-full animate-ping shadow-lg shadow-red-500/50"
            style={{
              left: `${spot.x}px`,
              top: `${spot.y}px`,
              zIndex: 5,
            }}
          />
        ))}

        {blueSpots.map((spot) => (
          <div
            key={spot.id}
            className="absolute w-4 h-4 bg-blue-500 rounded-full animate-ping shadow-lg shadow-blue-500/50"
            style={{
              left: `${spot.x}px`,
              top: `${spot.y}px`,
              zIndex: 5,
            }}
          />
        ))}
      </div>

      <TopNavigation onAdminLogin={handleAdminLogin} onOpenNotifications={handleOpenNotifications} onOpenDisaster={handleOpenDisaster} onOpenUserPanel={handleOpenUserPanel} />

      {disasterOverlay.active && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2 bg-red-600/90 text-white rounded shadow-lg animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M12 2.25c-.41 0-.79.22-.99.58L1.51 19.03c-.43.76.11 1.72.99 1.72h19c.88 0 1.42-.96.99-1.72L12.99 2.83a1.125 1.125 0 00-.99-.58zm-.75 6a.75.75 0 011.5 0v5a.75.75 0 01-1.5 0V8.25zM12 18a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          {disasterOverlay.mode === "disaster" ? "Disaster SOS" : disasterOverlay.mode === "warning" ? "Warning Active" : "Alert Active"}
        </div>
      )}

      <Sidebar
        activeSection={activeSection}
        onSectionChange={(section) => {
          if (section === "submit-report") {
            setActiveSection("submit-report")
          } else {
            setActiveSection(section)
          }
          console.log("[v0] Section changed to:", section)
        }}
        isAdminMode={false}
      />

      {/* Main Content */}
      <main className={cn("pt-16 pl-0 md:pl-64 transition-all duration-300 relative z-10", "min-h-screen")}>
        <div className="p-6 md:p-8">
          {activeSection === "live-issues" ? (
            <LiveIssuesFeed onViewMap={handleViewMap} externalIssues={incomingIssues} />
          ) : (
            renderSection()
          )}
        </div>
        <Footer />
      </main>

      {/* Popups */}
      <SocialReportNotifications
        onNewIssue={(issue) => setIncomingIssues((prev) => [issue, ...prev])}
        onAlertPing={() => {
          // also spawn a red spot for aesthetics
          const newSpot = {
            id: `ping-${Date.now()}`,
            x: Math.random() * (window.innerWidth - 100) + 50,
            y: Math.random() * (window.innerHeight - 100) + 50,
            timestamp: Date.now(),
          }
          setRedSpots((prev) => [...prev, newSpot])
          setTimeout(() => {
            setRedSpots((prev) => prev.filter((s) => s.id !== newSpot.id))
          }, 6000)
        }}
      />
      <AppDemoPopups />

      <RandomIssueSystem onIssuePopup={handleIssuePopup} />
      <AppReportAlerts report={lastAppReport} />

      <button
        className="fixed bottom-20 right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-full shadow-lg hover:shadow-green-400/25 transition-all duration-300 hover:scale-105 z-30 group animate-pulse"
        onClick={() => {
          setActiveSection("neighborhood-pulse")
          console.log("[v0] Neighborhood Pulse button clicked")
        }}
      >
        <svg
          className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </button>

      <button
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all duration-200 hover:scale-105 z-30 group"
        onClick={() => {
          setActiveSection("submit-report")
          console.log("[v0] Quick report button clicked")
        }}
      >
        <svg
          className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  )
}
