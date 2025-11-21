export interface TypeTodoItemProps {
  id: number;
  name: string;
  status: TypeEnumStatus;
  difficulty: keyof TypeDifficulty;
  updated_at?: string;
  created_at?: string;
}

enum TypeEnumStatus {
  Incomplete = "Incomplete",
  Complete = "Complete",
  Pending = "Pending",
}

// 难度配置接口
export interface DifficultyConfig {
  label: string;
  exp: number;
  color: string;
}

// 难度配置常量
export const DIFFICULTY_CONFIG: Record<string, DifficultyConfig> = {
  Easy: {
    label: '简单',
    exp: 10,
    color: '#10b981', // green-500
  },
  Normal: {
    label: '普通',
    exp: 25,
    color: '#3b82f6', // blue-500
  },
  Hard: {
    label: '困难',
    exp: 50,
    color: '#f59e0b', // amber-500
  },
  Ipossible: {
    label: '最难',
    exp: 100,
    color: '#ef4444', // red-500
  },
} as const;

// 难度类型（从配置中推导）
export type DifficultyType = keyof typeof DIFFICULTY_CONFIG;

// 保留原有的接口以兼容
export interface TypeDifficulty {
  Easy: string;
  Normal: string;
  Hard: string;
  Ipossible: string;
}