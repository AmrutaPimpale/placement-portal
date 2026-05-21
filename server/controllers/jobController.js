const JobDrive = require('../models/JobDrive');
const Company = require('../models/Company');

// @desc    Create a job drive
// @route   POST /api/jobs
// @access  Private (Recruiter, Coordinator, Admin)
const createJobDrive = async (req, res) => {
  try {
    const { role, package: salaryPackage, cgpa, branches, deadline, driveDate, description, requirements, location, jobType } = req.body;

    if (!role || !salaryPackage || !deadline || !driveDate) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    let companyId;

    if (req.user.role === 'recruiter') {
      if (!req.user.companyId) {
        return res.status(400).json({ message: 'Recruiter does not have an associated company' });
      }
      companyId = req.user.companyId;
    } else {
      // Coordinator or Admin must provide companyId explicitly
      if (!req.body.companyId) {
        return res.status(400).json({ message: 'Please provide a company ID' });
      }
      companyId = req.body.companyId;
    }

    const jobDrive = await JobDrive.create({
      companyId,
      role,
      package: salaryPackage,
      eligibility: {
        cgpa: cgpa || 0,
        branches: branches || []
      },
      deadline,
      driveDate,
      description: description || '',
      requirements: requirements || [],
      location: location || 'Remote',
      jobType: jobType || 'Full Time',
      status: 'active'
    });

    const populatedJob = await JobDrive.findById(jobDrive._id).populate('companyId');
    res.status(201).json(populatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all job drives
// @route   GET /api/jobs
// @access  Private (All Roles)
const getJobDrives = async (req, res) => {
  try {
    const { search, branch, minCgpa, status, jobType } = req.query;
    
    let query = {};

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by jobType if provided
    if (jobType) {
      query.jobType = jobType;
    }

    // CGPA filter: find job drives where eligible CGPA <= user's CGPA or requested CGPA
    if (minCgpa) {
      query['eligibility.cgpa'] = { $lte: Number(minCgpa) };
    }

    // Branch filter: find drives that accept this branch
    if (branch) {
      query['eligibility.branches'] = { $in: [branch] };
    }

    // Fetch and search inside companyName and role
    let jobDrives = await JobDrive.find(query).populate('companyId').sort({ createdAt: -1 });

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      jobDrives = jobDrives.filter(job => 
        searchRegex.test(job.role) || 
        (job.companyId && searchRegex.test(job.companyId.companyName))
      );
    }

    res.json(jobDrives);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get job drive by ID
// @route   GET /api/jobs/:id
// @access  Private (All Roles)
const getJobDriveById = async (req, res) => {
  try {
    const jobDrive = await JobDrive.findById(req.params.id).populate('companyId');
    if (!jobDrive) {
      return res.status(404).json({ message: 'Job drive not found' });
    }
    res.json(jobDrive);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a job drive
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter, Coordinator, Admin)
const updateJobDrive = async (req, res) => {
  try {
    const jobDrive = await JobDrive.findById(req.params.id);
    if (!jobDrive) {
      return res.status(404).json({ message: 'Job drive not found' });
    }

    // Authorization check: recruiter must own the drive company
    if (req.user.role === 'recruiter' && jobDrive.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this job drive' });
    }

    const { role, package: salaryPackage, cgpa, branches, deadline, driveDate, status, description, requirements, location, jobType } = req.body;

    jobDrive.role = role || jobDrive.role;
    jobDrive.package = salaryPackage !== undefined ? salaryPackage : jobDrive.package;
    jobDrive.eligibility = {
      cgpa: cgpa !== undefined ? cgpa : jobDrive.eligibility.cgpa,
      branches: branches || jobDrive.eligibility.branches
    };
    jobDrive.deadline = deadline || jobDrive.deadline;
    jobDrive.driveDate = driveDate || jobDrive.driveDate;
    jobDrive.status = status || jobDrive.status;
    jobDrive.description = description !== undefined ? description : jobDrive.description;
    jobDrive.requirements = requirements || jobDrive.requirements;
    jobDrive.location = location || jobDrive.location;
    jobDrive.jobType = jobType || jobDrive.jobType;

    const updatedJob = await jobDrive.save();
    const populatedJob = await JobDrive.findById(updatedJob._id).populate('companyId');
    res.json(populatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a job drive
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter, Coordinator, Admin)
const deleteJobDrive = async (req, res) => {
  try {
    const jobDrive = await JobDrive.findById(req.params.id);
    if (!jobDrive) {
      return res.status(404).json({ message: 'Job drive not found' });
    }

    // Authorization check: recruiter must own the drive company
    if (req.user.role === 'recruiter' && jobDrive.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job drive' });
    }

    await JobDrive.findByIdAndDelete(req.params.id);
    res.json({ id: req.params.id, message: 'Job drive deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJobDrive,
  getJobDrives,
  getJobDriveById,
  updateJobDrive,
  deleteJobDrive
};
