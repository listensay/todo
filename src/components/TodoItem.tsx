import { useAppDispatch } from "@/Hooks";
import { deleteTodo, updateTodo } from "@/stores/features/todos";
import { ActionIcon, ColorSwatch, Menu, Tooltip } from "@mantine/core";
import { IconCircleDashedCheck, IconClockHour12, IconListDetails, IconMenu2, IconTrash } from "@tabler/icons-react";

export interface TodoItemProps {
  id: number;
  name: string;
  status: Status;
  mark: keyof Color;
  description: string;
  updated_at?: string;
  created_at?: string;
}

enum Status {
  Incomplete = 'Incomplete',
  Complete = 'Complete',
  Pending = 'Pending'
}

export interface Color {
  Primary: string;
  Waring: string;
  Success: string;
  Danger: string;
}

function TodoItem(props: TodoItemProps) {
  const { name, mark, status, id, description, created_at, updated_at } = props
  const dispatch = useAppDispatch()

  const colors : Color = {
    Primary: "#8b5cf6",
    Waring: "#fdba74",
    Success: "#5eead4",
    Danger: "#fda4af",
  }

  const lables = [
    {
      label: '等待待办',
      value: 'Incomplete',
      id: 1,
      icon: <IconListDetails size={16} />
    },
    {
      label: '完成待办',
      value: 'Complete',
      id: 2,
      icon: <IconCircleDashedCheck size={16} />
    },
    {
      label: '计划待办',
      value: 'Pending',
      id: 3,
      icon: <IconClockHour12 size={16} />
    },
    {
      label: '删除待办',
      value: 'Delete',
      id: 5,
      icon: <IconTrash size={16} />
    }
  ]

  const updateTemplate = (todo: any) => {

    const newObj = {
      id,
      name,
      status,
      mark,
      description,
      created_at,
      updated_at: new Date().toISOString(),
      ...todo
    }

    dispatch(updateTodo({ ...newObj }))
  }

  const tabClickHandle = (value: string) => {
    switch(value) {
      case 'Incomplete':
        updateTemplate({ status: Status.Incomplete })
        break;
      case 'Complete':
        updateTemplate({ status: Status.Complete })
        break;
      case 'Pending':
        updateTemplate({ status: Status.Pending })
        break;
      case 'Delete':
        dispatch(deleteTodo(id))
    }
  }

  const colorLable = [
    {
      color: '#8b5cf6',
      name: '紫色',
      value: 'Primary'
    },
    {
      color: '#fdba74',
      name: '橙色',
      value: 'Waring'
    },
    {
      color: '#5eead4',
      name: '绿色',
      value: 'Success'
    },
    {
      color: '#fda4af',
      name: '粉色',
      value: 'Danger'
    }
  ]

  const getPastTime = (time: string) => {
    const date = new Date(time)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (24 * 3600 * 1000))
    const hours = Math.floor(diff / (3600 * 1000))
    const minutes = Math.floor(diff / (60 * 1000))
    const seconds = Math.floor(diff / 1000)
    if (days > 0) {
      return `${days} 天`
    } else if (hours > 0) {
      return `${hours} 小时`
    } else if (minutes > 0) {
      return `${minutes} 分钟`
    } else {
      return `${seconds} 秒`
    }
  }

  return(
    <Tooltip position="bottom-start" label={ description }>
      <div className="p-4 mb-4 text-white last:mb-0 app-card-ns" style={{ backgroundColor: colors[mark] }}>
        <div>
          <div className="flex items-center justify-between">
            {
              status === Status.Complete ? (
                <div className="font-bold line-through ">{ name }</div>
              ) : (
                <div className="font-bold">{ name }</div>
              )
            }
          </div>
          {/* 按钮 */}
          <div className="flex items-center justify-between mt-3">
            <div className="text-sm">
              <span>{ updated_at }</span>
              <span className="ml-2">距离创建时间已过去: { getPastTime(updated_at as string) }</span>
            </div>
            <Menu transitionProps={{ transition: 'rotate-right', duration: 150 }}>
              {/* Menu content */}
              <Menu.Target>
                <ActionIcon
                  size="sm"
                  variant="white"
                  color="cyan"
                >
                  <IconMenu2 />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>标签颜色</Menu.Label>
                {
                  colorLable.map((color) => (
                    <Menu.Item 
                      key={color.name}
                      leftSection={ <ColorSwatch color={ color.color } size={15} /> }
                      onClick = { () => updateTemplate({ mark: color.value }) }
                    >
                      { color.name }
                    </Menu.Item>
                  ))
                }
                <Menu.Label>更新</Menu.Label>
                {
                  lables.map((tab) => (
                    status !== tab.value && (
                      <div key={tab.id}>
                        { tab.value === 'Delete' && <Menu.Divider key={tab.id}  /> }
                        <Menu.Item 
                          leftSection={ tab.icon } 
                          color={ tab.value === 'Delete' ? 'red' : '' }
                          onClick = { () => tabClickHandle(tab.value) }
                        >
                          { tab.label }
                        </Menu.Item>
                      </div>
                    )
                  ))
                }

              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
      </div>
    </Tooltip>
  )
}

export default TodoItem
