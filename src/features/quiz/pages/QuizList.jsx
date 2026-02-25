import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../shared/components/layout/Layout';
import {
   Search,
   PlusCircle,
   FileText,
   Trash2,
   Sparkles,
   ArrowUpRight,
   Loader2,
   Clock,
   Copy
} from 'lucide-react';
import { useQuizzes } from '../hooks/useQuizQueries';
import { useDeleteQuiz } from '../hooks/useQuizMutations';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import ConfirmModal from '../../../shared/components/ui/ConfirmModal';

const QuizList = () => {
   const navigate = useNavigate();
   const [page, setPage] = useState(1);
   const [search, setSearch] = useState('');

   const { data, isLoading } = useQuizzes(page, 10);
   const deleteMutation = useDeleteQuiz();

   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [quizToDelete, setQuizToDelete] = useState(null);

   const handleDeleteClick = (id) => {
      setQuizToDelete(id);
      setIsDeleteModalOpen(true);
   };

   const handleConfirmDelete = async () => {
      if (!quizToDelete) return;

      deleteMutation.mutate(quizToDelete, {
         onSuccess: () => {
            toast.success('Campaign deleted successfully');
            setIsDeleteModalOpen(false);
            setQuizToDelete(null);
         },
         onError: () => {
            toast.error('Failed to delete campaign');
            setIsDeleteModalOpen(false);
            setQuizToDelete(null);
         }
      });
   };

   const handleCopyId = (e, id) => {
      e.stopPropagation();
      navigator.clipboard.writeText(id);
      toast.success('Quiz ID copied to clipboard!');
   };

   const quizzes = data?.quizzes || [];
   const totalPages = data?.pages || 1;

   return (
      <>
         <Layout>
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-8 animate-reveal">
               <div>
                  <h1 className="text-5xl font-black text-foreground tracking-tight uppercase italic leading-none">
                     Campaign <span className="text-primary italic">Registry</span>
                  </h1>
                  <p className="text-muted-foreground mt-4 text-lg font-medium tracking-tight">
                     Manage and monitor your high-performance recommendation engines.
                  </p>
               </div>

               <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="relative flex-1 md:flex-none">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
                     <input
                        type="text"
                        placeholder="Filter identifiers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 pr-6 h-[56px] rounded-2xl bg-card border border-border/50 focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all w-full md:w-72 text-sm font-bold shadow-sm"
                     />
                  </div>

                  <button
                     onClick={() => navigate('/quiz/create')}
                     className="btn-premium glow-primary h-[56px] px-8 border border-primary/20 bg-primary text-white flex items-center gap-2 hover:scale-[1.02] transition-all rounded-2xl font-black uppercase tracking-widest text-[10px]"
                  >
                     <PlusCircle size={20} />
                     New Campaign
                  </button>
               </div>
            </div>

            {/* RECENT ACTIVITY TABLE */}
            <div className="glass-panel rounded-[40px] overflow-hidden border border-border/50 shadow-2xl mb-8 animate-reveal">
               <div className="p-10 border-b border-border/10 flex justify-between items-center bg-card/40 backdrop-blur-3xl">
                  <div className="flex items-center gap-5">
                     <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground/30 border border-border/50">
                        <FileText size={24} />
                     </div>
                     <div>
                        <h2 className="text-2xl font-black text-foreground tracking-tight">Active Repositories</h2>
                        <p className="text-sm text-muted-foreground mt-0.5 font-medium">Real-time status of your recommendation engines</p>
                     </div>
                  </div>
                  <button className="h-12 px-6 rounded-xl text-[11px] font-black text-primary hover:bg-primary/5 flex items-center gap-2 uppercase tracking-[0.2em] transition-all group border border-transparent hover:border-primary/10">
                     View Archive <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
               </div>

               <div className="overflow-x-auto">
                  <table className="w-full">
                     <thead>
                        <tr className="bg-muted/30">
                           <th className="px-6 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em]">Registry Name</th>
                           <th className="px-6 py-5 text-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em]">Status</th>
                           <th className="px-6 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em]">Endpoint</th>
                           <th className="px-6 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em]">Timestamp</th>
                           <th className="px-6 py-5 text-right text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em]">Command</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border/5">
                        {isLoading ? (
                           <tr>
                              <td colSpan="5" className="px-10 py-32 text-center">
                                 <div className="flex flex-col items-center justify-center gap-6">
                                    <Loader2 className="animate-spin text-primary" size={40} />
                                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Synchronizing Data...</span>
                                 </div>
                              </td>
                           </tr>
                        ) : quizzes?.length === 0 ? (
                           <tr>
                              <td colSpan="5" className="px-10 py-32 text-center opacity-40 italic font-medium text-lg text-muted-foreground">
                                 The registry is currently empty.
                              </td>
                           </tr>
                        ) : (
                           quizzes.filter(q => q.title.toLowerCase().includes(search.toLowerCase())).map((quiz, i) => (
                              <tr key={quiz._id} className="group hover:bg-primary/[0.02] transition-all cursor-pointer">
                                 <td className="px-6 py-6 whitespace-nowrap" onClick={() => navigate(`/quiz/${quiz._id}/builder`)}>
                                    <div className="flex items-center gap-4">
                                       <div className={`h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center text-white font-black text-[16px] shadow-2xl transition-transform group-hover:scale-110 duration-500
                                             ${i % 3 === 0 ? 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-500/10' :
                                             i % 3 === 1 ? 'bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-500/10' :
                                                'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/10'}`
                                       }>
                                          {quiz.title.substring(0, 2).toUpperCase()}
                                       </div>
                                       <div>
                                          <div className="flex items-center gap-2">
                                             <div className="text-base font-black text-foreground group-hover:text-primary transition-colors tracking-tight mb-0.5">{quiz.title}</div>
                                             <button
                                                onClick={(e) => handleCopyId(e, quiz._id)}
                                                className="opacity-0 group-hover:opacity-40 hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-primary/5 text-muted-foreground hover:text-primary"
                                                title="Copy ID"
                                             >
                                                <Copy size={12} />
                                             </button>
                                          </div>

                                          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">ID: {quiz._id.substring(0, 8)}...</div>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-6 whitespace-nowrap text-center">
                                    <span className={`px-4 py-1.5 inline-flex text-[10px] font-black uppercase tracking-[0.15em] rounded-full border
                                          ${quiz.status === 'draft' ? 'bg-yellow-500/5 text-yellow-600 border-yellow-500/10' : 'bg-emerald-500/5 text-emerald-600 border-emerald-500/10'}`
                                    }>
                                       {quiz.status}
                                    </span>
                                 </td>
                                 <td className="px-6 py-6 whitespace-nowrap text-[12px] text-muted-foreground font-mono font-bold tracking-tight opacity-70">
                                    /quiz/{quiz.handle}
                                 </td>
                                 <td className="px-6 py-6 whitespace-nowrap text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                       <Clock size={14} className="opacity-40" />
                                       {quiz.createdAt ? format(new Date(quiz.createdAt), 'dd MMM yyyy') : 'Recently'}
                                    </div>
                                 </td>
                                 <td className="px-6 py-6 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end gap-3">
                                       <button
                                          onClick={() => navigate(`/quiz/${quiz._id}/builder`)}
                                          className="h-10 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all border border-primary/10 flex items-center gap-2 group/build"
                                       >
                                          <Sparkles size={13} className="group-hover/build:scale-125 transition-transform" />
                                          Build
                                       </button>
                                       <button
                                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(quiz._id); }}
                                          className="w-10 h-10 flex items-center justify-center text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all border border-transparent hover:border-rose-500/10"
                                       >
                                          <Trash2 size={16} />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </Layout>

         <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Delete Quiz?"
            message={`You are about to remove this campaign. This will permanently delete all associated questions and data.`}
            confirmText="Confirm Removal"
            cancelText="Keep Quiz"
            type="danger"
            isLoading={deleteMutation.isPending}
         />
      </>
   );
};

export default QuizList;
