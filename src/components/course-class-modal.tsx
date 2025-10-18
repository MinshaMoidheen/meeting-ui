'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { CourseClass, CreateCourseClassRequest, UpdateCourseClassRequest } from '@/store/api/courseClassApi'

const courseClassSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
})

type CourseClassFormData = z.infer<typeof courseClassSchema>

interface CourseClassModalProps {
  isOpen: boolean
  onClose: () => void
  courseClass?: CourseClass | null
  onSubmit: (data: CreateCourseClassRequest | UpdateCourseClassRequest) => void
  isLoading?: boolean
}

export function CourseClassModal({
  isOpen,
  onClose,
  courseClass,
  onSubmit,
  isLoading = false,
}: CourseClassModalProps) {
  const form = useForm<CourseClassFormData>({
    resolver: zodResolver(courseClassSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  useEffect(() => {
    if (courseClass) {
      form.reset({
        name: courseClass.name,
        description: courseClass.description || '',
      })
    } else {
      form.reset({
        name: '',
        description: '',
      })
    }
  }, [courseClass, form])

  const handleSubmit = (data: CourseClassFormData) => {
    onSubmit(data)
  }

  const isEdit = !!courseClass

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Course Class' : 'Add New Course Class'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the course class information below.'
              : 'Fill in the details to create a new course class.'
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter course class name"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter course class description (optional)"
                      className="resize-none"
                      rows={3}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? isEdit
                    ? 'Updating...'
                    : 'Creating...'
                  : isEdit
                  ? 'Update Course Class'
                  : 'Create Course Class'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
