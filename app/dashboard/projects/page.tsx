"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
import { Loader2, MoreHorizontal, Plus, Search, Eye, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react"
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
import axios from "axios"

export default function ProjectsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)
  const [projectToPublish, setProjectToPublish] = useState<any | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
        
          headers:{
            "Authorization": `Bearer ${localStorage.getItem("rod-token")}`
          }
      })

      

      const data = res.data
      setProjects(data.data)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load projects",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id: string) => {
    setProjectToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handlePublishClick = (project: any) => {
    setProjectToPublish(project)
    setPublishDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!projectToDelete) return

    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectToDelete}`, {
        
        headers:{
          "Authorization": `Bearer ${localStorage.getItem("rod-token")}`
        }
      })

     

      toast({
        title: "Project Deleted",
        description: "The project has been successfully deleted",
      })

      // Remove from state
      setProjects(projects?.filter((project) => project._id !== projectToDelete))
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete project",
        variant: "destructive",
      })
    } finally {
      setProjectToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handlePublish = async () => {
    if (!projectToPublish) return

    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectToPublish._id}`,{
          published: !projectToPublish.published,
        }, {
        
        headers:{
          "Authorization": `Bearer ${localStorage.getItem("rod-token")}`
        }
        
       
      })

     

      toast({
        title: projectToPublish.published ? "Project Unpublished" : "Project Published",
        description: `The project has been ${projectToPublish.published ? "unpublished" : "published"} successfully`,
      })

      // Update in state
      setProjects(
        projects.map((project) =>
          project._id === projectToPublish._id ? { ...project, published: !project.published } : project,
        ),
      )
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update project",
        variant: "destructive",
      })
    } finally {
      setProjectToPublish(null)
      setPublishDialogOpen(false)
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading projects...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects by title or tag..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {searchTerm
                ? `No projects match "${searchTerm}". Try a different search term.`
                : "You haven't created any projects yet. Create one to get started."}
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link href="/dashboard/projects/new">
                  <Plus className="mr-2 h-4 w-4" /> New Project
                </Link>
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Versions</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project._id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>
                    {project.published ? (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        <CheckCircle className="mr-1 h-3 w-3" /> Published
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <XCircle className="mr-1 h-3 w-3" /> Draft
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="mr-1">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && <Badge variant="outline">+{project.tags.length - 3}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{project.versions?.length || 0}</TableCell>
                  <TableCell>
                    {project.publishedAt
                      ? format(new Date(project.publishedAt), "MMM d, yyyy")
                      : format(new Date(project.createdAt), "MMM d, yyyy") + " (Draft)"}
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => router.push(`/projects/${project.slug || project._id}`)}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/projects/edit/${project._id}`)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePublishClick(project)}>
                          {project.published ? (
                            <>
                              <XCircle className="mr-2 h-4 w-4" /> Unpublish
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" /> Publish
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(project._id)}
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
              This action cannot be undone. This will permanently delete the project and all associated data.
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

      {/* Publish/Unpublish Confirmation Dialog */}
      <AlertDialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {projectToPublish?.published ? "Unpublish Project?" : "Publish Project?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {projectToPublish?.published
                ? "This project will no longer be visible to the public."
                : "This project will be visible to the public."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublish}>
              {projectToPublish?.published ? "Unpublish" : "Publish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
