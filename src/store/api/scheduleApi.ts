import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '@/constants'

// Schedule interfaces
export interface Schedule {
  _id: string
  title: string
  description: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  location: string
  clientId: string
  client?: {
    _id: string
    username: string
    email: string
  }
  attendeeIds: string[]
  attendees?: Array<{
    _id: string
    username: string
    email: string
  }>
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface CreateScheduleRequest {
  title: string
  description: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  location: string
  clientId: string
  attendeeIds: string[]
  status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
}

export interface UpdateScheduleRequest {
  title?: string
  description?: string
  startDate?: string
  endDate?: string
  startTime?: string
  endTime?: string
  location?: string
  clientId?: string
  attendeeIds?: string[]
  status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
}

export interface CreateScheduleResponse {
  success: boolean
  message: string
  schedule: Schedule
}

export interface GetSchedulesResponse {
  success: boolean
  schedules: Schedule[]
  total: number
  page: number
  limit: number
}

export interface GetScheduleResponse {
  success: boolean
  schedule: Schedule
}

export interface DeleteScheduleResponse {
  success: boolean
  message: string
}

export interface StartScheduleResponse {
  success: boolean
  message: string
  schedule: Schedule
}

// Schedule API slice
export const scheduleApi = createApi({
  reducerPath: 'scheduleApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Schedule'],
  endpoints: (builder) => ({
    // Create schedule
    createSchedule: builder.mutation<CreateScheduleResponse, CreateScheduleRequest>({
      query: (data) => ({
        url: '/schedules',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Schedule'],
    }),

    // Get all schedules
    getSchedules: builder.query<GetSchedulesResponse, { 
      limit?: number; 
      offset?: number; 
      search?: string;
      status?: string;
      clientId?: string;
      startDate?: string;
      endDate?: string;
    }>({
      query: ({ 
        limit = 10, 
        offset = 0, 
        search = '', 
        status = '',
        clientId = '',
        startDate = '',
        endDate = ''
      } = {}) => ({
        url: '/schedules',
        method: 'GET',
        params: { limit, offset, search, status, clientId, startDate, endDate },
      }),
      providesTags: ['Schedule'],
    }),

    // Get schedule by ID
    getScheduleById: builder.query<GetScheduleResponse, string>({
      query: (scheduleId) => ({
        url: `/schedules/${scheduleId}`,
        method: 'GET',
      }),
      providesTags: (result, error, scheduleId) => [{ type: 'Schedule', id: scheduleId }],
    }),

    // Update schedule
    updateSchedule: builder.mutation<CreateScheduleResponse, { scheduleId: string; data: UpdateScheduleRequest }>({
      query: ({ scheduleId, data }) => ({
        url: `/schedules/${scheduleId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { scheduleId }) => [
        'Schedule',
        { type: 'Schedule', id: scheduleId },
      ],
    }),

    // Delete schedule
    deleteSchedule: builder.mutation<DeleteScheduleResponse, string>({
      query: (scheduleId) => ({
        url: `/schedules/${scheduleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Schedule'],
    }),

    // Start schedule (change status to in-progress)
    startSchedule: builder.mutation<StartScheduleResponse, string>({
      query: (scheduleId) => ({
        url: `/schedules/${scheduleId}/start`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, scheduleId) => [
        'Schedule',
        { type: 'Schedule', id: scheduleId },
      ],
    }),

    // Complete schedule (change status to completed)
    completeSchedule: builder.mutation<StartScheduleResponse, string>({
      query: (scheduleId) => ({
        url: `/schedules/${scheduleId}/complete`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, scheduleId) => [
        'Schedule',
        { type: 'Schedule', id: scheduleId },
      ],
    }),

    // Cancel schedule (change status to cancelled)
    cancelSchedule: builder.mutation<StartScheduleResponse, string>({
      query: (scheduleId) => ({
        url: `/schedules/${scheduleId}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, scheduleId) => [
        'Schedule',
        { type: 'Schedule', id: scheduleId },
      ],
    }),
  }),
})

// Export hooks for usage in functional components
export const {
  useCreateScheduleMutation,
  useGetSchedulesQuery,
  useGetScheduleByIdQuery,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useStartScheduleMutation,
  useCompleteScheduleMutation,
  useCancelScheduleMutation,
} = scheduleApi
