import React, { useState, useEffect } from 'react';
import apiClient from '../../../lib/axios';
import {
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronDown,
  BarChart3,
  PieChart as PieIcon,
  MousePointer2,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const AnalyticsDashboard = ({ quizId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [quizId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/analytics/performance/${quizId}?range=${timeRange}`);
      setData(res); // apiClient unwraps response.data
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-white/20 font-black uppercase tracking-widest text-[10px]">Processing Metrics...</p>
    </div>
  );

  if (!data) return (
    <div className="glass-panel rounded-[3rem] border border-white/5 p-20 text-center">
      <AlertCircle className="mx-auto text-white/10 mb-6" size={64} />
      <h3 className="text-xl font-black">No Data Records</h3>
      <p className="text-white/20 mt-2">Start your campaign to see live data here.</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Starts', value: data.overview.starts, change: '+12%', icon: PlayIcon },
          { label: 'Completion Rate', value: `${data.overview.completionRate}%`, change: '+5%', icon: CheckCircle2 },
          { label: 'Leads Captured', value: data.overview.leads, change: '+18%', icon: Users },
          { label: 'Avg. Interaction', value: '2.4m', change: '-3%', icon: Clock },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-3xl border border-white/5 group hover:bg-white/[0.04] transition-all">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{stat.label}</p>
              <div className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {stat.change}
              </div>
            </div>
            <h3 className="text-3xl font-black">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Performance Chart */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border border-white/5">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black">Conversion Funnel</h3>
              <p className="text-white/20 text-sm font-medium">Customer journey from entry to lead</p>
            </div>
            <BarChart3 className="text-blue-500/40" />
          </div>

          <div className="h-64 mt-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.funnel} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="step" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 12, fontWeight: 700 }} />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" radius={[12, 12, 4, 4]}>
                  {data.funnel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === data.funnel.length - 1 ? '#3b82f6' : 'rgba(255,255,255,0.05)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution */}
        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5">
          <h3 className="text-xl font-black mb-10">Outcome Mix</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.distribution}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][index % 4]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {data.distribution.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][i % 4] }} />
                  <span className="text-xs font-bold text-white/40">{d.name}</span>
                </div>
                <span className="text-xs font-black">{Math.round((d.value / data.overview.completed) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drop-off Deep Dive */}
      <div className="glass-panel p-8 rounded-[3rem] border border-white/5">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="text-rose-500" />
          <h3 className="text-xl font-black">Drop-off Analysis</h3>
        </div>

        <div className="grid gap-4">
          {data.dropOff.map((q, i) => (
            <div key={i} className="flex items-center gap-6 p-4 hover:bg-white/[0.02] rounded-2xl transition-colors">
              <div className="w-10 text-xs font-black text-white/20">Q{i + 1}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold truncate max-w-md">{q.questionText}</span>
                  <span className="text-xs font-black text-rose-500">{q.dropOffRate}% Drop</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500/40 rounded-full" style={{ width: `${q.dropOffRate}%` }} />
                </div>
              </div>
              <div className="w-20 text-right text-xs font-bold text-white/40">
                {q.exits} exits
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Mock Icon
const PlayIcon = ({ size }) => <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-[10px] font-black">►</div>;

export default AnalyticsDashboard;
