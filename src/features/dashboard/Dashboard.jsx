import React from "react";
import Layout from "../../shared/components/layout/Layout";
import { PlusCircle, FileText, CheckCircle, TrendingUp, Users, ArrowUpRight, Clock, Search, Loader2, Trash2, Sparkles, BarChart3, Mail, Eye, Activity } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useQuizzes, useStats } from "../quiz/hooks/useQuizQueries";
import { useDeleteQuiz } from "../quiz/hooks/useQuizMutations";
import { analyticsApi } from "../quiz/api/analyticsApi";
import { formatDistanceToNow } from 'date-fns';
import toast from "react-hot-toast";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ConfirmModal from "../../shared/components/ui/ConfirmModal";

/* ─── STAT CARD ─── */
const StatsCard = ({ title, value, icon: Icon, trend, isPositive, color, bg }) => (
  <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
    <div className={`absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none transform scale-150 -translate-y-2 translate-x-2 group-hover:scale-[1.7] transition-transform duration-500`}>
      <Icon size={120} />
    </div>

    <div className="relative z-10 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{title}</p>
        <h3 className="text-3xl font-extrabold mt-2 text-foreground tracking-tight">{value}</h3>
      </div>
      <div className={`p-3.5 rounded-xl ${bg} ${color} transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
        <Icon size={24} />
      </div>
    </div>

    <div className="relative z-10 mt-5 flex items-center text-xs font-semibold">
      <span className={`${isPositive ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-500 bg-rose-500/10 border-rose-500/20'} px-2 py-1 rounded-lg border flex items-center mr-2 transition-colors`}>
        <TrendingUp size={12} className={`mr-1 ${!isPositive && 'rotate-180'}`} />
        {trend}
      </span>
      <span className="text-muted-foreground">vs last month</span>
    </div>
  </div>
);

/* ─── CHART TOOLTIP ─── */
const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700">
        <p className="text-[10px] font-semibold text-slate-400 mb-0.5">{label}</p>
        <p className="text-base font-black">{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const FUNNEL_COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = React.useState({ isOpen: false, id: null, name: '' });
  const [page, setPage] = React.useState(1);
  const { data: quizzesData, isLoading: isQuizzesLoading } = useQuizzes(page, 10);
  const { data: stats, isLoading: isStatsLoading } = useStats();
  const { mutate: deleteQuiz } = useDeleteQuiz();

  // Analytics data for dashboard
  const [funnelData, setFunnelData] = React.useState([]);
  const [recentLeads, setRecentLeads] = React.useState([]);
  const [quizPerformance, setQuizPerformance] = React.useState([]);
  const [analyticsLoading, setAnalyticsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [funnelRes, leadsRes, perfRes] = await Promise.all([
          analyticsApi.getFunnelData(),       // Global (no quizId)
          analyticsApi.getLeads(1, 5),        // Latest 5
          analyticsApi.getQuizPerformance()   // Per-quiz breakdown
        ]);
        setFunnelData(funnelRes || []);
        setRecentLeads(leadsRes?.leads || []);
        setQuizPerformance(perfRes || []);
      } catch (err) {
        console.error("Dashboard analytics error:", err);
      }
      setAnalyticsLoading(false);
    };
    fetchAnalytics();
  }, []);

  const handleDelete = (id, name) => {
    setConfirmModal({ isOpen: true, id, name });
  };

  const confirmDelete = () => {
    deleteQuiz(confirmModal.id, {
      onSuccess: () => {
        toast.success("Quiz deleted successfully");
        setConfirmModal({ isOpen: false, id: null, name: '' });
      },
      onError: () => toast.error("Failed to delete quiz")
    });
  };

  return (
    <>
      <Layout>
        {/* 1. DASHBOARD HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-8 animate-reveal">
          <div>
            <h1 className="text-4xl font-black tracking-[-0.04em] text-foreground uppercase">
              Architecture
            </h1>
            <p className="text-muted-foreground mt-1 text-base font-medium">
              Welcome back, <span className="text-primary font-black">Admin</span>. Here is your platform overview.
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
              <input
                type="text"
                placeholder="Search Quizzes..."
                className="pl-12 pr-6 h-[56px] rounded-2xl bg-card border border-border/50 focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all w-full md:w-72 text-sm font-bold shadow-sm"
              />
            </div>

            <Link to="/quiz/create" className="btn-premium glow-primary h-[56px] px-8 border border-primary/20 bg-primary text-white flex items-center gap-2 hover:scale-[1.02] transition-all rounded-2xl font-black uppercase tracking-widest text-[10px]">
              <PlusCircle size={20} />
              Create Quiz
            </Link>
          </div>
        </div>

        {/* 2. STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8 animate-reveal">
          <StatsCard
            title="Total Quizzes"
            value={stats?.totalQuizzes || 0}
            icon={FileText}
            trend={stats?.trends?.quizzes || "+0 this week"}
            isPositive={true}
            color="text-primary"
            bg="bg-primary/5"
          />
          <StatsCard
            title="Total Leads"
            value={stats?.totalLeads || 0}
            icon={Users}
            trend={stats?.trends?.leads || "+0 today"}
            isPositive={true}
            color="text-indigo-500"
            bg="bg-indigo-500/5"
          />
          <StatsCard
            title="Total Sessions"
            value={stats?.totalSessions || 0}
            icon={CheckCircle}
            trend={stats?.trends?.sessions || "+0 organic"}
            isPositive={true}
            color="text-emerald-500"
            bg="bg-emerald-500/5"
          />
          <StatsCard
            title="Conversion"
            value={stats?.conversionRate || "0%"}
            icon={TrendingUp}
            trend={stats?.trends?.conversion || "0% growth"}
            isPositive={true}
            color="text-rose-500"
            bg="bg-rose-500/5"
          />
        </div>

        {/* 3. ANALYTICS ROW: Funnel + Recent Leads + Top Quizzes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8 animate-reveal">
          {/* 3a. Global Conversion Funnel */}
          <div className="bg-card border border-border/50 rounded-[28px] p-6 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-foreground tracking-tight">Conversion Funnel</h3>
                  <p className="text-[10px] text-muted-foreground font-medium">Global drop-off analysis</p>
                </div>
              </div>
              <span className="text-[9px] font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-lg uppercase tracking-widest border border-border/50">All time</span>
            </div>

            <div className="h-[200px]">
              {analyticsLoading ? (
                <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" size={24} /></div>
              ) : funnelData.length > 0 && funnelData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 10, left: 5, bottom: 0 }} barSize={20}>
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name" type="category" width={80}
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                      axisLine={false} tickLine={false}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(99,102,241,0.04)', radius: 8 }} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]} background={{ fill: 'rgba(241,245,249,0.5)', radius: [0, 6, 6, 0] }}>
                      {funnelData.map((_, i) => <Cell key={i} fill={FUNNEL_COLORS[i % FUNNEL_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 gap-2">
                  <BarChart3 size={36} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">No data yet</p>
                </div>
              )}
            </div>
          </div>

          {/* 3b. Recent Leads */}
          <div className="bg-card border border-border/50 rounded-[28px] p-6 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-foreground tracking-tight">Recent Leads</h3>
                  <p className="text-[10px] text-muted-foreground font-medium">Latest email captures</p>
                </div>
              </div>
              <span className="text-[9px] font-bold text-indigo-500 bg-indigo-500/5 px-2.5 py-1 rounded-lg border border-indigo-500/10 uppercase tracking-widest">{recentLeads.length} new</span>
            </div>

            {analyticsLoading ? (
              <div className="h-[200px] flex items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" size={24} /></div>
            ) : recentLeads.length > 0 ? (
              <div className="space-y-2">
                {recentLeads.map((lead, idx) => (
                  <div key={lead._id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors group">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0 bg-gradient-to-br ${idx % 3 === 0 ? 'from-indigo-500 to-violet-600' :
                      idx % 3 === 1 ? 'from-emerald-500 to-teal-600' :
                        'from-amber-500 to-orange-600'
                      }`}>
                      {lead.firstName?.[0] || 'U'}{lead.lastName?.[0] || ''}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {lead.firstName || 'Unknown'} {lead.lastName || ''}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">{lead.email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[9px] text-muted-foreground font-medium">
                        {lead.createdAt ? formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true }) : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground/30 gap-2">
                <Users size={36} />
                <p className="text-[10px] font-bold uppercase tracking-widest">No leads yet</p>
              </div>
            )}
          </div>

          {/* 3c. Top Performing Quizzes */}
          <div className="bg-card border border-border/50 rounded-[28px] p-6 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Activity size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-foreground tracking-tight">Top Performers</h3>
                  <p className="text-[10px] text-muted-foreground font-medium">Quiz performance ranking</p>
                </div>
              </div>
            </div>

            {analyticsLoading ? (
              <div className="h-[200px] flex items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" size={24} /></div>
            ) : quizPerformance.length > 0 ? (
              <div className="space-y-2.5">
                {quizPerformance.slice(0, 4).map((quiz, idx) => (
                  <div
                    key={quiz._id}
                    onClick={() => navigate(`/quiz/${quiz._id}/builder`)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white shrink-0 ${idx === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                      idx === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500' :
                        idx === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800' :
                          'bg-slate-200 text-slate-500'
                      }`}>
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">{quiz.title}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {quiz.sessions} sessions · {quiz.leads} leads
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className={`text-xs font-black ${quiz.conversionRate >= 80 ? 'text-emerald-500' : quiz.conversionRate >= 50 ? 'text-amber-500' : 'text-rose-400'}`}>
                        {quiz.conversionRate}%
                      </span>
                      <p className="text-[9px] text-muted-foreground font-medium">conv.</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground/30 gap-2">
                <Activity size={36} />
                <p className="text-[10px] font-bold uppercase tracking-widest">No quiz data</p>
              </div>
            )}
          </div>
        </div>

        {/* 4. RECENT ACTIVITY TABLE */}
        <div className="glass-panel rounded-[40px] overflow-hidden animate-reveal border border-border/50">
          <div className="p-10 border-b border-border/10 flex justify-between items-center bg-card/40 backdrop-blur-3xl">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground/30 border border-border/50">
                <Clock size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-foreground tracking-tight">Recent Activity</h2>
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
                  <th className="px-6 py-6 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em]">Registry Name</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em]">Status</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em]">Endpoint</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em]">Timestamp</th>
                  <th className="px-6 py-6 text-right text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em]">Command</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/5">
                {isQuizzesLoading ? (
                  <tr>
                    <td colSpan="5" className="px-10 py-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-6">
                        <Loader2 className="animate-spin text-primary" size={40} />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Synchronizing Data...</span>
                      </div>
                    </td>
                  </tr>
                ) : quizzesData?.quizzes?.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-10 py-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-4 opacity-40">
                        <FileText size={48} className="text-muted-foreground" />
                        <p className="text-muted-foreground font-medium italic text-lg">The registry is currently empty.</p>
                        <Link to="/quiz/create" className="text-primary text-xs font-black uppercase tracking-widest mt-2 hover:underline">Launch your first quiz</Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  quizzesData?.quizzes?.map((quiz, i) => (
                    <tr key={quiz._id} className="group hover:bg-primary/[0.02] transition-all cursor-pointer">
                      <td className="px-6 py-6 whitespace-nowrap" onClick={() => navigate(`/quiz/${quiz._id}/builder`)}>
                        <div className="flex items-center gap-4">
                          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white font-black text-[12px] shadow-2xl transition-transform group-hover:scale-110 duration-500
                              ${i % 3 === 0 ? 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-500/10' :
                              i % 3 === 1 ? 'bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-500/10' :
                                'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/10'}`
                          }>
                            {quiz.title.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-black text-foreground group-hover:text-primary transition-colors tracking-tight mb-0.5">{quiz.title}</div>
                            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Production Entity</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap" onClick={() => navigate(`/quiz/${quiz._id}/builder`)}>
                        <span className={`px-3 py-1 inline-flex text-[9px] font-black uppercase tracking-widest rounded-full border
                            ${quiz.status === 'draft' ? 'bg-yellow-500/5 text-yellow-600 border-yellow-500/10' : 'bg-emerald-500/5 text-emerald-600 border-emerald-500/10'}`
                        }>
                          {quiz.status}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-[11px] text-muted-foreground font-mono font-bold tracking-tight opacity-70">
                        <a
                          href={`/quiz/${quiz.handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors flex items-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          /quiz/{quiz.handle}
                          <ArrowUpRight size={12} className="opacity-40" />
                        </a>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center">
                        <Clock size={12} className="mr-2 opacity-40" />
                        {quiz.createdAt ? formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true }) : 'Just now'}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/quiz/${quiz._id}/builder`)}
                            className="h-9 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all border border-primary/10 flex items-center gap-2 group/build"
                          >
                            <Sparkles size={13} className="group-hover/build:scale-125 transition-transform" />
                            Build
                          </button>
                          <button
                            onClick={() => handleDelete(quiz._id, quiz.title)}
                            className="w-9 h-9 flex items-center justify-center text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all border border-transparent hover:border-rose-500/10"
                            title="Delete Quiz"
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

            {/* PAGINATION CONTROLS */}
            {!isQuizzesLoading && quizzesData?.pages > 1 && (
              <div className="px-6 py-4 border-t border-border/10 flex items-center justify-between bg-muted/5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Page {page} of {quizzesData.pages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-card border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowUpRight size={14} className="rotate-[-135deg]" />
                  </button>
                  <button
                    disabled={page === quizzesData.pages}
                    onClick={() => setPage(p => Math.min(quizzesData.pages, p + 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-card border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowUpRight size={14} className="rotate-[45deg]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null, name: '' })}
        onConfirm={confirmDelete}
        title="Delete Quiz?"
        message={`You are about to remove "${confirmModal.name}". This will permanently delete all associated questions and data.`}
        confirmText="Confirm Removal"
        cancelText="Keep Quiz"
        type="danger"
      />
    </>
  );
};

export default Dashboard;
