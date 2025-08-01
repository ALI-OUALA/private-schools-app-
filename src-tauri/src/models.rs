use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Student {
    pub id: String,
    pub first_name: String,
    pub last_name: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub academic_level: String,
    pub rfid_card: Option<String>,
    pub parent_name: String,
    pub parent_phone: String,
    pub address: Option<String>,
    pub birth_date: Option<String>,
    pub enrollment_date: DateTime<Utc>,
    pub is_active: bool,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Payment {
    pub id: String,
    pub student_id: String,
    pub amount: f64,
    pub payment_type: String,
    pub payment_method: String,
    pub payment_date: DateTime<Utc>,
    pub due_date: Option<DateTime<Utc>>,
    pub status: String,
    pub notes: Option<String>,
    pub receipt_number: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Attendance {
    pub id: String,
    pub student_id: String,
    pub date: String,
    pub status: String,
    pub check_in_time: Option<String>,
    pub check_out_time: Option<String>,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DatabaseStats {
    pub total_students: i64,
    pub active_students: i64,
    pub total_payments: i64,
    pub total_attendance: i64,
    pub database_size: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemInfo {
    pub version: String,
    pub os: String,
    pub cpu_usage: f32,
    pub memory_usage: f32,
    pub disk_usage: f32,
    pub uptime: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RfidScanResult {
    pub success: bool,
    pub card_id: Option<String>,
    pub student: Option<Student>,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    pub general: GeneralSettings,
    pub rfid: RfidSettings,
    pub payments: PaymentSettings,
    pub backup: BackupSettings,
    pub system: SystemSettings,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GeneralSettings {
    pub school_name: String,
    pub school_address: String,
    pub school_phone: String,
    pub school_email: String,
    pub academic_year: String,
    pub language: String,
    pub theme: String,
    pub currency: String,
    pub timezone: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RfidSettings {
    pub reader_type: String,
    pub com_port: String,
    pub baud_rate: u32,
    pub auto_connect: bool,
    pub scan_timeout: u32,
    pub enable_sound: bool,
    pub enable_led: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaymentSettings {
    pub default_session_price: std::collections::HashMap<String, f64>,
    pub late_fee_amount: f64,
    pub late_fee_after_days: i32,
    pub allow_partial_payments: bool,
    pub require_payment_notes: bool,
    pub auto_generate_receipts: bool,
    pub receipt_template: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BackupSettings {
    pub auto_backup: bool,
    pub backup_interval: String,
    pub backup_location: String,
    pub keep_backups: i32,
    pub cloud_sync: bool,
    pub cloud_provider: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemSettings {
    pub enable_logging: bool,
    pub log_level: String,
    pub max_log_size: i32,
    pub enable_updates: bool,
    pub update_channel: String,
    pub enable_telemetry: bool,
}
