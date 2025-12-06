import { useState, useRef } from 'react';
import { TextInput, Avatar, Button } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { fetchUpdateConfig } from '@/service';
import { fetchCreatePlayer } from '@/service/player';
import { ConfigKey } from '@/types/config';
import { notifications } from '@mantine/notifications';

interface PlayerInitProps {
  onInitComplete: () => void;
}

function PlayerInit({ onInitComplete }: PlayerInitProps) {
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState('');
  const [avatarBase64, setAvatarBase64] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 触发文件选择
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // 处理头像文件选择
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setAvatarBase64('');
      return;
    }

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      notifications.show({
        title: '文件格式错误',
        message: '请选择图片文件',
        color: 'red',
        autoClose: 3000,
        position: 'top-center'
      });
      return;
    }

    // 验证文件大小（限制为 2MB）
    if (file.size > 2 * 1024 * 1024) {
      notifications.show({
        title: '文件过大',
        message: '图片大小不能超过 2MB',
        color: 'red',
        autoClose: 3000,
        position: 'top-center'
      });
      return;
    }

    // 转换为 base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAvatarBase64(base64String);
    };
    reader.readAsDataURL(file);
  };

  // 验证表单
  const validateForm = (): boolean => {
    if (!nickname.trim()) {
      notifications.show({
        title: '请输入昵称',
        message: '昵称不能为空',
        color: 'orange',
        autoClose: 3000,
        position: 'top-center'
      });
      return false;
    }

    if (nickname.trim().length < 2 || nickname.trim().length > 12) {
      notifications.show({
        title: '昵称长度错误',
        message: '昵称长度应在 2-12 个字符之间',
        color: 'orange',
        autoClose: 3000,
        position: 'top-center'
      });
      return false;
    }

    return true;
  };

  const handleInit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // 创建新玩家
      const player = await fetchCreatePlayer(
        nickname.trim(),
        avatarBase64 || 'default'
      );

      if (!player) {
        throw new Error('创建角色失败');
      }

      // 初始化完成后，更新配置
      await fetchUpdateConfig(ConfigKey.PLAYER_INITIALIZED, '1');

      notifications.show({
        title: '欢迎加入！',
        message: `${nickname}，开始你的冒险之旅吧！`,
        color: 'green',
        autoClose: 3000,
        position: 'top-center'
      });

      // 通知父组件初始化完成
      onInitComplete();
    } catch (error) {
      console.error('初始化失败:', error);
      notifications.show({
        title: '初始化失败',
        message: `${error}`,
        color: 'red',
        autoClose: 3000,
        position: 'top-center'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-yellow-50 to-yellow-100">
      <div className="w-full max-w-md p-8 bg-white app-card">
        <div className="space-y-6">
          {/* 头像预览和上传 */}
          <div className="flex flex-col items-center">
            <div
              className="relative cursor-pointer group"
              onClick={handleAvatarClick}
            >
              <Avatar
                src={avatarBase64 || null}
                size={120}
                radius=""
                className="transition-transform"
              >
                <IconUser size={60} />
              </Avatar>

   
            </div>

            {/* 隐藏的文件输入 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* 昵称输入 */}
          <TextInput
            label="角色昵称"
            placeholder="请输入角色昵称"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            maxLength={12}
            description="2-12 个字符"
            leftSection={<IconUser size={16} />}
          />

          {/* 开始按钮 */}
          <Button
            onClick={handleInit}
            disabled={loading || !nickname.trim()}
            className="w-full app-card"
            size='md'
          >
            {loading ? '初始化中...' : '开始冒险'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PlayerInit;
