const mongoose = require('mongoose');

const jobDriveSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  package: {
    type: Number, // LPA
    required: true
  },
  eligibility: {
    cgpa: {
      type: Number,
      default: 0
    },
    branches: {
      type: [String],
      default: []
    }
  },
  deadline: {
    type: Date,
    required: true
  },
  driveDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'upcoming'],
    default: 'active'
  },
  description: {
    type: String,
    default: ''
  },
  requirements: {
    type: [String],
    default: []
  },
  location: {
    type: String,
    default: 'Remote'
  },
  jobType: {
    type: String,
    enum: ['Full Time', 'Internship', 'Contract'],
    default: 'Full Time'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JobDrive', jobDriveSchema);
