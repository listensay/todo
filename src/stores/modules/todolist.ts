import { createSlice } from '@reduxjs/toolkit';

export const todoListSlice = createSlice({
  name: 'TodoList',
  initialState: {
    list: [
      {
        name: '学习React',
        status: 'todo',
        type: "primary",
        created: "2023-09-09 10:33"
      },
      {
        name: '学习Vue',
        status: 'done',
        type: "waring",
        created: "2023-09-09 10:33"
      },
      {
        name: '学习Angular',
        status: 'working',
        type: "danger",
        created: "2023-09-09 10:33"
      },
      {
        name: '学习Flutter',
        status: 'todo',
        type: "success",
        created: "2023-09-09 10:33"
      }
    ]
  },
  reducers: {
    addTodo: (state, action) => {
      // Redux Toolkit 允许我们在 reducers 中编写 mutating 逻辑。
      // 它实际上并没有 mutate state 因为它使用了 Immer 库，
      // 它检测到草稿 state 的变化并产生一个全新的基于这些更改的不可变 state
      console.log(state)
      console.log(action)
    },
  },
});

// 为每个 case reducer 函数生成 Action creators
export const { addTodo} = todoListSlice.actions;

export default todoListSlice.reducer;