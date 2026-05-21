import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, Compass, GraduationCap } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/70 dark:bg-[#0f172a]/70 backdrop-blur-md z-50 border-b border-slate-200/50 dark:border-slate-800/50 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-600 rounded-lg text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight">Smart Campus</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</Link>
            <Link to="/about" className="text-primary-600 dark:text-primary-400">About</Link>
            <Link to="/contact" className="hover:text-primary-600 dark:hover:text-primary-400">Contact</Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login" className="px-4 py-2 text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400">Log In</Link>
            <Link to="/register" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium">Register</Link>
          </div>
        </div>
      </nav>

      {/* Main Body */}
      <main className="max-w-4xl mx-auto pt-36 pb-20 px-8">
        <h1 className="text-4xl font-extrabold mb-6 tracking-tight">About Our Placement Portal</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
          We believe campus placement drives should be transparent, prompt, and stress-free. The Smart Campus Recruitment & Placement Portal bridges the gap between ambitious university graduates and recruiters looking for modern talent.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-200/40">
            <ShieldCheck className="w-8 h-8 text-primary-600 mb-4" />
            <h3 className="font-bold text-base mb-2">Verified Profiles</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Placement coordinators verify and review CGPAs and resume PDFs to maintain data authenticity for recruiters.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-200/40">
            <HeartHandshake className="w-8 h-8 text-accent-500 mb-4" />
            <h3 className="font-bold text-base mb-2">Seamless Coordination</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Integrated interview schedulers and status notifications keep students, recruiters, and panel members aligned.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-200/40">
            <Compass className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="font-bold text-base mb-2">Data-Driven Choices</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Rich analytics boards showing package trends and branch hire rates help departments scale curriculum offerings.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
          To build standard products that automate placement administrative workloads. By reducing repetitive manual checks, we let campus recruitment teams focus on strategic partnership activities while empowering students with immediate drive visibility.
        </p>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] text-center px-8">
        <p className="text-xs text-slate-400">© 2026 Student Placement Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;
