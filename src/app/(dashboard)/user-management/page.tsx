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
import { RoleProtectedRoute } from '@/components/role-protected-route'
import { useAuth } from '@/context/auth-context'
import { useGetUsersQuery } from '@/store/api/userApi'

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
  const [editingUser, setEditingUser] = useState<any>(null)
  
  // Get refetch function from the query
  const { refetch: refetchUsers } = useGetUsersQuery({ limit: 20, offset: 0 })

  const handleEdit = (user: any) => {
    setEditingUser(user)
    setActiveTab('edit')
  }

  const handleSuccess = async () => {
    setEditingUser(null)
    setActiveTab('list')
    // Refetch the user list to show updated data
    await refetchUsers()
  }

  const handleCancel = () => {
    setEditingUser(null)
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
                <TabsTrigger value="list">User List</TabsTrigger>
                <TabsTrigger value="create">Create User</TabsTrigger>
                {editingUser && <TabsTrigger value="edit">Edit User</TabsTrigger>}
              </TabsList>
              <div className="flex items-center space-x-2">
                <Button onClick={() => setActiveTab('create')}>
                  Add New User
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
                <UserList onEdit={handleEdit} onRefetch={refetchUsers} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
               <br/>
              <CardContent>
                <UserForm 
                  mode="create" 
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {editingUser && (
            <TabsContent value="edit" className="space-y-4">
              <Card>
                <br/>
                <CardContent>
                  <UserForm 
                    mode="edit" 
                    user={editingUser}
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
