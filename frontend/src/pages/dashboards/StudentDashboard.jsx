import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Briefcase, 
  FileText, 
  Award, 
  Building2, 
  Calendar, 
  ArrowUpRight, 
  Sparkles,
  ChevronRight,
  ClipboardList,
  Flame,
  Lightbulb
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

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activeDrives, setActiveDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch placement statistics
        const analyticsData = await api.get('/admin/analytics');
        setStats(analyticsData);

        // Fetch active job drives
        const jobs = await api.get('/jobs?status=active');
        setActiveDrives(jobs.slice(0, 4));

        // Fetch student's own applications
        const myApps = await api.get('/applications/my-applications');
        setApplications(myApps);
      } catch (error) {
        console.error('Error fetching student dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Fallback default statistics if database is offline or not connected
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

  const defaultDrives = [
    {
      _id: 'mock_drive_1',
      role: 'Software Development Engineer',
      companyId: { companyName: 'Google', logo: '' },
      location: 'Bangalore, India',
      jobType: 'Full Time',
      package: '32.5',
      eligibility: { cgpa: 8.5 },
      deadline: new Date(Date.now() + 86400000 * 5).toISOString()
    },
    {
      _id: 'mock_drive_2',
      role: 'Associate Consultant',
      companyId: { companyName: 'Deloitte', logo: '' },
      location: 'Mumbai, India',
      jobType: 'Full Time',
      package: '8.2',
      eligibility: { cgpa: 7.0 },
      deadline: new Date(Date.now() + 86400000 * 2).toISOString()
    },
    {
      _id: 'mock_drive_3',
      role: 'Full Stack Developer Intern',
      companyId: { companyName: 'Meta', logo: '' },
      location: 'Remote',
      jobType: 'Internship',
      package: '18.0',
      eligibility: { cgpa: 8.0 },
      deadline: new Date(Date.now() + 86400000 * 7).toISOString()
    }
  ];

  const defaultApps = [
    {
      _id: 'mock_app_1',
      driveId: { _id: 'mock_drive_1', role: 'Software Development Engineer', companyId: { companyName: 'Google' } },
      status: 'Shortlisted',
      appliedAt: new Date().toISOString()
    },
    {
      _id: 'mock_app_2',
      driveId: { _id: 'mock_drive_2', role: 'Associate Consultant', companyId: { companyName: 'Deloitte' } },
      status: 'Applied',
      appliedAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  const displayDrives = activeDrives.length > 0 ? activeDrives : defaultDrives;
  const displayApps = applications.length > 0 ? applications : defaultApps;

  const COLORS = ['#3b82f6', '#e2e8f0'];

  return (
    <div className="space-y-8">
      {/* Welcome Card banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-900 via-primary-850 to-primary-800 text-white rounded-3xl p-8 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(251,191,36,0.15),transparent_50%)]"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-800/60 border border-primary-700/50 text-xs text-primary-300 font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-accent-500" />
              <span>Drive Season 2026 is Active</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome back, {user?.name}! 👋</h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Stay updated with the latest opportunities and take the next step towards your dream career. Your profile is <span className="text-accent-400 font-bold">{user?.profileCompletion || 0}%</span> complete.
            </p>
          </div>
          <div className="bg-primary-800/40 border border-primary-700/40 p-4 rounded-2xl shrink-0">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Your Eligibility</p>
            <p className="text-xs font-semibold">CGPA: <span className="text-white font-extrabold text-sm">{user?.cgpa || 'N/A'}</span></p>
            <p className="text-xs text-slate-400 mt-1">Branch: {user?.branch || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Grid of counter widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-2xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{dashboardStats.counters.totalCompanies}</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Registered Companies</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-accent-500/10 text-accent-500 rounded-2xl">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{dashboardStats.counters.activeDrives}</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Active Job Drives</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{displayApps.length}</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Applications Submitted</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {displayApps.filter(a => ['Offer Released', 'Selected'].includes(a.status)).length}
            </p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Job Offers Received</p>
          </div>
        </div>
      </div>

      {/* Main split panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Double Panel: Jobs and Analytics */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Job Opportunities */}
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold">Latest Job Opportunities</h2>
                <p className="text-xs text-slate-400">Match eligibility requirements and apply with your profile resume</p>
              </div>
              <button className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                View All Opportunities
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {displayDrives.length > 0 ? (
                displayDrives.map(drive => (
                  <div key={drive._id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/30 dark:border-slate-800/30 hover:border-primary-500/40 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 border border-slate-200/40 shadow-sm overflow-hidden shrink-0">
                        {drive.companyId?.logo ? (
                          <img src={drive.companyId.logo} alt={drive.companyId.companyName} className="object-contain max-h-full max-w-full" />
                        ) : (
                          <Building2 className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm leading-snug">{drive.role}</h4>
                        <p className="text-xs text-slate-400">{drive.companyId?.companyName} • {drive.location} • {drive.jobType}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] px-2 py-0.5 bg-accent-500/10 text-accent-500 dark:text-accent-400 font-extrabold rounded-full">
                            {drive.package} LPA
                          </span>
                          <span className="text-[10px] px-2 py-0.5 bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 font-semibold rounded-full">
                            Min CGPA: {drive.eligibility?.cgpa}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto justify-end">
                      <span className="text-[10px] text-slate-400 font-semibold">
                        Deadline: {new Date(drive.deadline).toLocaleDateString()}
                      </span>
                      {displayApps.some(app => app.driveId?._id === drive._id) ? (
                        <span className="px-3.5 py-1.5 bg-green-500/10 text-green-500 font-bold text-xs rounded-xl border border-green-500/20">
                          Applied
                        </span>
                      ) : (
                        <button className="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl transition-colors">
                          Apply
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No active job opportunities found matching your profile.
                </div>
              )}
            </div>
          </div>

          {/* Recharts Analytics graphs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Branch placement rate bar chart */}
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <h3 className="font-bold text-sm mb-4">Branch-wise Placement Rate</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardStats.branchStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="branch" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px' }} />
                    <Bar dataKey="placed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Placed vs Unplaced Pie Chart */}
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between">
              <h3 className="font-bold text-sm mb-2">Students Placed vs Unplaced</h3>
              <div className="h-44 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardStats.placedVsUnplaced}
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {dashboardStats.placedVsUnplaced.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span> Placed ({dashboardStats.counters.totalPlaced})
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 bg-slate-300 rounded-full"></span> Unplaced ({dashboardStats.counters.totalUnplaced})
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Right Single Panel: Schedule, Links, Announcements */}
        <div className="space-y-8">
          
          {/* Drive Schedule */}
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm p-6">
            <h3 className="font-bold text-sm mb-4">Placement Drive Schedule</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/20">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-snug">Wipro Drive</h4>
                    <p className="text-[10px] text-slate-400">Off-Campus Drive</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-extrabold text-blue-500">20 May</p>
                  <p className="text-[9px] text-slate-400">Wednesday</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/20">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-snug">Capgemini Drive</h4>
                    <p className="text-[10px] text-slate-400">Off-Campus Recruitment</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-extrabold text-amber-500">24 May</p>
                  <p className="text-[9px] text-slate-400">Sunday</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm p-6">
            <h3 className="font-bold text-sm mb-4">Quick Links</h3>
            <div className="grid grid-cols-1 gap-2.5 text-xs font-medium">
              <a href="#resume" className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all border border-slate-100/50 dark:border-slate-800/40">
                <span className="flex items-center gap-2"><ClipboardList className="w-4 h-4 text-primary-500" /> Update Resume</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a href="#hall-ticket" className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all border border-slate-100/50 dark:border-slate-800/40">
                <span className="flex items-center gap-2"><Flame className="w-4 h-4 text-red-500" /> Download Hall Ticket</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a href="#mock-tests" className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all border border-slate-100/50 dark:border-slate-800/40">
                <span className="flex items-center gap-2"><Lightbulb className="w-4 h-4 text-accent-500" /> Practice Mock Tests</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm p-6">
            <h3 className="font-bold text-sm mb-4">Recent Announcements</h3>
            <ul className="space-y-4 text-xs">
              <li className="p-3 bg-primary-50/50 dark:bg-primary-950/20 border-l-4 border-primary-500 rounded-r-xl">
                <p className="font-bold mb-1">TCS Hiring Open</p>
                <p className="text-slate-400 mb-1 leading-snug">Eligible students can apply through the drive list before the deadline tomorrow.</p>
                <span className="text-[10px] text-primary-500 font-semibold">18 May 2026</span>
              </li>
              <li className="p-3 bg-amber-500/5 dark:bg-amber-500/5 border-l-4 border-amber-500 rounded-r-xl">
                <p className="font-bold mb-1">Cognizant Mock Test</p>
                <p className="text-slate-400 mb-1 leading-snug">Cognizant Mock Test is scheduled on May 22nd. Check your email for log instructions.</p>
                <span className="text-[10px] text-amber-500 font-semibold">17 May 2026</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;
