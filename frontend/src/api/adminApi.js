// import axiosClient from './axiosClient'

// export const adminApi = {
//   dashboard: () => axiosClient.get('/admin/dashboard'),
//   users: (params = {}) => axiosClient.get('/admin/users', { params }),
//   activateUser: (id) => axiosClient.put(`/admin/users/${id}/activate`),
//   deactivateUser: (id) => axiosClient.put(`/admin/users/${id}/deactivate`),
//   websites: () => axiosClient.get('/admin/websites'),
//   payments: (params = {}) => axiosClient.get('/admin/payments', { params }),
//   logs: (params = {}) => axiosClient.get('/admin/logs', { params }),
// }


import axiosClient from './axiosClient'

export const adminApi = {
  dashboard: () => axiosClient.get('/admin/dashboard'),
  users: (params = {}) => axiosClient.get('/admin/users', { params }),
  activateUser:   (id) => axiosClient.put(`/admin/users/${id}/activate`),
  deactivateUser: (id) => axiosClient.put(`/admin/users/${id}/deactivate`),
  updateUser: (id, data) => axiosClient.put(`/admin/users/${id}`, data),   // ✅ EDIT
  websites: () => axiosClient.get('/admin/websites'),
  payments: (params = {}) => axiosClient.get('/admin/payments', { params }),
  logs: (params = {}) => axiosClient.get('/admin/logs', { params }),
  updateProfile:  (data) => axiosClient.put('/admin/profile', data),
  changePassword: (data) => axiosClient.put('/admin/profile/password', data),
}