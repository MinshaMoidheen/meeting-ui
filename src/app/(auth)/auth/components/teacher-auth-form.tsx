'use client'

import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { GraduationCap, User, Lock, BookOpen, Users, Building } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type TeacherAuthFormProps = HTMLAttributes<HTMLDivElement>

const teacherFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Please enter your username' })
    .min(3, { message: 'Username must be at least 3 characters long' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
  class: z
    .string()
    .min(1, { message: 'Please select a class' }),
  division: z
    .string()
    .min(1, { message: 'Please select a division' }),
  subject: z
    .string()
    .min(1, { message: 'Please select a subject' }),
})

export function TeacherAuthForm({ className, ...props }: TeacherAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof teacherFormSchema>>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      username: '',
      password: '',
      class: '',
      division: '',
      subject: '',
    },
  })

  function onSubmit(data: z.infer<typeof teacherFormSchema>) {
    setIsLoading(true)
    // eslint-disable-next-line no-console
    console.log('Teacher login data:', data)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-4'>
            {/* Username Field */}
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel className='flex items-center gap-2'>
                    <User className='h-4 w-4' />
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder='Enter your username' 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel className='flex items-center gap-2'>
                      <Lock className='h-4 w-4' />
                      Password
                    </FormLabel>
                    <Link
                      href='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Class Selection */}
            <FormField
              control={form.control}
              name='class'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel className='flex items-center gap-2'>
                    <Building className='h-4 w-4' />
                    Class
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Class 1</SelectItem>
                      <SelectItem value="2">Class 2</SelectItem>
                      <SelectItem value="3">Class 3</SelectItem>
                      <SelectItem value="4">Class 4</SelectItem>
                      <SelectItem value="5">Class 5</SelectItem>
                      <SelectItem value="6">Class 6</SelectItem>
                      <SelectItem value="7">Class 7</SelectItem>
                      <SelectItem value="8">Class 8</SelectItem>
                      <SelectItem value="9">Class 9</SelectItem>
                      <SelectItem value="10">Class 10</SelectItem>
                      <SelectItem value="11">Class 11</SelectItem>
                      <SelectItem value="12">Class 12</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Division Selection */}
            <FormField
              control={form.control}
              name='division'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel className='flex items-center gap-2'>
                    <Users className='h-4 w-4' />
                    Division
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select division" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="A">Division A</SelectItem>
                      <SelectItem value="B">Division B</SelectItem>
                      <SelectItem value="C">Division C</SelectItem>
                      <SelectItem value="D">Division D</SelectItem>
                      <SelectItem value="E">Division E</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subject Selection */}
            <FormField
              control={form.control}
              name='subject'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel className='flex items-center gap-2'>
                    <BookOpen className='h-4 w-4' />
                    Subject
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="social-studies">Social Studies</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="geography">Geography</SelectItem>
                      <SelectItem value="computer-science">Computer Science</SelectItem>
                      <SelectItem value="physical-education">Physical Education</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button className='mt-2' disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in as Teacher'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
