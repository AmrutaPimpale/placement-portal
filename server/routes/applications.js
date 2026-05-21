const express = require('express');
const router = express.Router();
const {
  applyJobDrive,
  getStudentApplications,
  getJobApplications,
  getAllApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/apply', protect, authorize('student'), applyJobDrive);
router.get('/my-applications', protect, authorize('student'), getStudentApplications);
router.get('/drive/:driveId', protect, authorize('recruiter', 'coordinator', 'admin'), getJobApplications);
router.get('/', protect, authorize('coordinator', 'admin'), getAllApplications);
router.put('/:id/status', protect, authorize('recruiter', 'coordinator', 'admin'), updateApplicationStatus);

module.exports = router;
