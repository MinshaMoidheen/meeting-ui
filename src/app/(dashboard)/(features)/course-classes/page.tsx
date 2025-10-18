'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, BookOpen, List, Grid3X3, Folder } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CourseClassModal } from '@/components/course-class-modal'
import {
  useGetCourseClassesQuery,
  useCreateCourseClassMutation,
  useUpdateCourseClassMutation,
  useDeleteCourseClassMutation,
  CourseClass,
  CreateCourseClassRequest,
  UpdateCourseClassRequest,
} from '@/store/api/courseClassApi'
import { toast } from '@/hooks/use-toast'

type ViewMode = 'list' | 'grid' | 'folder'

export default function CourseClassesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourseClass, setEditingCourseClass] = useState<CourseClass | null>(null)
  const [deletingCourseClass, setDeletingCourseClass] = useState<CourseClass | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  // Dummy data for development and testing
  const dummyCourseClasses: CourseClass[] = [
    {
      _id: '1',
      name: 'Mathematics 101',
      description: 'Introduction to basic mathematical concepts including algebra, geometry, and trigonometry.',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      name: 'Computer Science Fundamentals',
      description: 'Core concepts in computer science including programming, data structures, and algorithms.',
      createdAt: '2024-01-20T14:15:00Z',
      updatedAt: '2024-01-20T14:15:00Z'
    },
    {
      _id: '3',
      name: 'English Literature',
      description: 'Study of classic and contemporary English literature with focus on critical analysis.',
      createdAt: '2024-01-25T09:45:00Z',
      updatedAt: '2024-01-25T09:45:00Z'
    },
    {
      _id: '4',
      name: 'Physics Lab',
      description: 'Hands-on experiments and practical applications of physics principles.',
      createdAt: '2024-02-01T11:20:00Z',
      updatedAt: '2024-02-01T11:20:00Z'
    },
    {
      _id: '5',
      name: 'History of Art',
      description: 'Survey of art history from ancient times to modern era with emphasis on cultural context.',
      createdAt: '2024-02-05T16:30:00Z',
      updatedAt: '2024-02-05T16:30:00Z'
    },
    {
      _id: '6',
      name: 'Chemistry Advanced',
      description: 'Advanced topics in chemistry including organic chemistry, biochemistry, and analytical methods.',
      createdAt: '2024-02-10T13:45:00Z',
      updatedAt: '2024-02-10T13:45:00Z'
    },
    
  ]

  // Use dummy data as fallback for development/testing
  // Remove dummyCourseClasses when API is connected: const { data: courseClasses = [], isLoading, error } = useGetCourseClassesQuery()
  const { data: courseClasses = dummyCourseClasses, isLoading, error } = useGetCourseClassesQuery()
  const [createCourseClass, { isLoading: isCreating }] = useCreateCourseClassMutation()
  const [updateCourseClass, { isLoading: isUpdating }] = useUpdateCourseClassMutation()
  const [deleteCourseClass, { isLoading: isDeleting }] = useDeleteCourseClassMutation()

  const handleCreate = () => {
    setEditingCourseClass(null)
    setIsModalOpen(true)
  }

  const handleEdit = (courseClass: CourseClass) => {
    setEditingCourseClass(courseClass)
    setIsModalOpen(true)
  }

  const handleDelete = (courseClass: CourseClass) => {
    setDeletingCourseClass(courseClass)
  }

  const handleModalSubmit = async (data: CreateCourseClassRequest | UpdateCourseClassRequest) => {
    try {
      if (editingCourseClass) {
        await updateCourseClass({
          id: editingCourseClass._id,
          data: data as UpdateCourseClassRequest,
        }).unwrap()
        toast({
          title: 'Success',
          description: 'Course class updated successfully.',
        })
      } else {
        await createCourseClass(data as CreateCourseClassRequest).unwrap()
        toast({
          title: 'Success',
          description: 'Course class created successfully.',
        })
      }
      setIsModalOpen(false)
      setEditingCourseClass(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save course class. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingCourseClass) return

    try {
      await deleteCourseClass(deletingCourseClass._id).unwrap()
      toast({
        title: 'Success',
        description: 'Course class deleted successfully.',
      })
      setDeletingCourseClass(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete course class. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const renderListView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courseClasses.map((courseClass) => (
          <TableRow key={courseClass._id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                {courseClass.name}
              </div>
            </TableCell>
            <TableCell>
              {courseClass.description ? (
                <span className="text-sm text-muted-foreground">
                  {courseClass.description}
                </span>
              ) : (
                <Badge variant="secondary">No description</Badge>
              )}
            </TableCell>
            <TableCell>
              {courseClass.createdAt
                ? new Date(courseClass.createdAt).toLocaleDateString()
                : 'N/A'}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(courseClass)}
                  disabled={isUpdating}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(courseClass)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {courseClasses.map((courseClass) => (
        <Card key={courseClass._id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{courseClass.name}</CardTitle>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(courseClass)}
                  disabled={isUpdating}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(courseClass)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {courseClass.description ? (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {courseClass.description}
              </p>
            ) : (
              <Badge variant="secondary" className="text-xs">No description</Badge>
            )}
            <div className="mt-3 text-xs text-muted-foreground">
              Created: {courseClass.createdAt
                ? new Date(courseClass.createdAt).toLocaleDateString()
                : 'N/A'}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderFolderView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {courseClasses.map((courseClass) => (
        <Card key={courseClass._id} className="hover:shadow-md transition-shadow group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Folder className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{courseClass.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">Course Class</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(courseClass)}
                  disabled={isUpdating}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(courseClass)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {courseClass.description ? (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {courseClass.description}
              </p>
            ) : (
              <Badge variant="secondary" className="text-xs">No description</Badge>
            )}
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Created: {courseClass.createdAt
                  ? new Date(courseClass.createdAt).toLocaleDateString()
                  : 'N/A'}
              </span>
              <Badge variant="outline" className="text-xs">
                {courseClass.name.length} chars
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <Card className="w-96">
  //         <CardContent className="pt-6">
  //           <div className="text-center">
  //             <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
  //             <h3 className="mt-2 text-sm font-semibold text-gray-900">Error</h3>
  //             <p className="mt-1 text-sm text-gray-500">
  //               Failed to load course classes. Please try again.
  //             </p>
  //           </div>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   )
  // }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Classes</h1>
          <p className="text-muted-foreground">
            Manage course classes and their descriptions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 px-3"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'folder' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('folder')}
              className="h-8 px-3"
            >
              <Folder className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleCreate} disabled={isCreating}>
            <Plus className="mr-2 h-4 w-4" />
            Add Course Class
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Course Classes {viewMode === 'list' ? 'List' : viewMode === 'grid' ? 'Grid' : 'Folders'}
          </CardTitle>
          <CardDescription>
            {viewMode === 'list' 
              ? 'A list of all course classes in the system'
              : viewMode === 'grid'
              ? 'Course classes displayed in a grid layout'
              : 'Course classes displayed as folders'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading course classes...</p>
              </div>
            </div>
          ) : courseClasses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No course classes</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new course class.
              </p>
              <div className="mt-6">
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Course Class
                </Button>
              </div>
            </div>
          ) : (
            <>
              {viewMode === 'list' && renderListView()}
              {viewMode === 'grid' && renderGridView()}
              {viewMode === 'folder' && renderFolderView()}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <CourseClassModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingCourseClass(null)
        }}
        courseClass={editingCourseClass}
        onSubmit={handleModalSubmit}
        isLoading={isCreating || isUpdating}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingCourseClass}
        onOpenChange={() => setDeletingCourseClass(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the course class{' '}
              <strong>{deletingCourseClass?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
