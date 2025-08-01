// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod rfid;
mod models;
mod commands;

use tauri::{Manager, SystemTray, SystemTrayMenu, SystemTrayMenuItem, CustomMenuItem};
use database::Database;
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Clone)]
pub struct AppState {
    pub db: Arc<Mutex<Database>>,
}

fn create_system_tray() -> SystemTray {
    let quit = CustomMenuItem::new("quit".to_string(), "Quitter");
    let show = CustomMenuItem::new("show".to_string(), "Afficher");
    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);

    SystemTray::new().with_menu(tray_menu)
}

#[tokio::main]
async fn main() {
    // Initialize database
    let db = Database::new().await.expect("Failed to initialize database");
    let app_state = AppState {
        db: Arc::new(Mutex::new(db)),
    };

    tauri::Builder::default()
        .manage(app_state)
        .system_tray(create_system_tray())
        .on_system_tray_event(|app, event| match event {
            tauri::SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
            }
            tauri::SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    std::process::exit(0);
                }
                "show" => {
                    let window = app.get_window("main").unwrap();
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
                _ => {}
            },
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            commands::database::get_students,
            commands::database::create_student,
            commands::database::update_student,
            commands::database::delete_student,
            commands::database::get_payments,
            commands::database::create_payment,
            commands::database::update_payment,
            commands::database::get_attendance,
            commands::database::create_attendance,
            commands::database::get_database_stats,
            commands::rfid::scan_rfid_card,
            commands::rfid::connect_rfid_reader,
            commands::rfid::disconnect_rfid_reader,
            commands::rfid::get_available_ports,
            commands::system::export_data,
            commands::system::import_data,
            commands::system::backup_database,
            commands::system::restore_database,
            commands::system::get_system_info,
            commands::system::save_settings,
            commands::system::load_settings,
        ])
        .setup(|app| {
            // Initialize the database tables
            let app_handle = app.handle();
            tauri::async_runtime::spawn(async move {
                let state: tauri::State<AppState> = app_handle.state();
                let db = state.db.lock().await;
                if let Err(e) = db.initialize_tables().await {
                    eprintln!("Failed to initialize database tables: {}", e);
                }
            });

            // Start real-time system monitoring
            let app_handle = app.handle();
            tauri::async_runtime::spawn(async move {
                let mut interval = tokio::time::interval(tokio::time::Duration::from_secs(30));
                loop {
                    interval.tick().await;
                    
                    // Get system info and emit event
                    if let Ok(system_info) = commands::system::get_system_info_internal().await {
                        let _ = app_handle.emit_all("system-stats-updated", &system_info);
                    }
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
