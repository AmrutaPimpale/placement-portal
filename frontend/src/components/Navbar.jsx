import React, { useState } from 'react';
import { Bell, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock placement notifications
  const notifications = [
    { id: 1, title: 'New Job Drive Posted', message: 'Deloitte has posted a Data Analyst job drive.', time: '2 hours ago', read: false },
    { id: 2, title: 'Interview Scheduled', message: 'Your TCS interview is scheduled for May 24th.', time: '1 day ago', read: false },
    { id: 3, title: 'Offer Released', message: 'Congratulations! Infosys has released your offer letter.', time: '2 days ago', read: true }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md fixed top-0 right-0 left-64 z-20 flex items-center justify-between px-8">
      {/* Page Search / Subtitle */}
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Campus Recruitment & Placement System (2026 Batch)
        </span>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-4">
        {/* Dark/Light mode Toggle */}
        <ThemeToggle />

        {/* Notifications Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="font-semibold text-sm">Notifications</span>
                <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">Mark all as read</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`p-4 border-b border-slate-50 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${!n.read ? 'bg-primary-50/20 dark:bg-primary-950/10' : ''}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">{n.title}</h4>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{n.message}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center">
                <button className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline">View all announcements</button>
              </div>
            </div>
          )}
        </div>

        {/* User Card */}
        {user && (
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
            <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/60 flex items-center justify-center font-bold text-primary-700 dark:text-primary-300">
              {user.name.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-medium truncate w-24 capitalize">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
