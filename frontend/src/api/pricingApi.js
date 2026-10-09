import axiosClient from './axiosClient'

export const pricingApi = {
  list: (params = {}) => axiosClient.get('/pricing', { params }),
  get: (id) => axiosClient.get(`/pricing/${id}`),
  create: (data) => axiosClient.post('/pricing', data),
  update: (id, data) => axiosClient.put(`/pricing/${id}`, data),
  remove: (id) => axiosClient.delete(`/pricing/${id}`),
}