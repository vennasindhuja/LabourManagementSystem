import React, { useState, useEffect } from 'react';
import type { Payroll, Labour, PaymentStatus, PaymentMethod } from '../types';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { SlipModal } from './SlipModal';
import {
  Wallet,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  DollarSign,
  FileText,
  CreditCard,
  Trash2,
  X,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

interface PayrollViewProps {
  onPayrollUpdated?: () => void;
}

export const PayrollView: React.FC<PayrollViewProps> = ({ onPayrollUpdated }) => {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [labours, setLabours] = useState<Labour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Modals
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [payingPayroll, setPayingPayroll] = useState<Payroll | null>(null);
  const [viewingSlip, setViewingSlip] = useState<Payroll | null>(null);
  const [deletingPayroll, setDeletingPayroll] = useState<Payroll | null>(null);

  // Generate Form
  const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
  const [generateData, setGenerateData] = useState({
    period: currentMonth,
    startDate: `${currentMonth}-01`,
    endDate: new Date().toISOString().split('T')[0],
    labourId: '',
  });

  // Pay Form
  const [payData, setPayData] = useState({
    paymentStatus: 'Paid' as PaymentStatus,
    paymentMethod: 'UPI' as PaymentMethod,
    paymentDate: new Date().toISOString().split('T')[0],
    bonus: 0,
    deductions: 0,
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchPayrollData = async () => {
    try {
      setLoading(true);
      const [payrollsData, laboursData] = await Promise.all([
        api.getPayrolls({
          period: selectedPeriod || undefined,
          status: selectedStatus || undefined,
        }),
        api.getLabours(),
      ]);
      setPayrolls(payrollsData);
      setLabours(laboursData);
    } catch (err) {
      console.error('Error fetching payroll:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrollData();
  }, [selectedPeriod, selectedStatus]);

  const handleGeneratePayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setModalError('');
      await api.generatePayroll({
        period: generateData.period,
        startDate: generateData.startDate,
        endDate: generateData.endDate,
        labourId: generateData.labourId ? parseInt(generateData.labourId, 10) : undefined,
      });
      setIsGenerateModalOpen(false);
      fetchPayrollData();
      onPayrollUpdated?.();
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Error generating payroll muster.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenPayModal = (p: Payroll) => {
    setPayingPayroll(p);
    setPayData({
      paymentStatus: 'Paid',
      paymentMethod: p.paymentMethod || 'Bank Transfer',
      paymentDate: p.paymentDate || new Date().toISOString().split('T')[0],
      bonus: Number(p.bonus || 0),
      deductions: Number(p.deductions || 0),
      notes: p.notes || '',
    });
    setModalError('');
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingPayroll) return;
    try {
      setSubmitting(true);
      setModalError('');
      await api.updatePayrollStatus(payingPayroll.id, payData);
      setPayingPayroll(null);
      fetchPayrollData();
      onPayrollUpdated?.();
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Error updating payment status.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePayroll = async () => {
    if (!deletingPayroll) return;
    try {
      setSubmitting(true);
      await api.deletePayroll(deletingPayroll.id);
      setDeletingPayroll(null);
      fetchPayrollData();
      onPayrollUpdated?.();
    } catch (err) {
      console.error('Error deleting payroll record:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Calculations
  const totalAmount = payrolls.reduce((acc, p) => acc + Number(p.netPayable || 0), 0);
  const paidAmount = payrolls
    .filter((p) => p.paymentStatus === 'Paid')
    .reduce((acc, p) => acc + Number(p.netPayable || 0), 0);
  const pendingAmount = payrolls
    .filter((p) => p.paymentStatus === 'Pending')
    .reduce((acc, p) => acc + Number(p.netPayable || 0), 0);
  const pendingCount = payrolls.filter((p) => p.paymentStatus === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payroll & Wage Settlements</h1>
          <p className="text-sm text-slate-500">
            Automated muster wage calculation, overtime multipliers, and payment disbursement records.
          </p>
        </div>

        <button
          onClick={() => {
            setModalError('');
            setIsGenerateModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          Generate Period Payroll
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Wage Bill</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{formatCurrency(totalAmount)}</div>
          <div className="mt-2 text-xs text-slate-500">{payrolls.length} Total Generated Slips</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Paid Settlements</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-emerald-700">{formatCurrency(paidAmount)}</div>
          <div className="mt-2 text-xs text-emerald-600 font-medium">Disbursed to Workers</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Pending Clearance</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-amber-600">{formatCurrency(pendingAmount)}</div>
          <div className="mt-2 text-xs text-amber-700 font-medium">{pendingCount} Slips Pending Payment</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-600" />
            <label className="text-xs font-semibold text-slate-700">Period (YYYY-MM):</label>
            <input
              type="month"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-indigo-600" />
            <label className="text-xs font-semibold text-slate-700">Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">All Payment Statuses</option>
              <option value="Pending">Pending Only</option>
              <option value="Paid">Paid Only</option>
            </select>
          </div>

          {(selectedPeriod || selectedStatus) && (
            <button
              onClick={() => {
                setSelectedPeriod('');
                setSelectedStatus('');
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Payroll Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4">Labour Name & Trade</th>
                <th className="px-6 py-4">Period & Dates</th>
                <th className="px-6 py-4">Muster Days</th>
                <th className="px-6 py-4">Wage Breakdown</th>
                <th className="px-6 py-4">Net Payable</th>
                <th className="px-6 py-4">Payment Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex justify-center items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                      Loading payroll slips...
                    </div>
                  </td>
                </tr>
              ) : payrolls.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No payroll slips found. Click "Generate Period Payroll" to compute wages from attendance.
                  </td>
                </tr>
              ) : (
                payrolls.map((payroll) => (
                  <tr key={payroll.id} className="transition hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-700">
                          {payroll.labour ? `${payroll.labour.firstName[0]}${payroll.labour.lastName[0]}` : 'L'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {payroll.labour ? `${payroll.labour.firstName} ${payroll.labour.lastName}` : `Labour #${payroll.labourId}`}
                          </div>
                          <div className="text-xs text-slate-400">
                            {payroll.labour?.trade || 'Worker'} • ₹{payroll.labour?.dailyWage}/day
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-xs">
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {payroll.period}
                        </span>
                        <div className="mt-1 text-slate-400">
                          {formatDate(payroll.startDate)} → {formatDate(payroll.endDate)}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-xs space-y-0.5">
                        <div className="font-medium text-slate-700">
                          {payroll.daysPresent} Present {payroll.halfDays > 0 && `• ${payroll.halfDays} Half`}
                        </div>
                        <div className="text-slate-400">
                          {payroll.totalHours} hrs {payroll.overtimeHours > 0 && `(${payroll.overtimeHours}h OT)`}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-xs space-y-0.5">
                        <div className="text-slate-700">Base: {formatCurrency(payroll.baseWage)}</div>
                        {Number(payroll.overtimePay) > 0 && (
                          <div className="text-amber-700">OT: +{formatCurrency(payroll.overtimePay)}</div>
                        )}
                        {Number(payroll.bonus) > 0 && (
                          <div className="text-emerald-700">Bonus: +{formatCurrency(payroll.bonus)}</div>
                        )}
                        {Number(payroll.deductions) > 0 && (
                          <div className="text-rose-600">Ded: -{formatCurrency(payroll.deductions)}</div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">
                        {formatCurrency(payroll.netPayable)}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            payroll.paymentStatus === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20'
                              : 'bg-amber-50 text-amber-700 ring-1 ring-amber-500/20'
                          }`}
                        >
                          {payroll.paymentStatus === 'Paid' && <CheckCircle2 className="h-3 w-3" />}
                          {payroll.paymentStatus}
                        </span>
                        {payroll.paymentMethod && (
                          <div className="text-[11px] text-slate-500">
                            via {payroll.paymentMethod}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {payroll.paymentStatus === 'Pending' && (
                          <button
                            onClick={() => handleOpenPayModal(payroll)}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow-xs"
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                            Pay
                          </button>
                        )}
                        <button
                          onClick={() => setViewingSlip(payroll)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          title="View / Print Salary Slip"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingPayroll(payroll)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          title="Delete Slip"
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

      {/* Generate Payroll Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">Automated Wage Computation</h2>
              </div>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {modalError}
              </div>
            )}

            <form onSubmit={handleGeneratePayroll} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Wage Period (Month) *</label>
                <input
                  type="month"
                  required
                  value={generateData.period}
                  onChange={(e) => {
                    const p = e.target.value;
                    setGenerateData({
                      ...generateData,
                      period: p,
                      startDate: `${p}-01`,
                    });
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={generateData.startDate}
                    onChange={(e) => setGenerateData({ ...generateData, startDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">End Date *</label>
                  <input
                    type="date"
                    required
                    value={generateData.endDate}
                    onChange={(e) => setGenerateData({ ...generateData, endDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Select Worker (Optional)</label>
                <select
                  value={generateData.labourId}
                  onChange={(e) => setGenerateData({ ...generateData, labourId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">All Registered Active Labourers ({labours.length} workers)</option>
                  {labours.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.firstName} {l.lastName} ({l.trade} - ₹{l.dailyWage}/day)
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-slate-400">
                  The system scans all attendance records within the selected range and calculates regular days and overtime bonuses automatically.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                >
                  {submitting ? 'Calculating Muster...' : 'Calculate & Generate Slips'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mark As Paid Modal */}
      {payingPayroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">Record Wage Disbursement</h2>
              </div>
              <button
                onClick={() => setPayingPayroll(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs">
              <span className="text-slate-400">Worker:</span>
              <p className="font-bold text-slate-900 text-sm">
                {payingPayroll.labour
                  ? `${payingPayroll.labour.firstName} ${payingPayroll.labour.lastName}`
                  : `Labour #${payingPayroll.labourId}`}
              </p>
              <div className="mt-1 flex justify-between text-slate-600 font-semibold">
                <span>Period: {payingPayroll.period}</span>
                <span className="text-emerald-700">Net: {formatCurrency(payingPayroll.netPayable)}</span>
              </div>
            </div>

            {modalError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {modalError}
              </div>
            )}

            <form onSubmit={handleConfirmPayment} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Payment Channel / Mode *</label>
                <select
                  value={payData.paymentMethod}
                  onChange={(e) => setPayData({ ...payData, paymentMethod: e.target.value as PaymentMethod })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                >
                  <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT / IMPS)</option>
                  <option value="Cash">Cash at Site Counter</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Disbursement Date *</label>
                <input
                  type="date"
                  required
                  value={payData.paymentDate}
                  onChange={(e) => setPayData({ ...payData, paymentDate: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Extra Bonus (₹)</label>
                  <input
                    type="number"
                    value={payData.bonus}
                    onChange={(e) => setPayData({ ...payData, bonus: parseFloat(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Deduction (₹)</label>
                  <input
                    type="number"
                    value={payData.deductions}
                    onChange={(e) => setPayData({ ...payData, deductions: parseFloat(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Transaction ID / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. UTR #8237492193"
                  value={payData.notes}
                  onChange={(e) => setPayData({ ...payData, notes: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setPayingPayroll(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50"
                >
                  {submitting ? 'Confirming...' : 'Mark as Paid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPayroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">Delete Payroll Slip</h3>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to remove this payroll record for{' '}
              <span className="font-semibold text-slate-800">
                {deletingPayroll.labour?.firstName} ({deletingPayroll.period})
              </span>
              ?
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingPayroll(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePayroll}
                disabled={submitting}
                className="rounded-xl bg-rose-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 disabled:opacity-50"
              >
                {submitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Payslip Modal */}
      <SlipModal payroll={viewingSlip} onClose={() => setViewingSlip(null)} />
    </div>
  );
};
