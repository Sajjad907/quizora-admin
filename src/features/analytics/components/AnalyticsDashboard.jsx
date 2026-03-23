import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../quiz/api/analyticsApi';
import { quizApi } from '../../quiz/api/quizApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import {
  Loader2, Users, TrendingUp, CheckCircle, Download,
  PieChart as PieIcon, BarChart3, ArrowUpRight, ArrowDownRight,
  Mail, Clock, Eye, Activity, Search, Filter, ChevronDown, Tag
} from 'lucide-react';

/* ─── STAT CARD ─── */
const StatCard = ({ title, value, subtext, icon: Icon, gradient, trend }) => (
  <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 group">
    <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500">
      <Icon size={128} strokeWidth={1} />
    </div>
    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} mb-4 shadow-lg`}>
      <Icon size={20} className="text-white" />
    </div>
    <div className="flex items-end justify-between">
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
          {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <p className="text-xs text-slate-400 mt-2 font-medium">{subtext}</p>
  </div>
);

/* ─── CUSTOM TOOLTIP ─── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700">
        <p className="text-xs font-semibold text-slate-300 mb-1">{label}</p>
        <p className="text-lg font-black">{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

/* ─── MAIN COMPONENT ─── */
const AnalyticsDashboard = ({ quizId: initialQuizId }) => {
  const [activeQuizId, setActiveQuizId] = useState(initialQuizId || "");
  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState(null);
  const [funnelData, setFunnelData] = useState([]);
  const [outcomeData, setOutcomeData] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const res = await quizApi.getQuizzes({ limit: 100 });
        setQuizzes(res.quizzes || []);
      } catch (error) { console.error("Quizzes fetch failed:", error); }
    };
    loadQuizzes();
  }, [initialQuizId]);

  const fetchMainData = async () => {
    try {
      setLoading(true);
      const [statsRes, funnelRes, outcomesRes] = await Promise.all([
        analyticsApi.getOverviewStats(activeQuizId),
        analyticsApi.getFunnelData(activeQuizId),
        analyticsApi.getOutcomeDistribution(activeQuizId)
      ]);
      setStats(statsRes);
      setFunnelData(funnelRes);
      setOutcomeData(outcomesRes || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      setLeadsLoading(true);
      const leadsRes = await analyticsApi.getLeads(1, 100, activeQuizId, debouncedSearch);
      setLeads(leadsRes.leads || []);
      setLeadsLoading(false);
    } catch (error) {
      console.error("Leads fetch failed:", error);
      setLeadsLoading(false);
    }
  };

  useEffect(() => { fetchMainData(); }, [activeQuizId]);
  useEffect(() => { fetchLeads(); }, [activeQuizId, debouncedSearch]);

  const downloadCSV = () => {
    if (!leads.length) return;
    const headers = [
      "Capture Date", "Full Name", "Email Address",
      "Source Quiz", "Matched Result", "Marketing Consent", "Location"
    ];
    const rows = leads.map(l => {
      const date = new Date(l.createdAt).toLocaleDateString();
      const name = [l.firstName, l.lastName].filter(Boolean).join(" ") || "N/A";
      const quiz = l.quizId?.title || "Unknown";
      const result = l.finalOutcomeTitle || "Not Finished";
      const consent = l.marketingConsent ? "Yes" : "No";
      return [date, name, l.email, quiz, result, consent, l.geoLocation || "N/A"]
        .map(field => `"${String(field).replace(/"/g, '""')}"`)
        .join(",");
    });
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF"
      + headers.join(",") + "\n" + rows.join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `quiz_leads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading && !stats) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-[3px] border-slate-100 border-t-indigo-500 animate-spin" />
            <Activity size={20} className="absolute inset-0 m-auto text-indigo-500" />
          </div>
          <p className="text-sm font-semibold text-slate-400 animate-pulse">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#f43f5e', '#f59e0b', '#10b981', '#ec4899'];
  const totalOutcomes = outcomeData.reduce((a, b) => a + b.value, 0);

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-700">
      {/* ═══════════════ HEADER & FILTERS ═══════════════ */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">Performance Analytics</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">Real-time data for {activeQuizId ? "this specific quiz" : "your entire catalog"}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="relative flex-1 sm:min-w-[240px]">
            <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={activeQuizId}
              onChange={(e) => setActiveQuizId(e.target.value)}
              className="w-full h-11 pl-10 pr-10 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 appearance-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all outline-none cursor-pointer"
            >
              <option value="">All Active Quizzes</option>
              {quizzes.map(q => <option key={q._id} value={q._id}>{q.title}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <button
            onClick={downloadCSV}
            className="flex items-center gap-2.5 h-11 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 text-[11px] uppercase tracking-widest leading-none shrink-0"
          >
            <Download size={14} /> Export Results
          </button>
        </div>
      </div>

      {/* ═══════════════ STATS GRID ═══════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Impressions" value={stats?.totalStarts?.toLocaleString() || 0} icon={Eye} gradient="from-indigo-500 to-blue-500" subtext="Sessions initiated" trend={12} />
        <StatCard title="Completions" value={stats?.totalCompletions?.toLocaleString() || 0} icon={CheckCircle} gradient="from-emerald-500 to-teal-500" subtext="Successfully finished" trend={8} />
        <StatCard title="Leads Captured" value={stats?.totalLeads?.toLocaleString() || 0} icon={Users} gradient="from-violet-500 to-purple-500" subtext="Emails collected" trend={15} />
        <StatCard title="Global Conversion" value={`${stats?.conversionRate || 0}%`} icon={TrendingUp} gradient="from-orange-500 to-rose-500" subtext="Start → Finish rate" trend={3} />
      </div>

      {/* ═══════════════ CHARTS SECTION ═══════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12 xl:col-span-7 bg-white rounded-2xl border border-slate-200/60 p-7 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-base font-bold text-slate-900">Conversion Funnel</h2>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">User journey progression</p>
            </div>
          </div>
          <div className="h-[320px] w-full">
            {funnelData.length > 0 && funnelData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }} barSize={32}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.03)', radius: 8 }} />
                  <Bar dataKey="value" radius={[0, 12, 12, 0]} background={{ fill: '#f8fafc', radius: [0, 12, 12, 0] }}>
                    {funnelData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-3"><BarChart3 size={40} /><p className="text-[10px] uppercase font-bold tracking-widest">Awaiting interaction data</p></div>}
          </div>
        </div>

        <div className="lg:col-span-12 xl:col-span-5 bg-white rounded-2xl border border-slate-200/60 p-7 shadow-sm flex flex-col">
          <div className="mb-6">
            <h2 className="text-base font-bold text-slate-900">Result Breakdown</h2>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Winning outcome distribution</p>
          </div>
          {outcomeData.length > 0 ? (
            <>
              <div className="h-[220px] w-full relative flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={outcomeData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                      {outcomeData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-slate-900">{totalOutcomes}</span>
                  <span className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] leading-none">Matches</span>
                </div>
              </div>
              <div className="mt-6 space-y-2.5 flex-1 overflow-y-auto max-h-[160px] pr-2 custom-scrollbar">
                {outcomeData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-all group">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0 group-hover:scale-125 transition-transform" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-xs font-bold text-slate-700 flex-1 truncate">{entry.name}</span>
                    <span className="text-xs font-black text-slate-950 w-8 text-right px-2 py-1 bg-slate-50 rounded-lg">{totalOutcomes > 0 ? Math.round((entry.value / totalOutcomes) * 100) : 0}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-3"><PieIcon size={40} /><p className="text-[10px] uppercase font-bold tracking-widest">No completions yet</p></div>}
        </div>
      </div>

      {/* ═══════════════ LEADS TABLE & SEARCH ═══════════════ */}
      <style>{`
        .leads-scroll-area::-webkit-scrollbar { width: 6px; height: 6px; }
        .leads-scroll-area::-webkit-scrollbar-track { background: #f8fafc; }
        .leads-scroll-area::-webkit-scrollbar-thumb { 
          background: #cbd5e1; 
          border-radius: 10px;
        }
        .leads-scroll-area::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      <div className="bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/20 transition-all duration-500">
        <div className="px-8 py-7 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50/30">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Captured Leads</h2>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
              <Activity size={12} className="text-primary animate-pulse" />
              Real-time Database
            </p>
          </div>
          <div className="relative w-full md:w-96 group">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by name, email or outcome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all outline-none shadow-sm"
            />
            {leadsLoading && <Loader2 size={14} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-primary" />}
          </div>
        </div>

        <div className="leads-scroll-area max-h-[580px] overflow-y-auto overflow-x-auto custom-scrollbar">
          {leads.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center text-slate-300 gap-5">
              <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center border border-slate-100">
                <Users size={40} strokeWidth={1.5} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No leads found in this view</p>
            </div>
          ) : (
            <table className="w-full border-collapse min-w-[1000px]">
              <thead className="sticky top-0 bg-white/95 backdrop-blur-md z-20 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                <tr>
                  <th className="text-left px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Matched Result</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Source Quiz</th>
                  <th className="text-center px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Consent</th>
                  <th className="text-right px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead, idx) => {
                  const hasName = (lead.firstName && lead.firstName !== 'undefined' && lead.firstName.trim() !== '') || (lead.lastName && lead.lastName !== 'undefined' && lead.lastName.trim() !== '');
                  const fullName = hasName ? `${lead.firstName || ''} ${lead.lastName || ''}`.trim() : "Anonymous User";

                  // Fix for initials logic
                  let initials = "??";
                  if (hasName) {
                    const f = (lead.firstName || "").trim().charAt(0);
                    const l = (lead.lastName || "").trim().charAt(0);
                    initials = (f + l).toUpperCase() || "?";
                  }

                  const avatarGradients = [
                    'from-indigo-600 to-blue-500',
                    'from-emerald-600 to-teal-500',
                    'from-violet-600 to-purple-500',
                    'from-orange-600 to-rose-500',
                    'from-cyan-600 to-blue-500'
                  ];

                  return (
                    <tr key={lead._id || idx} className="hover:bg-slate-50/60 transition-all duration-300 group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-[1.25rem] flex items-center justify-center text-white text-[13px] font-black shadow-lg shadow-primary/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 bg-gradient-to-br ${avatarGradients[idx % avatarGradients.length]}`}>
                            {initials}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-black text-slate-900 group-hover:text-primary transition-colors">{fullName}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">{lead.geoLocation || 'Global Reach'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5"><span className="text-sm font-bold text-slate-600 font-mono tracking-tight">{lead.email}</span></td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border flex items-center gap-2 shadow-sm ${lead.finalOutcomeTitle ? 'bg-primary/5 text-primary border-primary/20' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                            {lead.finalOutcomeTitle && <Tag size={10} />}
                            {lead.finalOutcomeTitle || "PROGRESS"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5"><span className="inline-flex px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold tracking-tight border border-slate-200/50">{lead.quizId?.title || "Active Campaign"}</span></td>
                      <td className="px-8 py-5 text-center">
                        <div className={`px-3 py-1.5 rounded-full inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border transition-all ${lead.marketingConsent
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm'
                            : 'bg-slate-50 text-slate-400 border-slate-100'
                          }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${lead.marketingConsent ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} />
                          {lead.marketingConsent ? "Opted In" : "Pending"}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="text-[12px] font-black text-slate-800">{new Date(lead.createdAt).toLocaleDateString()}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
