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
import { RoleProtectedRoute } from '@/components/role-protected-route'
import { IncomingScheduleForm } from '../components/incoming-schedule-form'
import { IncomingScheduleList } from '../components/incoming-schedule-list'
import { Schedule } from '../page'

const topNav = [
  {
    title: 'Incoming Meetings',
    href: 'schedule/incoming',
    isActive: true,
    disabled: false,
  },
]

export default function IncomingMeetingsPage() {
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between w-full">
              <TabsList>
                <TabsTrigger value="list">Incoming Meetings</TabsTrigger>
                <TabsTrigger value="create">Create Meeting</TabsTrigger>
                {editingSchedule && <TabsTrigger value="edit">Edit Meeting</TabsTrigger>}
              </TabsList>
              <div className="flex items-center space-x-2">
                <Button onClick={() => setActiveTab('create')}>
                  Add New Meeting
                </Button>
              </div>
            </div>
          </Tabs>
        </HeaderContainer>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsContent value="list" className="space-y-4">
            <Card>
              <br/>
              <CardContent>
                <IncomingScheduleList onEdit={handleEdit} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <br/>
              <CardContent>
                <IncomingScheduleForm 
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
                <br/>
                <CardContent>
                  <IncomingScheduleForm 
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