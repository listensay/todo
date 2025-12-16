import { memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPlayer, updatePlayer } from '@/stores/features/player'
import { Avatar, Progress, Badge, ActionIcon, Tooltip, Divider, Button } from '@mantine/core'
import { IconCamera } from '@tabler/icons-react'
import { getLevelProgress, getTitleForLevel } from "@/types/player";
import { notifications } from '@mantine/notifications'
import { CompletedTodosModal } from '../CompletedTodosModal'
import { StatsModal } from "../StatsModal";
import { ContributionCalendar } from "../ContributionCalendar";
import { useDisclosure } from "@mantine/hooks";
import { fetchGetDashboardStats } from "@/service/index";
import { DashboardStats } from "@/types/dashboard";

const LayoutSide = memo(() => {
  const dispatch = useDispatch();
  const player = useSelector((state: any) => state.player.player);
  const loading = useSelector((state: any) => state.player.loading);
  const todos = useSelector((state: any) => state.todos.list);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [statsOpened, { open: openStats, close: closeStats }] =
    useDisclosure(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );

  useEffect(() => {
    dispatch(getPlayer() as any);
  }, [dispatch, todos]);

  // 获取 Dashboard 统计数据，当 todos 变化时刷新
  useEffect(() => {
    const loadDashboardStats = async () => {
      const stats = await fetchGetDashboardStats();
      setDashboardStats(stats);
    };
    loadDashboardStats();
  }, [todos]);

  // 触发文件选择
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // 处理头像文件选择
  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      notifications.show({
        title: "文件格式错误",
        message: "请选择图片文件",
        color: "red",
        position: "top-center",
      });
      return;
    }

    // 验证文件大小（限制为 2MB）
    if (file.size > 2 * 1024 * 1024) {
      notifications.show({
        title: "文件过大",
        message: "图片大小不能超过 2MB",
        color: "red",
        position: "top-center",
      });
      return;
    }

    // 转换为 base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setUploading(true);
      try {
        if (player) {
          const updatedPlayer = { ...player, avatar: base64String };
          await dispatch(updatePlayer(updatedPlayer) as any);
          notifications.show({
            title: "头像已更新",
            message: "你的角色头像已成功更换",
            color: "green",
            position: "top-center",
          });
        }
      } catch (error) {
        console.error("更新头像失败:", error);
        notifications.show({
          title: "更新失败",
          message: "头像更新失败，请重试",
          color: "red",
          position: "top-center",
        });
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading || !player) {
    return <div className="p-4 text-center text-gray-500">加载中...</div>;
  }

  const progressPercentage = getLevelProgress(player.exp, player.level);
  const title = getTitleForLevel(player.level);

  return (
    <div className="flex flex-col h-full bg-white app-card">
      <div className="p-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-3 group">
            <Avatar
              src={player.avatar}
              alt={player.nickname}
              size={80}
              radius={0}
              className="transition-opacity border-2 border-black cursor-pointer group-hover:opacity-70"
              onClick={handleAvatarClick}
            />
            <Tooltip
              label="点击更换头像"
              position="top"
              withArrow={false}
              radius={0}
              className="text-black bg-white border-2 border-black"
            >
              <ActionIcon
                size="sm"
                radius={0}
                variant="filled"
                color="dark"
                className="absolute z-10 transition-opacity border-2 border-black opacity-0 -bottom-2 -right-2 group-hover:opacity-100"
                onClick={handleAvatarClick}
                loading={uploading}
              >
                <IconCamera size={14} />
              </ActionIcon>
            </Tooltip>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />

          <div className="w-full text-center">
            <div>{player.nickname}</div>
            <Badge
              color="blue"
              variant="outline"
              size="sm"
              radius={0}
              className="mb-2 text-black bg-blue-200 border border-black"
            >
              Lv.{player.level}
            </Badge>
            <div className="mb-2 text-sm">{title}</div>
            <div className="w-full">
              <Progress
                value={progressPercentage}
                color="cyan"
                radius={0}
                size="sm"
                classNames={{
                  section: "border-r-2 border-black",
                  root: "border-2 border-black bg-white",
                }}
              />
            </div>
          </div>
        </div>

        <Divider my="sm" color="black" />

        {/* Dashboard */}
        <div className="flex justify-between gap-2 py-2">
          <div className="flex flex-col items-center justify-center flex-1 p-2 bg-white border-2 border-black app-card-ns">
            <div className="mb-1 text-xl">✅</div>
            <div className="mb-1 text-xs text-gray-500">任务</div>
            <div className="text-lg font-bold">
              {dashboardStats?.total_tasks_completed ?? 0}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 p-2 bg-white border-2 border-black app-card-ns">
            <div className="mb-1 text-xl">🔥</div>
            <div className="mb-1 text-xs text-gray-500">连胜</div>
            <div className="text-lg font-bold">
              {dashboardStats?.streak_days ?? 0}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 p-2 bg-white border-2 border-black app-card-ns">
            <div className="mb-1 text-xl">💰</div>
            <div className="mb-1 text-xs text-gray-500">金币</div>
            <div className="text-lg font-bold text-orange-500">
              {dashboardStats?.coins ?? 0}
            </div>
          </div>
        </div>

        <Divider my="sm" color="black" />

        <div className="flex gap-2">
          <Button
            fullWidth
            color="dark"
            variant="outline"
            className="text-black transition-colors border-2 border-black hover:bg-gray-100"
            radius={0}
            onClick={openStats}
          >
            统计
          </Button>
          <Button
            fullWidth
            color="dark"
            variant="outline"
            className="text-black transition-colors border-2 border-black hover:bg-gray-100"
            radius={0}
            onClick={open}
          >
            完成
          </Button>
        </div>

        <Divider my="sm" color="black" />
      </div>

      <CompletedTodosModal opened={opened} onClose={close} />
      <StatsModal opened={statsOpened} onClose={closeStats} />
    </div>
  );
});

LayoutSide.displayName = 'LayoutSide'

export default LayoutSide