import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leadService } from '../services/api';
import { 
  ArrowLeft, Phone, Mail, MessageSquare, 
  Plus, Calendar, User, Info, Save, ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      const data = await leadService.getById(id);
      setLead(data);
    } catch (err) {
      console.error(err);
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const updatedLead = await leadService.updateStatus(id, newStatus);
      setLead(updatedLead);
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setIsAddingNote(true);
    try {
      const updatedLead = await leadService.addNote(id, noteText);
      setLead(updatedLead);
      setNoteText('');
    } catch (err) {
      alert('Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  if (loading) return <div className="p-8">Loading lead details...</div>;
  if (!lead) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <button 
        onClick={() => navigate('/leads')}
        className="flex items-center text-slate-500 hover:text-slate-900 transition-colors font-medium"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Leads
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="w-24 h-24 rounded-3xl bg-primary-100 flex items-center justify-center text-primary-600 text-3xl font-bold mx-auto mb-6">
              {lead.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{lead.name}</h2>
            <p className="text-slate-500 text-sm mb-6">{lead.source}</p>
            
            <div className={`inline-block px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider mb-8 ${
              lead.status === 'New' ? 'bg-orange-100 text-orange-600' : 
              lead.status === 'Contacted' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {lead.status}
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-slate-50 pt-8">
              {['New', 'Contacted', 'Converted'].map(status => (
                <button
                  key={status}
                  disabled={isUpdatingStatus || lead.status === status}
                  onClick={() => handleUpdateStatus(status)}
                  className={`text-[10px] font-bold py-2 rounded-lg transition-all ${
                    lead.status === status 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {status === 'Contacted' ? 'Contact' : status}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <Info size={16} className="mr-2 text-primary-600" />
              Contact Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-slate-600">
                <Mail size={16} className="mr-3 text-slate-400" />
                <span>{lead.email}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Phone size={16} className="mr-3 text-slate-400" />
                <span>{lead.phone}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Calendar size={16} className="mr-3 text-slate-400" />
                <span>Joined {new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes and Messages */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
              <MessageSquare size={20} className="mr-2 text-primary-600" />
              Lead Message
            </h3>
            <div className="bg-slate-50 p-6 rounded-xl text-slate-700 italic border-l-4 border-primary-500">
              "{lead.message}"
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900">Follow-up Notes</h3>
              <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                {lead.notes.length} Notes
              </span>
            </div>

            <form onSubmit={handleAddNote} className="mb-8">
              <div className="relative">
                <textarea
                  placeholder="Add a new follow-up note..."
                  className="w-full p-4 pr-12 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none h-24"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                ></textarea>
                <button
                  type="submit"
                  disabled={isAddingNote || !noteText.trim()}
                  className="absolute bottom-4 right-4 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors shadow-lg"
                >
                  <Save size={18} />
                </button>
              </div>
            </form>

            <div className="space-y-6">
              {lead.notes.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <Plus size={32} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No notes yet. Start tracking your progress!</p>
                </div>
              ) : (
                <div className="relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-slate-100">
                  {lead.notes.slice().reverse().map((note, index) => (
                    <div key={index} className="relative pl-10 pb-8 last:pb-0">
                      <div className="absolute left-3 top-2 w-2.5 h-2.5 rounded-full bg-primary-500 border-2 border-white shadow-sm z-10"></div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-sm text-slate-700 mb-2">{note.note}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {new Date(note.timestamp).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
