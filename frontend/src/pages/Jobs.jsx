import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  CheckCircle,
  XCircle,
  Search,
  Filter,
  DollarSign
} from 'lucide-react';

const Jobs = () => {
  const { user } = useAuth();
  const [drives, setDrives] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [minPackage, setMinPackage] = useState('');
  
  // Modal detail state
  const [selectedDrive, setSelectedDrive] = useState(null);

  const fetchJobsData = async () => {
    try {
      setLoading(true);
      const [drivesList, apps] = await Promise.all([
        api.get('/jobs'),
        api.get('/applications/my-applications')
      ]);
      setDrives(drivesList);
      setMyApplications(apps);
    } catch (error) {
      console.error('Failed to load job drives:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsData();
  }, []);

  const handleApply = async (driveId) => {
    try {
      await api.post('/applications', { driveId });
      alert('Application submitted successfully! (Email notification sent via Email.js mock)');
      setSelectedDrive(null);
      fetchJobsData();
    } catch (error) {
      alert(error.message || 'Failed to submit application.');
    }
  };

  const defaultDrives = [
    {
      _id: 'd1',
      role: 'Software Development Engineer',
      jobType: 'Full Time',
      companyId: { companyName: 'Google', logo: '' },
      package: 32.5,
      location: 'Bangalore, India',
      driveDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
      eligibility: { cgpa: 8.5, branches: ['Computer Engineering', 'Information Technology'] },
      description: 'Design, develop, test, deploy, maintain, and improve software. Manage individual project priorities, deadlines, and deliverables.',
      requirements: ['Strong programming skills in C++, Java, or Python', 'Experience with data structures and algorithms', 'Excellent problem-solving skills']
    },
    {
      _id: 'd2',
      role: 'Associate Consultant',
      jobType: 'Full Time',
      companyId: { companyName: 'Deloitte', logo: '' },
      package: 8.2,
      location: 'Mumbai, India',
      driveDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
      eligibility: { cgpa: 7.0, branches: ['Computer Engineering', 'Information Technology', 'Electronics'] },
      description: 'Work with clients to understand their business challenges and provide technology solutions.',
      requirements: ['Good understanding of software development life cycle', 'Excellent communication skills', 'Basic SQL and database knowledge']
    },
    {
      _id: 'd3',
      role: 'Full Stack Developer Intern',
      jobType: 'Internship',
      companyId: { companyName: 'Meta', logo: '' },
      package: 18.0,
      location: 'Remote',
      driveDate: new Date(Date.now() + 86400000 * 10).toISOString(),
      deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
      eligibility: { cgpa: 8.0, branches: ['Computer Engineering'] },
      description: 'Join our team as an intern and contribute to real-world projects used by millions.',
      requirements: ['Experience with React, Node.js', 'Familiarity with web technologies', 'Passionate about learning new tools']
    },
    {
      _id: 'd4',
      role: 'Data Analyst',
      jobType: 'Full Time',
      companyId: { companyName: 'Microsoft', logo: '' },
      package: 14.5,
      location: 'Hyderabad, India',
      driveDate: new Date(Date.now() + 86400000 * 15).toISOString(),
      deadline: new Date(Date.now() + 86400000 * 12).toISOString(),
      eligibility: { cgpa: 7.5, branches: ['Computer Engineering', 'Information Technology'] },
      description: 'Analyze large datasets to extract actionable insights and help drive business decisions.',
      requirements: ['Strong SQL skills', 'Experience with PowerBI or Tableau', 'Knowledge of Python or R for data analysis']
    }
  ];

  const defaultApplications = [
    {
      _id: 'app_001',
      driveId: { _id: 'd1' }
    }
  ];

  const displayDrives = drives.length > 0 ? drives : defaultDrives;
  const displayApps = myApplications.length > 0 ? myApplications : defaultApplications;

  // Eligibility assessment helper
  const checkEligibility = (drive) => {
    if (!user) return { eligible: false, reason: 'Log in required' };

    // 1. CGPA Check
    if (drive.eligibility?.cgpa && user.cgpa < drive.eligibility.cgpa) {
      return { eligible: false, reason: `CGPA criteria is ${drive.eligibility.cgpa} (Your CGPA: ${user.cgpa})` };
    }

    // 2. Branch Check
    if (drive.eligibility?.branches && drive.eligibility.branches.length > 0) {
      const isBranchAllowed = drive.eligibility.branches.some(
        b => b.toLowerCase() === user.branch?.toLowerCase()
      );
      if (!isBranchAllowed) {
        return { eligible: false, reason: `Allowed branches: ${drive.eligibility.branches.join(', ')}` };
      }
    }

    // 3. Deadline Check
    const deadlinePassed = new Date(drive.deadline) < new Date();
    if (deadlinePassed) {
      return { eligible: false, reason: 'Application deadline has passed' };
    }

    return { eligible: true, reason: 'You meet the eligibility criteria' };
  };

  // Filter application matching
  const hasApplied = (driveId) => {
    return displayApps.some(app => app.driveId?._id === driveId);
  };

  const filteredDrives = displayDrives.filter(d => {
    const matchesSearch = d.role.toLowerCase().includes(search.toLowerCase()) || 
                          d.companyId?.companyName.toLowerCase().includes(search.toLowerCase()) ||
                          (d.location && d.location.toLowerCase().includes(search.toLowerCase()));
    const matchesPackage = minPackage ? d.package >= Number(minPackage) : true;
    return matchesSearch && matchesPackage;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Recruitment Drives</h1>
          <p className="text-xs text-slate-400 mt-1">Browse active campus hiring campaigns and view details</p>
        </div>

        {/* Filter bar */}
        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by role, company name, location..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="relative w-44">
              <DollarSign className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="number"
                placeholder="Min Salary (LPA)"
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
                value={minPackage}
                onChange={(e) => setMinPackage(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrives.length > 0 ? (
              filteredDrives.map(drive => {
                const eligibility = checkEligibility(drive);
                const applied = hasApplied(drive._id);
                return (
                  <div 
                    key={drive._id} 
                    className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 border border-slate-200/40 shadow-sm overflow-hidden shrink-0">
                          {drive.companyId?.logo ? (
                            <img src={drive.companyId.logo} alt={drive.companyId.companyName} className="object-contain max-h-full max-w-full" />
                          ) : (
                            <Building2 className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          applied ? 'bg-green-500/10 text-green-500' :
                          eligibility.eligible ? 'bg-primary-500/10 text-primary-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {applied ? 'Applied' : eligibility.eligible ? 'Eligible' : 'Ineligible'}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 line-clamp-1">{drive.role}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{drive.companyId?.companyName}</p>
                      
                      <div className="space-y-2 mt-4 text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                        <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {drive.location || 'Not Specified'}</p>
                        <p className="flex items-center gap-2"><DollarSign className="w-3.5 h-3.5 text-accent-500" /> {drive.package} LPA</p>
                        <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Drive Date: {new Date(drive.driveDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedDrive(drive)}
                      className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl text-xs font-bold transition-all text-center"
                    >
                      View Details & Apply
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-12 text-slate-400 text-xs">No recruitment drives match your query.</div>
            )}
          </div>
        )}

        {/* Detail Modal */}
        {selectedDrive && (() => {
          const eligibility = checkEligibility(selectedDrive);
          const applied = hasApplied(selectedDrive._id);
          return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#1e293b] border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative space-y-4 animate-scaleUp">
                
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 border border-slate-200/50 shadow-sm overflow-hidden shrink-0">
                      {selectedDrive.companyId?.logo ? (
                        <img src={selectedDrive.companyId.logo} alt={selectedDrive.companyId.companyName} className="object-contain max-h-full max-w-full" />
                      ) : (
                        <Building2 className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold leading-snug">{selectedDrive.role}</h2>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{selectedDrive.companyId?.companyName}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedDrive(null)}
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-[10px] text-slate-500 font-semibold border border-slate-200/20">
                  <p>📍 Location: <span className="text-slate-800 dark:text-slate-100 font-bold">{selectedDrive.location || 'Remote'}</span></p>
                  <p>💼 Job Type: <span className="text-slate-800 dark:text-slate-100 font-bold">{selectedDrive.jobType}</span></p>
                  <p>💰 Package: <span className="text-accent-500 font-bold">{selectedDrive.package} LPA</span></p>
                  <p>⏳ Apply Before: <span className="text-red-500 font-bold">{new Date(selectedDrive.deadline).toLocaleDateString()}</span></p>
                </div>

                <div className="space-y-1 text-xs">
                  <h4 className="font-extrabold text-[11px] text-slate-400 uppercase tracking-wider">Role Description</h4>
                  <p className="text-slate-500 dark:text-slate-300 leading-relaxed font-medium">{selectedDrive.description || 'No description provided.'}</p>
                </div>

                {selectedDrive.requirements && selectedDrive.requirements.length > 0 && (
                  <div className="space-y-1 text-xs">
                    <h4 className="font-extrabold text-[11px] text-slate-400 uppercase tracking-wider">Core Requirements</h4>
                    <ul className="list-disc pl-4 text-slate-500 dark:text-slate-300 space-y-0.5 font-medium">
                      {selectedDrive.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="font-extrabold text-[11px] text-slate-400 uppercase tracking-wider">Eligibility Verification</h4>
                  
                  {applied ? (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-xs flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Application submitted! You will receive Email.js scheduling status updates.</span>
                    </div>
                  ) : eligibility.eligible ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 rounded-xl text-xs flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>You meet the CGPA & branch constraints.</span>
                      </div>
                      <button
                        onClick={() => handleApply(selectedDrive._id)}
                        className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-900/10 transition-colors text-sm"
                      >
                        Submit Profile Application
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{eligibility.reason}</span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })()}

      </div>
    </DashboardLayout>
  );
};

export default Jobs;
