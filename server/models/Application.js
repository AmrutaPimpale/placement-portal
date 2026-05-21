const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobDrive',
    required: true
  },
  status: {
    type: String,
    enum: [
      'Applied',
      'Under Review',
      'Shortlisted',
      'Interview Scheduled',
      'Selected',
      'Rejected',
      'Offer Released'
    ],
    default: 'Applied'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  remarks: {
    type: String,
    default: ''
  }
});

// Ensure a student can only apply once to a job drive
applicationSchema.index({ studentId: 1, driveId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
