export type LabourStatus = 'Active' | 'Inactive' | 'On Leave';

export interface Labour {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  trade: string;
  dailyWage: number;
  status: LabourStatus;
  address?: string;
  emergencyContact?: string;
  joiningDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ProjectStatus = 'Planned' | 'In Progress' | 'On Hold' | 'Completed';

export interface Project {
  id: number;
  name: string;
  location: string;
  clientName?: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  budget: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type AttendanceStatus = 'Present' | 'Half Day' | 'Absent' | 'On Leave';

export interface Attendance {
  id: number;
  date: string;
  labourId: number;
  labour?: Labour;
  projectId?: number;
  project?: Project;
  status: AttendanceStatus;
  hoursWorked: number;
  overtimeHours: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type PaymentStatus = 'Pending' | 'Paid';
export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'UPI' | 'Cheque';

export interface Payroll {
  id: number;
  labourId: number;
  labour?: Labour;
  period: string; // YYYY-MM
  startDate: string;
  endDate: string;
  daysPresent: number;
  halfDays: number;
  daysAbsent: number;
  totalHours: number;
  overtimeHours: number;
  baseWage: number;
  overtimePay: number;
  bonus: number;
  deductions: number;
  netPayable: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod | null;
  paymentDate?: string | null;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  today: string;
  labours: {
    total: number;
    active: number;
    inactive: number;
  };
  projects: {
    total: number;
    active: number;
  };
  attendanceToday: {
    totalRecorded: number;
    present: number;
    halfDay: number;
    absent: number;
    attendanceRate: number;
  };
  payroll: {
    pendingAmount: number;
    pendingCount: number;
    paidAmount: number;
    paidCount: number;
  };
  tradeBreakdown: {
    trade: string;
    count: number;
  }[];
  recentAttendances: Attendance[];
}
