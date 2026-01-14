import React, { useState } from 'react';
import { ImportModal } from './components/ImportModal';
import { Dashboard } from './components/Dashboard';
import { CandidateList } from './components/CandidateList';
import { InterviewView } from './components/InterviewView';
import { FloatingScript } from './components/FloatingScript';
import { Candidate, CandidateStatus } from './types';
import { LayoutDashboard, Users, Upload, Sparkles, BookOpen } from 'lucide-react';

const MOCK_DATA: Candidate[] = [
  {
    id: '1',
    firstName: 'Ana',
    lastName: 'García',
    email: 'ana.garcia@example.com',
    phone: '555-0192',
    city: 'Madrid',
    role: 'Sales Agent',
    initialNotes: 'Strong sales background in retail, bilingual English/Spanish.',
    status: CandidateStatus.NEW
  },
  {
    id: '2',
    firstName: 'Carlos',
    lastName: 'Ruiz',
    email: 'carlos.ruiz@example.com',
    phone: '555-0144',
    city: 'Barcelona',
    role: 'Sales Agent',
    initialNotes: 'Has some transportation issues mentioned in email. Good energy.',
    status: CandidateStatus.CONTACT_ATTEMPTED,
    lastContactDate: new Date().toISOString()
  }
];

export default function App() {
  const [view, setView] = useState<'dashboard' | 'candidates' | 'interview'>('dashboard');
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_DATA);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isScriptOpen, setIsScriptOpen] = useState(false);

  const activeCandidate = candidates.find(c => c.id === selectedCandidateId);

  const handleImport = (newCandidates: Candidate[]) => {
    setCandidates([...candidates, ...newCandidates]);
  };

  const handleUpdateCandidate = (updated: Candidate) => {
    setCandidates(candidates.map(c => c.id === updated.id ? updated : c));
  };

  const renderContent = () => {
    if (view === 'interview' && activeCandidate) {
      return (
        <InterviewView 
          candidate={activeCandidate} 
          onBack={() => setView('candidates')}
          onUpdateCandidate={handleUpdateCandidate}
        />
      );
    }

    if (view === 'candidates') {
      return (
        <CandidateList 
          candidates={candidates} 
          onSelectCandidate={(c) => {
            setSelectedCandidateId(c.id);
            setView('interview');
          }}
          onUpdateCandidate={handleUpdateCandidate}
        />
      );
    }

    return <Dashboard candidates={candidates} />;
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      <ImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImport={handleImport}
      />

      {/* Modern Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col z-20 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.02)] shrink-0">
        {/* Brand */}
        <div className="p-8 pb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-glow">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">TalentFlow</h1>
              <span className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">by RD</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-2 space-y-1">
          <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Main Menu</div>
          
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              view === 'dashboard' 
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm ring-1 ring-indigo-100' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard size={20} className={view === 'dashboard' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} />
            <span>Dashboard</span>
          </button>
          
          <button 
            onClick={() => setView('candidates')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              view === 'candidates' 
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm ring-1 ring-indigo-100' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Users size={20} className={view === 'candidates' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} />
            <span>Candidates</span>
            <span className={`ml-auto text-xs py-0.5 px-2 rounded-full ${view === 'candidates' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
              {candidates.length}
            </span>
          </button>

          {/* Script Button - Toggles Split View */}
          <button 
            onClick={() => setIsScriptOpen(!isScriptOpen)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group mt-4 ${
              isScriptOpen
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                : 'bg-white border-2 border-dashed border-indigo-200 text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            <BookOpen size={20} className={isScriptOpen ? "text-white" : "text-indigo-500"} />
            <span className="font-bold">SCRIPT</span>
          </button>
        </div>

        {/* Action & Footer */}
        <div className="p-4 mt-auto space-y-4">
           <button 
             onClick={() => setIsImportModalOpen(true)}
             className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white p-3.5 rounded-xl transition-all shadow-lg shadow-slate-200 active:scale-[0.98]"
           >
             <Upload size={18} />
             <span className="text-sm font-semibold">Import Data</span>
           </button>

           <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Develop and made by<br/>
                <span className="text-slate-600 font-bold mt-0.5 block text-xs">RAUL DOMINGUEZ</span>
              </p>
           </div>
        </div>
      </aside>

      {/* Layout Content: Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Application Area */}
        <main className="flex-1 overflow-auto bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto p-6 lg:p-10">
            {renderContent()}
          </div>
        </main>

        {/* Right Split Panel (Script) */}
        <FloatingScript 
          isOpen={isScriptOpen} 
          onClose={() => setIsScriptOpen(false)} 
        />
      </div>
    </div>
  );
}
