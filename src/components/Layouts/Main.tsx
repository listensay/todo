import TodoList from "@/components/TodoList";
import { useEffect } from "react";
import { getTodos, addTodo } from "@/stores/features/todos";
import { useAppDispatch } from "@/Hooks/index";
import { useForm } from "@mantine/form";
import { Button, Group, Select, SelectProps, TextInput } from "@mantine/core";


function MainLayoutRight() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getTodos())
  }, [dispatch])

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      mark: ''
    },
    validate: {
      name: (value) => value.length < 2 ? 'Name must have at least 2 letters' : null,
      mark: (value) => value.length < 2 ? 'Mark must have at least 2 letters' : null,
    }
  })

  const submit = (values : any) => {
    dispatch(addTodo(values))
    form.reset()
  }

  const renderSelectOption: SelectProps['renderOption'] = ({ option, checked }) => (
    <Group flex="1" gap="xs">
      {option.label}
      {checked && <span>✅</span>}
    </Group>
  );
  
  return (
    <>
      {/* 搜索框 */}
      <div className="flex items-center justify-between mb-4">
        <form className="flex items-center justify-center" onSubmit={form.onSubmit((values) => submit(values))}>
          <TextInput 
            placeholder="输入新任务"
            className="mr-2 w-72"
            { ...form.getInputProps('name') }
            withAsterisk 
          />
          <Select
            placeholder="难度"
            className="w-40 mr-2"
            data={[
              { value: 'Easy', label: '简单 +10 EXP' },
              { value: 'Normal', label: '普通 +25 EXP' },
              { value: 'Hard', label: '困难 +50 EXP' },
              { value: 'Ipossible', label: '最难 +100 EXP' },
            ]}
            renderOption={renderSelectOption}
            { ...form.getInputProps('difficulty') }
            withAsterisk
          />
          <Button type="submit" className="app-card-ns" color="red">添加待办</Button>
        </form>
      </div>
      {/* TODO列表 */}
      <TodoList />
    </>
  )
}

export default MainLayoutRight