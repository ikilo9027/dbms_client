import axios from 'axios'

const service = axios.create({
  // baseURL:"http://localhost:5555"
  baseURL: "http://localhost:5005"
})

service.interceptors.request.use((config) => {
  const accessToken = sessionStorage.getItem('accessToken')
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`
  } else {
    config.headers['Authorization'] = 'None'
  }
  return config
}, async (err) => {
  return Promise.reject(err)
})

export default service