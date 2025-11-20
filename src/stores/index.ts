import { configureStore } from '@reduxjs/toolkit'
import todos from './features/todos'

const store = configureStore({
  reducer: {
    todos,
  }
})

export default store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
