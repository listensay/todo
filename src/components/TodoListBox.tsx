import { TypeTodoItemProps } from "@/types/todo";
import Empty from "./Empty";
import TodoItem from "./TodoItem";

interface TodoListBoxProps {
  list: TypeTodoItemProps[];
}
function TodoListBox(props: TodoListBoxProps) {
  const { list } = props;

  return (
    <div className="min-h-96">
      {list.length > 0 ? (
        list.map((item: TypeTodoItemProps) => {
          return <TodoItem {...item} key={item.id} />;
        })
      ) : (
        <div className="flex items-center justify-center text-center text-gray-600 h-96">
          <Empty />
        </div>
      )}
    </div>
  );
}

export default TodoListBox;
