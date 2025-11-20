import { useSelector } from "react-redux";
import TodoListBox from "./TodoListBox";
import { TypeTodoItemProps } from "@/types/todo";

function TodoList() {
  const { list } = useSelector((state: any) => state.todos);
  console.log("list", list);

  return (
    <>
      <div className="w-full overflow-y-scroll h-[565px]">
        {
          <TodoListBox
            list={list.filter((item: TypeTodoItemProps) => item.status)}
          />
        }
      </div>
    </>
  );
}

export default TodoList;
