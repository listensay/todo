import { createSlice } from "@reduxjs/toolkit";

export const tabControlSlice = createSlice({
  name: 'TabControl',
  initialState: {
    tabs: [
      { label: '计划 🤡', value: 'Pending' },
      { label: '进行 🥹', value: 'Incomplete' },
      { label: '完成 🎉', value: 'Complete' },
    ],
    currentTab: 'Incomplete',
  },
  reducers: {
    setTab(state, action) {
      state.currentTab = action.payload
    }
  }
})

export default tabControlSlice.reducer
export const { setTab } = tabControlSlice.actions