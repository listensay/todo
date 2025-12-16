use chrono::Local;
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

use crate::AppState;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Player {
    pub id: u8,
    pub nickname: String,
    pub avatar: String,
    pub level: u16,
    pub exp: u32,
    pub last_login_date: Option<String>,
    pub coins: u32,
    pub title: String,
    pub created_at: String,
    pub updated_at: String,
}

#[tauri::command]
pub async fn get_player(state: tauri::State<'_, AppState>) -> Result<Player, String> {
    let db = &state.db;

    let player: Player = sqlx::query_as::<_, Player>("SELECT * FROM player WHERE id = 1")
        .fetch_one(db)
        .await
        .map_err(|e| format!("Failed to get player: {}", e))?;

    Ok(player)
}

#[tauri::command]
pub async fn create_player(
    state: tauri::State<'_, AppState>,
    nickname: &str,
    avatar: &str,
) -> Result<Player, String> {
    let db = &state.db;

    let current_time = Local::now().format("%Y-%m-%d %H:%M:%S").to_string();

    sqlx::query(
        "INSERT INTO player (id, nickname, avatar, level, exp, coins, title, created_at, updated_at) VALUES (1, ?1, ?2, 1, 0, 0, '新手冒险者', ?3, ?4)",
    )
    .bind(nickname)
    .bind(avatar)
    .bind(&current_time)
    .bind(&current_time)
    .execute(db)
    .await
    .map_err(|e| format!("Failed to create player: {}", e))?;

    let player: Player = sqlx::query_as::<_, Player>("SELECT * FROM player WHERE id = 1")
        .fetch_one(db)
        .await
        .map_err(|e| format!("Failed to get created player: {}", e))?;

    Ok(player)
}

#[tauri::command]
pub async fn update_player(
    state: tauri::State<'_, AppState>,
    player: Player,
) -> Result<(), String> {
    let db = &state.db;

    let current_time = Local::now().format("%Y-%m-%d %H:%M:%S").to_string();

    sqlx::query(
        "UPDATE player SET nickname = ?1, avatar = ?2, level = ?3, exp = ?4, last_login_date = ?5, coins = ?6, title = ?7, updated_at = ?8 WHERE id = 1",
    )
    .bind(player.nickname)
    .bind(player.avatar)
    .bind(player.level)
    .bind(player.exp)
    .bind(player.last_login_date)
    .bind(player.coins)
    .bind(player.title)
    .bind(current_time)
    .execute(db)
    .await
    .map_err(|e| format!("Failed to update player: {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn add_exp(state: tauri::State<'_, AppState>, exp_amount: u32) -> Result<Player, String> {
    let db = &state.db;

    let mut player: Player = sqlx::query_as::<_, Player>("SELECT * FROM player WHERE id = 1")
        .fetch_one(db)
        .await
        .map_err(|e| format!("Failed to get player: {}", e))?;

    // 增加经验值
    player.exp += exp_amount;

    // 计算升级 (简单升级公式：每级需要 level * 100 经验)
    let exp_for_next_level = (player.level as u32) * 100;
    if player.exp >= exp_for_next_level {
        player.level += 1;
        player.exp -= exp_for_next_level;
    }

    // 更新数据库
    let current_time = Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
    sqlx::query("UPDATE player SET level = ?1, exp = ?2, updated_at = ?3 WHERE id = 1")
        .bind(player.level)
        .bind(player.exp)
        .bind(current_time)
        .execute(db)
        .await
        .map_err(|e| format!("Failed to update player exp: {}", e))?;

    Ok(player)
}
