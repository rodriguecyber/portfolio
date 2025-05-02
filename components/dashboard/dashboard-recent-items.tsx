import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

interface DashboardRecentItemsProps {
  items: any[]
  type: "blog" | "project" | "comment" | "message"
  titleKey: string
  dateKey: string
  statusKey: string
  authorKey?: string
  linkPrefix: string
}

export default function DashboardRecentItems({
  items,
  type,
  titleKey,
  dateKey,
  statusKey,
  authorKey,
  linkPrefix,
}: DashboardRecentItemsProps) {
  if (!items || items.length === 0) {
    return <div className="text-center text-muted-foreground">No recent items</div>
  }

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((prev, curr) => (prev ? prev[curr] : null), obj)
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item._id} className="flex items-center justify-between">
          <div className="space-y-1">
            <Link href={`${linkPrefix}/${item._id}`} className="font-medium hover:underline">
              {getNestedValue(item, titleKey).length > 40
                ? `${getNestedValue(item, titleKey).substring(0, 40)}...`
                : getNestedValue(item, titleKey)}
            </Link>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formatDistanceToNow(new Date(getNestedValue(item, dateKey)), { addSuffix: true })}</span>
              {authorKey && (
                <>
                  <span>•</span>
                  <span>{getNestedValue(item, authorKey)}</span>
                </>
              )}
            </div>
          </div>
          <Badge variant={getNestedValue(item, statusKey) ? "default" : "secondary"}>
            {getNestedValue(item, statusKey) ? (
              <>
                <CheckCircle className="mr-1 h-3 w-3" />
                {type === "blog" || type === "project" ? "Published" : type === "comment" ? "Approved" : "Read"}
              </>
            ) : (
              <>
                <XCircle className="mr-1 h-3 w-3" />
                {type === "blog" || type === "project" ? "Draft" : type === "comment" ? "Pending" : "Unread"}
              </>
            )}
          </Badge>
        </div>
      ))}
    </div>
  )
}
