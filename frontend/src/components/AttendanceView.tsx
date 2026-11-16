import React, { useState, useEffect } from 'react';
import type { Attendance, Labour, Project, AttendanceStatus } from '../types';
import { api } from '../services/api';
import { formatDate } from '../utils/formatters';
import {
  CalendarCheck2,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  Save,
  Trash2,
  Check,
  AlertCircle,
  HelpCircle,
  Filter,
} from 'lucide-react';

interface AttendanceViewProps {
  onAttendanceSaved?: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ onAttendanceSaved }) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [labours, setLabours] = useState<Labour[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Sheet state: map labourId -> { status, hoursWorked, overtimeHours, projectId, notes, attendanceId }
  const [musterState, setMusterState] = useState<{
    [labourId: number]: {
      status: AttendanceStatus;
      hoursWorked: number;
      overtimeHours: number;
      projectId?: number;
      notes: string;
      attendanceId?: number;
    };
  }>({});

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsData, laboursData, attendancesData] = await Promise.all([
        api.getProjects(),
        api.getLabours({ status: 'Active' }),
        api.getAttendances({
          date: selectedDate,
          projectId: selectedProjectId ? parseInt(selectedProjectId, 10) : undefined,
        }),
      ]);

      setProjects(projectsData);
      setLabours(laboursData);
      setAttendances(attendancesData);

      // Build initial muster state combining active labours and existing attendances
      const initialMap: typeof musterState = {};

      laboursData.forEach((labour) => {
        const existing = attendancesData.find((a) => a.labourId === labour.id);
        if (existing) {
          initialMap[labour.id] = {
            status: existing.status,
            hoursWorked: Number(existing.hoursWorked),
            overtimeHours: Number(existing.overtimeHours),
            projectId: existing.projectId || (projectsData[0]?.id || undefined),
            notes: existing.notes || '',
            attendanceId: existing.id,
          };
        } else {
          initialMap[labour.id] = {
            status: 'Present',
            hoursWorked: 8,
            overtimeHours: 0,
            projectId: projectsData[0]?.id || undefined,
            notes: '',
          };
        }
      });

      setMusterState(initialMap);
    } catch (err) {
      console.error('Error loading attendance muster:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDate, selectedProjectId]);

  const handleStatusChange = (labourId: number, status: AttendanceStatus) => {
    let hoursWorked = 8;
    if (status === 'Half Day') hoursWorked = 4;
    if (status === 'Absent' || status === 'On Leave') hoursWorked = 0;

    setMusterState((prev) => ({
      ...prev,
      [labourId]: {
        ...prev[labourId],
        status,
        hoursWorked,
      },
    }));
  };

  const handleHoursChange = (labourId: number, hours: number) => {
    setMusterState((prev) => ({
      ...prev,
      [labourId]: {
        ...prev[labourId],
        hoursWorked: hours,
      },
    }));
  };

  const handleOvertimeChange = (labourId: number, ot: number) => {
    setMusterState((prev) => ({
      ...prev,
      [labourId]: {
        ...prev[labourId],
        overtimeHours: ot,
      },
    }));
  };

  const handleProjectChange = (labourId: number, projectId: number) => {
    setMusterState((prev) => ({
      ...prev,
      [labourId]: {
        ...prev[labourId],
        projectId,
      },
    }));
  };

  const handleNotesChange = (labourId: number, notes: string) => {
    setMusterState((prev) => ({
      ...prev,
      [labourId]: {
        ...prev[labourId],
        notes,
      },
    }));
  };

  const handleMarkAllPresent = () => {
    setMusterState((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((id) => {
        const labourId = parseInt(id, 10);
        updated[labourId] = {
          ...updated[labourId],
          status: 'Present',
          hoursWorked: 8,
        };
      });
      return updated;
    });
  };

  const handleSaveMuster = async () => {
    try {
      setSaving(true);
      setSaveSuccess(null);

      const records = Object.entries(musterState).map(([labourIdStr, state]) => ({
        labourId: parseInt(labourIdStr, 10),
        status: state.status,
        hoursWorked: state.hoursWorked,
        overtimeHours: state.overtimeHours,
        notes: state.notes,
      }));

      await api.bulkRecordAttendance({
        date: selectedDate,
        projectId: selectedProjectId ? parseInt(selectedProjectId, 10) : undefined,
        records,
      });

      setSaveSuccess(`Muster attendance successfully saved for ${formatDate(selectedDate)}!`);
      loadData();
      onAttendanceSaved?.();

      setTimeout(() => {
        setSaveSuccess(null);
      }, 4000);
    } catch (err: any) {
      console.error('Error saving muster:', err);
      alert('Failed to save attendance muster: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Calculations for summary pills
  const recordedCount = Object.keys(musterState).length;
  const presentCount = Object.values(musterState).filter((s) => s.status === 'Present').length;
  const halfDayCount = Object.values(musterState).filter((s) => s.status === 'Half Day').length;
  const absentCount = Object.values(musterState).filter((s) => s.status === 'Absent').length;
  const totalOtHours = Object.values(musterState).reduce((acc, curr) => acc + (curr.overtimeHours || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Attendance & Muster Log</h1>
          <p className="text-sm text-slate-500">
            Log daily worker muster, shifts, regular hours, overtime, and site deployment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkAllPresent}
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
          >
            <Check className="h-4 w-4 text-emerald-600" />
            Mark All Present
          </button>

          <button
            onClick={handleSaveMuster}
            disabled={saving || labours.length === 0}
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving Muster...' : 'Save Attendance Muster'}
          </button>
        </div>
      </div>

      {/* Date & Site Filter Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-600" />
            <label className="text-xs font-semibold text-slate-700">Muster Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-indigo-600" />
            <label className="text-xs font-semibold text-slate-700">Filter Site:</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">All Job Sites & Corridors</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Muster Metrics */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-700">
            Total: {recordedCount}
          </span>
          <span className="rounded-lg bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
            Present: {presentCount}
          </span>
          <span className="rounded-lg bg-amber-50 px-2.5 py-1 font-semibold text-amber-700">
            Half Day: {halfDayCount}
          </span>
          <span className="rounded-lg bg-rose-50 px-2.5 py-1 font-semibold text-rose-700">
            Absent: {absentCount}
          </span>
          {totalOtHours > 0 && (
            <span className="rounded-lg bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-700">
              Total OT: {totalOtHours}h
            </span>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-medium text-emerald-800 ring-1 ring-emerald-500/20">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          {saveSuccess}
        </div>
      )}

      {/* Muster Roll Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4">Labour Name & Trade</th>
                <th className="px-6 py-4">Attendance Status</th>
                <th className="px-6 py-4">Hours</th>
                <th className="px-6 py-4">Overtime (hrs)</th>
                <th className="px-6 py-4">Site / Project</th>
                <th className="px-6 py-4">Notes / Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex justify-center items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                      Loading muster sheet...
                    </div>
                  </td>
                </tr>
              ) : labours.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No active labourers found to mark muster. Please register labourers first.
                  </td>
                </tr>
              ) : (
                labours.map((labour) => {
                  const state = musterState[labour.id] || {
                    status: 'Present',
                    hoursWorked: 8,
                    overtimeHours: 0,
                    notes: '',
                  };

                  return (
                    <tr key={labour.id} className="transition hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-700">
                            {labour.firstName[0]}
                            {labour.lastName[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">
                              {labour.firstName} {labour.lastName}
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-2">
                              <span>{labour.trade}</span>
                              <span>•</span>
                              <span>Daily: ₹{labour.dailyWage}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {(['Present', 'Half Day', 'Absent', 'On Leave'] as AttendanceStatus[]).map(
                            (st) => {
                              const active = state.status === st;
                              return (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleStatusChange(labour.id, st)}
                                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                                    active
                                      ? st === 'Present'
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : st === 'Half Day'
                                        ? 'bg-amber-500 text-white shadow-xs'
                                        : st === 'On Leave'
                                        ? 'bg-purple-600 text-white shadow-xs'
                                        : 'bg-rose-600 text-white shadow-xs'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {st}
                                </button>
                              );
                            }
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            max="24"
                            step="0.5"
                            value={state.hoursWorked}
                            onChange={(e) =>
                              handleHoursChange(labour.id, parseFloat(e.target.value) || 0)
                            }
                            className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-center text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:outline-none"
                          />
                          <span className="text-xs text-slate-400">hrs</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            max="12"
                            step="0.5"
                            value={state.overtimeHours}
                            onChange={(e) =>
                              handleOvertimeChange(labour.id, parseFloat(e.target.value) || 0)
                            }
                            className={`w-16 rounded-lg border px-2 py-1 text-center text-xs font-semibold focus:outline-none ${
                              state.overtimeHours > 0
                                ? 'border-amber-300 bg-amber-50 text-amber-900 font-bold'
                                : 'border-slate-200 text-slate-900'
                            }`}
                          />
                          <span className="text-xs text-slate-400">hrs</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={state.projectId || ''}
                          onChange={(e) =>
                            handleProjectChange(labour.id, parseInt(e.target.value, 10))
                          }
                          className="w-48 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none"
                        >
                          <option value="">No site assigned</option>
                          {projects.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-6 py-4">
                        <input
                          type="text"
                          placeholder="e.g. Scaffolding erection..."
                          value={state.notes}
                          onChange={(e) => handleNotesChange(labour.id, e.target.value)}
                          className="w-full min-w-[150px] rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-700 placeholder:text-slate-300 focus:border-indigo-500 focus:outline-none"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
