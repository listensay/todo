import { useSelector } from "react-redux"
import TodoItem, { TodoItemProps } from "./TodoItem"
import { SegmentedControl } from "@mantine/core"
import { useState } from "react"
import TodoListBox from "./TodoListBox"

function TodoList() {
  const { list } = useSelector((state: any) => state.todoList)
  const [ tabValue, setTabValue ] = useState('todo')

  return (
    <>
      <SegmentedControl 
        value={tabValue}
        data={[
          { label: 'Todo', value: 'todo' },
          { label: 'Working', value: 'working' },
          { label: 'Done', value: 'done' },
        ]}
        onChange={ setTabValue }
        className="mx-auto my-5 w-96"
      />
      <div className="mx-auto w-96">
        {
          tabValue === 'todo' && (
            <TodoListBox 
              list={list.filter((item: TodoItemProps) => item.status === 'todo')}
              name="Todo 😭"
            />
          )
        }
        {
          tabValue === 'working' && (
            <TodoListBox 
              list={list.filter((item: TodoItemProps) => item.status === 'working')}
              name="Working 🤔"
            />
          )
        }
        {
          tabValue === 'done' && (
            <TodoListBox 
              list={list.filter((item: TodoItemProps) => item.status === 'done')}
              name="Done 😎"
            />
          )
        }
      </div>
    </>
  )
}

export default TodoList
