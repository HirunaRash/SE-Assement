export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'team_member' | 'manager' | 'admin';
  createdAt: string;
}

export interface Report {
  id: number;
  userId: number;
  weekStartDate: string;
  projectId?: number;
  status: 'Draft' | 'Submitted' | 'Needs Correction' | 'Approved';
  achievements?: string;
  blockers?: string;
  plannedNextWeek?: string;
  keyAchievement?: string;
  keyBlocker?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportTask {
  id: number;
  reportId: number;
  taskName: string;
  priority: 'Low' | 'Medium' | 'High';
  plannedPercentage: number;
  actualPercentage: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  timePlannedHours: number;
  timeSpentHours: number;
  deliverable?: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}