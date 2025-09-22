"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Camera,
  Video,
  Upload,
  X,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Shield,
  Mic,
  Play,
  Pause,
  Square,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ReportFormData {
  type: string
  title: string
  description: string
  location: string
  images: File[]
  video: File | null
  voiceNote: File | null
  priority: string
}

interface SubmittedReport {
  id: string
  title: string
  type: string
  location: string
  description: string
  submittedAt: Date
  votes: number
  masterVoteStatus: "pending" | "approved" | "rejected"
  completionRate: number
  status: "open" | "voting" | "completed"
}

const reportTypes = [
  { value: "pothole", label: "Pothole" },
  { value: "streetlight", label: "Street Light" },
  { value: "water", label: "Water Supply" },
  { value: "waste", label: "Waste Management" },
  { value: "traffic", label: "Traffic Issue" },
  { value: "park", label: "Park Maintenance" },
  { value: "other", label: "Other" },
]

const priorityLevels = [
  { value: "low", label: "Low Priority", color: "bg-blue-500" },
  { value: "medium", label: "Medium Priority", color: "bg-yellow-500" },
  { value: "high", label: "High Priority", color: "bg-red-500" },
]

function ReportForm({ onSubmit }: { onSubmit: (data: ReportFormData) => void }) {
  const [formData, setFormData] = useState<ReportFormData>({
    type: "",
    title: "",
    description: "",
    location: "",
    images: [],
    video: null,
    voiceNote: null,
    priority: "medium",
  })

  const [dragActive, setDragActive] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return
    const newImages = Array.from(files).slice(0, 4 - formData.images.length)
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }))
  }

  const handleVideoUpload = (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      // 50MB limit
      alert("Video file too large. Please select a file under 50MB.")
      return
    }
    setFormData((prev) => ({ ...prev, video: file }))
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        const audioFile = new File([audioBlob], "voice-note.wav", { type: "audio/wav" })
        setFormData((prev) => ({ ...prev, voiceNote: audioFile }))
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Unable to access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }

  const playVoiceNote = () => {
    if (formData.voiceNote && !isPlaying) {
      const audio = new Audio(URL.createObjectURL(formData.voiceNote))
      audioRef.current = audio
      audio.play()
      setIsPlaying(true)
      audio.onended = () => setIsPlaying(false)
    } else if (audioRef.current && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const removeVoiceNote = () => {
    setFormData((prev) => ({ ...prev, voiceNote: null }))
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.type || !formData.title || !formData.description || !formData.location) {
      alert("Please fill in all required fields")
      return
    }
    onSubmit(formData)
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">Submit New Report</h2>
            <p className="text-sm text-muted-foreground">Help improve your community by reporting issues</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-card-foreground">
              Issue Type *
            </Label>
            <Select value={formData.type} onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-card-foreground">
              Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Brief description of the issue"
              className="bg-input border-border text-foreground"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-card-foreground">
              Location *
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="Street address or landmark"
              className="bg-input border-border text-foreground"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-card-foreground">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of the issue..."
              className="bg-input border-border text-foreground min-h-24"
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-card-foreground">Priority Level</Label>
            <div className="flex gap-2">
              {priorityLevels.map((level) => (
                <Button
                  key={level.value}
                  type="button"
                  variant={formData.priority === level.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormData((prev) => ({ ...prev, priority: level.value }))}
                  className={cn(
                    "flex items-center gap-2",
                    formData.priority === level.value && "bg-primary text-primary-foreground",
                  )}
                >
                  <div className={cn("w-2 h-2 rounded-full", level.color)} />
                  {level.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-card-foreground">Images (up to 4)</Label>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                dragActive ? "border-primary bg-primary/5" : "border-border",
                formData.images.length >= 4 && "opacity-50 pointer-events-none",
              )}
              onDragOver={(e) => {
                e.preventDefault()
                setDragActive(true)
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragActive(false)
                handleImageUpload(e.dataTransfer.files)
              }}
            >
              <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">Drag and drop images here, or click to select</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
                id="image-upload"
                disabled={formData.images.length >= 4}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("image-upload")?.click()}
                disabled={formData.images.length >= 4}
              >
                <Upload className="h-4 w-4 mr-2" />
                Select Images
              </Button>
            </div>

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image) || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Voice Note */}
          <div className="space-y-2">
            <Label className="text-card-foreground">Voice Note (optional)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <Mic className="h-6 w-6 text-muted-foreground mx-auto mb-2" />

              {!formData.voiceNote ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Record a voice note to describe the issue. AI will help process it into your report.
                  </p>

                  {isRecording ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-red-500">
                          Recording... {formatTime(recordingTime)}
                        </span>
                      </div>
                      <Button type="button" variant="destructive" size="sm" onClick={stopRecording}>
                        <Square className="h-4 w-4 mr-2" />
                        Stop Recording
                      </Button>
                    </div>
                  ) : (
                    <Button type="button" variant="outline" size="sm" onClick={startRecording}>
                      <Mic className="h-4 w-4 mr-2" />
                      Start Recording
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <Mic className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Voice note recorded</span>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={playVoiceNote}>
                      {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                      {isPlaying ? "Pause" : "Play"}
                    </Button>

                    <Button type="button" variant="destructive" size="sm" onClick={removeVoiceNote}>
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    AI will process this voice note to enhance your report description
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Video Upload */}
          <div className="space-y-2">
            <Label className="text-card-foreground">Video (optional, max 15s)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <Video className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <input
                type="file"
                accept="video/*"
                onChange={(e) => e.target.files?.[0] && handleVideoUpload(e.target.files[0])}
                className="hidden"
                id="video-upload"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("video-upload")?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {formData.video ? "Change Video" : "Select Video"}
              </Button>
              {formData.video && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.video.name} ({(formData.video.size / 1024 / 1024).toFixed(1)}MB)
                </p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Submit Report
          </Button>
        </form>
      </div>
    </Card>
  )
}

function ReportCard({ report }: { report: SubmittedReport }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-500"
      case "voting":
        return "bg-yellow-500"
      case "completed":
        return "bg-primary"
      default:
        return "bg-gray-500"
    }
  }

  const getMasterVoteIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <X className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <Card className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-card-foreground">{report.title}</h3>
            <p className="text-sm text-muted-foreground">{report.location}</p>
          </div>
          <Badge className={cn("text-white", getStatusColor(report.status))}>{report.status}</Badge>
        </div>

        <p className="text-sm text-card-foreground line-clamp-2">{report.description}</p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Community Support</span>
            <span>{report.completionRate}%</span>
          </div>
          <Progress value={report.completionRate} className="h-2" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {report.votes} votes
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Master Vote: {getMasterVoteIcon(report.masterVoteStatus)}
            </div>
          </div>
          <span className="text-xs text-muted-foreground">{report.submittedAt.toLocaleDateString()}</span>
        </div>
      </div>
    </Card>
  )
}

