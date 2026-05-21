const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    unique: true
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  email: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    default: ''
  },
  industry: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Company', companySchema);
