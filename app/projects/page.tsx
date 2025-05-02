import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { Suspense } from "react"

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
  versions?: { version: string; date: string; notes: string }[]
  createdAt: string
  updatedAt: string
}

// Fetch data from the backend
async function getProjects() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects?sort=-createdAt`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!res.ok) {
      throw new Error("Failed to fetch projects")
    }

    const data = await res.json()
    return data.data as Project[]
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

// Loading component
function ProjectSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden flex flex-col h-full">
          <div className="relative h-48 bg-muted animate-pulse"></div>
          <CardContent className="flex-1 flex flex-col p-6 space-y-4">
            <div className="h-6 w-3/4 bg-muted animate-pulse rounded"></div>
            <div className="h-20 w-full bg-muted animate-pulse rounded"></div>
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
              <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
              <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="flex flex-wrap gap-2 mt-auto pt-4">
              <div className="h-9 w-28 bg-muted animate-pulse rounded"></div>
              <div className="h-9 w-28 bg-muted animate-pulse rounded"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Projects component
async function Projects() {
  const projects = await getProjects()

  // Fallback data in case the API is not available
 



  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project._id} className="overflow-hidden flex flex-col h-full">
          <div className="relative h-48">
            <Image
              src={project.image || "/placeholder.svg?height=300&width=600"}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="flex-1 flex flex-col p-6 space-y-4">
            <h2 className="text-xl font-bold">{project.title}</h2>
            <p className="text-muted-foreground flex-1">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 3 && <Badge variant="outline">+{project.tags.length - 3}</Badge>}
            </div>
            <div className="flex flex-wrap gap-2 mt-auto pt-4">
              <Button variant="default" size="sm" asChild>
                <Link href={`/projects/${project._id}`}>View Details</Link>
              </Button>
              {project.demoUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-4 w-4" /> Demo
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Projects</h1>
        <p className="text-muted-foreground max-w-3xl">
          A collection of my work across web development, design, and software engineering. Each project includes
          details about the technologies used and development process.
        </p>
      </div>

      <Suspense fallback={<ProjectSkeleton />}>
        <Projects />
      </Suspense>
    </div>
  )
}
