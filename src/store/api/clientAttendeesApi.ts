import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '@/constants'

// Client Attendee interfaces (same fields as client)
export interface ClientAttendee {
  _id: string
  username: string
  email: string
  phoneNumber: string
  createdAt: string
  updatedAt: string
}

export interface CreateClientAttendeeRequest {
  username: string
  email: string
  phoneNumber: string
}

export interface UpdateClientAttendeeRequest {
  username?: string
  email?: string
  phoneNumber?: string
}

export interface CreateClientAttendeeResponse {
  success: boolean
  message: string
  attendee: ClientAttendee
}

export interface GetClientAttendeesResponse {
  success: boolean
  attendees: ClientAttendee[]
  total: number
  page: number
  limit: number
}

export interface GetClientAttendeeResponse {
  success: boolean
  attendee: ClientAttendee
}

export interface DeleteClientAttendeeResponse {
  success: boolean
  message: string
}

// Client Attendees API slice
export const clientAttendeesApi = createApi({
  reducerPath: 'clientAttendeesApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['ClientAttendee'],
  endpoints: (builder) => ({
    // Create client attendee
    createClientAttendee: builder.mutation<CreateClientAttendeeResponse, CreateClientAttendeeRequest>({
      query: (data) => ({
        url: '/client-attendees',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ClientAttendee'],
    }),

    // Get all client attendees
    getClientAttendees: builder.query<GetClientAttendeesResponse, { limit?: number; offset?: number; search?: string }>({
      query: ({ limit = 10, offset = 0, search = '' } = {}) => ({
        url: '/client-attendees',
        method: 'GET',
        params: { limit, offset, search },
      }),
      providesTags: ['ClientAttendee'],
    }),

    // Get client attendee by ID
    getClientAttendeeById: builder.query<GetClientAttendeeResponse, string>({
      query: (attendeeId) => ({
        url: `/client-attendees/${attendeeId}`,
        method: 'GET',
      }),
      providesTags: (result, error, attendeeId) => [{ type: 'ClientAttendee', id: attendeeId }],
    }),

    // Update client attendee
    updateClientAttendee: builder.mutation<CreateClientAttendeeResponse, { attendeeId: string; data: UpdateClientAttendeeRequest }>({
      query: ({ attendeeId, data }) => ({
        url: `/client-attendees/${attendeeId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { attendeeId }) => [
        'ClientAttendee',
        { type: 'ClientAttendee', id: attendeeId },
      ],
    }),

    // Delete client attendee
    deleteClientAttendee: builder.mutation<DeleteClientAttendeeResponse, string>({
      query: (attendeeId) => ({
        url: `/client-attendees/${attendeeId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ClientAttendee'],
    }),

    // Check-in client attendee
    checkInClientAttendee: builder.mutation<{ success: boolean; message: string }, string>({
      query: (attendeeId) => ({
        url: `/client-attendees/${attendeeId}/check-in`,
        method: 'POST',
      }),
      invalidatesTags: ['ClientAttendee'],
    }),
  }),
})

// Export hooks for usage in functional components
export const {
  useCreateClientAttendeeMutation,
  useGetClientAttendeesQuery,
  useGetClientAttendeeByIdQuery,
  useUpdateClientAttendeeMutation,
  useDeleteClientAttendeeMutation,
  useCheckInClientAttendeeMutation,
} = clientAttendeesApi
