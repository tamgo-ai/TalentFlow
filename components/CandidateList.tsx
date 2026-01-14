import React, { useState, useMemo } from 'react';
import { Candidate, FilterState, CandidateStatus } from '../types';
import { Search, Filter, ChevronRight, Phone, Calendar, ChevronDown, SlidersHorizontal, PhoneOff, Voicemail } from 'lucide-react';

interface CandidateListProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onUpdateCandidate: (candidate: Candidate) => void;
}

export const CandidateList: React.FC<CandidateListProps> = ({ candidates, onSelectCandidate, onUpdateCandidate }) => {
  const [filters, setFilters] = useState<FilterState>({
    role: '',
    city: '',
    status: '',
    search: '',
  });

  const uniqueRoles = useMemo(() => Array.from(new Set(candidates.map(c => c.role))).filter(Boolean), [candidates]);
  const uniqueCities = useMemo(() => Array.from(new Set(candidates.map(c => c.city))).filter(Boolean), [candidates]);

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = (c.firstName + ' ' + c.lastName + c.email).toLowerCase().includes(filters.search.toLowerCase());
    const matchesRole = filters.role ? c.role === filters.role : true;
    const matchesCity = filters.city ? c.city === filters.city : true;
    const matchesStatus = filters.status ? c.status === filters.status : true;
    return matchesSearch && matchesRole && matchesCity && matchesStatus;
  });

  const handleQuickStatus = (e: React.MouseEvent, candidate: Candidate, status: CandidateStatus) => {
    e.stopPropagation(); // Prevent opening the detail view
    onUpdateCandidate({
      ...candidate,
      status: status,
      lastContactDate: new Date().toISOString()
    });
  };

  const getStatusStyle = (status: CandidateStatus) => {
    switch (status) {
      case CandidateStatus.NEW: return 'bg-slate-100 text-slate-600 border-slate-200';
      case CandidateStatus.CONTACT_ATTEMPTED: return 'bg-amber-50 text-amber-600 border-amber-100';
      case CandidateStatus.VOICEMAIL_LEFT: return 'bg-orange-50 text-orange-600 border-orange-100';
      case CandidateStatus.INTERVIEW_SCHEDULED: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case CandidateStatus.REJECTED: return 'bg-rose-50 text-rose-600 border-rose-100';
      case CandidateStatus.HIRED: return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const CustomSelect = ({ value, onChange, options, placeholder, icon: Icon }: any) => (
    <div className="relative group min-w-[160px]">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
        <Icon size={16} />
      </div>
      <select 
        className="appearance-none w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer hover:border-slate-300"
        value={value}
        onChange={onChange}
      >
        <option value="">{placeholder}</option>
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
        <ChevronDown size={14} strokeWidth={2.5} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Candidates</h2>
          <p className="text-slate-500 text-sm mt-1">Manage and track your recruitment pipeline.</p>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500">{filteredCandidates.length} results</span>
        </div>
      </div>

      {/* Modern Filter Bar */}
      <div className="bg-white p-2 rounded-2xl shadow-soft border border-slate-100 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border-none bg-transparent focus:ring-2 focus:ring-indigo-500/20 text-slate-700 placeholder:text-slate-400 font-medium focus:bg-slate-50 transition-all"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto p-1 border-t md:border-t-0 md:border-l border-slate-100">
          <CustomSelect 
            value={filters.role} 
            onChange={(e: any) => setFilters(prev => ({ ...prev, role: e.target.value }))} 
            options={uniqueRoles} 
            placeholder="All Roles"
            icon={Filter}
          />
          <CustomSelect 
            value={filters.city} 
            onChange={(e: any) => setFilters(prev => ({ ...prev, city: e.target.value }))} 
            options={uniqueCities} 
            placeholder="All Cities"
            icon={Filter}
          />
          <CustomSelect 
            value={filters.status} 
            onChange={(e: any) => setFilters(prev => ({ ...prev, status: e.target.value }))} 
            options={Object.values(CandidateStatus)} 
            placeholder="All Status"
            icon={SlidersHorizontal}
          />
        </div>
      </div>

      {/* Modern Table List */}
      <div className="space-y-3">
        {/* Header Row (Visual Only) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <div className="col-span-4">Candidate Profile</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Quick Actions</div>
            <div className="col-span-3 text-right">Last Activity</div>
        </div>

        {filteredCandidates.map((candidate) => (
            <div 
                key={candidate.id}
                onClick={() => onSelectCandidate(candidate)}
                className="group bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative overflow-hidden"
            >
                {/* Left Accent Bar on Hover */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="col-span-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-white shadow-sm shrink-0">
                        {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{candidate.firstName} {candidate.lastName}</h3>
                        <p className="text-xs text-slate-500 truncate">{candidate.role} • {candidate.city}</p>
                    </div>
                </div>

                <div className="col-span-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusStyle(candidate.status)}`}>
                        {candidate.status}
                    </span>
                </div>

                {/* Quick Actions Column */}
                <div className="col-span-3 flex items-center gap-2">
                    <button 
                        onClick={(e) => handleQuickStatus(e, candidate, CandidateStatus.CONTACT_ATTEMPTED)}
                        className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 border border-transparent transition-all"
                        title="Mark as No Answer"
                    >
                        <PhoneOff size={16} />
                    </button>
                    <button 
                        onClick={(e) => handleQuickStatus(e, candidate, CandidateStatus.VOICEMAIL_LEFT)}
                        className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 border border-transparent transition-all"
                        title="Mark as Voicemail Left"
                    >
                        <Voicemail size={16} />
                    </button>
                </div>

                <div className="col-span-3 flex items-center justify-end gap-3">
                     <div className="text-sm text-slate-500 text-right">
                        {candidate.scheduledDate ? (
                            <div className="flex items-center justify-end gap-1.5 text-emerald-600 font-medium">
                                <Calendar size={14} />
                                <span>{new Date(candidate.scheduledDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                            </div>
                        ) : candidate.lastContactDate ? (
                            <div className="flex items-center justify-end gap-1.5 text-blue-500">
                                <Phone size={14} />
                                <span>{new Date(candidate.lastContactDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                            </div>
                        ) : (
                            <span className="text-slate-300 text-xs">No activity</span>
                        )}
                     </div>
                     <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" />
                </div>
            </div>
        ))}

        {filteredCandidates.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 border-dashed">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <Search size={24} />
                </div>
                <h3 className="text-slate-900 font-semibold text-lg">No candidates found</h3>
                <p className="text-slate-500">Try adjusting your filters or search terms.</p>
            </div>
        )}
      </div>
    </div>
  );
};