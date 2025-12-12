use chrono::Local;
use futures::TryStreamExt;
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

use crate::AppState;

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
pub enum TodoStatus {
    Incomplete,
    Complete,
    Pending,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Todo {
    pub id: u16,
    pub name: String,
    pub status: TodoStatus,
    pub difficulty: String,
    pub created_at: String,
    pub updated_at: String,
}

#[tauri::command]
pub async fn add_todo(
    state: tauri::State<'_, AppState>,
    name: &str,
    difficulty: &str,
) -> Result<(), String> {
    let db = &state.db;

    let current_time = Local::now().format("%Y-%m-%d %H:%M:%S").to_string();

    sqlx::query(
        "INSERT INTO todos (name, status, difficulty, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5)",
    )
    .bind(name)
    .bind(TodoStatus::Incomplete)
    .bind(difficulty)
    .bind(&current_time)
    .bind(&current_time)
    .execute(db)
    .await
    .map_err(|e| format!("Error saving todo: {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn get_todos(state: tauri::State<'_, AppState>) -> Result<Vec<Todo>, String> {
    let db = &state.db;

    let todos: Vec<Todo> =
        sqlx::query_as::<_, Todo>("SELECT * FROM todos order by created_at DESC")
            .fetch(db)
            .try_collect()
            .await
            .map_err(|e| format!("Failed to get todos {}", e))?;

    Ok(todos)
}

#[tauri::command]
pub async fn update_todo(state: tauri::State<'_, AppState>, todo: Todo) -> Result<(), String> {
    let db = &state.db;

    sqlx::query("UPDATE todos SET name = ?1, status = ?2, difficulty = ?3 WHERE id = ?4")
        .bind(todo.name)
        .bind(todo.status)
        .bind(todo.difficulty)
        .bind(todo.id)
        .execute(db)
        .await
        .map_err(|e| format!("could not update todo {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn delete_todo(state: tauri::State<'_, AppState>, id: u16) -> Result<(), String> {
    let db = &state.db;

    sqlx::query("DELETE FROM todos WHERE id = ?1")
        .bind(id)
        .execute(db)
        .await
        .map_err(|e| format!("could not delete todo {}", e))?;

    Ok(())
}
