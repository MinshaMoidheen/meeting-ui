'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/hooks/use-toast'
import { Schedule } from '../page'
import { useGetClientsQuery } from '@/store/api/clientApi'
import { useGetClientAttendeesQuery } from '@/store/api/clientAttendeesApi'

const incomingScheduleFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters long')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters long')
    .max(500, 'Description must be less than 500 characters'),
  startDate: z
    .string()
    .min(1, 'Start date is required')
    .refine((date) => {
      const today = new Date().toISOString().split('T')[0]
      return date >= today
    }, 'Start date must be today or in the future'),
  endDate: z
    .string()
    .min(1, 'End date is required')
    .refine((date) => {
      const today = new Date().toISOString().split('T')[0]
      return date >= today
    }, 'End date must be today or in the future'),
  startTime: z
    .string()
    .min(1, 'Start time is required')
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z
    .string()
    .min(1, 'End time is required')
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  location: z
    .string()
    .trim()
    .min(1, 'Location is required')
    .min(3, 'Location must be at least 3 characters long')
    .max(100, 'Location must be less than 100 characters'),
  clientId: z
    .string()
    .min(1, 'Client is required'),
  attendeeIds: z
    .array(z.string())
    .optional()
    .default([]),
  otherAttendees: z
    .string()
    .optional(),
  organizer: z
    .string()
    .trim()
    .min(1, 'Organizer is required')
    .min(2, 'Organizer name must be at least 2 characters long')
    .max(100, 'Organizer name must be less than 100 characters'),
  status: z
    .enum(['scheduled', 'in-progress', 'completed', 'cancelled'])
    .default('scheduled'),
})

type IncomingScheduleFormData = z.infer<typeof incomingScheduleFormSchema>

interface IncomingScheduleFormProps {
  mode: 'create' | 'edit'
  schedule?: Schedule
  onSuccess: () => void
  onCancel: () => void
}

export function IncomingScheduleForm({ mode, schedule, onSuccess, onCancel }: IncomingScheduleFormProps) {
  const { data: clientsData } = useGetClientsQuery({ limit: 100, offset: 0 })
  const { data: attendeesData } = useGetClientAttendeesQuery({ limit: 100, offset: 0 })

  // Get all attendee IDs for default selection
  const allAttendeeIds = attendeesData?.attendees?.map(attendee => attendee._id) || []

  const form = useForm<IncomingScheduleFormData>({
    resolver: zodResolver(incomingScheduleFormSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      startTime: '09:00',
      endTime: '10:00',
      location: '',
      clientId: '',
      attendeeIds: allAttendeeIds, // All attendees selected by default
      otherAttendees: '',
      organizer: '',
      status: 'scheduled',
    },
  })

  // Update form when attendees data loads (for create mode)
  useEffect(() => {
    if (mode === 'create' && attendeesData?.attendees && allAttendeeIds.length > 0) {
      form.setValue('attendeeIds', allAttendeeIds)
    }
  }, [attendeesData, mode, allAttendeeIds, form])

  // Populate form with schedule data when editing
  useEffect(() => {
    if (mode === 'edit' && schedule) {
      form.reset({
        title: schedule.title,
        description: schedule.description,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        location: schedule.location,
        clientId: schedule.clientId,
        attendeeIds: schedule.attendeeIds || [],
        otherAttendees: schedule.otherAttendees || '',
        organizer: schedule.organizer || '',
        status: schedule.status,
      })
    }
  }, [mode, schedule, form])

  const onSubmit = async (data: IncomingScheduleFormData) => {
    try {
      // Mock API call - replace with actual API integration later
      console.log('Incoming Schedule data:', data)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: mode === 'create' ? 'Incoming Meeting Created' : 'Incoming Meeting Updated',
        description: `${data.title} has been ${mode === 'create' ? 'created' : 'updated'} successfully.`,
      })
      
      onSuccess()
    } catch (error: any) {
      toast({
        title: mode === 'create' ? 'Create Failed' : 'Update Failed',
        description: error?.message || `Failed to ${mode} incoming meeting.`,
        variant: 'destructive',
      })
    }
  }

  const isLoading = form.formState.isSubmitting

  // Helper functions for select all/deselect all
  const handleSelectAll = () => {
    form.setValue('attendeeIds', allAttendeeIds)
  }

  const handleDeselectAll = () => {
    form.setValue('attendeeIds', [])
  }

  const selectedAttendees = form.watch('attendeeIds') || []
  const isAllSelected = selectedAttendees.length === allAttendeeIds.length
  const isNoneSelected = selectedAttendees.length === 0

  // Get date/time constraints for incoming meetings
  const getDateConstraints = () => {
    const today = new Date().toISOString().split('T')[0]
    const now = new Date()
    const currentTime = now.toTimeString().slice(0, 5)
    
    return {
      minDate: today,
      minTime: currentTime,
      placeholder: 'Select future date and time'
    }
  }

  const dateConstraints = getDateConstraints()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Incoming Meeting Title" 
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the purpose and agenda of this incoming meeting..."
                    className="min-h-[100px]"
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date and Time Row */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Start Date */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date"
                      min={dateConstraints.minDate}
                      placeholder={dateConstraints.placeholder}
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Date */}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date"
                      min={dateConstraints.minDate}
                      placeholder={dateConstraints.placeholder}
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Time */}
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input 
                      type="time"
                      min={dateConstraints.minTime}
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Time */}
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input 
                      type="time"
                      min={dateConstraints.minTime}
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Conference Room A" 
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Client Selection */}
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clientsData?.clients?.map((client) => (
                      <SelectItem key={client._id} value={client._id}>
                        {client.username} ({client.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Attendees Selection */}
          <FormField
            control={form.control}
            name="attendeeIds"
            render={() => (
              <FormItem className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <FormLabel>Attendees</FormLabel>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                      disabled={isLoading || isAllSelected}
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDeselectAll}
                      disabled={isLoading || isNoneSelected}
                    >
                      Deselect All
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-48 overflow-y-auto border rounded-md p-4">
                  {attendeesData?.attendees?.map((attendee) => (
                    <FormField
                      key={attendee._id}
                      control={form.control}
                      name="attendeeIds"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={attendee._id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(attendee._id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, attendee._id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== attendee._id
                                        )
                                      )
                                }}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-normal">
                                {attendee.username}
                              </FormLabel>
                              <p className="text-xs text-muted-foreground">
                                {attendee.email}
                              </p>
                            </div>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {selectedAttendees.length} of {allAttendeeIds.length} attendees selected
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Other Attendees */}
          <FormField
            control={form.control}
            name="otherAttendees"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Other Attendees</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter names and emails of additional attendees not in the system (one per line)..."
                    className="min-h-[80px]"
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Organizer */}
          <FormField
            control={form.control}
            name="organizer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organizer</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Meeting organizer name" 
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Form Info */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Incoming Meeting Guidelines</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Title: 3-100 characters describing the incoming meeting/event</li>
            <li>• Description: 10-500 characters with meeting details and agenda</li>
            <li>• Date & Time: Select future dates and times (today or later)</li>
            <li>• Location: Specify where the meeting will take place</li>
            <li>• Client: Select which client this schedule belongs to</li>
            <li>• Attendees: All attendees are selected by default, uncheck to remove</li>
            <li>• Other Attendees: Add external attendees not in the system</li>
            <li>• Organizer: Name of the person organizing the meeting</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading 
              ? (mode === 'create' ? 'Creating...' : 'Updating...') 
              : (mode === 'create' ? 'Create Incoming Meeting' : 'Update Incoming Meeting')
            }
          </Button>
        </div>
      </form>
    </Form>
  )
}
