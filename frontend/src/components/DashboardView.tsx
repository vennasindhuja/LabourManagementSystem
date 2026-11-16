import React from 'react';
import type { DashboardStats } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Users,
  Building2,
  CalendarCheck2,
  Wallet,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  UserCheck,
  AlertCircle,
  HardHat,
} from 'lucide-react';

interface DashboardViewProps {
  stats: DashboardStats | null;
  loading: boolean;
  onNavigate: (tab: 'dashboard' | 'labours' | 'attendance' | 'projects' | 'payroll') => void;
  onRefresh: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  loading,
  onNavigate,
  onRefresh,
}) => {
  if (loading || !stats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">Loading live dashboard metrics...</p>
        </div>
      </div>
    );
  }

  const { labours, projects, attendanceToday, payroll, tradeBreakdown, recentAttendances } = stats;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
                Live System Active
              </span>
              <span className="text-xs text-indigo-200">Date: {formatDate(stats.today)}</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
              Labour Workforce Operations
            </h1>
            <p className="mt-1 text-sm text-indigo-200 max-w-xl">
              Comprehensive real-time tracking for construction workforce muster, multi-site job deployment, and automated wage settlements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('attendance')}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-900 shadow-sm transition hover:bg-indigo-50"
            >
              <CalendarCheck2 className="h-4 w-4 text-indigo-600" />
              Mark Daily Muster
            </button>
            <button
              onClick={() => onNavigate('payroll')}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-700/80 px-4 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-white/20 transition hover:bg-indigo-700"
            >
              <Wallet className="h-4 w-4" />
              Run Payroll
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Workforce */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Total Workforce</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900">{labours.total}</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {labours.active} Active
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
            <span>Inactive / On-leave</span>
            <span className="font-semibold text-slate-700">{labours.inactive}</span>
          </div>
        </div>

        {/* Today's Attendance Rate */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Today's Attendance</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              {attendanceToday.attendanceRate}%
            </span>
            <span className="text-xs text-slate-500">
              ({attendanceToday.present} Present)
            </span>
          </div>
          {/* Progress Bar */}
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, attendanceToday.attendanceRate)}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Half Day: {attendanceToday.halfDay}</span>
            <span>Absent: {attendanceToday.absent}</span>
          </div>
        </div>

        {/* Active Sites / Projects */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Job Sites & Projects</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900">{projects.active}</span>
            <span className="text-xs text-slate-500">In Progress</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
            <span>Total Projects</span>
            <span className="font-semibold text-slate-700">{projects.total} Sites</span>
          </div>
        </div>

        {/* Pending Wage Liabilities */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Pending Payroll</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {formatCurrency(payroll.pendingAmount)}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
            <span>{payroll.pendingCount} Slips Pending</span>
            <button
              onClick={() => onNavigate('payroll')}
              className="text-indigo-600 font-semibold hover:underline flex items-center"
            >
              Clear <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Trade Distribution & Recent Muster Records */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Trade Breakdown */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardHat className="h-5 w-5 text-indigo-600" />
              <h2 className="text-base font-semibold text-slate-900">Skill / Trade Breakdown</h2>
            </div>
            <span className="text-xs text-slate-500">{tradeBreakdown.length} Categories</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Workforce distribution across specialized trades.</p>

          <div className="mt-5 space-y-3">
            {tradeBreakdown.map((item) => {
              const percentage = labours.total > 0 ? Math.round((item.count / labours.total) * 100) : 0;
              return (
                <div key={item.trade} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{item.trade}</span>
                    <span className="text-slate-500 font-semibold">
                      {item.count} <span className="text-slate-400 font-normal">({percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('labours')}
              className="w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Manage Workforce Directory →
            </button>
          </div>
        </div>

        {/* Today's Activity & Recent Attendance */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              <h2 className="text-base font-semibold text-slate-900">Recent Attendance Logs</h2>
            </div>
            <button
              onClick={() => onNavigate('attendance')}
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              Full Daily Muster <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500">Latest recorded attendance check-ins and overtime allocations.</p>

          <div className="mt-4 divide-y divide-slate-100 overflow-hidden">
            {recentAttendances.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">
                No recent attendance records found. Click "Mark Daily Muster" to record attendance.
              </div>
            ) : (
              recentAttendances.map((att) => (
                <div key={att.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700 text-xs">
                      {att.labour ? `${att.labour.firstName[0]}${att.labour.lastName[0]}` : 'L'}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {att.labour ? `${att.labour.firstName} ${att.labour.lastName}` : `Labour #${att.labourId}`}
                        <span className="ml-2 text-xs font-normal text-slate-500">
                          ({att.labour?.trade || 'Worker'})
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Site: {att.project?.name || 'General Assignment'}</span>
                        <span>•</span>
                        <span>{formatDate(att.date)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-700">
                        {att.hoursWorked} hrs
                        {Number(att.overtimeHours) > 0 && (
                          <span className="text-amber-600 ml-1">+{att.overtimeHours}h OT</span>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          att.status === 'Present'
                            ? 'bg-emerald-50 text-emerald-700'
                            : att.status === 'Half Day'
                            ? 'bg-amber-50 text-amber-700'
                            : att.status === 'On Leave'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {att.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
