import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  UserCircle, 
  Briefcase, 
  FileText, 
  Award, 
  BarChart3, 
  Users, 
  Building2, 
  PlusCircle, 
  Calendar,
  LogOut,
  GraduationCap
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  // Navigation config based on user role
  const getNavItems = () => {
    const role = user.role;
    
    const items = {
      student: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Profile', path: '/profile', icon: UserCircle },
        { name: 'Job Drives', path: '/jobs', icon: Briefcase },
        { name: 'Applications', path: '/applications', icon: FileText },
        { name: 'My Offers', path: '/offers', icon: Award },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
      ],
      coordinator: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Manage Students', path: '/manage-students', icon: Users },
        { name: 'Create Job Drive', path: '/create-job', icon: PlusCircle },
        { name: 'All Applications', path: '/manage-applications', icon: FileText },
        { name: 'Interviews', path: '/interviews', icon: Calendar },
        { name: 'Offers Released', path: '/offers', icon: Award },
        { name: 'Placement Stats', path: '/analytics', icon: BarChart3 },
      ],
      recruiter: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Company Profile', path: '/profile', icon: Building2 },
        { name: 'Post Job Drive', path: '/create-job', icon: PlusCircle },
        { name: 'Applicants', path: '/manage-applications', icon: Users },
        { name: 'Interviews', path: '/interviews', icon: Calendar },
        { name: 'Offers Released', path: '/offers', icon: Award },
      ],
      admin: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Manage Users', path: '/manage-users', icon: Users },
        { name: 'Manage Companies', path: '/manage-companies', icon: Building2 },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
      ]
    };

    return items[role] || [];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 h-screen fixed top-0 left-0 bg-primary-950 text-slate-300 flex flex-col justify-between border-r border-slate-800 z-30 transition-transform duration-300 md:translate-x-0">
      <div>
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-primary-800 text-white rounded-lg">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-white font-bold tracking-tight text-sm">Smart Campus</h1>
            <p className="text-[10px] text-primary-400 font-semibold tracking-wider uppercase">Recruitment Portal</p>
          </div>
        </div>

        {/* User Quick Info */}
        <div className="p-6 border-b border-slate-800 bg-primary-900/30">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Signed in as</p>
          <p className="text-sm font-semibold text-white truncate">{user.name}</p>
          <p className="text-xs text-primary-400 font-medium capitalize mt-1 px-2 py-0.5 bg-primary-800/40 rounded-full inline-block">
            {user.role}
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  active 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30' 
                    : 'hover:bg-primary-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Log out section */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-red-400 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
