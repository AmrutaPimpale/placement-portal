const Application = require('../models/Application');
const JobDrive = require('../models/JobDrive');
const User = require('../models/User');

// @desc    Apply to a job drive
// @route   POST /api/applications/apply
// @access  Private (Student)
const applyJobDrive = async (req, res) => {
  try {
    const { driveId } = req.body;

    if (!driveId) {
      return res.status(400).json({ message: 'Job Drive ID is required' });
    }

    // Check if job drive exists
    const jobDrive = await JobDrive.findById(driveId).populate('companyId');
    if (!jobDrive) {
      return res.status(404).json({ message: 'Job drive not found' });
    }

    // Check if drive is active
    if (jobDrive.status !== 'active') {
      return res.status(400).json({ message: 'This job drive is no longer active' });
    }

    // Check if deadline has passed
    if (new Date() > new Date(jobDrive.deadline)) {
      return res.status(400).json({ message: 'The application deadline for this drive has passed' });
    }

    // Get latest student profile
    const student = await User.findById(req.user._id);

    // Verify resume uploaded
    if (!student.resumeUrl) {
      return res.status(400).json({ 
        message: 'Please upload your resume in the Profile section before applying.' 
      });
    }

    // Verify branch eligibility
    if (jobDrive.eligibility.branches && jobDrive.eligibility.branches.length > 0) {
      if (!student.branch || !jobDrive.eligibility.branches.includes(student.branch)) {
        return res.status(400).json({ 
          message: `Your branch (${student.branch || 'None'}) is not eligible for this drive. Eligible branches: ${jobDrive.eligibility.branches.join(', ')}` 
        });
      }
    }

    // Verify CGPA eligibility
    if (jobDrive.eligibility.cgpa > 0) {
      if (!student.cgpa || student.cgpa < jobDrive.eligibility.cgpa) {
        return res.status(400).json({ 
          message: `Your CGPA (${student.cgpa || 0}) is below the required minimum of ${jobDrive.eligibility.cgpa}.` 
        });
      }
    }

    // Check if student already applied
    const alreadyApplied = await Application.findOne({
      studentId: req.user._id,
      driveId
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied to this job drive' });
    }

    const application = await Application.create({
      studentId: req.user._id,
      driveId,
      status: 'Applied'
    });

    const populatedApplication = await Application.findById(application._id)
      .populate('studentId', '-password')
      .populate({
        path: 'driveId',
        populate: { path: 'companyId' }
      });

    res.status(201).json(populatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student applications
// @route   GET /api/applications/my-applications
// @access  Private (Student)
const getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate({
        path: 'driveId',
        populate: { path: 'companyId' }
      })
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get job applications for a specific drive
// @route   GET /api/applications/drive/:driveId
// @access  Private (Recruiter, Coordinator, Admin)
const getJobApplications = async (req, res) => {
  try {
    const applications = await Application.find({ driveId: req.params.driveId })
      .populate('studentId', '-password')
      .populate({
        path: 'driveId',
        populate: { path: 'companyId' }
      })
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications in the system
// @route   GET /api/applications
// @access  Private (Coordinator, Admin)
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('studentId', '-password')
      .populate({
        path: 'driveId',
        populate: { path: 'companyId' }
      })
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter, Coordinator, Admin)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Authorize: If recruiter, must own the company that posted the drive
    if (req.user.role === 'recruiter') {
      const jobDrive = await JobDrive.findById(application.driveId);
      if (jobDrive.companyId.toString() !== req.user.companyId.toString()) {
        return res.status(403).json({ message: 'Not authorized to manage applications for this job drive' });
      }
    }

    application.status = status;
    if (remarks !== undefined) {
      application.remarks = remarks;
    }

    await application.save();

    const populatedApp = await Application.findById(application._id)
      .populate('studentId', '-password')
      .populate({
        path: 'driveId',
        populate: { path: 'companyId' }
      });

    res.json(populatedApp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyJobDrive,
  getStudentApplications,
  getJobApplications,
  getAllApplications,
  updateApplicationStatus
};
