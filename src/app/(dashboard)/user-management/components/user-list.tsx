'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { 
  useGetUsersQuery, 
  useDeleteUserMutation,
  type User 
} from '@/store/api/userApi'
import { toast } from '@/hooks/use-toast'
import { MoreHorizontal, Search, Edit, Trash2, Eye, Clock } from 'lucide-react'

interface UserListProps {
  onEdit: (user: User) => void
  onRefetch?: () => void
}

export function UserList({ onEdit, onRefetch }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [limit] = useState(20)
  const [offset, setOffset] = useState(0)

  const { data, isLoading, error, refetch } = useGetUsersQuery({ limit, offset })
  const [deleteUser] = useDeleteUserMutation()

  const handleDelete = async (userId: string, userEmail: string) => {
    if (window.confirm(`Are you sure you want to delete user "${userEmail}"?`)) {
      try {
        await deleteUser(userId).unwrap()
        toast({
          title: 'User Deleted',
          description: 'User has been successfully deleted.',
        })
        // Refetch data after successful delete
        await refetch()
        // Also call parent refetch if provided
        if (onRefetch) {
          onRefetch()
        }
      } catch (error: any) {
        toast({
          title: 'Delete Failed',
          description: error?.data?.message || 'Failed to delete user.',
          variant: 'destructive',
        })
      }
    }
  }

  const filteredUsers = data?.users?.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.refAdmin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.refAdmin.company.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading users. Please try again.</p>
        <Button onClick={() => refetch()} className="mt-2">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Company</TableHead>
             
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.designation}</Badge>
                  </TableCell>
                  <TableCell>{user.refAdmin.name}</TableCell>
                  <TableCell>{user.refAdmin.company}</TableCell>
                 
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(user._id, user.email)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data && data.total > limit && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {offset + 1} to {Math.min(offset + limit, data.total)} of {data.total} users
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOffset(offset + limit)}
              disabled={offset + limit >= data.total}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
