import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import { 
  Award, 
  Building2, 
  MapPin, 
  Calendar, 
  Check, 
  X, 
  AlertCircle, 
  TrendingUp, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

const Offers = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Compare tool state
  const [compareA, setCompareA] = useState('');
  const [compareB, setCompareB] = useState('');

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await api.get('/offers');
      setOffers(data);
    } catch (error) {
      console.error('Error fetching offer list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleUpdateStatus = async (offerId, newStatus) => {
    if (window.confirm(`Are you sure you want to mark this offer as ${newStatus}?`)) {
      try {
        await api.put(`/offers/${offerId}/status`, { status: newStatus });
        alert(`Offer status successfully updated to ${newStatus}.`);
        fetchOffers();
      } catch (error) {
        alert(error.message || 'Failed to update offer status.');
      }
    }
  };

  const defaultOffers = [
    {
      _id: 'offer_001',
      driveId: { _id: 'd1', role: 'Software Development Engineer' },
      companyId: { companyName: 'Google', logo: '' },
      package: 32.5,
      joiningDate: new Date(Date.now() + 86400000 * 60).toISOString(),
      releasedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      offerLetter: 'Congratulations! You have been selected as a Software Development Engineer at Google India. Your annual CTC will be ₹32.5 LPA. Please report to our Bangalore office on the joining date mentioned above.',
      status: 'Pending'
    },
    {
      _id: 'offer_002',
      driveId: { _id: 'd4', role: 'Data Analyst' },
      companyId: { companyName: 'Microsoft', logo: '' },
      package: 14.5,
      joiningDate: new Date(Date.now() + 86400000 * 45).toISOString(),
      releasedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      offerLetter: 'We are pleased to offer you the position of Data Analyst at Microsoft India Development Center, Hyderabad. Your CTC package is ₹14.5 LPA with performance bonus and stock options.',
      status: 'Accepted'
    },
    {
      _id: 'offer_003',
      driveId: { _id: 'd5', role: 'Cloud Engineer' },
      companyId: { companyName: 'Amazon', logo: '' },
      package: 28.0,
      joiningDate: new Date(Date.now() + 86400000 * 90).toISOString(),
      releasedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      offerLetter: 'Amazon Web Services is delighted to extend an offer for the Cloud Engineer role. Your total compensation package is ₹28.0 LPA including sign-on bonus and relocation assistance.',
      status: 'Pending'
    }
  ];

  const displayOffers = offers.length > 0 ? offers : defaultOffers;

  // Compare tool state mapping
  const offerA = displayOffers.find(o => o._id === compareA);
  const offerB = displayOffers.find(o => o._id === compareB);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Employment Offers</h1>
          <p className="text-xs text-slate-400 mt-1">Review released packages, compare roles side-by-side, and manage selection status</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side: Offers List */}
            <div className="lg:col-span-2 space-y-6">
              {displayOffers.length > 0 ? (
                displayOffers.map(offer => (
                  <div 
                    key={offer._id} 
                    className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4 hover:border-primary-500/30 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 border border-slate-200/40 shadow-sm overflow-hidden shrink-0">
                          {offer.companyId?.logo ? (
                            <img src={offer.companyId.logo} alt={offer.companyId.companyName} className="object-contain max-h-full max-w-full" />
                          ) : (
                            <Building2 className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm leading-snug">{offer.driveId?.role} Offer</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{offer.companyId?.companyName}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block capitalize ${
                        offer.status === 'Accepted' ? 'bg-green-500/10 text-green-500' :
                        offer.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {offer.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-[10px] text-slate-500 font-semibold border border-slate-200/20">
                      <div>
                        <p className="text-slate-400 uppercase tracking-wider mb-0.5">Package (CTC)</p>
                        <p className="text-slate-800 dark:text-slate-100 font-black text-sm">{offer.package} LPA</p>
                      </div>
                      <div>
                        <p className="text-slate-400 uppercase tracking-wider mb-0.5">Joining Date</p>
                        <p className="text-slate-800 dark:text-slate-100 font-bold">{offer.joiningDate ? new Date(offer.joiningDate).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 uppercase tracking-wider mb-0.5">Release Date</p>
                        <p className="text-slate-800 dark:text-slate-100 font-bold">{new Date(offer.releasedAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="text-xs space-y-1 font-medium bg-slate-50 dark:bg-slate-900/30 p-4 rounded-2xl">
                      <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Offer Summary details</h4>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-mono">{offer.offerLetter}</p>
                    </div>

                    {offer.status === 'Pending' && user.role === 'student' && (
                      <div className="flex gap-4 pt-2">
                        <button
                          onClick={() => handleUpdateStatus(offer._id, 'Accepted')}
                          className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-green-900/10 hover:scale-[1.01] transition-all"
                        >
                          <Check className="w-4 h-4" /> Accept Offer
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(offer._id, 'Rejected')}
                          className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-red-900/10 hover:scale-[1.01] transition-all"
                        >
                          <X className="w-4 h-4" /> Reject Offer
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white dark:bg-[#1e293b] p-12 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm text-center">
                  <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-base font-bold mb-1">No Offers Released</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">Selected applicants will receive official letters which will display here for verification.</p>
                </div>
              )}
            </div>

            {/* Right Side: Compare Tool Panel */}
            <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm p-6 space-y-6 h-fit">
              <div>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent-500" />
                  Offer Comparator Tool
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">Select and weigh two employment packages side-by-side</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-2">Select Offer A</label>
                  <select 
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none"
                    value={compareA}
                    onChange={(e) => setCompareA(e.target.value)}
                  >
                    <option value="">Choose Offer...</option>
                    {displayOffers.map(o => (
                      <option key={o._id} value={o._id}>{o.companyId?.companyName} ({o.package} LPA)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-2">Select Offer B</label>
                  <select 
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none"
                    value={compareB}
                    onChange={(e) => setCompareB(e.target.value)}
                  >
                    <option value="">Choose Offer...</option>
                    {displayOffers.map(o => (
                      <option key={o._id} value={o._id}>{o.companyId?.companyName} ({o.package} LPA)</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Side-by-Side Comparison Display Grid */}
              {offerA && offerB && (
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs font-medium">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                      <p className="text-[10px] text-slate-400">Offer A</p>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 mt-1">{offerA.companyId?.companyName}</h4>
                      <p className="text-[10px] text-accent-500 font-extrabold">{offerA.package} LPA</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                      <p className="text-[10px] text-slate-400">Offer B</p>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 mt-1">{offerB.companyId?.companyName}</h4>
                      <p className="text-[10px] text-accent-500 font-extrabold">{offerB.package} LPA</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2 text-[10px] text-slate-500 font-semibold">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-50 dark:border-slate-800/40">
                      <span>Salary Difference</span>
                      <span className="text-green-500 font-extrabold">
                        {Math.abs(offerA.package - offerB.package).toFixed(1)} LPA
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-50 dark:border-slate-800/40">
                      <span>Joining Timeline</span>
                      <span className="text-slate-800 dark:text-slate-200">
                        {offerA.joiningDate && offerB.joiningDate ? 'Both defined' : 'Undefined details'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span>Best Choice</span>
                      <span className="text-primary-600 font-extrabold flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {offerA.package >= offerB.package ? offerA.companyId?.companyName : offerB.companyId?.companyName}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Offers;
