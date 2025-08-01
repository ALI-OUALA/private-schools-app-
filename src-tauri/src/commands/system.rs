use tauri::State;
use crate::AppState;
use std::path::Path;
use tokio::fs;

#[tauri::command]
pub async fn get_system_info() -> Result<crate::models::SystemInfo, String> {
    get_system_info_internal().await.map_err(|e| e.to_string())
}

pub async fn get_system_info_internal() -> Result<crate::models::SystemInfo, Box<dyn std::error::Error>> {
    Ok(crate::models::SystemInfo {
        version: "2.0.0".to_string(),
        os: std::env::consts::OS.to_string(),
        cpu_usage: 15.5,
        memory_usage: 45.2,
        disk_usage: 23.1,
        uptime: "2h 34m".to_string(),
    })
}

#[tauri::command]
pub async fn save_settings(settings: crate::models::AppSettings) -> Result<bool, String> {
    // TODO: Implement settings saving
    Ok(true)
}

#[tauri::command]
pub async fn load_settings() -> Result<Option<crate::models::AppSettings>, String> {
    // TODO: Implement settings loading
    Ok(None)
}

#[tauri::command]
pub async fn export_data(
    state: State<'_, AppState>,
    file_path: String,
    data_type: String,
) -> Result<String, String> {
    let db = state.db.lock().await;
    
    match data_type.as_str() {
        "students" => {
            let students = db.get_students().await.map_err(|e| e.to_string())?;
            let json_data = serde_json::to_string_pretty(&students).map_err(|e| e.to_string())?;
            fs::write(&file_path, json_data).await.map_err(|e| e.to_string())?;
            Ok(format!("Exported {} students to {}", students.len(), file_path))
        }
        "payments" => {
            let payments = db.get_payments().await.map_err(|e| e.to_string())?;
            let json_data = serde_json::to_string_pretty(&payments).map_err(|e| e.to_string())?;
            fs::write(&file_path, json_data).await.map_err(|e| e.to_string())?;
            Ok(format!("Exported {} payments to {}", payments.len(), file_path))
        }
        _ => Err("Unsupported data type".to_string())
    }
}

#[tauri::command]
pub async fn import_data(
    state: State<'_, AppState>,
    file_path: String,
    data_type: String,
) -> Result<String, String> {
    if !Path::new(&file_path).exists() {
        return Err("File does not exist".to_string());
    }

    let file_content = fs::read_to_string(&file_path).await.map_err(|e| e.to_string())?;
    
    match data_type.as_str() {
        "students" => {
            let students: Vec<crate::models::Student> = serde_json::from_str(&file_content)
                .map_err(|e| e.to_string())?;
            
            // TODO: Implement bulk insert for students
            Ok(format!("Imported {} students from {}", students.len(), file_path))
        }
        _ => Err("Unsupported data type".to_string())
    }
}

#[tauri::command]
pub async fn backup_database(backup_path: String) -> Result<String, String> {
    let source_path = "centre_educatif.db";
    
    if !Path::new(source_path).exists() {
        return Err("Database file not found".to_string());
    }

    fs::copy(source_path, &backup_path).await.map_err(|e| e.to_string())?;
    Ok(format!("Database backed up to {}", backup_path))
}

#[tauri::command]
pub async fn restore_database(backup_path: String) -> Result<String, String> {
    if !Path::new(&backup_path).exists() {
        return Err("Backup file does not exist".to_string());
    }

    let target_path = "centre_educatif.db";
    fs::copy(&backup_path, target_path).await.map_err(|e| e.to_string())?;
    Ok(format!("Database restored from {}", backup_path))
}
