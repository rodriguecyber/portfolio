'use client'
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, FileText } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import axios from "axios"

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

type BlogPost = {
  _id: string
  title: string
  excerpt: string
  content: string
  date: string
  readTime: string
  author: string
  tags: string[]
  image: string
  createdAt: string
  updatedAt: string
}

// Fetch data from the backend using axios
const getProjects = async (): Promise<Project[]> => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/projects?limit=3&featured=true`)
    return data.data as Project[]
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs?limit=2&sort=-createdAt`)
    return data.data as BlogPost[]
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

const Home = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const [projectsData, blogPostsData] = await Promise.all([
        getProjects(),
        getBlogPosts()
      ])
      setProjects(projectsData)
      setBlogs(blogPostsData)
    } catch (err) {
      setError("Failed to fetch data")
      console.error("Error fetching data:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (isLoading) {
    return <div className="container py-12 text-center">Loading...</div>
  }

  if (error) {
    return <div className="container py-12 text-center text-red-500">{error}</div>
  }

  return (
    <div className="container py-12 space-y-16">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center gap-8 py-8">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Hi, I'm <span className="text-primary">Rwigara Rodrigue</span>
          </h1>
          <p className="text-xl text-muted-foreground">Full Stack Developer & UI/UX Designer</p>
          <p className="text-muted-foreground max-w-prose">
            I build accessible, user-friendly web applications with modern technologies. Passionate about creating
            elegant solutions to complex problems.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/projects">View Projects</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Me</Link>
            </Button>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full overflow-hidden border-4 border-primary/20">
            <Image src="/profile.png" alt="Rwigara Rodrigue" fill className="object-cover" priority />
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Skills & Expertise</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Technologies and tools I work with on a daily basis</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            "JavaScript",
            "TypeScript",
            "React.js",
            "Next.js",
            "Node.js",
            "Express",
            "MongoDB",
            "MySQL",
            "PostgreSQL",
            "Tailwind CSS",
            "React Native",
            "System Design",
            "Mermaid",
            "UI/UX Design",
            "Figma",
            "Version Control",
            "Cloud Computing",
            "Docker",
            "CI/CD",
            "Testing and Integration",
            "Jest",
            "Mocha",
            "Version controll",
            "Project management",
            "Cypress",
            "Team Mangement"
          ].map((skill) => (
            <Card key={skill} className="border-primary/20">
              <CardContent className="p-4 text-center">
                <p className="font-medium">{skill}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Featured Projects</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/projects" className="flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project._id} className="overflow-hidden flex flex-col h-full">
              <div className="relative h-48">
                <Image
                  src={project.image || "/placeholder.svg?height=200&width=400"}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="flex-1 flex flex-col p-6 space-y-4">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <p className="text-muted-foreground flex-1">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 3 && <Badge variant="outline">+{project.tags.length - 3}</Badge>}
                </div>
                <Button variant="outline" size="sm" asChild className="w-full mt-auto">
                  <Link href={`/projects/${project._id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Recent Blog Posts</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog" className="flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {blogs.map((post) => (
            <Card key={post._id} className="flex flex-col h-full">
              <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span>•</span>
                  <FileText className="h-4 w-4" />
                  <span>{post.readTime || "5 min read"}</span>
                </div>
                <h3 className="text-xl font-bold">{post.title}</h3>
                <p className="text-muted-foreground flex-1">{post.excerpt}</p>
                <Button variant="ghost" size="sm" className="w-fit" asChild>
                  <Link href={`/blog/${post._id}`}>Read More</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
