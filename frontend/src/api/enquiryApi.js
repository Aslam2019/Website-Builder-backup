import axiosClient from './axiosClient'

export const enquiryApi = {
  // Public
  submitCustomPlan: (data) =>
    axiosClient.post('/enquiries/custom-plan', data),

  // Admin
  list: (params = {}) =>
    axiosClient.get('/enquiries/admin/custom-plan', { params }),

  updateStatus: (id, status) =>
    axiosClient.put(`/enquiries/admin/custom-plan/${id}/status`, { status }),

  remove: (id) =>
    axiosClient.delete(`/enquiries/admin/custom-plan/${id}`),
}