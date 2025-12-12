use futures::TryStreamExt;
use serde::{Deserialize, Serialize};

use super::player::Player;
use crate::AppState;

#[derive(Debug, Serialize, Deserialize)]
pub struct DashboardStats {
    pub total_tasks_completed: u32,
    pub streak_days: u16,
    pub coins: u32,
}

#[tauri::command]
pub async fn get_dashboard_stats(
    state: tauri::State<'_, AppState>,
) -> Result<DashboardStats, String> {
    let db = &state.db;

    let player: Player = sqlx::query_as::<_, Player>("SELECT * FROM player WHERE id = 1")
        .fetch(db)
        .try_next()
        .await
        .map_err(|e| format!("Failed to get dashboard stats: {}", e))?
        .ok_or("Player not found")?;

    Ok(DashboardStats {
        total_tasks_completed: player.total_tasks_completed,
        streak_days: player.streak_days,
        coins: player.coins,
    })
}
