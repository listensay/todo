import TodoItem, { TodoItemProps } from "./TodoItem"

export interface TodoListBoxProps {
  list: TodoItemProps[],
  name: string
}

function TodoListBox(props: TodoListBoxProps) {
  const { list, name } = props

  return (
    <div className="min-h-96">
    {/* <div className="mb-4 text-lg font-bold">{ name }</div> */}
      {
        list.map((item: TodoItemProps) => {
          return <TodoItem name={item.name} type={item.type} created={ item.created } key={item.name} />
        })
      }
    </div>
  )
}

export default TodoListBox