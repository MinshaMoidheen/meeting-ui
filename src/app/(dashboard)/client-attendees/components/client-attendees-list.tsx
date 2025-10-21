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
import { MoreHorizontal, Search, Edit, Trash2, Eye, UserCheck } from 'lucide-react'
import { ClientAttendee } from '../page'
import { toast } from '@/hooks/use-toast'

// Mock data for design purposes
const mockAttendees: ClientAttendee[] = [
  {
    _id: '1',
    username: 'alex_johnson',
    email: 'alex.johnson@company.com',
    phoneNumber: '+1 (555) 111-2222',
    clientId: 'client1',
    client: {
      _id: 'client1',
      username: 'john_doe',
      email: 'john.doe@example.com',
    },
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-10T09:15:00Z',
  },
  {
    _id: '2',
    username: 'sarah_wilson',
    email: 'sarah.wilson@business.org',
    phoneNumber: '+1 (555) 333-4444',
    clientId: 'client2',
    client: {
      _id: 'client2',
      username: 'jane_smith',
      email: 'jane.smith@company.com',
    },
    createdAt: '2024-01-12T14:30:00Z',
    updatedAt: '2024-01-15T10:20:00Z',
  },
  {
    _id: '3',
    username: 'mike_chen',
    email: 'mike.chen@corp.net',
    phoneNumber: '+1 (555) 555-6666',
    clientId: 'client1',
    client: {
      _id: 'client1',
      username: 'john_doe',
      email: 'john.doe@example.com',
    },
    createdAt: '2024-01-18T11:45:00Z',
    updatedAt: '2024-01-18T11:45:00Z',
  },
  {
    _id: '4',
    username: 'lisa_garcia',
    email: 'lisa.garcia@enterprise.com',
    phoneNumber: '+1 (555) 777-8888',
    clientId: 'client3',
    client: {
      _id: 'client3',
      username: 'bob_wilson',
      email: 'bob.wilson@business.org',
    },
    createdAt: '2024-01-25T16:20:00Z',
    updatedAt: '2024-01-28T13:10:00Z',
  },
  {
    _id: '5',
    username: 'david_kim',
    email: 'david.kim@startup.io',
    phoneNumber: '+1 (555) 999-0000',
    clientId: 'client2',
    client: {
      _id: 'client2',
      username: 'jane_smith',
      email: 'jane.smith@company.com',
    },
    createdAt: '2024-02-01T08:30:00Z',
    updatedAt: '2024-02-01T08:30:00Z',
  },
  {
    _id: '6',
    username: 'emma_taylor',
    email: 'emma.taylor@agency.co',
    phoneNumber: '+1 (555) 123-4567',
    clientId: 'client3',
    client: {
      _id: 'client3',
      username: 'bob_wilson',
      email: 'bob.wilson@business.org',
    },
    createdAt: '2024-02-05T12:15:00Z',
    updatedAt: '2024-02-07T15:45:00Z',
  },
]

interface ClientAttendeesListProps {
  onEdit: (attendee: ClientAttendee) => void
}

export function ClientAttendeesList({ onEdit }: ClientAttendeesListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [attendees] = useState<ClientAttendee[]>(mockAttendees)

  // Filter attendees based on search term
  const filteredAttendees = useMemo(() => {
    if (!searchTerm) return attendees

    const term = searchTerm.toLowerCase()
    return attendees.filter(
      (attendee) =>
        attendee.username.toLowerCase().includes(term) ||
        attendee.email.toLowerCase().includes(term) ||
        attendee.phoneNumber.toLowerCase().includes(term)
    )
  }, [attendees, searchTerm])

  const handleDelete = (attendee: ClientAttendee) => {
    // Mock delete functionality
    toast({
      title: 'Attendee Deleted',
      description: `${attendee.username} has been deleted successfully.`,
    })
  }

  const handleView = (attendee: ClientAttendee) => {
    // Mock view functionality
    toast({
      title: 'View Attendee',
      description: `Viewing details for ${attendee.username}`,
    })
  }

  const handleCheckIn = (attendee: ClientAttendee) => {
    // Mock check-in functionality
    toast({
      title: 'Check-in Successful',
      description: `${attendee.username} has been checked in.`,
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
            placeholder="Search attendees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Badge variant="secondary" className="ml-auto">
          {filteredAttendees.length} attendee{filteredAttendees.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Attendees Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttendees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {searchTerm ? 'No attendees found matching your search.' : 'No attendees found.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredAttendees.map((attendee) => (
                <TableRow key={attendee._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {attendee.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span>{attendee.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>{attendee.email}</TableCell>
                  <TableCell>{attendee.phoneNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">
                          {attendee.client?.username?.charAt(0).toUpperCase() || 'C'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{attendee.client?.username || 'Unknown Client'}</p>
                        <p className="text-xs text-muted-foreground">{attendee.client?.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(attendee.createdAt)}</TableCell>
                  <TableCell>{formatDate(attendee.updatedAt)}</TableCell>
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
                       
                        <DropdownMenuItem onClick={() => handleCheckIn(attendee)}>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Check In
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(attendee)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Attendee
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(attendee)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Attendee
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
          Showing {filteredAttendees.length} of {attendees.length} attendees
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
