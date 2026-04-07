const { mockLeads } = require('../mockData.js');

let inMemoryLeads = [...mockLeads];

// @desc    Submit a lead
const submitLead = async (req, res) => {
  const { name, email, phone, source, message } = req.body;
  const lead = {
    _id: `mock-${Date.now()}`,
    name, email, phone, source, message,
    status: 'New',
    notes: [],
    createdAt: new Date().toISOString()
  };
  inMemoryLeads.unshift(lead);
  res.status(201).json(lead);
};

// @desc    Get all leads
const getLeads = async (req, res) => {
  res.json(inMemoryLeads);
};

// @desc    Get lead by ID
const getLeadById = async (req, res) => {
  const lead = inMemoryLeads.find(l => l._id.toString() === req.params.id);
  if (lead) return res.json(lead);
  res.status(404).json({ message: 'Lead not found' });
};

// @desc    Update lead status
const updateLead = async (req, res) => {
  const lead = inMemoryLeads.find(l => l._id.toString() === req.params.id);
  if (lead) {
    lead.status = req.body.status || lead.status;
    res.json(lead);
  } else {
    res.status(404).json({ message: 'Lead not found' });
  }
};

// @desc    Delete lead
const deleteLead = async (req, res) => {
  const index = inMemoryLeads.findIndex(l => l._id.toString() === req.params.id);
  if (index !== -1) {
    inMemoryLeads.splice(index, 1);
    res.json({ message: 'Lead removed' });
  } else {
    res.status(404).json({ message: 'Lead not found' });
  }
};

// @desc    Add note to lead
const addNote = async (req, res) => {
  const lead = inMemoryLeads.find(l => l._id.toString() === req.params.id);
  if (lead) {
    lead.notes.push({ note: req.body.note, timestamp: new Date() });
    res.json(lead);
  } else {
    res.status(404).json({ message: 'Lead not found' });
  }
};

module.exports = {
  submitLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  addNote,
};