export function ReportSubmission({ onReportCreated }: { onReportCreated?: (issue: any) => void }) {
  const [submittedReports, setSubmittedReports] = useState<SubmittedReport[]>([
    {
      id: "1",
      title: "Large pothole on Main Street",
      type: "pothole",
      location: "Main Street, Ranchi",
      description: "Deep pothole causing traffic issues and potential vehicle damage",
      submittedAt: new Date(2024, 0, 15),
      votes: 23,
      masterVoteStatus: "approved",
      completionRate: 78,
      status: "voting",
    },
    {
      id: "2",
      title: "Broken street light",
      type: "streetlight",
      location: "Park Avenue, Dhanbad",
      description: "Street light has been out for over a week, creating safety concerns",
      submittedAt: new Date(2024, 0, 12),
      votes: 15,
      masterVoteStatus: "pending",
      completionRate: 45,
      status: "open",
    },
  ])

  const handleSubmitReport = (data: ReportFormData) => {
    const newReport: SubmittedReport = {
      id: Date.now().toString(),
      title: data.title,
      type: data.type,
      location: data.location,
      description: data.description,
      submittedAt: new Date(),
      votes: 0,
      masterVoteStatus: "pending",
      completionRate: 0,
      status: "open",
    }

    setSubmittedReports((prev) => [newReport, ...prev])
    // Emit normalized issue for live feed consumers
    try {
      const [namePart, cityPart] = (data.location || "").split(",")
      onReportCreated?.({
        id: newReport.id,
        title: data.title,
        type: (data.type as any) || "other",
        location: { name: (namePart || data.location || "Unknown").trim(), city: (cityPart || "Ranchi").trim() },
        status: "open",
        priority: (data.priority as any) || "medium",
        votes: { up: 0, down: 0, userVote: null },
        description: data.description,
        submittedAt: new Date(),
        submittedBy: "You",
        images: data.images?.length || 0,
        video: !!data.video,
        masterVoteStatus: "pending",
        completionRate: 0,
        comments: 0,
        trending: true,
        recentActivity: "New report submitted",
      })
    } catch {}
    alert("Report submitted successfully!")
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ReportForm onSubmit={handleSubmitReport} />

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Your Recent Reports</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {submittedReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">AI Suggestions</h3>
            <p className="text-sm text-muted-foreground">Similar issues in your area</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/20 rounded-lg">
            <p className="text-sm text-card-foreground">
              <strong>Duplicate Check:</strong> Similar pothole reported 2 blocks away. Consider voting on existing
              report.
            </p>
          </div>
          <div className="p-4 bg-muted/20 rounded-lg">
            <p className="text-sm text-card-foreground">
              <strong>Trending:</strong> Street light issues are trending in your area. Your report could help
              prioritize repairs.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
