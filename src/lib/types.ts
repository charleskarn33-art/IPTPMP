export type UserRole = 'super_admin' | 'maintenance_manager' | 'regional_supervisor' | 'technician'
export type PMStatus = 'draft' | 'in_progress' | 'completed' | 'under_review' | 'reviewed' | 'archived'
export type SiteType = 'Greenfield' | 'Outdoor' | 'Indoor'
export type SiteStatus = 'Active' | 'Inactive'
export type ChecklistResponse = 'yes' | 'no' | 'na' | null

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  region?: string
  created_at: string
}

export interface Site {
  id: string
  site_id_code: string
  name: string
  region: string
  county: string
  gps_lat?: number
  gps_lng?: number
  priority?: string
  tower_type?: string
  generator_info?: string
  battery_info?: string
  solar_info?: string
  rectifier_info?: string
  assigned_technician?: string
  last_inspection_date?: string
  next_pm_date?: string
  status: SiteStatus
  type: SiteType
  generators?: number
  kva?: number
  panels?: number
  created_at: string
}

export interface Technician {
  id: string
  employee_id: string
  name: string
  email?: string
  phone?: string
  region?: string
  specialization?: string
  status: 'Active' | 'Inactive'
  created_at: string
}

export interface Inspection {
  id: string
  site_id: string
  site_name: string
  site_code: string
  technician_id?: string
  technician_name?: string
  region?: string
  county?: string
  inspection_date: string
  status: PMStatus
  overall_completion: number
  notes?: string
  gps_lat?: number
  gps_lng?: number
  created_at: string
  updated_at: string
}

export interface InspectionSection {
  id: string
  inspection_id: string
  section_name: string
  completion_percentage: number
  comments?: string
  items: ChecklistItem[]
}

export interface ChecklistItem {
  id: string
  section_id: string
  question: string
  response: ChecklistResponse
  comment?: string
  photo_url?: string
  corrective_action?: string
  measurement?: string
  measurement_unit?: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  message: string
  read: boolean
  created_at: string
}

export interface Region {
  name: string
  sites: number
  technicians: number
  completion_pct: number
  open_pm: number
}
