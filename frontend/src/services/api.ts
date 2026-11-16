import axios from 'axios';
import type {
  Labour,
  Project,
  Attendance,
  Payroll,
  DashboardStats,
} from '../types';

const API_BASE = '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await client.get<DashboardStats>('/dashboard/stats');
    return res.data;
  },

  // Labours
  getLabours: async (params?: { search?: string; trade?: string; status?: string }): Promise<Labour[]> => {
    const res = await client.get<Labour[]>('/labours', { params });
    return res.data;
  },
  getLabourTrades: async (): Promise<string[]> => {
    const res = await client.get<string[]>('/labours/trades');
    return res.data;
  },
  getLabour: async (id: number): Promise<Labour> => {
    const res = await client.get<Labour>(`/labours/${id}`);
    return res.data;
  },
  createLabour: async (data: Partial<Labour>): Promise<Labour> => {
    const res = await client.post<Labour>('/labours', data);
    return res.data;
  },
  updateLabour: async (id: number, data: Partial<Labour>): Promise<Labour> => {
    const res = await client.put<Labour>(`/labours/${id}`, data);
    return res.data;
  },
  deleteLabour: async (id: number): Promise<{ success: boolean }> => {
    const res = await client.delete<{ success: boolean }>(`/labours/${id}`);
    return res.data;
  },

  // Projects
  getProjects: async (params?: { search?: string; status?: string }): Promise<Project[]> => {
    const res = await client.get<Project[]>('/projects', { params });
    return res.data;
  },
  getProject: async (id: number): Promise<Project> => {
    const res = await client.get<Project>(`/projects/${id}`);
    return res.data;
  },
  createProject: async (data: Partial<Project>): Promise<Project> => {
    const res = await client.post<Project>('/projects', data);
    return res.data;
  },
  updateProject: async (id: number, data: Partial<Project>): Promise<Project> => {
    const res = await client.put<Project>(`/projects/${id}`, data);
    return res.data;
  },
  deleteProject: async (id: number): Promise<{ success: boolean }> => {
    const res = await client.delete<{ success: boolean }>(`/projects/${id}`);
    return res.data;
  },

  // Attendance
  getAttendances: async (params?: { date?: string; projectId?: number; labourId?: number }): Promise<Attendance[]> => {
    const res = await client.get<Attendance[]>('/attendance', { params });
    return res.data;
  },
  recordAttendance: async (data: {
    labourId: number;
    date: string;
    projectId?: number;
    status: string;
    hoursWorked?: number;
    overtimeHours?: number;
    notes?: string;
  }): Promise<Attendance> => {
    const res = await client.post<Attendance>('/attendance', data);
    return res.data;
  },
  bulkRecordAttendance: async (data: {
    date: string;
    projectId?: number;
    records: {
      labourId: number;
      status: string;
      hoursWorked?: number;
      overtimeHours?: number;
      notes?: string;
    }[];
  }): Promise<Attendance[]> => {
    const res = await client.post<Attendance[]>('/attendance/bulk', data);
    return res.data;
  },
  deleteAttendance: async (id: number): Promise<{ success: boolean }> => {
    const res = await client.delete<{ success: boolean }>(`/attendance/${id}`);
    return res.data;
  },

  // Payroll
  getPayrolls: async (params?: { period?: string; status?: string; labourId?: number }): Promise<Payroll[]> => {
    const res = await client.get<Payroll[]>('/payroll', { params });
    return res.data;
  },
  getPayroll: async (id: number): Promise<Payroll> => {
    const res = await client.get<Payroll>(`/payroll/${id}`);
    return res.data;
  },
  generatePayroll: async (data: {
    period: string; // YYYY-MM
    startDate: string;
    endDate: string;
    labourId?: number;
  }): Promise<Payroll[]> => {
    const res = await client.post<Payroll[]>('/payroll/generate', data);
    return res.data;
  },
  updatePayrollStatus: async (
    id: number,
    data: {
      paymentStatus: 'Pending' | 'Paid';
      paymentMethod?: string;
      paymentDate?: string;
      bonus?: number;
      deductions?: number;
      notes?: string;
    }
  ): Promise<Payroll> => {
    const res = await client.put<Payroll>(`/payroll/${id}/status`, data);
    return res.data;
  },
  deletePayroll: async (id: number): Promise<{ success: boolean }> => {
    const res = await client.delete<{ success: boolean }>(`/payroll/${id}`);
    return res.data;
  },
};
