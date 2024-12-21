import { TodoItemProps } from "@/components/TodoItem"
import { invoke } from "@tauri-apps/api/core"

export const fetchGetTodos = async () => {
  try {
    const result = await invoke('get_todos')
    return result
  } catch (error) {
    console.log('获取数据失败')
  }
}

export const fetchAddTodo = async (todo: TodoItemProps) => {
  try {
    const result = await invoke('add_todo', { ...todo})
    return result
  } catch (error) {
    console.log('添加数据失败')
  }
}