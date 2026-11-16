import React from 'react';
import type { Payroll } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { X, Printer, CheckCircle2, Building, ShieldCheck } from 'lucide-react';

interface SlipModalProps {
  payroll: Payroll | null;
  onClose: () => void;
}

export const SlipModal: React.FC<SlipModalProps> = ({ payroll, onClose }) => {
  if (!payroll) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none">
        {/* Modal Controls - hidden in print */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Official Wage Settlement Slip</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow-xs"
            >
              <Printer className="h-4 w-4" />
              Print Slip
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Body */}
        <div className="p-8 print:p-0 text-slate-800 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
                  LM
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  BUILDCON INFRASTRUCTURE & LABOUR MGMT
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Civil Contractors, Manpower Logistics & Heavy Construction Services
              </p>
              <p className="text-xs text-slate-400">Head Office: Sector 4, Metro Hub, Hyderabad</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                Payslip: #{payroll.id.toString().padStart(6, '0')}
              </span>
              <p className="text-xs text-slate-500 mt-2">Wage Period: {payroll.period}</p>
              <p className="text-xs text-slate-400">
                {formatDate(payroll.startDate)} to {formatDate(payroll.endDate)}
              </p>
            </div>
          </div>

          {/* Labour Details Grid */}
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-xs">
            <div>
              <span className="text-slate-400">Worker Name</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">
                {payroll.labour ? `${payroll.labour.firstName} ${payroll.labour.lastName}` : `Labour #${payroll.labourId}`}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Trade / Designation</span>
              <p className="font-semibold text-slate-900 mt-0.5">{payroll.labour?.trade || 'Worker'}</p>
            </div>
            <div>
              <span className="text-slate-400">Contact Number</span>
              <p className="font-semibold text-slate-700 mt-0.5">{payroll.labour?.phone || '-'}</p>
            </div>
            <div>
              <span className="text-slate-400">Base Daily Wage Rate</span>
              <p className="font-semibold text-slate-900 mt-0.5">
                {formatCurrency(payroll.labour?.dailyWage)} / day
              </p>
            </div>
          </div>

          {/* Muster Summary Bar */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="border border-slate-100 rounded-lg p-2.5">
              <span className="text-slate-400">Days Present</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">{payroll.daysPresent}</p>
            </div>
            <div className="border border-slate-100 rounded-lg p-2.5">
              <span className="text-slate-400">Half Days</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">{payroll.halfDays}</p>
            </div>
            <div className="border border-slate-100 rounded-lg p-2.5">
              <span className="text-slate-400">Total Hours</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">{payroll.totalHours} hrs</p>
            </div>
            <div className="border border-slate-100 rounded-lg p-2.5">
              <span className="text-slate-400">Overtime Hours</span>
              <p className="text-base font-bold text-amber-700 mt-0.5">{payroll.overtimeHours} hrs</p>
            </div>
          </div>

          {/* Earnings & Deductions Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200 text-xs">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="px-4 py-2.5 text-left">Earning Component</th>
                  <th className="px-4 py-2.5 text-right">Amount (₹)</th>
                  <th className="px-4 py-2.5 text-left border-l border-slate-200">Deduction Component</th>
                  <th className="px-4 py-2.5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-2 text-slate-700">Base Attendance Wage</td>
                  <td className="px-4 py-2 text-right font-semibold text-slate-900">
                    {formatCurrency(payroll.baseWage)}
                  </td>
                  <td className="px-4 py-2 text-slate-700 border-l border-slate-200">Standard Deductions / Advance</td>
                  <td className="px-4 py-2 text-right font-semibold text-rose-600">
                    {payroll.deductions > 0 ? `-${formatCurrency(payroll.deductions)}` : '₹0.00'}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-700">Overtime Compensation (1.5x)</td>
                  <td className="px-4 py-2 text-right font-semibold text-slate-900">
                    {formatCurrency(payroll.overtimePay)}
                  </td>
                  <td className="px-4 py-2 text-slate-700 border-l border-slate-200">-</td>
                  <td className="px-4 py-2 text-right text-slate-400">-</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-slate-700">Bonus / Site Allowance</td>
                  <td className="px-4 py-2 text-right font-semibold text-slate-900">
                    {formatCurrency(payroll.bonus)}
                  </td>
                  <td className="px-4 py-2 text-slate-700 border-l border-slate-200">-</td>
                  <td className="px-4 py-2 text-right text-slate-400">-</td>
                </tr>
              </tbody>
              <tfoot className="bg-indigo-50/50 border-t border-slate-200 font-bold text-slate-900">
                <tr>
                  <td className="px-4 py-3 text-indigo-950 font-bold">Total Gross Earnings</td>
                  <td className="px-4 py-3 text-right text-indigo-950 font-bold">
                    {formatCurrency(Number(payroll.baseWage) + Number(payroll.overtimePay) + Number(payroll.bonus))}
                  </td>
                  <td className="px-4 py-3 text-indigo-950 font-bold border-l border-slate-200">
                    NET PAYABLE AMOUNT
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-700 font-bold text-sm">
                    {formatCurrency(payroll.netPayable)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Status Banner */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 text-xs border border-slate-100">
            <div>
              <span className="text-slate-400">Payment Clearance Status:</span>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold ${
                    payroll.paymentStatus === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {payroll.paymentStatus === 'Paid' && <CheckCircle2 className="h-3 w-3" />}
                  {payroll.paymentStatus}
                </span>
                {payroll.paymentMethod && (
                  <span className="text-slate-600 font-medium">via {payroll.paymentMethod}</span>
                )}
                {payroll.paymentDate && (
                  <span className="text-slate-400">on {formatDate(payroll.paymentDate)}</span>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="h-10 w-28 border-b border-dashed border-slate-400 flex items-end justify-center pb-1 text-slate-400 italic">
                Authorized Signatory
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
