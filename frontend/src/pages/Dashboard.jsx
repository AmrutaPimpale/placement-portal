import React from 'react';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from './dashboards/StudentDashboard';
import CoordinatorDashboard from './dashboards/CoordinatorDashboard';
import RecruiterDashboard from './dashboards/RecruiterDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import DashboardLayout from '../layouts/DashboardLayout';

const Dashboard = ({ initialTab }) => {
  const { user } = useAuth();

  const renderDashboard = () => {
    let resolvedTab = initialTab;
    if (user?.role === 'recruiter') {
      if (initialTab === 'create-drive') resolvedTab = 'post-drive';
      if (initialTab === 'manage-applications') resolvedTab = 'applicants';
      if (initialTab === 'offers') resolvedTab = 'offers';
    }

    switch (user?.role) {
      case 'student':
        return <StudentDashboard initialTab={resolvedTab} />;
      case 'coordinator':
        return <CoordinatorDashboard initialTab={resolvedTab} />;
      case 'recruiter':
        return <RecruiterDashboard initialTab={resolvedTab} />;
      case 'admin':
        return <AdminDashboard initialTab={resolvedTab} />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-bold">Session Error</h2>
            <p className="text-xs text-slate-400 mt-2">Could not load dashboard view. Please log out and sign back in.</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
};

export default Dashboard;
