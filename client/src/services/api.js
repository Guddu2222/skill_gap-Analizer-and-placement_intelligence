
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchAnalytics = async () => {
  try {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return null;
  }
};

export const fetchJobs = async () => {
  try {
    const response = await api.get('/jobs');
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};

// Auth API methods
export const register = async (payload) => {
  const response = await api.post('/auth/register', payload);
  return response.data;
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    return { success: true };
  } catch (error) {
    throw error;
  }
};

// College dashboard & student management (college_admin)
export const fetchCollegeDashboard = async () => {
  const { data } = await api.get('/college-features/dashboard');
  return data;
};

export const fetchCollegeStudents = async (params = {}) => {
  const { data } = await api.get('/college-features/students', { params });
  return data;
};

export const fetchCollegeSkillsAnalytics = async () => {
  const { data } = await api.get('/college-features/skills/analytics');
  return data;
};

export const fetchCollegeDepartmentSkills = async (department) => {
  const { data } = await api.get(`/college-features/skills/department/${encodeURIComponent(department)}`);
  return data;
};

export const exportCollegeStudents = async (format = 'csv') => {
  const response = await api.get('/college-features/students/export', {
    params: { format },
    responseType: format === 'csv' ? 'blob' : 'json',
  });
  return response.data;
};

// ==================== RECRUITER API ====================

export const fetchRecruiterStats = async () => {
  const { data } = await api.get('/recruiter-features/dashboard/stats');
  return data;
};

export const fetchRecruiterColleges = async (params = {}) => {
  const { data } = await api.get('/recruiter-features/colleges', { params });
  return data;
};

export const fetchCollegeDetail = async (collegeId) => {
  const { data } = await api.get(`/recruiter-features/colleges/${collegeId}`);
  return data;
};

export const searchCandidates = async (criteria) => {
  const { data } = await api.post('/recruiter-features/search/candidates', criteria);
  return data;
};

export const fetchDomainExperts = async (domain, limit = 20) => {
  const { data } = await api.get(`/recruiter-features/candidates/top-by-domain/${domain}`, { params: { limit } });
  return data;
};

export const saveCandidate = async (studentId, folderName = 'General', notes = '', rating = null) => {
  const { data } = await api.post('/recruiter-features/candidates/save', { studentId, folderName, notes, rating });
  return data;
};

export const fetchSavedCandidates = async (params = {}) => {
  const { data } = await api.get('/recruiter-features/candidates/saved', { params });
  return data;
};

export const updateCandidateStatus = async (id, status, notes = '') => {
  const { data } = await api.patch(`/recruiter-features/candidates/saved/${id}/status`, { status, notes });
  return data;
};

export const unsaveCandidate = async (studentId) => {
  const { data } = await api.delete(`/recruiter-features/candidates/save/${studentId}`);
  return data;
};

// ==================== STUDENT API ====================
export const fetchStudentProfile = async () => {
  const { data } = await api.get('/student-features/me');
  return data;
};

export const fetchSkillGap = async () => {
  const { data } = await api.get('/student-features/skill-gap');
  return data;
};

// ==================== SKILL GAP ANALYSIS API ====================
export const triggerSkillGapAnalysis = async (targetDomain, targetRole) => {
  const { data } = await api.post('/skill-gap/analyze', { targetDomain, targetRole });
  return data;
};

export const fetchLatestSkillGapAnalysis = async () => {
  const { data } = await api.get('/skill-gap/latest');
  return data;
};

export const fetchLearningPaths = async () => {
  const { data } = await api.get('/skill-gap/learning-paths');
  return data;
};

export const uploadProfilePicture = async (formData) => {
  const { data } = await api.post('/student-features/upload-profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export default api;

