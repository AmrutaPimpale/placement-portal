const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
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
  interviewDate: {
    type: Date,
    required: true
  },
  mode: {
    type: String,
    enum: ['Online', 'Offline'],
    required: true
  },
  meetingLink: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'Absent'],
    default: 'Scheduled'
  },
  round: {
    type: String,
    default: 'Technical Round'
  },
  feedback: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Interview', interviewSchema);
