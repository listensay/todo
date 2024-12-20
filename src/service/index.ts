import { invoke } from "@tauri-apps/api/core"

export const fetchGetTodos = async () => {
  try {
    const result = await invoke('get_todos')
    return result
  } catch (error) {
    console.log('获取数据失败')
  }
}
