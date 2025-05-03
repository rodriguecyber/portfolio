"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, FileText, FolderKanban, MessageSquare, Mail, Users, Heart } from "lucide-react"
import DashboardStatsCard from "@/components/dashboard/dashboard-stats-card"
import DashboardRecentItems from "@/components/dashboard/dashboard-recent-items"
import DashboardChart from "@/components/dashboard/dashboard-chart"
import axios from "axios"

export default function DashboardPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`,
          {
        withCredentials:true,
        headers:{
          "Authorization": `Bearer ${localStorage.getItem("rod-token")}`
        }

          }
        )

        const data = await res.data
        setStats(data.data)
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [toast])

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardStatsCard
          title="Blogs"
          icon={<FileText className="h-5 w-5" />}
          total={stats.counts.blogs.total}
          published={stats.counts.blogs.published}
          draft={stats.counts.blogs.draft}
          link="/dashboard/blogs"
        />
        <DashboardStatsCard
          title="Projects"
          icon={<FolderKanban className="h-5 w-5" />}
          total={stats.counts.projects.total}
          published={stats.counts.projects.published}
          draft={stats.counts.projects.draft}
          link="/dashboard/projects"
        />
        <DashboardStatsCard
          title="Comments"
          icon={<MessageSquare className="h-5 w-5" />}
          total={stats.counts.comments.total}
          published={stats.counts.comments.approved}
          draft={stats.counts.comments.pending}
          publishedLabel="Approved"
          draftLabel="Pending"
          link="/dashboard/comments"
        />
        <DashboardStatsCard
          title="Messages"
          icon={<Mail className="h-5 w-5" />}
          total={stats.counts.contacts.total}
          published={stats.counts.contacts.read}
          draft={stats.counts.contacts.unread}
          publishedLabel="Read"
          draftLabel="Unread"
          link="/dashboard/messages"
        />
        <DashboardStatsCard
          title="Subscribers"
          icon={<Users className="h-5 w-5" />}
          total={stats.counts.subscribers}
          hidePublishedDraft
          link="/dashboard/subscribers"
        />
        <DashboardStatsCard
          title="Likes"
          icon={<Heart className="h-5 w-5" />}
          total={stats.counts.likes}
          hidePublishedDraft
          link="#"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Server Health</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardChart data={stats.serverHealth} />
          </CardContent>
        </Card>

        <Tabs defaultValue="blogs">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          <TabsContent value="blogs">
            <Card>
              <CardHeader>
                <CardTitle>Recent Blogs</CardTitle>
              </CardHeader>
              <CardContent>
                <DashboardRecentItems
                  items={stats.recent.blogs}
                  type="blog"
                  titleKey="title"
                  dateKey="createdAt"
                  statusKey="published"
                  linkPrefix="/dashboard/blogs"
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <DashboardRecentItems
                  items={stats.recent.projects}
                  type="project"
                  titleKey="title"
                  dateKey="createdAt"
                  statusKey="published"
                  linkPrefix="/dashboard/projects"
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="comments">
            <Card>
              <CardHeader>
                <CardTitle>Recent Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <DashboardRecentItems
                  items={stats.recent.comments}
                  type="comment"
                  titleKey="content"
                  dateKey="createdAt"
                  statusKey="approved"
                  authorKey="author.name"
                  linkPrefix="/dashboard/comments"
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <DashboardRecentItems
                  items={stats.recent.contacts}
                  type="message"
                  titleKey="subject"
                  dateKey="createdAt"
                  statusKey="read"
                  authorKey="name"
                  linkPrefix="/dashboard/messages"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
