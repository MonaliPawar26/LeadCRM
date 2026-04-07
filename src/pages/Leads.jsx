import { useState, useEffect } from 'react';
import { leadService } from '../services/api';
import {
  Search, Filter, Eye, Trash2, ChevronLeft, ChevronRight,
  ArrowUpDown, Plus, X, Users, CheckCircle, Clock, UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Status badge ────────────────────────── */
const StatusBadge = ({ status }) => {
  const cfg = {
    New:       { bg: 'bg-orange-100',  text: 'text-orange-600',  dot: 'bg-orange-400' },
    Contacted: { bg: 'bg-indigo-100',  text: 'text-indigo-600',  dot: 'bg-indigo-400' },
    Converted: { bg: 'bg-emerald-100', text: 'text-emerald-600', dot: 'bg-emerald-400' },
  }[status] || { bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-400' };

  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-black px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
};

/* ─── Summary pill ────────────────────────── */
const SummaryPill = ({ icon: Icon, label, value, color }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${color} bg-white shadow-sm`}>
    <Icon size={16} className="shrink-0" />
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">{label}</p>
      <p className="text-xl font-black text-slate-900 leading-tight mt-0.5">{value}</p>
    </div>
  </div>
);

/* ─── Add Lead Modal ──────────────────────── */
const AddLeadModal = ({ onClose, onAdded }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', source: 'Website Contact Form', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const added = await leadService.submit(form);
      onAdded(added);
      onClose();
    } catch { alert('Failed to add lead'); }
    finally { setLoading(false); }
  };

  const fields = [
    { name: 'name',    label: 'Full Name',      type: 'text',  placeholder: 'e.g. Rahul Singh', half: true },
    { name: 'email',   label: 'Email',           type: 'email', placeholder: 'rahul@example.com', half: true },
    { name: 'phone',   label: 'Phone Number',    type: 'text',  placeholder: '+91 9876543210', half: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-md" onClick={onClose} />

      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', stiffness: 150 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden z-10">

        {/* Accent bar */}
        <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #6366f1, #818cf8, #34d399)' }} />

        <div className="p-8">
          <div className="flex items-center justify-between mb-7">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add New Lead</h2>
              <p className="text-sm font-medium text-slate-400 mt-1">Fill in the details below</p>
            </div>
            <button onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {fields.map(({ name, label, type, placeholder }) => (
                <div key={name} className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">{label}</label>
                  <input required type={type} placeholder={placeholder}
                    value={form[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              ))}

              <div className="col-span-2 sm:col-span-1 space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Source</label>
                <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:border-indigo-500 focus:outline-none transition-all appearance-none">
                  {['Website Contact Form','LinkedIn Outreach','Referral Network','Direct Call','Google Search','Instagram Ad'].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Initial Message</label>
              <textarea rows="3" placeholder="Any notes or initial inquiry…"
                value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all resize-none" />
            </div>

            <div className="flex gap-3 pt-2">
              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex-1 py-3.5 rounded-2xl font-black text-white text-sm shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                {loading ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><Plus size={16} /> Add Lead</>}
              </motion.button>
              <button type="button" onClick={onClose}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Main Leads Page ─────────────────────── */
const ITEMS_PER_PAGE = 10;

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try { setLeads(await leadService.getAll()); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await leadService.delete(id);
      setLeads(prev => prev.filter(l => l._id !== id));
    } catch { alert('Failed to delete lead'); }
  };

  const filtered = leads
    .filter(l => {
      const q = searchTerm.toLowerCase();
      return (l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q)) &&
        (statusFilter === 'All' || l.status === statusFilter);
    })
    .sort((a, b) => sortBy === 'newest'
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt));

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const summary = [
    { icon: Users,       label: 'Total',     value: leads.length,                                          color: 'border-blue-100 text-blue-500' },
    { icon: Clock,       label: 'New',        value: leads.filter(l => l.status === 'New').length,          color: 'border-orange-100 text-orange-500' },
    { icon: UserCheck,   label: 'Contacted',  value: leads.filter(l => l.status === 'Contacted').length,    color: 'border-indigo-100 text-indigo-500' },
    { icon: CheckCircle, label: 'Converted',  value: leads.filter(l => l.status === 'Converted').length,    color: 'border-emerald-100 text-emerald-500' },
  ];

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Leads Management</h1>
          <p className="text-slate-400 font-medium mt-1">Track, filter and manage your entire pipeline.</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-white text-sm shadow-lg shadow-indigo-500/25"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Plus size={17} /> Add Lead
          </motion.button>
          <motion.button whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }}
            onClick={fetchLeads}
            className="p-2.5 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-indigo-600 shadow-sm transition-colors">
            <ArrowUpDown size={18} />
          </motion.button>
        </div>
      </motion.div>

      {/* ── Summary pills ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.04 }} whileHover={{ y: -3 }}>
            <SummaryPill {...s} />
          </motion.div>
        ))}
      </motion.div>

      {/* ── Table card ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

        {/* Filters toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input type="text" placeholder="Search by name or email…"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
              value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-xl">
              {['All', 'New', 'Contacted', 'Converted'].map(s => (
                <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    statusFilter === s
                      ? 'bg-white text-indigo-600 shadow-sm border border-indigo-100'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/70">
                {['#', 'Lead Info', 'Phone', 'Source', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <motion.tr key={`skel-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 bg-slate-100 rounded-full animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                        </td>
                      ))}
                    </motion.tr>
                  ))
                ) : paginated.length === 0 ? (
                  <motion.tr key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                          <Filter size={24} className="text-slate-300" />
                        </div>
                        <p className="text-base font-bold text-slate-400">No leads found</p>
                        <p className="text-sm text-slate-300">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  paginated.map((lead, i) => (
                    <motion.tr key={lead._id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ delay: i * 0.03, type: 'spring', stiffness: 160 }}
                      className="border-t border-slate-50 hover:bg-indigo-50/30 transition-colors group"
                    >
                      {/* # */}
                      <td className="px-5 py-4 text-xs font-black text-slate-300">
                        {(page - 1) * ITEMS_PER_PAGE + i + 1}
                      </td>
                      {/* Name / email */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm"
                            style={{ background: `hsl(${(lead.name.charCodeAt(0) * 15) % 360}, 65%, 55%)` }}>
                            {lead.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{lead.name}</p>
                            <p className="text-xs text-slate-400 truncate">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      {/* Phone */}
                      <td className="px-5 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap">{lead.phone}</td>
                      {/* Source */}
                      <td className="px-5 py-4">
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg whitespace-nowrap">{lead.source}</span>
                      </td>
                      {/* Date */}
                      <td className="px-5 py-4 text-xs text-slate-400 whitespace-nowrap font-semibold">
                        {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4"><StatusBadge status={lead.status} /></td>
                      {/* Actions — always visible */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <Link to={`/leads/${lead._id}`}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                            <Eye size={16} />
                          </Link>
                          <button onClick={() => handleDelete(lead._id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <p className="text-xs font-bold text-slate-400">
            Showing <span className="text-slate-700">{Math.min(filtered.length, (page - 1) * ITEMS_PER_PAGE + paginated.length)}</span> of <span className="text-slate-700">{filtered.length}</span> leads
          </p>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className="p-1.5 border border-slate-200 rounded-xl text-slate-400 hover:bg-white hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-black text-slate-600 px-2">{page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
              className="p-1.5 border border-slate-200 rounded-xl text-slate-400 hover:bg-white hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Add Lead Modal ── */}
      <AnimatePresence>
        {showModal && (
          <AddLeadModal
            onClose={() => setShowModal(false)}
            onAdded={lead => setLeads(prev => [lead, ...prev])}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leads;
