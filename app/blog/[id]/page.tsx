import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, ArrowLeft } from "lucide-react"
import { LikeButton } from "@/components/like-button"
import { CommentSection } from "@/components/comment-section"

// Define types for our data
type BlogPost = {
  _id: string
  title: string
  excerpt: string
  content: string
  date?: string
  readTime?: string
  author: {_id:string, name:string}
  tags: string[]
  image: string
  createdAt: string
  updatedAt: string
}

// Fetch data from the backend
async function getBlogPost(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${id}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!res.ok) {
      if (res.status === 404) {
        return null
      }
      throw new Error("Failed to fetch blog post")
    }

    const data = await res.json()
    return data.data as BlogPost
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await getBlogPost(params.id)

  if (!post) {
    notFound()
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/blog" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </Button>

        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">{post.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime || "5 min read"}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{post.author.name}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <Image
              src={post.image || "/placeholder.svg?height=400&width=800"}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Like Button */}
          <div className="flex justify-center py-4">
            <LikeButton contentId={post._id} contentType="blog" />
          </div>

          {/* Comments Section */}
          <div className="mt-12 pt-8 border-t">
            <CommentSection contentId={post._id} contentType="blog" />
          </div>
        </div>
      </div>
    </div>
  )
}
