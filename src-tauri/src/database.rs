use sqlx::{SqlitePool, Row};
use anyhow::Result;
use chrono::{DateTime, Utc};
use uuid::Uuid;
use crate::models::{Student, Payment, Attendance, DatabaseStats};

pub struct Database {
    pool: SqlitePool,
}

impl Database {
    pub async fn new() -> Result<Self> {
        // Create database file in app data directory
        let db_path = "centre_educatif.db";
        let database_url = format!("sqlite:{}", db_path);
        
        let pool = SqlitePool::connect(&database_url).await?;
        
        Ok(Database { pool })
    }

    pub async fn initialize_tables(&self) -> Result<()> {
        // Create students table
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS students (
                id TEXT PRIMARY KEY,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT,
                phone TEXT,
                academic_level TEXT NOT NULL,
                rfid_card TEXT UNIQUE,
                parent_name TEXT NOT NULL,
                parent_phone TEXT NOT NULL,
                address TEXT,
                birth_date TEXT,
                enrollment_date TEXT NOT NULL,
                is_active BOOLEAN NOT NULL DEFAULT 1,
                notes TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            "#,
        )
        .execute(&self.pool)
        .await?;

        // Create payments table
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS payments (
                id TEXT PRIMARY KEY,
                student_id TEXT NOT NULL,
                amount REAL NOT NULL,
                payment_type TEXT NOT NULL,
                payment_method TEXT NOT NULL,
                payment_date TEXT NOT NULL,
                due_date TEXT,
                status TEXT NOT NULL,
                notes TEXT,
                receipt_number TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (student_id) REFERENCES students (id)
            )
            "#,
        )
        .execute(&self.pool)
        .await?;

