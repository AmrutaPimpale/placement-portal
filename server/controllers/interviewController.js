const Interview = require('../models/Interview');
const JobDrive = require('../models/JobDrive');
const Application = require('../models/Application');

// @desc    Schedule an interview
// @route   POST /api/interviews
// @access  Private (Coordinator, Recruiter, Admin)
const scheduleInterview = async (req, res) => {
  try {
    const { studentId, driveId, interviewDate, mode, meetingLink, round } = req.body;

    if (!studentId || !driveId || !interviewDate || !mode) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Authorize recruiter check
    if (req.user.role === 'recruiter') {
      const jobDrive = await JobDrive.findById(driveId);
      if (!jobDrive || jobDrive.companyId.toString() !== req.user.companyId.toString()) {
        return res.status(403).json({ message: 'Not authorized to schedule interviews for this drive' });
      }
    }

    const interview = await Interview.create({
      studentId,
      driveId,
      interviewDate,
      mode,
      meetingLink: meetingLink || '',
      round: round || 'Technical Round',
      status: 'Scheduled'
    });

    // Automatically update the application status to 'Interview Scheduled'
    await Application.findOneAndUpdate(
      { studentId, driveId },
      { status: 'Interview Scheduled' }
    );

    const populatedInterview = await Interview.findById(interview._id)
      .populate('studentId', 'name email branch year cgpa')
      .populate({
        path: 'driveId',
        populate: { path: 'companyId' }
      });

    res.status(201).json(populatedInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get interviews based on user role
// @route   GET /api/interviews
// @access  Private (All roles)
const getInterviews = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      query.studentId = req.user._id;
    } else if (req.user.role === 'recruiter') {
      // Find job drives for the recruiter's company
      const drives = await JobDrive.find({ companyId: req.user.companyId }).select('_id');
      const driveIds = drives.map(d => d._id);
      query.driveId = { $in: driveIds };
    }

    const interviews = await Interview.find(query)
      .populate('studentId', 'name email branch year cgpa')
      .populate({
        path: 'driveId',
        populate: { path: 'companyId' }
      })
      .sort({ interviewDate: 1 });

    res.json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update interview details/status
// @route   PUT /api/interviews/:id
// @access  Private (Coordinator, Recruiter, Admin)
const updateInterview = async (req, res) => {
  try {
    const { status, feedback, meetingLink, interviewDate, round } = req.body;

    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Authorize recruiter check
    if (req.user.role === 'recruiter') {
      const jobDrive = await JobDrive.findById(interview.driveId);
      if (!jobDrive || jobDrive.companyId.toString() !== req.user.companyId.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this interview' });
      }
    }

    interview.status = status || interview.status;
    interview.feedback = feedback !== undefined ? feedback : interview.feedback;
    interview.meetingLink = meetingLink !== undefined ? meetingLink : interview.meetingLink;
    interview.interviewDate = interviewDate || interview.interviewDate;
    interview.round = round || interview.round;

    await interview.save();

    // If completed or cancelled, optionally reflect that somewhere, otherwise keep application status
    if (status === 'Completed' && feedback) {
      // Keep status as is or update application with feedback details
    }

    const populatedInterview = await Interview.findById(interview._id)
      .populate('studentId', 'name email branch year cgpa')
      .populate({
        path: 'driveId',
        populate: { path: 'companyId' }
      });

    res.json(populatedInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  scheduleInterview,
  getInterviews,
  updateInterview
};
