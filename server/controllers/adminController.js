const User = require('../models/User');
const Company = require('../models/Company');
const JobDrive = require('../models/JobDrive');
const Application = require('../models/Application');
const Offer = require('../models/Offer');

// @desc    Get all students (for management table)
// @route   GET /api/admin/students
// @access  Private (Coordinator, Admin)
const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all companies (for management table)
// @route   GET /api/admin/companies
// @access  Private (Coordinator, Admin)
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate('recruiterId', 'name email');
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get placement statistics and analytics
// @route   GET /api/admin/analytics
// @access  Private (All authenticated users - students see charts too)
const getAnalytics = async (req, res) => {
  try {
    // 1. Placement rate by branch
    // Calculate placed students (Offers status = 'Accepted')
    const students = await User.find({ role: 'student' }).select('branch cgpa name');
    const acceptedOffers = await Offer.find({ status: 'Accepted' }).select('studentId package');
    
    const placedStudentIds = new Set(acceptedOffers.map(o => o.studentId.toString()));
    
    // Group students by branch
    const branchStatsMap = {};
    students.forEach(student => {
      const branch = student.branch || 'General';
      if (!branchStatsMap[branch]) {
        branchStatsMap[branch] = { branch, placed: 0, unplaced: 0, total: 0 };
      }
      branchStatsMap[branch].total += 1;
      if (placedStudentIds.has(student._id.toString())) {
        branchStatsMap[branch].placed += 1;
      } else {
        branchStatsMap[branch].unplaced += 1;
      }
    });
    
    const branchStats = Object.values(branchStatsMap);

    // 2. Package statistics (highest, average)
    let highestPackage = 0;
    let totalPackage = 0;
    let averagePackage = 0;
    
    if (acceptedOffers.length > 0) {
      acceptedOffers.forEach(o => {
        if (o.package > highestPackage) {
          highestPackage = o.package;
        }
        totalPackage += o.package;
      });
      averagePackage = parseFloat((totalPackage / acceptedOffers.length).toFixed(2));
    }

    // 3. Students Placed vs Unplaced
    const totalStudents = students.length;
    const totalPlaced = placedStudentIds.size;
    const totalUnplaced = totalStudents - totalPlaced;

    // 4. Company Visit Analytics (Job drive counts per company)
    const jobDrives = await JobDrive.find().populate('companyId');
    const companyVisitMap = {};
    
    jobDrives.forEach(drive => {
      if (drive.companyId) {
        const companyName = drive.companyId.companyName;
        if (!companyVisitMap[companyName]) {
          companyVisitMap[companyName] = 0;
        }
        companyVisitMap[companyName] += 1;
      }
    });

    const companyVisits = Object.keys(companyVisitMap).map(key => ({
      name: key,
      visits: companyVisitMap[key]
    })).slice(0, 8); // Top 8 companies

    // 5. Monthly Placement Activity (Offers released/accepted in recent months)
    const offers = await Offer.find().select('createdAt status');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const monthlyStatsMap = {};
    // Pre-populate last 6 months
    const currentMonth = new Date().getMonth();
    for (let i = 5; i >= 0; i--) {
      const mIdx = (currentMonth - i + 12) % 12;
      monthlyStatsMap[months[mIdx]] = { month: months[mIdx], offersReleased: 0, offersAccepted: 0 };
    }

    offers.forEach(offer => {
      const offerDate = new Date(offer.createdAt);
      const mName = months[offerDate.getMonth()];
      if (monthlyStatsMap[mName]) {
        monthlyStatsMap[mName].offersReleased += 1;
        if (offer.status === 'Accepted') {
          monthlyStatsMap[mName].offersAccepted += 1;
        }
      }
    });

    const monthlyActivity = Object.values(monthlyStatsMap);

    // 6. Quick counters
    const activeDrives = await JobDrive.countDocuments({ status: 'active' });
    const totalCompanies = await Company.countDocuments();
    const pendingInterviews = await Interview.countDocuments({ status: 'Scheduled' });

    res.json({
      counters: {
        totalStudents,
        activeDrives,
        totalPlaced,
        totalUnplaced,
        highestPackage: highestPackage || 0,
        averagePackage: averagePackage || 0,
        totalCompanies,
        pendingInterviews
      },
      branchStats,
      packageStats: {
        highestPackage,
        averagePackage
      },
      placedVsUnplaced: [
        { name: 'Placed', value: totalPlaced },
        { name: 'Unplaced', value: totalUnplaced }
      ],
      companyVisits,
      monthlyActivity
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin specific dashboard statistics
// @route   GET /api/admin/users
// @access  Private (Admin)
const manageUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('companyId');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If recruiter, check and delete or detach recruiterId from Company
    if (user.role === 'recruiter' && user.companyId) {
      const company = await Company.findById(user.companyId);
      if (company) {
        company.recruiterId = null;
        await company.save();
      }
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudents,
  getCompanies,
  getAnalytics,
  manageUsers,
  deleteUser
};