        // Create attendance table
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS attendance (
                id TEXT PRIMARY KEY,
                student_id TEXT NOT NULL,
                date TEXT NOT NULL,
                status TEXT NOT NULL,
                check_in_time TEXT,
                check_out_time TEXT,
                notes TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY (student_id) REFERENCES students (id)
            )
            "#,
        )
        .execute(&self.pool)
        .await?;

        // Insert sample data if tables are empty
        self.insert_sample_data().await?;

        Ok(())
    }

    async fn insert_sample_data(&self) -> Result<()> {
        // Check if we already have data
        let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM students")
            .fetch_one(&self.pool)
            .await?;

        if count > 0 {
            return Ok(());
        }

        // Insert sample students
        let sample_students = vec![
            ("Ahmed", "Benali", "1ère CEM", "0555123456", "Fatima Benali", "0555123457"),
            ("Amina", "Khelifi", "2ème CEM", "0555234567", "Omar Khelifi", "0555234568"),
            ("Youcef", "Mansouri", "3ème CEM", "0555345678", "Aicha Mansouri", "0555345679"),
            ("Salma", "Boudiaf", "1ère Lycée", "0555456789", "Karim Boudiaf", "0555456790"),
            ("Riad", "Zerrouki", "2ème Lycée", "0555567890", "Nadia Zerrouki", "0555567891"),
        ];

        for (first_name, last_name, level, phone, parent_name, parent_phone) in sample_students {
            let id = Uuid::new_v4().to_string();
            let now = Utc::now().to_rfc3339();
            
            sqlx::query(
                r#"
                INSERT INTO students (
                    id, first_name, last_name, academic_level, phone, parent_name, 
                    parent_phone, enrollment_date, is_active, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                "#,
            )
            .bind(&id)
            .bind(first_name)
            .bind(last_name)
            .bind(level)
            .bind(phone)
            .bind(parent_name)
            .bind(parent_phone)
            .bind(&now)
            .bind(true)
            .bind(&now)
            .bind(&now)
            .execute(&self.pool)
            .await?;
        }

        Ok(())
    }

    pub async fn get_students(&self) -> Result<Vec<Student>> {
        let rows = sqlx::query("SELECT * FROM students ORDER BY created_at DESC")
            .fetch_all(&self.pool)
            .await?;

        let mut students = Vec::new();
        for row in rows {
            let student = Student {
                id: row.get("id"),
                first_name: row.get("first_name"),
                last_name: row.get("last_name"),
                email: row.get("email"),
                phone: row.get("phone"),
                academic_level: row.get("academic_level"),
                rfid_card: row.get("rfid_card"),
                parent_name: row.get("parent_name"),
                parent_phone: row.get("parent_phone"),
                address: row.get("address"),
                birth_date: row.get("birth_date"),
                enrollment_date: DateTime::parse_from_rfc3339(&row.get::<String, _>("enrollment_date"))?.with_timezone(&Utc),
                is_active: row.get("is_active"),
                notes: row.get("notes"),
                created_at: DateTime::parse_from_rfc3339(&row.get::<String, _>("created_at"))?.with_timezone(&Utc),
                updated_at: DateTime::parse_from_rfc3339(&row.get::<String, _>("updated_at"))?.with_timezone(&Utc),
            };
            students.push(student);
        }

        Ok(students)
    }

    pub async fn create_student(&self, student: Student) -> Result<Student> {
        let now = Utc::now().to_rfc3339();
        
        sqlx::query(
            r#"
            INSERT INTO students (
                id, first_name, last_name, email, phone, academic_level, rfid_card,
                parent_name, parent_phone, address, birth_date, enrollment_date,
                is_active, notes, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&student.id)
        .bind(&student.first_name)
        .bind(&student.last_name)
        .bind(&student.email)
        .bind(&student.phone)
        .bind(&student.academic_level)
        .bind(&student.rfid_card)
        .bind(&student.parent_name)
        .bind(&student.parent_phone)
        .bind(&student.address)
        .bind(&student.birth_date)
        .bind(student.enrollment_date.to_rfc3339())
        .bind(student.is_active)
        .bind(&student.notes)
        .bind(&now)
        .bind(&now)
        .execute(&self.pool)
        .await?;

        Ok(student)
    }

    pub async fn get_payments(&self) -> Result<Vec<Payment>> {
        let rows = sqlx::query("SELECT * FROM payments ORDER BY payment_date DESC")
            .fetch_all(&self.pool)
            .await?;

        let mut payments = Vec::new();
        for row in rows {
            let payment = Payment {
                id: row.get("id"),
                student_id: row.get("student_id"),
                amount: row.get("amount"),
                payment_type: row.get("payment_type"),
                payment_method: row.get("payment_method"),
                payment_date: DateTime::parse_from_rfc3339(&row.get::<String, _>("payment_date"))?.with_timezone(&Utc),
                due_date: row.get::<Option<String>, _>("due_date")
                    .map(|d| DateTime::parse_from_rfc3339(&d).ok())
                    .flatten()
                    .map(|d| d.with_timezone(&Utc)),
                status: row.get("status"),
                notes: row.get("notes"),
                receipt_number: row.get("receipt_number"),
                created_at: DateTime::parse_from_rfc3339(&row.get::<String, _>("created_at"))?.with_timezone(&Utc),
                updated_at: DateTime::parse_from_rfc3339(&row.get::<String, _>("updated_at"))?.with_timezone(&Utc),
            };
            payments.push(payment);
        }

        Ok(payments)
    }

    pub async fn get_database_stats(&self) -> Result<DatabaseStats> {
        let total_students: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM students")
            .fetch_one(&self.pool)
            .await?;

        let active_students: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM students WHERE is_active = 1")
            .fetch_one(&self.pool)
            .await?;

        let total_payments: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM payments")
            .fetch_one(&self.pool)
            .await?;

        let total_attendance: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM attendance")
            .fetch_one(&self.pool)
            .await?;

        Ok(DatabaseStats {
            total_students,
            active_students,
            total_payments,
            total_attendance,
            database_size: 0, // TODO: Calculate actual database size
        })
    }
}
