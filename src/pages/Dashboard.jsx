import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadService } from '../services/api';
import { Users, UserCheck, Clock, CheckCircle, TrendingUp, ArrowUpRight, Zap, Target, Award } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend
} from 'recharts';

/* ── Animated count-up ─────────────────────────────── */
const AnimatedNumber = ({ value, suffix = '' }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let c = 0;
    const step = Math.max(1, Math.ceil(value / 40));
    const t = setInterval(() => {
      c = Math.min(c + step, value);
      setDisplay(c);
      if (c >= value) clearInterval(t);
    }, 25);
    return () => clearInterval(t);
  }, [value]);
  return <>{display}{suffix}</>;
};

/* ── 3-D tilt card ─────────────────────────────────── */
const TiltCard = ({ children, className = '', style = {} }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rX = useTransform(y, [-80, 80], [12, -12]);
  const rY = useTransform(x, [-80, 80], [-12, 12]);
  const srX = useSpring(rX, { stiffness: 200, damping: 30 });
  const srY = useSpring(rY, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      style={{ rotateX: srX, rotateY: srY, transformStyle: 'preserve-3d', ...style }}
      onMouseMove={e => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left - r.width / 2);
        y.set(e.clientY - r.top - r.height / 2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ── Stat card with gradient glow ──────────────────── */
const StatCard = ({ title, value, suffix, icon: Icon, gradient, glow, trend, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, type: 'spring', stiffness: 100 }}
  >
    <TiltCard className="relative overflow-hidden rounded-3xl p-6 text-white cursor-default h-full"
      style={{ background: gradient, boxShadow: `0 20px 60px -10px ${glow}` }}>
      {/* Shine overlay */}
      <motion.div
        className="absolute inset-0 bg-white/10 rounded-3xl"
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'linear' }}
        style={{ clipPath: 'polygon(0 0, 30% 0, 45% 100%, 15% 100%)' }}
      />
      {/* Glowing orb */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-30 blur-2xl"
        style={{ background: 'white' }} />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-white/60 text-xs font-black uppercase tracking-widest">{title}</p>
          <h3 className="text-4xl font-black mt-2 tracking-tight drop-shadow-lg">
            <AnimatedNumber value={value} suffix={suffix} />
          </h3>
          {trend && (
            <div className="mt-3 flex items-center gap-1.5 bg-white/15 backdrop-blur-sm w-fit px-3 py-1 rounded-full">
              <TrendingUp size={11} />
              <span className="text-xs font-bold">{trend}</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
          <Icon size={22} />
        </div>
      </div>

      {/* Bottom bar mini spark */}
      <div className="relative z-10 mt-6 h-1 bg-white/20 rounded-full overflow-hidden">
        <motion.div className="h-full bg-white rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, (value / 60) * 100)}%` }}
          transition={{ delay: delay + 0.4, duration: 1, ease: 'easeOut' }}
        />
      </div>
    </TiltCard>
  </motion.div>
);

/* ── Glass chart card ───────────────────────────────── */
const ChartCard = ({ title, subtitle, children, delay = 0, accent = '#6366f1', className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: 'spring', stiffness: 90 }}
    className={`bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl ${className}`}
    style={{ boxShadow: `0 20px 60px -15px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)` }}
  >
    <div className="h-1" style={{ background: accent }} />
    <div className="p-7">
      <div className="mb-6">
        <h2 className="text-lg font-black text-slate-900">{title}</h2>
        {subtitle && <p className="text-xs font-semibold text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  </motion.div>
);

/* ── Custom tooltip glass ───────────────────────────── */
const GlassTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-2xl shadow-2xl">
      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-xs font-bold text-white">{p.name}: <span style={{ color: p.color }}>{p.value}</span></span>
        </div>
      ))}
    </div>
  );
};

