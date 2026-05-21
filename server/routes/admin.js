const express = require('express');
const router = express.Router();
const {
  getStudents,
  getCompanies,
  getAnalytics,
  manageUsers,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.get('/students', protect, authorize('coordinator', 'admin'), getStudents);
router.get('/companies', protect, authorize('coordinator', 'admin'), getCompanies);
router.get('/analytics', protect, getAnalytics); // Available to all logged-in roles to populate dashboards

// Admin only user management
router.get('/users', protect, authorize('admin'), manageUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
