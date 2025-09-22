"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Volume2, VolumeX, Headphones } from "lucide-react"

interface DigestStats {
  total: number
  open: number
  voting: number
  completed: number
}

function buildDigest(stats: DigestStats) {
  return `Community update. There are ${stats.total} active issues. ${stats.open} open, ${stats.voting} under voting, and ${stats.completed} completed recently. Stay engaged and report problems in your area.`
}

export function AudioDigest({ stats }: { stats?: DigestStats }) {
  const [speaking, setSpeaking] = useState(false)
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null)

  const resolvedStats = useMemo<DigestStats>(() => {
    return (
      stats || {
        total: 42,
        open: 17,
        voting: 11,
        completed: 14,
      }
    )
  }, [stats])

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
    }
  }, [])

  const speak = () => {
    try {
      window.speechSynthesis?.cancel()
      const utter = new SpeechSynthesisUtterance(buildDigest(resolvedStats))
      utter.rate = 1
      utter.pitch = 1
      utter.volume = 1
      utter.lang = "en-IN"
      utter.onend = () => setSpeaking(false)
      utter.onerror = () => setSpeaking(false)
      utterRef.current = utter
      setSpeaking(true)
      window.speechSynthesis?.speak(utter)
    } catch (e) {
      console.error(e)
      setSpeaking(false)
    }
  }

  const stop = () => {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }

  return (
    <div className="fixed bottom-24 left-6 z-30">
      <Card className="p-2 bg-background/85 backdrop-blur-sm border-border/60">
        <div className="flex items-center gap-2">
          <Headphones className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground">Audio Digest</span>
          {speaking ? (
            <Button size="sm" variant="outline" onClick={stop}>
              <VolumeX className="h-4 w-4 mr-1" /> Stop
            </Button>
          ) : (
            <Button size="sm" onClick={speak}>
              <Volume2 className="h-4 w-4 mr-1" /> Play
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

export default AudioDigest



