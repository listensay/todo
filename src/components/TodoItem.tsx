import { DIFFICULTY_CONFIG, TypeTodoItemProps } from "@/types/todo";

function TodoItem(props: TypeTodoItemProps) {
  const { name, updated_at, difficulty } = props;

  return (
    <div
      className={`p-4 mb-4 last:mb-0 app-card-ns`}
      style={{ backgroundColor: DIFFICULTY_CONFIG[difficulty].color }}
    >
      <div className="flex items-center justify-between">
        <div className="font-bold">{name}</div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="text-sm">
          <span>{updated_at}</span>
        </div>
      </div>
    </div>
  );
}

export default TodoItem;
