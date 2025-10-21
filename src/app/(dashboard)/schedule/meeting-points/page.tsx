'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Header } from '@/components/layout/header'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Main } from '@/components/ui/main'
import { HeaderContainer } from '@/components/ui/header-container'
import { RoleProtectedRoute } from '@/components/role-protected-route'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Meeting Point interface
interface MeetingPoint {
  id: string
  pointsDiscussed: string
  planOfAction: string
  accountability: string
}

const topNav = [
  {
    title: 'Meeting Points',
    href: 'schedule/meeting-points',
    isActive: true,
    disabled: false,
  },
]

export default function MeetingPointsPage() {
  const router = useRouter()
  const [points, setPoints] = useState<MeetingPoint[]>([
    {
      id: '1',
      pointsDiscussed: '',
      planOfAction: '',
      accountability: '',
    }
  ])

  const addNewPoint = () => {
    const newPoint: MeetingPoint = {
      id: Date.now().toString(),
      pointsDiscussed: '',
      planOfAction: '',
      accountability: '',
    }
    setPoints([...points, newPoint])
  }

  const removePoint = (id: string) => {
    if (points.length > 1) {
      setPoints(points.filter(point => point.id !== id))
    }
  }

  const updatePoint = (id: string, field: keyof MeetingPoint, value: string) => {
    setPoints(points.map(point => 
      point.id === id ? { ...point, [field]: value } : point
    ))
  }

  const handleSave = () => {
    // Here you would typically save the data to your API
    console.log('Saving meeting points:', points)
    // Show success message or redirect
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
          <div className="flex items-center justify-between w-full">
             <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            <div className="flex items-center space-x-2">
             
              <Button onClick={handleSave}>
                Save All Points
              </Button>
            </div>
          </div>
        </HeaderContainer>

        <Card className="mt-6">
          <br/> 
          <CardContent>
            <div className="space-y-4">
              {/* Table Headers */}
              <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 rounded-lg font-medium text-sm">
                <div className="col-span-4">Points Discussed</div>
                <div className="col-span-4">Plan of Action</div>
                <div className="col-span-3">Accountability</div>
                <div className="col-span-1">Actions</div>
              </div>

              {/* Table Rows */}
              {points.map((point, index) => (
                <div key={point.id} className="grid grid-cols-12 gap-4 p-4 border rounded-lg">
                  <div className="col-span-4">
                    <Textarea
                      placeholder="Enter the points discussed in the meeting..."
                      value={point.pointsDiscussed}
                      onChange={(e) => updatePoint(point.id, 'pointsDiscussed', e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="col-span-4">
                    <Textarea
                      placeholder="Enter the plan of action for this point..."
                      value={point.planOfAction}
                      onChange={(e) => updatePoint(point.id, 'planOfAction', e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      placeholder="Who is accountable?"
                      value={point.accountability}
                      onChange={(e) => updatePoint(point.id, 'accountability', e.target.value)}
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removePoint(point.id)}
                      disabled={points.length === 1}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add Point Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={addNewPoint}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Point</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Main>
    </RoleProtectedRoute>
  )
}
