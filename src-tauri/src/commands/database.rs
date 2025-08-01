use tauri::State;
use crate::{AppState, models::{Student, Payment, Attendance}};
use uuid::Uuid;
use chrono::Utc;

#[tauri::command]
pub async fn get_students(state: State<'_, AppState>) -> Result<Vec<Student>, String> {
    let db = state.db.lock().await;
    db.get_students().await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_student(
    state: State<'_, AppState>,
    first_name: String,
    last_name: String,
    email: Option<String>,
    phone: Option<String>,
    academic_level: String,
    parent_name: String,
    parent_phone: String,
    address: Option<String>,
    birth_date: Option<String>,
) -> Result<Student, String> {
    let student = Student {
        id: Uuid::new_v4().to_string(),
        first_name,
        last_name,
        email,
        phone,
        academic_level,
        rfid_card: None,
        parent_name,
        parent_phone,
        address,
        birth_date,
        enrollment_date: Utc::now(),
        is_active: true,
        notes: None,
        created_at: Utc::now(),
        updated_at: Utc::now(),
    };

    let db = state.db.lock().await;
    db.create_student(student).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_student(
    state: State<'_, AppState>,
    student: Student,
) -> Result<Student, String> {
    // TODO: Implement update_student in database
    Ok(student)
}

#[tauri::command]
pub async fn delete_student(
    state: State<'_, AppState>,
    student_id: String,
) -> Result<(), String> {
    // TODO: Implement delete_student in database
    Ok(())
}

#[tauri::command]
pub async fn get_payments(state: State<'_, AppState>) -> Result<Vec<Payment>, String> {
    let db = state.db.lock().await;
    db.get_payments().await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_payment(
    state: State<'_, AppState>,
    student_id: String,
    amount: f64,
    payment_type: String,
    payment_method: String,
    due_date: Option<String>,
    notes: Option<String>,
) -> Result<Payment, String> {
    let payment = Payment {
        id: Uuid::new_v4().to_string(),
        student_id,
        amount,
        payment_type,
        payment_method,
        payment_date: Utc::now(),
        due_date: due_date.and_then(|d| chrono::DateTime::parse_from_rfc3339(&d).ok())
            .map(|d| d.with_timezone(&Utc)),
        status: "paid".to_string(),
        notes,
        receipt_number: Some(format!("REC-{}", Uuid::new_v4().to_string()[..8].to_uppercase())),
        created_at: Utc::now(),
        updated_at: Utc::now(),
    };

    // TODO: Implement create_payment in database
    Ok(payment)
}

#[tauri::command]
pub async fn update_payment(
    state: State<'_, AppState>,
    payment: Payment,
) -> Result<Payment, String> {
    // TODO: Implement update_payment in database
    Ok(payment)
}

#[tauri::command]
pub async fn get_attendance(state: State<'_, AppState>) -> Result<Vec<Attendance>, String> {
    // TODO: Implement get_attendance in database
    Ok(vec![])
}

#[tauri::command]
pub async fn create_attendance(
    state: State<'_, AppState>,
    student_id: String,
    status: String,
    notes: Option<String>,
) -> Result<Attendance, String> {
    let attendance = Attendance {
        id: Uuid::new_v4().to_string(),
        student_id,
        date: Utc::now(),
        status,
        check_in_time: Some(Utc::now()),
        check_out_time: None,
        notes,
        created_at: Utc::now(),
    };

    // TODO: Implement create_attendance in database
    Ok(attendance)
}
