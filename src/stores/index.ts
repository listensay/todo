import { configureStore } from '@reduxjs/toolkit';
import todoListSclice from './modules/todos';

const store = configureStore({
  reducer: {
    todos: todoListSclice
  }
});

export default store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
