import { TypeTodoItemProps } from "@/types/todo";

// Re-export for convenience
export type { TypeTodoItemProps as TodoItemProps };

function TodoItem(props: TypeTodoItemProps) {
  const { name, created_at, updated_at } = props;

  // 时间简化
  const getPastTime = (time: any) => {
    const date = new Date(time);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (24 * 3600 * 1000));
    const hours = Math.floor(diff / (3600 * 1000));
    const minutes = Math.floor(diff / (60 * 1000));
    const seconds = Math.floor(diff / 1000);
    if (days > 0) {
      return `${days} 天`;
    } else if (hours > 0) {
      return `${hours} 小时`;
    } else if (minutes > 0) {
      return `${minutes} 分钟`;
    } else {
      return `${seconds} 秒`;
    }
  };

  return (
    <div className="p-4 mb-4 last:mb-0 app-card-ns">
      <div className="flex items-center justify-between">
        <div className="font-bold">{name}</div>
        <span className="ml-2 font-bold">
          创建于
          <span className="mx-2 text-red-500">
            {getPastTime(created_at)}
          </span>{" "}
          前
        </span>
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
