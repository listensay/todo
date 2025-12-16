use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use std::collections::HashMap;

use crate::AppState;

#[derive(Debug, Serialize, Deserialize)]
pub struct CalendarData {
    pub data: HashMap<String, i64>,
}

#[derive(Debug, FromRow)]
struct DateCount {
    date: String,
    count: i64,
}

#[tauri::command]
pub async fn get_calendar_data(
    state: tauri::State<'_, AppState>,
) -> Result<CalendarData, String> {
    let db = &state.db;

    // 查询每天创建的任务数量（按 created_at 日期统计）
    let created_counts: Vec<DateCount> = sqlx::query_as(
        "SELECT DATE(created_at) as date, COUNT(*) as count FROM todos GROUP BY DATE(created_at)",
    )
    .fetch_all(db)
    .await
    .map_err(|e| format!("Failed to get created tasks count: {}", e))?;

    // 查询每天完成的任务数量（按 updated_at 日期统计 status = 'Complete' 的任务）
    let completed_counts: Vec<DateCount> = sqlx::query_as(
        "SELECT DATE(updated_at) as date, COUNT(*) as count FROM todos WHERE status = 'Complete' GROUP BY DATE(updated_at)",
    )
    .fetch_all(db)
    .await
    .map_err(|e| format!("Failed to get completed tasks count: {}", e))?;

    let mut data: HashMap<String, i64> = HashMap::new();

    // 添加创建的任务数量
    for item in created_counts {
        *data.entry(item.date).or_insert(0) += item.count;
    }

    // 添加完成的任务数量
    for item in completed_counts {
        *data.entry(item.date).or_insert(0) += item.count;
    }

    Ok(CalendarData { data })
}
