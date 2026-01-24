import React, { useState } from 'react';
import { ArrowLeft, Bell, CheckCircle, AlertCircle, Info, Trash2, RefreshCw } from 'lucide-react';

interface Notification {
  id: number;
  type: 'success' | 'warning' | 'info' | 'alert';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationsPageProps {
  onBack: () => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ onBack }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'success',
      title: 'Report Submitted Successfully',
      message: 'Your disease report from Rampur has been submitted and is under review. The assessment team will evaluate the samples within 24 hours.',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'High Fatigue Alert',
      message: 'Shivpuri village shows high containment fatigue (81/100). Immediate attention required. Consider implementing advisory-only approach.',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'System Update',
      message: 'New disease detection model deployed with 95% accuracy improvement. All existing reports will be re-processed with enhanced algorithms.',
      time: '3 hours ago',
      read: true
    },
    {
      id: 4,
      type: 'alert',
      title: 'Urgent: Outbreak Detected',
      message: 'Multiple cases reported in Biharipur district. Containment protocols activated. Field teams deployed for immediate assessment.',
      time: '6 hours ago',
      read: false
    },
    {
      id: 5,
      type: 'success',
      title: 'Reward Earned',
      message: 'You earned 50 points for accurate disease reporting. Keep up the good work! Your total points: 450.',
      time: '1 day ago',
      read: true
    },
    {
      id: 6,
      type: 'info',
      title: 'Training Session Scheduled',
      message: 'Advanced disease identification training scheduled for next week. Please confirm your attendance.',
      time: '2 days ago',
      read: true
    },
    {
      id: 7,
      type: 'warning',
      title: 'Supply Chain Disruption',
      message: 'Transport delays expected on Route 42 due to weather conditions. Alternative routes recommended.',
      time: '3 days ago',
      read: true
    },
    {
      id: 8,
      type: 'success',
      title: 'Report Approved',
      message: 'Your report from Kheda village has been approved. Containment measures will be implemented within 48 hours.',
      time: '4 days ago',
      read: true
    },
    {
      id: 9,
      type: 'alert',
      title: 'Critical: Resource Shortage',
      message: 'Medical supplies running low in Madhavpur region. Resupply team dispatched immediately.',
      time: '5 days ago',
      read: true
    },
    {
      id: 10,
      type: 'info',
      title: 'Policy Update',
      message: 'New containment guidelines issued by Ministry of Agriculture. All officers must review updated protocols.',
      time: '1 week ago',
      read: true
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const refreshNotifications = () => {
    // Simulate refresh with new notification
    const newNotification: Notification = {
      id: Date.now(),
      type: 'info',
      title: 'Notifications Refreshed',
      message: 'Latest notifications loaded successfully.',
      time: 'Just now',
      read: false
    };
    setNotifications([newNotification, ...notifications]);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const readCount = notifications.filter(n => n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-200';
      case 'warning':
        return 'bg-yellow-100 border-yellow-200';
      case 'alert':
        return 'bg-red-100 border-red-200';
      default:
        return 'bg-blue-100 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-500">
                  Total: <span className="font-semibold text-gray-900">{notifications.length}</span>
                </span>
                <span className="text-gray-500">
                  Unread: <span className="font-semibold text-blue-600">{unreadCount}</span>
                </span>
                <span className="text-gray-500">
                  Read: <span className="font-semibold text-gray-600">{readCount}</span>
                </span>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={refreshNotifications}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Refresh notifications"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={clearAllNotifications}
                  className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Clear all notifications"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Clear All</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === 'unread'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === 'read'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Read ({readCount})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {filter === 'unread' ? 'No unread notifications' : 
               filter === 'read' ? 'No read notifications' : 
               'No notifications available'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm border transition-all hover:shadow-md ${
                  !notification.read ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className={`text-base font-semibold text-gray-900 ${
                          !notification.read ? 'font-bold' : ''
                        }`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                            title="Delete notification"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {notification.time}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          notification.type === 'success' ? 'bg-green-100 text-green-800' :
                          notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          notification.type === 'alert' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
