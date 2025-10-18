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
import { ClientAttendeesList } from './components/client-attendees-list'
import { ClientAttendeesForm } from './components/client-attendees-form'
import { RoleProtectedRoute } from '@/components/role-protected-route'

// Client Attendee interface (same fields as client + client reference)
export interface ClientAttendee {
  _id: string
  username: string
  email: string
  phoneNumber: string
  clientId: string
  client?: {
    _id: string
    username: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

const topNav = [
  {
    title: 'Client Attendees',
    href: 'client-attendees',
    isActive: true,
    disabled: false,
  },
]

export default function ClientAttendeesPage() {
  const [activeTab, setActiveTab] = useState('list')
  const [editingAttendee, setEditingAttendee] = useState<ClientAttendee | undefined>(undefined)

  const handleEdit = (attendee: ClientAttendee) => {
    setEditingAttendee(attendee)
    setActiveTab('edit')
  }

  const handleSuccess = () => {
    setEditingAttendee(undefined)
    setActiveTab('list')
  }

  const handleCancel = () => {
    setEditingAttendee(undefined)
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
            <h1 className="text-2xl font-bold tracking-tight">Client Attendees</h1>
            <div className="flex items-center space-x-2">
              <Button onClick={() => setActiveTab('create')}>
                Add New Attendee
              </Button>
            </div>
          </>
        </HeaderContainer>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Attendees List</TabsTrigger>
            <TabsTrigger value="create">Create Attendee</TabsTrigger>
            {editingAttendee && <TabsTrigger value="edit">Edit Attendee</TabsTrigger>}
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Client Attendees</CardTitle>
                <CardDescription>
                  Manage client attendees and their contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientAttendeesList onEdit={handleEdit} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Attendee</CardTitle>
                <CardDescription>
                  Add a new client attendee to the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientAttendeesForm 
                  mode="create" 
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {editingAttendee && (
            <TabsContent value="edit" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Attendee</CardTitle>
                  <CardDescription>
                    Update attendee account information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ClientAttendeesForm 
                    mode="edit" 
                    attendee={editingAttendee}
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
