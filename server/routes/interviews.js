const express = require('express');
const router = express.Router();
const {
  scheduleInterview,
  getInterviews,
  updateInterview
} = require('../controllers/interviewController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(protect, authorize('recruiter', 'coordinator', 'admin'), scheduleInterview)
  .get(protect, getInterviews);

router.route('/:id')
  .put(protect, authorize('recruiter', 'coordinator', 'admin'), updateInterview);

module.exports = router;
