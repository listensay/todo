import { fetchGetTodos } from '@/service';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getTodos = createAsyncThunk('todos/getTodos', async () => {
  return await fetchGetTodos()
})

export const todoListSlice = createSlice({
  name: 'TodoList',
  initialState: {
    list: []
  },
  reducers: {
    addTodo() {

    }
  },
  extraReducers(builder) {
    builder
      .addCase(getTodos.fulfilled, (state, action) => {
        state.list = <any> action.payload
      })
  },
});

// 为每个 case reducer 函数生成 Action creators
export const { addTodo } = todoListSlice.actions;

export default todoListSlice.reducer;