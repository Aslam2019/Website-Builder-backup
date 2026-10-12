// import axiosClient from './axiosClient'

// export const uploadApi = {
//   uploadImage: (file, folder = 'gallery') => {
//     const fd = new FormData()
//     fd.append('file', file)
//     fd.append('folder', folder)
//     return axiosClient.post('/uploads/image', fd, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     })
//   },
//   uploadResume: (file) => {
//     const fd = new FormData()
//     fd.append('file', file)
//     return axiosClient.post('/uploads/resume', fd, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     })
//   },
// }

import axiosClient from './axiosClient'

export const uploadApi = {
  uploadImage: (data, folder = 'gallery') => {
    let fd

    if (data instanceof FormData) {
      fd = data
      if (!fd.has('folder')) fd.append('folder', folder)
    } else {
      // ✅ Raw File — wrap it
      fd = new FormData()
      fd.append('file', data)
      fd.append('folder', folder)
    }

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