import axiosClient from './axiosClient'

export const uploadApi = {
  uploadImage: (file, folder = 'gallery') => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', folder)
    return axiosClient.post('/uploads/image', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  uploadResume: (file) => {
    const fd = new FormData()
    fd.append('file', file)
    return axiosClient.post('/uploads/resume', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}