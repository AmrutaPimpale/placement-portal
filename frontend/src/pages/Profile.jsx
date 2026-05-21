import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { useForm } from 'react-hook-form';
import { User, Mail, ShieldAlert, Award, FileText, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      branch: user?.branch || '',
      year: user?.year || 4,
      cgpa: user?.cgpa || 0,
      skills: user?.skills?.join(', ') || '',
      resumeUrl: user?.resumeUrl || '',
      companyName: user?.companyId?.companyName || '',
      industry: user?.companyId?.industry || '',
      companyEmail: user?.companyId?.email || '',
      companyLogo: user?.companyId?.logo || '',
      companyDesc: user?.companyId?.description || ''
    }
  });

  const onSubmit = async (data) => {
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        ...(user.role === 'student' && {
          branch: data.branch,
          year: Number(data.year),
          cgpa: Number(data.cgpa),
          skills: data.skills ? data.skills.split(',').map(s => s.trim()) : [],
          resumeUrl: data.resumeUrl
        }),
        ...(user.role === 'recruiter' && {
          companyName: data.companyName,
          industry: data.industry,
          companyEmail: data.companyEmail,
          companyLogo: data.companyLogo,
          companyDesc: data.companyDesc
        })
      };

      await updateProfile(payload);
      setSuccessMsg('Profile updated successfully! (Completion Score Recalculated)');
    } catch (error) {
      setErrorMsg(error.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Profile</h1>
          <p className="text-xs text-slate-400 mt-1">Configure profile details and manage credentials</p>
        </div>

        {successMsg && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-500 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Account Details Box */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
            <h3 className="font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-3">Basic Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                  {...register('name', { required: 'Name is required' })}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                  disabled
                  {...register('email')}
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Registered email cannot be changed.</span>
              </div>
            </div>
          </div>

          {/* Student Academic Details Box */}
          {user.role === 'student' && (
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
              <h3 className="font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-3">Academic & Resume Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Branch</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                    {...register('branch', { required: 'Branch is required' })}
                  >
                    <option value="Computer Engineering">Computer Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Year of Study</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                    {...register('year')}
                  >
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Current CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                    {...register('cgpa', { required: 'CGPA is required', min: 0, max: 10 })}
                  />
                </div>
              </div>

              <div className="text-xs font-semibold">
                <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="React.js, Node.js, Express, MongoDB, Tailwind CSS"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                  {...register('skills')}
                />
              </div>

              <div className="text-xs font-semibold">
                <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Resume PDF Link</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/your-resume-pdf-link"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                  {...register('resumeUrl', { required: 'Resume link is required for applications' })}
                />
              </div>
            </div>
          )}

          {/* Recruiter Company Details Box */}
          {user.role === 'recruiter' && (
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
              <h3 className="font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-3">Company Corporate Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Company Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                    {...register('companyName', { required: 'Company name is required' })}
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Industry Type</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                    {...register('industry')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Corporate Contact Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                    {...register('companyEmail')}
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Company Logo URL</label>
                  <input
                    type="url"
                    placeholder="https://logo.clearbit.com/microsoft.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                    {...register('companyLogo')}
                  />
                </div>
              </div>

              <div className="text-xs font-semibold">
                <label className="block text-slate-400 mb-2 uppercase tracking-wider font-bold">Company Corporate Description</label>
                <textarea
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm resize-none"
                  {...register('companyDesc')}
                ></textarea>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold rounded-xl shadow-lg shadow-primary-900/10 transition-colors text-sm flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Save Profile Configuration'
            )}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
