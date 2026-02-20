import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../../features/quiz/api/analyticsApi';
import { useQuizzes } from '../../../features/quiz/hooks/useQuizQueries';
import { Users, Search, Download, Filter, ChevronLeft, ChevronRight, Loader2, Mail, Calendar, Hash } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import Layout from "../../../shared/components/layout/Layout";

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const { data: quizzesData } = useQuizzes();
  const quizzes = quizzesData?.quizzes || [];

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch leads
  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const data = await analyticsApi.getLeads(page, 10, selectedQuizId, debouncedSearch);
        setLeads(data.leads);
        setTotalPages(data.pages);
        setTotalLeads(data.total);
      } catch (error) {
        toast.error("Failed to load leads");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [page, debouncedSearch, selectedQuizId]);

  const handleExport = () => {
    if (totalLeads === 0) return toast.error("No leads to export");
    toast.success("Exporting leads... (Feature coming soon: full backend export)");
  };

  return (
    <Layout>
      <div className="flex flex-col h-full space-y-6 animate-reveal">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">Leads Management</h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground font-medium">
              <Users size={16} />
              <span>Total Leads: <span className="text-primary font-bold">{totalLeads}</span></span>
            </div>
          </div>
          <button 
            onClick={handleExport}
            className="btn-premium px-6 h-10 flex items-center gap-2 border border-primary/20 bg-primary text-white hover:scale-[1.02] transition-all rounded-xl font-black uppercase tracking-widest text-[9px]"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>

        {/* FILTERS BAR */}
        <div className="bg-card border border-border/50 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 h-12 rounded-xl bg-muted/30 border border-border/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={18} className="text-muted-foreground" />
            <select 
              className="h-12 px-4 rounded-xl bg-muted/30 border border-border/50 focus:ring-2 focus:ring-primary/20 text-sm font-bold text-foreground min-w-[200px]"
              value={selectedQuizId}
              onChange={(e) => { setSelectedQuizId(e.target.value); setPage(1); }}
            >
              <option value="">All Quizzes</option>
              {quizzes?.map(q => (
                <option key={q._id} value={q._id}>{q.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-card border border-border/50 rounded-3xl shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="overflow-x-auto flex-1">
            <table className="w-full">
              <thead className="bg-muted/30 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-black text-muted-foreground uppercase tracking-widest w-[30%]">Contact</th>
                  <th className="px-6 py-4 text-left text-[11px] font-black text-muted-foreground uppercase tracking-widest w-[25%]">Email</th>
                  <th className="px-6 py-4 text-left text-[11px] font-black text-muted-foreground uppercase tracking-widest w-[20%]">Source Quiz</th>
                  <th className="px-6 py-4 text-left text-[11px] font-black text-muted-foreground uppercase tracking-widest w-[15%]">Date</th>
                  <th className="px-6 py-4 text-right text-[11px] font-black text-muted-foreground uppercase tracking-widest w-[10%]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="h-[400px]">
                      <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                        <Loader2 className="animate-spin text-primary" size={32} />
                        <span className="text-xs font-bold uppercase tracking-widest">Loading leads...</span>
                      </div>
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="h-[400px]">
                      <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground/50">
                        <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center">
                          <Users size={32} />
                        </div>
                        <p className="font-bold text-sm">No leads found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  leads.map((lead, idx) => (
                    <tr key={lead._id || idx} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0 border-2 border-white dark:border-slate-800 shadow-sm ${
                             lead.firstName 
                              ? (idx % 3 === 0 ? 'bg-indigo-500' : idx % 3 === 1 ? 'bg-violet-500' : 'bg-emerald-500')
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                           }`}>
                             {lead.firstName ? (
                                `${lead.firstName[0]}${lead.lastName?.[0] || ''}`
                             ) : (
                                <Users size={14} />
                             )}
                           </div>
                           <div className="min-w-0">
                             <div className="font-bold text-foreground text-xs truncate max-w-[150px]">{lead.firstName ? `${lead.firstName} ${lead.lastName || ''}` : 'Anonymous User'}</div>
                             <div className="text-[9px] text-muted-foreground font-bold flex items-center gap-1 mt-0.5 opacity-60 font-mono">
                                <Hash size={10} /> {lead._id?.slice(-6).toUpperCase()}
                             </div>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                          <Mail size={14} />
                          {lead.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 rounded-lg bg-muted/50 border border-border/50 text-[10px] font-bold text-foreground/80">
                          {lead.quizId?.title || 'Unknown Quiz'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                          <Calendar size={12} />
                          {lead.createdAt ? formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true }) : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Captured
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* PAGINATION */}
          <div className="p-4 border-t border-border/50 flex items-center justify-between bg-muted/10">
            <p className="text-[11px] font-bold text-muted-foreground">
              Page <span className="text-foreground">{page}</span> of {totalPages}
            </p>
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-border/50 bg-card hover:bg-primary/5 hover:border-primary/20 text-muted-foreground hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-border/50 bg-card hover:bg-primary/5 hover:border-primary/20 text-muted-foreground hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LeadsPage;
