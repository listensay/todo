import React, { useState } from "react";

function App() {
  const [inputValue, setInputValue] = useState("")

  const onKeyUpHandle = (e: React.KeyboardEvent) => {
    if(e.key === 'Enter') {
      console.log(inputValue)
    }
  }

  return (
    <main className="container">
      <h1 className='my-6 text-3xl font-bold text-center text-indigo-950'>TODO LIST</h1>
      <input type="text" value={inputValue} onChange={ e => setInputValue(e.target.value) } onKeyUp={ e => onKeyUpHandle(e) } />
    </main>
  );
}

export default App;
