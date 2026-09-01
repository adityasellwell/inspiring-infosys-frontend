// API client layer for Inspiring Infosys CMS & Leads
const API_BASE = 'http://localhost:3001/api';

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
// ── Employee Endpoints ─────────────────────────────────────────────
export const employeesApi = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/employees`, {
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

  delete: async (id) => {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'DELETE',
      headers: getHeaders(false),
    });
    return res.json();
  }
};