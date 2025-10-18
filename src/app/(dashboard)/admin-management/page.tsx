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
import { AdminList } from './components/admin-list'
import { AdminForm } from './components/admin-form'
import { useAuth } from '@/context/auth-context'

const topNav = [
  {
    title: 'Admin Management',
    href: 'admin-management',
    isActive: true,
    disabled: false,
  },
]

export default function AdminManagementPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('list')

  return (
    <>
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
            <h1 className="text-2xl font-bold tracking-tight">Admin Management</h1>
            <div className="flex items-center space-x-2">
              <Button onClick={() => setActiveTab('create')}>
                Add New Admin
              </Button>
            </div>
          </>
        </HeaderContainer>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Admin List</TabsTrigger>
            <TabsTrigger value="create">Create Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Admins</CardTitle>
                <CardDescription>
                  Manage admin accounts and their permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminList onEdit={(admin) => setActiveTab('edit')} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Admin</CardTitle>
                <CardDescription>
                  Add a new admin account to the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminForm 
                  mode="create" 
                  onSuccess={() => setActiveTab('list')}
                  onCancel={() => setActiveTab('list')}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="edit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Edit Admin</CardTitle>
                <CardDescription>
                  Update admin account information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminForm 
                  mode="edit" 
                  onSuccess={() => setActiveTab('list')}
                  onCancel={() => setActiveTab('list')}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
