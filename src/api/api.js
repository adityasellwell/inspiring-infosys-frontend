// API client layer for Inspiring Infosys CMS & Leads
const API_BASE = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3001/api'
    : 'https://api.inspiringinfosys.com/api'
);

// Helper to add auth headers automatically
const getHeaders = (isJson = true) => {
  const token = localStorage.getItem('admin_token');
  const headers = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// ── Auth Endpoints ──────────────────────────────────────────────────
export const authApi = {
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },
  me: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(false),
    });
    return res.json();
  },
  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_name');
  }
};

// ── Stats Endpoints ─────────────────────────────────────────────────
export const statsApi = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/stats`);
    return res.json();
  },
  create: async (statData) => {
    const res = await fetch(`${API_BASE}/stats`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(statData),
    });
    return res.json();
  },
  update: async (id, statData) => {
    const res = await fetch(`${API_BASE}/stats/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(statData),
    });
    return res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/stats/${id}`, {
      method: 'DELETE',
      headers: getHeaders(false),
    });
    return res.json();
  },
  getVisitorCount: async () => {
    const res = await fetch(`${API_BASE}/stats/visitor-count`);
    return res.json();
  },
  hitVisitorCount: async () => {
    const res = await fetch(`${API_BASE}/stats/visitor-count/hit`, {
      method: 'POST'
    });
    return res.json();
  }
};

// ── Testimonials Endpoints ──────────────────────────────────────────
export const testimonialsApi = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/testimonials`);
    return res.json();
  },
  getGoogleReviews: async () => {
    const res = await fetch(`${API_BASE}/testimonials/google`);
    return res.json();
  },
  create: async (testiData) => {
    const res = await fetch(`${API_BASE}/testimonials`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(testiData),
    });
    return res.json();
  },
  update: async (id, testiData) => {
    const res = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(testiData),
    });
    return res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: 'DELETE',
      headers: getHeaders(false),
    });
    return res.json();
  }
};

// ── Projects Endpoints ──────────────────────────────────────────────
export const projectsApi = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/projects`);
    return res.json();
  },
  create: async (projData) => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(projData),
    });
    return res.json();
  },
  update: async (id, projData) => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(projData),
    });
    return res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders(false),
    });
    return res.json();
  }
};

// ── Quotes Endpoints (Quotes Inbox + Website Submit) ────────────────
export const quotesApi = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/quotes`, {
      headers: getHeaders(false),
    });
    return res.json();
  },
  submit: async (quoteData) => {
    const res = await fetch(`${API_BASE}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quoteData),
    });
    return res.json();
  },
  updateStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/quotes/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return res.json();
  },
  update: async (id, quoteData) => {
    const res = await fetch(`${API_BASE}/quotes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(quoteData),
    });
    return res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/quotes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(false),
    });
    return res.json();
  }
};

// ── Consultations Endpoints (Contact Submissions) ────────────────────
export const consultationsApi = {
  getCaptcha: async () => {
    const res = await fetch(`${API_BASE}/consultations/captcha`);
    return res.json();
  },
  getAll: async () => {
    const res = await fetch(`${API_BASE}/consultations`, {
      headers: getHeaders(false),
    });
    return res.json();
  },
  submit: async (consultationData) => {
    const res = await fetch(`${API_BASE}/consultations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(consultationData),
    });
    return res.json();
  },
  updateStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/consultations/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/consultations/${id}`, {
      method: 'DELETE',
      headers: getHeaders(false),
    });
    return res.json();
  }
};

