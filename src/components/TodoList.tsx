import { useSelector } from "react-redux"
import { TodoItemProps } from "./TodoItem"
import TodoListBox from "./TodoListBox"

function TodoList() {
  const { list } = useSelector((state: any) => state.todos)
  const {tabs, currentTab} = useSelector((state: any) => state.tabControl)

  return (
    <>
      <div className="w-full overflow-y-scroll h-[565px]">
        {
          tabs.map((tab: any) => {
            return (
              currentTab === tab.value && <TodoListBox
                key={tab.value}
                list={list.filter((item: TodoItemProps) => item.status === currentTab)}
              />
            )
          })
        }
      </div>
    </>
  )
}

export default TodoList
