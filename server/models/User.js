const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'coordinator', 'recruiter', 'admin'],
    required: true
  },
  // Student specific details
  branch: {
    type: String,
    default: ''
  },
  year: {
    type: Number,
    default: null
  },
  cgpa: {
    type: Number,
    default: null
  },
  skills: {
    type: [String],
    default: []
  },
  projects: [{
    title: String,
    description: String,
    technologies: String,
    link: String
  }],
  resumeUrl: {
    type: String,
    default: ''
  },
  resumeName: {
    type: String,
    default: ''
  },
  profileCompletion: {
    type: Number,
    default: 0
  },
  // Recruiter specific details
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
