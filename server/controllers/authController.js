const User = require('../models/User');
const Company = require('../models/Company');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_2026', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, branch, year, cgpa, companyName, industry } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user object
    const userFields = {
      name,
      email,
      password: hashedPassword,
      role
    };

    let createdCompany = null;

    // Handle role specific details
    if (role === 'student') {
      userFields.branch = branch || '';
      userFields.year = year || null;
      userFields.cgpa = cgpa || null;
      // Initial profile completion calculation
      let completed = 20; // registered
      if (branch) completed += 20;
      if (year) completed += 10;
      if (cgpa) completed += 20;
      userFields.profileCompletion = completed;
    } else if (role === 'recruiter') {
      if (!companyName) {
        return res.status(400).json({ message: 'Recruiters must specify a company name' });
      }

      // Check if company exists or create a new one
      let company = await Company.findOne({ companyName });
      if (!company) {
        company = await Company.create({
          companyName,
          email,
          industry: industry || 'Technology'
        });
      }
      createdCompany = company;
      userFields.companyId = company._id;
    }

    // Create user
    const user = await User.create(userFields);

    if (role === 'recruiter' && createdCompany) {
      // Update recruiterId in company
      createdCompany.recruiterId = user._id;
      await createdCompany.save();
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).populate('companyId');

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('companyId');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      
      // Update student specific details
      if (user.role === 'student') {
        user.branch = req.body.branch !== undefined ? req.body.branch : user.branch;
        user.year = req.body.year !== undefined ? req.body.year : user.year;
        user.cgpa = req.body.cgpa !== undefined ? req.body.cgpa : user.cgpa;
        user.skills = req.body.skills !== undefined ? req.body.skills : user.skills;
        user.projects = req.body.projects !== undefined ? req.body.projects : user.projects;
        user.resumeUrl = req.body.resumeUrl !== undefined ? req.body.resumeUrl : user.resumeUrl;
        user.resumeName = req.body.resumeName !== undefined ? req.body.resumeName : user.resumeName;

        // Calculate profile completion percentage
        let score = 20; // Name & Email & Register
        if (user.branch) score += 15;
        if (user.year) score += 10;
        if (user.cgpa) score += 15;
        if (user.skills && user.skills.length > 0) score += 15;
        if (user.projects && user.projects.length > 0) score += 15;
        if (user.resumeUrl) score += 10;
        
        user.profileCompletion = score;
      }

      // Update recruiter specific details
      if (user.role === 'recruiter' && req.body.companyName) {
        let company = await Company.findById(user.companyId);
        if (company) {
          company.companyName = req.body.companyName;
          company.industry = req.body.industry || company.industry;
          company.logo = req.body.logo || company.logo;
          company.description = req.body.description || company.description;
          company.website = req.body.website || company.website;
          await company.save();
        }
      }

      const updatedUser = await user.save();
      const populatedUser = await User.findById(updatedUser._id).select('-password').populate('companyId');
      res.json(populatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'No user registered with this email' });
    }
    
    // In a real application, you would send a reset token. 
    // Here we will mock it for this dummy database setup.
    res.json({ 
      message: 'Password reset link sent to your email (Email.js mock triggered)',
      resetToken: 'mock-reset-token-2026'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  forgotPassword
};
