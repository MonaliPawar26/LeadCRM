const mongoose = require('mongoose');

const noteSchema = mongoose.Schema(
  {
    note: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }
);

const leadSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    source: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Converted'],
      default: 'New',
    },
    notes: [noteSchema],
  },
  {
    timestamps: true,
  }
);

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
