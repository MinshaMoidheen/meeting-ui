import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '@/constants'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Party', 'CourseClass'],
  endpoints: () => ({}),
})

export type { BaseQueryFn } from '@reduxjs/toolkit/query'


