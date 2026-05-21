import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { GraduationCap, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setApiError('');
    setLoading(true);
    try {
      const loggedUser = await login(data.email, data.password);
      // Route based on role
      if (loggedUser.role === 'admin' || loggedUser.role === 'coordinator' || loggedUser.role === 'recruiter' || loggedUser.role === 'student') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setApiError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Left Banner Pane */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-primary-950 via-primary-900 to-primary-800 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle grid and glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(58,129,173,0.15),transparent_50%)]"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-700/20 rounded-full blur-3xl"></div>
        
        {/* Logo Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2.5 bg-primary-800 rounded-xl text-white">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl tracking-tight">Smart Campus</h2>
            <p className="text-[10px] text-primary-400 font-bold uppercase tracking-wider">Placement Network</p>
          </div>
        </div>

        {/* Mid Quote Section */}
        <div className="my-auto relative z-10 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-800/40 border border-primary-700/50 text-xs text-primary-300 font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-accent-500" />
            <span>Automated & Integrated in 2026</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            Student Placement Portal
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Your Future. Our Priority. Land top offers, streamline recruitment pipelines, schedule boards, and inspect statistics in real-time.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-xs text-slate-500">© 2026 Student Placement Portal. All rights reserved.</p>
        </div>
      </div>

      {/* Right Login Pane */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md bg-white dark:bg-[#1e293b] border border-slate-200/50 dark:border-slate-800/50 p-8 sm:p-10 rounded-3xl shadow-lg relative">
          
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold tracking-tight">Welcome Back!</h2>
            <p className="text-xs text-slate-400 mt-1.5">Login to your account to continue</p>
          </div>

          {apiError && (
            <div className="p-4 mb-6 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Username / Email</label>
              <input
                type="email"
                placeholder="student@college.com, recruiter@company.com"
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500'} focus:outline-none focus:ring-2 text-sm transition-all`}
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                })}
              />
              {errors.email && <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.email.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500'} focus:outline-none focus:ring-2 text-sm transition-all`}
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.password.message}</span>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500" />
                <span className="text-xs text-slate-400 font-semibold">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => alert('Check the demo credentials on the registration page or login as recruiter@company.com / student@college.com / coordinator@college.com / admin@college.com (password: recruiter123, student123, admin123).')}
                className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold rounded-xl shadow-lg shadow-primary-600/10 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Login'
              )}
            </button>
          </form>



          <div className="mt-8 text-center text-xs">
            <span className="text-slate-400">Don't have an account? </span>
            <Link to="/register" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
              Register here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
