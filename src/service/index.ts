import { TypeTodoItemProps } from "@/types/todo"
import { ConfigKey } from "@/types/config"
import { DashboardStats } from "@/types/dashboard"
import { CalendarData } from "@/types/calendar"
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
      difficulty: todo.difficulty
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

export const fetchGetConfig = async (key: ConfigKey | string) => {
  try {
    const result = await invoke<string>('get_config', { key })
    return result
  } catch (error) {
    console.log('获取配置失败', error)
    notifications.show({
      title: '获取配置失败',
      message: `Error: ${error}`,
      color: 'red',
      autoClose: 3000,
      position: 'top-center'
    })
    return null
  }
}

export const fetchUpdateConfig = async (key: ConfigKey | string, value: string) => {
  try {
    const result = await invoke('update_config', { key, value })
    return result
  } catch (error) {
    console.log('更新配置失败', error)
    notifications.show({
      title: '更新配置失败',
      message: `Error: ${error}`,
      color: 'red',
      autoClose: 3000,
      position: 'top-center'
    })
  }
}

export const fetchGetDashboardStats = async (): Promise<DashboardStats | null> => {
  try {
    const result = await invoke<DashboardStats>('get_dashboard_stats')
    return result
  } catch (error) {
    console.log('获取 Dashboard 统计失败', error)
    notifications.show({
      title: '获取统计数据失败',
      message: `Error: ${error}`,
      color: 'red',
      autoClose: 3000,
      position: 'top-center'
    })
    return null
  }
}

export const fetchGetCalendarData = async (): Promise<CalendarData | null> => {
  try {
    const result = await invoke<CalendarData>('get_calendar_data')
    return result
  } catch (error) {
    console.log('获取日历数据失败', error)
    return null
  }
}