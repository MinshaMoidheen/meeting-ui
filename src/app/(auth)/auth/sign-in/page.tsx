'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserAuthForm } from '../components/user-auth-form'
import { TeacherAuthForm } from '../components/teacher-auth-form'
import { GraduationCap, User } from 'lucide-react'

export default function SignIn() {
  const [isTeacherLogin, setIsTeacherLogin] = useState(false)

  return (
    <Card className='p-6'>
      <div className='flex flex-col space-y-4'>
        {/* Header with toggle */}
        <div className='flex flex-col space-y-2 text-left'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            {isTeacherLogin ? 'Teacher Login' : 'Login'}
          </h1>
          <p className='text-sm text-muted-foreground'>
            {isTeacherLogin 
              ? 'Enter your teacher credentials below to access the teacher portal'
              : 'Enter your email and password below to log into your account'
            }
          </p>
        </div>

        {/* Login Type Toggle */}
        <div className='flex rounded-lg border p-1'>
          <Button
            variant={!isTeacherLogin ? 'default' : 'ghost'}
            size='sm'
            className='flex-1'
            onClick={() => setIsTeacherLogin(false)}
          >
            <User className='mr-2 h-4 w-4' />
            Admin
          </Button>
          <Button
            variant={isTeacherLogin ? 'default' : 'ghost'}
            size='sm'
            className='flex-1'
            onClick={() => setIsTeacherLogin(true)}
          >
            <GraduationCap className='mr-2 h-4 w-4' />
            Teacher
          </Button>
        </div>

        {/* Form */}
        {isTeacherLogin ? <TeacherAuthForm /> : <UserAuthForm />}

        {/* Terms and Privacy */}
        <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
          By clicking login, you agree to our{' '}
          <a
            href='/terms'
            className='underline underline-offset-4 hover:text-primary'
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href='/privacy'
            className='underline underline-offset-4 hover:text-primary'
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </Card>
  )
}
