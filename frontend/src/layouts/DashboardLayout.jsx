import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-slate-100">
      {/* Side bar */}
      <Sidebar />

      {/* Header / Top Navbar */}
      <Navbar />

      {/* Page Content Panel */}
      <main className="pl-64 pt-16 min-h-screen transition-all duration-300">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
