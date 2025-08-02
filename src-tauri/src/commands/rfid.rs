use tauri::State;
use crate::{AppState, models::RfidScanResult, rfid::RfidReader};
use std::sync::{Arc, Mutex};
use chrono::Utc;
use lazy_static::lazy_static;

// Global RFID reader instance
lazy_static! {
    static ref RFID_READER: Arc<Mutex<Option<RfidReader>>> = Arc::new(Mutex::new(None));
}

#[tauri::command]
pub async fn connect_rfid_reader(port_name: String, baud_rate: u32) -> Result<String, String> {
    let mut reader = RfidReader::new(port_name.clone(), baud_rate);
    
    match reader.connect() {
        Ok(_) => {
            let mut global_reader = RFID_READER.lock().unwrap();
            *global_reader = Some(reader);
            Ok(format!("Connected to RFID reader on {}", port_name))
        }
        Err(e) => Err(format!("Failed to connect to RFID reader: {}", e))
    }
}

#[tauri::command]
pub async fn disconnect_rfid_reader() -> Result<String, String> {
    let mut global_reader = RFID_READER.lock().unwrap();
    if let Some(ref mut reader) = global_reader.as_mut() {
        reader.disconnect();
    }
    *global_reader = None;
    Ok("RFID reader disconnected".to_string())
}

#[tauri::command]
pub async fn scan_rfid_card(state: State<'_, AppState>) -> Result<RfidScanResult, String> {
    let mut global_reader = RFID_READER.lock().unwrap();
    
    if let Some(ref mut reader) = global_reader.as_mut() {
        match reader.scan_card() {
            Ok(card_id) => {
                // Look up student by RFID card
                let db = state.db.lock().await;
                let students = db.get_students().await.map_err(|e| e.to_string())?;
                let student = students.into_iter().find(|s| s.rfid_card.as_ref() == Some(&card_id));

                Ok(RfidScanResult {
                    card_id: card_id.clone(),
                    student,
                    scan_time: Utc::now(),
                    success: true,
                    message: if student.is_some() {
                        "Student found".to_string()
                    } else {
                        "Card not registered".to_string()
                    },
                })
            }
            Err(e) => Ok(RfidScanResult {
                card_id: "".to_string(),
                student: None,
                scan_time: Utc::now(),
                success: false,
                message: format!("Scan failed: {}", e),
            })
        }
    } else {
        Err("RFID reader not connected".to_string())
    }
}

#[tauri::command]
pub async fn get_available_ports() -> Result<Vec<String>, String> {
    RfidReader::get_available_ports().map_err(|e| e.to_string())
}
