use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

use crate::AppState;

#[derive(Debug, Serialize, Deserialize)]
pub struct DashboardStats {
    pub total_tasks_completed: i64,
    pub streak_days: i64,
    pub coins: u32,
}

#[derive(Debug, FromRow)]
struct CountResult {
    count: i64,
}

#[derive(Debug, FromRow)]
struct DateResult {
    date: String,
}

#[derive(Debug, FromRow)]
struct CoinsResult {
    coins: u32,
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

    // 计算连胜天数：获取所有完成任务的日期（去重），然后计算从今天往回的连续天数
    let dates: Vec<DateResult> = sqlx::query_as(
        "SELECT DISTINCT DATE(updated_at) as date FROM todos WHERE status = 'Complete' ORDER BY date DESC"
    )
    .fetch_all(db)
    .await
    .map_err(|e| format!("Failed to get completion dates: {}", e))?;

    let streak_days = calculate_streak_days(&dates);

    // 从 player 表获取金币
    let coins_result: CoinsResult = sqlx::query_as("SELECT coins FROM player WHERE id = 1")
        .fetch_one(db)
        .await
        .map_err(|e| format!("Failed to get player coins: {}", e))?;

    Ok(DashboardStats {
        total_tasks_completed: count_result.count,
        streak_days,
        coins: coins_result.coins,
    })
}

// 计算连胜天数
fn calculate_streak_days(dates: &[DateResult]) -> i64 {
    if dates.is_empty() {
        return 0;
    }

    use chrono::{Local, NaiveDate};

    let today = Local::now().date_naive();
    let mut streak = 0i64;
    let mut expected_date = today;

    for date_result in dates {
        if let Ok(date) = NaiveDate::parse_from_str(&date_result.date, "%Y-%m-%d") {
            if date == expected_date {
                streak += 1;
                expected_date = date - chrono::Duration::days(1);
            } else if date < expected_date {
                // 日期比预期的早，说明连胜中断了
                break;
            }
            // 如果 date > expected_date，这不应该发生（因为按降序排列），跳过
        }
    }

    streak
}
