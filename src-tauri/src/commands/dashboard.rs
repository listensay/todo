use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

use super::player::Player;
use crate::AppState;

#[derive(Debug, Serialize, Deserialize)]
pub struct DashboardStats {
    pub total_tasks_completed: i64,
    pub streak_days: u16,
    pub coins: u32,
}

#[derive(Debug, FromRow)]
struct CountResult {
    count: i64,
}

#[tauri::command]
pub async fn get_dashboard_stats(
    state: tauri::State<'_, AppState>,
) -> Result<DashboardStats, String> {
    let db = &state.db;

    // 从 todos 表查询已完成任务数量
    let count_result: CountResult =
        sqlx::query_as("SELECT COUNT(*) as count FROM todos WHERE status = 'Complete'")
            .fetch_one(db)
            .await
            .map_err(|e| format!("Failed to get completed tasks count: {}", e))?;

    // 从 player 表获取其他统计数据
    let player: Player = sqlx::query_as::<_, Player>("SELECT * FROM player WHERE id = 1")
        .fetch_one(db)
        .await
        .map_err(|e| format!("Failed to get player stats: {}", e))?;

    Ok(DashboardStats {
        total_tasks_completed: count_result.count,
        streak_days: player.streak_days,
        coins: player.coins,
    })
}
