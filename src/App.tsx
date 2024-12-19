import { Input } from "@mantine/core";
import React, { useState } from "react";
import TodoList from "./components/TodoList";

function App() {
  const [inputValue, setInputValue] = useState("")

  const onKeyUpHandle = (e: React.KeyboardEvent) => {
    if(e.key === 'Enter') {
      console.log(inputValue)
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
    </main>
  );
}

export default App;
