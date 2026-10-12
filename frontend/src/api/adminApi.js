import axiosClient from './axiosClient'

export const adminApi = {
  // ============================================================
  // DASHBOARD
  // ============================================================
  dashboard: () => axiosClient.get('/admin/dashboard'),

  // ============================================================
  // USERS
  // ============================================================
  users: (params = {}) => axiosClient.get('/admin/users', { params }),
  activateUser:   (id) => axiosClient.put(`/admin/users/${id}/activate`),
  deactivateUser: (id) => axiosClient.put(`/admin/users/${id}/deactivate`),
  updateUser:     (id, data) => axiosClient.put(`/admin/users/${id}`, data),

  // ============================================================
  // WEBSITES / PAYMENTS / LOGS
  // ============================================================
  websites: () => axiosClient.get('/admin/websites'),
  payments: (params = {}) => axiosClient.get('/admin/payments', { params }),
  logs: (params = {}) => axiosClient.get('/admin/logs', { params }),

  // ============================================================
  // PROFILE
  // ============================================================
  updateProfile:  (data) => axiosClient.put('/admin/profile', data),
  changePassword: (data) => axiosClient.put('/admin/profile/password', data),

  // ============================================================
  // SITE SETTINGS (Logo + Name)
  // ============================================================
  getSiteSettings:    () => axiosClient.get('/settings/site'),
  updateSiteSettings: (data) => axiosClient.put('/settings/site', data),

  // ============================================================
  // TERMS & CONDITIONS
  // ============================================================
  // Admin routes
  getTerms:    ()           => axiosClient.get('/settings/admin/terms'),
  createTerm:  (data)       => axiosClient.post('/settings/admin/terms', data),
  updateTerm:  (id, data)   => axiosClient.put(`/settings/admin/terms/${id}`, data),
  deleteTerm:  (id)         => axiosClient.delete(`/settings/admin/terms/${id}`),

  // Public routes (footer + terms page)
  getPublicTerms: ()     => axiosClient.get('/settings/terms'),
  getTermBySlug:  (slug) => axiosClient.get(`/settings/terms/${slug}`),

  // ============================================================
  // ✅ PLANS — Feature Flags (NEW)
  // ============================================================
  getPlans: (params = {}) =>
    axiosClient.get('/pricing', { params }),

  getPlan: (planId) =>
    axiosClient.get(`/pricing/${planId}`),

  updatePlanFeatures: (planId, featureFlags) =>
    axiosClient.put(`/pricing/${planId}/features`, {
      feature_flags: featureFlags,
    }),
}