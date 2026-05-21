import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { useForm } from 'react-hook-form';
import { 
  Building2, 
  Users, 
  Calendar, 
  Award, 
  PlusCircle, 
  ExternalLink,
  CheckCircle,
  XCircle,
  FileCheck,
  Video
} from 'lucide-react';

const RecruiterDashboard = ({ initialTab }) => {
  const { user } = useAuth();
  const [drives, setDrives] = useState([]);
  const [selectedDriveId, setSelectedDriveId] = useState('');
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab || 'applicants'); // applicants, schedule, offers, post-drive
  const [loading, setLoading] = useState(true);

  // Forms
  const { register: registerInterview, handleSubmit: handleInterviewSubmit, reset: resetInterview } = useForm();
  const { register: registerOffer, handleSubmit: handleOfferSubmit, reset: resetOffer } = useForm();
  const { register: registerDrive, handleSubmit: handleDriveSubmit, reset: resetDrive } = useForm();

  const fetchRecruiterData = async () => {
    try {
      setLoading(true);
      // Fetch drives posted by this recruiter's company
      const drivesList = await api.get('/jobs');
      const filteredDrives = drivesList.filter(d => d.companyId?._id === user.companyId?._id);
      setDrives(filteredDrives);
      
      if (filteredDrives.length > 0) {
        const initialDriveId = filteredDrives[0]._id;
        setSelectedDriveId(initialDriveId);
        // Fetch applications for initial drive
        const apps = await api.get(`/applications/drive/${initialDriveId}`);
        setApplications(apps);
      }
    } catch (error) {
      console.error('Error fetching recruiter data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.companyId) {
      fetchRecruiterData();
    }
  }, [user]);

  // Fetch applications when drive dropdown changes
  const handleDriveChange = async (driveId) => {
    setSelectedDriveId(driveId);
    try {
      const apps = await api.get(`/applications/drive/${driveId}`);
      setApplications(apps);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  // Update applicant status (Shortlist/Reject)
  const updateStatus = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus });
      alert(`Applicant status updated to ${newStatus}`);
      // Refresh applications list
      handleDriveChange(selectedDriveId);
    } catch (error) {
      alert(error.message || 'Failed to update status');
    }
  };

  // Schedule interview handler
  const scheduleInterview = async (data) => {
    try {
      const payload = {
        studentId: data.studentId,
        driveId: selectedDriveId,
        interviewDate: data.interviewDate,
        mode: data.mode,
        meetingLink: data.meetingLink,
        round: data.round
      };

      await api.post('/interviews', payload);
      alert('Interview Scheduled successfully! (Invites dispatched via Email.js mock)');
      resetInterview();
      handleDriveChange(selectedDriveId);
    } catch (error) {
      alert(error.message || 'Failed to schedule interview');
    }
  };

  // Release offer handler
  const releaseOffer = async (data) => {
    try {
      const payload = {
        studentId: data.studentId,
        driveId: selectedDriveId,
        package: Number(data.package),
        offerLetter: data.offerLetter,
        joiningDate: data.joiningDate
      };

      await api.post('/offers', payload);
      alert('Offer letter released successfully! (Candidate notified via Email.js mock)');
      resetOffer();
      handleDriveChange(selectedDriveId);
    } catch (error) {
      alert(error.message || 'Failed to release offer');
    }
  };

  // Create job drive directly
  const createDrive = async (data) => {
    try {
      const branchesArray = data.branches ? data.branches.split(',').map(b => b.trim()) : [];
      const payload = {
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
      alert('Recruitment drive posted successfully!');
      resetDrive();
      fetchRecruiterData();
      setActiveTab('applicants');
    } catch (error) {
      alert(error.message || 'Failed to post drive');
    }
  };

  const defaultDrives = [
    { _id: 'rd1', role: 'Software Development Engineer', jobType: 'Full Time', companyId: { _id: 'comp1', companyName: 'Google' }, package: 32.5, location: 'Bangalore', eligibility: { cgpa: 8.5 }, deadline: new Date(Date.now() + 86400000 * 5).toISOString() },
    { _id: 'rd2', role: 'Data Analyst Intern', jobType: 'Internship', companyId: { _id: 'comp1', companyName: 'Google' }, package: 12.0, location: 'Hyderabad', eligibility: { cgpa: 7.5 }, deadline: new Date(Date.now() + 86400000 * 10).toISOString() }
  ];

  const defaultApplications = [
    { _id: 'ra1', studentId: { _id: 's1', name: 'Rahul Kumar', email: 'student@gmail.com', branch: 'Computer Engineering', cgpa: 9.00 }, status: 'Shortlisted', appliedAt: new Date().toISOString() },
    { _id: 'ra2', studentId: { _id: 's2', name: 'Sneha Sharma', email: 'sneha.sharma@gmail.com', branch: 'Information Technology', cgpa: 9.20 }, status: 'Applied', appliedAt: new Date(Date.now() - 86400000).toISOString() },
    { _id: 'ra3', studentId: { _id: 's3', name: 'Amit Patel', email: 'amit.patel@gmail.com', branch: 'Electronics', cgpa: 8.10 }, status: 'Applied', appliedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { _id: 'ra4', studentId: { _id: 's4', name: 'Priya Nair', email: 'priya.nair@gmail.com', branch: 'Computer Engineering', cgpa: 8.75 }, status: 'Interview Scheduled', appliedAt: new Date(Date.now() - 86400000 * 3).toISOString() }
  ];

  const displayDrives = drives.length > 0 ? drives : defaultDrives;
  const displayApps = applications.length > 0 ? applications : defaultApplications;
  const displayCompanyName = user.companyId?.companyName || 'Google India Pvt. Ltd.';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Recruiter Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Manage drives and applicant selection pipelines for <span className="font-extrabold text-primary-600 dark:text-primary-400">{displayCompanyName}</span>.</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('applicants')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${activeTab === 'applicants' ? 'bg-white dark:bg-[#1e293b] shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}
          >
            Applicants Shortlist
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${activeTab === 'schedule' ? 'bg-white dark:bg-[#1e293b] shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}
          >
            Schedule Interview
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${activeTab === 'offers' ? 'bg-white dark:bg-[#1e293b] shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}
          >
            Release Offer
          </button>
          <button
            onClick={() => setActiveTab('post-drive')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${activeTab === 'post-drive' ? 'bg-white dark:bg-[#1e293b] shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}
          >
            Post Drive
          </button>
        </div>
      </div>

      {/* Select Job Drive Dropdown */}
      {activeTab !== 'post-drive' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-sm">Select recruitment drive</h3>
            <p className="text-[10px] text-slate-400">View applicants and schedule procedures per vacancy role</p>
          </div>
          <select
            className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-64"
            value={selectedDriveId}
            onChange={(e) => handleDriveChange(e.target.value)}
          >
            {displayDrives.map(d => (
              <option key={d._id} value={d._id}>{d.role} ({d.jobType})</option>
            ))}
          </select>
        </div>
      )}

      {/* Tab CONTENT: Applicants */}
      {activeTab === 'applicants' && (
        <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm p-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-sm">Applications Submitted</h3>
            <span className="text-xs px-2.5 py-1 bg-primary-100 dark:bg-primary-950/40 text-primary-600 rounded-full font-bold">
              {displayApps.length} Candidates
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-4">Candidate Details</th>
                  <th className="py-4 px-4">Branch & CGPA</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-center">Resume</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 font-medium">
                {displayApps.length > 0 ? (
                  displayApps.map(app => (
                    <tr key={app._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-800 dark:text-slate-100">{app.studentId?.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{app.studentId?.email}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p>{app.studentId?.branch}</p>
                        <p className="text-[10px] text-primary-600 dark:text-primary-400 font-bold mt-0.5">CGPA: {app.studentId?.cgpa}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 font-bold text-[10px] rounded-full inline-block ${
                          app.status === 'Selected' ? 'bg-green-500/10 text-green-500' :
                          app.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                          app.status === 'Shortlisted' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {app.studentId?.resumeUrl ? (
                          <a href={app.studentId.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary-600 hover:underline">
                            Resume
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-slate-400">Not Uploaded</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {app.status === 'Applied' && (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => updateStatus(app._id, 'Shortlisted')}
                              className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20"
                              title="Shortlist Candidate"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateStatus(app._id, 'Rejected')}
                              className="p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"
                              title="Reject Candidate"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {app.status !== 'Applied' && (
                          <span className="text-[10px] text-slate-400 font-bold">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400 text-xs">No applications submitted yet for this drive.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab CONTENT: Schedule Interview */}
      {activeTab === 'schedule' && (
        <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm p-6 max-w-lg mx-auto animate-fadeIn">
          <div className="mb-6">
            <h3 className="font-bold text-sm">Schedule Candidate Interview</h3>
            <p className="text-xs text-slate-400 mt-1">Setup meet rounds for shortlisted candidate profiles</p>
          </div>

          <form onSubmit={handleInterviewSubmit(scheduleInterview)} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Select Shortlisted Candidate</label>
              <select
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                required
                {...registerInterview('studentId')}
              >
                <option value="">Select...</option>
                {displayApps.filter(a => ['Shortlisted', 'Interview Scheduled'].includes(a.status)).map(app => (
                  <option key={app.studentId?._id} value={app.studentId?._id}>{app.studentId?.name} (CGPA: {app.studentId?.cgpa})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Interview Round</label>
                <input
                  type="text"
                  placeholder="DSA Round, System Design"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                  {...registerInterview('round')}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Interview Mode</label>
                <select
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                  {...registerInterview('mode')}
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Date & Time</label>
              <input
                type="datetime-local"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                required
                {...registerInterview('interviewDate')}
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Meeting Link / Room Venue</label>
              <input
                type="text"
                placeholder="https://meet.google.com/abc-defg-hij"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                {...registerInterview('meetingLink')}
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-900/10 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Video className="w-5 h-5" />
              Schedule Interview Invitation
            </button>
          </form>
        </div>
      )}

      {/* Tab CONTENT: Release Offers */}
      {activeTab === 'offers' && (
        <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm p-6 max-w-lg mx-auto animate-fadeIn">
          <div className="mb-6">
            <h3 className="font-bold text-sm">Release Job Offer Letter</h3>
            <p className="text-xs text-slate-400 mt-1">Release official employment packages to selected candidate profiles</p>
          </div>

          <form onSubmit={handleOfferSubmit(releaseOffer)} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Select Selected Candidate</label>
              <select
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                required
                {...registerOffer('studentId')}
              >
                <option value="">Select...</option>
                {displayApps.filter(a => ['Interview Scheduled', 'Shortlisted', 'Offer Released'].includes(a.status)).map(app => (
                  <option key={app.studentId?._id} value={app.studentId?._id}>{app.studentId?.name} (CGPA: {app.studentId?.cgpa})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Released CTC Package (LPA)</label>
              <input
                type="number"
                step="0.1"
                placeholder="15.0"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                required
                {...registerOffer('package')}
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Offer Joining Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                {...registerOffer('joiningDate')}
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Offer Letter Text / Details</label>
              <textarea
                rows="4"
                placeholder="Congratulations! You have been selected as a Software Engineer at..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm resize-none"
                required
                {...registerOffer('offerLetter')}
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-900/10 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <FileCheck className="w-5 h-5" />
              Release Employment Offer
            </button>
          </form>
        </div>
      )}

      {/* Tab CONTENT: Post Drive */}
      {activeTab === 'post-drive' && (
        <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm p-6 max-w-2xl mx-auto animate-fadeIn">
          <div className="mb-6">
            <h3 className="font-bold text-sm">Post a New recruitment drive</h3>
            <p className="text-xs text-slate-400 mt-1">Specify eligibility criteria constraints and details for candidate matching.</p>
          </div>

          <form onSubmit={handleDriveSubmit(createDrive)} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Job Role Title</label>
              <input
                type="text"
                placeholder="Software Development Engineer"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                required
                {...registerDrive('role')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Salary Package (LPA)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="12.5"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                  required
                  {...registerDrive('package')}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Job Type</label>
                <select
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                  {...registerDrive('jobType')}
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
                  {...registerDrive('cgpa')}
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-2 uppercase tracking-wider font-bold">Eligible Branches (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Computer Engineering, Information Technology"
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 text-xs"
                  {...registerDrive('branches')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Application Deadline</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                  required
                  {...registerDrive('deadline')}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Recruitment Drive Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                  required
                  {...registerDrive('driveDate')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Job Location</label>
                <input
                  type="text"
                  placeholder="Bangalore, India or Remote"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                  {...registerDrive('location')}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Requirements (New line separated)</label>
                <textarea
                  rows="2"
                  placeholder="Strong Node.js background&#10;Knowledge of React hook forms"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm resize-none"
                  {...registerDrive('requirements')}
                ></textarea>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Job Description</label>
              <textarea
                rows="3"
                placeholder="Write description about the role..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm resize-none"
                {...registerDrive('description')}
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

export default RecruiterDashboard;
