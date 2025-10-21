'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Main } from '@/components/ui/main'
import { HeaderContainer } from '@/components/ui/header-container'
import { ScheduleList } from './components/schedule-list'
import { ScheduleForm } from './components/schedule-form'
import { RoleProtectedRoute } from '@/components/role-protected-route'

// Schedule interface
export interface Schedule {
  _id: string
  title: string
  description: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  location: string
  clientId: string
  client?: {
    _id: string
    username: string
    email: string
  }
  attendeeIds: string[]
  attendees?: Array<{
    _id: string
    username: string
    email: string
  }>
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

const topNav = [
  {
    title: 'Schedule Management',
    href: 'schedule',
    isActive: true,
    disabled: false,
  },
]

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState('list')
  const [editingSchedule, setEditingSchedule] = useState<Schedule | undefined>(undefined)

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setActiveTab('edit')
  }

  const handleSuccess = () => {
    setEditingSchedule(undefined)
    setActiveTab('list')
  }

  const handleCancel = () => {
    setEditingSchedule(undefined)
    setActiveTab('list')
  }

  return (
    <RoleProtectedRoute allowedRoles={['admin', 'superadmin']}>
      <Header fixed>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <HeaderContainer>
          <>
            <h1 className="text-2xl font-bold tracking-tight">Schedule Management</h1>
            <div className="flex items-center space-x-2">
              <Button onClick={() => setActiveTab('create')}>
                Add New Schedule
              </Button>
            </div>
          </>
        </HeaderContainer>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Schedule List</TabsTrigger>
            <TabsTrigger value="create">Create Schedule</TabsTrigger>
            {editingSchedule && <TabsTrigger value="edit">Edit Schedule</TabsTrigger>}
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Schedules</CardTitle>
                <CardDescription>
                  Manage scheduled events, meetings, and appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScheduleList onEdit={handleEdit} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Schedule</CardTitle>
                <CardDescription>
                  Add a new scheduled event to the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScheduleForm 
                  mode="create" 
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {editingSchedule && (
            <TabsContent value="edit" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Schedule</CardTitle>
                  <CardDescription>
                    Update schedule information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScheduleForm 
                    mode="edit" 
                    schedule={editingSchedule}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </Main>
    </RoleProtectedRoute>
  )
}

