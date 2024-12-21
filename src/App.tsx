import { Button, ColorSwatch, Group, Modal, Select, SelectProps, Textarea, TextInput } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { useEffect } from "react";
import TodoList from "./components/TodoList";
import { getTodos, addTodo } from "./stores/modules/todos";
import { useAppDispatch } from "./Hooks";
import { useForm } from "@mantine/form";


function App() {
  const [modalState, { open, close }] = useDisclosure(false)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getTodos())
  }, [dispatch])

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      description: '',
      mark: ''
    },
    validate: {
      name: (value) => value.length < 2 ? 'Name must have at least 2 letters' : null,
      description: (value) => value.length < 2 ? 'Description must have at least 2 letters' : null,
      mark: (value) => value.length < 2 ? 'Mark must have at least 2 letters' : null,
    }
  })

  const submit = (values : any) => {
    dispatch(addTodo(values))
    dispatch(getTodos())
    form.reset()
    close()
  }

  const onModalClose =() => {
    form.reset()
    close()
  }

  const icons: Record<string, React.ReactNode> = {
    Primary: <ColorSwatch color="#8b5cf6" />,
    Waring: <ColorSwatch color="#f97316" />,
    Success: <ColorSwatch color="#5eead4" />,
    Danger: <ColorSwatch color="#dc2626" />,
  };

  const renderSelectOption: SelectProps['renderOption'] = ({ option, checked }) => (
    <Group flex="1" gap="xs">
      {icons[option.value]}
      {option.label}
      {checked && <span>✅</span>}
    </Group>
  );

  return (
    <main className="flex flex-col justify-center h-[100vh]">
      <h1 className='my-6 text-3xl font-bold text-center text-indigo-950'>TODO LIST</h1>
      {/* 搜索框 */}
      <Button onClick={ open } className="mx-auto" color="red">Add Todo</Button>
      {/* TODO列表 */}
      <TodoList />
      {/* 添加框 */}
      <Modal 
        opened={modalState}
        onClose={ onModalClose }
        title="Add Todo"
        centered
        fullScreen
        radius={0}
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        <form onSubmit={form.onSubmit((values) => submit(values))}>
          <TextInput 
            className="mb-4"
            label="Todo name"
            placeholder="Type todo name..."
            { ...form.getInputProps('name') }
            withAsterisk 
          />
          <Textarea 
            className="mb-4"
            label="Todo description"
            placeholder="Type todo description..."
            { ...form.getInputProps('description') }
            withAsterisk
          />
          <Select
            label="Select with mark"
            placeholder="Select mark"
            className="mb-4"
            data={[
              { value: 'Primary', label: 'Primary' },
              { value: 'Waring', label: 'Waring' },
              { value: 'Success', label: 'Success' },
              { value: 'Danger', label: 'Danger' },
            ]}
            renderOption={renderSelectOption}
            { ...form.getInputProps('mark') }
            withAsterisk
          />
          <Button type="submit" color="teal">Submit</Button>
        </form>
      </Modal>
    </main>
  );
}

export default App;
