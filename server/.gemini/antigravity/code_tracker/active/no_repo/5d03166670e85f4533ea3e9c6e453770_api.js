¾%
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

export default api;

ß *cascade08ßÕÕÜ *cascade08ÜÝÝÞ *cascade08Þ——Ÿ *cascade08Ÿ¹¹º *cascade08ºééê *cascade08êöö÷ *cascade08÷øøù *cascade08ùúúû *cascade08û³³´ *cascade08´¹¹º *cascade08ºÂÂÄ *cascade08ÄÊÊË *cascade08Ëòòó *cascade08ó¦¦§ *cascade08
§Š Šó"*cascade08ó"ª$*cascade08
ª$±$ ±$°%*cascade08
°%¼% ¼%½% *cascade08½%¾%*cascade082cfile:///d:/project/Skill_Gap%20Analyser%20and%20placement%20intelligence/client/src/services/api.js