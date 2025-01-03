import { Timeline, Text } from '@mantine/core';
import { useSelector } from 'react-redux';
import { TodoItemProps } from '../TodoItem';

function MainLayoutLeft() {
  const todos = useSelector((state: any) => state.todos.list)

  function getIcon(status: string) {
    switch (status) {
      case 'Incomplete':
        return '🥺'
      case 'Complete':
        return '✅'
      case 'Pending':
        return '🤡'
    }
  }

  return (
    <div className='p-4'>
      <div className='mb-4 text-lg font-bold'>动态</div>
      <div className='overflow-y-scroll h-[550px]'>
        <Timeline bulletSize={24} lineWidth={2} className='pr-2'>
          {
            todos.map((todo: TodoItemProps) => {
              return (
                <Timeline.Item 
                  bullet={
                    getIcon(todo.status)
                  }
                  title={todo.status}
                >
                  <Text className='my-2' size='sm'>{ todo.name }</Text>
                  <Text size='sm'>{ todo.updated_at }</Text>
                </Timeline.Item>
              )
            })
          }
        </Timeline>
      </div>
    </div>
  )
}

export default MainLayoutLeft