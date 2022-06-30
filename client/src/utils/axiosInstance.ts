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

axiosInstance.interceptors.response.use((response) => response, async (error) => {
  if (error.config && error.response && error.response.status === 401) {
    localStorage.removeItem('token')

    const refreshToken = localStorage.getItem('refreshToken')

    if (refreshToken) {
      localStorage.setItem('token', (await axios.post('/sessions', { refreshToken })).data.token)
      return await axiosInstance.request(error.config)
    } else {
      window.location.href = '/'
    }
  }

  return Promise.reject(error)
})

export default axiosInstance
