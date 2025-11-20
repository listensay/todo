import Empty from "./Empty"
import TodoItem, { TodoItemProps } from "./TodoItem"

export interface TodoListBoxProps {
  list: TodoItemProps[],
}

function TodoListBox(props: TodoListBoxProps) {
  const { list } = props

  return (
    <div className="min-h-96">
      {
        list.length > 0 ? list.map((item: TodoItemProps) => {
          return <TodoItem { ...item } key={item.id} />
        }) : <div className="flex items-center justify-center text-center text-gray-600 h-96"><Empty /></div>
      }
    </div>
  )
}

export default TodoListBox