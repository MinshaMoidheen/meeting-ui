'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
import { MoreHorizontal, Search, Edit, Trash2, Eye } from 'lucide-react'
import { Client } from '../page'
import { toast } from '@/hooks/use-toast'

// Mock data for design purposes
const mockClients: Client[] = [
  {
    _id: '1',
    username: 'john_doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1 (555) 123-4567',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    _id: '2',
    username: 'jane_smith',
    email: 'jane.smith@company.com',
    phoneNumber: '+1 (555) 987-6543',
    createdAt: '2024-01-20T14:45:00Z',
    updatedAt: '2024-01-22T09:15:00Z',
  },
  {
    _id: '3',
    username: 'bob_wilson',
    email: 'bob.wilson@business.org',
    phoneNumber: '+1 (555) 456-7890',
    createdAt: '2024-02-01T08:20:00Z',
    updatedAt: '2024-02-01T08:20:00Z',
  },
  {
    _id: '4',
    username: 'alice_brown',
    email: 'alice.brown@corp.net',
    phoneNumber: '+1 (555) 321-0987',
    createdAt: '2024-02-10T16:30:00Z',
    updatedAt: '2024-02-12T11:45:00Z',
  },
  {
    _id: '5',
    username: 'charlie_davis',
    email: 'charlie.davis@enterprise.com',
    phoneNumber: '+1 (555) 654-3210',
    createdAt: '2024-02-15T12:00:00Z',
    updatedAt: '2024-02-15T12:00:00Z',
  },
]

interface ClientListProps {
  onEdit: (client: Client) => void
}

export function ClientList({ onEdit }: ClientListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [clients] = useState<Client[]>(mockClients)

  // Filter clients based on search term
  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients

    const term = searchTerm.toLowerCase()
    return clients.filter(
      (client) =>
        client.username.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        client.phoneNumber.toLowerCase().includes(term)
    )
  }, [clients, searchTerm])

  const handleDelete = (client: Client) => {
    // Mock delete functionality
    toast({
      title: 'Client Deleted',
      description: `${client.username} has been deleted successfully.`,
    })
  }

  const handleView = (client: Client) => {
    // Mock view functionality
    toast({
      title: 'View Client',
      description: `Viewing details for ${client.username}`,
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Badge variant="secondary" className="ml-auto">
          {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Clients Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {searchTerm ? 'No clients found matching your search.' : 'No clients found.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {client.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span>{client.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phoneNumber}</TableCell>
                  <TableCell>{formatDate(client.createdAt)}</TableCell>
                  <TableCell>{formatDate(client.updatedAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                       
                        <DropdownMenuItem onClick={() => onEdit(client)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Client
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(client)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Client
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

      {/* Pagination placeholder */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredClients.length} of {clients.length} clients
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