/* ────────────────────────────────────────────────────── */
const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    leadService.getAll().then(setLeads).catch(console.error).finally(() => setLoading(false));
  }, []);

  /* Real weekly trend — date-normalised to avoid tz misses */
  const trendData = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();

    // Build 7-day window, midnight-normalised
    const week = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return {
        date: dayNames[d.getDay()],
        dateKey: d.toISOString().slice(0, 10),   // "YYYY-MM-DD"
        New: 0, Contacted: 0, Converted: 0,
      };
    });

    leads.forEach(l => {
      const key = new Date(l.createdAt).toISOString().slice(0, 10);
      const slot = week.find(w => w.dateKey === key);
      if (slot && l.status in slot) slot[l.status]++;
    });

    return week.map(({ date, New, Contacted, Converted }) => ({ date, New, Contacted, Converted }));
  }, [leads]);

  /* Source donut */
  const sourceData = useMemo(() => {
    const counts = {};
    leads.forEach(l => { counts[l.source] = (counts[l.source] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [leads]);

  /* Status funnel */
  const statusData = useMemo(() => [
    { name: 'New',       value: leads.filter(l => l.status === 'New').length,       fill: '#f97316' },
    { name: 'Contacted', value: leads.filter(l => l.status === 'Contacted').length, fill: '#6366f1' },
    { name: 'Converted', value: leads.filter(l => l.status === 'Converted').length, fill: '#10b981' },
  ], [leads]);

  /* Radar — source quality mock */
  const radarData = useMemo(() => {
    const src = sourceData.slice(0, 6);
    return src.map(s => ({ subject: s.name.split(' ')[0], A: s.value, fullMark: Math.max(...sourceData.map(x => x.value)) + 2 }));
  }, [sourceData]);

  const convRate = leads.length ? Math.round((leads.filter(l => l.status === 'Converted').length / leads.length) * 100) : 0;

  const PIE_COLORS = ['#6366f1','#f97316','#10b981','#ec4899','#f59e0b','#06b6d4'];

  const stats = [
    { title: 'Total Leads',  value: leads.length,                                          icon: Users,       gradient: 'linear-gradient(135deg,#667eea,#764ba2)', glow: 'rgba(102,126,234,0.6)',  trend: 'All-time pipeline', delay: 0 },
    { title: 'New Leads',    value: leads.filter(l => l.status === 'New').length,          icon: Clock,       gradient: 'linear-gradient(135deg,#f97316,#ef4444)', glow: 'rgba(249,115,22,0.6)',   trend: 'Awaiting contact',  delay: 0.06 },
    { title: 'Contacted',    value: leads.filter(l => l.status === 'Contacted').length,    icon: UserCheck,   gradient: 'linear-gradient(135deg,#06b6d4,#6366f1)', glow: 'rgba(6,182,212,0.6)',    delay: 0.12 },
    { title: 'Converted',    value: leads.filter(l => l.status === 'Converted').length,    icon: CheckCircle, gradient: 'linear-gradient(135deg,#10b981,#059669)', glow: 'rgba(16,185,129,0.6)',   trend: `${convRate}% rate`,  delay: 0.18, suffix: '' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
        className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600" />
    </div>
  );

  return (
    <div className="space-y-8 pb-12">

      {/* ── Hero header ── */}
      <div className="relative rounded-3xl p-8 text-white shadow-xl isolate"
        style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">Live Analytics</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight">Intelligence Hub</h1>
            <p className="text-white/50 mt-2 font-medium">Real-time CRM performance across {leads.length} active leads</p>
          </div>
          <div className="flex gap-4">
            {[
              { label: 'Conv. Rate', value: `${convRate}%`, color: '#10b981' },
              { label: 'Top Source', value: sourceData[0]?.name?.split(' ')[0] || '—', color: '#818cf8' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 text-center">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{label}</p>
                <p className="text-2xl font-black mt-1" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* ── Row 1: Stacked Area + Donut ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          className="lg:col-span-2"
          title="📈 Multi-Status Weekly Trend"
          subtitle="Real data by lead status across the last 7 days"
          accent="linear-gradient(90deg,#6366f1,#f97316,#10b981)"
          delay={0.1}
        >
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  {[['newGrad','#f97316'], ['contactGrad','#6366f1'], ['convertGrad','#10b981']].map(([id, color]) => (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} width={28} />
                <RechartsTooltip content={<GlassTooltip />} />
                <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 16, fontWeight: 700, fontSize: 11 }} />
                {[
                  { key: 'New',       color: '#f97316', grad: 'newGrad' },
                  { key: 'Contacted', color: '#6366f1', grad: 'contactGrad' },
                  { key: 'Converted', color: '#10b981', grad: 'convertGrad' },
                ].map(({ key, color, grad }) => (
                  <Area key={key} type="monotone" dataKey={key} name={key}
                    stroke={color} strokeWidth={3} fill={`url(#${grad})`} fillOpacity={1}
                    dot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7, fill: color, stroke: '#fff', strokeWidth: 2 }}
                    animationDuration={2000}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Colourful Donut */}
        <ChartCard title="🎯 Conversion Lifecycle" subtitle="Status breakdown from real data"
          accent="linear-gradient(90deg,#10b981,#6366f1)" delay={0.15}>
          <div className="h-56 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                  paddingAngle={6} dataKey="value" stroke="none"
                  animationBegin={300} animationDuration={1600}>
                  {statusData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <RechartsTooltip content={<GlassTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
              <p className="text-4xl font-black text-slate-900">{leads.length}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {statusData.map(s => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.fill }} />
                  <span className="text-xs font-bold text-slate-600">{s.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full"
                      style={{ background: s.fill }}
                      initial={{ width: 0 }}
                      animate={{ width: `${leads.length ? (s.value / leads.length) * 100 : 0}%` }}
                      transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="text-xs font-black text-slate-400 w-6 text-right">{s.value}</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* ── Row 2: Colourful Horizontal Bar + Radar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Rainbow Horizontal bar */}
        <ChartCard title="🌈 Lead Sources Breakdown" subtitle="Volume per acquisition channel"
          accent="linear-gradient(90deg,#f97316,#ec4899,#6366f1)" delay={0.2}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <defs>
                  {PIE_COLORS.map((c, i) => (
                    <linearGradient key={i} id={`rbGrad${i}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={c} stopOpacity={1} />
                      <stop offset="100%" stopColor={c} stopOpacity={0.4} />
                    </linearGradient>
                  ))}
                </defs>
                <XAxis type="number" hide allowDecimals={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 700 }} width={120} />
                <RechartsTooltip content={<GlassTooltip />} cursor={{ fill: 'rgba(99,102,241,0.04)' }} />
                <Bar dataKey="value" name="Leads" radius={[0, 12, 12, 0]} barSize={20} animationDuration={1600}>
                  {sourceData.map((_, i) => (
                    <Cell key={i} fill={`url(#rbGrad${i % PIE_COLORS.length})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Radar chart */}
        <ChartCard title="📡 Source Coverage Radar" subtitle="Relative lead volume per channel"
          accent="linear-gradient(90deg,#ec4899,#f59e0b)" delay={0.25}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 700 }} />
                <Radar name="Leads" dataKey="A" stroke="#6366f1" strokeWidth={2}
                  fill="#6366f1" fillOpacity={0.25} animationDuration={1500} />
                <RechartsTooltip content={<GlassTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* ── Row 3: Colourful Pie + Recent ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Colourful source pie */}
        <ChartCard title="🍩 Source Distribution" subtitle="Full-colour donut by acquisition channel"
          accent="linear-gradient(90deg,#f59e0b,#ec4899,#06b6d4)" delay={0.3}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" outerRadius={100} dataKey="value"
                  nameKey="name" paddingAngle={3} stroke="none"
                  animationBegin={200} animationDuration={1800}
                  label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}>
                  {sourceData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<GlassTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Recent Activity */}
        <ChartCard title="⚡ Recent Activity" subtitle="Latest 8 leads in the pipeline"
          accent="linear-gradient(90deg,#06b6d4,#10b981)" delay={0.35}>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {leads.slice(0, 8).map((lead, i) => (
              <motion.div key={lead._id}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.04 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer"
                onClick={() => navigate('/leads')}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow"
                  style={{ background: `hsl(${(lead.name.charCodeAt(0) * 40) % 360},65%,55%)` }}>
                  {lead.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{lead.name}</p>
                  <p className="text-[10px] text-slate-400 truncate font-medium">{lead.source}</p>
                </div>
                <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full shrink-0 ${
                  lead.status === 'New' ? 'bg-orange-100 text-orange-600' :
                  lead.status === 'Contacted' ? 'bg-indigo-100 text-indigo-600' :
                  'bg-emerald-100 text-emerald-600'}`}>
                  {lead.status}
                </span>
              </motion.div>
            ))}
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/leads')}
            className="w-full mt-4 py-2.5 rounded-2xl text-sm font-black text-indigo-600 border-2 border-indigo-200 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
            View All Leads <ArrowUpRight size={16} />
          </motion.button>
        </ChartCard>
      </div>

      {/* ── Dark CTA strip ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="relative overflow-hidden rounded-3xl p-8 text-white"
        style={{ background: 'linear-gradient(135deg,#0f172a,#1e1b4b)', borderTop: '4px solid', borderImage: 'linear-gradient(90deg,#6366f1,#f97316,#10b981) 1' }}>
        <div className="absolute inset-0 pointer-events-none">
          {[['#6366f1','-top-10 -right-10'],['#10b981','-bottom-10 -left-10']].map(([c, pos], i) => (
            <div key={i} className={`absolute w-48 h-48 rounded-full blur-3xl opacity-20 ${pos}`} style={{ background: c }} />
          ))}
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <Zap size={28} className="text-yellow-400" fill="currentColor" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">HyperGrowth Mode</h2>
              <p className="text-white/50 mt-1 font-medium">
                Pipeline active · <span className="text-emerald-400 font-bold">{convRate}% conversion</span> · {leads.length} leads tracked
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {[
              { label: 'Hottest Channel', val: sourceData[0]?.name?.split(' ')[0] || '—', icon: Target },
              { label: 'Efficiency',      val: '98.4%',                                    icon: Award },
            ].map(({ label, val, icon: Ic }) => (
              <div key={label} className="bg-white/8 border border-white/10 rounded-2xl px-5 py-4 text-center hover:border-white/25 transition-all cursor-default">
                <Ic size={16} className="text-white/40 mx-auto mb-1" />
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{label}</p>
                <p className="text-lg font-black text-white mt-0.5">{val}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default Dashboard;
