"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2, MoreHorizontal, Search, Eye, CheckCircle, XCircle, Trash2 } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"

export default function MessagesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null)
  const [readDialogOpen, setReadDialogOpen] = useState(false)
  const [messageToToggle, setMessageToToggle] = useState<any | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts`, {
        
        headers:{
          "Authorization": `Bearer ${localStorage.getItem("rod-token")}`
        }
      })

      const {data }=  res
      setMessages(data.data)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load messages",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id: string) => {
    setMessageToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleToggleReadClick = (message: any) => {
    setMessageToToggle(message)
    setReadDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!messageToDelete) return

    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts/${messageToDelete}`, {
        
        headers:{
          "Authorization": `Bearer ${localStorage.getItem("rod-token")}`
        }
      })

     

      toast({
        title: "Message Deleted",
        description: "The message has been successfully deleted",
      })

      // Remove from state
      setMessages(messages.filter((message) => message._id !== messageToDelete))
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete message",
        variant: "destructive",
      })
    } finally {
      setMessageToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleToggleRead = async () => {
    if (!messageToToggle) return

    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts/${messageToToggle._id}/read`, {
        
        headers:{
          "Authorization": `Bearer ${localStorage.getItem("rod-token")}`
        }
      })

      

      toast({
        title: messageToToggle.read ? "Marked as Unread" : "Marked as Read",
        description: `The message has been marked as ${messageToToggle.read ? "unread" : "read"}`,
      })

      // Update in state
      setMessages(
        messages.map((message) =>
          message._id === messageToToggle._id ? { ...message, read: !message.read } : message,
        ),
      )
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update message",
        variant: "destructive",
      })
    } finally {
      setMessageToToggle(null)
      setReadDialogOpen(false)
    }
  }

  const filteredMessages = messages.filter((message) => {
    // Filter by search term
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by read status
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "read" && message.read) ||
      (filterStatus === "unread" && !message.read)

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading messages...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No messages found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {searchTerm || filterStatus !== "all"
                ? "No messages match your filters. Try different search terms or filters."
                : "There are no messages yet."}
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.map((message) => (
                <TableRow key={message._id} className={message.read ? "" : "font-medium bg-muted/30"}>
                  <TableCell className="font-medium">
                    {message.subject.length > 40 ? `${message.subject.substring(0, 40)}...` : message.subject}
                  </TableCell>
                  <TableCell>{message.name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell>
                    {message.read ? (
                      <Badge variant="outline">
                        <CheckCircle className="mr-1 h-3 w-3" /> Read
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-500 hover:bg-blue-600">
                        <XCircle className="mr-1 h-3 w-3" /> Unread
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{format(new Date(message.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/messages/${message._id}`)}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleReadClick(message)}>
                          {message.read ? (
                            <>
                              <XCircle className="mr-2 h-4 w-4" /> Mark as Unread
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" /> Mark as Read
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(message._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

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
            <AlertDialogTitle>{messageToToggle?.read ? "Mark as Unread?" : "Mark as Read?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {messageToToggle?.read
                ? "This message will be marked as unread."
                : "This message will be marked as read."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleRead}>
              {messageToToggle?.read ? "Mark as Unread" : "Mark as Read"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
