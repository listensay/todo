import TodoList from "@/components/TodoList";
import { Button, ColorSwatch, Group, Modal, SegmentedControl, Select, SelectProps, Textarea, TextInput } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { useEffect } from "react";
import { getTodos, addTodo } from "@/stores/features/todos";
import { useAppDispatch } from "@/Hooks/index";
import { useForm } from "@mantine/form";
import { useSelector } from "react-redux";
import { setTab } from "@/stores/features/tab_control";

function MainLayoutRight() {
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

  const { tabs, currentTab } = useSelector((state: any) => state.tabControl)
  const setTabValue = (tab: string) => {
    dispatch(setTab(tab))
  }
  
  return (
    <>
      {/* 搜索框 */}
      <div className="flex items-center justify-between mb-4">
        <SegmentedControl 
          value={currentTab}
          data={ tabs }
          onChange={ setTabValue }
          className="app-card-ns"
        />
        <Button onClick={ open } className="app-card-ns" color="red">添加待办</Button>
      </div>
      {/* TODO列表 */}
      <TodoList />
      {/* 添加框 */}
      <Modal 
        opened={modalState}
        onClose={ onModalClose }
        title="Add Todo"
        centered
        
        radius={0}
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        <form onSubmit={form.onSubmit((values) => submit(values))}>
          <TextInput 
            className="mb-4"
            label="待办名称"
            placeholder="Type todo name..."
            { ...form.getInputProps('name') }
            withAsterisk 
          />
          <Textarea 
            className="mb-4"
            label="待办描述"
            placeholder="Type todo description..."
            { ...form.getInputProps('description') }
            withAsterisk
          />
          <Select
            label="标记颜色"
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
    </>
  )
}

export default MainLayoutRight