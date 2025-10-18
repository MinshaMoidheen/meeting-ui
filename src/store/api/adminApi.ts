import { baseApi } from './baseApi'

export interface CreateAdminRequest {
  name: string
  email: string
  password: string
  company: string
  workingDays: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
}

export interface Admin {
  _id: string
  name: string
  email: string
  company: string
  workingDays: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
  createdAt: string
  updatedAt: string
}

export interface CreateAdminResponse {
  message: string
  admin: Admin
}

export interface GetAdminsResponse {
  message: string
  admins: Admin[]
  total: number
  limit: number
  offset: number
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAdmin: builder.mutation<CreateAdminResponse, CreateAdminRequest>({
      query: (adminData) => ({
        url: '/admins',
        method: 'POST',
        body: adminData,
        credentials: 'include',
      }),
    }),
    getAdmins: builder.query<GetAdminsResponse, { limit?: number; offset?: number }>({
      query: ({ limit = 20, offset = 0 } = {}) => ({
        url: `/admins?limit=${limit}&offset=${offset}`,
        method: 'GET',
        credentials: 'include',
      }),
    }),
    getAdminById: builder.query<{ message: string; admin: Admin }, string>({
      query: (adminId) => ({
        url: `/admins/${adminId}`,
        method: 'GET',
        credentials: 'include',
      }),
    }),
    updateAdmin: builder.mutation<{ message: string; admin: Admin }, { adminId: string; data: Partial<CreateAdminRequest> }>({
      query: ({ adminId, data }) => ({
        url: `/admins/${adminId}`,
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
    }),
    deleteAdmin: builder.mutation<{ message: string }, string>({
      query: (adminId) => ({
        url: `/admins/${adminId}`,
        method: 'DELETE',
        credentials: 'include',
      }),
    }),
  }),
})

export const {
  useCreateAdminMutation,
  useGetAdminsQuery,
  useGetAdminByIdQuery,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} = adminApi
