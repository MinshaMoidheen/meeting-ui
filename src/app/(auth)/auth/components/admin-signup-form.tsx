'use client'

import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/context/auth-context'
import { useCreateAdminMutation } from '@/store/api/adminApi'
import { toast } from '@/hooks/use-toast'

type AdminSignupFormProps = HTMLAttributes<HTMLDivElement>

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

const signupFormSchema = z.object({
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
    .min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  company: z
    .string()
    .trim()
    .min(1, 'Company is required')
    .max(100, 'Company name must be less than 100 characters'),
  workingDays: workingDaysSchema,
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
)

export function AdminSignupForm({ className, ...props }: AdminSignupFormProps) {
  const { login } = useAuth()
  const [createAdminMutation, { isLoading }] = useCreateAdminMutation()

  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
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

  async function onSubmit(data: z.infer<typeof signupFormSchema>) {
    try {
      // Call admin creation API using RTK Query
      await createAdminMutation({
        name: data.name,
        email: data.email,
        password: data.password,
        company: data.company,
        workingDays: data.workingDays,
      }).unwrap()

      toast({
        title: 'Account Created Successfully',
        description: 'Your admin account has been created. Please log in.',
      })

      // Auto-login after successful signup
      await login(data.email, data.password)
      
    } catch (error: any) {
      console.error('Signup error:', error)
      toast({
        title: 'Signup Failed',
        description: error?.data?.message || error.message || 'Failed to create account. Please try again.',
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

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-4'>
            {/* Name Field */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder='John Doe' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='john@company.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Company Field */}
            <FormField
              control={form.control}
              name='company'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder='Your Company Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Fields */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder='********' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder='********' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Working Days */}
            {/* <FormField
              control={form.control}
              name='workingDays'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel>Working Days</FormLabel>
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                    {workingDays.map((day) => (
                      <div key={day.key} className='flex items-center space-x-2'>
                        <Checkbox
                          id={day.key}
                          checked={field.value[day.key]}
                          onCheckedChange={(checked) => {
                            field.onChange({
                              ...field.value,
                              [day.key]: checked,
                            })
                          }}
                        />
                        <label
                          htmlFor={day.key}
                          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                        >
                          {day.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <Button className='mt-2' disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </Form>

      {/* Login Link */}
      <div className='text-center'>
        <p className='text-sm text-muted-foreground'>
          Already have an account?{' '}
          <Link
            href='/auth/sign-in'
            className='font-medium text-primary hover:underline'
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
