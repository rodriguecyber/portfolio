import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"
import { Suspense } from "react"

// Define types for our data
type BlogPost = {
  _id: string
  title: string
  excerpt: string
  content: string
  date?: string
  readTime?: string
  author: string
  tags: string[]
  image: string
  createdAt: string
  updatedAt: string
}

// Fetch data from the backend
async function getBlogPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs?sort=-createdAt`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!res.ok) {
      throw new Error("Failed to fetch blog posts")
    }

    const data = await res.json()
    return data.data as BlogPost[]
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

// Loading component
function BlogSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden flex flex-col h-full">
          <div className="relative h-48 bg-muted animate-pulse"></div>
          <CardContent className="flex-1 flex flex-col p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
              <span>•</span>
              <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="h-6 w-3/4 bg-muted animate-pulse rounded"></div>
            <div className="h-20 w-full bg-muted animate-pulse rounded"></div>
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
              <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="flex items-center justify-between pt-4 mt-auto">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
                <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Blog posts component
async function BlogPosts() {
  const posts = await getBlogPosts()

  // Fallback data in case the API is not available
 
  // Use fetched data or fallback if empt

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Card key={post._id} className="overflow-hidden flex flex-col h-full">
          <div className="relative h-48">
            <Image
              src={post.image || "/placeholder.svg?height=300&width=600"}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="flex-1 flex flex-col p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime || "5 min read"}</span>
              </div>
            </div>
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-muted-foreground flex-1">{post.excerpt}</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 2 && <Badge variant="outline">+{post.tags.length - 2}</Badge>}
            </div>
            <div className="flex items-center justify-between pt-4 mt-auto">
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted">
                  <User className="h-4 w-4 absolute inset-0 m-auto" />
                </div>
                <span className="text-sm">{post.author}</span>
              </div>
              <Link href={`/blog/${post._id}`} className="text-sm font-medium text-primary hover:underline">
                Read More
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function BlogPage() {
  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Blog</h1>
        <p className="text-muted-foreground max-w-3xl">
          Thoughts, tutorials, and insights on web development, design, and technology.
        </p>
      </div>

      <Suspense fallback={<BlogSkeleton />}>
        <BlogPosts />
      </Suspense>
    </div>
  )
}
