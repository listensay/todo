use chrono::Local;
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

use crate::AppState;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Config {
    pub id: u32,
    pub key: String,
    pub value: String,
    pub created_at: String,
    pub updated_at: String,
}

#[tauri::command]
pub async fn get_config(state: tauri::State<'_, AppState>, key: &str) -> Result<String, String> {
    let db = &state.db;

    let config: Config = sqlx::query_as::<_, Config>("SELECT * FROM config WHERE key = ?1")
        .bind(key)
        .fetch_one(db)
        .await
        .map_err(|e| format!("Failed to get config {}: {}", key, e))?;

    Ok(config.value)
}

#[tauri::command]
pub async fn update_config(
    state: tauri::State<'_, AppState>,
    key: &str,
    value: &str,
) -> Result<(), String> {
    let db = &state.db;

    let current_time = Local::now().format("%Y-%m-%d %H:%M:%S").to_string();

    sqlx::query("UPDATE config SET value = ?1, updated_at = ?2 WHERE key = ?3")
        .bind(value)
        .bind(current_time)
        .bind(key)
        .execute(db)
        .await
        .map_err(|e| format!("Failed to update config {}: {}", key, e))?;

    Ok(())
}
