import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import { 
  FileText, 
  Building2, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const apps = await api.get('/applications/my-applications');
        setApplications(apps);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);
  const defaultApplications = [
    {
      _id: 'app_001',
      driveId: { _id: 'd1', role: 'Software Development Engineer', companyId: { companyName: 'Google', logo: '' }, location: 'Bangalore, India', package: '32.5' },
      status: 'Shortlisted',
      appliedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      _id: 'app_002',
      driveId: { _id: 'd2', role: 'Associate Consultant', companyId: { companyName: 'Deloitte', logo: '' }, location: 'Mumbai, India', package: '8.2' },
      status: 'Applied',
      appliedAt: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      _id: 'app_003',
      driveId: { _id: 'd3', role: 'Full Stack Developer Intern', companyId: { companyName: 'Meta', logo: '' }, location: 'Remote', package: '18.0' },
      status: 'Interview Scheduled',
      appliedAt: new Date(Date.now() - 86400000 * 8).toISOString()
    },
    {
      _id: 'app_004',
      driveId: { _id: 'd4', role: 'Data Analyst', companyId: { companyName: 'Microsoft', logo: '' }, location: 'Hyderabad, India', package: '14.5' },
      status: 'Offer Released',
      appliedAt: new Date(Date.now() - 86400000 * 12).toISOString()
    },
    {
      _id: 'app_005',
      driveId: { _id: 'd5', role: 'DevOps Engineer', companyId: { companyName: 'Amazon', logo: '' }, location: 'Bangalore, India', package: '28.0' },
      status: 'Rejected',
      appliedAt: new Date(Date.now() - 86400000 * 15).toISOString()
    }
  ];

  const displayApps = applications.length > 0 ? applications : defaultApplications;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Job Applications</h1>
          <p className="text-xs text-slate-400 mt-1">Track status verification of submitted job drive profiles</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-4 px-4">Company Details</th>
                    <th className="py-4 px-4">Applied Role</th>
                    <th className="py-4 px-4">Submission Date</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4 text-right">Reference Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 font-medium">
                  {displayApps.length > 0 ? (
                    displayApps.map(app => (
                      <tr key={app._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 border border-slate-200/50 shadow-sm overflow-hidden shrink-0">
                              {app.driveId?.companyId?.logo ? (
                                <img src={app.driveId.companyId.logo} alt={app.driveId.companyId.companyName} className="object-contain max-h-full max-w-full" />
                              ) : (
                                <Building2 className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 dark:text-slate-100">{app.driveId?.companyId?.companyName}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{app.driveId?.location || 'Remote'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-bold">{app.driveId?.role}</p>
                          <p className="text-[10px] text-accent-500 font-bold mt-0.5">{app.driveId?.package} LPA</p>
                        </td>
                        <td className="py-4 px-4 text-slate-400">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block capitalize ${
                            app.status === 'Selected' || app.status === 'Offer Released' ? 'bg-green-500/10 text-green-500' :
                            app.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                            app.status === 'Shortlisted' ? 'bg-blue-500/10 text-blue-500' :
                            'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-[10px] text-slate-400 font-mono font-bold select-all">{app._id}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-slate-400 text-xs">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        You have not submitted any job applications yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Applications;
