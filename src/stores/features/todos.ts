import { TypeTodoItemProps, TypeEnumStatus, DIFFICULTY_CONFIG } from '@/types/todo';
import { fetchAddTodo, fetchDeleteTodo, fetchGetTodos, fetchUpdateTodo } from '@/service';
import { fetchAddExp } from '@/service/player';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getTodos = createAsyncThunk('todos/getTodos', async () => {
  const result = await fetchGetTodos()
  console.log(result)
  return result
})

export const addTodo = createAsyncThunk('todos/addTodo', async (todo: TypeTodoItemProps) => {
  await fetchAddTodo(todo)
  return await fetchGetTodos()
})

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id: number) => {
  await fetchDeleteTodo(id)
  return await fetchGetTodos()
})

export const updateTodo = createAsyncThunk('todos/updateTodo', async (todo: TypeTodoItemProps) => {
  await fetchUpdateTodo(todo)

  // 如果任务完成，增加经验值
  if (todo.status === TypeEnumStatus.Complete) {
    const exp = DIFFICULTY_CONFIG[todo.difficulty]?.exp || 0
    await fetchAddExp(exp)
  }

  return await fetchGetTodos()
}) 

export const todoListSlice = createSlice({
  name: 'TodoList',
  initialState: {
    list: [] as TypeTodoItemProps[],
  },
  reducers: {
  },
  extraReducers(builder) {
    builder
      .addCase(getTodos.fulfilled, (state, { payload }) => {
        state.list = payload as TypeTodoItemProps[]
      })
      .addCase(addTodo.fulfilled, (state, { payload }) => {
        state.list = payload as TypeTodoItemProps[]
      })
      .addCase(deleteTodo.fulfilled, (state, { payload }) => {
        state.list = payload as TypeTodoItemProps[]
      })
      .addCase(updateTodo.fulfilled, (state, { payload }) => {
        state.list = payload as TypeTodoItemProps[]
      })
  },
});

// 为每个 case reducer 函数生成 Action creators
export default todoListSlice.reducer;