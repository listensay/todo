import { useSelector } from "react-redux"
import { TodoItemProps } from "./TodoItem"
import TodoListBox from "./TodoListBox"

function TodoList() {
  const { list } = useSelector((state: any) => state.todos)
  console.log('list', list)

  return (
    <>
      <div className="w-full overflow-y-scroll h-[565px]">
        {
          <TodoListBox
            list={list.filter((item: TodoItemProps) => item.status)}
          />
        }
      </div>
    </>
  )
}

export default TodoList
