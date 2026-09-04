// API base URL
const configuredApiUrl = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");
const normalizedApiUrl = configuredApiUrl.replace(/\/api(?:\/api)+$/i, "/api");
const API_BASE_URL = normalizedApiUrl.endsWith("/api")
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api`;

// Create headers with auth token if available
const getHeaders = () => {
  return {
    "Content-Type": "application/json",
  };
};

// Auth API calls
export const authAPI = {
  // Register new user
  register: async (email, password, name, role) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, name, role }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }

    return data;
  },

  // Login user
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    return data;
  },

  // Get current user (protected route)
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch user");
    }

    return data;
  },

  syncSupabaseUser: async (accessToken, profile = {}) => {
    const response = await fetch(`${API_BASE_URL}/auth/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(profile),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to sync user profile");
    }

    return data;
  },

  logout: async () => {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  },

  clearLocalUser: () => {
    localStorage.removeItem("user");
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to change password");
    }

    return data;
  },
};

// Assessment API calls (skill tests + skill profile persisted in Supabase)
export const assessmentAPI = {
  getSkillTestResults: async () => {
    const response = await fetch(`${API_BASE_URL}/assessments/skill-tests/results`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch assessment results");
    return data;
  },

  submitSkillTestResult: async (testId, payload) => {
    const response = await fetch(`${API_BASE_URL}/assessments/skill-tests/${testId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to submit assessment result");
    return data;
  },

  getSkillProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/assessments/skill-profile`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch skill profile");
    return data;
  },

  upsertSkillProfileEntry: async (payload) => {
    const response = await fetch(`${API_BASE_URL}/assessments/skill-profile/upsert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to update skill profile");
    return data;
  },
};

// AI Career Advisor — real LLM call (Gemini, via the backend so the API
// key never reaches the browser). context carries the student's real
// readiness/matched/missing skills so the model answers grounded in actual
// data instead of guessing.
export const aiAdvisorAPI = {
  ask: async (message, context) => {
    const response = await fetch(`${API_BASE_URL}/ai-advisor/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message, context }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const err = new Error(data.error || "AI Career Advisor request failed");
      err.status = response.status;
      throw err;
    }

    return data;
  },
};

// Generic authenticated JSON request helper for the full-migration endpoints
// below — every one of these follows the exact same fetch/credentials/error
// shape as authAPI/assessmentAPI, so this avoids repeating it 20+ times.
async function request(path, { method = "GET", body } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data.error || `Request to ${path} failed`);
    err.status = response.status;
    throw err;
  }
  return data;
}

// Student state (target role, learning progress, notification prefs/read
// state, enrollments) — see backend/src/routes/studentStateRoutes.js
export const studentStateAPI = {
  getTargetRole: () => request("/student/target-role"),
  setTargetRole: (roleId) => request("/student/target-role", { method: "POST", body: { roleId } }),

  getLearningProgress: () => request("/student/learning-progress"),
  setLearningProgress: (skillName, completedModules) =>
    request("/student/learning-progress", { method: "POST", body: { skillName, completedModules } }),

  getNotificationPreferences: () => request("/student/notification-preferences"),
  saveNotificationPreferences: (prefs) => request("/student/notification-preferences", { method: "POST", body: prefs }),

  getReadNotificationIds: () => request("/student/notification-read-state"),
  markNotificationsRead: (notificationIds) =>
    request("/student/notification-read-state", { method: "POST", body: { notificationIds } }),

  getEnrolledCourseIds: () => request("/student/enrollments"),
  enrollInCourse: (courseId) => request("/student/enrollments", { method: "POST", body: { courseId } }),

  getSavedOpportunityIds: () => request("/student/saved-opportunities"),
  saveOpportunity: (opportunityId) => request("/student/saved-opportunities", { method: "POST", body: { opportunityId } }),
  unsaveOpportunity: (opportunityId) => request(`/student/saved-opportunities/${opportunityId}`, { method: "DELETE" }),
};

// Portfolio — see backend/src/routes/portfolioRoutes.js
export const portfolioAPI = {
  getPortfolio: () => request("/portfolio"),
  saveBasics: (basics) => request("/portfolio/basics", { method: "POST", body: basics }),
  seed: (portfolio) => request("/portfolio/seed", { method: "POST", body: portfolio }),
};

// Applications — see backend/src/routes/applicationsRoutes.js
export const applicationsAPI = {
  getApplications: () => request("/applications"),
  applyToOpportunity: (payload) => request("/applications", { method: "POST", body: payload }),
  // Recruiter-side: moves a REAL student application's status. Ownership is
  // enforced server-side (the application must belong to an opportunity this
  // recruiter posted), so this call fails harmlessly for anyone else's applications.
  updateApplicationStatus: (id, status) => request(`/applications/${id}/status`, { method: "PATCH", body: { status } }),
};

// Messages — see backend/src/routes/messagesRoutes.js
export const messagesAPI = {
  getConversationState: () => request("/messages"),
  sendMessage: (conversationId, text) => request("/messages/send", { method: "POST", body: { conversationId, text } }),
  markConversationRead: (conversationId) => request("/messages/read", { method: "POST", body: { conversationId } }),
};

// Industry — see backend/src/routes/industryRoutes.js
export const industryAPI = {
  getCompanyProfile: () => request("/industry/company-profile"),
  saveCompanyProfile: (fields) => request("/industry/company-profile", { method: "POST", body: fields }),

  getPostedOpportunities: () => request("/industry/opportunities"),
  createOpportunity: (fields) => request("/industry/opportunities", { method: "POST", body: fields }),
  updateOpportunityStatus: (id, status) => request(`/industry/opportunities/${id}/status`, { method: "PATCH", body: { status } }),

  // Real student applications against opportunities this recruiter posted —
  // the join the Applicant Pipeline was missing.
  getApplicationsForMyOpportunities: () => request("/industry/applications"),

  getPipelineOverrides: () => request("/industry/pipeline-overrides"),
  setPipelineStage: (entryId, stage) => request("/industry/pipeline-overrides", { method: "POST", body: { entryId, stage } }),

  getAllSkillPrograms: () => request("/industry/skill-programs"),
  createSkillProgram: (payload) => request("/industry/skill-programs", { method: "POST", body: payload }),
};

export default authAPI;
