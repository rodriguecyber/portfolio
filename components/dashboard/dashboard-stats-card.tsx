import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DashboardStatsCardProps {
  title: string
  icon: React.ReactNode
  total: number
  published?: number
  draft?: number
  publishedLabel?: string
  draftLabel?: string
  hidePublishedDraft?: boolean
  link: string
}

export default function DashboardStatsCard({
  title,
  icon,
  total,
  published = 0,
  draft = 0,
  publishedLabel = "Published",
  draftLabel = "Draft",
  hidePublishedDraft = false,
  link,
}: DashboardStatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <Link href={link} className="block">
          <div className="text-2xl font-bold">{total}</div>
          {!hidePublishedDraft && (
            <div className="mt-2 flex gap-2">
              <Badge variant="secondary" className="px-2">
                {publishedLabel}: {published}
              </Badge>
              <Badge variant="outline" className="px-2">
                {draftLabel}: {draft}
              </Badge>
            </div>
          )}
        </Link>
      </CardContent>
    </Card>
  )
}
