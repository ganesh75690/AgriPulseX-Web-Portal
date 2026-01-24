import React, { useState } from 'react';
import {
  LayoutDashboard,
  AlertTriangle,
  BarChart3,
  Eye,
  Network,
  Camera,
  Zap,
  FileText, 
  User, 
  HelpCircle,
  Shield,
  LogOut,
  Truck,
  Trophy,
  Activity,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Sparkles
} from 'lucide-react';
import LogoutDialog from './LogoutDialog';
import NotificationsPage from './NotificationsPage';
import '../styles/transitions.css';

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
  userRole?: 'officer' | 'field-employee';
}

export default function Layout({ children, currentPage, onNavigate, officerData, lastLogin, onLogout, userRole }: LayoutProps) {
  console.log('Layout userRole:', userRole); // Debug line
  console.log('Layout officerData:', officerData); // Debug line
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Report Submitted Successfully',
      message: 'Your disease report from Rampur has been submitted and is under review.',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'High Fatigue Alert',
      message: 'Shivpuri village shows high containment fatigue (81/100). Immediate attention required.',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'System Update',
      message: 'New disease detection model deployed with 95% accuracy improvement.',
      time: '3 hours ago',
      read: true
    },
    {
      id: 4,
      type: 'alert',
      title: 'Urgent: Outbreak Detected',
      message: 'Multiple cases reported in Biharipur district. Containment protocols activated.',
      time: '6 hours ago',
      read: false
    },
    {
      id: 5,
      type: 'success',
      title: 'Reward Earned',
      message: 'You earned 50 points for accurate disease reporting. Keep up the good work!',
      time: '1 day ago',
      read: true
    },
    {
      id: 6,
      type: 'info',
      title: 'Training Session Scheduled',
      message: 'Advanced disease identification training scheduled for next week.',
      time: '2 days ago',
      read: true
    },
    {
      id: 7,
      type: 'warning',
      title: 'Supply Chain Disruption',
      message: 'Transport delays expected on Route 42 due to weather conditions.',
      time: '3 days ago',
      read: true
    },
    {
      id: 8,
      type: 'success',
      title: 'Report Approved',
      message: 'Your report from Kheda village has been approved.',
      time: '4 days ago',
      read: true
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  if (currentPage === 'welcome') {
    return <>{children}</>;
  }

  if (currentPage === 'notifications') {
    return (
      <div className="min-h-screen bg-gray-50">
        <NotificationsPage onBack={() => onNavigate('dashboard')} />
      </div>
    );
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

  const officerNavItems = [
    { id: 'dashboard', label: ' Dashboard', icon: LayoutDashboard },
    { id: 'containment', label: 'Containment Control', icon: AlertTriangle },
    { id: 'containment-simulator', label: 'Impact Simulator', icon: BarChart3, optional: true },
    { id: 'fatigue-monitor', label: 'Fatigue Monitor', icon: Activity },
    { id: 'visual', label: 'Visual Intelligence', icon: Eye },
    { id: 'supply-chain', label: 'Supply Chain Monitor', icon: Network },
    { id: 'enhanced-image-detection', label: 'Enhanced Analysis', icon: Zap, optional: true },
    { id: 'reports', label: 'Reports & History', icon: FileText },
    { id: 'ai-guide', label: 'AI Guide', icon: Sparkles },
    { id: 'profile', label: 'Officer Profile', icon: User }
  ];

  const fieldEmployeeNavItems = [
    { id: 'field-dashboard', label: 'Field Dashboard', icon: LayoutDashboard },
    { id: 'report-submission', label: 'Submit Report', icon: Camera },
    { id: 'my-reports', label: 'My Reports', icon: FileText },
    { id: 'rewards', label: '🏆 Rewards System', icon: Trophy },
    { id: 'transport-advisory', label: 'Transport Advisory', icon: Truck },
    { id: 'help-support', label: 'Help & Support', icon: HelpCircle },
    { id: 'profile', label: 'My Profile', icon: User }
  ];

  const navItems = userRole === 'field-employee' ? fieldEmployeeNavItems : officerNavItems;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Top Bar */}
      <div className="fixed top-0 right-0 left-72 z-40 bg-red-600 text-white px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Secure Session Active</span>
        </div>
        
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-white/10 rounded-lg transition-colors group"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-white group-hover:text-yellow-300 transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
          
          {/* Enhanced Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900">Notifications</h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{unreadCount} unread</span>
                  <span className="mx-2">•</span>
                  <span>{notifications.length - unreadCount} read</span>
                </div>
              </div>
              
              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500">No notifications</p>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => {
                        markAsRead(notification.id);
                        setShowNotifications(false);
                      }}
                      className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notification.type === 'success' ? 'bg-green-100' :
                          notification.type === 'warning' ? 'bg-yellow-100' :
                          notification.type === 'alert' ? 'bg-red-100' :
                          'bg-blue-100'
                        }`}>
                          {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                          {notification.type === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-600" />}
                          {notification.type === 'alert' && <AlertCircle className="w-4 h-4 text-red-600" />}
                          {notification.type === 'info' && <Info className="w-4 h-4 text-blue-600" />}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`text-sm font-medium text-gray-900 ${
                              !notification.read ? 'font-semibold' : ''
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Footer */}
              {notifications.length > 5 && (
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                  <button 
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('notifications');
                    }}
                    className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium py-2"
                  >
                    View all {notifications.length} notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowNotifications(false)}
        />
      )}

      {/* Sidebar */}
      <aside className="w-72 text-white flex flex-col fixed h-screen" style={{
        backgroundColor: userRole === 'field-employee' ? '#60A5FA' : '#2f9d58'
      }}>
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-xl tracking-tight">AgriPulseX</h1>
              <p className="text-xs text-white/60 mt-0.5">
                {userRole === 'field-employee' ? 'Field Reporting System' : 'Decision Intelligence System'}
              </p>
            </div>
          </div>
        </div>

        {/* Officer Info Card */}
        <div className={`p-6 m-4 rounded border ${
          userRole === 'field-employee' 
            ? 'bg-green-600/20 border-green-400/30' 
            : 'bg-white/5 border-white/10'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              userRole === 'field-employee' 
                ? 'bg-emerald-500/30 border-2 border-emerald-400' 
                : 'bg-white/10'
            }`}>
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{officerData.name}</p>
              <p className="text-xs text-white/60 mt-0.5 truncate">{officerData.designation}</p>
              <p className="text-xs text-white/50 mt-1 truncate">{officerData.region}</p>
              <p className="text-xs text-white/40 mt-1">
                Role: <span className="text-white/60">{userRole === 'field-employee' ? 'Field Employee' : 'Government Officer'}</span>
              </p>
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200 sidebar-item ${
                  isActive
                    ? userRole === 'field-employee' 
                      ? 'bg-teal-500 text-white shadow-lg' 
                      : 'bg-blue-600 text-white'
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
      <main className={`flex-1 ml-72 pt-16 pl-6 ${
        userRole === 'field-employee' 
          ? 'bg-gradient-to-br from-green-100 via-amber-100 to-emerald-100' 
          : 'bg-white'
      }`}>
        {children}
      </main>
    </div>
  );
}
