import { USER_URL } from '@/constants'
import { baseApi } from './baseApi'

export interface CreateUserRequest {
  email: string
  password: string
  refAdmin: string
  designation: string
  workingHours: {
    punchin: {
      from: string
      to: string
    }
    punchout: {
      from: string
      to: string
    }
  }
  attendanceCoordinateId?: string
  faceImages?: string[]
}

export interface User {
  _id: string
  email: string
  refAdmin: {
    _id: string
    name: string
    email: string
    company: string
  }
  designation: string
  workingHours: {
    punchin: {
      from: string
      to: string
    }
    punchout: {
      from: string
      to: string
    }
  }
  attendanceCoordinateId?: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserResponse {
  message: string
  user: User
}

export interface GetUsersResponse {
  message: string
  users: User[]
  total: number
  limit: number
  offset: number
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<CreateUserResponse, CreateUserRequest>({
      query: (userData) => ({
        url: USER_URL,
        method: 'POST',
        body: userData,
        credentials: 'include',
      }),
    }),
    getUsers: builder.query<GetUsersResponse, { limit?: number; offset?: number }>({
      query: ({ limit = 20, offset = 0 } = {}) => ({
        url: `${USER_URL}?limit=${limit}&offset=${offset}`,
        method: 'GET',
        credentials: 'include',
      }),
    }),
    getUserById: builder.query<{ message: string; user: User }, string>({
      query: (userId) => ({
        url: `${USER_URL}/${userId}`,
        method: 'GET',
        credentials: 'include',
      }),
    }),
    updateUser: builder.mutation<{ message: string; user: User }, { userId: string; data: Partial<CreateUserRequest> }>({
      query: ({ userId, data }) => ({
        url: `${USER_URL}/${userId}`,
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
    }),
    deleteUser: builder.mutation<{ message: string }, string>({
      query: (userId) => ({
        url: `${USER_URL}/${userId}`,
        method: 'DELETE',
        credentials: 'include',
      }),
    }),
  }),
})

export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi

