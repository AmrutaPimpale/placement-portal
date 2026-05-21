import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { GraduationCap, Briefcase, User, Mail, Lock, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

const Register = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('student'); // student, recruiter
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      cgpa: ''
    }
  });

  const onSubmit = async (data) => {
    setApiError('');
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: role,
        ...(role === 'student' && {
          branch: data.branch,
          year: Number(data.year),
          cgpa: Number(data.cgpa)
        }),
        ...(role === 'recruiter' && {
          companyName: data.companyName,
          industry: data.industry
        })
      };

      await signup(payload);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Left Banner */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-850 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(58,129,173,0.15),transparent_50%)]"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-700/20 rounded-full blur-3xl"></div>
        
        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2.5 bg-primary-800 rounded-xl text-white">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl tracking-tight">Smart Campus</h2>
            <p className="text-[10px] text-primary-400 font-bold uppercase tracking-wider">Placement Network</p>
          </div>
        </div>

        {/* Middle Banner Content */}
        <div className="my-auto relative z-10 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-800/40 border border-primary-700/50 text-xs text-primary-300 font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-accent-500" />
            <span>Join 1000+ Students & Recruiters</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            Build Your Professional Future
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Create an account to search placement drives, construct resumes, match recruiter eligibility, and track selections automatically.
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">© 2026 Student Placement Portal. All rights reserved.</p>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-lg bg-white dark:bg-[#1e293b] border border-slate-200/50 dark:border-slate-800/50 p-8 sm:p-10 rounded-3xl shadow-lg">
          
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight">Create Account</h2>
            <p className="text-xs text-slate-400 mt-1.5">Join the campus placement ecosystem</p>
          </div>



          {apiError && (
            <div className="p-4 mb-6 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Common Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Rahul Kumar"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.name.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="name@college.edu"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                  })}
                />
                {errors.email && <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.email.message}</span>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Must be at least 6 characters' }
                })}
              />
              {errors.password && <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.password.message}</span>}
            </div>

            {/* Student Specific Fields */}
            {role === 'student' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Branch</label>
                  <select 
                    className="w-full px-2 py-2 rounded-lg bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 text-xs"
                    {...register('branch', { required: 'Branch is required' })}
                  >
                    <option value="">Select...</option>
                    <option value="Computer Engineering">Computer Eng</option>
                    <option value="Information Technology">Information Tech</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Year of Study</label>
                  <select 
                    className="w-full px-2 py-2 rounded-lg bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 text-xs"
                    {...register('year', { required: 'Year is required' })}
                  >
                    <option value="">Select...</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Current CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="9.00"
                    className="w-full px-2 py-2 rounded-lg bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 text-xs"
                    {...register('cgpa', { 
                      required: 'CGPA is required',
                      min: { value: 0, message: 'Min 0' },
                      max: { value: 10, message: 'Max 10' }
                    })}
                  />
                </div>
              </div>
            )}



            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold rounded-xl shadow-lg shadow-primary-600/10 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs">
            <span className="text-slate-400">Already have an account? </span>
            <Link to="/login" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
              Log In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
