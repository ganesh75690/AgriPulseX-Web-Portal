import React from 'react';
import { LayoutDashboard, AlertTriangle, FileText, User, Shield, Eye, Camera, TrendingUp, Network, BarChart3, MapPin } from 'lucide-react';
import LogoutDialog from './LogoutDialog';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: any) => void;
  officerData: {
    name: string;
    designation: string;
    region: string;
  };
  lastLogin: Date | null;
  onLogout: () => void;
}

export default function Layout({ children, currentPage, onNavigate, officerData, lastLogin, onLogout }: LayoutProps) {
  if (currentPage === 'welcome') {
    return <>{children}</>;
  }

  const formatLastLogin = (date: Date | null) => {
    if (!date) return 'N/A';
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const navItems = [
    { id: 'dashboard', label: ' Dashboard', icon: LayoutDashboard },
    { id: 'containment', label: 'Containment Control', icon: AlertTriangle },
    { id: 'containment-simulator', label: 'Impact Simulator', icon: BarChart3, optional: true },
    { id: 'visual', label: 'Visual Intelligence', icon: Eye },
    { id: 'supply-chain', label: 'Supply Chain Monitor', icon: Network },
    { id: 'image-detection', label: 'Image Detection', icon: Camera, optional: true },
    { id: 'reports', label: 'Reports & History', icon: FileText },
    { id: 'profile', label: 'Officer Profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Top Bar */}
      <div className="fixed top-0 right-0 left-72 z-40 bg-red-600 text-white px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Secure Session Active</span>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-72 bg-[#2f9d58] text-white flex flex-col fixed h-screen">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-xl tracking-tight">AgriPulseX</h1>
              <p className="text-xs text-white/60 mt-0.5">Decision Intelligence System</p>
            </div>
          </div>
        </div>

        {/* Officer Info Card */}
        <div className="p-6 bg-white/5 m-4 rounded border border-white/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{officerData.name}</p>
              <p className="text-xs text-white/60 mt-0.5 truncate">{officerData.designation}</p>
              <p className="text-xs text-white/50 mt-1 truncate">{officerData.region}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-xs text-white/50">Last Login</p>
            <p className="text-xs text-white/70 mt-0.5">{formatLastLogin(lastLogin)}</p>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-300/80">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-300/80"></div>
            <span>Actions are logged for audit</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/40 text-center">
            Ministry of Agriculture &<br />Farmers Welfare
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 pt-16 pl-6 bg-white">
        {children}
      </main>
    </div>
  );
}
