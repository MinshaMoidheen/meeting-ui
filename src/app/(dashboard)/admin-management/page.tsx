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
import { RoleProtectedRoute } from '@/components/role-protected-route'
import { useAuth } from '@/context/auth-context'
import { useGetAdminsQuery } from '@/store/api/adminApi'

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
  const [editingAdmin, setEditingAdmin] = useState<any>(null)
  
  // Get refetch function from the query
  const { refetch: refetchAdmins } = useGetAdminsQuery({ limit: 20, offset: 0 })

  const handleEdit = (admin: any) => {
    setEditingAdmin(admin)
    setActiveTab('edit')
  }

  const handleSuccess = async () => {
    setEditingAdmin(null)
    setActiveTab('list')
    // Refetch the admin list to show updated data
    await refetchAdmins()
  }

  const handleCancel = () => {
    setEditingAdmin(null)
    setActiveTab('list')
  }

  return (
    <RoleProtectedRoute allowedRoles={['superadmin']}>
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
            {editingAdmin && <TabsTrigger value="edit">Edit Admin</TabsTrigger>}
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
                <AdminList onEdit={handleEdit} onRefetch={refetchAdmins} />
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
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {editingAdmin && (
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
                    admin={editingAdmin}
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
