'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FileUpload } from '@/components/ui/file-upload'
import { 
  Upload, 
  Download, 
  FileText, 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Header } from '@/components/layout/header'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Main } from '@/components/ui/main'
import { HeaderContainer } from '@/components/ui/header-container'
import { RoleProtectedRoute } from '@/components/role-protected-route'
import { CSVProcessor } from '@/utils/csvProcessor'

const topNav = [
  {
    title: 'Import Management',
    href: 'import',
    isActive: true,
    disabled: false,
  },
]

export default function ImportPage() {
  const [activeTab, setActiveTab] = useState('attendees')
  const [attendeesFile, setAttendeesFile] = useState<File | null>(null)
  const [meetingsFile, setMeetingsFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [importResults, setImportResults] = useState<{
    attendees: { success: number; errors: number; total: number }
    meetings: { success: number; errors: number; total: number }
  } | null>(null)

  const handleAttendeesFileChange = (file: File | null) => {
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setAttendeesFile(file)
        toast({
          title: 'File Selected',
          description: `Selected ${file.name} for attendees import`,
        })
      } else {
        toast({
          title: 'Invalid File Type',
          description: 'Please select a CSV file for attendees import',
          variant: 'destructive',
        })
      }
    } else {
      setAttendeesFile(null)
    }
  }

  const handleMeetingsFileChange = (file: File | null) => {
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setMeetingsFile(file)
        toast({
          title: 'File Selected',
          description: `Selected ${file.name} for meetings import`,
        })
      } else {
        toast({
          title: 'Invalid File Type',
          description: 'Please select a CSV file for meetings import',
          variant: 'destructive',
        })
      }
    } else {
      setMeetingsFile(null)
    }
  }

  const downloadTemplate = (type: 'attendees' | 'meetings') => {
    const templates = {
      attendees: {
        filename: 'attendees_template.csv',
        content: 'username,email,firstName,lastName,phone,company,department,role\njohn.doe@example.com,john.doe@example.com,John,Doe,+1234567890,Acme Corp,IT,Developer\njane.smith@example.com,jane.smith@example.com,Jane,Smith,+1234567891,Tech Inc,Marketing,Manager'
      },
      meetings: {
        filename: 'meetings_template.csv',
        content: 'title,description,startDate,endDate,startTime,endTime,location,clientId,organizer,otherAttendees,status\nTeam Meeting,Weekly team standup,2024-12-25,2024-12-25,09:00,10:00,Conference Room A,client1,John Doe,External: Mike Smith,scheduled\nClient Call,Project discussion,2024-12-26,2024-12-26,14:00,15:30,Online,client2,Jane Smith,,scheduled'
      }
    }

    const template = templates[type]
    const blob = new Blob([template.content], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = template.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast({
      title: 'Template Downloaded',
      description: `${template.filename} has been downloaded`,
    })
  }

  const handleImport = async (type: 'attendees' | 'meetings') => {
    const file = type === 'attendees' ? attendeesFile : meetingsFile
    if (!file) {
      toast({
        title: 'No File Selected',
        description: `Please select a ${type} file to import`,
        variant: 'destructive',
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Process CSV file
      const result = await CSVProcessor.processFile(file, type)
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      setImportResults(prev => ({
        attendees: prev?.attendees || { success: 0, errors: 0, total: 0 },
        meetings: prev?.meetings || { success: 0, errors: 0, total: 0 },
        [type]: result
      }))

      if (result.errors > 0) {
        toast({
          title: 'Import Completed with Errors',
          description: `Imported ${result.success} records successfully, ${result.errors} errors found`,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Import Successful',
          description: `Successfully imported ${result.success} ${type} records`,
        })
      }

      // Reset file input
      if (type === 'attendees') {
        setAttendeesFile(null)
      } else {
        setMeetingsFile(null)
      }

    } catch (error) {
      toast({
        title: 'Import Failed',
        description: `Failed to import ${type} data. Please try again.`,
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
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
                <TabsTrigger value="attendees" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Import Attendees</span>
                </TabsTrigger>
                <TabsTrigger value="meetings" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Import Meetings</span>
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadTemplate('attendees')}
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Attendees Template</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadTemplate('meetings')}
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Meetings Template</span>
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Import attendees and meetings data using CSV files. Download the templates above to ensure proper formatting.
                </AlertDescription>
              </Alert>
            </div>

            {/* Attendees Import */}
            <TabsContent value="attendees" className="space-y-4">
              <Card>
                <br/>
                <CardContent>
                    <div className="space-y-6">
                     

                      {/* File Upload */}
                    <FileUpload
                      onFileSelect={handleAttendeesFileChange}
                      accept={{ "text/csv": [".csv"] }}
                      maxFiles={1}
                      disabled={isUploading}
                      placeholder="Choose CSV file or drag and drop"
                      label="Select Attendees File"
                      id="attendees-file"
                    />

                    {/* Upload Progress */}
                    {isUploading && activeTab === 'attendees' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="w-full" />
                      </div>
                    )}

                    {/* Import Button */}
                    <Button
                      onClick={() => handleImport('attendees')}
                      disabled={!attendeesFile || isUploading}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isUploading ? 'Importing...' : 'Import Attendees'}
                    </Button>

                    {/* Results */}
                    {importResults?.attendees && (
                      <div className="space-y-2">
                        <Label>Import Results</Label>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center justify-center space-x-1 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="font-semibold">{importResults.attendees.success}</span>
                            </div>
                            <p className="text-xs text-green-600">Success</p>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded-lg">
                            <div className="flex items-center justify-center space-x-1 text-red-600">
                              <XCircle className="h-4 w-4" />
                              <span className="font-semibold">{importResults.attendees.errors}</span>
                            </div>
                            <p className="text-xs text-red-600">Errors</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-center space-x-1 text-gray-600">
                              <FileText className="h-4 w-4" />
                              <span className="font-semibold">{importResults.attendees.total}</span>
                            </div>
                            <p className="text-xs text-gray-600">Total</p>
                          </div>
                        </div>
                      </div>
                    )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

            {/* Meetings Import */}
            <TabsContent value="meetings" className="space-y-4">
              <Card>
                <br/>
                <CardContent>
                    <div className="space-y-6">
                     

                      {/* File Upload */}
                    <FileUpload
                      onFileSelect={handleMeetingsFileChange}
                      accept={{ "text/csv": [".csv"] }}
                      maxFiles={1}
                      disabled={isUploading}
                      placeholder="Choose CSV file or drag and drop"
                      label="Select Meetings File"
                      id="meetings-file"
                    />

                    {/* Upload Progress */}
                    {isUploading && activeTab === 'meetings' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="w-full" />
                      </div>
                    )}

                    {/* Import Button */}
                    <Button
                      onClick={() => handleImport('meetings')}
                      disabled={!meetingsFile || isUploading}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isUploading ? 'Importing...' : 'Import Meetings'}
                    </Button>

                    {/* Results */}
                    {importResults?.meetings && (
                      <div className="space-y-2">
                        <Label>Import Results</Label>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center justify-center space-x-1 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="font-semibold">{importResults.meetings.success}</span>
                            </div>
                            <p className="text-xs text-green-600">Success</p>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded-lg">
                            <div className="flex items-center justify-center space-x-1 text-red-600">
                              <XCircle className="h-4 w-4" />
                              <span className="font-semibold">{importResults.meetings.errors}</span>
                            </div>
                            <p className="text-xs text-red-600">Errors</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-center space-x-1 text-gray-600">
                              <FileText className="h-4 w-4" />
                              <span className="font-semibold">{importResults.meetings.total}</span>
                            </div>
                            <p className="text-xs text-gray-600">Total</p>
                          </div>
                        </div>
                      </div>
                    )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
        </HeaderContainer>
      </Main>
    </RoleProtectedRoute>
  )
}
