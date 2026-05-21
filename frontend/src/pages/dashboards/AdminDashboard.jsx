import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Users, 
  Building2, 
  Trash2, 
  ShieldAlert, 
  Award, 
  Briefcase, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';

const AdminDashboard = ({ initialTab }) => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab || 'overview'); // overview, users, companies
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [analyticsData, userList, companyList] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/users'),
        api.get('/admin/companies')
      ]);

      setStats(analyticsData);
      setUsers(userList);
      setCompanies(companyList);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        alert('User deleted successfully.');
        fetchAdminData();
      } catch (error) {
        alert(error.message || 'Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const dashboardStats = stats || {
    counters: {
      totalStudents: 150,
      activeDrives: 12,
      totalPlaced: 98,
      totalUnplaced: 52,
      highestPackage: 44.0,
      averagePackage: 8.5,
      totalCompanies: 48,
      pendingInterviews: 2
    },
    branchStats: [
      { branch: 'Computer Engineering', placed: 85, unplaced: 15 },
      { branch: 'Information Technology', placed: 78, unplaced: 22 },
      { branch: 'Electronics', placed: 60, unplaced: 40 },
      { branch: 'Mechanical', placed: 45, unplaced: 55 }
    ],
    placedVsUnplaced: [
      { name: 'Placed', value: 98 },
      { name: 'Unplaced', value: 52 }
    ]
  };

  const defaultUsers = [
    { _id: 'u1', name: 'Rahul Kumar', email: 'student@gmail.com', role: 'student', branch: 'Computer Engineering' },
    { _id: 'u2', name: 'Dr. Ramesh Sharma', email: 'coordinator@college.com', role: 'coordinator', branch: 'N/A' },
    { _id: 'u3', name: 'Deepak Sen', email: 'recruiter@company.com', role: 'recruiter', companyId: { companyName: 'Google' } },
    { _id: 'u4', name: 'System Admin', email: 'admin@college.com', role: 'admin', branch: 'N/A' }
  ];

  const defaultCompanies = [
    { _id: 'c1', companyName: 'Google', email: 'recruiter.google@gmail.com', industry: 'Technology', location: 'Bangalore' },
    { _id: 'c2', companyName: 'Microsoft', email: 'recruiter.microsoft@gmail.com', industry: 'Technology', location: 'Hyderabad' },
    { _id: 'c3', companyName: 'TCS', email: 'recruiter.tcs@gmail.com', industry: 'Consulting', location: 'Mumbai' },
    { _id: 'c4', companyName: 'Deloitte', email: 'recruiter.deloitte@gmail.com', industry: 'Consulting', location: 'Bangalore' }
  ];

  const displayUsers = users.length > 0 ? users : defaultUsers;
  const displayCompanies = companies.length > 0 ? companies : defaultCompanies;

  const COLORS = ['#3b82f6', '#f59e0b'];

  return (
    <div className="space-y-8">
      {/* Top Banner Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">System Control Panel</h1>
          <p className="text-xs text-slate-400 mt-1">Manage global users, inspect recruitment drives, and configure platform settings.</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${activeTab === 'overview' ? 'bg-white dark:bg-[#1e293b] shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}
          >
            Overview & Stats
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${activeTab === 'users' ? 'bg-white dark:bg-[#1e293b] shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${activeTab === 'companies' ? 'bg-white dark:bg-[#1e293b] shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}
          >
            Manage Companies
          </button>
        </div>
      </div>

      {/* Tab CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Counters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-2xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Platform Users</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-accent-500/10 text-accent-500 rounded-2xl">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{companies.length}</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Registered Companies</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dashboardStats.counters.activeDrives}</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active recruitment drives</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dashboardStats.counters.highestPackage} LPA</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Highest Package</p>
              </div>
            </div>
          </div>

          {/* Placement Rate Graph */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <h3 className="font-bold text-sm mb-6 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-500" />
                Branch placement statistics
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardStats.branchStats}>
                    <XAxis dataKey="branch" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="placed" name="Placed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="unplaced" name="Unplaced" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Placed vs Unplaced Pie Chart */}
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between">
              <h3 className="font-bold text-sm mb-4">Overall Student Statistics</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardStats.placedVsUnplaced}
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {dashboardStats.placedVsUnplaced.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center text-xs font-semibold mt-4">
                Total Candidates: {dashboardStats.counters.totalStudents}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab CONTENT: Users Directory */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm p-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-sm">Registered Platform Users</h3>
            <span className="text-xs px-2.5 py-1 bg-primary-100 dark:bg-primary-950/40 text-primary-600 rounded-full font-bold">
              {displayUsers.length} Accounts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-4">User Details</th>
                  <th className="py-4 px-4">Email</th>
                  <th className="py-4 px-4">Role Assigned</th>
                  <th className="py-4 px-4 text-center">Company/Branch</th>
                  <th className="py-4 px-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 font-medium">
                {displayUsers.length > 0 ? (
                  displayUsers.map(u => (
                    <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-100">{u.name}</td>
                      <td className="py-4 px-4">{u.email}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block capitalize ${
                          u.role === 'admin' ? 'bg-red-500/10 text-red-500' :
                          u.role === 'coordinator' ? 'bg-purple-500/10 text-purple-500' :
                          u.role === 'recruiter' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {u.role === 'recruiter' ? (u.companyId?.companyName || 'Not Linked') : (u.branch || 'N/A')}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {u.role !== 'admin' ? (
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold flex items-center justify-end gap-1"><ShieldAlert className="w-3.5 h-3.5" /> Protected</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400 text-xs">No accounts registered in the database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab CONTENT: Companies */}
      {activeTab === 'companies' && (
        <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm p-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-sm">Recruiter Company Directory</h3>
            <span className="text-xs px-2.5 py-1 bg-primary-100 dark:bg-primary-950/40 text-primary-600 rounded-full font-bold">
              {displayCompanies.length} Corporates
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayCompanies.length > 0 ? (
              displayCompanies.map(c => (
                <div key={c._id} className="p-5 border border-slate-200/40 dark:border-slate-800/40 bg-slate-50 dark:bg-slate-900/30 rounded-2xl flex flex-col justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 border border-slate-200/50 shadow-sm overflow-hidden">
                      {c.logo ? (
                        <img src={c.logo} alt={c.companyName} className="object-contain max-h-full max-w-full" />
                      ) : (
                        <Building2 className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-snug">{c.companyName}</h4>
                      <p className="text-[10px] text-slate-400 capitalize">{c.industry || 'IT Services'}</p>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                    <p>📧 Email: {c.email}</p>
                    <p className="mt-1">👨‍💼 Manager: {c.recruiterId?.name || 'Unassigned'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-slate-400 text-xs">No company listings registered on the platform.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
