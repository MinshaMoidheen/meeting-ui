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
  otherAttendees?: string
  organizer: string
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
        <div className="p-4 md:p-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4 mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="sm:w-auto">
              <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:grid-cols-3">
                <TabsTrigger value="list" className="text-xs sm:text-sm">Schedule List</TabsTrigger>
                <TabsTrigger value="create" className="text-xs sm:text-sm">Create Schedule</TabsTrigger>
                {editingSchedule && <TabsTrigger value="edit" className="text-xs sm:text-sm">Edit Schedule</TabsTrigger>}
              </TabsList>
            </Tabs>
            {activeTab === 'list' && (
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => setActiveTab('create')}
                  className="w-full sm:w-auto text-xs sm:text-sm"
                  size="sm"
                >
                  Add New Schedule
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {activeTab === 'list' && (
              <Card>
                {/* <br/> */}
                <CardContent className="p-4 md:p-6">
                  <ScheduleList onEdit={handleEdit} />
                </CardContent>
              </Card>
            )}

            {activeTab === 'create' && (
              <Card>
                 {/* <br/> */}
                <CardContent className="p-4 md:p-6">
                  <ScheduleForm 
                    mode="create" 
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                  />
                </CardContent>
              </Card>
            )}

            {activeTab === 'edit' && editingSchedule && (
              <Card>
                {/* <br/> */}
                <CardContent className="p-4 md:p-6">
                  <ScheduleForm 
                    mode="edit" 
                    schedule={editingSchedule}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Main>
    </RoleProtectedRoute>
  )
}

