import { Modal, Text, ScrollArea } from '@mantine/core';
import { useSelector } from 'react-redux';
import { TypeTodoItemProps, TypeEnumStatus, DIFFICULTY_CONFIG } from '@/types/todo';
import { IconCheck } from '@tabler/icons-react';

interface CompletedTodosModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CompletedTodosModal({ opened, onClose }: CompletedTodosModalProps) {
  const todos = useSelector((state: any) => state.todos.list);
  
  const completedList = todos.filter(
    (item: TypeTodoItemProps) => item.status === TypeEnumStatus.Complete
  );

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title="已完成待办" 
      centered
      radius={0}
      classNames={{
        header: 'border-b-2 border-black font-bold',
        body: 'p-0',
        content: 'border-2 border-black rounded-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]'
      }}
    >
      <ScrollArea h={400} type="always" offsetScrollbars>
        <div className="p-4 space-y-3">
          {completedList.length > 0 ? (
            completedList.map((item: TypeTodoItemProps) => (
              <div 
                key={item.id} 
                className="p-3 border-2 border-black bg-gray-50 flex items-center justify-between transition-colors hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-5 h-5 flex items-center justify-center border-2 border-black bg-white"
                  >
                     <IconCheck size={14} color="black" stroke={3} />
                  </div>
                  <div>
                    <div className="font-bold line-through text-gray-500">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.updated_at}</div>
                  </div>
                </div>
                <div 
                    className="px-2 py-0.5 text-xs font-bold border border-black bg-white"
                    style={{ color: DIFFICULTY_CONFIG[item.difficulty].color, borderColor: DIFFICULTY_CONFIG[item.difficulty].color }}
                >
                    +{DIFFICULTY_CONFIG[item.difficulty].exp} EXP
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              暂无已完成待办
            </div>
          )}
        </div>
      </ScrollArea>
    </Modal>
  );
}
