use futures::TryStreamExt;
use serde::{Deserialize, Serialize};
use sqlx::{migrate::MigrateDatabase, prelude::FromRow, sqlite::SqlitePoolOptions, Pool, Sqlite};
use tauri::{App, Manager as _};

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
            delete_todo
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
    description: String,
    mark: String,
    created_at: String,
    updated_at: String
}

#[tauri::command]
async fn add_todo(state: tauri::State<'_, AppState>, name: &str, description: &str, mark: &str) -> Result<(), String> {
    let db = &state.db;

    sqlx::query("INSERT INTO todos (name, status, description, mark) VALUES (?1, ?2, ?3, ?4)")
        .bind(name)
        .bind(TodoStatus::Incomplete)
        .bind(description)
        .bind(mark)
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

    sqlx::query("UPDATE todos SET name = ?1, status = ?2, description = ?3, mark = ?4 WHERE id = ?5")
        .bind(todo.name)
        .bind(todo.status)
        .bind(todo.description)
        .bind(todo.mark)
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