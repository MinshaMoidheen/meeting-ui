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
import { ClientList } from './components/client-list'
import { ClientForm } from './components/client-form'
import { RoleProtectedRoute } from '@/components/role-protected-route'

// Mock client data for design purposes
export interface Client {
  _id: string
  username: string
  email: string
  phoneNumber: string
  createdAt: string
  updatedAt: string
}

const topNav = [
  {
    title: 'Client Management',
    href: 'client-management',
    isActive: true,
    disabled: false,
  },
]

export default function ClientManagementPage() {
  const [activeTab, setActiveTab] = useState('list')
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined)

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setActiveTab('edit')
  }

  const handleSuccess = () => {
    setEditingClient(undefined)
    setActiveTab('list')
  }

  const handleCancel = () => {
    setEditingClient(undefined)
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
            <h1 className="text-2xl font-bold tracking-tight">Client Management</h1>
            <div className="flex items-center space-x-2">
              <Button onClick={() => setActiveTab('create')}>
                Add New Client
              </Button>
            </div>
          </>
        </HeaderContainer>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Client List</TabsTrigger>
            <TabsTrigger value="create">Create Client</TabsTrigger>
            {editingClient && <TabsTrigger value="edit">Edit Client</TabsTrigger>}
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Clients</CardTitle>
                <CardDescription>
                  Manage client accounts and their contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientList onEdit={handleEdit} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Client</CardTitle>
                <CardDescription>
                  Add a new client account to the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientForm 
                  mode="create" 
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {editingClient && (
            <TabsContent value="edit" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Client</CardTitle>
                  <CardDescription>
                    Update client account information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ClientForm 
                    mode="edit" 
                    client={editingClient}
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
