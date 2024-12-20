import { useSelector } from "react-redux"
import { TodoItemProps } from "./TodoItem"
import { SegmentedControl } from "@mantine/core"
import { useState } from "react"
import TodoListBox from "./TodoListBox"

function TodoList() {
  const { list } = useSelector((state: any) => state.todos)

  const [ tabValue, setTabValue ] = useState('Incomplete')
  const tabs = [
    { label: 'Todo 🥹', value: 'Incomplete' },
    { label: 'Complete 🎉', value: 'Complete' },
    { label: 'Pending 🤡', value: 'Pending' },
    { label: 'Archived 🥰', value: 'Archived' }
  ]

  return (
    <>
      <SegmentedControl 
        value={tabValue}
        data={ tabs }
        onChange={ setTabValue }
        className="mx-auto my-5 w-96"
      />
      <div className="mx-auto overflow-auto w-96 h-96">
        {
          tabs.map(tab => {
            return (
              tabValue === tab.value && <TodoListBox
                key={tab.value}
                list={list.filter((item: TodoItemProps) => item.status === tabValue)}
              />
            )
          })
        }
      </div>
    </>
  )
}

export default TodoList
