import axiosClient from './axiosClient'

export const categoryApi = {
  list: (params = {}) => axiosClient.get('/categories', { params }),
  create: (data) => axiosClient.post('/categories', data),
  update: (id, data) => axiosClient.put(`/categories/${id}`, data),
  remove: (id) => axiosClient.delete(`/categories/${id}`),
}