export interface Student {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  academic_level: string
  rfid_card?: string
  parent_name: string
  parent_phone: string
  address?: string
  birth_date?: string
  enrollment_date: string
  is_active: boolean
  notes?: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  student_id: string
  amount: number
  payment_type: string
  payment_method: string
  payment_date: string
  due_date?: string
  status: string
  notes?: string
  receipt_number?: string
  created_at: string
  updated_at: string
}

export interface Attendance {
  id: string
  student_id: string
  date: string
  status: string
  check_in_time?: string
  check_out_time?: string
  notes?: string
  created_at: string
}

export interface RfidScanResult {
  card_id: string
  student?: Student
  scan_time: string
  success: boolean
  message: string
}
