"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Users, ThumbsUp, Share2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Petition {
  id: string
  title: string
  description: string
  target: string
  signatures: number
  createdAt: Date
}

const demoPetitions: Petition[] = [
  { id: "p1", title: "Repair Sector 5 Water Pipeline", description: "Frequent breaks causing water loss.", target: "Ranchi Municipal Corporation", signatures: 384, createdAt: new Date() },
  { id: "p2", title: "Install LED Street Lights in Ward 12", description: "Improve safety after dark.", target: "Dhanbad Municipal Corporation", signatures: 221, createdAt: new Date(Date.now() - 86400000) },
]

export function Petitions() {
  const [petitions, setPetitions] = useState<Petition[]>(demoPetitions)
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [target, setTarget] = useState("")
  const [activeSign, setActiveSign] = useState<Petition | null>(null)
  const [fileError, setFileError] = useState<string>("")

  const addPetition = () => {
    if (!title || !desc || !target) return
    setPetitions((prev) => [
      { id: String(Date.now()), title, description: desc, target, signatures: 0, createdAt: new Date() },
      ...prev,
    ])
    setTitle("")
    setDesc("")
    setTarget("")
  }

  const sign = (id: string) => {
    const pet = petitions.find((p) => p.id === id)
    if (pet) setActiveSign(pet)
  }

  const handleUpload = (file: File | null) => {
    setFileError("")
    if (!file) return
    const isJpeg = file.type === "image/jpeg" || file.name.toLowerCase().endsWith(".jpg") || file.name.toLowerCase().endsWith(".jpeg")
    if (!isJpeg) {
      setFileError("Only JPEG images are allowed.")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setFileError("Max size is 2 MB.")
      return
    }
    if (activeSign) {
      setPetitions((prev) => prev.map((p) => (p.id === activeSign.id ? { ...p, signatures: p.signatures + 1 } : p)))
      setActiveSign(null)
      alert("Signature uploaded successfully. Thanks for supporting!")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg"><Users className="h-5 w-5 text-primary" /></div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Petitions</h2>
          <p className="text-muted-foreground">Start and support petitions that matter to your community</p>
        </div>
      </div>

      <Card className="p-4 bg-card border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input placeholder="Petition title" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-input border-border" />
          <Input placeholder="Target authority" value={target} onChange={(e) => setTarget(e.target.value)} className="bg-input border-border" />
          <Button onClick={addPetition}>Create Petition</Button>
        </div>
        <Textarea placeholder="Describe the issue and requested action" value={desc} onChange={(e) => setDesc(e.target.value)} className="mt-2 bg-input border-border min-h-20" />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {petitions.map((p) => (
          <Card key={p.id} className="p-4 bg-card border-border space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-card-foreground">{p.title}</h3>
                <p className="text-sm text-muted-foreground">Target: {p.target}</p>
              </div>
              <Badge variant="secondary">{p.signatures} signed</Badge>
            </div>
            <p className="text-sm text-card-foreground">{p.description}</p>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => sign(p.id)}>
                <ThumbsUp className="h-4 w-4 mr-1" /> Sign
              </Button>
              <Button size="sm" variant="outline">
                <Share2 className="h-4 w-4 mr-1" /> Share
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Signature Upload Dialog */}
      {activeSign && (
        <Dialog open={!!activeSign} onOpenChange={() => setActiveSign(null)}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">Upload Signature for "{activeSign.title}"</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="text-muted-foreground">
                In a well lighted environment, click a picture of your signature on a white page and upload it (format JPEG only, max size 2 MB).
              </div>
              <Input type="file" accept="image/jpeg,image/jpg" onChange={(e) => handleUpload(e.target.files?.[0] || null)} className="bg-input border-border" />
              {fileError && <div className="text-red-500 text-xs">{fileError}</div>}
              <div className="text-xs text-muted-foreground">We use this only to verify authenticity of your support.</div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default Petitions



