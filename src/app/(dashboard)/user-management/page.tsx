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
import { UserList } from './components/user-list'
import { UserForm } from './components/user-form'
import { useAuth } from '@/context/auth-context'

const topNav = [
  {
    title: 'User Management',
    href: 'user-management',
    isActive: true,
    disabled: false,
  },
]

export default function UserManagementPage() {
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
            <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
            <div className="flex items-center space-x-2">
              <Button onClick={() => setActiveTab('create')}>
                Add New User
              </Button>
            </div>
          </>
        </HeaderContainer>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">User List</TabsTrigger>
            <TabsTrigger value="create">Create User</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  Manage user accounts and their attendance settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserList onEdit={(user) => setActiveTab('edit')} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New User</CardTitle>
                <CardDescription>
                  Add a new user account to the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserForm 
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
                <CardTitle>Edit User</CardTitle>
                <CardDescription>
                  Update user account information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserForm 
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
