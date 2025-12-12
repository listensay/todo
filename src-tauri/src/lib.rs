use futures::TryStreamExt;
use serde::{Deserialize, Serialize};
use sqlx::{migrate::MigrateDatabase, prelude::FromRow, sqlite::SqlitePoolOptions, Pool, Sqlite};
use tauri::{App, Manager as _};
use chrono::Local;

type Db = Pool<Sqlite>;

struct AppState {
    db: Db,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            add_todo,
            get_todos,
            update_todo,
            delete_todo,
            get_player,
            create_player,
            update_player,
            add_exp,
            get_dashboard_stats,
            get_config,
            update_config
        ])
        .setup(|app| {
            tauri::async_runtime::block_on(async move {
                let db = setup_db(&app).await;
                app.manage(AppState { db });
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

async fn setup_db(app: &App) -> Db {
    let mut path = app.path().app_data_dir().expect("failed to get data_dir");

    println!("Database will be created at: {:?}", path.display());

    match std::fs::create_dir_all(path.clone()) {
        Ok(_) => {}
        Err(err) => {
            panic!("error creating directory {}", err);
        }
    };

    path.push("db.sqlite");

    let db_creation_result = Sqlite::create_database(
        format!("sqlite:{}", path.to_str().expect("path should be something")).as_str()
    ).await;

    match db_creation_result {
        Ok(_) => println!("Database created successfully."),
        Err(e) => {
            eprintln!("Failed to create database: {}", e);
            // 处理错误或终止操作
        }
    }

    let db_connection_result = SqlitePoolOptions::new()
        .connect(path.to_str().unwrap()).await;

    match db_connection_result {
        Ok(pool) => {
            println!("Database connected successfully.");
            sqlx::migrate!("./migrations").run(&pool).await.unwrap();
            pool
        }
        Err(e) => {
            eprintln!("Failed to connect to the database: {}", e);
            panic!("Exiting due to database connection failure");
        }
    }
}


#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
// 定义枚举 TodoStatus 用于表示待办事项的状态
enum TodoStatus {
    Incomplete,
    Complete,
    Pending,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct Todo {
    id: u16,
    name: String,
    status: TodoStatus,
    difficulty: String,
    created_at: String,
    updated_at: String
}

#[tauri::command]
async fn add_todo(state: tauri::State<'_, AppState>, name: &str, difficulty: &str) -> Result<(), String> {
    let db = &state.db;

    // 获取当前本地时间
    let current_time = Local::now().format("%Y-%m-%d %H:%M:%S").to_string();

    sqlx::query("INSERT INTO todos (name, status, difficulty, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5)")
        .bind(name)
        .bind(TodoStatus::Incomplete)
        .bind(difficulty)
        .bind(&current_time) // 设置 created_at
        .bind(&current_time) // 设置 updated_at
        .execute(db)
        .await
        .map_err(|e| format!("Error saving todo: {}", e))?;

    Ok(())
}

#[tauri::command]
async fn get_todos(state: tauri::State<'_, AppState>) -> Result<Vec<Todo>, String> {
    let db = &state.db;

    let todos: Vec<Todo> = sqlx::query_as::<_, Todo>("SELECT * FROM todos order by created_at DESC")
        .fetch(db)
        .try_collect()
        .await
        .map_err(|e| format!("Failed to get todos {}", e))?;

    Ok(todos)
}

#[tauri::command]
async fn update_todo(state: tauri::State<'_, AppState>, todo: Todo) -> Result<(), String> {
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
async fn delete_todo(state: tauri::State<'_, AppState>, id: u16) -> Result<(), String> {
    let db = &state.db;

    sqlx::query("DELETE FROM todos WHERE id = ?1")
        .bind(id)
        .execute(db)
        .await
        .map_err(|e| format!("could not delete todo {}", e))?;

    Ok(())
}

// ==================== Player System ====================

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct Player {
    id: u8,
    nickname: String,
    avatar: String,
    level: u16,
    exp: u32,
    total_tasks_completed: u32,
    streak_days: u16,
    last_login_date: Option<String>,
    coins: u32,
    title: String,
    created_at: String,
    updated_at: String,
}

#[tauri::command]
async fn get_player(state: tauri::State<'_, AppState>) -> Result<Player, String> {
    let db = &state.db;

    let player: Player = sqlx::query_as::<_, Player>("SELECT * FROM player WHERE id = 1")
        .fetch_one(db)
        .await
        .map_err(|e| format!("Failed to get player: {}", e))?;

    Ok(player)
}

#[tauri::command]
async fn create_player(state: tauri::State<'_, AppState>, nickname: &str, avatar: &str) -> Result<Player, String> {
    let db = &state.db;

    let current_time = Local::now().format("%Y-%m-%d %H:%M:%S").to_string();

    sqlx::query("INSERT INTO player (id, nickname, avatar, level, exp, total_tasks_completed, streak_days, coins, title, created_at, updated_at) VALUES (1, ?1, ?2, 1, 0, 0, 0, 0, '新手冒险者', ?3, ?4)")
        .bind(nickname)
        .bind(avatar)
        .bind(&current_time)
        .bind(&current_time)
        .execute(db)
        .await
        .map_err(|e| format!("Failed to create player: {}", e))?;

    // 获取刚创建的玩家
    let player: Player = sqlx::query_as::<_, Player>("SELECT * FROM player WHERE id = 1")
        .fetch_one(db)
        .await
        .map_err(|e| format!("Failed to get created player: {}", e))?;

    Ok(player)
}

#[tauri::command]
async fn update_player(state: tauri::State<'_, AppState>, player: Player) -> Result<(), String> {
    let db = &state.db;

    let current_time = Local::now().format("%Y-%m-%d %H:%M:%S").to_string();

    sqlx::query("UPDATE player SET nickname = ?1, avatar = ?2, level = ?3, exp = ?4, total_tasks_completed = ?5, streak_days = ?6, last_login_date = ?7, coins = ?8, title = ?9, updated_at = ?10 WHERE id = 1")
        .bind(player.nickname)
        .bind(player.avatar)
        .bind(player.level)
        .bind(player.exp)
        .bind(player.total_tasks_completed)
        .bind(player.streak_days)
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
async fn add_exp(state: tauri::State<'_, AppState>, exp_amount: u32) -> Result<Player, String> {
    let db = &state.db;

    // 获取当前玩家
    let mut player: Player = sqlx::query_as::<_, Player>("SELECT * FROM player WHERE id = 1")
        .fetch_one(db)
        .await
        .map_err(|e| format!("Failed to get player: {}", e))?;

    // 增加经验值
    player.exp += exp_amount;

    // 增加完成任务计数
    player.total_tasks_completed += 1;

    // 计算升级 (简单升级公式：每级需要 level * 100 经验)
    let exp_for_next_level = (player.level as u32) * 100;
    if player.exp >= exp_for_next_level {
        player.level += 1;
        player.exp -= exp_for_next_level;
    }

    // 更新数据库
    let current_time = Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
    sqlx::query("UPDATE player SET level = ?1, exp = ?2, total_tasks_completed = ?3, updated_at = ?4 WHERE id = 1")
        .bind(player.level)
        .bind(player.exp)
        .bind(player.total_tasks_completed)
        .bind(current_time)
        .execute(db)
        .await
        .map_err(|e| format!("Failed to update player exp: {}", e))?;

    Ok(player)
}

// ==================== Dashboard System ====================

#[derive(Debug, Serialize, Deserialize)]
struct DashboardStats {
    total_tasks_completed: u32,
    streak_days: u16,
    coins: u32,
}

#[tauri::command]
async fn get_dashboard_stats(state: tauri::State<'_, AppState>) -> Result<DashboardStats, String> {
    let db = &state.db;

    let player: Player = sqlx::query_as::<_, Player>("SELECT * FROM player WHERE id = 1")
        .fetch_one(db)
        .await
        .map_err(|e| format!("Failed to get dashboard stats: {}", e))?;

    Ok(DashboardStats {
        total_tasks_completed: player.total_tasks_completed,
        streak_days: player.streak_days,
        coins: player.coins,
    })
}

// ==================== Config System ====================

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct Config {
    id: u32,
    key: String,
    value: String,
    created_at: String,
    updated_at: String,
}

#[tauri::command]
async fn get_config(state: tauri::State<'_, AppState>, key: &str) -> Result<String, String> {
    let db = &state.db;

    let config: Config = sqlx::query_as::<_, Config>("SELECT * FROM config WHERE key = ?1")
        .bind(key)
        .fetch_one(db)
        .await
        .map_err(|e| format!("Failed to get config {}: {}", key, e))?;

    Ok(config.value)
}

#[tauri::command]
async fn update_config(state: tauri::State<'_, AppState>, key: &str, value: &str) -> Result<(), String> {
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