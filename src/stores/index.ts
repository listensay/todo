import { configureStore } from '@reduxjs/toolkit'
import todos from './features/todos'
import player from './features/player'

const store = configureStore({
  reducer: {
    todos,
    player,
  }
})

export default store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
