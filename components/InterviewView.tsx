import React, { useState } from 'react';
import { Candidate, CandidateStatus, Scorecard, ScorecardItem } from '../types';
import { 
  ArrowLeft, Phone, Mail, MapPin, Briefcase, 
  Check, X, AlertCircle, Edit2, MessageSquare, ChevronDown, ChevronUp, Save
} from 'lucide-react';

interface InterviewViewProps {
  candidate: Candidate;
  onBack: () => void;
  onUpdateCandidate: (updated: Candidate) => void;
}

const EMPTY_SCORECARD: Scorecard = {
  salesExperience: { status: undefined, notes: '' },
  performanceAccountability: { status: undefined, notes: '' },
  motivationStability: { status: undefined, notes: '' },
  licensing: { status: undefined, notes: '' },
  transportation: { status: undefined, notes: '' },
  bilingual: { status: undefined, notes: '' },
  evaluationTolerance: { status: undefined, notes: '' },
  finalNotes: ''
};

export const InterviewView: React.FC<InterviewViewProps> = ({ candidate, onBack, onUpdateCandidate }) => {
  const [scorecard, setScorecard] = useState<Scorecard>(candidate.scorecard || EMPTY_SCORECARD);
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [activeNoteField, setActiveNoteField] = useState<string | null>(null);
  const [showNotes, setShowNotes] = useState(false);

  const handleStatusChange = (newStatus: CandidateStatus) => {
    const updates: Partial<Candidate> = {
      status: newStatus,
      lastContactDate: new Date().toISOString(),
      scorecard
    };

    if (newStatus === CandidateStatus.INTERVIEW_SCHEDULED && scheduleDate) {
        updates.scheduledDate = scheduleDate;
    }

    onUpdateCandidate({ ...candidate, ...updates });
  };

  const updateScorecardItem = (key: keyof Scorecard, field: 'status' | 'notes', value: any) => {
    setScorecard(prev => ({
      ...prev,
      [key]: key === 'finalNotes' ? value : {
        ...(prev[key as keyof Scorecard] as ScorecardItem),
        [field]: value
      }
    }));
  };

  const ScorecardRow = ({ label, itemKey }: { label: string, itemKey: keyof Scorecard }) => {
    const item = scorecard[itemKey] as ScorecardItem;
    const isNoteOpen = activeNoteField === itemKey;
    const hasNotes = !!item.notes;

    return (
      <div className="py-5 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors px-6 -mx-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Title */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-900">{label}</h4>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 shrink-0">
                {/* Segmented Control for Status */}
                <div className="flex p-1 bg-slate-100 rounded-lg">
                    <button 
                        onClick={() => updateScorecardItem(itemKey, 'status', 'Pass')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                            item.status === 'Pass' 
                            ? 'bg-white text-emerald-600 ring-1 ring-emerald-100 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 shadow-none'
                        }`}
                    >
                        {item.status === 'Pass' && <Check size={12} strokeWidth={3} />}
                        Pass
                    </button>
                    <button 
                         onClick={() => updateScorecardItem(itemKey, 'status', 'Concern')}
                         className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                            item.status === 'Concern' 
                            ? 'bg-white text-amber-500 ring-1 ring-amber-100 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 shadow-none'
                        }`}
                    >
                        {item.status === 'Concern' && <AlertCircle size={12} strokeWidth={3} />}
                        Concern
                    </button>
                    <button 
                         onClick={() => updateScorecardItem(itemKey, 'status', 'Fail')}
                         className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                            item.status === 'Fail' 
                            ? 'bg-white text-rose-600 ring-1 ring-rose-100 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 shadow-none'
                        }`}
                    >
                        {item.status === 'Fail' && <X size={12} strokeWidth={3} />}
                        Fail
                    </button>
                </div>

                {/* Note Trigger */}
                <button 
                    onClick={() => setActiveNoteField(isNoteOpen ? null : itemKey as string)}
                    className={`p-2 rounded-lg transition-colors border ${
                        hasNotes || isNoteOpen
                            ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                            : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600'
                    }`}
                    title="Add Notes"
                >
                    <MessageSquare size={16} />
                </button>
            </div>
        </div>

        {/* Notes Expansion */}
        {(isNoteOpen || hasNotes) && (
            <div className="mt-3 pl-0 sm:pl-0 animate-fade-in">
                 {isNoteOpen ? (
                     <div className="relative">
                        <textarea 
                            autoFocus
                            className="w-full text-sm p-3 border border-indigo-200 rounded-lg bg-indigo-50/10 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none transition-all"
                            placeholder={`Enter notes for ${label}...`}
                            value={item.notes}
                            onChange={(e) => updateScorecardItem(itemKey, 'notes', e.target.value)}
                            rows={2}
                        />
                        <div className="flex justify-end mt-2">
                             <button 
                                onClick={() => setActiveNoteField(null)} 
                                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md"
                             >
                                <Save size={12} /> Save Note
                             </button>
                        </div>
                     </div>
                 ) : (
                     <div 
                        onClick={() => setActiveNoteField(itemKey as string)}
                        className="text-xs text-slate-600 bg-slate-50 border border-slate-100 p-3 rounded-lg cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/10 transition-all flex items-start gap-2"
                     >
                        <Edit2 size={12} className="mt-0.5 text-slate-400 shrink-0" />
                        <span className="leading-relaxed">{item.notes}</span>
                     </div>
                 )}
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto h-full overflow-y-auto pb-24">
      
      {/* Header Area - Enterprise Compact */}
      <div className="flex-none">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-6 transition-colors font-bold text-xs uppercase tracking-wider group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to list
        </button>
        
        <div className="bg-white px-8 py-6 rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-200">
                {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{candidate.firstName} {candidate.lastName}</h1>
                
                {/* Enterprise Meta Row */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 mt-2">
                    <span className="flex items-center gap-2 font-medium text-indigo-600 bg-indigo-50/50 px-2 py-1 rounded">
                        <Briefcase size={14} /> {candidate.role}
                    </span>
                    <span className="flex items-center gap-2 hover:text-slate-800 transition-colors select-all">
                        <Mail size={14} className="text-slate-400" /> {candidate.email}
                    </span>
                    <span className="flex items-center gap-2 hover:text-slate-800 transition-colors select-all">
                        <Phone size={14} className="text-slate-400" /> {candidate.phone}
                    </span>
                    <span className="flex items-center gap-2">
                        <MapPin size={14} className="text-slate-400" /> {candidate.city}
                    </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Accordion */}
          <div className="mt-8 pt-6 border-t border-slate-100">
             <button 
                onClick={() => setShowNotes(!showNotes)}
                className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-indigo-600 transition-colors"
             >
                <MessageSquare size={14} />
                {showNotes ? 'Hide Application Notes' : 'View Application Notes'}
                {showNotes ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
             </button>
             {showNotes && (
                 <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed animate-fade-in">
                    {candidate.initialNotes || "No notes available."}
                 </div>
             )}
          </div>
        </div>
      </div>

      {/* Main Content - Enterprise List */}
      <div className="bg-white rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
         <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
             <h2 className="font-bold text-slate-900 text-sm tracking-wide uppercase flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                Evaluation Criteria
             </h2>
             <span className="text-xs font-medium text-slate-400">Scorecard v1.0</span>
         </div>
         
         <div className="px-6">
            <ScorecardRow label="Sales Experience & Drive" itemKey="salesExperience" />
            <ScorecardRow label="Performance Accountability" itemKey="performanceAccountability" />
            <ScorecardRow label="Motivation & Stability" itemKey="motivationStability" />
            <ScorecardRow label="Licensing Commitment" itemKey="licensing" />
            <ScorecardRow label="Transportation Reliability" itemKey="transportation" />
            <ScorecardRow label="Bilingual (English/Spanish)" itemKey="bilingual" />
            <ScorecardRow label="Feedback Tolerance" itemKey="evaluationTolerance" />
         </div>

         <div className="p-6 bg-slate-50 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Final Assessment & Recommendation</label>
            <textarea 
                className="w-full h-24 p-3 text-sm border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none transition-shadow shadow-sm"
                placeholder="Summarize the interview outcome..."
                value={scorecard.finalNotes}
                onChange={(e) => updateScorecardItem('finalNotes', 'notes', e.target.value)}
            />
         </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-20 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.06)]">
           <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => handleStatusChange(CandidateStatus.REJECTED)}
                        className="px-6 py-2.5 bg-white border border-rose-200 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-50 transition-colors shadow-sm active:scale-95 flex items-center gap-2"
                    >
                        <X size={16} strokeWidth={3} />
                        REJECT CANDIDATE
                    </button>
                </div>
                
                <div className="flex items-center gap-3 bg-emerald-50 p-1.5 rounded-xl border border-emerald-100">
                    <div className="px-3 border-r border-emerald-200">
                         <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider mr-2">Interview Date</span>
                         <input 
                            type="datetime-local" 
                            className="bg-transparent text-sm text-slate-700 outline-none font-medium w-40"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => handleStatusChange(CandidateStatus.INTERVIEW_SCHEDULED)}
                        disabled={!scheduleDate}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 shadow-md whitespace-nowrap active:scale-95 transition-transform flex items-center gap-2"
                    >
                        PASS & SCHEDULE <Check size={16} strokeWidth={3} />
                    </button>
                </div>
           </div>
      </div>
    </div>
  );
};