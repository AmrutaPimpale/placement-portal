import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import { Calendar, Video, MapPin, ExternalLink, Clock, Building2, User } from 'lucide-react';

const InterviewsPage = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        let endpoint = '/interviews';
        if (user.role === 'student') {
          endpoint = '/interviews/my-interviews';
        }
        const data = await api.get(endpoint);
        setInterviews(data);
      } catch (error) {
        console.error('Failed to load interviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Interview Calendars</h1>
          <p className="text-xs text-slate-400 mt-1">Review scheduled discussion rounds, venues, and video conferencing links</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interviews.length > 0 ? (
                interviews.map(meet => (
                  <div 
                    key={meet._id} 
                    className="p-5 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 rounded-2xl flex flex-col justify-between gap-4 hover:border-primary-500/20 transition-all"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <h4 className="font-extrabold text-sm leading-snug">{meet.round || 'Technical Round'}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{meet.driveId?.role}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          meet.mode === 'Online' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'
                        }`}>
                          {meet.mode}
                        </span>
                      </div>

                      <div className="space-y-2 mt-4 text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                        <p className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>Recruiter: {meet.driveId?.companyId?.companyName || 'Corporate Partner'}</span>
                        </p>
                        {user.role !== 'student' && (
                          <p className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>Candidate: {meet.studentId?.name} ({meet.studentId?.email})</span>
                          </p>
                        )}
                        <p className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Date: {new Date(meet.interviewDate).toLocaleString()}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      {meet.mode === 'Online' && meet.meetingLink ? (
                        <a 
                          href={meet.meetingLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary-900/10 transition-colors"
                        >
                          <Video className="w-4 h-4" />
                          Join Meeting
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <div className="flex-1 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-default">
                          <MapPin className="w-4 h-4" />
                          Venue: {meet.meetingLink || 'Campus Block A'}
                        </div>
                      )}
                    </div>

                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-slate-400 text-xs">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  No interview sessions scheduled.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InterviewsPage;
