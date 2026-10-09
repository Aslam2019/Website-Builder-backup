import axiosClient from './axiosClient'

export const websiteApi = {
  list: (params = {}) => axiosClient.get('/websites', { params }),
  get: (id) => axiosClient.get(`/websites/${id}`),
  create: (data) => axiosClient.post('/websites', data),
  update: (id, data) => axiosClient.put(`/websites/${id}`, data),
  remove: (id) => axiosClient.delete(`/websites/${id}`),
}