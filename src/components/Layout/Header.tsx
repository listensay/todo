import { memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPlayer, updatePlayer } from '@/stores/features/player'
import { Avatar, Group, Stack, Text, Progress, Badge, ActionIcon, Tooltip } from '@mantine/core'
import { IconCamera } from '@tabler/icons-react'
import { getLevelProgress, getExpForNextLevel, getTitleForLevel } from '@/types/player'
import { notifications } from '@mantine/notifications'

const LayoutHeader = memo(() => {
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

    if (!file) {
      return
    }

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      notifications.show({
        title: '文件格式错误',
        message: '请选择图片文件',
        color: 'red',
        autoClose: 3000,
        position: 'top-center'
      })
      return
    }

    // 验证文件大小（限制为 2MB）
    if (file.size > 2 * 1024 * 1024) {
      notifications.show({
        title: '文件过大',
        message: '图片大小不能超过 2MB',
        color: 'red',
        autoClose: 3000,
        position: 'top-center'
      })
      return
    }

    // 转换为 base64
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64String = reader.result as string
      setUploading(true)
      try {
        // 更新玩家头像
        if (player) {
          const updatedPlayer = { ...player, avatar: base64String }
          await dispatch(updatePlayer(updatedPlayer) as any)
          notifications.show({
            title: '头像已更新',
            message: '你的角色头像已成功更换',
            color: 'green',
            autoClose: 2000,
            position: 'top-center'
          })
        }
      } catch (error) {
        console.error('更新头像失败:', error)
        notifications.show({
          title: '更新失败',
          message: '头像更新失败，请重试',
          color: 'red',
          autoClose: 3000,
          position: 'top-center'
        })
      } finally {
        setUploading(false)
        // 重置文件输入
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    }
    reader.readAsDataURL(file)
  }

  if (loading || !player) {
    return (
      <div className="text-gray-500">加载玩家信息中...</div>
    )
  }

  const progressPercentage = getLevelProgress(player.exp, player.level)
  const expForNextLevel = getExpForNextLevel(player.level)
  const title = getTitleForLevel(player.level)

  return (
    <div className="bg-white rounded-sm p-4 app-card mb-4">
      <Group justify="space-between" align="flex-start">
        <Group align="flex-start">
          <div className="relative group">
            <Avatar
              src={player.avatar}
              alt={player.nickname}
              size={64}
              radius="md"
              className="cursor-pointer transition-opacity group-hover:opacity-70"
              onClick={handleAvatarClick}
            />
            <Tooltip label="点击更换头像" position="top">
              <ActionIcon
                size="xs"
                radius="md"
                className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleAvatarClick}
                loading={uploading}
              >
                <IconCamera size={14} />
              </ActionIcon>
            </Tooltip>
          </div>

          {/* 隐藏的文件输入 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <Stack gap="xs" justify="flex-start">
            <Group gap="xs" align="center">
              <Text fw={600} size="lg">
                {player.nickname}
              </Text>
              <Badge color="blue" variant="light">
                Lv.{player.level}
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              {title}
            </Text>
            <div className="w-48">
              <Progress
                value={progressPercentage}
                color="cyan"
                radius="md"
                size="md"
              />
              <Text size="xs" c="dimmed" mt={4}>
                {player.exp} / {expForNextLevel} EXP
              </Text>
            </div>
          </Stack>
        </Group>

        <Group gap="lg">
          <Stack gap="xs" align="center">
            <Text size="sm" c="dimmed">
              任务完成
            </Text>
            <Text fw={600} size="lg">
              {player.total_tasks_completed}
            </Text>
          </Stack>
          <Stack gap="xs" align="center">
            <Text size="sm" c="dimmed">
              连续天数
            </Text>
            <Text fw={600} size="lg">
              {player.streak_days}
            </Text>
          </Stack>
          <Stack gap="xs" align="center">
            <Text size="sm" c="dimmed">
              金币
            </Text>
            <Text fw={600} size="lg" c="gold">
              {player.coins}
            </Text>
          </Stack>
        </Group>
      </Group>
    </div>
  )
})

LayoutHeader.displayName = 'LayoutHeader'

export default LayoutHeader