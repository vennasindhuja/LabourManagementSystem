import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck2,
  Building2,
  Wallet,
  HardHat,
  Database,
  Activity,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'labours' | 'attendance' | 'projects' | 'payroll';
  onSelectTab: (tab: 'dashboard' | 'labours' | 'attendance' | 'projects' | 'payroll') => void;
  workforceCount?: number;
  pendingPayrollCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  workforceCount,
  pendingPayrollCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'labours' as const,
      label: 'Workforce',
      icon: Users,
      badge: workforceCount !== undefined ? `${workforceCount}` : null,
    },
    {
      id: 'attendance' as const,
      label: 'Attendance Muster',
      icon: CalendarCheck2,
      badge: null,
    },
    {
      id: 'projects' as const,
      label: 'Job Sites & Projects',
      icon: Building2,
      badge: null,
    },
    {
      id: 'payroll' as const,
      label: 'Payroll & Wages',
      icon: Wallet,
      badge: pendingPayrollCount && pendingPayrollCount > 0 ? `${pendingPayrollCount} due` : null,
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200/80 bg-white flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white shadow-md shadow-indigo-500/20">
            <HardHat className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 tracking-tight leading-tight">BuildLabour</div>
            <div className="text-[11px] font-medium text-slate-400">Enterprise Labour ERP</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Core Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? 'bg-indigo-200 text-indigo-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Database & Stack Status Banner */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <div className="rounded-xl bg-slate-50 p-3 text-xs border border-slate-100">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Database className="h-3.5 w-3.5 text-indigo-600" />
            <span>PostgreSQL & TypeORM</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Connected & Synchronized
          </div>
          <div className="mt-2 text-[10px] text-slate-400">
            NestJS Backend: Port 5000
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-bold text-xs">
            SA
          </div>
          <div className="text-left text-xs">
            <div className="font-semibold text-slate-800">Site Administrator</div>
            <div className="text-[11px] text-slate-400">admin@buildlabour.io</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
