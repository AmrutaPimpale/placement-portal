const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load models
const User = require('../models/User');
const Company = require('../models/Company');
const JobDrive = require('../models/JobDrive');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const Offer = require('../models/Offer');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placement_portal');
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Company.deleteMany();
    await JobDrive.deleteMany();
    await Application.deleteMany();
    await Interview.deleteMany();
    await Offer.deleteMany();
    console.log('Existing collections cleared.');

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const studentPassword = await bcrypt.hash('student123', salt);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const recruiterPassword = await bcrypt.hash('recruiter123', salt);

    // 1. Create Companies
    console.log('Seeding Companies...');
    const companies = await Company.insertMany([
      {
        companyName: 'Google',
        email: 'jobs@google.com',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
        industry: 'Technology',
        description: 'Google LLC is an American multinational technology company.',
        website: 'https://google.com'
      },
      {
        companyName: 'Microsoft',
        email: 'recruiting@microsoft.com',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
        industry: 'Technology',
        description: 'Microsoft Corporation is an American multinational technology corporation.',
        website: 'https://microsoft.com'
      },
      {
        companyName: 'TCS',
        email: 'careers@tcs.com',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg',
        industry: 'Consulting & IT services',
        description: 'Tata Consultancy Services is an Indian multinational IT service and consulting company.',
        website: 'https://tcs.com'
      },
      {
        companyName: 'Infosys',
        email: 'talent@infosys.com',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg',
        industry: 'IT Services',
        description: 'Infosys Limited is an Indian multinational information technology company.',
        website: 'https://infosys.com'
      },
      {
        companyName: 'Deloitte',
        email: 'careers@deloitte.com',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg',
        industry: 'Professional Services',
        description: 'Deloitte Touche Tohmatsu Limited is a multinational professional services network.',
        website: 'https://deloitte.com'
      },
      {
        companyName: 'Amazon',
        email: 'talent-acquisition@amazon.com',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        industry: 'E-commerce & Cloud',
        description: 'Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, online advertising, and digital streaming.',
        website: 'https://amazon.com'
      }
    ]);

    // 2. Create Users
    console.log('Seeding Users...');
    // Coordinators & Admins & Recruiter User mapping
    const recruiterUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'recruiter@company.com',
      password: recruiterPassword,
      role: 'recruiter',
      companyId: companies[2]._id // TCS
    });

    // Update TCS recruiter ID
    companies[2].recruiterId = recruiterUser._id;
    await companies[2].save();

    await User.create([
      {
        name: 'Prof. Rajesh Sharma',
        email: 'coordinator@college.com',
        password: adminPassword,
        role: 'coordinator'
      },
      {
        name: 'System Administrator',
        email: 'admin@college.com',
        password: adminPassword,
        role: 'admin'
      }
    ]);

    // Seed Students
    const studentUsers = await User.insertMany([
      {
        name: 'Rahul Kumar',
        email: 'student@college.com',
        password: studentPassword,
        role: 'student',
        branch: 'Computer Engineering',
        year: 4,
        cgpa: 9.2,
        skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'Python', 'C++'],
        projects: [
          {
            title: 'Student Placement Tracker',
            description: 'A platform to track college placement activities.',
            technologies: 'React, Node, Express, MongoDB',
            link: 'https://github.com'
          }
        ],
        resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resumeName: 'Rahul_Kumar_Resume.pdf',
        profileCompletion: 90
      },
      {
        name: 'Sneha Patel',
        email: 'sneha@college.com',
        password: studentPassword,
        role: 'student',
        branch: 'Computer Engineering',
        year: 4,
        cgpa: 8.8,
        skills: ['Java', 'Spring Boot', 'SQL', 'React', 'HTML/CSS'],
        resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resumeName: 'Sneha_Patel_Resume.pdf',
        profileCompletion: 80
      },
      {
        name: 'Amit Verma',
        email: 'amit@college.com',
        password: studentPassword,
        role: 'student',
        branch: 'Information Technology',
        year: 4,
        cgpa: 7.9,
        skills: ['Python', 'Django', 'Machine Learning', 'Javascript'],
        resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resumeName: 'Amit_Verma_Resume.pdf',
        profileCompletion: 80
      },
      {
        name: 'Pooja Reddy',
        email: 'pooja@college.com',
        password: studentPassword,
        role: 'student',
        branch: 'Electronics',
        year: 4,
        cgpa: 8.1,
        skills: ['Embedded Systems', 'IoT', 'C', 'MATLAB'],
        resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resumeName: 'Pooja_Reddy_Resume.pdf',
        profileCompletion: 80
      },
      {
        name: 'Vikram Singh',
        email: 'vikram@college.com',
        password: studentPassword,
        role: 'student',
        branch: 'Mechanical',
        year: 4,
        cgpa: 7.2,
        skills: ['SolidWorks', 'AutoCAD', 'Thermodynamics'],
        resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resumeName: 'Vikram_Singh_Resume.pdf',
        profileCompletion: 70
      },
      {
        name: 'Neha Gupta',
        email: 'neha@college.com',
        password: studentPassword,
        role: 'student',
        branch: 'Electronics',
        year: 4,
        cgpa: 8.5,
        skills: ['Verilog', 'VLSI', 'Python'],
        resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resumeName: 'Neha_Gupta_Resume.pdf',
        profileCompletion: 80
      },
      {
        name: 'Rohan Mehta',
        email: 'rohan@college.com',
        password: studentPassword,
        role: 'student',
        branch: 'Information Technology',
        year: 4,
        cgpa: 8.3,
        skills: ['Android Dev', 'Kotlin', 'Firebase'],
        resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resumeName: 'Rohan_Mehta_Resume.pdf',
        profileCompletion: 80
      }
    ]);

    // 3. Create Job Drives
    console.log('Seeding Job Drives...');
    const now = new Date();
    
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const interviewDate1 = new Date(now);
    interviewDate1.setDate(interviewDate1.getDate() + 3);

    const interviewDate2 = new Date(now);
    interviewDate2.setDate(interviewDate2.getDate() + 5);

    const driveDate1 = new Date(now);
    driveDate1.setDate(driveDate1.getDate() + 4);

    const driveDate2 = new Date(now);
    driveDate2.setDate(driveDate2.getDate() + 8);

    const pastDate = new Date(now);
    pastDate.setDate(pastDate.getDate() - 10);

    const jobDrives = await JobDrive.insertMany([
      {
        companyId: companies[2]._id, // TCS
        role: 'Software Engineer',
        package: 7.2,
        eligibility: {
          cgpa: 6.5,
          branches: ['Computer Engineering', 'Information Technology', 'Electronics']
        },
        deadline: tomorrow,
        driveDate: driveDate1,
        status: 'active',
        description: 'We are looking for passionate entry-level engineers to join our application development teams.',
        requirements: ['Core Java or Python', 'Basic understanding of databases', 'Strong analytical skills'],
        location: 'Bangalore',
        jobType: 'Full Time'
      },
      {
        companyId: companies[1]._id, // Microsoft
        role: 'SDE Intern',
        package: 44.0,
        eligibility: {
          cgpa: 8.5,
          branches: ['Computer Engineering', 'Information Technology']
        },
        deadline: nextWeek,
        driveDate: driveDate2,
        status: 'active',
        description: 'Join our team as an SDE intern and work on cloud scale features for Azure and Office 365.',
        requirements: ['Data Structures and Algorithms', 'Operating Systems', 'Excellent problem solving skills'],
        location: 'Hyderabad',
        jobType: 'Internship'
      },
      {
        companyId: companies[3]._id, // Infosys
        role: 'Associate Developer',
        package: 4.0,
        eligibility: {
          cgpa: 6.0,
          branches: ['Computer Engineering', 'Information Technology', 'Electronics', 'Mechanical']
        },
        deadline: pastDate,
        driveDate: pastDate,
        status: 'closed',
        description: 'Entry-level associate developer drive to hire programmers for systemic client tasks.',
        requirements: ['Good communication skills', 'Any coding background', 'Eagerness to learn'],
        location: 'Pune',
        jobType: 'Full Time'
      },
      {
        companyId: companies[4]._id, // Deloitte
        role: 'Data Analyst',
        package: 12.0,
        eligibility: {
          cgpa: 7.5,
          branches: ['Computer Engineering', 'Information Technology', 'Electronics']
        },
        deadline: nextWeek,
        driveDate: driveDate2,
        status: 'active',
        description: 'Work with business stakeholders to parse dashboards, reports, and run SQL queries.',
        requirements: ['SQL', 'Excel and PowerPoint', 'Tableau or Power BI is a plus'],
        location: 'Bangalore',
        jobType: 'Full Time'
      },
      {
        companyId: companies[0]._id, // Google
        role: 'Software Engineer (L3)',
        package: 32.5,
        eligibility: {
          cgpa: 8.0,
          branches: ['Computer Engineering', 'Information Technology']
        },
        deadline: nextWeek,
        driveDate: driveDate2,
        status: 'upcoming',
        description: 'Google is hiring Software Engineers to build products for world-scale problems.',
        requirements: ['C++ or Java', 'Deep algorithm knowledge', 'System design basics'],
        location: 'Bangalore',
        jobType: 'Full Time'
      }
    ]);

    // 4. Create Applications
    console.log('Seeding Applications...');
    const applications = await Application.insertMany([
      // Rahul Kumar
      {
        studentId: studentUsers[0]._id,
        driveId: jobDrives[0]._id, // TCS
        status: 'Interview Scheduled'
      },
      {
        studentId: studentUsers[0]._id,
        driveId: jobDrives[1]._id, // Microsoft
        status: 'Applied'
      },
      {
        studentId: studentUsers[0]._id,
        driveId: jobDrives[2]._id, // Infosys
        status: 'Offer Released'
      },
      {
        studentId: studentUsers[0]._id,
        driveId: jobDrives[3]._id, // Deloitte
        status: 'Applied'
      },
      // Sneha Patel
      {
        studentId: studentUsers[1]._id,
        driveId: jobDrives[0]._id, // TCS
        status: 'Offer Released'
      },
      {
        studentId: studentUsers[1]._id,
        driveId: jobDrives[1]._id, // Microsoft
        status: 'Shortlisted'
      },
      // Amit Verma
      {
        studentId: studentUsers[2]._id,
        driveId: jobDrives[0]._id, // TCS
        status: 'Offer Released'
      },
      // Rohan Mehta
      {
        studentId: studentUsers[6]._id,
        driveId: jobDrives[0]._id, // TCS
        status: 'Offer Released'
      },
      // Pooja Reddy
      {
        studentId: studentUsers[3]._id,
        driveId: jobDrives[2]._id, // Infosys
        status: 'Offer Released'
      }
    ]);

    // 5. Create Interviews
    console.log('Seeding Interviews...');
    await Interview.insertMany([
      {
        studentId: studentUsers[0]._id,
        driveId: jobDrives[0]._id, // TCS
        interviewDate: interviewDate1,
        mode: 'Online',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        status: 'Scheduled',
        round: 'Technical Interview'
      },
      {
        studentId: studentUsers[1]._id,
        driveId: jobDrives[1]._id, // Microsoft
        interviewDate: interviewDate2,
        mode: 'Online',
        meetingLink: 'https://teams.microsoft.com/l/meetup-join',
        status: 'Scheduled',
        round: 'DSA Round'
      }
    ]);

    // 6. Create Offers
    console.log('Seeding Offers...');
    
    // Sneha accepted TCS offer (7.2 LPA)
    const offer1 = await Offer.create({
      studentId: studentUsers[1]._id,
      companyId: companies[2]._id, // TCS
      driveId: jobDrives[0]._id,
      package: 7.2,
      offerLetter: 'Congratulations Sneha! You have been selected as a Software Engineer at TCS.',
      status: 'Accepted'
    });
    // Sneha's application status is updated to selected
    await Application.findOneAndUpdate(
      { studentId: studentUsers[1]._id, driveId: jobDrives[0]._id },
      { status: 'Selected' }
    );

    // Amit accepted TCS offer (7.2 LPA)
    await Offer.create({
      studentId: studentUsers[2]._id,
      companyId: companies[2]._id, // TCS
      driveId: jobDrives[0]._id,
      package: 7.2,
      offerLetter: 'Congratulations Amit! You have been selected as a Software Engineer at TCS.',
      status: 'Accepted'
    });
    await Application.findOneAndUpdate(
      { studentId: studentUsers[2]._id, driveId: jobDrives[0]._id },
      { status: 'Selected' }
    );

    // Rohan accepted TCS offer (7.2 LPA)
    await Offer.create({
      studentId: studentUsers[6]._id,
      companyId: companies[2]._id, // TCS
      driveId: jobDrives[0]._id,
      package: 7.2,
      offerLetter: 'Congratulations Rohan! You have been selected as a Software Engineer at TCS.',
      status: 'Accepted'
    });
    await Application.findOneAndUpdate(
      { studentId: studentUsers[6]._id, driveId: jobDrives[0]._id },
      { status: 'Selected' }
    );

    // Pooja accepted Infosys offer (4.0 LPA)
    await Offer.create({
      studentId: studentUsers[3]._id,
      companyId: companies[3]._id, // Infosys
      driveId: jobDrives[2]._id,
      package: 4.0,
      offerLetter: 'Congratulations Pooja! You have been selected as an Associate Developer at Infosys.',
      status: 'Accepted'
    });
    await Application.findOneAndUpdate(
      { studentId: studentUsers[3]._id, driveId: jobDrives[2]._id },
      { status: 'Selected' }
    );

    // Rahul has a pending offer released from Infosys (4.0 LPA)
    await Offer.create({
      studentId: studentUsers[0]._id,
      companyId: companies[3]._id, // Infosys
      driveId: jobDrives[2]._id,
      package: 4.0,
      offerLetter: 'Congratulations Rahul! You have been selected as an Associate Developer at Infosys.',
      status: 'Released'
    });

    console.log('Dummy Data Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