// ── Service Categories & Filings Endpoints ──────────────────────────
export const categoriesApi = {
  // Public route (loads active categories and active filings for GetQuote)
  getActive: async () => {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  },
  // Admin route (loads active + inactive categories & filings)
  getAllAdmin: async () => {
    const res = await fetch(`${API_BASE}/categories/all`, {
      headers: getHeaders(false),
    });
    return res.json();
  },
  createCategory: async (catData) => {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(catData),
    });
    return res.json();
  },
  updateCategory: async (id, catData) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(catData),
    });
    return res.json();
  },
  deleteCategory: async (id) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(false),
    });
    return res.json();
  },
  createFiling: async (filingData) => {
    const res = await fetch(`${API_BASE}/categories/filings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(filingData),
    });
    return res.json();
  },
  updateFiling: async (id, filingData) => {
    const res = await fetch(`${API_BASE}/categories/filings/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(filingData),
    });
    return res.json();
  },
  deleteFiling: async (id) => {
    const res = await fetch(`${API_BASE}/categories/filings/${id}`, {
      method: 'DELETE',
      headers: getHeaders(false),
    });
    return res.json();
  }
};

// ── Turnover Options Endpoints (Get Quote Step 3) ───────────────────
export const turnoverApi = {
  // Public route (loads active options for GetQuote)
  getActive: async () => {
    const res = await fetch(`${API_BASE}/turnover-options`);
    return res.json();
  },
  // Admin route (loads active + inactive options)
  getAllAdmin: async () => {
    const res = await fetch(`${API_BASE}/turnover-options/all`, {
      headers: getHeaders(false),
    });
    return res.json();
  },
  create: async (optionData) => {
    const res = await fetch(`${API_BASE}/turnover-options`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(optionData),
    });
    return res.json();
  },
  update: async (id, optionData) => {
    const res = await fetch(`${API_BASE}/turnover-options/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(optionData),
    });
    return res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/turnover-options/${id}`, {
      method: 'DELETE',
      headers: getHeaders(false),
    });
    return res.json();
  }
};
// ── Employee Admin HR Operations Endpoints ──────────────────────────
export const employeesApi = {
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE}/employees/dashboard-stats`, {
      headers: getHeaders(false),
    });
    return res.json();
  },

  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE}/employees?${query}` : `${API_BASE}/employees`;
    const res = await fetch(url, {
      headers: getHeaders(false),
    });
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      headers: getHeaders(false),
    });
    return res.json();
  },

  create: async (employeeData) => {
    const res = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(employeeData),
    });
    return res.json();
  },

  update: async (id, employeeData) => {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(employeeData),
    });
    return res.json();
  },

  delete: async (id, permanent = false) => {
    const res = await fetch(`${API_BASE}/employees/${id}${permanent ? '?permanent=true' : ''}`, {
      method: 'DELETE',
      headers: getHeaders(false),
    });
    return res.json();
  },

  resetPassword: async (id, password) => {
    const res = await fetch(`${API_BASE}/employees/${id}/reset-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ password }),
    });
    return res.json();
  },

  uploadDocument: async (empId, docData) => {
    const res = await fetch(`${API_BASE}/employees/${empId}/documents`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(docData),
    });
    return res.json();
  },

  deleteDocument: async (docId) => {
    const res = await fetch(`${API_BASE}/employees/documents/${docId}`, {
      method: 'DELETE',
      headers: getHeaders(false),
    });
    return res.json();
  },

  generateLetter: async (empId, letterData) => {
    const res = await fetch(`${API_BASE}/employees/${empId}/letters`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(letterData),
    });
    return res.json();
  },

  getAllRequests: async () => {
    const res = await fetch(`${API_BASE}/employees/requests/all`, {
      headers: getHeaders(false),
    });
    return res.json();
  },

  updateRequestStatus: async (reqId, status) => {
    const res = await fetch(`${API_BASE}/employees/requests/${reqId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  issueSalarySlip: async (slipData) => {
    const res = await fetch(`${API_BASE}/employees/salary-slips`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(slipData),
    });
    return res.json();
  },

  getAllQueries: async () => {
    const res = await fetch(`${API_BASE}/employees/queries/all`, {
      headers: getHeaders(false),
    });
    return res.json();
  },

  replyQuery: async (id, reply) => {
    const res = await fetch(`${API_BASE}/employees/queries/${id}/reply`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ reply }),
    });
    return res.json();
  },

  getAllLeaves: async () => {
    const res = await fetch(`${API_BASE}/employees/leaves/all`, {
      headers: getHeaders(false),
    });
    return res.json();
  },

  updateLeaveStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/employees/leaves/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  generateLetter: async (employeeId, letterData) => {
    const res = await fetch(`${API_BASE}/employees/${employeeId}/letters`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(letterData),
    });
    return res.json();
  },

  toggleLetterAccess: async (employeeId, letterData) => {
    const res = await fetch(`${API_BASE}/employees/${employeeId}/letters/toggle-access`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(letterData),
    });
    return res.json();
  },

  publishNotice: async (noticeData) => {
    const res = await fetch(`${API_BASE}/employees/notices`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(noticeData),
    });
    return res.json();
  },

  deleteNotice: async (id) => {
    const res = await fetch(`${API_BASE}/employees/notices/${id}`, {
      method: 'DELETE',
      headers: getHeaders(false),
    });
    return res.json();
  },

  getAllAttendance: async () => {
    const res = await fetch(`${API_BASE}/employees/attendance/all`, {
      headers: getHeaders(false),
    });
    return res.json();
  },

  deleteAttendance: async (id) => {
    const res = await fetch(`${API_BASE}/employees/attendance/${id}`, {
      method: 'DELETE',
      headers: getHeaders(false),
    });
    return res.json();
  },

  cleanDuplicateAttendance: async () => {
    const res = await fetch(`${API_BASE}/employees/attendance/clean-duplicates`, {
      method: 'POST',
      headers: getHeaders(false),
    });
    return res.json();
  }
};

