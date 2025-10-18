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
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd, BookOpen } from 'lucide-react'
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
    title: 'User Management',
    url: '/user-management',
    icon: IconUserPlus,
    allowedRoles: ['admin', 'superadmin'], // Admin and superadmin can see user management
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: IconSettings,
    allowedRoles: ['user', 'admin', 'superadmin'],
  },
  {
    title: 'Help Center',
    url: '/help-center',
    icon: IconHelp,
    allowedRoles: ['user', 'admin', 'superadmin'],
  },
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
        name: 'Next Shadcn Admin',
        logo: Command,
        plan: 'Next.js + ShadcnUI',
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
