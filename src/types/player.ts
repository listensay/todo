export interface Player {
  id: number;
  nickname: string;
  avatar: string;
  level: number;
  exp: number;
  total_tasks_completed: number;
  streak_days: number;
  last_login_date?: string;
  coins: number;
  title: string;
  created_at: string;
  updated_at: string;
}

// 升级经验计算辅助函数
export const getExpForNextLevel = (level: number): number => {
  return level * 100;
};

// 计算等级进度百分比
export const getLevelProgress = (currentExp: number, level: number): number => {
  const expForNext = getExpForNextLevel(level);
  return Math.min((currentExp / expForNext) * 100, 100);
};

// 玩家称号配置
export const PLAYER_TITLES: Record<number, string> = {
  1: '新手冒险者',
  5: '初级勇者',
  10: '中级勇者',
  20: '高级勇者',
  30: '精英战士',
  50: '传奇英雄',
  100: '史诗大师',
};

// 获取当前等级对应的称号
export const getTitleForLevel = (level: number): string => {
  const levels = Object.keys(PLAYER_TITLES).map(Number).sort((a, b) => b - a);
  for (const lvl of levels) {
    if (level >= lvl) {
      return PLAYER_TITLES[lvl];
    }
  }
  return PLAYER_TITLES[1];
};
