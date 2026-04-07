const express = require('express');
const router = express.Router();
const {
  submitLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  addNote,
} = require('../controllers/leadController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.post('/', submitLead);
router.get('/', protect, getLeads);
router.get('/:id', protect, getLeadById);
router.put('/:id', protect, updateLead);
router.delete('/:id', protect, deleteLead);
router.post('/:id/notes', protect, addNote);

module.exports = router;
