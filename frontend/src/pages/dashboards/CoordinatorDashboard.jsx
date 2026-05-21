import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { useForm } from 'react-hook-form';
import { 
  Users, 
  Briefcase, 
  FileText, 
  Award, 
  Calendar, 
  PlusCircle, 
  TrendingUp, 
  CheckCircle,
  Building2,
  Trash2,
  ExternalLink
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
  Legend 
} from 'recharts';

const CoordinatorDashboard = ({ initialTab }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [drives, setDrives] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab || 'stats'); // stats, students, create-drive, applications
  const [loading, setLoading] = useState(true);

  // Form for creating job drive
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchCoordinatorData = async () => {
    try {
      setLoading(true);
      const [analyticsData, studentList, companyList, driveList] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/students'),
        api.get('/admin/companies'),
        api.get('/jobs')
      ]);

      setStats(analyticsData);
      setStudents(studentList);
      setCompanies(companyList);
      setDrives(driveList);
    } catch (error) {
      console.error('Error fetching coordinator data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoordinatorData();
  }, []);

  const handleCreateDrive = async (data) => {
    try {
      const branchesArray = data.branches ? data.branches.split(',').map(b => b.trim()) : [];
      const payload = {
        companyId: data.companyId,
        role: data.role,
        package: Number(data.package),
        cgpa: Number(data.cgpa),
        branches: branchesArray,
        deadline: data.deadline,
        driveDate: data.driveDate,
        description: data.description,
        requirements: data.requirements ? data.requirements.split('\n') : [],
        location: data.location,
        jobType: data.jobType
      };

      await api.post('/jobs', payload);
      alert('Job drive created successfully! (Registration email sent to candidates via Email.js mock)');
      reset();
      setActiveTab('stats');
      fetchCoordinatorData();
    } catch (error) {
      alert(error.message || 'Failed to create job drive');
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

  const defaultStudents = [
    { _id: 's1', name: 'Rahul Kumar', email: 'student@gmail.com', branch: 'Computer Engineering', cgpa: 9.00, isVerified: true, profileCompletion: 85 },
    { _id: 's2', name: 'Sneha Sharma', email: 'sneha.sharma@gmail.com', branch: 'Information Technology', cgpa: 9.20, isVerified: true, profileCompletion: 90 },
    { _id: 's3', name: 'Amit Patel', email: 'amit.patel@gmail.com', branch: 'Electronics', cgpa: 8.10, isVerified: false, profileCompletion: 60 },
    { _id: 's4', name: 'Priya Nair', email: 'priya.nair@gmail.com', branch: 'Computer Engineering', cgpa: 8.75, isVerified: true, profileCompletion: 75 },
    { _id: 's5', name: 'Vikram Singh', email: 'vikram.singh@gmail.com', branch: 'Mechanical', cgpa: 7.80, isVerified: false, profileCompletion: 45 }
  ];

  const defaultCompanies = [
    { _id: 'c1', companyName: 'Google', email: 'recruiter.google@gmail.com', industry: 'Technology', location: 'Bangalore' },
    { _id: 'c2', companyName: 'Microsoft', email: 'recruiter.microsoft@gmail.com', industry: 'Technology', location: 'Hyderabad' },
    { _id: 'c3', companyName: 'TCS', email: 'recruiter.tcs@gmail.com', industry: 'Consulting', location: 'Mumbai' },
    { _id: 'c4', companyName: 'Deloitte', email: 'recruiter.deloitte@gmail.com', industry: 'Consulting', location: 'Bangalore' }
  ];

  const displayStudents = students.length > 0 ? students : defaultStudents;
  const displayCompanies = companies.length > 0 ? companies : defaultCompanies;

  const COLORS = ['#3b82f6', '#f59e0b'];

  return (
    <div className="space-y-8">
      {/* Page Title & Navigation Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Placement Coordinator Console</h1>
          <p className="text-xs text-slate-400 mt-1">Verify students, build placement pipelines, inspect metrics and run recruitment schedules.</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${activeTab === 'stats' ? 'bg-white dark:bg-[#1e293b] shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}
          >
            Statistics & Charts
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${activeTab === 'students' ? 'bg-white dark:bg-[#1e293b] shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}
          >
            Manage Students
          </button>
          <button
            onClick={() => setActiveTab('create-drive')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${activeTab === 'create-drive' ? 'bg-white dark:bg-[#1e293b] shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}
          >
            Create Job Drive
          </button>
        </div>
      </div>

      {/* Tab Contents: Stats */}
      {activeTab === 'stats' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Counters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-2xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dashboardStats.counters.totalStudents}</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Students</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-accent-500/10 text-accent-500 rounded-2xl">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dashboardStats.counters.activeDrives}</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Drives</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dashboardStats.counters.totalPlaced}</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Placed Candidates</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dashboardStats.counters.averagePackage} LPA</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Average Package</p>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Branch Placement Rates */}
            <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <h3 className="font-bold text-sm mb-6">Branch-wise Placement Rate</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardStats.branchStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="branch" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="placed" name="Placed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="unplaced" name="Unplaced" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Placed vs Unplaced Pie Chart */}
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between">
              <h3 className="font-bold text-sm mb-4">Overall Student Placement Rate</h3>
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
                Total Placed: {dashboardStats.counters.totalPlaced} ({Math.round(dashboardStats.counters.totalPlaced / (dashboardStats.counters.totalPlaced + dashboardStats.counters.totalUnplaced) * 100)}%)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Monthly Placement Activity */}
            <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <h3 className="font-bold text-sm mb-6">Monthly Offer Trends</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardStats.monthlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="offersReleased" name="Offers Released" stroke="#3b82f6" strokeWidth={3} />
                    <Line type="monotone" dataKey="offersAccepted" name="Offers Accepted" stroke="#f59e0b" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Company visits counts */}
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <h3 className="font-bold text-sm mb-6">Company Visit Volume</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardStats.companyVisits} layout="vertical">
                    <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <YAxis dataKey="name" type="category" tick={{ fill: '#64748b', fontSize: 10 }} width={70} />
                    <Tooltip />
                    <Bar dataKey="visits" name="Job Drives Posted" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Contents: Manage Students */}
      {activeTab === 'students' && (
        <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm p-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-sm">Student Directory</h3>
            <span className="text-xs px-2.5 py-1 bg-primary-100 dark:bg-primary-950/40 text-primary-600 rounded-full font-bold">
              {displayStudents.length} Candidates
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-4">Student Name</th>
                  <th className="py-4 px-4">Branch</th>
                  <th className="py-4 px-4">CGPA</th>
                  <th className="py-4 px-4 text-center">Completion</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 font-medium">
                {displayStudents.length > 0 ? (
                  displayStudents.map(s => (
                    <tr key={s._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-800 dark:text-slate-100">{s.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{s.email}</p>
                      </td>
                      <td className="py-4 px-4">{s.branch || 'Not Specified'}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 font-extrabold rounded-lg">
                          {s.cgpa || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div className="bg-primary-600 h-full rounded-full" style={{ width: `${s.profileCompletion || 0}%` }}></div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">{s.profileCompletion || 0}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {s.resumeUrl ? (
                          <a href={s.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline">
                            Resume
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-slate-400">No Resume</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400 text-xs">No students registered in the directory.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Contents: Create Drive Form */}
      {activeTab === 'create-drive' && (
        <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm p-6 max-w-2xl mx-auto animate-fadeIn">
          <div className="mb-6">
            <h3 className="font-bold text-sm">Post a New Job Drive</h3>
            <p className="text-xs text-slate-400 mt-1">Specify eligibility criteria constraints and details for candidate matching.</p>
          </div>

          <form onSubmit={handleSubmit(handleCreateDrive)} className="space-y-4 text-xs font-semibold">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Select Recruiter Company</label>
                <select
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                  {...register('companyId', { required: 'Company is required' })}
                >
                  <option value="">Select...</option>
                  {displayCompanies.map(c => (
                    <option key={c._id} value={c._id}>{c.companyName}</option>
                  ))}
                </select>
                {errors.companyId && <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.companyId.message}</span>}
              </div>

              <div>
                <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Job Role Title</label>
                <input
                  type="text"
                  placeholder="Software Development Engineer"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                  {...register('role', { required: 'Role is required' })}
                />
                {errors.role && <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.role.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Salary Package (LPA)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="12.5"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                  {...register('package', { required: 'Package is required' })}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Job Type</label>
                <select
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                  {...register('jobType')}
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
              <div>
                <label className="block text-[10px] text-slate-400 mb-2 uppercase tracking-wider font-bold">Minimum CGPA Criteria</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="7.5"
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 text-xs"
                  {...register('cgpa')}
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-2 uppercase tracking-wider font-bold">Eligible Branches (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Computer Engineering, Information Technology"
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 text-xs"
                  {...register('branches')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Application Deadline</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                  {...register('deadline', { required: 'Deadline is required' })}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Recruitment Drive Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                  {...register('driveDate', { required: 'Drive date is required' })}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Job Location</label>
              <input
                type="text"
                placeholder="Bangalore, India or Remote"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                {...register('location')}
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Job Description</label>
              <textarea
                rows="3"
                placeholder="Write description about the role..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm resize-none"
                {...register('description')}
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-900/10 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Publish Job Opportunity
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CoordinatorDashboard;
