import React, { useState, useEffect } from 'react';
import type { Labour, LabourStatus } from '../types';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Users,
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X,
  CheckCircle,
  AlertCircle,
  Briefcase,
  UserCheck,
} from 'lucide-react';

interface LaboursViewProps {
  onWorkforceUpdated?: () => void;
}

export const LaboursView: React.FC<LaboursViewProps> = ({ onWorkforceUpdated }) => {
  const [labours, setLabours] = useState<Labour[]>([]);
  const [trades, setTrades] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedTrade, setSelectedTrade] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLabour, setEditingLabour] = useState<Labour | null>(null);
  const [deletingLabour, setDeletingLabour] = useState<Labour | null>(null);
  const [viewingLabour, setViewingLabour] = useState<Labour | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    trade: 'Mason',
    dailyWage: 700,
    status: 'Active' as LabourStatus,
    address: '',
    emergencyContact: '',
    joiningDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchLabours = async () => {
    try {
      setLoading(true);
      const [laboursData, tradesData] = await Promise.all([
        api.getLabours({
          search: search || undefined,
          trade: selectedTrade || undefined,
          status: selectedStatus || undefined,
        }),
        api.getLabourTrades(),
      ]);
      setLabours(laboursData);
      setTrades(tradesData);
    } catch (err) {
      console.error('Error fetching labours:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabours();
  }, [search, selectedTrade, selectedStatus]);

  const handleOpenAddModal = () => {
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      trade: 'Mason',
      dailyWage: 700,
      status: 'Active',
      address: '',
      emergencyContact: '',
      joiningDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (labour: Labour) => {
    setEditingLabour(labour);
    setFormData({
      firstName: labour.firstName,
      lastName: labour.lastName,
      phone: labour.phone,
      email: labour.email || '',
      trade: labour.trade,
      dailyWage: Number(labour.dailyWage),
      status: labour.status,
      address: labour.address || '',
      emergencyContact: labour.emergencyContact || '',
      joiningDate: labour.joiningDate || new Date().toISOString().split('T')[0],
      notes: labour.notes || '',
    });
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.trade) {
      setFormError('Please fill in all required fields (First Name, Last Name, Phone, Trade)');
      return;
    }

    try {
      setSubmitting(true);
      if (editingLabour) {
        await api.updateLabour(editingLabour.id, formData);
        setEditingLabour(null);
      } else {
        await api.createLabour(formData);
        setIsAddModalOpen(false);
      }
      fetchLabours();
      onWorkforceUpdated?.();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Error saving labour record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingLabour) return;
    try {
      setSubmitting(true);
      await api.deleteLabour(deletingLabour.id);
      setDeletingLabour(null);
      fetchLabours();
      onWorkforceUpdated?.();
    } catch (err) {
      console.error('Error deleting labour:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Workforce Directory</h1>
          <p className="text-sm text-slate-500">
            Manage your registered labourers, trade specializations, wage rates, and contact profiles.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          Register New Labour
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by worker name, phone number, trade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedTrade}
            onChange={(e) => setSelectedTrade(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">All Trades / Skills</option>
            {trades.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Leave">On Leave</option>
          </select>

          {(search || selectedTrade || selectedStatus) && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedTrade('');
                setSelectedStatus('');
              }}
              className="text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Labours Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4">Labour Name</th>
                <th className="px-6 py-4">Trade / Role</th>
                <th className="px-6 py-4">Daily Wage</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex justify-center items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                      Loading workforce directory...
                    </div>
                  </td>
                </tr>
              ) : labours.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No labourers found matching your criteria.
                  </td>
                </tr>
              ) : (
                labours.map((labour) => (
                  <tr key={labour.id} className="transition hover:bg-slate-50/60">
                    <td className="px-6 py-4">
                      <div
                        onClick={() => setViewingLabour(labour)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-700 transition group-hover:bg-indigo-100">
                          {labour.firstName[0]}
                          {labour.lastName[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition">
                            {labour.firstName} {labour.lastName}
                          </div>
                          <div className="text-xs text-slate-400">ID: #{labour.id.toString().padStart(4, '0')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800">
                        {labour.trade}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {formatCurrency(labour.dailyWage)}
                      <span className="text-xs font-normal text-slate-400"> / day</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Phone className="h-3 w-3 text-slate-400" />
                          {labour.phone}
                        </div>
                        {labour.address && (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            <span className="truncate max-w-[140px]">{labour.address}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          labour.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20'
                            : labour.status === 'On Leave'
                            ? 'bg-purple-50 text-purple-700 ring-1 ring-purple-500/20'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {labour.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{formatDate(labour.joiningDate)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(labour)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                          title="Edit Labour"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingLabour(labour)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                          title="Delete Labour"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Labour Modal */}
      {(isAddModalOpen || editingLabour) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {editingLabour ? 'Edit Labour Profile' : 'Register New Labourer'}
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingLabour(null);
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. Ramesh"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. Kumar"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    placeholder="+91 98450 12345"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    placeholder="worker@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Trade / Skill *</label>
                  <select
                    value={formData.trade}
                    onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Mason">Mason</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Welder">Welder</option>
                    <option value="Painter">Painter</option>
                    <option value="General Labour">General Labour</option>
                    <option value="Site Supervisor">Site Supervisor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Daily Wage (₹) *</label>
                  <input
                    type="number"
                    step="50"
                    required
                    value={formData.dailyWage}
                    onChange={(e) => setFormData({ ...formData, dailyWage: parseFloat(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as LabourStatus })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Address / Camp Location</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    placeholder="Camp 3, Ward 4"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Emergency Contact</label>
                  <input
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    placeholder="+91 98450 00000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Notes / Certifications</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="Notes on skills, experience or verification docs..."
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingLabour(null);
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingLabour ? 'Update Labour' : 'Register Labour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingLabour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">Confirm Deletion</h3>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to delete labour{' '}
              <span className="font-semibold text-slate-800">
                {deletingLabour.firstName} {deletingLabour.lastName}
              </span>
              ? All associated attendance and records will also be removed.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingLabour(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="rounded-xl bg-rose-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 disabled:opacity-50"
              >
                {submitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Viewing Labour Drawer / Modal */}
      {viewingLabour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 font-bold text-white text-lg">
                  {viewingLabour.firstName[0]}
                  {viewingLabour.lastName[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {viewingLabour.firstName} {viewingLabour.lastName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">ID: #{viewingLabour.id}</span>
                    <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                      {viewingLabour.trade}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewingLabour(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400">Daily Wage</span>
                <p className="mt-1 text-base font-bold text-slate-900">
                  {formatCurrency(viewingLabour.dailyWage)}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400">Current Status</span>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {viewingLabour.status}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400">Primary Phone</span>
                <p className="mt-1 font-semibold text-slate-900">{viewingLabour.phone}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400">Emergency Phone</span>
                <p className="mt-1 font-semibold text-slate-900">
                  {viewingLabour.emergencyContact || 'Not Specified'}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="rounded-xl border border-slate-100 p-3">
                <span className="text-slate-400">Address / Base Location</span>
                <p className="mt-1 text-slate-700 font-medium">{viewingLabour.address || 'None provided'}</p>
              </div>
              <div className="rounded-xl border border-slate-100 p-3">
                <span className="text-slate-400">Joining Date</span>
                <p className="mt-1 text-slate-700 font-medium">{formatDate(viewingLabour.joiningDate)}</p>
              </div>
              {viewingLabour.notes && (
                <div className="rounded-xl border border-slate-100 p-3">
                  <span className="text-slate-400">Special Notes & Skill Record</span>
                  <p className="mt-1 text-slate-700">{viewingLabour.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={() => {
                  const toEdit = viewingLabour;
                  setViewingLabour(null);
                  handleOpenEditModal(toEdit);
                }}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
