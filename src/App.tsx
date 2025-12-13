import { useState, useEffect } from "react";
import LayoutHeader from "./components/Layout/Header";
import LayoutMain from "./components/Layout/Main";
import LayoutSide from "./components/Layout/Side";
import PlayerInit from "./pages/PlayerInit";
import { fetchGetConfig } from "./service";
import { ConfigKey, configHelpers } from "./types/config";

function App() {
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  // 检查初始化状态
  const checkInitialization = async () => {
    try {
      const value = await fetchGetConfig(ConfigKey.PLAYER_INITIALIZED);
      if (value !== null) {
        const initialized = configHelpers.toBoolean(value);
        setIsInitialized(initialized);
        console.log('初始化状态:', initialized);
      }
    } catch (error) {
      console.error('检查初始化状态失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初次加载时检查
  useEffect(() => {
    checkInitialization();
  }, []);

  const handleInitComplete = () => {
    setIsInitialized(true);
  };

  // 加载中
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">加载中...</div>
      </div>
    );
  }

  // 未初始化，显示初始化页面
  if (!isInitialized) {
    return <PlayerInit onInitComplete={handleInitComplete} />;
  }

  // 已初始化，显示主应用
  return (
    <main className=" h-[100vh] p-4">
      <LayoutHeader />
      <div className="flex justify-between">
        <div className="ml-6 mr-2 w-72">
          <LayoutSide />
        </div>
        <div className="flex-1 p-4 mx-4 bg-white app-card">
          <LayoutMain />
        </div>
      </div>
    </main>
  );
}

export default App;
