import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Award, 
  Building2, 
  Users2, 
  TrendingUp, 
  Sparkles,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

const Landing = () => {
  const stats = [
    { label: 'Highest Package', value: '44.0 LPA', sub: 'Microsoft SDE', icon: Sparkles },
    { label: 'Average Package', value: '8.5 LPA', sub: '2026 Batch', icon: TrendingUp },
    { label: 'Total Placed', value: '94.2%', sub: 'CSE/IT Branches', icon: Award },
    { label: 'Top Recruiters', value: '120+', sub: 'Global Companies', icon: Building2 }
  ];

  const processSteps = [
    { step: '01', title: 'Profile Registration', desc: 'Students register and build their detailed profiles highlighting skills, CGPA, and resume.' },
    { step: '02', title: 'Eligibility Matching', desc: 'Our portal automatically matches student profiles against recruiter criteria for incoming drives.' },
    { step: '03', title: 'Application & Shortlist', desc: 'One-click application followed by automatic shortlists based on recruiter-defined thresholds.' },
    { step: '04', title: 'Interviews & Selection', desc: 'Schedule and manage online/offline interviews with real-time coordinator coordination.' }
  ];

  const recruiters = [
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'TCS', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg' },
    { name: 'Infosys', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg' },
    { name: 'Deloitte', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg' }
  ];

  const stories = [
    { name: 'Rahul Kumar', branch: 'CSE', package: '44 LPA', company: 'Microsoft', quote: 'The portal made it extremely easy to apply and track my interviews. The analytics dashboard kept me motivated.', avatar: 'R' },
    { name: 'Sneha Patel', branch: 'IT', package: '32 LPA', company: 'Amazon', quote: 'I was matched instantly with jobs that fit my profile. The one-click application process was incredibly smooth.', avatar: 'S' }
  ];

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
            <Link to="/" className="text-primary-600 dark:text-primary-400">Home</Link>
            <Link to="/about" className="hover:text-primary-600 dark:hover:text-primary-400">About</Link>
            <Link to="/contact" className="hover:text-primary-600 dark:hover:text-primary-400">Contact</Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login" className="px-4 py-2 text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Log In
            </Link>
            <Link to="/register" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium shadow-md shadow-primary-900/10 hover:shadow-primary-900/20 hover:scale-[1.02] transition-all">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-8 relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/40 border border-primary-200/50 dark:border-primary-800/40 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-4 h-4 text-accent-500" />
            <span>Powering College Placements for the Class of 2026</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary-900 via-primary-700 to-primary-800 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            Your Future. Our Priority.<br />
            <span className="bg-gradient-to-r from-accent-500 to-amber-600 bg-clip-text text-transparent">Smart Placement Portal</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
            A state-of-the-art web application connecting students, recruitment coordinators, and global enterprises. Automate application pipelines, analyze branch performance, and land your dream offer.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-900/10 hover:scale-105 transition-all flex items-center justify-center gap-2">
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/about" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all flex items-center justify-center">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white dark:bg-[#131b2e] border-y border-slate-200/50 dark:border-slate-800/50 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/40 hover:border-accent-500/50 transition-all flex items-start gap-4">
                <div className="p-3 bg-accent-500/10 text-accent-500 rounded-xl">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold tracking-tight mb-1">{s.value}</p>
                  <p className="text-sm font-semibold">{s.label}</p>
                  <p className="text-xs text-slate-400">{s.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recruiter Logos */}
      <section className="py-12 px-8 bg-slate-50 dark:bg-[#0f172a]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-8">Trusted by Global Leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 dark:opacity-75">
            {recruiters.map((r, idx) => (
              <img key={idx} src={r.logo} alt={r.name} className="h-8 max-w-[120px] object-contain dark:brightness-200" />
            ))}
          </div>
        </div>
      </section>

      {/* Placement Process Section */}
      <section className="py-20 px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Streamlined Placement Process</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">How our portal bridges the gap between campus talent and recruiter mandates.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {processSteps.map((p, idx) => (
            <div key={idx} className="relative p-6 bg-white dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/40 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <span className="absolute top-4 right-4 text-4xl font-extrabold text-accent-500/10 dark:text-accent-500/5 select-none">{p.step}</span>
              <h3 className="text-lg font-bold mb-2">{p.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-white dark:bg-[#131b2e] px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Student Success Stories</h2>
            <p className="text-slate-500 dark:text-slate-400">Read how students achieved placements at dream tech enterprises.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stories.map((s, idx) => (
              <div key={idx} className="p-8 bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/40 rounded-2xl flex flex-col justify-between">
                <p className="italic text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-medium">"{s.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {s.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{s.name}</h4>
                    <p className="text-xs text-slate-400">{s.branch} Candidate • Placed at <span className="text-accent-500 font-semibold">{s.company}</span> ({s.package})</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-500 dark:text-slate-400">Everything you need to know about navigating the placement portal.</p>
        </div>
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/40">
            <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary-500" />
              How do I upload/update my resume PDF?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Once you register and log in as a Student, navigate to the Profile section where you can paste the resume URL or input your document details. This attachment will automatically bind to your job applications.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/40">
            <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary-500" />
              What are the eligibility criteria checks?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Recruiters set minimum CGPA and branches constraints when posting drives. The portal automatically checks these fields upon application attempt and lets you know if you qualify.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/40">
            <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary-500" />
              How do coordinators verify placement statistics?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Coordinators have access to real-time Recharts dashboards showing branch-wise placement percentages, salary peaks, averages, and placement drive volumes.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] text-center px-8">
        <p className="text-xs text-slate-400">© 2026 Student Placement Portal. Built for engineering and professional institutes. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-4 text-xs font-semibold">
          <Link to="/about" className="hover:underline">About Us</Link>
          <Link to="/contact" className="hover:underline">Contact Support</Link>
          <Link to="/login" className="hover:underline">Login</Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
