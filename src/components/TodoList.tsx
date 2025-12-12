import { useSelector } from "react-redux";
import { useMemo, memo } from "react";
import TodoListBox from "./TodoListBox";
import { TypeEnumStatus, TypeTodoItemProps } from "@/types/todo";

function TodoList() {
  // 只选择 list，而不是整个 todos 对象
  const list = useSelector((state: any) => state.todos.list);

  // 使用 useMemo 缓存过滤结果
  const filteredList = useMemo(() => {
    console.log("list", list);
    return list.filter((item: TypeTodoItemProps) => item.status === TypeEnumStatus.Incomplete);
  }, [list]);

  return (
    <>
      <div className="w-full overflow-y-scroll h-[565px]">
        <TodoListBox list={filteredList} />
      </div>
    </>
  );
}

export default memo(TodoList);
