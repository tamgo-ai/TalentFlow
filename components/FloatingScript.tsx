import React from 'react';
import { X, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react';

interface FloatingScriptProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FloatingScript: React.FC<FloatingScriptProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="w-[400px] bg-white border-l border-slate-200 flex flex-col h-full shrink-0 transition-all duration-300 shadow-xl z-30">
      {/* Header */}
      <div className="bg-slate-900 text-white px-5 py-4 flex justify-between items-center shrink-0">
        <h2 className="font-bold text-sm tracking-wide flex items-center gap-2">
          <BookOpen size={16} className="text-indigo-400" />
          Interview Script
        </h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 text-slate-700 leading-relaxed font-medium bg-slate-50/50">
        
        {/* Warning Banner */}
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl">
           <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-2">
                <AlertTriangle size={14} /> Critical Reminders
            </div>
            <p className="text-xs text-rose-800 leading-normal">
                Do NOT say: "Great fit", "We need people", "Flexible on requirements".<br/>
                Stick to the script to ensure fair evaluation.
            </p>
        </div>

        <div className="relative pl-4 border-l-4 border-indigo-100">
          <h3 className="text-indigo-600 font-bold uppercase text-[10px] tracking-wider mb-1">Opening</h3>
          <p className="text-sm text-slate-800">
            “Hi, this is <span className="bg-indigo-50 text-indigo-700 px-1.5 rounded font-bold border border-indigo-100 text-xs">[Name]</span> calling from Veronica’s Insurance. This is a brief screening call to determine next steps.”
          </p>
          <p className="text-xs text-slate-400 mt-2 italic">If busy: "When is a better time?" or "We will move on."</p>
        </div>

        <div className="space-y-4">
          {[
            { title: "1. Sales Experience", q: "Tell me about your most recent sales role. What were your targets?", check: "Look for: Numeric results." },
            { title: "2. Accountability", q: "How was performance tracked? What happened if you missed targets?", check: "Look for: Ownership." },
            { title: "3. Motivation", q: "Why are you looking for a change right now?", check: "Look for: Career growth." },
            { title: "4. Licensing", q: "Are you willing to complete a 32-hour course + exam in 30 days?", check: "Must be: Yes, absolutely." },
            { title: "5. Logistics", q: "Do you have reliable transportation and are you bilingual (En/Sp)?", check: "Must be: Yes to both." },
            { title: "6. Feedback", q: "How comfortable are you with regular performance feedback?", check: "Look for: Openness." },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 text-xs mb-2 uppercase tracking-wide text-indigo-600">{item.title}</h4>
              <p className="text-slate-800 mb-3 text-sm">{item.q}</p>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1.5 rounded border border-emerald-100 w-fit">
                <CheckCircle size={12} />
                {item.check}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 text-center">
          <h3 className="text-emerald-700 font-bold uppercase text-[10px] tracking-wider mb-1">Closing</h3>
          <p className="text-sm font-medium text-emerald-900">
            “Thank you. We’ll review internally and follow up if we decide to move forward.”
          </p>
        </div>
      </div>
    </div>
  );
};
