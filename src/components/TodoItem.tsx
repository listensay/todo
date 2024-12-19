import { ActionIcon, ColorSwatch, Menu } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons-react";


export interface TodoItemProps {
  name: string;
  type: keyof Color;
  status?: string;
  created?: string;
}

export interface Color {
  primary: string;
  waring: string;
  success: string;
  danger: string;
}

function TodoItem(props: TodoItemProps) {
  const { name, type, created } = props

  const colors : Color = {
    primary: "#8b5cf6",
    waring: "#f97316",
    success: "#5eead4",
    danger: "#dc2626",
  }

  return(
    <div className="p-4 mb-4 bg-white border rounded-md">
      <div>
        <div className="flex items-center justify-between">
          <div>{ name }</div>
          <div>
            <ColorSwatch color={ colors[type]  } />
          </div>
        </div>
        {/* 按钮 */}
        <div className="flex items-center justify-between mt-3">
          <div className="text-sm text-gray-400">{ created }</div>
          <Menu transitionProps={{ transition: 'rotate-right', duration: 150 }}>
            {/* Menu content */}
            <Menu.Target>
              <ActionIcon variant="light" size="sm">
                <IconMenu2 />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>
                Settings
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
    </div>
  )
}

export default TodoItem
