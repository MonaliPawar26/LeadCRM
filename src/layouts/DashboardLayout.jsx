import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, LogOut, Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Leads', path: '/leads' },
];

/* ── One-time dashboard reveal overlay ─────────────────────────────────── */
const DashboardReveal = ({ onDone }) => (
  <motion.div
    className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none"
    style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}
    initial={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    transition={{ duration: 0.4, delay: 0.4, ease: 'easeInOut' }}
    onAnimationComplete={onDone}
  >
    {/* Center brand mark */}
    <motion.div
      className="relative z-10 flex flex-col items-center gap-5"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 0 50px rgba(99,102,241,0.6)' }}
      >
        <LayoutDashboard size={38} className="text-white" />
      </div>
      <div className="text-white font-black text-xl tracking-widest uppercase flex items-center gap-2">
        <Zap size={18} className="text-yellow-400" fill="currentColor" />
        LeadFlow CRM
      </div>
      {/* Loading shimmer bar */}
      <div className="w-40 h-0.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #6366f1, #34d399)' }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  </motion.div>
);

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={toggleSidebar} />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0 lg:h-full`}
        style={{ background: 'linear-gradient(180deg, #0f0c29 0%, #1e1b4b 50%, #131228 100%)' }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/40"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="font-black text-white text-sm tracking-tight">LeadFlow CRM</span>
          </div>
          <button className="lg:hidden text-white/40 hover:text-white transition-colors" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>

        {/* Live Status */}
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">System Live</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 pt-4 space-y-1">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest px-3 mb-3">Main Menu</p>
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.div key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}>
                <NavLink to={item.path} className="relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group">
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div layoutId="activeNav"
                          className="absolute inset-0 rounded-2xl"
                          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(99,102,241,0.15))' }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-indigo-400" />
                      )}
                      <item.icon size={18}
                        className={`relative z-10 transition-colors ${isActive ? 'text-indigo-300' : 'text-white/30 group-hover:text-white/60'}`} />
                      <span className={`relative z-10 text-sm font-bold transition-colors ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              </motion.div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-6">
          <div className="border-t border-white/5 pt-4">
            <button onClick={handleLogout}
              className="group flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all hover:bg-red-500/10">
              <LogOut size={18} className="text-white/25 group-hover:text-red-400 transition-colors" />
              <span className="text-sm font-bold text-white/25 group-hover:text-red-400 transition-colors">Logout</span>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showReveal, setShowReveal] = useState(() => {
    // Only show the reveal animation once per browser session
    const seen = sessionStorage.getItem('crm_dashboard_seen');
    if (!seen) { sessionStorage.setItem('crm_dashboard_seen', '1'); return true; }
    return false;
  });
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="flex h-screen" style={{ background: '#f0f2f8' }}>
      {/* One-time cinematic reveal after login */}
      {showReveal && <DashboardReveal onDone={() => setShowReveal(false)} />}

      {/* Desktop sidebar — Instant load, no animations */}
      <div className="hidden lg:flex h-full shrink-0">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
      </div>
      {/* Mobile sidebar (no spring wrapper, uses its own translate) */}
      <div className="lg:hidden">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header slides down */}
        <motion.header
          className="h-16 flex items-center justify-between px-6 shrink-0"
          style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 160, damping: 22, delay: 0.2 }}
        >
          <button className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={22} className="text-slate-600" />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-400 leading-none">Administrator</p>
              <p className="text-sm font-black text-slate-800 leading-none mt-0.5">{user?.email?.split('@')[0] || 'Admin'}</p>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/30"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              {(user?.email?.[0] || 'A').toUpperCase()}
            </div>
          </div>
        </motion.header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.05 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;
