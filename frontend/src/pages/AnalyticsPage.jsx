import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import { 
  TrendingUp, 
  Award, 
  Building2, 
  Users, 
  BarChart3, 
  PieChart as PieIcon, 
  Activity 
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
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
  Legend 
} from 'recharts';

const AnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await api.get('/admin/analytics');
        setStats(data);
      } catch (error) {
        console.error('Failed to load analytics statistics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
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
      { branch: 'Computer Engineering', placed: 85, unplaced: 15, highest: 44, average: 12 },
      { branch: 'Information Technology', placed: 78, unplaced: 22, highest: 32, average: 9.5 },
      { branch: 'Electronics', placed: 60, unplaced: 40, highest: 18, average: 7.2 },
      { branch: 'Mechanical', placed: 45, unplaced: 55, highest: 12, average: 6.0 }
    ],
    placedVsUnplaced: [
      { name: 'Placed', value: 98 },
      { name: 'Unplaced', value: 52 }
    ],
    companyVisits: [
      { name: 'TCS', visits: 5 },
      { name: 'Infosys', visits: 4 },
      { name: 'Wipro', visits: 3 },
      { name: 'Deloitte', visits: 2 }
    ],
    monthlyActivity: [
      { month: 'Jan', offersReleased: 12, offersAccepted: 8 },
      { month: 'Feb', offersReleased: 15, offersAccepted: 10 },
      { month: 'Mar', offersReleased: 22, offersAccepted: 18 },
      { month: 'Apr', offersReleased: 30, offersAccepted: 24 }
    ]
  };

  const COLORS = ['#3b82f6', '#f59e0b'];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Placement Statistics</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time reports on salary structures, branch performance, and visit trends</p>
        </div>

        {/* Counter cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{dashboardStats.counters.totalStudents}</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Registered Batch Size</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-accent-500/10 text-accent-500 rounded-2xl">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{dashboardStats.counters.totalCompanies}</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Recruiter Partners</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{dashboardStats.counters.totalPlaced}</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Candidates Placed</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{dashboardStats.counters.averagePackage} LPA</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Average Salary</p>
            </div>
          </div>
        </div>

        {/* First charts panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Branch Wise Packages compared */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            <h3 className="font-bold text-sm mb-6 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary-500" />
              Salary Package Comparison by Branch
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardStats.branchStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="branch" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="highest" name="Highest CTC (LPA)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="average" name="Average CTC (LPA)" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Placed vs Unplaced Pie */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-accent-500" />
              Placement Success Distribution
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardStats.placedVsUnplaced}
                    innerRadius={55}
                    outerRadius={80}
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
          </div>
        </div>

        {/* Second charts panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Monthly progress area chart */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            <h3 className="font-bold text-sm mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              Monthly Placement Activity Timeline
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardStats.monthlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="offersReleased" name="Released Offers" stroke="#3b82f6" fillOpacity={0.1} fill="url(#colorOffers)" />
                  <defs>
                    <linearGradient id="colorOffers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Visits chart */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            <h3 className="font-bold text-sm mb-6 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-500" />
              Top Corporate Recruiters
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardStats.companyVisits} layout="vertical">
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#64748b', fontSize: 10 }} width={70} />
                  <Tooltip />
                  <Bar dataKey="visits" name="Visits Posted" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
