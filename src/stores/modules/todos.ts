import { TodoItemProps } from '@/components/TodoItem';
import { fetchAddTodo, fetchGetTodos } from '@/service';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getTodos = createAsyncThunk('todos/getTodos', async () => {
  const result = await fetchGetTodos()
  console.log(result, 12312312)
  return result
})

export const addTodo = createAsyncThunk('todos/addTodo', async (todo: TodoItemProps) => {
  await fetchAddTodo(todo)
})

export const todoListSlice = createSlice({
  name: 'TodoList',
  initialState: {
    list: [] as TodoItemProps[],
  },
  reducers: {
  },
  extraReducers(builder) {
    builder
      .addCase(getTodos.fulfilled, (state, action) => {
        state.list = <any> action.payload
      })
  },
});

// 为每个 case reducer 函数生成 Action creators
export const {  } = todoListSlice.actions;

export default todoListSlice.reducer;