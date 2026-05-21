const express = require('express');
const router = express.Router();
const { 
  createJobDrive, 
  getJobDrives, 
  getJobDriveById, 
  updateJobDrive, 
  deleteJobDrive 
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(protect, authorize('recruiter', 'coordinator', 'admin'), createJobDrive)
  .get(protect, getJobDrives);

router.route('/:id')
  .get(protect, getJobDriveById)
  .put(protect, authorize('recruiter', 'coordinator', 'admin'), updateJobDrive)
  .delete(protect, authorize('recruiter', 'coordinator', 'admin'), deleteJobDrive);

module.exports = router;
