import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  transformRequest: [(data, headers) => {
    if (localStorage.getItem('token')) {
      if (headers) {
        headers.Authorization = `Bearer ${localStorage.getItem('token')}`
      }
    }

    return data
  }, ...(axios.defaults.transformRequest ? typeof axios.defaults.transformRequest === 'function' ? [axios.defaults.transformRequest] : axios.defaults.transformRequest : [])],
})

export default axiosInstance
