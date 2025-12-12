import { memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPlayer, updatePlayer } from '@/stores/features/player'
import { Avatar, Group, Text, Progress, Badge, ActionIcon, Tooltip, Divider } from '@mantine/core'
import { IconCamera } from '@tabler/icons-react'
import { getLevelProgress, getExpForNextLevel, getTitleForLevel } from '@/types/player'
import { notifications } from '@mantine/notifications'

const LayoutSide = memo(() => {
  const dispatch = useDispatch()
  const player = useSelector((state: any) => state.player.player)
  const loading = useSelector((state: any) => state.player.loading)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    dispatch(getPlayer() as any)
  }, [dispatch])

  // 触发文件选择
  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  // 处理头像文件选择
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      notifications.show({ title: '文件格式错误', message: '请选择图片文件', color: 'red', position: 'top-center' })
      return
    }

    // 验证文件大小（限制为 2MB）
    if (file.size > 2 * 1024 * 1024) {
      notifications.show({ title: '文件过大', message: '图片大小不能超过 2MB', color: 'red', position: 'top-center' })
      return
    }

    // 转换为 base64
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64String = reader.result as string
      setUploading(true)
      try {
        if (player) {
          const updatedPlayer = { ...player, avatar: base64String }
          await dispatch(updatePlayer(updatedPlayer) as any)
          notifications.show({ title: '头像已更新', message: '你的角色头像已成功更换', color: 'green', position: 'top-center' })
        }
      } catch (error) {
        console.error('更新头像失败:', error)
        notifications.show({ title: '更新失败', message: '头像更新失败，请重试', color: 'red', position: 'top-center' })
      } finally {
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.readAsDataURL(file)
  }

  if (loading || !player) {
    return <div className="p-4 text-center text-gray-500">加载中...</div>
  }

  const progressPercentage = getLevelProgress(player.exp, player.level)
  const expForNextLevel = getExpForNextLevel(player.level)
  const title = getTitleForLevel(player.level)

  return (
    <div className="flex flex-col h-full bg-white app-card">
      <div className="p-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-6">
            <div className="relative group mb-3">
            <Avatar
                src={player.avatar}
                alt={player.nickname}
                size={80} 
                radius={0}
                className="transition-opacity cursor-pointer group-hover:opacity-70 border-2 border-black"
                onClick={handleAvatarClick}
            />
            <Tooltip label="点击更换头像" position="top" withArrow={false} radius={0} className="border-2 border-black text-black bg-white">
                <ActionIcon
                size="sm"
                radius={0}
                variant="filled"
                color="dark"
                className="absolute transition-opacity opacity-0 -bottom-2 -right-2 group-hover:opacity-100 z-10 border-2 border-black"
                onClick={handleAvatarClick}
                loading={uploading}
                >
                <IconCamera size={14} />
                </ActionIcon>
            </Tooltip>
            </div>
            
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />

            <div className="text-center w-full">
                <Group justify="center" gap="xs" mb={4}>
                    <Text fw={700} size="xl">{player.nickname}</Text>
                    <Badge color="blue" variant="filled" size="sm" radius={0} className="border border-black text-black bg-blue-200">Lv.{player.level}</Badge>
                </Group>
                <Text size="sm" c="dimmed" mb={8}>{title}</Text>
                
                 <div className="w-full">
                    <Progress value={progressPercentage} color="cyan" radius={0} size="sm" classNames={{ section: 'border-r-2 border-black', root: 'border-2 border-black bg-white' }} />
                    <Text size="xs" c="dimmed" mt={4} ta="right">
                        {player.exp} / {expForNextLevel} EXP
                    </Text>
                </div>
            </div>
        </div>

        <Divider my="sm" color="black" />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 py-2">
            <div className="bg-white p-3 border-2 border-black app-card-ns">
                <Text size="xs" c="dimmed" mb={2}>任务完成</Text>
                <Text fw={700} size="lg">{player.total_tasks_completed}</Text>
            </div>
            <div className="bg-white p-3 border-2 border-black app-card-ns">
                <Text size="xs" c="dimmed" mb={2}>连续天数</Text>
                <Text fw={700} size="lg">{player.streak_days}</Text>
            </div>
            <div className="bg-white p-3 border-2 border-black app-card-ns">
                <Text size="xs" c="dimmed" mb={2} color="orange">金币</Text>
                 <Group gap={4}>
                    <Text fw={700} size="lg" c="orange">{player.coins}</Text>
                 </Group>
            </div>
        </div>
      </div>
    </div>
  );
})

LayoutSide.displayName = 'LayoutSide'

export default LayoutSide