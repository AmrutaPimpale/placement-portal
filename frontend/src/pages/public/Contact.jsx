import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, CheckCircle, GraduationCap } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate contact form submission (Email.js mock)
    setSubmitted(true);
  };

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
            <Link to="/about" className="hover:text-primary-600 dark:hover:text-primary-400">About</Link>
            <Link to="/contact" className="text-primary-600 dark:text-primary-400">Contact</Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login" className="px-4 py-2 text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400">Log In</Link>
            <Link to="/register" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium">Register</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto pt-36 pb-20 px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h1 className="text-4xl font-extrabold mb-6 tracking-tight">Contact Support</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Need help configuring your profile, uploading templates, or posting drives? Get in touch with the college placement office.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-600/10 text-primary-600 rounded-xl">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Placement Office Email</h4>
                <p className="text-xs text-slate-400">placements@college.edu</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-600/10 text-primary-600 rounded-xl">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Support Hotline</h4>
                <p className="text-xs text-slate-400">+1 (555) 019-2834</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-600/10 text-primary-600 rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Campus Address</h4>
                <p className="text-xs text-slate-400">Block C, Academic Hub, College Campus, Landmark Road</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-3xl shadow-sm">
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Message Submitted!</h3>
              <p className="text-xs text-slate-400">We have received your request and will get back to you within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} className="mt-6 text-sm font-semibold text-primary-600 hover:underline">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Your Name</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                <input 
                  type="email" 
                  required 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Subject</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Your Message</label>
                <textarea 
                  rows="4" 
                  required 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-md shadow-primary-900/10 hover:scale-[1.01] transition-all">
                Send Support Ticket
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] text-center px-8">
        <p className="text-xs text-slate-400">© 2026 Student Placement Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Contact;
