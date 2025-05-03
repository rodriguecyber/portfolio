"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, Mail, Trash2, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import axios from "axios"

interface MessageDetailPageProps {
  params: {
    id: string
  }
}

export default function MessageDetailPage({ params }: MessageDetailPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [message, setMessage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [readDialogOpen, setReadDialogOpen] = useState(false)

  useEffect(() => {
    fetchMessage()
  }, [])

  const fetchMessage = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts/${params.id}`, {
        withCredentials:true,
        headers:{
          "Authorization": `Bearer ${localStorage.getItem("rod-token")}`
        }
      })

      const {data }=  res

      setMessage(data.data)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load message",
        variant: "destructive",
      })
      router.push("/dashboard/messages")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts/${params.id}`, {
        withCredentials:true,
        headers:{
          "Authorization": `Bearer ${localStorage.getItem("rod-token")}`
        }
      })

     

      toast({
        title: "Message Deleted",
        description: "The message has been successfully deleted",
      })

      router.push("/dashboard/messages")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete message",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  const handleToggleRead = async () => {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts/${params.id}/read`, {
        withCredentials:true,
        headers:{
          "Authorization": `Bearer ${localStorage.getItem("rod-token")}`
        }
      })

     

      toast({
        title: message.read ? "Marked as Unread" : "Marked as Read",
        description: `The message has been marked as ${message.read ? "unread" : "read"}`,
      })

      // Update in state
      setMessage({ ...message, read: !message.read })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update message",
        variant: "destructive",
      })
    } finally {
      setReadDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading message...</span>
      </div>
    )
  }

  if (!message) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h3 className="text-lg font-semibold">Message not found</h3>
        <p className="text-muted-foreground">The message you're looking for doesn't exist or has been deleted.</p>
        <Button className="mt-4" onClick={() => router.push("/dashboard/messages")}>
          Back to Messages
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.push("/dashboard/messages")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Message Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={message.read ? "outline" : "default"} size="sm" onClick={() => setReadDialogOpen(true)}>
            {message.read ? (
              <>
                <XCircle className="mr-2 h-4 w-4" /> Mark as Unread
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" /> Mark as Read
              </>
            )}
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{message.subject}</CardTitle>
              <CardDescription>
                From {message.name} ({message.email})
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={message.read ? "outline" : "default"}>{message.read ? "Read" : "Unread"}</Badge>
              <span className="text-sm text-muted-foreground">
                {format(new Date(message.createdAt), "MMMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{message.message}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5" /> Reply
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Button asChild>
              <a href={`mailto:${message.email}?subject=Re: ${message.subject}`}>Reply via Email</a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href={`mailto:${message.email}?subject=Re: ${message.subject}&body=Dear ${message.name},%0D%0A%0D%0AThank you for your message.%0D%0A%0D%0A`}
              >
                Reply with Template
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toggle Read Status Dialog */}
      <AlertDialog open={readDialogOpen} onOpenChange={setReadDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{message.read ? "Mark as Unread?" : "Mark as Read?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {message.read ? "This message will be marked as unread." : "This message will be marked as read."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleRead}>
              {message.read ? "Mark as Unread" : "Mark as Read"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
