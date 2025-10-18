'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { PasswordInput } from '@/components/password-input'
import { 
  useCreateUserMutation, 
  useUpdateUserMutation,
  type User 
} from '@/store/api/userApi'
import { useGetAdminsQuery as useGetAdmins } from '@/store/api/adminApi'
import { useAuth } from '@/context/auth-context'
import { toast } from '@/hooks/use-toast'

const workingHoursSchema = z.object({
  punchin: z.object({
    from: z
      .string()
      .min(1, 'Punch in from time is required')
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
    to: z
      .string()
      .min(1, 'Punch in to time is required')
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  }),
  punchout: z.object({
    from: z
      .string()
      .min(1, 'Punch out from time is required')
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
    to: z
      .string()
      .min(1, 'Punch out to time is required')
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  }),
})

const userFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(50, 'Email must be less than 50 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .optional(),
  refAdmin: z
    .string()
    .min(1, 'Admin is required')
    .optional(), // Make optional since it will be set automatically for admin users
  designation: z
    .string()
    .trim()
    .min(1, 'Designation is required')
    .max(50, 'Designation must be less than 50 characters'),
  workingHours: workingHoursSchema,
  attendanceCoordinateId: z
    .string()
    .optional(),
})

type UserFormData = z.infer<typeof userFormSchema>

interface UserFormProps {
  mode: 'create' | 'edit'
  user?: User
  onSuccess: () => void
  onCancel: () => void
}

export function UserForm({ mode, user, onSuccess, onCancel }: UserFormProps) {
  const { user: currentUser } = useAuth()
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation()
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const { data: adminsData } = useGetAdmins({ limit: 100, offset: 0 })

  // Check if current user is admin (not superadmin)
  const isAdmin = currentUser?.userType === 'admin'
  const isSuperAdmin = currentUser?.userType === 'superadmin'

  console.log('Current User:', currentUser)
  console.log('Is Admin:', isAdmin)
  console.log('Admins Data:', adminsData)

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: '',
      password: '',
      refAdmin: isAdmin ? currentUser?._id || '' : '', // Set current admin as refAdmin if user is admin
      designation: '',
      workingHours: {
        punchin: {
          from: '09:00',
          to: '09:30',
        },
        punchout: {
          from: '17:00',
          to: '17:30',
        },
      },
      attendanceCoordinateId: '',
    },
  })

  // Populate form with user data when editing
  useEffect(() => {
    if (mode === 'edit' && user) {
      form.reset({
        email: user.email,
        password: '', // Don't populate password
        refAdmin: user.refAdmin._id,
        designation: user.designation,
        workingHours: user.workingHours,
        attendanceCoordinateId: user.attendanceCoordinateId || '',
      })
    } else if (mode === 'create' && isAdmin) {
      // For admin users creating new users, set their ID as refAdmin
      form.setValue('refAdmin', currentUser?._id || '')
    }
  }, [mode, user, form, isAdmin, currentUser])

  const onSubmit = async (data: UserFormData) => {
   
    try {
      if (mode === 'create') {
        if (!data.password) {
          form.setError('password', { message: 'Password is required for new users' })
          return
        }

       
        
        // Ensure refAdmin is set for admin users
        const submitData = { 
          email: data.email,
          password: data.password!, // Password is guaranteed to exist here
          refAdmin: isAdmin && currentUser?._id ? currentUser._id : data.refAdmin!,
          designation: data.designation,
          workingHours: data.workingHours,
          attendanceCoordinateId: data.attendanceCoordinateId
        }

       
        
        await createUser(submitData).unwrap()

            
        toast({
          title: 'User Created',
          description: 'User has been successfully created.',
        })
      } else {
        if (!user) {
          toast({
            title: 'Error',
            description: 'User data not found.',
            variant: 'destructive',
          })
          return
        }
        // Remove password if empty
        const updateData = { ...data }
        if (!updateData.password) {
          delete updateData.password
        }
        
        // Ensure refAdmin is set for admin users during edit
        if (isAdmin && currentUser?._id) {
          updateData.refAdmin = currentUser._id
        }
        
        await updateUser({ userId: user._id, data: updateData }).unwrap()
        toast({
          title: 'User Updated',
          description: 'User has been successfully updated.',
        })
      }
      onSuccess()
    } catch (error: any) {
      toast({
        title: mode === 'create' ? 'Create Failed' : 'Update Failed',
        description: error?.data?.message || `Failed to ${mode} user.`,
        variant: 'destructive',
      })
    }
  }

  const isLoading = isCreating || isUpdating

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="user@company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password {mode === 'edit' && '(leave empty to keep current)'}
                </FormLabel>
                <FormControl>
                  <PasswordInput 
                    placeholder={mode === 'edit' ? 'Enter new password' : '********'} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Admin - Only show for superadmin users */}
          {isSuperAdmin && (
            <FormField
              control={form.control}
              name="refAdmin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an admin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {adminsData?.admins?.map((admin) => (
                        <SelectItem key={admin._id} value={admin._id}>
                          {admin.name} ({admin.company})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          
          {/* Designation */}
          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., MANAGER, EMPLOYEE" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

      

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading 
              ? (mode === 'create' ? 'Creating...' : 'Updating...') 
              : (mode === 'create' ? 'Create User' : 'Update User')
            }
          </Button>
        </div>
      </form>
    </Form>
  )
}
