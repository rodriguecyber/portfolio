"use client"

import { useState, useEffect } from "react"
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
import { Loader2, MoreHorizontal, Search, Mail, Trash2, CheckCircle, XCircle } from "lucide-react"
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

export default function SubscribersPage() {
  const { toast } = useToast()
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [subscriberToDelete, setSubscriberToDelete] = useState<string | null>(null)
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false)
  const [subscriberToToggle, setSubscriberToToggle] = useState<any | null>(null)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/subscribers`, {
        headers:{
          "Authorization": `Bearer ${localStorage.getItem("rod-token")}`
        }
      })

      const {data }=  res

      setSubscribers(data.data)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load subscribers",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id: string) => {
    setSubscriberToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleToggleClick = (subscriber: any) => {
    setSubscriberToToggle(subscriber)
    setToggleDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!subscriberToDelete) return

    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/subscribers/id/${subscriberToDelete}`, {
        headers:{
          "Authorization": `Bearer ${localStorage.getItem("rod-token")}`
        }
      })

    

      toast({
        title: "Subscriber Deleted",
        description: "The subscriber has been successfully deleted",
      })

      // Remove from state
      setSubscribers(subscribers.filter((subscriber) => subscriber._id !== subscriberToDelete))
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete subscriber",
        variant: "destructive",
      })
    } finally {
      setSubscriberToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleToggleActive = async () => {
    if (!subscriberToToggle) return

    try {
      // For activating, we'd use a PUT endpoint, but for deactivating we use the unsubscribe endpoint
      let res

      if (!subscriberToToggle.active) {
        // Activate
        res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/subscribers/activate/${subscriberToToggle._id}`, {
         
          headers:{
            "Authorization": `Bearer ${localStorage.getItem("rod-token")}`
          }
        })
      } else {
        // Deactivate (unsubscribe)
        res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/subscribers/${subscriberToToggle.email}`, {
         
          headers:{
            "Authorization": `Bearer ${localStorage.getItem("rod-token")}`
          }
        })
      }


      toast({
        title: subscriberToToggle.active ? "Subscriber Deactivated" : "Subscriber Activated",
        description: `The subscriber has been ${subscriberToToggle.active ? "deactivated" : "activated"} successfully`,
      })

      // Update in state
      setSubscribers(
        subscribers.map((subscriber) =>
          subscriber._id === subscriberToToggle._id ? { ...subscriber, active: !subscriber.active } : subscriber,
        ),
      )
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : `Failed to ${subscriberToToggle.active ? "deactivate" : "activate"} subscriber`,
        variant: "destructive",
      })
    } finally {
      setSubscriberToToggle(null)
      setToggleDialogOpen(false)
    }
  }

  const filteredSubscribers = subscribers.filter((subscriber) => {
    // Filter by search term
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by status
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && subscriber.active) ||
      (filterStatus === "inactive" && !subscriber.active)

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading subscribers...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subscribers..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredSubscribers.length === 0 ? (
        <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No subscribers found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {searchTerm || filterStatus !== "all"
                ? "No subscribers match your filters. Try different search terms or filters."
                : "There are no newsletter subscribers yet."}
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscribed Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscribers.map((subscriber) => (
                <TableRow key={subscriber._id}>
                  <TableCell className="font-medium">{subscriber.email}</TableCell>
                  <TableCell>
                    {subscriber.active ? (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        <CheckCircle className="mr-1 h-3 w-3" /> Active
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <XCircle className="mr-1 h-3 w-3" /> Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{format(new Date(subscriber.createdAt), "MMM d, yyyy")}</TableCell>
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
                        <DropdownMenuItem asChild>
                          <a href={`mailto:${subscriber.email}`}>
                            <Mail className="mr-2 h-4 w-4" /> Send Email
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleClick(subscriber)}>
                          {subscriber.active ? (
                            <>
                              <XCircle className="mr-2 h-4 w-4" /> Deactivate
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" /> Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(subscriber._id)}
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
              This action cannot be undone. This will permanently delete the subscriber from your database.
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

      {/* Toggle Active Status Dialog */}
      <AlertDialog open={toggleDialogOpen} onOpenChange={setToggleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {subscriberToToggle?.active ? "Deactivate Subscriber?" : "Activate Subscriber?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {subscriberToToggle?.active
                ? "This subscriber will no longer receive newsletter emails."
                : "This subscriber will start receiving newsletter emails again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleActive}>
              {subscriberToToggle?.active ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
