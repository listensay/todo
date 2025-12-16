use sqlx::{migrate::MigrateDatabase, sqlite::SqlitePoolOptions, Pool, Sqlite};
use tauri::{App, Manager as _};

mod commands;

use commands::{
    add_exp, add_todo, create_player, delete_todo, get_calendar_data, get_config,
    get_dashboard_stats, get_player, get_todos, update_config, update_player, update_todo,
};

type Db = Pool<Sqlite>;

pub struct AppState {
    pub db: Db,
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
            get_calendar_data,
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
        format!("sqlite:{}", path.to_str().expect("path should be something")).as_str(),
    )
    .await;

    match db_creation_result {
        Ok(_) => println!("Database created successfully."),
        Err(e) => {
            eprintln!("Failed to create database: {}", e);
        }
    }

    let db_connection_result = SqlitePoolOptions::new()
        .connect(path.to_str().unwrap())
        .await;

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
