Placement Portal System - Product Requirements Document (PRD)
Project Title

Smart Campus Recruitment & Placement Portal

1. Project Overview

The Smart Campus Recruitment & Placement Portal is a full-stack web application designed for colleges and universities to manage the complete campus recruitment process digitally.

The system allows:

Students to create professional profiles with resumes, skills, academics, and projects.
Companies to post recruitment drives with eligibility criteria.
Placement coordinators to manage applications, shortlists, interviews, and offers.
Admins to monitor placement analytics and branch-wise statistics.

The platform provides a modern dashboard experience with real-time updates, visual placement analytics, email notifications, and responsive UI for desktop and mobile devices.

This project is designed as a real-world industry-level application using modern MERN stack technologies.

2. Tech Stack
Technology	Purpose
React.js	Frontend UI
Node.js	Backend Runtime
Express.js	REST API Server
MongoDB	Database
React Hook Form	Form Validation & Management
Recharts	Placement Analytics & Graphs
Email.js	Email Notifications
JWT Authentication	Secure Login
Tailwind CSS	UI Styling
Cloudinary (Optional)	Resume Upload Storage
3. User Roles
3.1 Student

Students can:

Register/Login
Build profile
Upload resume
Add skills/projects
View job drives
Apply for jobs
Track application status
Compare offers
View interview schedules
3.2 Placement Coordinator

Placement Coordinators can:

Manage students
Verify profiles
Create placement drives
Schedule interviews
Shortlist candidates
Upload offer letters
Monitor placement statistics
Send notifications
3.3 Company Recruiter

Recruiters can:

Create company profile
Post recruitment drives
Define eligibility criteria
View applicants
Shortlist students
Schedule interviews
Release offer letters
3.4 Admin

Admin can:

Manage entire platform
Manage users
Approve recruiters
Monitor analytics
Control access permissions
Generate reports
4. Core Features
4.1 Authentication System
Features
Secure Login/Register
JWT Authentication
Password Encryption
Role-Based Access Control
Forgot Password
Email Verification
Pages
Login Page
Register Page
Forgot Password Page
4.2 Student Profile Management
Student Profile Includes
Personal Details
Academic Information
CGPA
Branch & Year
Skills
Certifications
Resume Upload
Projects
Internship Experience
Social Links
Features
Resume PDF Upload
Dynamic Skill Tags
Profile Completion Percentage
Editable Dashboard
4.3 Job Drive Management
Recruiter Can Add
Company Name
Job Role
Salary Package
Eligibility Criteria
Minimum CGPA
Eligible Branches
Drive Date
Interview Mode
Last Date to Apply
Features
Active/Closed Drives
Job Filters
Search Functionality
Application Tracking
4.4 Student Application System
Features
One-click Apply
Resume Auto Attachment
Application Status Tracking
Shortlisted/Rejection Status
Interview Round Tracking
Application Status Types
Applied
Under Review
Shortlisted
Interview Scheduled
Selected
Rejected
Offer Released
4.5 Interview Scheduling Module
Features
Interview Date & Time
Online/Offline Mode
Meeting Link
Email Notifications
Auto Reminders
Coordinator Controls
Bulk Schedule Interviews
Update Interview Status
Assign Panels
4.6 Offer Letter Management
Features
Upload Offer Letter PDF
Download Offers
Offer Acceptance/Rejection
Offer Comparison Dashboard
Offer Comparison Dashboard

Students can compare:

Salary Package
Company Type
Location
Role
Benefits
4.7 Placement Analytics Dashboard
Dashboard Charts Using Recharts
Charts Included
Branch-wise Placement Rate
Year-wise Placement Statistics
Highest Package
Average Package
Company Visit Count
Students Placed vs Unplaced
Monthly Recruitment Activity
Dummy Analytics Data Example
const placementStats = [
  {
    branch: "Computer Engineering",
    placed: 120,
    unplaced: 25
  },
  {
    branch: "Information Technology",
    placed: 98,
    unplaced: 18
  },
  {
    branch: "Electronics",
    placed: 70,
    unplaced: 40
  },
  {
    branch: "Mechanical",
    placed: 55,
    unplaced: 50
  }
];
4.8 Notification System
Notifications Sent For
New Job Drive
Interview Schedule
Application Status
Offer Release
Deadline Reminder
Technology Used
Email.js
In-App Notifications
5. UI/UX Requirements
Design Style
Modern Dashboard UI
Professional College Portal Theme
Mobile Responsive
Dark/Light Mode
Clean Analytics Layout
Pages Required
Public Pages
Landing Page
About Page
Contact Page
Login/Register
Student Dashboard
Profile
Applications
Job Drives
Offers
Analytics
Recruiter Dashboard
Post Drives
Applicants
Interviews
Shortlists
Coordinator Dashboard
Placement Statistics
Manage Students
Reports
Notifications
6. Database Design (MongoDB)
Collections
Users Collection
{
  name,
  email,
  password,
  role,
  branch,
  year,
  cgpa,
  skills: [],
  resumeUrl,
  createdAt
}
Companies Collection
{
  companyName,
  recruiterName,
  email,
  logo,
  industry,
  createdAt
}
Job Drives Collection
{
  companyId,
  role,
  package,
  eligibility,
  branches: [],
  deadline,
  driveDate,
  status
}
Applications Collection
{
  studentId,
  driveId,
  status,
  appliedAt
}
Interviews Collection
{
  studentId,
  driveId,
  interviewDate,
  mode,
  meetingLink,
  status
}
Offers Collection
{
  studentId,
  companyId,
  package,
  offerLetter,
  status
}
7. API Modules
Authentication APIs
POST /register
POST /login
POST /forgot-password
Student APIs
GET /profile
PUT /profile
POST /resume-upload
GET /applications
Job APIs
GET /jobs
POST /jobs
PUT /jobs/:id
DELETE /jobs/:id
Application APIs
POST /apply
GET /applications
PUT /application-status
Interview APIs
POST /schedule-interview
GET /interviews
Offer APIs
POST /offer
GET /offers
8. Frontend Folder Structure
src/
│
├── components/
├── pages/
├── layouts/
├── hooks/
├── context/
├── services/
├── utils/
├── charts/
├── forms/
└── assets/
9. Backend Folder Structure
server/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── config/
├── utils/
└── server.js
10. Security Features
Security Implementation
JWT Authentication
Password Hashing
Protected Routes
Role-Based Authorization
Input Validation
Secure File Upload
API Rate Limiting
11. Performance Requirements
System Requirements
Fast Dashboard Loading
Optimized API Calls
Lazy Loading
Pagination
Responsive UI
12. Real-World Challenges Solved
Problems Solved
Manual placement management
Excel-based tracking
Interview confusion
Offer tracking difficulty
Communication delays
Placement data analysis issues
13. Future Enhancements
Advanced Features
AI Resume Analyzer
AI Skill Recommendation
Video Interview Integration
Real-Time Chat System
Internship Portal
Attendance Tracking
Mobile Application
14. Sample Dummy Login Credentials
Student Login
Email: student@college.com
Password: student123
Coordinator Login
Email: coordinator@college.com
Password: admin123
Recruiter Login
Email: recruiter@company.com
Password: recruiter123
15. Landing Page Sections
Landing Page Includes
Hero Section
Placement Statistics
Top Recruiters
Student Success Stories
Placement Process
Company Logos
FAQ Section
Footer
16. Dashboard Widgets
Dashboard Cards
Total Students
Active Drives
Placed Students
Highest Package
Average Package
Pending Interviews
17. Recharts Graph Suggestions
Recommended Charts
Bar Chart
Pie Chart
Area Chart
Line Chart
Radial Chart
18. Email.js Templates
Email Templates Needed
Registration Success
Interview Invitation
Offer Letter Notification
Password Reset
Application Confirmation
19. Constraints Followed

✅ React.js Used
✅ Node.js Used
✅ MongoDB Used
✅ React Hook Form Used
✅ Recharts Used
✅ Email.js Used
✅ No PostgreSQL Used
✅ Real-world Architecture Included
✅ Dummy Backend Data Included
✅ Full Website Structure Included

20. Final Goal

Build a scalable and professional Placement Management System that helps colleges automate campus recruitment activities efficiently while providing students and recruiters with a seamless digital experience.