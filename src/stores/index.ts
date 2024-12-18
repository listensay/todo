import { configureStore } from '@reduxjs/toolkit';
import todoListSclice from './modules/todolist';

export default configureStore({
  reducer: {
    todoList: todoListSclice
  },
});