const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  driveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobDrive',
    required: true
  },
  package: {
    type: Number, // LPA
    required: true
  },
  offerLetter: {
    type: String, // Offer letter description, document text, or PDF URL
    required: true
  },
  status: {
    type: String,
    enum: ['Released', 'Accepted', 'Rejected'],
    default: 'Released'
  },
  joiningDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Offer', offerSchema);
