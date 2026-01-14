import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Candidate, CandidateStatus } from '../types';
import { Users, PhoneOutgoing, CalendarCheck, FileX, TrendingUp, MoreHorizontal } from 'lucide-react';

interface DashboardProps {
  candidates: Candidate[];
}

export const Dashboard: React.FC<DashboardProps> = ({ candidates }) => {
  const stats = {
    total: candidates.length,
    contacted: candidates.filter(c => c.status === CandidateStatus.CONTACT_ATTEMPTED || c.status === CandidateStatus.VOICEMAIL_LEFT).length,
    scheduled: candidates.filter(c => c.status === CandidateStatus.INTERVIEW_SCHEDULED || c.status === CandidateStatus.HIRED).length,
    rejected: candidates.filter(c => c.status === CandidateStatus.REJECTED).length,
  };

  const chartData = [
    { name: 'New', value: candidates.filter(c => c.status === CandidateStatus.NEW).length, color: '#94a3b8' },
    { name: 'Contacted', value: stats.contacted, color: '#60a5fa' },
    { name: 'Scheduled', value: stats.scheduled, color: '#4ade80' },
    { name: 'Rejected', value: stats.rejected, color: '#f87171' },
  ];

  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft hover:shadow-lg transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${bgClass} ${colorClass} group-hover:scale-110 transition-transform`}>
          <Icon size={22} />
        </div>
        <button className="text-slate-300 hover:text-slate-500">
          <MoreHorizontal size={20} />
        </button>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h2>
        <p className="text-slate-500 mt-2">Welcome back to TalentFlow by RD. Here's what's happening today.</p>
      </header>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Candidates" 
          value={stats.total} 
          icon={Users} 
          bgClass="bg-slate-100" 
          colorClass="text-slate-700" 
        />
        <StatCard 
          title="Contacted" 
          value={stats.contacted} 
          icon={PhoneOutgoing} 
          bgClass="bg-blue-50" 
          colorClass="text-blue-600" 
        />
        <StatCard 
          title="Scheduled" 
          value={stats.scheduled} 
          icon={CalendarCheck} 
          bgClass="bg-emerald-50" 
          colorClass="text-emerald-600" 
        />
        <StatCard 
          title="Rejected" 
          value={stats.rejected} 
          icon={FileX} 
          bgClass="bg-rose-50" 
          colorClass="text-rose-600" 
        />
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-soft">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Pipeline Analytics</h3>
              <p className="text-sm text-slate-500 mt-1">Candidate distribution across stages</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
              <TrendingUp size={20} />
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 30, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Summary Card */}
        <div className="bg-indigo-600 rounded-3xl p-8 shadow-glow text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 bg-white opacity-5 rounded-full transform translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 left-0 p-16 bg-black opacity-10 rounded-full transform -translate-x-10 translate-y-10"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">Efficiency Score</h3>
            <p className="text-indigo-200">Your screening process is performing well.</p>
          </div>

          <div className="relative z-10 mt-8">
            <div className="text-6xl font-bold mb-2">94<span className="text-2xl opacity-60">%</span></div>
            <p className="text-sm text-indigo-200 font-medium uppercase tracking-wider">Conversion Rate</p>
          </div>

          <div className="relative z-10 mt-8 pt-8 border-t border-indigo-500/30">
             <div className="flex items-center gap-3 text-sm font-medium">
               <div className="w-2 h-2 rounded-full bg-green-400"></div>
               System Operational
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
