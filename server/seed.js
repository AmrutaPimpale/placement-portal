const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Company = require('./models/Company');
const JobDrive = require('./models/JobDrive');
const Application = require('./models/Application');
const Interview = require('./models/Interview');
const Offer = require('./models/Offer');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placement_portal';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Company.deleteMany({});
    await JobDrive.deleteMany({});
    await Application.deleteMany({});
    await Interview.deleteMany({});
    await Offer.deleteMany({});
    console.log('Cleaned database collections...');

    // Create passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const coordinatorPassword = await bcrypt.hash('coordinator123', 10);
    const recruiterPassword = await bcrypt.hash('recruiter123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);

    // 1. Create Users
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@college.com',
      password: adminPassword,
      role: 'admin',
      profileCompletion: 100
    });

    const coordinator = await User.create({
      name: 'Dr. Sarah Smith (TPO Head)',
      email: 'coordinator@college.com',
      password: coordinatorPassword,
      role: 'coordinator',
      profileCompletion: 100
    });

    const recruiter = await User.create({
      name: 'John Doe (HR Manager)',
      email: 'recruiter@company.com',
      password: recruiterPassword,
      role: 'recruiter',
      profileCompletion: 90
    });

    const student = await User.create({
      name: 'Rahul Kumar',
      email: 'student@college.com',
      password: studentPassword,
      role: 'student',
      branch: 'Computer Engineering',
      year: 4,
      cgpa: 9.25,
      skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Javascript', 'Tailwind CSS'],
      resumeUrl: 'https://drive.google.com/file/d/demo-resume-id/view',
      profileCompletion: 85
    });

    console.log('Seeded Users...');

    // 2. Create Companies
    const microsoft = await Company.create({
      companyName: 'Microsoft Corporation',
      recruiterId: recruiter._id,
      email: 'careers@microsoft.com',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
      description: 'Global tech pioneer in cloud computing, software products, and hardware devices.',
      industry: 'Technology'
    });

    const tcs = await Company.create({
      companyName: 'Tata Consultancy Services',
      recruiterId: recruiter._id,
      email: 'recruitment@tcs.com',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg',
      description: 'Multinational information technology services and consulting company.',
      industry: 'IT Services'
    });

    // Update recruiter user with companyId link
    recruiter.companyId = microsoft._id;
    await recruiter.save();

    console.log('Seeded Companies...');

    // 3. Create Job Drives
    const sdeDrive = await JobDrive.create({
      companyId: microsoft._id,
      role: 'Software Development Engineer (SDE-1)',
      package: 44.0,
      eligibility: {
        cgpa: 8.5,
        branches: ['Computer Engineering', 'Information Technology']
      },
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      driveDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      description: 'Building tools and platforms for azure cloud infrastructures and developer productivity tools.',
      requirements: ['Excellent programming skills in Javascript/Python', 'Knowledge of Data Structures and Algorithms', 'System design basics'],
      location: 'Bangalore, India',
      jobType: 'Full Time',
      status: 'active'
    });

    const traineeDrive = await JobDrive.create({
      companyId: tcs._id,
      role: 'System Engineer Trainee',
      package: 7.2,
      eligibility: {
        cgpa: 6.5,
        branches: ['Computer Engineering', 'Information Technology', 'Electronics']
      },
      deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Passed yesterday
      driveDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      description: 'Assisting in deployment and management of banking systems and enterprise systems maintenance.',
      requirements: ['Knowledge of SQL databases', 'Good communication skills', 'Basic networking paradigms'],
      location: 'Pune, India',
      jobType: 'Full Time',
      status: 'active'
    });

    console.log('Seeded Job Drives...');

    // 4. Create Applications
    const app1 = await Application.create({
      studentId: student._id,
      driveId: sdeDrive._id,
      status: 'Shortlisted'
    });

    const app2 = await Application.create({
      studentId: student._id,
      driveId: traineeDrive._id,
      status: 'Applied'
    });

    console.log('Seeded Applications...');

    // 5. Create Interview
    const interview = await Interview.create({
      studentId: student._id,
      driveId: sdeDrive._id,
      interviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      mode: 'Online',
      meetingLink: 'https://meet.google.com/xyz-abc-demo',
      round: 'Technical Coding Round'
    });

    // Update Application 1 to show interview scheduled
    app1.status = 'Interview Scheduled';
    await app1.save();

    console.log('Seeded Interviews...');

    // 6. Create Offer Letter
    const offer = await Offer.create({
      studentId: student._id,
      companyId: tcs._id,
      driveId: traineeDrive._id,
      package: 7.2,
      offerLetter: 'Congratulations! You have been selected as a System Engineer Trainee at Tata Consultancy Services. Your joining date is June 15th, 2026.',
      joiningDate: new Date('2026-06-15')
    });

    console.log('Seeded Offers...');

    console.log('Database Seeding Completed Successfully! 🌱');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
