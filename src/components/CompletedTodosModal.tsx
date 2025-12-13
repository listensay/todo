import { Modal, ScrollArea } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import {
  TypeTodoItemProps,
  TypeEnumStatus,
  DIFFICULTY_CONFIG,
} from "@/types/todo";
import { IconCheck, IconTrash } from "@tabler/icons-react";
import { updateTodo, deleteTodo } from "@/stores/features/todos";

interface CompletedTodosModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CompletedTodosModal({
  opened,
  onClose,
}: CompletedTodosModalProps) {
  const dispatch = useDispatch();
  const todos = useSelector((state: any) => state.todos.list);

  const completedList = todos.filter(
    (item: TypeTodoItemProps) => item.status === TypeEnumStatus.Complete
  );

  const handleUncomplete = (e: React.MouseEvent, item: TypeTodoItemProps) => {
    e.stopPropagation();
    dispatch(updateTodo({ ...item, status: TypeEnumStatus.Incomplete }) as any);
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    dispatch(deleteTodo(id) as any);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="已完成"
      centered
      radius={0}
      classNames={{
        header: "border-b-2 border-black font-bold",
        body: "p-0",
        content:
          "border-2 border-black rounded-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
      }}
    >
      <ScrollArea h={400} type="always" offsetScrollbars>
        <div className="p-4 space-y-3">
          {completedList.length > 0 ? (
            completedList.map((item: TypeTodoItemProps) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 transition-colors border-2 border-black bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-5 h-5 bg-white border-2 border-black cursor-pointer hover:bg-gray-200"
                    onClick={(e) => handleUncomplete(e, item)}
                    title="点击取消完成"
                  >
                    <IconCheck size={14} color="black" stroke={3} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-500 line-through">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {item.updated_at}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="px-2 py-0.5 text-xs font-bold border border-black bg-white"
                    style={{
                      color: DIFFICULTY_CONFIG[item.difficulty].color,
                      borderColor: DIFFICULTY_CONFIG[item.difficulty].color,
                    }}
                  >
                    +{DIFFICULTY_CONFIG[item.difficulty].exp} EXP
                  </div>
                  <div
                    className="p-1 transition-colors border border-black rounded cursor-pointer hover:bg-red-100"
                    onClick={(e) => handleDelete(e, item.id)}
                    title="删除"
                  >
                    <IconTrash size={16} color="#ef4444" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-400">暂无已完成待办</div>
          )}
        </div>
      </ScrollArea>
    </Modal>
  );
}
