import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Landing from './pages/public/Landing';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Dashboard & Functional Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';
import Applications from './pages/Applications';
import Offers from './pages/Offers';
import AnalyticsPage from './pages/AnalyticsPage';
import InterviewsPage from './pages/InterviewsPage';

// Unauthorized Page
const Unauthorized = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-8 text-center text-slate-800 dark:text-slate-100">
    <h1 className="text-6xl font-black text-red-500 mb-4">403</h1>
    <h2 className="text-2xl font-bold mb-2">Access Denied / Unauthorized</h2>
    <p className="text-xs text-slate-400 max-w-sm mb-6">You do not have administrative or coordinator clearance to inspect this resource.</p>
    <a href="/dashboard" className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all">
      Return to Dashboard
    </a>
  </div>
);

// 404 Page
const NotFound = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-8 text-center text-slate-800 dark:text-slate-100">
    <h1 className="text-6xl font-black text-primary-500 mb-4">404</h1>
    <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
    <p className="text-xs text-slate-400 max-w-sm mb-6">The workspace or recruitment campaign resource you requested does not exist.</p>
    <a href="/" className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all">
      Return to Landing Page
    </a>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Core Functional Routes (Protected) */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/jobs" element={
            <ProtectedRoute allowedRoles={['student']}>
              <Jobs />
            </ProtectedRoute>
          } />
          
          <Route path="/applications" element={
            <ProtectedRoute allowedRoles={['student']}>
              <Applications />
            </ProtectedRoute>
          } />

          <Route path="/offers" element={
            <ProtectedRoute allowedRoles={['student', 'coordinator', 'recruiter']}>
              {/* Checks role inside page or translates offers */}
              <DashboardWrapper element={<Offers />} coordinatorElement={<Dashboard initialTab="offers" />} recruiterElement={<Dashboard initialTab="offers" />} />
            </ProtectedRoute>
          } />

          <Route path="/analytics" element={
            <ProtectedRoute allowedRoles={['student', 'coordinator', 'admin']}>
              <AnalyticsPage />
            </ProtectedRoute>
          } />

          <Route path="/interviews" element={
            <ProtectedRoute allowedRoles={['student', 'coordinator', 'recruiter']}>
              <InterviewsPage />
            </ProtectedRoute>
          } />

          {/* Sub-tab Dashboard Redirect Shortcuts */}
          <Route path="/manage-students" element={
            <ProtectedRoute allowedRoles={['coordinator']}>
              <Dashboard initialTab="students" />
            </ProtectedRoute>
          } />

          <Route path="/create-job" element={
            <ProtectedRoute allowedRoles={['coordinator', 'recruiter']}>
              <Dashboard initialTab="create-drive" />
            </ProtectedRoute>
          } />

          <Route path="/manage-applications" element={
            <ProtectedRoute allowedRoles={['coordinator', 'recruiter']}>
              <Dashboard initialTab="manage-applications" />
            </ProtectedRoute>
          } />

          <Route path="/manage-users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard initialTab="users" />
            </ProtectedRoute>
          } />

          <Route path="/manage-companies" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard initialTab="companies" />
            </ProtectedRoute>
          } />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Simple helper component to choose element based on user role
const DashboardWrapper = ({ element, coordinatorElement, recruiterElement }) => {
  const { user } = React.useContext(React.createContext({ user: null }));
  const savedUser = JSON.parse(localStorage.getItem('user'));
  const role = savedUser?.role;
  
  if (role === 'coordinator') return coordinatorElement;
  if (role === 'recruiter') return recruiterElement;
  return element;
};

export default App;
