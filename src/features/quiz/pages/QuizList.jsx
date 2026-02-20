import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../shared/components/layout/Layout';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Plus, 
  Activity, 
  Settings, 
  BarChart3, 
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Database,
  Layers,
  Archive,
  Clock
} from 'lucide-react';
import { useQuizzes } from '../hooks/useQuizQueries';
import { useDeleteQuiz } from '../hooks/useQuizMutations';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const QuizList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useQuizzes(page, 10);
  const deleteMutation = useDeleteQuiz();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to archive this campaign? This will remove it from active repositories.')) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success('Campaign archived successfully'),
        onError: () => toast.error('Encryption integrity check failed - archive cancelled')
      });
    }
  };

  const quizzes = data?.quizzes || [];
  const totalPages = data?.pages || 1;

  const filteredQuizzes = quizzes.filter(q => 
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-10 space-y-12 max-w-[1600px] mx-auto animate-fade-in">
        {/* --- DYNAMIC HEADER --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-[1000] tracking-tight text-foreground uppercase">Campaign Registry</h1>
            <p className="text-muted-foreground font-medium">Deploy, monitor, and optimize your intelligent recommendation engines from a centralized operational core.</p>
          </div>
          
          <button 
            onClick={() => navigate('/quiz/create')}
            className="btn-primary"
          >
            <Plus size={22} className="group-hover:rotate-90 transition-transform" />
            Initialize Engine
          </button>
        </div>

        {/* --- FILTER & SEARCH HUD --- */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-3 glass-card bg-card/60 border-border">
           <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Search registries by identifier or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent p-6 pl-16 text-foreground font-bold placeholder:text-muted-foreground/30 focus:outline-none text-sm"
              />
           </div>
           
           <div className="flex items-center gap-4 pr-4">
              <button className="flex items-center gap-3 px-8 py-4 bg-muted/40 hover:bg-muted rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all border border-border">
                 <Filter size={16} />
                 Advanced Filters
              </button>
              <div className="h-10 w-px bg-border mx-2" />
              <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                 <Database size={14} />
                 {quizzes.length} Entries
              </div>
           </div>
        </div>

        {/* --- CAMPAIGN REPOSITORY TABLE --- */}
        <div className="glass-card border-border shadow-premium relative bg-card/40">
           <div className="overflow-x-auto overflow-hidden rounded-[32px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-10 py-8 text-[11px] font-[1000] uppercase tracking-[0.2em] text-muted-foreground/40">REGISTRY NAME</th>
                    <th className="px-10 py-8 text-[11px] font-[1000] uppercase tracking-[0.2em] text-muted-foreground/40 text-center">STATUS</th>
                    <th className="px-10 py-8 text-[11px] font-[1000] uppercase tracking-[0.2em] text-muted-foreground/40 text-center">ENDPOINT</th>
                    <th className="px-10 py-8 text-[11px] font-[1000] uppercase tracking-[0.2em] text-muted-foreground/40 text-right pr-20">TIMESTAMP</th>
                    <th className="px-10 py-8 text-[11px] font-[1000] uppercase tracking-[0.2em] text-muted-foreground/40 text-right">COMMAND</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {isLoading ? (
                    [1,2,3,4,5].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan="5" className="px-10 py-16 text-center text-muted-foreground/10 font-black uppercase tracking-widest italic">Syncing Machine States...</td>
                      </tr>
                    ))
                  ) : filteredQuizzes.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-10 py-32 text-center text-muted-foreground/30 italic font-black uppercase tracking-widest">No active campaigns discovered in this registry</td>
                    </tr>
                  ) : filteredQuizzes.map((quiz, i) => (
                    <tr key={quiz._id} className="group hover:bg-muted/10 transition-all">
                      <td className="px-10 py-10" onClick={() => navigate(`/quiz/${quiz._id}/builder`)}>
                        <div className="flex items-center gap-6">
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-[1000] text-lg shadow-xl ${
                              ['bg-indigo-600', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500'][i % 4]
                           }`}>
                              {quiz.title.slice(0, 2).toUpperCase()}
                           </div>
                           <div>
                              <p className="text-xl font-[1000] text-foreground group-hover:text-primary transition-colors">{quiz.title}</p>
                              <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] mt-0.5">PRODUCTION ENTITY</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-10 py-10">
                         <div className={`mx-auto w-fit px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border ${
                            quiz.status === 'published' ? 'badge-live' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                         }`}>
                            {quiz.status}
                         </div>
                      </td>
                      <td className="px-10 py-10">
                         <p className="text-center text-[12px] font-bold text-muted-foreground/60 font-mono tracking-tight">/quiz/{quiz.slug || quiz._id.slice(-8)}</p>
                      </td>
                      <td className="px-10 py-10 text-right pr-20">
                         <div className="flex flex-col items-end">
                            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                               <Clock size={12} className="opacity-30" />
                               {format(new Date(quiz.createdAt), 'H')} DAYS AGO
                            </p>
                         </div>
                      </td>
                      <td className="px-10 py-10 text-right">
                        <div className="flex items-center justify-end gap-3 text-muted-foreground">
                          <button 
                             onClick={(e) => { e.stopPropagation(); navigate(`/quiz/${quiz._id}/builder`); }}
                             className="px-6 py-2.5 bg-muted/50 hover:bg-primary/10 border border-border hover:border-primary/20 rounded-xl text-primary text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95 shadow-sm"
                          >
                             <Sparkles size={14} /> BUILD
                          </button>
                          <button 
                             onClick={(e) => { e.stopPropagation(); handleDelete(quiz._id); }}
                             className="p-3 bg-red-500/5 hover:bg-red-500/10 text-red-500/30 hover:text-red-500 transition-all rounded-xl"
                          >
                             <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>

        {/* --- PAGINATION ORCHESTRATION --- */}
        <div className="flex items-center justify-between py-10 border-t border-border/20 px-4">
           <div>
              <p className="text-[11px] font-black text-muted-foreground/40 uppercase tracking-[0.3em]">
                 PAGE <span className="text-foreground">{page}</span> OF <span className="text-foreground">{totalPages}</span>
              </p>
           </div>
           
           <div className="flex items-center gap-4">
              <button 
                 disabled={page === 1}
                 onClick={() => setPage(p => p - 1)}
                 className="w-12 h-12 disabled:opacity-20 text-muted-foreground hover:text-primary transition-all bg-card rounded-xl border border-border hover:border-primary/40 flex items-center justify-center active:scale-95"
              >
                 <ChevronLeft size={20} />
              </button>
              
              <button 
                 disabled={page === totalPages}
                 onClick={() => setPage(p => p + 1)}
                 className="w-12 h-12 disabled:opacity-20 text-muted-foreground hover:text-primary transition-all bg-card rounded-xl border border-border hover:border-primary/40 flex items-center justify-center active:scale-95"
              >
                 <ChevronRight size={20} />
              </button>
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuizList;
