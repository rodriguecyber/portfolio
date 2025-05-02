import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, ExternalLink, Github } from "lucide-react"
import { LikeButton } from "@/components/like-button"
import { CommentSection } from "@/components/comment-section"
import ProjectDescription from "@/components/ProjectDescription"
import { formatDistanceToNow } from 'date-fns'
// Define types for our data
type Project = {
  _id: string
  title: string
  description: string
  longDescription?: string
  tags: string[]
  image: string
  demoUrl?: string
  repoUrl?: string
  features?: string[]
  challenges?: string[]
  solutions?: string[]
  screenshots?: string[]
  versions?: { version: string; date: string; notes: string }[]
  createdAt: string
  updatedAt: string
}

// Fetch data from the backend
async function getProject(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!res.ok) {
      if (res.status === 404) {
        return null
      }
      throw new Error("Failed to fetch project")
    }

    const data = await res.json()
    return data.data as Project
  } catch (error) {
    console.error("Error fetching project:", error)
    return null
  }
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/projects" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Link>
        </Button>

        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">{project.title}</h1>

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {project.demoUrl && (
                <Button asChild>
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-4 w-4" /> Live Demo
                  </a>
                </Button>
              )}

              {project.repoUrl && (
                <Button variant="outline" asChild>
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <Github className="h-4 w-4" /> View Code
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <Image
              src={project.image || "/placeholder.svg?height=400&width=800"}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Description */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Overview</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
            <ProjectDescription html={project.longDescription || project.description} />
            </div>
          </div>

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Key Features</h2>
              <ul className="space-y-2 list-disc pl-5">
                {project.features.map((feature, index) => (
                  <li key={index} className="text-lg">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Challenges and Solutions */}
          {project.challenges && project.challenges.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Challenges & Solutions</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Challenges</h3>
                  <ul className="space-y-2 list-disc pl-5">
                    {project.challenges.map((challenge, index) => (
                      <li key={index}>{challenge}</li>
                    ))}
                  </ul>
                </div>

                {project.solutions && project.solutions.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Solutions</h3>
                    <ul className="space-y-2 list-disc pl-5">
                      {project.solutions.map((solution, index) => (
                        <li key={index}>{solution}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Screenshots */}
          {project.screenshots && project.screenshots.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Screenshots</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {project.screenshots.map((screenshot, index) => (
                  <div key={index} className="relative h-[200px] rounded-lg overflow-hidden">
                    <Image
                      src={screenshot || "/placeholder.svg?height=200&width=400"}
                      alt={`${project.title} screenshot ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Version History */}
          {project.versions && project.versions.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Version History</h2>
              <div className="space-y-4">
                {project.versions.map((version, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{version.version}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{version.date}</span>
                        </div>
                      </div>
                      <p>{version.notes}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Like Button */}
          <div className="flex justify-center py-4">
            <LikeButton contentId={project._id} contentType="project" />
          </div>

          {/* Comments Section */}
          <div className="mt-12 pt-8 border-t">
            <CommentSection contentId={project._id} contentType="project" />
          </div>
        </div>
      </div>
    </div>
  )
}