// ── Employee Portal Client Endpoints ────────────────────────────────
const getEmployeeHeaders = (isJson = true) => {
  const token = localStorage.getItem('employee_token');
  const headers = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const employeePortalApi = {
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/employee-portal/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/employee-portal/me`, {
      headers: getEmployeeHeaders(false),
    });
    return res.json();
  },

  updateProfile: async (profileData) => {
    const res = await fetch(`${API_BASE}/employee-portal/profile`, {
      method: 'POST',
      headers: getEmployeeHeaders(),
      body: JSON.stringify(profileData),
    });
    return res.json();
  },

  clockIn: async (notes = '') => {
    const res = await fetch(`${API_BASE}/employee-portal/clock-in`, {
      method: 'POST',
      headers: getEmployeeHeaders(),
      body: JSON.stringify({ notes }),
    });
    return res.json();
  },

  clockOut: async () => {
    const res = await fetch(`${API_BASE}/employee-portal/clock-out`, {
      method: 'POST',
      headers: getEmployeeHeaders(),
      body: JSON.stringify({}),
    });
    return res.json();
  },

  applyLeave: async (leaveData) => {
    const res = await fetch(`${API_BASE}/employee-portal/leaves`, {
      method: 'POST',
      headers: getEmployeeHeaders(),
      body: JSON.stringify(leaveData),
    });
    return res.json();
  },

  submitQuery: async (queryData) => {
    const res = await fetch(`${API_BASE}/employee-portal/queries`, {
      method: 'POST',
      headers: getEmployeeHeaders(),
      body: JSON.stringify(queryData),
    });
    return res.json();
  },

  submitDwr: async (dwrData) => {
    const res = await fetch(`${API_BASE}/employee-portal/dwr`, {
      method: 'POST',
      headers: getEmployeeHeaders(),
      body: JSON.stringify(dwrData),
    });
    return res.json();
  },

  logout: () => {
    localStorage.removeItem('employee_token');
    localStorage.removeItem('employee_name');
  }
};

export const clientServicesApi = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/client-services`, {
      headers: getHeaders(false),
    });
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_BASE}/client-services`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_BASE}/client-services/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE}/client-services/${id}`, {
      method: 'DELETE',
      headers: getHeaders(false),
    });
    return res.json();
  },

  sendAlert: async (id) => {
    const res = await fetch(`${API_BASE}/client-services/send-alert/${id}`, {
      method: 'POST',
      headers: getHeaders(false),
    });
    return res.json();
  },

  autoLookup: async (domain) => {
    const res = await fetch(`${API_BASE}/client-services/auto-lookup`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ domain }),
    });
    return res.json();
  }
};