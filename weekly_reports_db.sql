
-- WEEKLY REPORT GENERATOR & TEAM DASHBOARD - COMPLETE DATABASE SCHEMA

CREATE DATABASE Weekly_reports_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Weekly_reports_db;

-- =========================================================================
-- 1. ROLES TABLE
-- =========================================================================
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO roles (name, description) VALUES
('team_member', 'Team member - can create and submit reports'),
('manager', 'Manager - can review reports and manage team'),
('admin', 'Admin - full system access');

-- =========================================================================
-- 2. USERS TABLE
-- =========================================================================
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  profilePhoto VARCHAR(500),
  bio TEXT,
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  lastLogin TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 3. USER_ROLES JUNCTION TABLE (Support multiple roles per user)
-- =========================================================================
CREATE TABLE user_roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  roleId INT NOT NULL,
  assignedBy INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_user_role (userId, roleId),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (assignedBy) REFERENCES users(id) ON DELETE SET NULL,
  
  INDEX idx_userId (userId),
  INDEX idx_roleId (roleId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 4. PROJECTS/CATEGORIES TABLE
-- =========================================================================
CREATE TABLE projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7),
  status ENUM('active', 'archived') DEFAULT 'active',
  createdBy INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL,
  
  INDEX idx_name (name),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 5. PROJECT_TEAM_MEMBERS (Link team members to projects - optional)
