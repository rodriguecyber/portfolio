    "use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, Plus, X, Upload, Trash2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BlogEditor from "@/components/blog-editor"

export default function NewProjectPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    tags: [] as string[],
    image: "",
    demoUrl: "",
    repoUrl: "",
    versions: [
      {
        version: "v1.0",
        date: new Date().toISOString().split("T")[0],
        notes: "Initial release",
        description: "",
        features: [] as string[],
        media: [] as { type: "image" | "video"; url: string; caption: string }[],
        changes: [] as string[],
      },
    ],
    features: [] as string[],
    challenges: [] as string[],
    screenshots: [] as string[],
    published: false,
  })
  const [tagInput, setTagInput] = useState("")
  const [featureInput, setFeatureInput] = useState("")
  const [challengeInput, setChallengeInput] = useState("")
  const [versionFeatureInput, setVersionFeatureInput] = useState("")
  const [versionChangeInput, setVersionChangeInput] = useState("")
  const [mediaCaption, setMediaCaption] = useState("")
  const [mediaType, setMediaType] = useState<"image" | "video">("image")
  const [mediaUrl, setMediaUrl] = useState("")
  const [activeVersionIndex, setActiveVersionIndex] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLongDescriptionChange = (content: string) => {
    setFormData((prev) => ({ ...prev, longDescription: content }))
  }

  const handleVersionDescriptionChange = (content: string) => {
    const updatedVersions = [...formData.versions]
    updatedVersions[activeVersionIndex].description = content
    setFormData((prev) => ({ ...prev, versions: updatedVersions }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
  }

  const handleAddFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData((prev) => ({ ...prev, features: [...prev.features, featureInput.trim()] }))
      setFeatureInput("")
    }
  }

  const handleRemoveFeature = (feature: string) => {
    setFormData((prev) => ({ ...prev, features: prev.features.filter((f) => f !== feature) }))
  }

  const handleAddChallenge = () => {
    if (challengeInput.trim() && !formData.challenges.includes(challengeInput.trim())) {
      setFormData((prev) => ({ ...prev, challenges: [...prev.challenges, challengeInput.trim()] }))
      setChallengeInput("")
    }
  }

  const handleRemoveChallenge = (challenge: string) => {
    setFormData((prev) => ({ ...prev, challenges: prev.challenges.filter((c) => c !== challenge) }))
  }

  const handleAddVersionFeature = () => {
    if (versionFeatureInput.trim()) {
      const updatedVersions = [...formData.versions]
      updatedVersions[activeVersionIndex].features.push(versionFeatureInput.trim())
      setFormData((prev) => ({ ...prev, versions: updatedVersions }))
      setVersionFeatureInput("")
    }
  }

  const handleRemoveVersionFeature = (feature: string) => {
    const updatedVersions = [...formData.versions]
    updatedVersions[activeVersionIndex].features = updatedVersions[activeVersionIndex].features.filter(
      (f) => f !== feature,
    )
    setFormData((prev) => ({ ...prev, versions: updatedVersions }))
  }

  const handleAddVersionChange = () => {
    if (versionChangeInput.trim()) {
      const updatedVersions = [...formData.versions]
      updatedVersions[activeVersionIndex].changes.push(versionChangeInput.trim())
      setFormData((prev) => ({ ...prev, versions: updatedVersions }))
      setVersionChangeInput("")
    }
  }

  const handleRemoveVersionChange = (change: string) => {
    const updatedVersions = [...formData.versions]
    updatedVersions[activeVersionIndex].changes = updatedVersions[activeVersionIndex].changes.filter(
      (c) => c !== change,
    )
    setFormData((prev) => ({ ...prev, versions: updatedVersions }))
  }

  const handleAddVersion = () => {
    const lastVersion = formData.versions[formData.versions.length - 1]
    const versionNumber = lastVersion.version.startsWith("v")
      ? Number.parseInt(lastVersion.version.substring(1).split(".")[0])
      : 1

    const newVersion = {
      version: `v${versionNumber + 1}.0`,
      date: new Date().toISOString().split("T")[0],
      notes: "New version",
      description: "",
      features: [] as string[],
      media: [] as { type: "image" | "video"; url: string; caption: string }[],
      changes: [] as string[],
    }

    setFormData((prev) => ({
      ...prev,
      versions: [...prev.versions, newVersion],
    }))

    // Set active version to the new one
    setActiveVersionIndex(formData.versions.length)
  }

  const handleRemoveVersion = (index: number) => {
    if (formData.versions.length <= 1) {
      toast({
        title: "Error",
        description: "You must have at least one version",
        variant: "destructive",
      })
      return
    }

    const updatedVersions = formData.versions.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, versions: updatedVersions }))

    // Adjust active version index if needed
    if (activeVersionIndex >= updatedVersions.length) {
      setActiveVersionIndex(updatedVersions.length - 1)
    }
  }

  const handleVersionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const { name, value } = e.target
    const updatedVersions = [...formData.versions]
    updatedVersions[index] = { ...updatedVersions[index], [name]: value }
    setFormData((prev) => ({ ...prev, versions: updatedVersions }))
  }

  const handleAddMedia = () => {
    if (!mediaUrl.trim() || !mediaCaption.trim()) {
      toast({
        title: "Error",
        description: "Please provide both URL and caption for the media",
        variant: "destructive",
      })
      return
    }

    const updatedVersions = [...formData.versions]
    updatedVersions[activeVersionIndex].media.push({
      type: mediaType,
      url: mediaUrl.trim(),
      caption: mediaCaption.trim(),
    })
    setFormData((prev) => ({ ...prev, versions: updatedVersions }))
    setMediaUrl("")
    setMediaCaption("")
  }

  const handleRemoveMedia = (index: number) => {
    const updatedVersions = [...formData.versions]
    updatedVersions[activeVersionIndex].media = updatedVersions[activeVersionIndex].media.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, versions: updatedVersions }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("image", file)

    setUploadingImage(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await res.json()
      setFormData((prev) => ({ ...prev, image: data.url }))

      toast({
        title: "Image Uploaded",
        description: "Your image has been uploaded successfully",
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("image", file)

    setUploadingScreenshot(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error("Failed to upload screenshot")
      }

      const data = await res.json()
      setFormData((prev) => ({ ...prev, screenshots: [...prev.screenshots, data.url] }))

      toast({
        title: "Screenshot Uploaded",
        description: "Your screenshot has been uploaded successfully",
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload screenshot",
        variant: "destructive",
      })
    } finally {
      setUploadingScreenshot(false)
    }
  }

  const handleRemoveScreenshot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.title || !formData.description || !formData.longDescription) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (formData.tags.length === 0) {
      toast({
        title: "Missing Tags",
        description: "Please add at least one tag",
        variant: "destructive",
      })
      return
    }

    if (!formData.image) {
      toast({
        title: "Missing Image",
        description: "Please upload a featured image",
        variant: "destructive",
      })
      return
    }

    if (!formData.demoUrl || !formData.repoUrl) {
      toast({
        title: "Missing URLs",
        description: "Please provide both demo and repository URLs",
        variant: "destructive",
      })
      return
    }

    if (formData.features.length === 0) {
      toast({
        title: "Missing Features",
        description: "Please add at least one feature",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error("Failed to create project")
      }

      toast({
        title: "Project Created",
        description: "Your project has been created successfully",
      })

      router.push("/dashboard/projects")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create project",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">New Project</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Switch id="published" checked={formData.published} onCheckedChange={handleSwitchChange} />
            <Label htmlFor="published">{formData.published ? "Published" : "Draft"}</Label>
          </div>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter project title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter a short description (max 200 characters)"
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                    maxLength={200}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="demoUrl">Demo URL</Label>
                    <Input
                      id="demoUrl"
                      name="demoUrl"
                      placeholder="https://example.com"
                      value={formData.demoUrl}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="repoUrl">Repository URL</Label>
                    <Input
                      id="repoUrl"
                      name="repoUrl"
                      placeholder="https://github.com/username/repo"
                      value={formData.repoUrl}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Label>Long Description</Label>
              <div className="mt-2 prose-container border rounded-md">
                <BlogEditor initialContent="" onChange={handleLongDescriptionChange} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Features</Label>
                  <span className="text-xs text-muted-foreground">
                    {formData.features.length} feature{formData.features.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                    >
                      {feature}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1"
                        onClick={() => handleRemoveFeature(feature)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a feature"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddFeature()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddFeature} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <Label>Development Challenges</Label>
                  <span className="text-xs text-muted-foreground">
                    {formData.challenges.length} challenge{formData.challenges.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.challenges.map((challenge, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                    >
                      {challenge}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1"
                        onClick={() => handleRemoveChallenge(challenge)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a development challenge"
                    value={challengeInput}
                    onChange={(e) => setChallengeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddChallenge()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddChallenge} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <Label>Project Versions</Label>
                <Button type="button" onClick={handleAddVersion} size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add Version
                </Button>
              </div>

              <Accordion
                type="single"
                collapsible
                className="w-full"
                value={`version-${activeVersionIndex}`}
                onValueChange={(value) => {
                  const index = Number.parseInt(value.split("-")[1])
                  if (!isNaN(index)) {
                    setActiveVersionIndex(index)
                  }
                }}
              >
                {formData.versions.map((version, index) => (
                  <AccordionItem key={index} value={`version-${index}`}>
                    <div className="flex items-center">
                      <AccordionTrigger className="flex-1">
                        {version.version} - {version.notes}
                      </AccordionTrigger>
                      {formData.versions.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 mr-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveVersion(index)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`version-${index}`}>Version Number</Label>
                            <Input
                              id={`version-${index}`}
                              name="version"
                              placeholder="v1.0"
                              value={version.version}
                              onChange={(e) => handleVersionChange(e, index)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`date-${index}`}>Release Date</Label>
                            <Input
                              id={`date-${index}`}
                              name="date"
                              type="date"
                              value={version.date}
                              onChange={(e) => handleVersionChange(e, index)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`notes-${index}`}>Version Notes</Label>
                          <Input
                            id={`notes-${index}`}
                            name="notes"
                            placeholder="e.g., Initial release, Added new features, etc."
                            value={version.notes}
                            onChange={(e) => handleVersionChange(e, index)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Version Description</Label>
                          <div className="mt-2 prose-container border rounded-md">
                            <BlogEditor
                              initialContent={version.description}
                              onChange={handleVersionDescriptionChange}
                            />
                          </div>
                        </div>

                        <Tabs defaultValue="features" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="features">Features</TabsTrigger>
                            <TabsTrigger value="changes">Changes</TabsTrigger>
                            <TabsTrigger value="media">Media</TabsTrigger>
                          </TabsList>
                          <TabsContent value="features" className="space-y-4 pt-4">
                            <div className="flex flex-wrap gap-2 mb-2">
                              {version.features.map((feature, featureIndex) => (
                                <div
                                  key={featureIndex}
                                  className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                                >
                                  {feature}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 ml-1"
                                    onClick={() => handleRemoveVersionFeature(feature)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add a feature for this version"
                                value={versionFeatureInput}
                                onChange={(e) => setVersionFeatureInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault()
                                    handleAddVersionFeature()
                                  }
                                }}
                              />
                              <Button type="button" onClick={handleAddVersionFeature} size="sm">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </TabsContent>
                          <TabsContent value="changes" className="space-y-4 pt-4">
                            <div className="flex flex-wrap gap-2 mb-2">
                              {version.changes.map((change, changeIndex) => (
                                <div
                                  key={changeIndex}
                                  className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                                >
                                  {change}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 ml-1"
                                    onClick={() => handleRemoveVersionChange(change)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add a change for this version"
                                value={versionChangeInput}
                                onChange={(e) => setVersionChangeInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault()
                                    handleAddVersionChange()
                                  }
                                }}
                              />
                              <Button type="button" onClick={handleAddVersionChange} size="sm">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </TabsContent>
                          <TabsContent value="media" className="space-y-4 pt-4">
                            <div className="grid grid-cols-1 gap-4">
                              {version.media.map((item, mediaIndex) => (
                                <div key={mediaIndex} className="flex flex-col border rounded-md overflow-hidden">
                                  <div className="relative">
                                    {item.type === "image" ? (
                                      <div className="aspect-video bg-muted">
                                        <img
                                          src={item.url || "/placeholder.svg"}
                                          alt={item.caption}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    ) : (
                                      <div className="aspect-video">
                                        <iframe
                                          src={item.url}
                                          title={item.caption}
                                          className="w-full h-full"
                                          allowFullScreen
                                        ></iframe>
                                      </div>
                                    )}
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      className="absolute top-2 right-2"
                                      onClick={() => handleRemoveMedia(mediaIndex)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="p-3 bg-muted/30">
                                    <p className="text-sm font-medium">{item.caption}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Type: {item.type === "image" ? "Image" : "Video"}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="space-y-4 border rounded-md p-4">
                              <div className="space-y-2">
                                <Label>Media Type</Label>
                                <div className="flex gap-4">
                                  <div className="flex items-center">
                                    <input
                                      type="radio"
                                      id="media-type-image"
                                      name="media-type"
                                      value="image"
                                      checked={mediaType === "image"}
                                      onChange={() => setMediaType("image")}
                                      className="mr-2"
                                    />
                                    <Label htmlFor="media-type-image">Image</Label>
                                  </div>
                                  <div className="flex items-center">
                                    <input
                                      type="radio"
                                      id="media-type-video"
                                      name="media-type"
                                      value="video"
                                      checked={mediaType === "video"}
                                      onChange={() => setMediaType("video")}
                                      className="mr-2"
                                    />
                                    <Label htmlFor="media-type-video">Video</Label>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="media-url">URL</Label>
                                <Input
                                  id="media-url"
                                  placeholder={
                                    mediaType === "image"
                                      ? "Image URL (e.g., https://example.com/image.jpg)"
                                      : "Video URL (e.g., https://www.youtube.com/embed/VIDEO_ID)"
                                  }
                                  value={mediaUrl}
                                  onChange={(e) => setMediaUrl(e.target.value)}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="media-caption">Caption</Label>
                                <Input
                                  id="media-caption"
                                  placeholder="Enter a caption for this media"
                                  value={mediaCaption}
                                  onChange={(e) => setMediaCaption(e.target.value)}
                                />
                              </div>

                              <Button type="button" onClick={handleAddMedia} className="w-full">
                                Add Media
                              </Button>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Featured Image</Label>
                  {formData.image ? (
                    <div className="relative aspect-video rounded-md overflow-hidden">
                      <img
                        src={formData.image || "/placeholder.svg"}
                        alt="Featured"
                        className="object-cover w-full h-full"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to upload</p>
                      <Button asChild disabled={uploadingImage}>
                        <label>
                          {uploadingImage ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                            </>
                          ) : (
                            "Upload Image"
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                          />
                        </label>
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Screenshots</Label>
                  <span className="text-xs text-muted-foreground">
                    {formData.screenshots.length} screenshot{formData.screenshots.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {formData.screenshots.map((screenshot, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden border">
                      <div className="aspect-video">
                        <img
                          src={screenshot || "/placeholder.svg"}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveScreenshot(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Upload project screenshots</p>
                  <Button asChild disabled={uploadingScreenshot}>
                    <label>
                      {uploadingScreenshot ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                        </>
                      ) : (
                        "Upload Screenshot"
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleScreenshotUpload}
                        disabled={uploadingScreenshot}
                      />
                    </label>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
