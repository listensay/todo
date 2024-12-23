import { TodoItemProps } from '@/components/TodoItem';
import { fetchAddTodo, fetchDeleteTodo, fetchGetTodos, fetchUpdateTodo } from '@/service';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getTodos = createAsyncThunk('todos/getTodos', async () => {
  const result = await fetchGetTodos()
  console.log(result)
  return result
})

export const addTodo = createAsyncThunk('todos/addTodo', async (todo: TodoItemProps) => {
  await fetchAddTodo(todo)
  return await fetchGetTodos()
})

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id: number) => {
  await fetchDeleteTodo(id)
  return await fetchGetTodos()
})

export const updateTodo = createAsyncThunk('todos/updateTodo', async (todo: TodoItemProps) => {
  await fetchUpdateTodo(todo)
  return await fetchGetTodos()
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
      .addCase(addTodo.fulfilled, (state, action) => {
        state.list = <any> action.payload
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.list = <any> action.payload
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.list = <any> action.payload
      })
  },
});

// 为每个 case reducer 函数生成 Action creators
export const {  } = todoListSlice.actions;

export default todoListSlice.reducer;