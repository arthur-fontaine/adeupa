import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  transformRequest: [(data, headers) => {
    if (localStorage.getItem('token')) {
      if (headers) {
        headers.Authorization = `Bearer ${localStorage.getItem('token')}`
      }
    }
  }],
})

export default axiosInstance
