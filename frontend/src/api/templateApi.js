import axiosClient from './axiosClient'

export const templateApi = {
  list: (params = {}) => axiosClient.get('/templates', { params }),
  get: (id) => axiosClient.get(`/templates/${id}`),
  create: (data) => axiosClient.post('/templates', data),
  update: (id, data) => axiosClient.put(`/templates/${id}`, data),
  remove: (id) => axiosClient.delete(`/templates/${id}`),
}