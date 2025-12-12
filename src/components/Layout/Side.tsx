import { memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPlayer, updatePlayer } from '@/stores/features/player'
import { Avatar, Progress, Badge, ActionIcon, Tooltip, Divider, Button } from '@mantine/core'
import { IconCamera } from '@tabler/icons-react'
import { getLevelProgress, getExpForNextLevel, getTitleForLevel } from '@/types/player'
import { notifications } from '@mantine/notifications'
import { CompletedTodosModal } from '../CompletedTodosModal'
import { useDisclosure } from '@mantine/hooks'

const LayoutSide = memo(() => {
  const dispatch = useDispatch()
  const player = useSelector((state: any) => state.player.player)
  const loading = useSelector((state: any) => state.player.loading)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [opened, { open, close }] = useDisclosure(false)

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
                <div>{player.nickname}</div>
                <Badge color="blue" variant="outline" size="sm" radius={0} className="border border-black text-black bg-blue-200 mb-2">Lv.{player.level}</Badge>
                <div className="mb-2 text-sm">{title}</div>
                 <div className="w-full">
                    <Progress value={progressPercentage} color="cyan" radius={0} size="sm" classNames={{ section: 'border-r-2 border-black', root: 'border-2 border-black bg-white' }} />
                    <div className="text-xs mt-2 text-right">{player.exp} / {expForNextLevel} EXP</div>
                </div>
            </div>
        </div>

        <Divider my="sm" color="black" />

        {/* Stats Grid */}
        <div className="flex justify-between gap-2 py-2">
            <div className="flex-1 bg-white p-2 border-2 border-black app-card-ns flex flex-col items-center justify-center">
                <div className="text-xl mb-1">✅</div>
                <div className="text-xs text-gray-500 mb-1">任务</div>
                <div className="font-bold text-lg">{player.total_tasks_completed}</div>
            </div>
            <div className="flex-1 bg-white p-2 border-2 border-black app-card-ns flex flex-col items-center justify-center">
                <div className="text-xl mb-1">🔥</div>
                <div className="text-xs text-gray-500 mb-1">连胜</div>
                <div className="font-bold text-lg">{player.streak_days}</div>
            </div>
            <div className="flex-1 bg-white p-2 border-2 border-black app-card-ns flex flex-col items-center justify-center">
                <div className="text-xl mb-1">💰</div>
                <div className="text-xs text-gray-500 mb-1">金币</div>
                <div className="font-bold text-lg text-orange-500">{player.coins}</div>
            </div>
        </div>
        
        <Divider my="sm" color="black" />
        
        <Button 
            fullWidth 
            color="dark" 
            variant="outline" 
            className="border-2 border-black text-black hover:bg-gray-100 transition-colors"
            radius={0}
            onClick={open}
        >
            已完成待办
        </Button>
      </div>

      <CompletedTodosModal opened={opened} onClose={close} />
    </div>
  );
})

LayoutSide.displayName = 'LayoutSide'

export default LayoutSide