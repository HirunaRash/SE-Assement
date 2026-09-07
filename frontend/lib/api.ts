// frontend/src/lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type RequestInit = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
};

async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Get token from localStorage if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  console.log(`[API] ${options.method || 'GET'} ${endpoint}:`, data); // Debug

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.error || data.data?.error || 'An error occurred',
      data,
    };
  }

  // Unwrap the response if it's wrapped in a "data" property
  // Backend returns { data: { ... } } so we need to extract the inner data
  return data.data || data;
}

const request = (method: string, endpoint: string, body?: unknown) => fetchWithAuth(endpoint, {
  method,
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});

export const api = {
  get: (endpoint: string, options?: { params?: Record<string, string> }) => {
    const query = options?.params ? new URLSearchParams(options.params).toString() : '';
    return request('GET', `${endpoint}${query ? `?${query}` : ''}`);
  },
  post: (endpoint: string, body?: unknown) => request('POST', endpoint, body),
  patch: (endpoint: string, body?: unknown) => request('PATCH', endpoint, body),
  put: (endpoint: string, body?: unknown) => request('PUT', endpoint, body),
  delete: (endpoint: string) => request('DELETE', endpoint),

  // Auth endpoints
  register: (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) => fetchWithAuth('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  login: (email: string, password: string) =>
    fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => fetchWithAuth('/auth/me'),

  // Projects endpoints
  getProjects: () => fetchWithAuth('/projects'),

  createProject: (payload: {
    name: string;
    description?: string;
    color?: string;
    status?: string;
  }) => fetchWithAuth('/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  updateProject: (id: number, payload: any) =>
    fetchWithAuth(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteProject: (id: number) =>
    fetchWithAuth(`/projects/${id}`, {
      method: 'DELETE',
    }),

  // Reports endpoints (Team Member)
  getMyReports: (query?: string) =>
    fetchWithAuth(`/reports/my-reports${query ? `?${query}` : ''}`),

  getReportById: (id: number) =>
    fetchWithAuth(`/reports/${id}`),

  createReport: (payload: {
    weekStartDate: string;
    weekEndDate: string;
    projectId: number;
  }) => fetchWithAuth('/reports', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  updateReport: (id: number, payload: any) =>
    fetchWithAuth(`/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  submitReport: (id: number) =>
    fetchWithAuth(`/reports/${id}/submit`, {
      method: 'PUT',
    }),

  // Reports endpoints (Manager)
  getAllReports: (query?: string) =>
    fetchWithAuth(`/reports${query ? `?${query}` : ''}`),

  approveReport: (id: number) =>
    fetchWithAuth(`/reports/${id}/approve`, {
      method: 'PUT',
    }),

  requestChanges: (id: number, comment: string) =>
    fetchWithAuth(`/reports/${id}/request-changes`, {
      method: 'PUT',
      body: JSON.stringify({ comment }),
    }),

  getReportVersions: (id: number) =>
    fetchWithAuth(`/reports/${id}/versions`),

  getReportVersion: (id: number, versionNumber: number) =>
    fetchWithAuth(`/reports/${id}/versions/${versionNumber}`),

  getReviewHistory: (id: number) =>
    fetchWithAuth(`/reports/${id}/review-history`),

  // Tasks endpoints
  addTask: (reportId: number, payload: any) =>
    fetchWithAuth(`/reports/${reportId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateTask: (reportId: number, taskId: number, payload: any) =>
    fetchWithAuth(`/reports/${reportId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteTask: (reportId: number, taskId: number) =>
    fetchWithAuth(`/reports/${reportId}/tasks/${taskId}`, {
      method: 'DELETE',
    }),

  // Blockers endpoints
  addBlocker: (reportId: number, payload: any) =>
    fetchWithAuth(`/reports/${reportId}/blockers`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateBlocker: (reportId: number, blockerId: number, payload: any) =>
    fetchWithAuth(`/reports/${reportId}/blockers/${blockerId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteBlocker: (reportId: number, blockerId: number) =>
    fetchWithAuth(`/reports/${reportId}/blockers/${blockerId}`, {
      method: 'DELETE',
    }),

  // Achievements endpoints
  addAchievement: (reportId: number, payload: any) =>
    fetchWithAuth(`/reports/${reportId}/achievements`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateAchievement: (reportId: number, achievementId: number, payload: any) =>
    fetchWithAuth(`/reports/${reportId}/achievements/${achievementId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteAchievement: (reportId: number, achievementId: number) =>
    fetchWithAuth(`/reports/${reportId}/achievements/${achievementId}`, {
      method: 'DELETE',
    }),

  // Next week tasks endpoints
  addNextWeekTask: (reportId: number, payload: any) =>
    fetchWithAuth(`/reports/${reportId}/next-week-tasks`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateNextWeekTask: (reportId: number, taskId: number, payload: any) =>
    fetchWithAuth(`/reports/${reportId}/next-week-tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteNextWeekTask: (reportId: number, taskId: number) =>
    fetchWithAuth(`/reports/${reportId}/next-week-tasks/${taskId}`, {
      method: 'DELETE',
    }),

  // Time by task type endpoints
  addTimeByType: (reportId: number, payload: any) =>
    fetchWithAuth(`/reports/${reportId}/time-by-type`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Analytics endpoints
  getSummary: (query?: string) =>
    fetchWithAuth(`/analytics/summary${query ? `?${query}` : ''}`),

  getSubmissionByUser: (query?: string) =>
    fetchWithAuth(`/analytics/submission-by-user${query ? `?${query}` : ''}`),

  getTasksTrend: (query?: string) =>
    fetchWithAuth(`/analytics/tasks-completed-trend${query ? `?${query}` : ''}`),

  getWorkloadByProject: () =>
    fetchWithAuth('/analytics/workload-by-project'),

  getTimeByTaskType: () =>
    fetchWithAuth('/analytics/time-by-task-type'),

  getRecentActivity: (query?: string) =>
    fetchWithAuth(`/analytics/recent-activity${query ? `?${query}` : ''}`),

  getBlockers: () =>
    fetchWithAuth('/analytics/blockers'),
};

export default api;