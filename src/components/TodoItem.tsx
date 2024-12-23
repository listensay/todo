import { useAppDispatch } from "@/Hooks";
import { deleteTodo, updateTodo } from "@/stores/modules/todos";
import { ActionIcon, ColorSwatch, Menu, Tooltip } from "@mantine/core";
import { IconArchive, IconCircleDashedCheck, IconClockHour12, IconListDetails, IconMenu2, IconTrash } from "@tabler/icons-react";

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
  Pending = 'Pending',
  Archived = "Archived"
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
    Waring: "#f97316",
    Success: "#5eead4",
    Danger: "#dc2626",
  }

  const lables = [
    {
      label: 'Incomplete',
      id: 1,
      icon: <IconListDetails size={16} />
    },
    {
      label: 'Complete',
      id: 2,
      icon: <IconCircleDashedCheck size={16} />
    },
    {
      label: 'Pending',
      id: 3,
      icon: <IconClockHour12 size={16} />
    },
    {
      label: 'Archived',
      id: 4,
      icon: <IconArchive size={16} />
    },
    {
      label: 'Delete',
      id: 5,
      icon: <IconTrash size={16} />
    }
  ]

  const updateTemplate = (status: Status) => {
    dispatch(updateTodo({
      id,
      name,
      status,
      mark,
      description,
      created_at,
      updated_at: new Date().toISOString()
    }))
  }

  const tabClickHandle = (lable: string) => {
    switch(lable) {
      case 'Incomplete':
        updateTemplate(Status.Incomplete)
        break;
      case 'Complete':
        updateTemplate(Status.Complete)
        break;
      case 'Pending':
        updateTemplate(Status.Pending)
        break;
      case 'Archived':
        updateTemplate(Status.Archived)
        break;
      case 'Delete':
        dispatch(deleteTodo(id))
    }
  }

  return(
    <Tooltip position="top-start" label={ description }>
      <div className="p-4 mb-4 mr-2 bg-white border rounded-md last:mb-0">
        <div>
          <div className="flex items-center justify-between">
            <div>{ name }</div>
            <div>
              <ColorSwatch color={ colors[mark]  } />
            </div>
          </div>
          {/* 按钮 */}
          <div className="flex items-center justify-between mt-3">
            <div className="text-sm text-gray-400">{ updated_at }</div>
            <Menu transitionProps={{ transition: 'rotate-right', duration: 150 }}>
              {/* Menu content */}
              <Menu.Target>
                <ActionIcon variant="light" size="sm">
                  <IconMenu2 />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                {
                  lables.map((tab) => (
                    status !== tab.label && (
                      <div key={tab.id}>
                        { tab.label === 'Delete' && <Menu.Divider key={tab.id}  /> }
                        <Menu.Item 
                          leftSection={ tab.icon } 
                          color={ tab.label === 'Delete' ? 'red' : '' }
                          onClick = { () => tabClickHandle(tab.label) }
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
