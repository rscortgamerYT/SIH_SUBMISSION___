"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MapPin, Camera, Target, CheckCircle, AlertTriangle, Video } from "lucide-react"
import { cn } from "@/lib/utils"

interface ARReportData {
  locationNote: string
  attachment?: string
  marker?: { x: number; y: number }
}

export function ARVRReporting() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [hasCamera, setHasCamera] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [snapshot, setSnapshot] = useState<string | null>(null)
  const [marker, setMarker] = useState<{ x: number; y: number } | undefined>(undefined)
  const [form, setForm] = useState<ARReportData>({ locationNote: "" })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    let stream: MediaStream | null = null
    const enableCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setHasCamera(true)
        }
      } catch (e) {
        console.error("ARVR: Camera not available", e)
        setHasCamera(false)
      }
    }
    enableCamera()
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  const handlePlaceMarker = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasCamera) return
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setMarker({ x, y })
  }

  const captureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    if (marker) {
      // draw marker on snapshot
      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.arc((marker.x / video.clientWidth) * canvas.width, (marker.y / video.clientHeight) * canvas.height, 12, 0, Math.PI * 2)
      ctx.fill()
    }
    const dataUrl = canvas.toDataURL("image/png")
    setSnapshot(dataUrl)
    setForm((prev) => ({ ...prev, attachment: dataUrl, marker }))
  }

  const handleSubmit = () => {
    setIsCapturing(true)
    setTimeout(() => {
      setIsCapturing(false)
      setSubmitted(true)
      alert("AR/VR report submitted successfully!")
    }, 800)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Video className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">AR/VR Issue Reporting</h1>
          <p className="text-muted-foreground">Use your camera to precisely mark and submit issues</p>
        </div>
      </div>

      <Card className="p-4 bg-card border-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div
              className={cn(
                "relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-black/50",
                !hasCamera && "flex items-center justify-center",
              )}
              onClick={handlePlaceMarker}
            >
              {hasCamera ? (
                <>
                  <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
                  {marker && (
                    <div
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: marker.x, top: marker.y }}
                    >
                      <div className="w-6 h-6 rounded-full bg-red-500 shadow-lg shadow-red-500/40 border-2 border-white flex items-center justify-center">
                        <MapPin className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center space-y-2 p-6">
                  <Camera className="w-8 h-8 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Camera access is required. Please allow permissions.</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" onClick={captureSnapshot} disabled={!hasCamera}>
                <Target className="h-4 w-4 mr-2" />Mark & Capture
              </Button>
              {snapshot && (
                <a href={snapshot} download="issue-ar-snapshot.png" className="inline-flex">
                  <Button variant="outline">Download Snapshot</Button>
                </a>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="space-y-3">
            <Card className="p-3 bg-muted/20 border-border">
              <div className="flex items-start gap-2 text-sm text-card-foreground">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                <div>
                  This feature lets you create a report without typing. Record video, select necessary details, and choose a location using the location box below.
                </div>
              </div>
            </Card>
            <div className="space-y-2">
              <Label htmlFor="loc" className="text-card-foreground">Location note</Label>
              <Input
                id="loc"
                value={form.locationNote}
                onChange={(e) => setForm((p) => ({ ...p, locationNote: e.target.value }))}
                placeholder="Nearby landmark, street name, etc."
                className="bg-input border-border text-foreground"
              />
            </div>

            {marker && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary">Marker placed</Badge>
                <span>
                  x: {Math.round(marker.x)}, y: {Math.round(marker.y)}
                </span>
              </div>
            )}

            <Button onClick={handleSubmit} disabled={isCapturing} className="w-full bg-primary text-primary-foreground">
              {isCapturing ? "Submitting..." : "Submit AR Report"}
            </Button>

            {submitted && (
              <div className="flex items-center gap-2 text-green-500 text-sm">
                <CheckCircle className="h-4 w-4" /> AR/VR report submitted
              </div>
            )}

            {!marker && hasCamera && (
              <div className="flex items-center gap-2 text-yellow-500 text-xs">
                <AlertTriangle className="h-3 w-3" /> Tip: Tap on the camera preview to place a marker.
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ARVRReporting


