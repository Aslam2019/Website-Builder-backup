import axiosClient from './axiosClient'

export const paymentApi = {
  dummyPay: (data) => axiosClient.post('/payments/dummy', data),
  list: (params = {}) => axiosClient.get('/payments', { params }),
  get: (id) => axiosClient.get(`/payments/${id}`),
}