import { DIFFICULTY_CONFIG, TypeTodoItemProps, TypeEnumStatus } from "@/types/todo";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTodo } from "@/stores/features/todos";
import { IconCheck } from "@tabler/icons-react";

function TodoItem(props: TypeTodoItemProps) {
  const { name, updated_at, difficulty } = props;
  const dispatch = useDispatch();
  const [isExiting, setIsExiting] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleComplete = () => {
    if (isChecked || isExiting) return;
    setIsChecked(true);
    
    // 延迟开始消失动画，让用户先看到勾选状态
    setTimeout(() => {
        setIsExiting(true);
        
         // 等待动画完成后更新状态
        setTimeout(() => {
          dispatch(updateTodo({ ...props, status: TypeEnumStatus.Complete }) as any);
        }, 500); // 必须与 CSS duration 匹配
    }, 400); // 停留 400ms 显示勾选状态
  };

  return (
    <div 
      className={`
        transform transition-all duration-500 ease-in-out overflow-hidden
        ${isExiting ? 'max-h-0 opacity-0 mb-0 translate-x-10' : 'max-h-40 opacity-100 mb-4 last:mb-0 translate-x-0'}
      `}
    >
      <div 
        className="p-4 app-card-ns"
        style={{ backgroundColor: DIFFICULTY_CONFIG[difficulty].color }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className={`
                w-5 h-5 rounded border-2 border-white flex items-center justify-center cursor-pointer transition-colors duration-200
                ${isChecked ? 'bg-white' : 'bg-transparent'}
              `}
              onClick={handleComplete}
              style={{ pointerEvents: isExiting ? 'none' : 'auto' }}
            >
              {isChecked && (
                <IconCheck 
                  size={14} 
                  color={DIFFICULTY_CONFIG[difficulty].color} 
                  stroke={3} 
                />
              )}
            </div>
            <div className="font-bold text-white mix-blend-hard-light">{name}</div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pl-7">
          <div className="text-sm text-white/80">
            <span>{updated_at || '刚刚'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoItem;
