import { TypeTodoItemProps } from "@/types/todo"
import { invoke } from "@tauri-apps/api/core"
import { notifications } from "@mantine/notifications";

export const fetchGetTodos = async () => {
  try {
    const result = await invoke('get_todos')
    return result
  } catch (error) {
    console.log('获取数据失败', error)
    notifications.show({
      title: '获取待办失败',
      message: `Error: ${error}`,
      color: 'red',
      autoClose: 3000,
      position: 'top-center'
    })
    return []
  }
}

export const fetchAddTodo = async (todo: TypeTodoItemProps) => {
  try {
    const result = await invoke('add_todo', {
      name: todo.name,
      description: todo.description || '',
      difficulty: todo.difficulty
    })
    notifications.show({
      title: 'Add Todo',
      message: 'Add Todo Success',
      color: 'green',
      autoClose: 2000,
      position: 'top-center'
    })
    return result
  } catch (error) {
    console.log('添加数据失败', error)
    notifications.show({
      title: 'Add Todo Failed',
      message: `Error: ${error}`,
      color: 'red',
      autoClose: 3000,
      position: 'top-center'
    })
  }
}

export const fetchDeleteTodo = async (id: number) => {
  try {
    const result = await invoke('delete_todo', { id })
    notifications.show({
      title: 'Delete Todo',
      message: 'Delete Todo Success',
      color: 'green',
      autoClose: 2000,
      position: 'top-center'
    })
    return result
  } catch (error) {
    console.log('删除数据失败', error)
    notifications.show({
      title: '删除待办失败',
      message: `Error: ${error}`,
      color: 'red',
      autoClose: 3000,
      position: 'top-center'
    })
  }
}

export const fetchUpdateTodo = async (todo: TypeTodoItemProps) => {
  try {
    const result = await invoke('update_todo', { todo })
    notifications.show({
      title: 'Update Todo',
      message: 'Update Todo Success',
      color: 'green',
      autoClose: 2000,
      position: 'top-center'
    })
    return result
  } catch (error) {
    console.log('更新数据失败', error)
    notifications.show({
      title: '更新待办失败',
      message: `Error: ${error}`,
      color: 'red',
      autoClose: 3000,
      position: 'top-center'
    })
  }
}