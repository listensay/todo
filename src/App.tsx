import { Button, Input, Modal } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect, useState } from "react";
import TodoList from "./components/TodoList";
import { getTodos } from "./stores/modules/todos";
import { useAppDispatch } from "./Hooks";


function App() {
  const [inputValue, setInputValue] = useState("")
  const [modalState, { open, close }] = useDisclosure(false)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getTodos())
  }, [dispatch])

  const onKeyUpHandle = (e: React.KeyboardEvent) => {
    if(e.key === 'Enter') {
      open()
    }
  }

  return (
    <main className="flex flex-col justify-center h-[100vh]">
      <h1 className='my-6 text-3xl font-bold text-center text-indigo-950'>TODO LIST</h1>
      {/* 搜索框 */}
      <Input.Wrapper className="mx-auto w-96">
        <Input placeholder="Type todo content..." value={inputValue} onChange={ e => setInputValue(e.target.value) } onKeyUp={ e => onKeyUpHandle(e) } />
      </Input.Wrapper>
      {/* TODO列表 */}
      <TodoList />
      {/* 添加框 */}
      <Modal opened={modalState} onClose={ close } title="Add Todo">
        <Input.Wrapper className="mb-4" label="待办名称">
          <Input placeholder="Type todo content..." value={inputValue} onChange={ e => setInputValue(e.target.value) } />
        </Input.Wrapper>
        <Input.Wrapper className="mb-4" label="描述">
          <Input placeholder="Type todo content..." value={inputValue} onChange={ e => setInputValue(e.target.value) } />
        </Input.Wrapper>
        <Input.Wrapper className="mb-4" label="颜色标记">
          <Input placeholder="Type todo content..." value={inputValue} onChange={ e => setInputValue(e.target.value) } />
        </Input.Wrapper>
        <Button>完成 ✅</Button>
      </Modal>
    </main>
  );
}

export default App;
