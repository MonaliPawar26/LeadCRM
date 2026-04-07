import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { Mail, Lock, Loader2, ArrowRight, TrendingUp, Users, CheckCircle, Zap, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

/* ── Cinematic Login → Dashboard Transition ─── */
const LoginTransition = ({ visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        key="login-transition"
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Center icon + label */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 0 40px rgba(99,102,241,0.6)' }}
          >
            <LayoutDashboard size={36} className="text-white" />
          </div>
          <p className="text-white font-black text-lg tracking-widest uppercase mt-2">
            Launching Dashboard
          </p>
          {/* Progress bar */}
          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-1">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #6366f1, #34d399)' }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.75, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ── Floating particle ───────────────────────── */
const Particle = ({ x, y, size, delay, duration }) => (
  <motion.div
    className="absolute rounded-full bg-white/10 pointer-events-none"
    style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
    animate={{ y: [-20, 20, -20], x: [-10, 10, -10], opacity: [0.3, 0.7, 0.3] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

/* ── Animated stat pill on left panel ─────── */
const StatPill = ({ icon: Icon, label, value, delay, color }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, type: 'spring', stiffness: 100 }}
    className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3"
  >
    <div className={`p-2 rounded-xl ${color}`}>
      <Icon size={16} className="text-white" />
    </div>
    <div>
      <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest leading-none">{label}</p>
      <p className="text-white font-black text-base leading-tight mt-0.5">{value}</p>
    </div>
  </motion.div>
);

/* ── Typewriter hook ─────────────────────────── */
const useTypewriter = (text, speed = 60, delay = 800) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        setDisplayed(text.slice(0, ++i));
        if (i >= text.length) clearInterval(iv);
      }, speed);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text, speed, delay]);
  return displayed;
};

/* ── Input field with animated border ──────── */
const AnimatedInput = ({ icon: Icon, label, type, placeholder, value, onChange, delay }) => {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 120 }}
      className="space-y-2"
    >
      <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
        <Icon size={14} className="text-indigo-400" />
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          required
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full px-4 py-3.5 bg-slate-50 border-2 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all duration-200"
          style={{
            borderColor: focused ? '#6366f1' : '#e2e8f0',
            boxShadow: focused ? '0 0 0 4px rgba(99,102,241,0.12)' : 'none',
            background: focused ? '#fff' : '#f8fafc',
          }}
        />
        <AnimatePresence>
          {focused && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              className="absolute bottom-0 left-4 right-4 h-0.5 bg-indigo-500 rounded-full origin-left"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/* ── Main Login Page ─────────────────────────── */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const tagline = useTypewriter('Manage smarter. Convert faster.', 55, 1000);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await authService.login(email, password);
      login(data);
      setSuccess(true);
      // Short delay so the button turns green before the overlay fires
      setTimeout(() => {
        setTransitioning(true);
        // Navigate after the portal animation plays (~900ms)
        setTimeout(() => navigate('/'), 900);
      }, 250);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const particles = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    x: Math.random() * 100, y: Math.random() * 100,
    size: 6 + Math.random() * 20,
    delay: i * 0.3,
    duration: 4 + Math.random() * 4,
  })), []);
  // eslint-enable-next-line react-hooks/exhaustive-deps

  return (
    <>
      <LoginTransition visible={transitioning} />
    <div className="min-h-screen flex overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>

      {/* ─── LEFT PANEL ─────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[55%] relative overflow-hidden p-14">

        {/* Animated blob background */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-120px] left-[-80px] w-[500px] h-[500px] rounded-full opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-[-100px] right-[-60px] w-[400px] h-[400px] rounded-full opacity-25 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)' }}
        />

        {/* Particles */}
        {particles.map((p, i) => <Particle key={i} {...p} />)}

        {/* Brand */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <span className="text-white font-black text-xl tracking-tight">LeadFlow CRM</span>
          </motion.div>
        </div>

        {/* Main copy */}
        <div className="relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
              Your leads.<br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #818cf8, #34d399)' }}>
                Your growth.
              </span>
            </h1>
            <p className="mt-4 text-white/50 text-lg font-medium min-h-[28px]">
              {tagline}<span className="animate-pulse">|</span>
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatPill icon={Users}       label="Active Leads"  value="50+"  delay={0.8}  color="bg-indigo-500/60" />
            <StatPill icon={TrendingUp}  label="Conversion"   value="32%"  delay={0.95} color="bg-emerald-500/60" />
            <StatPill icon={CheckCircle} label="Deals Closed" value="16"   delay={1.1}  color="bg-orange-500/60" />
            <StatPill icon={Zap}         label="Data Sources"  value="6"    delay={1.25} color="bg-purple-500/60" />
          </div>
        </div>

        {/* Bottom attribution */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="relative z-10 text-white/30 text-xs font-semibold"
        >
          © 2026 LeadFlow CRM • Built for high-velocity sales teams
        </motion.p>
      </div>

      {/* ─── RIGHT PANEL (form) ─────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white/5 backdrop-blur-2xl relative">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          className="w-full max-w-md"
        >
          <div
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20"
            style={{ boxShadow: '0 40px 80px -20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)' }}
          >
            {/* Card top accent */}
            <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #6366f1, #818cf8, #34d399)' }} />

            <div className="p-10">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-10"
              >
                <div className="flex items-center gap-2 mb-1 lg:hidden">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <Zap size={14} className="text-white" />
                  </div>
                  <span className="font-black text-slate-800">LeadFlow CRM</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h2>
                <p className="text-slate-400 font-medium mt-1 text-sm">Sign in with any credentials to continue</p>
              </motion.div>

              {/* Error banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm font-semibold text-red-600 text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatedInput
                  icon={Mail} label="Email Address" type="email"
                  placeholder="you@company.com"
                  value={email} onChange={e => setEmail(e.target.value)} delay={0.35}
                />
                <AnimatedInput
                  icon={Lock} label="Password" type="password"
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} delay={0.45}
                />

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading || success}
                  className="w-full h-13 rounded-2xl font-black text-white flex items-center justify-center gap-2 text-base transition-all relative overflow-hidden mt-2"
                  style={{
                    background: success
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    boxShadow: '0 8px 24px -4px rgba(99,102,241,0.5)',
                    height: '52px',
                  }}
                >
                  {/* Shimmer overlay */}
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                  />

                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Loader2 size={22} className="animate-spin" />
                      </motion.span>
                    ) : success ? (
                      <motion.span key="success" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2">
                        <CheckCircle size={20} /> Redirecting…
                      </motion.span>
                    ) : (
                      <motion.span key="signin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2 relative z-10">
                        Sign In <ArrowRight size={18} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400"
              >
                <span>Any credentials work in demo mode</span>
                <span className="flex items-center gap-1 font-semibold text-emerald-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  System Online
                </span>
              </motion.div>
            </div>
          </div>

          {/* Card reflection / glow */}
          <div className="h-8 mx-8 rounded-b-3xl opacity-20 blur-xl -mt-2"
            style={{ background: 'linear-gradient(135deg, #6366f1, #34d399)' }} />
        </motion.div>
      </div>
    </div>
    </>
  );
};

export default Login;
