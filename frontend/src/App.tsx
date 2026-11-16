import { useState, useEffect } from 'react';
import type { DashboardStats } from './types';
import { api } from './services/api';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { LaboursView } from './components/LaboursView';
import { AttendanceView } from './components/AttendanceView';
import { ProjectsView } from './components/ProjectsView';
import { PayrollView } from './components/PayrollView';
import { RefreshCw } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'labours' | 'attendance' | 'projects' | 'payroll'
  >('dashboard');

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        workforceCount={stats?.labours.total}
        pendingPayrollCount={stats?.payroll.pendingCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold capitalize text-slate-800">
              {activeTab === 'dashboard'
                ? 'Overview Dashboard'
                : activeTab === 'labours'
                ? 'Workforce Roster'
                : activeTab === 'attendance'
                ? 'Muster & Shift Log'
                : activeTab === 'projects'
                ? 'Construction Sites'
                : 'Payroll & Settlements'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchStats}
              title="Refresh Live Data"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-indigo-600 ${loadingStats ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <div className="h-4 w-px bg-slate-200" />

            <div className="text-xs text-slate-500 font-medium">
              Today: <span className="font-semibold text-slate-800">{new Date().toLocaleDateString('en-GB')}</span>
            </div>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">
            {activeTab === 'dashboard' && (
              <DashboardView
                stats={stats}
                loading={loadingStats}
                onNavigate={setActiveTab}
                onRefresh={fetchStats}
              />
            )}

            {activeTab === 'labours' && (
              <LaboursView onWorkforceUpdated={fetchStats} />
            )}

            {activeTab === 'attendance' && (
              <AttendanceView onAttendanceSaved={fetchStats} />
            )}

            {activeTab === 'projects' && (
              <ProjectsView onProjectsUpdated={fetchStats} />
            )}

            {activeTab === 'payroll' && (
              <PayrollView onPayrollUpdated={fetchStats} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
