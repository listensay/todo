import { configureStore } from '@reduxjs/toolkit'
import todos from './features/todos'
import { tabControlSlice } from './features/tab_control'

const store = configureStore({
  reducer: {
    todos,
    tabControl: tabControlSlice.reducer
  }
})

export default store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
