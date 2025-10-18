'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PasswordInput } from '@/components/password-input'
import { 
  useCreateAdminMutation, 
  useUpdateAdminMutation,
  type Admin 
} from '@/store/api/adminApi'
import { toast } from '@/hooks/use-toast'

const workingDaysSchema = z.object({
  monday: z.boolean().default(true),
  tuesday: z.boolean().default(true),
  wednesday: z.boolean().default(true),
  thursday: z.boolean().default(true),
  friday: z.boolean().default(true),
  saturday: z.boolean().default(false),
  sunday: z.boolean().default(false),
}).refine(
  (data) => Object.values(data).some(day => day === true),
  {
    message: 'At least one working day must be selected',
  }
)

const adminFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters'),
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
  company: z
    .string()
    .trim()
    .min(1, 'Company is required')
    .max(100, 'Company name must be less than 100 characters'),
  workingDays: workingDaysSchema,
})

type AdminFormData = z.infer<typeof adminFormSchema>

interface AdminFormProps {
  mode: 'create' | 'edit'
  admin?: Admin
  onSuccess: () => void
  onCancel: () => void
}

export function AdminForm({ mode, admin, onSuccess, onCancel }: AdminFormProps) {
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation()
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation()

  const form = useForm<AdminFormData>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      company: '',
      workingDays: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
      },
    },
  })

  // Populate form with admin data when editing
  useEffect(() => {
    if (mode === 'edit' && admin) {
      form.reset({
        name: admin.name,
        email: admin.email,
        password: '', // Don't populate password
        company: admin.company,
        workingDays: admin.workingDays,
      })
    }
  }, [mode, admin, form])

  const onSubmit = async (data: AdminFormData) => {
    try {
      if (mode === 'create') {
        if (!data.password) {
          form.setError('password', { message: 'Password is required for new admins' })
          return
        }
        await createAdmin(data).unwrap()
        toast({
          title: 'Admin Created',
          description: 'Admin has been successfully created.',
        })
      } else {
        if (!admin) {
          toast({
            title: 'Error',
            description: 'Admin data not found.',
            variant: 'destructive',
          })
          return
        }
        // Remove password if empty
        const updateData = { ...data }
        if (!updateData.password) {
          delete updateData.password
        }
        await updateAdmin({ adminId: admin._id, data: updateData }).unwrap()
        toast({
          title: 'Admin Updated',
          description: 'Admin has been successfully updated.',
        })
      }
      onSuccess()
    } catch (error: any) {
      toast({
        title: mode === 'create' ? 'Create Failed' : 'Update Failed',
        description: error?.data?.message || `Failed to ${mode} admin.`,
        variant: 'destructive',
      })
    }
  }

  const workingDays = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ] as const

  const isLoading = isCreating || isUpdating

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Company */}
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Your Company Name" {...field} />
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
        </div>

       

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading 
              ? (mode === 'create' ? 'Creating...' : 'Updating...') 
              : (mode === 'create' ? 'Create Admin' : 'Update Admin')
            }
          </Button>
        </div>
      </form>
    </Form>
  )
}
