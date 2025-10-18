import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '@/constants'

// Client interfaces
export interface Client {
  _id: string
  username: string
  email: string
  phoneNumber: string
  createdAt: string
  updatedAt: string
}

export interface CreateClientRequest {
  username: string
  email: string
  phoneNumber: string
}

export interface UpdateClientRequest {
  username?: string
  email?: string
  phoneNumber?: string
}

export interface CreateClientResponse {
  success: boolean
  message: string
  client: Client
}

export interface GetClientsResponse {
  success: boolean
  clients: Client[]
  total: number
  page: number
  limit: number
}

export interface GetClientResponse {
  success: boolean
  client: Client
}

export interface DeleteClientResponse {
  success: boolean
  message: string
}

// Client API slice
export const clientApi = createApi({
  reducerPath: 'clientApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Client'],
  endpoints: (builder) => ({
    // Create client
    createClient: builder.mutation<CreateClientResponse, CreateClientRequest>({
      query: (data) => ({
        url: '/clients',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Client'],
    }),

    // Get all clients
    getClients: builder.query<GetClientsResponse, { limit?: number; offset?: number; search?: string }>({
      query: ({ limit = 10, offset = 0, search = '' } = {}) => ({
        url: '/clients',
        method: 'GET',
        params: { limit, offset, search },
      }),
      providesTags: ['Client'],
    }),

    // Get client by ID
    getClientById: builder.query<GetClientResponse, string>({
      query: (clientId) => ({
        url: `/clients/${clientId}`,
        method: 'GET',
      }),
      providesTags: (result, error, clientId) => [{ type: 'Client', id: clientId }],
    }),

    // Update client
    updateClient: builder.mutation<CreateClientResponse, { clientId: string; data: UpdateClientRequest }>({
      query: ({ clientId, data }) => ({
        url: `/clients/${clientId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { clientId }) => [
        'Client',
        { type: 'Client', id: clientId },
      ],
    }),

    // Delete client
    deleteClient: builder.mutation<DeleteClientResponse, string>({
      query: (clientId) => ({
        url: `/clients/${clientId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Client'],
    }),
  }),
})

// Export hooks for usage in functional components
export const {
  useCreateClientMutation,
  useGetClientsQuery,
  useGetClientByIdQuery,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientApi
