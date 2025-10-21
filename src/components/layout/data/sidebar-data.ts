import {
  IconHome,
  IconUsers,
  IconShoppingBag,
  IconPercentage,
  IconShoppingCart,
  IconTrendingUp,
  IconBuilding,
  IconSettings,
  IconHelp,
  IconPlus,
  IconBrandWhatsapp,
  IconNetwork,
  IconBook,
  IconUserCheck,
  IconUserPlus,
  IconUsersGroup,
  IconCalendarEvent,
  IconCalendar,
  IconUpload,
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd, BookOpen, CalendarDays, Clock, History, Play, Upload, Download } from 'lucide-react'
import { type SidebarData } from '../types'

export type UserRole = 'user' | 'admin' | 'superadmin'

export interface SidebarItem {
  title: string
  url: string
  icon: any
  allowedRoles?: UserRole[]
}

// Define all sidebar items with role restrictions
const allSidebarItems: SidebarItem[] = [
  {
    title: 'Home',
    url: '/',
    icon: IconHome,
    allowedRoles: ['user', 'admin', 'superadmin'],
  },
  {
    title: 'Admin Management',
    url: '/admin-management',
    icon: IconUserCheck,
    allowedRoles: ['superadmin'], // Only superadmin can see admin management
  },
  {
    title: 'Users',
    url: '/user-management',
    icon: IconUserPlus,
    allowedRoles: ['admin', 'superadmin'], // Admin and superadmin can see user management
  },
  {
    title: 'Clients',
    url: '/client-management',
    icon: IconUsersGroup,
    allowedRoles: ['admin', 'superadmin'], // Admin and superadmin can see client management
  },
  {
    title: 'Client Attendees',
    url: '/client-attendees',
    icon: IconCalendarEvent,
    allowedRoles: ['admin', 'superadmin'], // Admin and superadmin can see client attendees
  },
  {
    title: 'Schedule',
    url: '/schedule',
    icon: CalendarDays,
    allowedRoles: ['admin', 'superadmin'], // Admin and superadmin can see schedule
  },
  {
    title: 'Incoming Meetings',
    url: '/schedule/incoming',
    icon: Clock,
    allowedRoles: ['admin', 'superadmin'],
  },
  {
    title: 'Ongoing Meetings',
    url: '/schedule/ongoing',
    icon: Play,
    allowedRoles: ['admin', 'superadmin'],
  },
  {
    title: 'Previous Meetings',
    url: '/schedule/previous',
    icon: History,
    allowedRoles: ['admin', 'superadmin'],
  },
  {
    title: 'Import Data',
    url: '/import',
    icon: Upload,
    allowedRoles: ['admin', 'superadmin'],
  },
  {
    title: 'Export Data',
    url: '/export',
    icon: Download,
    allowedRoles: ['admin', 'superadmin'],
  },
  // {
  //   title: 'Settings',
  //   url: '/settings',
  //   icon: IconSettings,
  //   allowedRoles: ['user', 'admin', 'superadmin'],
  // },
  // {
  //   title: 'Help Center',
  //   url: '/help-center',
  //   icon: IconHelp,
  //   allowedRoles: ['user', 'admin', 'superadmin'],
  // },
]

// Function to get sidebar data based on user role
export const getSidebarData = (userRole?: UserRole): SidebarData => {
  const filteredItems = allSidebarItems.filter(item => 
    !item.allowedRoles || item.allowedRoles.includes(userRole || 'user')
  )

  return {
    user: {
      name: 'Guest User',
      email: 'guest@example.com',
      avatar: '/avatars/default.svg',
    },
    teams: [
      {
        name: 'MeetWise',
        logo: Command,
        plan: 'Meeting Management',
      },
      {
        name: 'Acme Inc',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise',
      },
      {
        name: 'Acme Corp.',
        logo: AudioWaveform,
        plan: 'Startup',
      },
    ],
    navGroups: [
      {
        title: '',
        items: filteredItems,
      },
    ],
  }
}

// Default sidebar data (for backward compatibility)
export const sidebarData: SidebarData = getSidebarData()
