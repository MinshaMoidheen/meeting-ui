'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLoginMutation, useLogoutMutation, type User } from '@/store/api/authApi'
import { toast } from '@/hooks/use-toast'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  
  const [loginMutation] = useLoginMutation()
  const [logoutMutation] = useLogoutMutation()

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have cookies or localStorage data
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const result = await loginMutation({ email, password }).unwrap()
      
      const userData: User = {
        _id: result.user._id,
        email: result.user.email,
        name: result.user.name || result.user.email,
        userType: result.userType,
        ...result.user
      }
      
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${userData.name || userData.email}!`,
      })
      
      // Redirect based on user type
      if (result.userType === 'superadmin') {
        router.push('/')
      } else if (result.userType === 'admin') {
        router.push('/')
      } else {
        router.push('/')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      toast({
        title: 'Login Failed',
        description: error?.data?.message || 'Invalid email or password',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await logoutMutation().unwrap()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('user')
      router.push('/auth/sign-in')
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
