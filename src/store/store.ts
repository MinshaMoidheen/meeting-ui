import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './api'
import { clientApi } from './api/clientApi'
import { clientAttendeesApi } from './api/clientAttendeesApi'
import { scheduleApi } from './api/scheduleApi'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [clientApi.reducerPath]: clientApi.reducer,
    [clientAttendeesApi.reducerPath]: clientAttendeesApi.reducer,
    [scheduleApi.reducerPath]: scheduleApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware,
      clientApi.middleware,
      clientAttendeesApi.middleware,
      scheduleApi.middleware
    ),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


