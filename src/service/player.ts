import { Player } from "@/types/player";
import { invoke } from "@tauri-apps/api/core";
import { notifications } from "@mantine/notifications";

export const fetchGetPlayer = async (): Promise<Player | null> => {
  try {
    const result = await invoke<Player>('get_player');
    return result;
  } catch (error) {
    console.log('获取玩家信息失败', error);
    notifications.show({
      title: '获取玩家信息失败',
      message: `Error: ${error}`,
      color: 'red',
      autoClose: 3000,
      position: 'top-center'
    });
    return null;
  }
};

export const fetchUpdatePlayer = async (player: Player): Promise<boolean> => {
  try {
    await invoke('update_player', { player });
    notifications.show({
      title: '更新成功',
      message: '玩家信息已更新',
      color: 'green',
      autoClose: 2000,
      position: 'top-center'
    });
    return true;
  } catch (error) {
    console.log('更新玩家信息失败', error);
    notifications.show({
      title: '更新失败',
      message: `Error: ${error}`,
      color: 'red',
      autoClose: 3000,
      position: 'top-center'
    });
    return false;
  }
};

export const fetchAddExp = async (expAmount: number): Promise<Player | null> => {
  try {
    const result = await invoke<Player>('add_exp', { expAmount });

    // 检查是否升级（经验值小于获得的经验值说明已经升级并重置了）
    if (result.exp < expAmount) {
      notifications.show({
        title: '🎉 恭喜升级！',
        message: `等级提升至 ${result.level}！`,
        color: 'yellow',
        autoClose: 3000,
        position: 'top-center'
      });
    } else {
      notifications.show({
        title: '获得经验',
        message: `+${expAmount} EXP`,
        color: 'blue',
        autoClose: 2000,
        position: 'top-center'
      });
    }

    return result;
  } catch (error) {
    console.log('增加经验失败', error);
    return null;
  }
};
