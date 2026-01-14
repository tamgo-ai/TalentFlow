import React, { useState } from 'react';
import { Upload, X, Sparkles, AlertCircle, ArrowRight, Briefcase, Check } from 'lucide-react';
import { Candidate, CandidateStatus } from '../types';
import { parseCandidateData } from '../services/geminiService';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (candidates: Candidate[]) => void;
}

const ROLES = ['Sales Agent', 'Regional', 'Manager', 'HR', 'Marketing'];

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [activeTab, setActiveTab] = useState<'csv' | 'paste'>('csv');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [pasteContent, setPasteContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const processImport = async (text: string) => {
    if (!selectedRole) {
      setError("Please select a target position above.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      const parsedData = await parseCandidateData(text);
      if (parsedData.length === 0) throw new Error("No candidate data found.");

      const candidates: Candidate[] = parsedData.map(c => ({
        id: Math.random().toString(36).substr(2, 9),
        firstName: c.firstName || 'Unknown',
        lastName: c.lastName || '',
        email: c.email || '',
        phone: c.phone || '',
        city: c.city || 'Remote',
        role: selectedRole, // Use selected role
        initialNotes: c.initialNotes || '',
        status: CandidateStatus.NEW
      }));

      onImport(candidates);
      onClose();
      setPasteContent('');
      setSelectedRole('');
    } catch (err) {
      setError("We couldn't understand the data. Please ensure it contains names and contact info.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => processImport(evt.target?.result as string);
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div>
             <h2 className="text-xl font-bold text-slate-900 tracking-tight">Import Candidates</h2>
             <p className="text-sm text-slate-500">Add new talent to your pipeline</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-sm flex items-start gap-3 animate-fade-in">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Step 1: Role Selection */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">1</div>
              Select Target Position
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ROLES.map(role => (
                <button
                  key={role}
                  onClick={() => {
                    setSelectedRole(role);
                    setError(null);
                  }}
                  className={`relative px-4 py-3 rounded-xl text-sm font-bold border transition-all duration-200 flex items-center justify-center gap-2 ${
                    selectedRole === role 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 ring-2 ring-indigo-600 ring-offset-2' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                  }`}
                >
                  {selectedRole === role && <Check size={14} strokeWidth={3} />}
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Import Method */}
          <div className={`transition-opacity duration-300 ${selectedRole ? 'opacity-100' : 'opacity-40 pointer-events-none grayscale'}`}>
             <label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">2</div>
                Upload Data
              </label>

              <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                <button
                  onClick={() => setActiveTab('csv')}
                  disabled={isProcessing}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === 'csv' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Upload CSV/File
                </button>
                <button
                  onClick={() => setActiveTab('paste')}
                  disabled={isProcessing}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === 'paste' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Paste Text
                </button>
              </div>

              {isProcessing ? (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-6 border-2 border-slate-100 border-dashed rounded-2xl bg-slate-50/50">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500 opacity-20 blur-xl rounded-full"></div>
                        <Sparkles size={48} className="text-indigo-600 animate-pulse relative z-10" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-bold text-slate-900 text-lg">Processing Candidates...</p>
                        <p className="text-sm text-slate-500">Assigning to <span className="font-bold text-indigo-600">{selectedRole}</span> pipeline.</p>
                    </div>
                </div>
              ) : activeTab === 'csv' ? (
                <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/10 rounded-2xl h-64 flex flex-col items-center justify-center transition-all group relative cursor-pointer">
                  <input 
                    type="file" 
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={!selectedRole}
                  />
                  <div className="w-16 h-16 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={28} className="text-indigo-600" />
                  </div>
                  <p className="text-slate-900 font-bold text-lg group-hover:text-indigo-700 transition-colors">Drop your file here</p>
                  <p className="text-slate-500 text-sm mt-1">Accepts CSV or Text files</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                      <textarea
                        value={pasteContent}
                        onChange={(e) => setPasteContent(e.target.value)}
                        placeholder="Paste list of names, emails, or phone numbers here..."
                        className="w-full h-48 p-5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none font-mono text-sm bg-slate-50 focus:bg-white transition-all outline-none"
                        disabled={!selectedRole}
                      />
                      <div className="absolute bottom-4 right-4 text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-400 font-medium pointer-events-none">
                          AI Parsing
                      </div>
                  </div>
                  <button
                    onClick={() => processImport(pasteContent)}
                    disabled={!pasteContent.trim() || !selectedRole}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none font-bold flex justify-center items-center gap-2 active:scale-[0.99]"
                  >
                    <Sparkles size={18} />
                    Import {selectedRole ? `${selectedRole} Candidates` : ''}
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};