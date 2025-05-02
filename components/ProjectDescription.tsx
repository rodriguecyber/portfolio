'use client'
import DOMPurify from 'dompurify'
import { formatDistanceToNow } from 'date-fns'
export default function ProjectDescription({ html }: { html: string }) {
  return (
    <div
      className="prose prose-lg dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  )
}