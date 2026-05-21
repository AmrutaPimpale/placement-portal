const Offer = require('../models/Offer');
const JobDrive = require('../models/JobDrive');
const Application = require('../models/Application');

// @desc    Release a job offer
// @route   POST /api/offers
// @access  Private (Recruiter, Coordinator, Admin)
const releaseOffer = async (req, res) => {
  try {
    const { studentId, driveId, package: salaryPackage, offerLetter, joiningDate } = req.body;

    if (!studentId || !driveId || !salaryPackage || !offerLetter) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const jobDrive = await JobDrive.findById(driveId);
    if (!jobDrive) {
      return res.status(404).json({ message: 'Job drive not found' });
    }

    let companyId = jobDrive.companyId;

    // Authorize recruiter check
    if (req.user.role === 'recruiter') {
      if (companyId.toString() !== req.user.companyId.toString()) {
        return res.status(403).json({ message: 'Not authorized to release offers for this company' });
      }
    }

    // Check if offer already released for this student and drive
    const offerExists = await Offer.findOne({ studentId, driveId });
    if (offerExists) {
      return res.status(400).json({ message: 'An offer has already been released for this candidate and drive' });
    }

    const offer = await Offer.create({
      studentId,
      companyId,
      driveId,
      package: salaryPackage,
      offerLetter,
      joiningDate: joiningDate || null,
      status: 'Released'
    });

    // Update application status to 'Offer Released'
    await Application.findOneAndUpdate(
      { studentId, driveId },
      { status: 'Offer Released' }
    );

    const populatedOffer = await Offer.findById(offer._id)
      .populate('studentId', 'name email branch year cgpa skills')
      .populate('companyId')
      .populate('driveId');

    res.status(201).json(populatedOffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get offers based on user role
// @route   GET /api/offers
// @access  Private (All roles)
const getOffers = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      query.studentId = req.user._id;
    } else if (req.user.role === 'recruiter') {
      query.companyId = req.user.companyId;
    }

    const offers = await Offer.find(query)
      .populate('studentId', 'name email branch year cgpa skills resumeUrl')
      .populate('companyId')
      .populate('driveId')
      .sort({ createdAt: -1 });

    res.json(offers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update offer status (Accept/Reject)
// @route   PUT /api/offers/:id/status
// @access  Private (Student, Coordinator, Admin)
const updateOfferStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Valid status (Accepted/Rejected) is required' });
    }

    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    // Authorize: only student who received it (or coordinator/admin) can accept/reject
    if (req.user.role === 'student' && offer.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to change status of this offer' });
    }

    offer.status = status;
    await offer.save();

    // Update application status accordingly
    const finalAppStatus = status === 'Accepted' ? 'Selected' : 'Rejected';
    await Application.findOneAndUpdate(
      { studentId: offer.studentId, driveId: offer.driveId },
      { status: finalAppStatus }
    );

    const populatedOffer = await Offer.findById(offer._id)
      .populate('studentId', 'name email branch year cgpa')
      .populate('companyId')
      .populate('driveId');

    res.json(populatedOffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  releaseOffer,
  getOffers,
  updateOfferStatus
};