-- =========================================================================
CREATE TABLE project_team_members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  projectId INT NOT NULL,
  userId INT NOT NULL,
  assignedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_project_member (projectId, userId),
  FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  
  INDEX idx_projectId (projectId),
  INDEX idx_userId (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 6. REPORTS TABLE (Main report record with metadata)
-- =========================================================================
CREATE TABLE reports (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  weekStartDate DATE NOT NULL,
  weekEndDate DATE NOT NULL,
  projectId INT,
  status ENUM('draft', 'submitted', 'needs_correction', 'approved') DEFAULT 'draft',
  lastReviewComment TEXT,
  lastReviewedBy INT,
  lastReviewedAt TIMESTAMP NULL,
  submittedAt TIMESTAMP NULL,
  approvedAt TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE SET NULL,
  FOREIGN KEY (lastReviewedBy) REFERENCES users(id) ON DELETE SET NULL,
  
  INDEX idx_userId (userId),
  INDEX idx_status (status),
  INDEX idx_weekDates (weekStartDate, weekEndDate),
  INDEX idx_projectId (projectId),
  INDEX idx_createdAt (createdAt),
  UNIQUE KEY unique_user_week (userId, weekStartDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 7. REPORT_TASKS TABLE (Individual tasks completed - the main data table)
-- =========================================================================
CREATE TABLE report_tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reportId INT NOT NULL,
  taskName VARCHAR(500) NOT NULL,
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  plannedPercentage INT DEFAULT 0,
  actualPercentage INT DEFAULT 0,
  status ENUM('not_started', 'in_progress', 'completed', 'blocked') DEFAULT 'not_started',
  timePlannedHours DECIMAL(10, 2) DEFAULT 0,
  timeSpentHours DECIMAL(10, 2) DEFAULT 0,
  deliverable TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (reportId) REFERENCES reports(id) ON DELETE CASCADE,
  
  INDEX idx_reportId (reportId),
  INDEX idx_status (status),
  INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 8. REPORT_BLOCKERS TABLE (Challenges/blockers)
-- =========================================================================
CREATE TABLE report_blockers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reportId INT NOT NULL,
  description TEXT NOT NULL,
  impact ENUM('low', 'medium', 'high') DEFAULT 'medium',
  isKeyIssue BOOLEAN DEFAULT FALSE,
  resolution TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (reportId) REFERENCES reports(id) ON DELETE CASCADE,
  
  INDEX idx_reportId (reportId),
  INDEX idx_isKeyIssue (isKeyIssue)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 9. REPORT_ACHIEVEMENTS TABLE (Highlights/achievements)
-- =========================================================================
CREATE TABLE report_achievements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reportId INT NOT NULL,
  description TEXT NOT NULL,
  impact ENUM('low', 'medium', 'high') DEFAULT 'medium',
  isKeyAchievement BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (reportId) REFERENCES reports(id) ON DELETE CASCADE,
  
  INDEX idx_reportId (reportId),
  INDEX idx_isKeyAchievement (isKeyAchievement)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 10. REPORT_NEXT_WEEK_TASKS TABLE (Planned tasks for next week)
-- =========================================================================
CREATE TABLE report_next_week_tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reportId INT NOT NULL,
  taskName VARCHAR(500) NOT NULL,
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  estimatedHours DECIMAL(10, 2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (reportId) REFERENCES reports(id) ON DELETE CASCADE,
  
  INDEX idx_reportId (reportId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 11. REPORT_TIME_BY_TASK_TYPE TABLE (Hours breakdown - optional but tracked)
-- =========================================================================
CREATE TABLE report_time_by_task_type (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reportId INT NOT NULL,
  taskType VARCHAR(100) NOT NULL,
  hours DECIMAL(10, 2) DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (reportId) REFERENCES reports(id) ON DELETE CASCADE,
  
  INDEX idx_reportId (reportId),
  INDEX idx_taskType (taskType)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 12. REPORT_OPTIONAL_FIELDS TABLE (Notes, links, and other optional data)
-- =========================================================================
CREATE TABLE report_optional_fields (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reportId INT NOT NULL,
  notes TEXT,
  additionalLinks VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (reportId) REFERENCES reports(id) ON DELETE CASCADE,
  
  INDEX idx_reportId (reportId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 13. REPORT_REVIEW_HISTORY TABLE (Full history of review comments & status changes)
-- =========================================================================
CREATE TABLE report_review_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reportId INT NOT NULL,
  reviewedBy INT,
  previousStatus ENUM('draft', 'submitted', 'needs_correction', 'approved'),
  newStatus ENUM('draft', 'submitted', 'needs_correction', 'approved') NOT NULL,
  comment TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (reportId) REFERENCES reports(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewedBy) REFERENCES users(id) ON DELETE SET NULL,
  
  INDEX idx_reportId (reportId),
  INDEX idx_reviewedBy (reviewedBy),
  INDEX idx_newStatus (newStatus),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 14. REPORT_VERSIONS TABLE (Track previous versions of reports during corrections)
-- =========================================================================
CREATE TABLE report_versions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reportId INT NOT NULL,
  versionNumber INT NOT NULL,
  submittedAt TIMESTAMP NOT NULL,
  submittedBy INT,
  reviewCommentFromManager TEXT,
  reviewedBy INT,
  reviewedAt TIMESTAMP NULL,
  status ENUM('submitted', 'needs_correction', 'approved') NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (reportId) REFERENCES reports(id) ON DELETE CASCADE,
  FOREIGN KEY (submittedBy) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (reviewedBy) REFERENCES users(id) ON DELETE SET NULL,
  
  INDEX idx_reportId (reportId),
  INDEX idx_versionNumber (versionNumber),
  UNIQUE KEY unique_report_version (reportId, versionNumber)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 15. REPORT_VERSION_TASKS TABLE (Store task snapshots for each version)
-- =========================================================================
CREATE TABLE report_version_tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  versionId INT NOT NULL,
  taskName VARCHAR(500) NOT NULL,
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  plannedPercentage INT DEFAULT 0,
  actualPercentage INT DEFAULT 0,
  status ENUM('not_started', 'in_progress', 'completed', 'blocked') DEFAULT 'not_started',
  timePlannedHours DECIMAL(10, 2) DEFAULT 0,
  timeSpentHours DECIMAL(10, 2) DEFAULT 0,
  deliverable TEXT,
  
  FOREIGN KEY (versionId) REFERENCES report_versions(id) ON DELETE CASCADE,
  
  INDEX idx_versionId (versionId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- SAMPLE DATA FOR TESTING
-- =========================================================================

-- Insert test users
INSERT INTO users (email, password, firstName, lastName, status) VALUES
('alice@company.com', '$2a$10$hashedpassword1', 'Alice', 'Johnson', 'active'),
('bob@company.com', '$2a$10$hashedpassword2', 'Bob', 'Smith', 'active'),
('charlie@company.com', '$2a$10$hashedpassword3', 'Charlie', 'Brown', 'active'),
('diane@company.com', '$2a$10$hashedpassword4', 'Diane', 'Davis', 'active'),
('manager@company.com', '$2a$10$hashedpassword5', 'Manager', 'Lead', 'active'),
('admin@company.com', '$2a$10$hashedpassword6', 'Admin', 'User', 'active');

-- Assign roles
INSERT INTO user_roles (userId, roleId) VALUES
(1, 1), -- Alice is team_member
(2, 1), -- Bob is team_member
(3, 1), -- Charlie is team_member
(4, 1), -- Diane is team_member
(5, 2), -- Manager is manager
(6, 3); -- Admin is admin

-- Insert projects
INSERT INTO projects (name, description, color, createdBy) VALUES
('Client A', 'Main client project', '#FF6B6B', 5),
('Internal Tooling', 'Internal system improvements', '#4ECDC4', 5),
('R&D', 'Research and development', '#45B7D1', 5),
('Marketing', 'Marketing initiatives', '#FFA07A', 5);

-- Insert sample reports for Week 1 (Sept 1-7, 2026)
INSERT INTO reports (userId, weekStartDate, weekEndDate, projectId, status, submittedAt) VALUES
(1, '2026-08-25', '2026-08-31', 1, 'approved', NOW()),
(2, '2026-08-25', '2026-08-31', 2, 'approved', NOW()),
(3, '2026-08-25', '2026-08-31', 1, 'needs_correction', NOW()),
(4, '2026-08-25', '2026-08-31', 3, 'draft', NULL);

-- Insert sample tasks for reports
INSERT INTO report_tasks (reportId, taskName, priority, plannedPercentage, actualPercentage, status, timePlannedHours, timeSpentHours, deliverable) VALUES
(1, 'Implemented authentication', 'high', 100, 100, 'completed', 8, 8.5, 'JWT login system'),
(1, 'API documentation', 'medium', 80, 85, 'completed', 4, 4.2, 'Swagger docs'),
(2, 'Database optimization', 'high', 100, 90, 'in_progress', 12, 11, 'Query performance improved'),
(3, 'UI components refactor', 'medium', 50, 40, 'in_progress', 6, 5.5, 'Partial refactor'),
(3, 'Testing', 'high', 60, 30, 'in_progress', 8, 4, 'Unit tests in progress');

-- Insert sample blockers
INSERT INTO report_blockers (reportId, description, impact, isKeyIssue) VALUES
(3, 'Unclear requirements for feature X', 'high', TRUE),
(4, 'Waiting for API documentation', 'medium', FALSE);

-- Insert sample achievements
INSERT INTO report_achievements (reportId, description, impact, isKeyAchievement) VALUES
(1, 'Completed authentication ahead of schedule', 'high', TRUE),
(1, 'Improved API response time by 40%', 'high', FALSE),
(2, 'Documented all database queries', 'medium', FALSE);

-- Insert next week tasks
INSERT INTO report_next_week_tasks (reportId, taskName, priority, estimatedHours) VALUES
(1, 'Implement user role management', 'high', 8),
(1, 'Add email notifications', 'medium', 6),
(2, 'Optimize search queries', 'high', 10);

-- Insert sample time by task type
INSERT INTO report_time_by_task_type (reportId, taskType, hours) VALUES
(1, 'Development', 12),
(1, 'Testing', 3),
(1, 'Meetings', 1.5),
(1, 'Documentation', 1),
(2, 'Development', 15),
(2, 'Meetings', 2),
(2, 'Documentation', 1);

-- Insert optional fields
INSERT INTO report_optional_fields (reportId, notes, additionalLinks) VALUES
(1, 'Great progress this week', 'https://github.com/project/issues'),
(2, 'Need to discuss database strategy', 'https://docs.company.com/db-guide');

 



